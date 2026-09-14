"""Reproduce stage 1 assets: python -m pip install fonttools Brotli Pillow.

Original fonts/images remain untouched. Pass --har to refresh the reviewed image
input list; normal runs use the checked-in list and regenerate deterministic files.
"""
import argparse
from copy import deepcopy
from collections import Counter
from hashlib import sha256
import json
from pathlib import Path
from urllib.parse import unquote, urlparse
from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.ttLib import woff2
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[2]
CORE = ROOT / "apps/core"
GENERATED = CORE / "noname/util/generated"
INPUTS = Path(__file__).with_name("portrait-inputs.json")
# FontTools exposes no WOFF2 quality option. Keep its font transform and use
# Brotli quality 5 in this offline process to make full-cmap regeneration practical.
_compress = woff2.brotli.compress
woff2.brotli.compress = lambda data, **kwargs: _compress(data, **(kwargs | {"quality": 5}))


def write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def unicode_range(points):
    ranges = []
    for cp in sorted(points):
        if ranges and cp == ranges[-1][1] + 1:
            ranges[-1][1] = cp
        else:
            ranges.append([cp, cp])
    return ",".join(f"U+{a:X}" + (f"-{b:X}" if a != b else "") for a, b in ranges)


def fonts():
    # Frequent text from shipped UI/card/character code, not a hardcoded incomplete alphabet.
    frequency = Counter()
    for directory in ["noname", "character", "card", "mode"]:
        for file in sorted((CORE / directory).rglob("*")):
            if file.suffix in {".js", ".ts", ".vue"} and "generated" not in file.parts:
                frequency.update(ord(c) for c in file.read_text(encoding="utf-8") if ord(c) >= 0x3000)
    common = set(range(0x300)) | {cp for cp, _ in frequency.most_common(2048)}
    manifest, audit = {}, {}
    for family in ["xinwei", "shousha"]:
        original = CORE / f"font/{family}.woff2"
        original_font = TTFont(original, recalcTimestamp=False)
        original_font.ensureDecompiled()
        cmap = set(original_font.getBestCmap())
        rest = sorted(cmap - common)
        groups = [cmap & common] + [set(rest[i:i + 512]) for i in range(0, len(rest), 512)]
        manifest[family] = []
        coverage = set()
        output_bytes = 0
        for i, points in enumerate(groups):
            font = deepcopy(original_font)
            options = subset.Options()
            options.recalc_timestamp = False
            sub = subset.Subsetter(options=options)
            sub.populate(unicodes=points)
            sub.subset(font)
            assert set(font.getBestCmap()) == points
            assert not coverage & points
            coverage |= points
            # Hash of source plus codepoints prevents stale cached subsets after regeneration.
            key = sha256(original.read_bytes() + str(sorted(points)).encode()).hexdigest()[:12]
            name = f"font/subsets/{family}/{i:03}-{key}.woff2"
            destination = CORE / name
            destination.parent.mkdir(parents=True, exist_ok=True)
            font.save(destination)
            output_bytes += destination.stat().st_size
            manifest[family].append({"file": name, "range": unicode_range(points)})
            print(f"{family} chunk {i + 1}/{len(groups)}", flush=True)
        assert coverage == cmap, f"Lost characters in {family}"
        audit[family] = {"sourceSha256": sha256(original.read_bytes()).hexdigest(), "codepoints": len(cmap),
                         "chunks": len(groups), "sourceBytes": original.stat().st_size,
                         "subsetBytes": output_bytes, "commonBytes": (CORE / manifest[family][0]["file"]).stat().st_size}
        print(f"{family}: {len(cmap)} codepoints, {len(groups)} chunks", flush=True)
    write_json(GENERATED / "font-subsets.json", manifest)
    write_json(ROOT / "output/performance/assets/font-subsets-audit.json", audit)


def portraits(har):
    if har:
        inputs = set()
        for entry in json.loads(Path(har).read_text(encoding="utf-8"))["log"]["entries"]:
            name = unquote(urlparse(entry["request"]["url"]).path).lstrip("/")
            file = CORE / name
            if (name.startswith(("extension/", "image/character/")) and file.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}
                    and file.is_file() and file.stat().st_size > 256 * 1024):
                inputs.add(name)
        write_json(INPUTS, sorted(inputs))
    manifest = {}
    original_bytes = thumbnail_bytes = 0
    for name in json.loads(INPUTS.read_text(encoding="utf-8")):
        source = CORE / name
        key = sha256(source.read_bytes()).hexdigest()[:20]
        destination = f"thumbnail/portraits/{key}.webp"
        file = CORE / destination
        file.parent.mkdir(parents=True, exist_ok=True)
        with Image.open(source) as original:
            picture = ImageOps.exif_transpose(original).convert("RGBA" if "A" in original.getbands() else "RGB")
            # Keep composition/aspect ratio; CSS retains its original positioning/crop.
            picture.thumbnail((240, 360), Image.Resampling.LANCZOS)
            picture.save(file, "WEBP", quality=84, method=6)
        original_bytes += source.stat().st_size
        thumbnail_bytes += file.stat().st_size
        manifest[name] = destination
    write_json(GENERATED / "portrait-thumbnails.json", manifest)
    print(f"Portraits: {len(manifest)}, {original_bytes} -> {thumbnail_bytes} bytes", flush=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--har")
    parser.add_argument("--only", choices=["fonts", "portraits"])
    args = parser.parse_args()
    if args.only != "portraits":
        fonts()
    if args.only != "fonts":
        portraits(args.har)

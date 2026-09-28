// Character-runtime helpers retained from 云中守望 1.55.
import { lib, game, ui, get, ai, _status } from "noname";
export const swTool = {
extensionName: '云中守望',
extensionVersion: '1.0',
get URL() {
		return `extension_${this.extensionName}_`;
	},
get path() {
		return `extension/${this.extensionName}/`;
	},
get characterImageSrc() {
		return `${this.path}assets/character/`;
	},
get audioSrc() {
		return `ext:${this.extensionName}/assets/audio/`;
	},
playSkillVideo(name, time = 3000) {
		time += 300;
		if (!ui.skillVideo) {
			ui.skillVideo = ui.create.div("", ui.window, {
				position: "relative",
				zIndex: "100",
				width: "100%",
				height: "auto",
				aspectRatio: "667/205",
				top: "50%",
				transform: "translate(0%, -50%)",
				pointerEvents: "none",
			});
		}
		let nowVideo = Array.from({ length: 25 }, (_, i) => `${lib.assetURL}extension/${swTool.extensionName}/assets/animation/border/${i}.png`);
		const cycleVideo = Array.from({ length: 25 }, (_, i) => `${lib.assetURL}extension/${swTool.extensionName}/assets/animation/border/${i + 25}.png`);
		let currentFrame = 0;
		const img = document.createElement('img');
		img.style.width = "100%";
		img.style.height = "100%";
		img.style.zIndex = "10";
		img.style.position = "absolute";
		img.style.pointerEvents = "none";
		img.style.opacity = "0";
		img.src = nowVideo[currentFrame];
		ui.skillVideo.appendChild(img);

		const videoDiv = ui.create.div('', ui.skillVideo, {
			overflow: "hidden",
			width: "100%",
			height: "90%",
			top: "52%",
			transform: "translate(0%, -50%)",
			pointerEvents: "none",
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			opacity: 1,
			transition: "opacity 0.3s ease",
		})
		let finishReload = false;
		const video = document.createElement('video');
		video.src = `extension/${swTool.extensionName}/assets/animation/vedio/${name}.mp4`;
		video.controls = false;
		video.autoplay = true;
		video.style.width = '100%';
		video.style.height = 'auto';
		video.style.objectFit = 'cover';
		video.style.position = "absolute";
		video.style.opacity = "1";
		video.style.muted = true;
		video.playsInline = true;
		video.style.opacity = "0";
		video.style.transition = "opacity 0.3s ease";
		video.addEventListener('canplay', () => {
			video.style.opacity = "1";
			img.style.opacity = "1";
			finishReload = true;
		});
		// 调试事件
		video.onerror = (e) => console.error('视频加载失败', e);
		videoDiv.appendChild(video);

		const intervalId = setInterval(() => {
			if (!finishReload) return;
			currentFrame = (currentFrame + 1) % nowVideo.length;
			if (currentFrame === 0) nowVideo = cycleVideo;
			img.src = nowVideo[currentFrame];
		}, 33);

		const callback = () => {
			img.style.opacity = "0";
			videoDiv.style.opacity = "0";
			setTimeout(() => {
				clearInterval(intervalId);
				img.remove();
				videoDiv.remove();
			}, 300)
		}
		const intervalId2 = setTimeout(callback, time - 300);
		video.addEventListener('ended', () => {
			clearInterval(intervalId2);
			callback();
		});
	},
addGroup(id, short, name, config) {
		game.addGroup(id, short, name, config)
		lib.translate["group_" + id] = short + "势力"
	},
addNature(nature, translation, config, color, info) {
		game.addNature(nature, translation, config)
		//lib.inpile_nature.add(nature);
		if (info) lib.translate[`sha_nature_${nature}_info`] = info
		const style = document.createElement('style')
		style.innerHTML = `
			.player .identity[data-color="${nature}"],
			div[data-nature="${nature}"],
			span[data-nature="${nature}"] {
			text-shadow: black 0 0 1px,${color} 0 0 2px,${color} 0 0 5px,${color} 0 0 10px,
			${color} 0 0 10px
			}
			`
		document.head.appendChild(style)
	}
};

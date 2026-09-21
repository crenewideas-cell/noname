import { lib, game, ui, get, ai, _status } from "noname";
import { precontent } from "./main/precontent.js";
import { content } from "./main/content.js";
import { Package } from "./main/package.js";
import { config, help, files } from "./main/config.js";

let extensionPackage = {
    name: "梦澈涤花",
    editable: false,
    content: content,
    precontent: precontent,
    config: config,
    help: help,
    package: Package,
    files: files
}
export let type = "extension";
export default extensionPackage;
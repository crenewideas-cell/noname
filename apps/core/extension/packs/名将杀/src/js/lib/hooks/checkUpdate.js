import { lib, game, ui, get, ai, _status } from "noname";

const checkUpdate = {
	checkUpdate: [
        function changeGroup(player) {
            if (!lib.config["extension_名将杀_UI"]) {
                return;
            }
            var group = player.group;
            if (!group) {
                return;
            }
            if (player.name == "unknown") {
                group = "unknown";
            }
            game.broadcast(
                (player, group) => {
                    if (!player.node?.group) {
                        player.node.group = ui.create.div(".group", player.node.avater);
                        player.appendChild(player.node.group);
                    }
                    player.node.group.dataset.nature = group;
                    if (group == "feichu" || !player.group2) {
                        player.node.group.innerHTML = `<span>${get.translation(group)}</span>`;
                    } else {
                        player.node.group.innerHTML = `<span>${get.translation(group)}</span><span class="group2">${(player.group2 ? `${get.translation(player.group2)}` : "")}</span>`;
                    }
                    player.node.group.show();
                },
                player,
                group
            );
            if (!player.node?.group) {
                player.node.group = ui.create.div(".group", player.node.avater);
                player.appendChild(player.node.group);
            }
            player.node.group.dataset.nature = group;
            if (group == "feichu" || !player.group2) {
                player.node.group.innerHTML = `<span>${get.translation(group)}</span>`;
            } else {
                player.node.group.innerHTML = `<span>${get.translation(group)}</span><span class="group2">${(player.group2 ? `${get.translation(player.group2)}` : "")}</span>`;
            }
            player.node.group.show();
        },
		function viewHandcard(player) {
            if (!lib.config["extension_名将杀_UI"]) {
                return;
            }
            game.setSeatNumberOfPlayer(player);
            game.viewHandcardUptate(player);
        },
        function maxHandcardUpdate(player) {
            const max = player.storage.maxHandcard;
            player.setStorage("maxHandcard", player.getHandcardLimit());
            if (max != player.getHandcardLimit()) {
                const next = game.createEvent("maxHandcardChange");
                next.player = player;
                next.setContent("emptyEvent");
            }
        },
        function getShaUsable(player) {
            if (!lib.config["extension_名将杀_getShaUsable"]) {
                return;
            }
            if (!player.isPhaseUsing()) {
                return;
            }
            var num = player.getCardUsable("sha");
            if (num >= 114514) num = "∞";
            player.node.getShaUsable.innerHTML = num.toString();
        },
	],
};
export default checkUpdate;


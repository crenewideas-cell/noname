// Extracted from character/mouding.js; legacy startup and engine/UI patches are not executed.
export default function(lib, game, ui, get, ai, _status) {
return {
"character": {
            mdtx_zhouyu: ['male', 'wu', 4, ['mdtxronghuo', 'mdtxyingmou'], ['transform:[mdtx_zhouyu,mdtx_zhouyu2]']],
            mdtx_lusu: ['male', 'wu', 3, ['mdtxmingshi', 'mdtxmengmou'], ['transform:[mdtx_lusu,mdtx_lusu2]']],
            mdtx_simayi: ['male', 'wei', 3, ['mdtxpingliao', 'mdtxquanmou'], ['transform:[mdtx_simayi,mdtx_simayi2]']],
            mdtx_jiaxu: ['male', 'qun', 3, ['mdtxsushen', 'mdtxfumou'], ['transform:[mdtx_jiaxu,mdtx_jiaxu2]']],
            mdtx_guojia: ['male', 'wei', 3, ['mdtxlunshi', 'mdtxxianmou'], ['transform:[mdtx_guojia,mdtx_guojia2']],
            dc_simashi: ['male', 'wei', 3, ['dcsanshi', 'dczhenrao', 'dcchenlue']],
            dc_jiangji: ['male', 'wei', 3, ['mdtxshiju', 'mdtxyingshi']],
            mdtx_guanping: ['male', 'shu', 4, ['mdtxwuwei']],
            mdtx_zhugejin: ['male', 'wu', 3, ['mdtxtaozhou', 'mdtxhoude']],
            mdtx_caoang: ['male', 'wei', 4, ['mdtxfengmin', 'mdtxzhiwang']],
            mdtx_dianwei: ['male', 'wei', '4/5', ['mdtxkuangzhan', 'mdtxkangyong']],
            mdtx_zhangxiu: ['male', 'qun', 4, ['mdtxfuxi', 'mdtxhaoyi']],
            mdtx_chengyu: ['male', 'wei', 3, ['mdtxshizha', 'mdtxgaojian']],
            mdtx_jushou: ['male', 'qun', 3, ['mdtxzuojun', 'mdtxmuwang']],
            mdtx_hucheer: ['male', 'qun', 4, ['mdtxkongwu']],
            mdtx_chenlin: ['male', 'qun', 4, ['mdtxyaozuo', 'mdtxzhuanwen']],
        },
"characterSort": {
            mouding: {
                mouding_mdtx: ['mdtx_zhouyu', 'mdtx_lusu', 'mdtx_simayi', 'mdtx_jiaxu', 'mdtx_guojia'],
                mouding_zhonghu: [ 'dc_simashi', 'dc_jiangji'],
                mouding_zijing: ['mdtx_zhugejin', 'mdtx_guanping'],
                mouding_dushi: ['mdtx_caoang', 'mdtx_dianwei', 'mdtx_zhangxiu', 'mdtx_hucheer'],
                mouding_zhoulang: ['mdtx_chengyu'],
                mouding_qizuo: ['mdtx_jushou', 'mdtx_chenlin'],
            }
        },
"characterIntro": {
            mdtx_zhugejin: '时曹操兵败赤壁，刘备领兵入川，留关羽、诸葛亮驻守荆州。<br>孙权忌惮刘备起势，想讨回荆州，张昭向孙权献计软禁诸葛瑾的家人，命诸葛瑾赴成都讨要，诸葛亮设计使诸葛瑾来回奔波却始终无获而回。<br>后诸葛瑾献计请求以孙权世子向关羽女儿求婚，事成则与关羽计议共破曹操，不成则助曹取荆州。孙权于是派遣诸葛瑾为使前赴荆州，但诸葛瑾来到荆州向关羽说明来意后被其怒斥，关羽以一句“吾虎女安肯嫁犬子乎！不看汝弟之面，立斩汝首！再休多言！”将诸葛瑾逐出。',
            mdtx_zhouyu2: '字公瑾，庐江舒县人，任东吴三军大都督，雄姿英发，人称“美周郎”。赤壁之战前，巧用反间计杀了精通水战的叛将蔡瑁、张允。',
            mdtx_lusu2: '字子敬，汉族，临淮东城人，中国东汉末年东吴的著名军事统帅。他曾为孙权提出鼎足江东的战略规划，因此得到孙权的赏识，于周瑜死后代替周瑜领兵，守陆口。曾单刀赴会关羽于荆州。',
            mdtx_simayi2: '晋宣帝，字仲达，河内温人。曾任职过曹魏的大都督，太尉，太傅。少有奇节，聪明多大略，博学洽闻，伏膺儒教，世之鬼才也。',
        },
"characterPrefix": {
            mdtx_zhouyu2: '谋',
            mdtx_lusu2: '谋',
            mdtx_simayi2: '谋',
            mdtx_jiaxu2: '谋',
            mdtx_guojia2: '谋',
        },
"dynamicTranslate": {
            mdtxyingmou: function (player) {
                if (player.storage.mdtxyingmou == true) return '转换技，每回合限一次，你使用牌指定其他角色结算后可选择其中一个目标，阳：令手牌数最多的一名角色对其使用手牌中所有〖伤害〗牌，若无则该角色将手牌弃至与你相同；<span class="bluetext">阴：你将手牌摸至与其相同，然后视为对其使用一张【火攻】（至多摸五张）。</span>';
                return '转换技，每回合限一次，你使用牌指定其他角色结算后可选择其中一个目标，<span class="bluetext">阳：令手牌数最多的一名角色对其使用手牌中所有〖伤害〗牌，若无则该角色将手牌弃至与你相同；</span>阴：你将手牌摸至与其相同，然后视为对其使用一张【火攻】（至多摸五张）。';
            },
            mdtxmengmou: function (player) {
                if (player.storage.mdtxmengmou == true) return '转换技，每回合各限一次，当你获得其他角色或其他角色获得你的手牌后，你可以令该角色，阳：使用' + get.cnNumber(player.hp) + '张【杀】，且每造成1点伤害便回复1点体力；<span class="bluetext">阴：打出' + get.cnNumber(player.hp) + '张【杀】，且每少打出1张便失去1点体力。</span>';
                return '转换技，每回合各限一次，当你获得其他角色或其他角色获得你的手牌后，你可以令该角色，<span class="bluetext">阳：使用 ' + get.cnNumber(player.hp) + '张【杀】，且每造成1点伤害便回复1点体力；</span>阴：打出' + get.cnNumber(player.hp) + '张【杀】，且每少打出1张便失去1点体力。';
            },
            mdtxquanmou: function (player) {
                if (player.storage.mdtxquanmou == true) return '转换技，出牌阶段每名角色限一次，你可以令攻击范围内一名其他角色交给你一张牌，阳：防止你此阶段下次对其造成的伤害；<span class="bluetext">阴：此阶段你下次对其造成伤害后，可以对至多三名其他角色各造成1点伤害。</span>';
                return '转换技，出牌阶段每名角色限一次，你可以令攻击范围内一名其他角色交给你一张牌，<span class="bluetext">阳：防止你此阶段下次对其造成的伤害;</span>阴：此阶段你下次对其造成伤害后，可以对至多三名其他角色各造成1点伤害。';
            },
            mdtxfumou: function (player) {
                if (player.storage.mdtxfumou == true) return '转换技，出牌阶段限一次，你可以观看一名其他角色所有手牌并展示至多一半数量（向上取整）张，阳：令另一名其他角色获得展示牌，然后你与失去牌的角色各摸等量张牌；<span class="bluetext">阴：令其依次使用展示牌（无距离限制且不可响应）。</span>';
                return '转换技，出牌阶段限一次，你可以观看一名其他角色所有手牌并展示至多一半数量（向上取整）张，<span class="bluetext">阳：令另一名其他角色获得展示牌，然后你与失去牌的角色各摸等量张牌；</span>阴：令其依次使用展示牌（无距离限制且不可响应）。';
            },
            mdtxxianmou: function (player) {
                if (player.storage.mdtxxianmou == true) return '一名角色的回合结束时，若你本回合失去过牌，阳：你可以观看牌堆顶的五张牌并获得其中的任意张牌，若获得的牌数小于X，你视为拥有技能“遗计”直到你下一次转换至此状态；<span class="bluetext">阴：你可以观看一名角色的手牌并弃置其中的任意张牌（至多X张），若弃置的牌数等于X，你执行一次【闪电】判定（X为你本回合失去的牌数）。</span>';
                return '一名角色的回合结束时，若你本回合失去过牌，<span class="bluetext">阳：你可以观看牌堆顶的五张牌并获得其中的任意张牌（至多X张），若获得的牌数小于X，你视为拥有技能“遗计”直到你下一次转换至此状态；</span>阴：你可以观看一名角色的手牌并弃置其中的任意张牌（至多X张），若弃置的牌数等于X，你执行一次【闪电】判定（X为你本回合失去的牌数）。';
            },
            mdtxkongwu: function (player) {
                if (player.storage.mdtxkongwu == true) return '转换技，出牌阶段限一次，你可以弃置至多体力上限数张牌，并选择一名其他角色，阳：你弃置该角色的至多等量张牌；<span class="bluetext">阴：你视为对其使用等量张【杀】。</span>然后此阶段结束时，若该角色的手牌数与体力值均不大于你，其于其下个回合内：装备区内的牌失效，摸牌阶段少摸一张牌。';
                return '转换技，出牌阶段限一次，你可以弃置至多体力上限数张牌，并选择一名其他角色，<span class="bluetext">阳：你弃置该角色的至多等量张牌；</span>阴：你视为对其使用等量张【杀】。然后此阶段结束时，若该角色的手牌数与体力值均不大于你，其于其下个回合内：装备区内的牌失效，摸牌阶段少摸一张牌。';
            },
        },
"translate": {
            mdtx_zhouyu: '谋周瑜',
            mdtx_zhouyu2: '谋周瑜',
            mdtx_lusu: '谋鲁肃',
            mdtx_lusu2: '谋鲁肃',
            mdtxronghuo: '融火',
            mdtxronghuo_info: '锁定技，你使用的火【杀】或【火攻】的伤害值改为X（X为势力数）。',
            mdtxyingmou: '英谋',
            mdtxyingmou_info: '转换技，每名角色的回合限一次，当你对其他角色使用牌后，你可以选择其中一个目标，阳：你摸牌至与其相同（至多摸五张），然后视为对其使用一张【火攻】；阴：令手牌数最多的一名角色对其使用手牌中所有的伤害类牌，若无则该角色将手牌弃至与你相同。',
            mdtxmingshi: '明势',
            mdtxmingshi_info: '摸牌阶段，你可以多摸两张牌，然后展示三张手牌并令一名其他角色获得其中一张。',
            mdtxmengmou: '盟谋',
            mdtxmengmou_info: '转换技，每回合各限一次，当你获得其他角色或其他角色获得你的手牌后，你可以令该角色：阳：使用X张【杀】，每造成1点伤害便回复1点体力；阴：打出X张【杀】，每少打出1张便失去1点体力。（X为你的体力上限）',
            mdtx_simayi: '谋司马懿',
            mdtx_simayi2: '谋司马懿',
            mdtxpingliao: '平辽',
            mdtxpingliao_info: '锁定技，当你使用【杀】指定目标时，不公开指定的目标。你攻击范围内的其他角色同时选择是否打出一张红色基本牌。若此【杀】的目标未打出基本牌，其本回合无法使用或打出手牌；若有至少一名非目标打出基本牌，你摸两张牌且此阶段出【杀】次数+1。',
            mdtxquanmou: '权谋',
            mdtxquanmou_info: '转换技，出牌阶段每名角色限一次，你可以令攻击范围内一名其他角色交给你一张牌，阳:防止你此阶段下次对其造成的伤害；阴:此阶段你下次对其造成伤害后，可以对至多三名其他角色(该角色除外)各造成1点伤害。',
            dc_wangling: '谋王凌',
            dcjichou: '集筹',
            dcjichou_info: '结束阶段，若你本回合使用的牌名均不同，你可以从弃牌堆中将这些牌交给任意名角色各一张，然后你摸X张牌（X是其中此前没有因此给出过的牌名张数）。',
            dcmouli: '谋立',
            dcmouli_info: '觉醒技，回合结束时，若你因“集筹”给出的牌名不同的牌至少有5种，你加1点体力上限并回复1点体力，然后获得“自缚”。',
            dczifu: '自缚',
            dczifu_info: '锁定技，出牌阶段开始时，你将手牌摸至体力上限（最多摸至5张）。若你因此摸牌，你保留手牌中牌名不同的牌各一张，然后弃置其余手牌。',
            dc_simashi: '谋司马师',
            dcsanshi: '散士',
            dcsanshix: '死士',
            dcsanshi_info: '锁定技，第一轮游戏开始时，你将牌堆中每个点数的随机一张牌标记为“死士”牌。每个回合结束时，若本回合有“死士”牌不因你使用或打出而进入弃牌堆，你获得弃牌堆中的这些牌。你使用“死士”牌不能被响应。',
            dczhenrao: '震扰',
            dczhenrao_info: '每回合每名角色限一次，你使用牌指定其他角色为目标后，或其他角色使用牌指定你为目标后，你可以选择手牌数大于你的其中一个目标或使用者，对其造成1点伤害。',
            dcchenlue: '沉略',
            dcchenluex: '沉略',
            dcchenlue_info: '限定技，出牌阶段，你可以从牌堆、弃牌堆、场上或其他角色手牌中获得所有“死士”牌。出牌阶段结束时，将这些牌移出游戏直到你死亡。',
            dc_caoshuang: '谋曹爽',
            dcjianzhuan: '渐专',
            dcjianzhuan_info: '锁定技，出牌阶段每项限一次，当你使用牌时，你选择一项：1.令一名角色弃置X张牌；2.摸X张牌；3.重铸X张牌；4.弃置X张牌（X为此技能本阶段发动次数）。出牌阶段结束时，若本阶段所有选项均执行过，随机删去一个选项。',
            dcfanshi: '返势',
            dcfanshi_info: '觉醒技，结束阶段，若“渐专”只有一个选项，你执行三次X视为1的该选项，加2点体力上限并回复2点体力，然后失去“渐专”，获得“覆斗”。',
            dcfudou: '覆斗',
            dcfudou_info: '当你使用黑色牌指定其他角色为唯一目标后，若其本局对你造成过伤害，你可以与其各失去1点体力。当你使用红色牌指定其他角色为唯一目标后，若其本局未对你造成过伤害，你可以与其各摸一张牌。',
            mdtx_zhugejin: '谋诸葛瑾',
            mdtxtaozhou: '讨州',
            mdtxtaozhou_info: '出牌阶段，选择一名有手牌的其他角色并秘密选择1-3中一个数字，此技能失效至对应轮数后恢复，其可交予你至多三张手牌，若其交予你手牌数大于等于所选数字，则你与其各摸一张牌；若你所选数字更大，其下X次受到的伤害+1（X为两者差值），若X≥2，则其获得“自矜”。',
            mdtxhoude: '厚德',
            mdtxhoude_info: '其他角色的出牌阶段，你首次成为红色【杀】目标后，可以弃置一张牌令此牌对你无效；你首次成为黑色普通锦囊牌目标后，可以弃置其一张牌令此牌对你无效。',
            mdtxzijin: '自矜',
            mdtxzijin_info: '锁定技，当你使用牌后，若此牌未造成伤害，需弃置一张牌或失去一点体力。',
            mdtx_dianwei: '谋典韦',
            mdtxkuangzhan: '狂战',
            mdtxkuangzhan_info: '出牌阶段限一次，你可以将手牌摸至体力上限并进行X次拼点。若你赢，你视为对所有本回合拼点未赢的其他角色使用一张【杀】；若你未赢，视为其对你使用一张【杀】。（X为你以此法获得的牌数）',
            mdtxkangyong: '亢勇',
            mdtxkangyong_info: '锁定技，回合开始时，你回满体力；回合结束时，你失去等量体力（至少保留1点）。',
            mdtx_jiaxu: '谋贾诩',
            mdtx_jiaxu2: '谋贾诩',
            mdtxsushen: '肃身',
            mdtxsushen_info: '限定技，出牌阶段，你可以记录你当前〖覆谋〗的状态、你的手牌数和你的体力值，然后获得技能〖入世〗。',
            mdtxrushi: '入世',
            mdtxrushi_info: '限定技，出牌阶段，你可以将你当前〖覆谋〗的状态、你的手牌数和你的体力值调整为你发动〖肃身〗时的记录，然后重置〖覆谋〗的发动次数。',
            mdtxfumou: '覆谋',
            mdtxfumou_info: '转换技，出牌阶段限一次，你可以观看一名其他角色所有手牌并展示至多一半数量（向上取整）张，阳：令另一名其他角色获得展示牌，然后你与失去牌的角色各摸等量张牌；阴：令其依次使用展示牌（无距离限制且不可响应）。',
            mdtx_guanping: '谋关平',
            mdtxwuwei: '武威',
            mdtxwuwei_info: '出牌阶段限一次，你可以将一种颜色的所有手牌当作无距离和次数限制的【杀】使用，然后你选择X次执行以下项（X为转化为此【杀】的牌的类别数）：①摸一张牌；②令目标角色本回合非锁定技失效；③令本回合〖武威〗可发动次数+1。然后若你选择了所有项，则此【杀】造成的伤害+1。',
            dc_jiangji: '谋蒋济',
            mdtxshiju: '势举',
            mdtxshiju_info: '其他角色的出牌阶段限一次。其可以交给你一张牌，若此牌为装备牌，你可以使用之，然后其本回合攻击范围+X（X为你装备区里的牌数）。若你以此法替换了装备，你与其各摸两张牌。',
            mdtxyingshi: '应时',
            mdtxyingshi_info: '当你使用普通锦囊牌指定目标后，你可以令一名目标角色选择一项：1.令此牌对其额外结算一次；2.弃置X张牌（X为你装备区里的牌数），然后此技能本回合失效。',
            mdtx_zhangxiu: '谋张绣',
            mdtxfuxi: '附袭',
            mdtxfuxi_info: '其他角色的出牌阶段开始时，若其手牌数为全场最多，则你可以选择一项：①交给其一张牌，然后摸两张牌；②弃置其一张牌，然后视为对其使用一张【杀】。',
            mdtxhaoyi: '豪义',
            mdtxhaoyi_info: '结束阶段，你可以获得本回合进入弃牌堆的所有未造成过伤害的伤害牌，然后你可以将这些牌任意分配给其他角色。',
            mdtx_chengyu: '谋程昱',
            mdtxshizha: '识诈',
            mdtxshizha_info: '每回合限一次，其他角色使用牌时，若此牌是其本回合体力变化后使用的首张牌，你可令此牌无效并获得此牌。',
            mdtxgaojian: '告谏',
            mdtxgaojian_info: '出牌阶段，你使用锦囊牌结算完成进入弃牌堆后，可以选择一名其他角色。其依次展示牌堆顶的牌直到出现锦囊牌（至多展示五张），然后选择一项：1.使用此牌，2.用任意张手牌与等量展示牌交换。',
            mdtxgaojian_tag: '手牌',
            mdtx_jushou: '谋沮授',
            mdtxzuojun: '佐军',
            mdtxzuojun_info: '出牌阶段限一次，你可以令一名角色摸三张牌并令其选择一项：1.直到其下个回合结束，其不能使用这些牌且这些牌不计入手牌上限；2.失去1点体力，摸一张牌并使用因此获得的任意张牌，然后弃置其余牌。',
            mdtxmuwang: '暮往',
            mdtxmuwang_info: '锁定技，当你每回合首次失去的基本牌或普通锦囊牌进入弃牌堆时，你获得之。当你本回合再次失去这些牌后，你弃置一张牌。',
            mdtx_hucheer: '谋胡车儿',
            mdtxkongwu: '孔武',
            mdtxkongwu_info: '转换技，出牌阶段限一次，你可以弃置至多体力上限数张牌，并选择一名其他角色，阳：你弃置该角色的至多等量张牌；阴：你视为对其使用等量张【杀】。然后此阶段结束时，若该角色的手牌数与体力值均不大于你，其于其下个回合内：装备区内的牌失效，摸牌阶段少摸一张牌。',
            mdtx_guojia: '谋郭嘉',
            mdtx_guojia2: '谋郭嘉',
            mdtxlunshi: '论势',
            mdtxlunshi_info: '当一名角色使用的普通锦囊牌即将对除其以外的目标角色生效时，若你的黑色手牌数等于红色手牌数，你可以将一张手牌当不能被响应的【无懈可击】使用。',
            mdtxxianmou: '先谋',
            mdtxxianmou_info: '一名角色的回合结束时，若你本回合失去过牌，阳：你可以观看牌堆顶的五张牌并获得其中的任意张牌（至多X张），若获得的牌数小于X，你视为拥有技能“遗计”直到你下一次转换至此状态；阴：你可以观看一名角色的手牌并弃置其中的任意张牌（至多X张），若弃置的牌数等于X，你执行一次【闪电】判定（X为你本回合失去的牌数）。',
            mdtx_caoang: '谋曹昂',
            mdtxfengmin: '丰愍',
            mdtxfengmin_info: '锁定技，当一名角色于其回合内失去装备区里的牌后，你摸等同于其空置装备栏数的牌，然后若本回合你发动〖丰愍〗的次数大于你已损失的体力值，〖丰愍〗于本回合失效。',
            mdtxzhiwang: '质亡',
            mdtxzhiwang_info: '每回合限一次，当你因受到牌造成的伤害进入濒死状态时，你可以将此伤害改为无来源并选择一名其他角色，其于本回合结束时可以使用本回合令你进入濒死状态的牌。',
            mdtx_chenlin: '谋陈琳',
            mdtxyaozuo: '邀作',
            mdtxyaozuo_info: '出牌阶段限一次，你可以令所有其他角色同时选择是否交给你一张牌。选择不交给你牌的角色本回合下一次受到你造成的伤害+1。第一个选择交给你牌的角色选择另一名其他角色，你对其选择的角色发动一次“撰文”。',
            mdtxzhuanwen: '撰文',
	        mdtxzhuanwen_info: '结束阶段，你可选择一名其他角色，展示牌堆顶X张牌并选择一项：1.对其使用其中的伤害牌；2.令其获得其中的非伤害牌。然后将剩余牌置于牌堆顶（X为其手牌数且至多为5）。',

            mouding_mdtx: '谋定天下',
            mouding_zhonghu: '冢虎狼顾',
            mouding_zijing: '子敬邀刀',
            mouding_dushi: '毒士鸩计',
            mouding_zhoulang: '周郎将计',
            mouding_qizuo: '奇佐论胜',
        },
"skill": {
            //谋陈琳
            mdtxyaozuo: {
                audio: 2,
                enable: 'phaseUse',
                usable: 1,
                content: function() {
                    'step 0'
                    ui.timer.show();
                    game.countDown(15, function() {
                        ui.timer.hide();
                    });

                    async function executeTask(target) {
                        game.pause();
                        if (target !== game.me) {
                            return new Promise((resolve) => {
                                const executionTime = Math.floor(Math.random() * 13000) + 2000;
                                setTimeout(() => {
                                    let card = null,
                                        bool = false;
                                    if (get.attitude(target, player) > 0 && target.countCards('h') > (target.hp / 2)) {
                                        card = target.getCards('h').randomGet();
                                        bool = true;
                                        if (typeof target.ai.shown == 'number' && target.ai.shown < 0.95) {
                                            target.ai.shown += 0.3;
                                            if (target.ai.shown > 0.95) target.ai.shown = 0.95;
                                        }
                                    }
                                    resolve({
                                        target,
                                        card,
                                        bool,
                                        executionTime
                                    });
                                }, executionTime);
                            });
                        } else {
                            return new Promise((resolve) => {
                                var dialog = ui.create.dialog('请选择一张手牌');
                                game.me.getCards('h').forEach(c => c.classList.add('selectable'));

                                let card = null,
                                    bool = false,
                                    executionTime = 15000;
                                const startTime = Date.now();
                                let timeoutId;

                                function onClickCard(event) {
                                    clearTimeout(timeoutId); // 清除超时计时器
                                    card = event.currentTarget; // 当前点击的牌
                                    bool = true;
                                    executionTime = Math.min(15000, Date.now() - startTime);

                                    // 清理事件和类名
                                    game.me.getCards('h').forEach(c => {
                                        c.classList.remove('selectable');
                                        c.classList.remove('selected');
                                        c.removeEventListener('click', onClickCard);
                                    });
                                    ui.selected.cards = [];
                                    if (dialog) dialog.close();

                                    resolve({
                                        target,
                                        card,
                                        bool,
                                        executionTime
                                    });
                                }

                                game.me.getCards('h').forEach(c => {
                                    c.addEventListener('click', onClickCard);
                                });

                                timeoutId = setTimeout(() => {
                                    game.me.getCards('h').forEach(c => {
                                        c.classList.remove('selectable');
                                        c.classList.remove('selected');
                                        c.removeEventListener('click', onClickCard);
                                    });
                                    if (dialog) dialog.close();

                                    resolve({
                                        target,
                                        card,
                                        bool,
                                        executionTime
                                    });
                                }, 15000);
                            });
                        }
                    }

                    async function startTasks(list) {
                        const taskResults = [];
                        const tasks = list.map((person, index) =>
                            executeTask(person).then((taskResult) => {
                                if (taskResult.bool) {
                                    taskResult.target.$give(taskResult.card, player);
                                }
                                taskResults.push({
                                    ...taskResult,
                                    index
                                });
                                return taskResult;
                            })
                        );

                        try {
                            await Promise.all(tasks);
                            taskResults.sort((a, b) => a.executionTime - b.executionTime);
                            var map = new Map();
                            for (const task of taskResults) {
                                if (task.bool) {
                                    map.set(task.target, task.card);
                                }
                            }
                            game.resume();
                            event.map = map;
                            var next = game.createEvent('mdtxyaozuo_gain');
                            next.player = player;
                            next.map = map;
                            next.setContent(lib.skill.mdtxyaozuo.gain);
                        } catch (error) {
                            console.error("邀作报错:", error);
                            game.resume();
                        }
                    }
                    startTasks(game.players.slice().remove(player));

                },
                contentAfter: function() {
                    player.update();
                    game.me.update();
                },
                gain: function() {
                    'step 0'
                    event.provider = [];
                    'step 1'
                    if (event.map.size == 0) {
                        game.players.forEach(p => {
                            if (!event.provider.contains(p) && p != player) {
                                p.addTempSkill('mdtxyaozuo_damage');
                            }
                        })
                    } else {
                        target = event.map.keys().next().value;
                        event.provider.push(target);
                        card = event.map.get(target);
                        target.give(card, event.player, false).set('animate', null);
                        event.map.delete(target);
                        game.players.forEach(p => {
                            if (!event.provider.contains(p) && p != player) {
                                p.addTempSkill('mdtxyaozuo_damage');
                            }
                        })
                        target.chooseTarget("令" + get.translation(player) + "对一名其他角色发动〖撰文〗", true, function(card, player, target) {
                            return !_status.event.targets.includes(target);
                        }).set("targets", [target, player]).set("ai", target => {
                            const player = get.player(),
                                hs = target.countCards("h");
                            if (get.attitude(player, target) <= 0 && target.hp <= Math.floor(target.maxHp)) return hs * 2;
                            return hs;
                        });
                    }
                    'step 2'
                    if (result.bool) {
                        const targets = result.targets;
                        player.line(targets, "green");
                        player.useSkill("mdtxzhuanwen2", null, targets);
                    }
                },
                ai: {
                    order: 15,
                    result: {
                        player: 2.5,
                    }
                },
                subSkill: {
                    damage: {
                        forced: true,
                        charlotte: true,
                        onremove: true,
                        mark: true,
                        marktext: '邀作+1',
                        intro: {
                            content: '下一次受到的伤害+1',
                        },
                        trigger: {
                            player: 'damageBegin'
                        },
                        filter: function(event, player) {
                            return event.source && event.source == _status.currentPhase;
                        },
                        content: function() {
                            trigger.num++;
                            player.removeSkill('mdtxyaozuo_damage');
                        }
                    }
                }
            },
            mdtxzhuanwen: {
                audio: 2,
                trigger: {
                    player: "phaseJieshuBegin",
                },
                filter(event, player) {
                    return game.hasPlayer(current => current != player && current.countCards("h"));
                },
                content: function() {
                    'step 0'
                    player.chooseTarget(get.prompt2("mdtxzhuanwen"), function(card, player, target) {
                            return target != player && target.countCards("h");
                        })
                        .set("ai", target => {
                            const player = get.player(),
                                hs = target.countCards("h");
                            if (get.attitude(player, target) <= 0 && target.hp <= Math.floor(target.maxHp)) return hs * 2;
                            return hs;
                        });
                    'step 1'
                    if (result.bool) {
                        var target = result.targets[0];
                        event.target = target;
                        if (!target.countCards("h")) {
                            game.log(target, "没有手牌");
                            return;
                        }
                        var cards = game.cardsGotoOrdering(get.cards(Math.min(5, target.countCards("h")))).cards;
                        event.cards=cards;
                        player.showCards(cards, get.translation(player) + '发动了【撰文】');
                        var damages = cards.filter(card => get.tag(card, "damage") && player.canUse(card, target, false)),
                            nodamages = cards.filter(card => !get.tag(card, "damage"));
                        event.damages = damages;
                        event.nodamages = nodamages;
                        const list = [`依次对${get.translation(target)}使用${damages.length ? get.translation(damages) : "空气"}`, `令${get.translation(target)}获得${nodamages.length ? get.translation(nodamages) : "空气"}`];
                        player.chooseControl("使用伤害牌", "获得非伤害牌").set("choiceList", list).set("prompt", "撰文：请选择一项").set("effect", (function() {
                            let eff = 0;
                            for (let card of damages) eff += get.effect(target, card, player, player);
                            for (let card of nodamages) eff -= get.value(card, target) * get.attitude(player, target);
                            return eff;
                        })()).set("ai", () => {
                            if (_status.event.effect > 0) return "使用伤害牌";
                            return "获得非伤害牌";
                        });
                    }
                    'step 2'
                    if (result.control == "使用伤害牌") {
                        while (event.damages.length) {
                            var card = event.damages.shift();
                            player.chooseUseTarget(card, true, false, 'nodistance').set('filterTarget', function(card, player, target) {
                                var evt = _status.event;
                                if (_status.event.name == 'chooseTarget') evt = evt.getParent();
                                if (target != player && target != evt.mdtxzhuanwen_target) return false;
                                return lib.filter.targetEnabledx(card, player, target);
                            }).set('mdtxzhuanwen_target', target);
                            if (!event.damages.length) break;
                        }
                    } else {
                        event.cards.removeArray(event.nodamages);
                        target.gain(event.nodamages, "gain2");
                    }
                    event.cards.reverse();
                    for (var i = 0; i < event.cards.length; i++) {
                        event.cards[i].fix();
                        ui.cardPile.insertBefore(event.cards[i], ui.cardPile.firstChild);
                    }
                    player.popup(get.cnNumber(event.cards.length) + '上');
                    game.log(player, '将' + get.cnNumber(event.cards.length) + '张牌置于牌堆顶');
                    game.updateRoundNumber();
                    game.delayx();
                },
            },
            mdtxzhuanwen2: {
                audio: 'mdtxzhuanwen',
                enable: 'phaseUse',
                usable: 1,
                filterTarget: lib.filter.notMe,
                content: function() {
                    'step 0'
                    if (!target.countCards("h")) {
                        game.log(target, "没有手牌");
                        event.finish();
                        return;
                    }
                    var cards = game.cardsGotoOrdering(get.cards(Math.min(5, target.countCards("h")))).cards;
                    event.cards = cards;
                    player.showCards(cards, get.translation(player) + '发动了【撰文】');
                    var damages = cards.filter(card => get.tag(card, "damage") && player.canUse(card, target, false)),
                        nodamages = cards.filter(card => !get.tag(card, "damage"));
                    event.damages = damages;
                    event.nodamages = nodamages;
                    const list = [`依次对${get.translation(target)}使用${damages.length ? get.translation(damages) : "空气"}`, `令${get.translation(target)}获得${nodamages.length ? get.translation(nodamages) : "空气"}`];
                    player.chooseControl("使用伤害牌", "获得非伤害牌").set("choiceList", list).set("prompt", "撰文：请选择一项").set("effect", (function() {
                        let eff = 0;
                        for (let card of damages) eff += get.effect(target, card, player, player);
                        for (let card of nodamages) eff -= get.value(card, target) * get.attitude(player, target);
                        return eff;
                    })()).set("ai", () => {
                        if (_status.event.effect > 0) return "使用伤害牌";
                        return "获得非伤害牌";
                    });
                    'step 1'
                    if (result.control == "使用伤害牌") {
                        while (event.damages.length) {
                            var card = event.damages.shift();
                            player.chooseUseTarget(card, true, false, 'nodistance').set('filterTarget', function(card, player, target) {
                                var evt = _status.event;
                                if (_status.event.name == 'chooseTarget') evt = evt.getParent();
                                if (target != player && target != evt.mdtxzhuanwen2_target) return false;
                                return lib.filter.targetEnabledx(card, player, target);
                            }).set('mdtxzhuanwen2_target', target);
                            if (!event.damages.length) break;
                        }
                    } else {
                        event.cards.removeArray(event.nodamages);
                        target.gain(event.nodamages, "gain2");
                    }
                    event.cards.reverse();
                    for (var i = 0; i < event.cards.length; i++) {
                        event.cards[i].fix();
                        ui.cardPile.insertBefore(event.cards[i], ui.cardPile.firstChild);
                    }
                    player.popup(get.cnNumber(event.cards.length) + '上');
                    game.log(player, '将' + get.cnNumber(event.cards.length) + '张牌置于牌堆顶');
                    game.updateRoundNumber();
                    game.delayx();
                },
            },
            //谋曹昂
            mdtxfengmin: {
                audio: 2,
                trigger: {
                    global: ['loseAfter', 'equipAfter', 'addJudgeAfter', 'gainAfter', 'loseAsyncAfter', 'addToExpansionAfter']
                },
                forced: true,
                filter: function (event, player) {
                    var target = _status.currentPhase;
                    if (!target || !target.isIn() || ![...Array(5).keys()].map(i => i + 1).reduce((sum, i) => sum + (!target.getEquip(i) && !target.isDisabled(i)), 0) || player.hasSkill('mdtxfengmin_blocker')) return false;
                    var evt = event.getl(target);
                    return evt && evt.player == target && (evt.es || []).length;
                },
                logTarget: () => _status.currentPhase,
                content: function () {
                    var target = _status.currentPhase;
                    player.draw([...Array(5).keys()].map(i => i + 1).reduce((sum, i) => sum + (!target.getEquip(i) && !target.isDisabled(i)), 0));
                    if (player.getHistory('useSkill', evt => evt.skill == 'mdtxfengmin').length > player.getDamagedHp()) {
                        player.addTempSkill('mdtxfengmin_blocker');
                    }
                },
                intro: {
                    content: '本局游戏已发动过#次此技能'
                },
                subSkill: {
                    blocker: {
                        charlotte: true,
                    }
                },
            },
            mdtxzhiwang: {
                audio: 2,
                trigger: {
                    player: 'dying'
                },
                usable: 1,
                filter: function (event, player) {
                    var evt = event.getParent(), evtx = event.getParent(3);
                    if (!evt || evt.name != 'damage' || !evtx || evtx.name != 'useCard') return false;
                    return game.hasPlayer(target => target != player);
                },
                content: function () {
                    'step 0'
                    player.chooseTarget(get.prompt('mdtxzhiwang'), lib.filter.notMe).set('ai', target => {
                        var player = _status.event.player;
                        return get.attitude(player, target);
                    });
                    'step 1'
                    if (result.bool) {
                        var target = result.targets[0];
                        if (trigger.source) delete trigger.source;
                        if (trigger.getParent().source) delete trigger.getParent().source;
                        target.addTempSkill('mdtxzhiwang_effect');
                        target.markAuto('mdtxzhiwang_effect', [player]);
                        target.addToExpansion('gain2', trigger.parent.cards).gaintag.add('mdtxzhiwang');
                    }
                },
                marktext: '质亡',
                intro: {
                    content: 'expansion',
                    markcount: 'expansion',
                },
                subSkill: {
                    effect: {
                        trigger: {
                            global: 'phaseEnd'
                        },
                        charlotte: true,
                        forced: true,
                        popup: false,
                        onremove: true,
                        content: function () {
                            'step 0'
                            var cards = player.getExpansions('mdtxzhiwang');
                            if (cards.length) {
                                player.chooseButton(['使用这些牌', cards], true)
                            }
                            else {
                                event.finish();
                                if (cards.length) player.loseToDiscardpile(cards);
                            }
                            'step 1'
                            if (result.bool) {
                                var card = result.links[0];
                                player.$gain2(card, false);
                                game.delayx();
                                player.chooseUseTarget(card, true);
                            }
                            event.goto(0);
                        },
                    },
                },
            },
            //谋胡车儿
            mdtxkongwu: {
                audio: 2,
                enable: 'phaseUse',
                usable: 1,
                filterCard: true,
                selectCard: function () {
                    return [1, _status.event.player.maxHp];
                },
                position: 'he',
                zhuanhuanji: true,
                marktext: '☯',
                mark: true,
                intro: {
                    content: function (storage, player) {
                        return '出牌阶段限一次，你可以弃置至多体力上限张牌并选择一名其他角色，' + (storage ? '视为对其使用等量张【杀】' : '弃置其等量张牌。') + '若此阶段结束时其手牌数和体力值均不大于你，其下回合摸牌阶段少摸一张牌且装备技能失效。';
                    },
                },
                filterTarget: lib.filter.notMe,
                check: function (card) {
                    return 4 - get.value(card);
                },
                content: function () {
                    player.changeZhuanhuanji(event.name);
                    if (player.storage.mdtxkongwu) {
                        const num = Math.min(event.cards.length, event.target.countCards('he'));
                        if (num > 0) player.discardPlayerCard('he', event.target, true, num);
                    }
                    else {
                        let used = 0,
                            card = { name: 'sha', isCard: true };
                        while (used < event.cards.length && event.target.isIn() && player.canUse(card, event.target, false)) {
                            used++;
                            player.useCard(card, event.target, false);
                        }
                    }
                    player.storage.mdtxkongwu_compare = event.target;
                    player.addTempSkill('mdtxkongwu_compare');
                },
                getSkills: function (player) {
                    return player.getSkills().reduce((list, skill) => {
                        var info = get.info(skill);
                        if (info && info.equipSkill) return list.add(skill);
                        return list;
                    }, []);
                },
                subSkill: {
                    compare: {
                        trigger: {
                            player: 'phaseUseEnd'
                        },
                        forced: true,
                        popup: false,
                        charlotte: true,
                        content: function () {
                            var target = player.storage.mdtxkongwu_compare;
                            if (target.isIn() && target.hp <= player.hp && target.countCards('h') <= player.countCards('h')) {
                                player.line(target, 'green');
                                target.addTempSkill('mdtxkongwu_effect', { player: 'phaseEnd' });
                            }
                        },
                    },
                    effect: {
                        trigger: {
                            player: ['phaseDrawBegin', 'phaseBegin', 'equipAfter'],
                        },
                        direct: true,
                        forced: true,
                        charlotte: true,
                        filter: function (event, player) {
                            if (event.name == 'phaseDraw') return !event.numFixed;
                            return true;
                        },
                        content: function () {
                            if (trigger.name == 'phaseDraw') {
                                trigger.num--;
                                player.logSkill(event.name);
                            }
                            else player.disableSkill(event.name, lib.skill.mdtxkongwu.getSkills(player));
                        },
                        onremove: function (player, skill) {
                            player.enableSkill(skill);
                        },
                        mark: true,
                        marktext: '孔武',
                        intro: {
                            content: '摸牌阶段少摸一张牌，装备牌失效',
                        },
                        mod: {
                            attackRange: function (player, num) {
                                if (player != _status.currentPhase) return;
                                let numx = 0;
                                var equipList = player.getCards('e');
                                for (var i = 0; i < equipList.length; i++) {
                                    if (get.info(equipList[i]).subtype == 'equip1') {
                                        numx += get.info(equipList[i]).distance.attackFrom;
                                    }
                                }
                                return num - numx;
                            },
                            globalFrom: function (player, card, distance) {
                                if (player != _status.currentPhase) return;
                                let numx = 0;
                                var equipList = player.getCards('e');
                                for (var i = 0; i < equipList.length; i++) {
                                    if (get.info(equipList[i]).subtype == 'equip4') {
                                        numx += get.info(equipList[i]).distance.globalFrom;
                                    }
                                }
                                return distance - numx;
                            },
                            globalTo: function (player, card, distance) {
                                if (player != _status.currentPhase) return;
                                let numx = 0;
                                var equipList = player.getCards('e');
                                for (var i = 0; i < equipList.length; i++) {
                                    if (get.info(equipList[i]).subtype == 'equip3') {
                                        numx += get.info(equipList[i]).distance.globalTo;
                                    }
                                }
                                return distance - numx;
                            },
                        },
                    },
                },
                ai: {
                    order: 5,
                    result: {
                        target: -1,
                    },
                },
            },
            //谋郭嘉
            mdtxlunshi: {
                audio: 2,
                audioname: ['mdtx_guojia2'],
                enable: 'chooseToUse',
                position: 'hs',
                filter: function (event, player) {
                    if (!player.countCards('hs')) return false;
                    if (player.countCards("h", { color: 'black' }) != player.countCards('h', { color: 'red' })) return false;
                    if (event.type != 'wuxie') return false;
                    let info = event.info_map;
                    if (!info || get.type(info.card) != 'trick') return false;
                    return info.player != info.target;
                },
                filterCard: true,
                viewAs: {
                    name: 'wuxie',
                },
                viewAsFilter: function (player) {
                    if (!player.countCards('hs')) return false;
                    if (player.countCards('h', { color: 'black' }) != player.countCards('h', { color: 'red' })) return false;
                    return true;
                },
                prompt: '将一张手牌当无懈可击使用',
                check: function (card) {
                    return 8 - get.value(card);
                },
                group: 'mdtxlunshi_nowuxie',
                subSkill: {
                    nowuxie: {
                        trigger: {
                            player: 'useCard',
                        },
                        forced: true,
                        locked: false,
                        popup: false,
                        filter: function (event, player) {
                            return event.card.name == 'wuxie' && event.skill && event.skill == 'mdtxlunshi';
                        },
                        content: function () {
                            trigger.directHit.addArray(game.players);
                        },
                    },
                },
            },
            mdtxxianmou: {
                audio: 2,
                audioname: ['mdtx_guojia2'],
                owner: 'mdtx_guojia',
                zhuanhuanji: true,
                trigger: {
                    global: 'phaseEnd'
                },
                mark: true,
                marktext: "☯",
                intro: {
                    content: function (storage, player, skill) {
                        if (player.storage.mdtxxianmou == true) return '你失去过牌的回合结束时，你可以观看一名角色手牌并弃置其中至多X张牌，若弃置X张牌则你进行一次【闪电】判定（X为你本回合失去牌数）';
                        return '你失去过牌的回合结束时，你可以观看牌堆顶五张牌并获得至多X张牌，若未获得X张牌则获得〖遗计〗直到再发动此项（X为你本回合失去牌数）';
                    },
                },
                filter: function (event, player) {
                    return player.getHistory('lose', evt => evt.cards2 && evt.cards2.length).length;
                },
                content: function () {
                    'step 0'
                    event.num = 0;
                    player.getHistory('lose', evt => {
                        if (evt.cards2) event.num += evt.cards.length;
                    });
                    if (player.storage.mdtxxianmou == true) {
                        player.chooseTarget(get.prompt('mdtxxianmou'), `观看一名角色手牌并弃置其中至多${event.num}张牌`, function (card, player, target) {
                            return target.countCards('h');
                        }).set('ai', function (target) {
                            var player = _status.event.player;
                            return get.effect(target, { name: 'guohe_copy2' }, player, player);
                        });
                    } else {
                        player.chooseBool(get.prompt('mdtxxianmou'), `观看牌堆顶五张牌并获得至多${event.num}张牌`);
                    }
                    'step 1'
                    if (result.bool) {
                        player.changeZhuanhuanji('mdtxxianmou', null, player.storage.mdtxxianmou ? 0 : 1);
                        if (player.storage.mdtxxianmou == true) {
                            player.removeAdditionalSkill('mdtxxianmou');
                            event.cards = game.cardsGotoOrdering(get.cards(5)).cards;
                            player.chooseButton([`是否获得至多${event.num}张牌？`, event.cards], [1, event.num]).set('ai', button => {
                                if (ui.selected.buttons.length + 1 >= _status.event.maxNum) return 0;
                                return get.value(button.link);
                            }).set('maxNum', event.num);
                        } else {
                            var target = result.targets[0];
                            player.discardPlayerCard(target, 'h', `是否弃置${get.translation(target)}至多${event.num}张牌?`, [1, event.num], 'visible').set('ai', button => {
                                if (ui.selected.buttons.length + 1 >= _status.event.maxNum) return 5 - get.value(button.link);
                                return get.value(button.link);
                            }).set('maxNum', event.num);
                        }
                    } else event.finish();
                    'step 2'
                    if (player.storage.mdtxxianmou == true) {
                        if (result.bool) {
                            event.cards.removeArray(result.links);
                            player.gain(result.links, 'gain2');
                        }
                        while (event.cards.length) {
                            ui.cardPile.insertBefore(event.cards.pop().fix(), ui.cardPile.firstChild);
                        }
                        if (!result.bool || result.links.length < event.num) player.addAdditionalSkill('mdtxxianmou', 'new_reyiji');
                        event.finish();
                    } else {
                        if (result.bool && result.links.length >= event.num) {
                            event.judgestr = get.translation('shandian');
                            player.judge(lib.card.shandian.judge, event.judgestr).judge2 = lib.card.shandian.judge2;
                            game.delayx(1.5);
                        }
                    }
                    'step 3'
                    // 照抄族荀粲【伤身】判定流程
                    var name = 'shandian';
                    if (event.cancelled && !event.direct) {
                        if (lib.card[name].cancel) {
                            var next = game.createEvent(name + 'Cancel');
                            next.setContent(lib.card[name].cancel);
                            next.cards = [];
                            next.card = get.autoViewAs({ name: name });
                            next.player = player;
                        }
                    } else {
                        var next = game.createEvent(name);
                        next.setContent(function () {
                            if (result.bool == false) {
                                player.damage(3, 'thunder', 'nosource');
                            }
                        });
                        next._result = result;
                        next.cards = [];
                        next.card = get.autoViewAs({ name: name });
                        next.player = player;
                    }
                },
                derivation: 'new_reyiji',
                group: ['mdtxxianmou_change'],
                subSkill: {
                    change: {
                        trigger: {
                            global: 'phaseBefore',
                            player: 'enterGame',
                        },
                        direct: true,
                        filter: function (event, player) {
                            return event.name != 'phase' || game.phaseNumber == 0;
                        },
                        content: function () {
                            'step 0'
                            player.chooseControl('阳', '阴').set('prompt', '先谋：选择你的转换技初始状态');
                            'step 1'
                            if (result.control) {
                                if (result.index == 1) {
                                    player.changeZhuanhuanji('mdtxxianmou', null, 1);
                                }
                                event.finish();
                            }
                        },
                    },
                },
            },
            mdtxzuojun: {
                audio: 2,
                enable: 'phaseUse',
                usable: 1,
                filterTarget: true,
                content: function () {
                    'step 0'
                    target.draw(3).gaintag = ['mdtxzuojun'];
                    target.chooseControl('不能使用佐军牌', '立即使用佐军牌').set('prompt', get.translation(player) + "对你发动了佐军，请选择一项执行");
                    'step 1'
                    if (result.control == '不能使用佐军牌') {
                        target.addTempSkill('mdtxzuojun_jin', { player: 'phaseEnd' });
                        event.finish();
                    } else if (result.control == '立即使用佐军牌') {
                        target.loseHp();
                        target.draw(1).gaintag = ['mdtxzuojun'];
                    };
                    'step 2'
                    var list = [];
                    var hc = target.getCards('h');
                    for (var j = 0; j < hc.length; j++) {
                        if (hc[j].hasGaintag('mdtxzuojun')) list.push(hc[j]);
                    };
                    if (list.length > 0) {
                        target.chooseToUse(function (card, player, event) {
                            if (get.itemtype(card) != 'card' || !card.hasGaintag('mdtxzuojun')) return false;
                            return lib.filter.filterCard.apply(this, arguments);
                        }, "请选择是否使用一张佐军牌，若不使用则弃置剩余的佐军牌");
                    } else {
                        event.finish();
                    };
                    'step 3'
                    if (result.bool) {
                        event.goto(2);
                    } else {
                        var listx = [];
                        var hcx = target.getCards('h');
                        for (var j = 0; j < hcx.length; j++) {
                            if (hcx[j].hasGaintag('mdtxzuojun')) listx.push(hcx[j]);
                        };
                        target.discard(listx);
                    }
                },
                subSkill: {
                    jin: {
                        charlotte: true,
                        onremove: function (player) {
                            player.removeGaintag('mdtxzuojun');
                        },
                        mod: {
                            cardEnabled: function (card, player) {
                                if (get.itemtype(card) == 'card') {
                                    if (card.hasGaintag('mdtxzuojun')) return false;
                                }
                                else if (card.isCard && card.cards) {
                                    if (card.cards.some(card => card.hasGaintag('mdtxzuojun'))) return false;
                                }
                            },
                            cardSavable: function (card, player) {
                                if (get.itemtype(card) == 'card') {
                                    if (card.hasGaintag('mdtxzuojun')) return false;
                                }
                                else if (card.isCard && card.cards) {
                                    if (card.cards.some(card => card.hasGaintag('mdtxzuojun'))) return false;
                                }
                            },
                            ignoredHandcard: function (card, player) {
                                if (card.hasGaintag('mdtxzuojun')) return true;
                            },
                            cardDiscardable: function (card, player, name) {
                                if (name == 'phaseDiscard' && card.hasGaintag('mdtxzuojun')) return false;
                            },
                        },
                    },
                },
                ai: {
                    order: 10,
                    threaten: 4,
                    result: {
                        player: 1,
                        target: 1,
                    },
                },
            },
            mdtxmuwang: {
                audio: 2,
                trigger: {
                    player: 'loseAfter',
                    global: ['cardsDiscardAfter', 'loseAsyncAfter', 'equipAfter'],
                },
                usable: 1,
                filter: function (event, player) {
                    if (event.name != 'cardsDiscard') {
                        return event.getd(player, 'cards2').some(i => ['basic', 'trick'].includes(get.type(i)));
                    }
                    else {
                        if (!event.cards.filterInD('d').some(i => ['basic', 'trick'].includes(get.type(i)))) return false;
                        var evt = event.getParent();
                        if (evt.name != 'orderingDiscard') return false;
                        var evtx = (evt.relatedEvent || evt.getParent());
                        if (evtx.player != player) return false;
                        return player.hasHistory('lose', evtxx => {
                            return evtx == (evtxx.relatedEvent || evtxx.getParent()) && evtxx.cards2.length > 0;
                        });
                    }
                },
                forced: true,
                content: function () {
                    if (trigger.name != 'cardsDiscard') {
                        var cards = trigger.getd(player, 'cards2');
                    } else {
                        var cards = trigger.cards.filterInD('d');
                    };
                    if (cards.length) {
                        var next = player.gain(cards, 'gain2');
                        next.gaintag.add('mdtxmuwang');
                        player.addTempSkill('mdtxmuwang_lose');
                    }
                },
                subSkill: {
                    lose: {
                        onremove: function (player) {
                            player.removeGaintag('mdtxmuwang');
                        },
                        trigger: {
                            player: 'loseAfter',
                            global: ['equipAfter', 'addJudgeAfter', 'gainAfter', 'loseAsyncAfter', 'addToExpansionAfter'],
                        },
                        filter: function (event, player) {
                            if (!player.countCards('he')) return false;
                            var evt = event.getl(player);
                            if (!evt || !evt.cards2 || !evt.cards2.length) return false;
                            if (event.name == 'lose') {
                                return evt.cards2.some(card => (evt.gaintag_map[card.cardid] || []).includes('mdtxmuwang'));
                            }
                            return player.hasHistory('lose', evt => {
                                if (event != evt.getParent()) return false;
                                return evt.cards2.some(card => (evt.gaintag_map[card.cardid] || []).includes('mdtxmuwang'));
                            });
                        },
                        direct: true,
                        locked: true,
                        charlotte: true,
                        content: function () {
                            player.chooseToDiscard("发动〖暮往〗，选择弃置1张牌", 'he', 1, true);
                        },
                    },
                },
            },
            mdtxshizha: {
                audio: 2,
                trigger: {
                    global: 'useCard'
                },
                usable: 1,
                filter: function (event, player) {
                    return event.player != player && event.player.hasMark('mdtxshizha');
                },
                check: function (event, player) {
                    let eff = 0;
                    if (event.card.name == 'wuxie' || event.card.name == 'shan') {
                        if (get.attitude(player, event.player) < -1) {
                            eff = -1;
                        }
                    } else if (event.targets && event.targets.length) {
                        for (var i = 0; i < event.targets.length; i++) {
                            eff += get.effect(event.targets[i], event.card, event.player, player);
                        }
                    }
                    return eff <= 0;
                },
                logTarget: 'player',
                content: function () {
                    trigger.targets.length = 0;
                    trigger.all_excluded = true;
                    if (trigger.cards) {
                        player.gain(trigger.cards.filterInD(), 'gain2');
                    }
                },
                group: ['mdtxshizha_shizha', 'mdtxshizha_remove', 'mdtxshizha_remover'],
                subSkill: {
                    shizha: {
                        audio: 2,
                        trigger: { global: ['recoverEnd', 'damageEnd', 'loseHpEnd'] },
                        forced: true,
                        filter: function (event, player) {
                            return event.player != player && !event.player.hasMark('mdtxshizha');
                        },
                        content: function () {
                            if (trigger && trigger.player) {
                                trigger.player.addMark('mdtxshizha');
                            }
                        }
                    },
                    remove: {
                        trigger: {
                            global: 'useCardEnd'
                        },
                        forced: true,
                        popup: false,
                        filter: function (event, player) {
                            return event.player && event.player.hasMark('mdtxshizha');
                        },
                        content: function () {
                            trigger.player.removeMark('mdtxshizha');
                        }
                    },
                    remover: {
                        trigger: {
                            global: 'phaseEnd'
                        },
                        forced: true,
                        popup: false,
                        content: function () {
                            for (const i of game.filterPlayer().sortBySeat()) {
                                if (i.hasMark('mdtxshizha')) {
                                    i.removeMark('mdtxshizha');
                                }
                            }
                        }
                    },
                },
            },
            mdtxgaojian: {
                audio: 2,
                trigger: {
                    global: 'cardsDiscardAfter'
                },
                filter: function (event, player) {
                    if (!player.isPhaseUsing()) return false;
                    var evt = event.getParent();
                    if (evt.name != 'orderingDiscard') return false;
                    var evtx = evt.relatedEvent || evt.getParent();
                    return evtx.name == 'useCard' && evtx.player == player && get.type2(evtx.card) == 'trick';
                },
                content: function () {
                    'step 0'
                    player.chooseTarget(get.prompt2('mdtxgaojian'), lib.filter.notMe).set('ai', target => {
                        return get.attitude(_status.event.player, target);
                    });
                    'step 1'
                    if (result.bool) {
                        var target = result.targets[0];
                        event.target = target;
                        let showCards = [], useCard;
                        while (showCards.length < 5) {
                            var cards = game.cardsGotoOrdering(get.cards()).cards;
                            showCards.addArray(cards);
                            target.showCards(cards, get.translation(player) + '发动了【告谏】');
                            if (get.type2(cards[0]) == 'trick') {
                                useCard = cards[0];
                                break;
                            }
                        }
                        event.list = showCards, event.useCard = useCard;
                        if (useCard && target.hasUseTarget(useCard)) {
                            target.chooseControl('使用牌', '交换牌')
                                .set('choiceList', [`使用${get.translation(useCard)}`, `使用任意张手牌与${get.translation(showCards)}中的等量牌交换`])
                                .set('ai', () => {
                                    if (_status.event.useValue > 2) return '使用牌';
                                    return '交换牌';
                                })
                                .set('useValue', target.getUseValue(useCard));
                        }
                        if (!target.countCards('h') || !showCards.length) return;
                    }
                    else event.finish();
                    'step 2'
                    if (result.control == '使用牌') event.goto(4);
                    event.target.chooseToMove('告谏：是否交换其中任意张牌？').set('list', [
                        ['你的手牌', target.getCards('h'), 'mdtxgaojian_tag'],
                        ['展示牌', event.list],
                    ]).set('filterMove', (from, to) => {
                        return typeof to != 'number';
                    }).set('filterOk', moved => {
                        return moved[1].some(card => get.owner(card));
                    }).set('processAI', list => {
                        var num = Math.min(list[0][1].length, list[1][1].length), player = _status.event.getTrigger().player;
                        var cards1 = list[0][1].slice().sort((a, b) => get.value(a, 'raw') - get.value(b, 'raw'));
                        var cards2 = list[1][1].slice().sort((a, b) => get.value(b, 'raw') - get.value(a, 'raw'));
                        return [cards1.slice().addArray(cards2.slice(0, num)), cards2.slice().addArray(cards1.slice(0, num))];
                    });
                    'step 3'
                    if (result.bool) {
                        var lose = result.moved[1].slice();
                        var gain = result.moved[0].slice().filter(i => !get.owner(i));
                        if (lose.some(i => get.owner(i)))
                            target.lose(lose.filter(i => get.owner(i)), ui.special);
                        for (let i = lose.length - 1; i >= 0; i--) {
                            ui.cardPile.insertBefore(lose[i], ui.cardPile.firstChild);
                        }
                        game.updateRoundNumber();
                        if (gain.length) target.gain(gain, 'draw');
                        event.finish();
                    }
                    else {
                        if (!topCards.length) return;
                        for (let i = topCards.length - 1; i >= 0; i--) {
                            ui.cardPile.insertBefore(topCards[i], ui.cardPile.firstChild);
                        }
                        game.updateRoundNumber();
                        event.finish();
                    }
                    'step 4'
                    event.target.chooseUseTarget(event.useCard, true);
                    event.finish();
                },
            },
            mdtxfuxi: {
                audio: 2,
                trigger: {
                    global: 'phaseUseBegin'
                },
                filter: function (event, player) {
                    var target = event.player;
                    if (!player.countCards('he') && !target.countCards('he')) return false;
                    return event.player != player && event.player.isMaxHandcard();
                },
                check: function (event, player) {
                    var player = _status.event.player;
                    var num = get.effect(event.target, { name: 'sha' }, player, player);
                    if (num > 0 && get.attitude(player, event.player) < 0 && event.player.countCards('he') > 0) return true;
                    if (player.countCards('he') > 0 && get.attitude(player, event.player) >= 0) return true;
                },
                content: function () {
                    'step 0'
                    var target = trigger.player, list = [];
                    event.target = target;
                    var controls = ['选项一', '选项二'];
                    if (player.countCards('he') == 0) controls.remove('选项一');
                    if (event.target.countCards('he') == 0) controls.remove('选项二');
                    player.chooseControl(controls, true).set('prompt', '附袭<br>选择要执行的效果<br><br><div class="text">选项一：交给' + get.translation(target) + '一张牌，然后摸两张牌。</div><br><div class="text">选项二：弃置' + get.translation(target) + '的一张牌，然后视为对其使用一张【杀】。</div></br>').set('ai', () => {
                        var player = _status.event.player;
                        var num = get.effect(event.target, { name: 'sha' }, player, player);
                        if (num > 0 && get.attitude(player, event.target) < 0 && event.target.countCards('he') > 0) {
                            return '选项二';
                        } else {
                            if (player.countCards('he') > 0) return '选项一';
                        }
                    });
                    'step 1'
                    if (result.control == '选项一') {
                        player.chooseCard('he', true, '交给' + get.translation(event.target) + '一张牌');
                    }
                    if (result.control == '选项二') {
                        player.discardPlayerCard(event.target, 'he', true);
                        event.goto(3);
                    }
                    'step 2'
                    if (result.bool) {
                        player.give(result.cards, event.target);
                        player.draw(2);
                        event.finish();
                    }
                    'step 3'
                    player.useCard({
                        name: 'sha',
                        isCard: true,
                    }, event.target, false);

                },
            },
            mdtxhaoyi: {
                audio: 2,
                trigger: {
                    player: 'phaseJieshuBegin'
                },
                filter: function (event, player) {
                    return lib.skill.mdtxhaoyi.getCards().length;
                },
                frequent: true,
                prompt: function (event, player) {
                    return get.prompt('mdtxhaoyi') + '（可获得' + get.translation(lib.skill.mdtxhaoyi.getCards()) + '）';
                },
                getCards: function () {
                    let cards = [], targets = game.players.slice().concat(game.dead.slice());
                    for (var target of targets) {
                        var history = target.getHistory('lose', evt => evt.position == ui.discardPile);
                        if (history.length) {
                            for (var evt of history) cards.addArray(evt.cards2.filterInD('d'));
                        }
                    }
                    var historyx = game.getGlobalHistory('cardMove', evt => evt.name == 'cardsDiscard');
                    if (historyx.length) {
                        for (var evtx of historyx) cards.addArray(evtx.cards.filterInD('d'));
                    }
                    for (var target of targets) {
                        var history = target.getHistory('useCard', evt => (evt.cards || []).length && target.getHistory('sourceDamage', evtx => {
                            return evtx.card && evtx.card == evt.card;
                        }).length);
                        if (history.length) {
                            for (var evt of history) cards.removeArray(evt.cards.filterInD('d'));
                        }
                    }
                    return cards.filter(card => get.tag(card, 'damage'));
                },
                content: function () {
                    'step 0'
                    var cardx = lib.skill.mdtxhaoyi.getCards();
                    event.cards = game.cardsGotoOrdering(cardx).cards;
                    event.given_map = {};
                    'step 1'
                    if (event.cards.length > 1) {
                        player.chooseCardButton('豪义：请选择要分配的牌', true, event.cards, [1, event.cards.length]).set('ai', function (button) {
                            if (ui.selected.buttons.length == 0) return 1;
                            return 0;
                        });
                    }
                    else if (event.cards.length == 1) {
                        event._result = { links: event.cards.slice(0), bool: true };
                    }
                    else {
                        event.finish();
                    }
                    'step 2'
                    if (result.bool) {
                        event.cards.removeArray(result.links);
                        event.togive = result.links.slice(0);
                        player.chooseTarget('选择一名角色获得' + get.translation(result.links), true).set('ai', function (target) {
                            var att = get.attitude(_status.event.player, target);
                            if (_status.event.enemy) {
                                return -att;
                            }
                            else if (att > 0) {
                                return att / (1 + target.countCards('h'));
                            }
                            else {
                                return att / 100;
                            }
                        }).set('enemy', get.value(event.togive[0], player, 'raw') < 0);
                    }
                    'step 3'
                    if (result.targets.length) {
                        var id = result.targets[0].playerid, map = event.given_map;
                        game.log(result.targets[0], '获得了' + get.cnNumber(event.togive.length) + '张', '#g“豪义牌”');
                        if (!map[id]) map[id] = [];
                        map[id].addArray(event.togive);
                    }
                    if (cards.length > 0) event.goto(1);
                    'step 4'
                    var list = [];
                    for (var i in event.given_map) {
                        var source = game.playerMap[i];
                        player.line(source, 'green');
                        list.push([source, event.given_map[i]]);
                    }
                    game.loseAsync({
                        gain_list: list,
                        giver: player,
                        animate: 'draw',
                    }).setContent('gaincardMultiple');
                },
            },
            mdtxshiju: {
                audio: 2,
                global: 'mdtxshiju_global',
                subSkill: {
                    global: {
                        audio: 'mdtxshiju',
                        forceaudio: true,
                        enable: 'phaseUse',
                        usable: 1,
                        filter: function (event, player) {
                            if (player.hasSkill('yun_wengua')) return false;
                            return game.hasPlayer(function (current) {
                                return current.hasSkill('yun_wengua') && player.countCards('he');
                            });
                        },
                        filterTarget: function (card, player, target) {
                            return target != player && target.hasSkill('mdtxshiju');
                        },
                        selectTarget: function () {
                            var num = game.countPlayer(current => {
                                return current.hasSkill('mdtxshiju');
                            });
                            return num > 1 ? 1 : -1;
                        },
                        filterCard: true,
                        position: 'he',
                        check: function (card) {
                            var player = _status.event.player;
                            if (get.type(card) === 'equip') {
                                var subtype = get.subtype(card);
                                let valueFix = 0;
                                if (game.hasPlayer(current => {
                                    if (current == player || !current.hasSkill('mdtxshiju')) return false;
                                    if (current.hasUseTarget(card) && !player.countEmptySlot(subtype)) return true;
                                })) valueFix += 5;
                                if (player.countCards('he', { subtype }) > 1) {
                                    return valueFix + 12 - get.equipValue(card);
                                }
                                return valueFix + 6 - get.value(card);
                            }
                            return 4 - get.value(card);
                        },
                        prompt: function () {
                            var list = game.filterPlayer(current => {
                                return current.hasSkill('mdtxshiju');
                            });
                            return `将一张牌交给${get.translation(list)}${list.length > 1 ? '中的一人' : ''}，若此牌为装备牌，其可以使用之，且你本回合的攻击范围+X（X为其装备区的牌数）。若其以此法替换了装备，你与其各摸两张牌。`;
                        },
                        discard: false,
                        lose: false,
                        prepare: function (cards, player, targets) {
                            player.$give(cards, targets[0], false);
                        },
                        content: function () {
                            'step 0'
                            var card = event.cards[0], target = event.target;
                            player.give(card, target);
                            'step 1'
                            if (!target.getCards('h').includes(card) || get.type(card) !== 'equip') return;
                            target.chooseUseTarget(card);
                            'step 2'
                            if (result.bool) {
                                var count = target.countCards('e');
                                if (count > 0) {
                                    player.addTempSkill('mdtxshiju_range');
                                    player.addMark('mdtxshiju_range', count, false);
                                    if (target.getHistory('lose', evt => {
                                        return evt.getParent().name === 'equip' && evt.getParent(5) === event && evt.es && evt.es.length > 0;
                                    })) for (var current of [player, target]) current.draw(2);
                                }
                            }
                            else return;
                        },
                        ai: {
                            order: 10,
                            result: {
                                target: function (player, target) {
                                    var card = ui.selected.cards[0];
                                    if (!card) return;
                                    if (target.hasSkillTag('nogain') && get.type(card) != 'equip') return 0;
                                    if (card.name == 'du' && target.hasSkillTag('nodu')) return 0;
                                    if (get.value(card) < 0) return -5;
                                    return Math.max(1, 5 - target.countCards('h'));
                                },
                            },
                        },
                    },
                    range: {
                        charlotte: true,
                        onremove: true,
                        mod: {
                            attackRange: function (player, num) {
                                return num + player.countMark('mdtxshiju_range');
                            },
                        },
                        intro: {
                            content: '本回合攻击范围+#'
                        },
                    },
                },
            },
            mdtxyingshi: {
                audio: 2,
                trigger: {
                    player: 'useCardToPlayered'
                },
                filter: function (event, player) {
                    if (!event.isFirstTarget) return false;
                    if (get.type(event.card) !== 'trick') return false;
                    if (player.hasSkill('mdtxyingshi_disabled')) return false;
                    return true;
                },
                content: function () {
                    'step 0'
                    let prompt2 = '令一名目标角色选择一项：①于此牌结算完毕后视为其使用一张同名牌';
                    if (player.countCards('e')) {
                        prompt2 += '；②弃置' + get.cnNumber(player.countCards('e')) + '张牌，然后此技能本回合失效。';
                    }
                    else prompt2 += '。';
                    player.chooseTarget(get.prompt('mdtxyingshi'), prompt2, function (card, player, target) {
                        return _status.event.getTrigger().targets.includes(target);
                    }).set('ai', target => {
                        var player = _status.event.player, trigger = _status.event.getTrigger(), att = get.attitude(player, target);
                        var effect = get.effect(target, trigger.card, player, player);
                        if (effect == 0 || att == 0) return 0;
                        if (effect > 0) {
                            if (att > 0) return att;
                            return 0;
                        }
                        if (att < 0) return -att;
                        if (att > 0 && !player.countCards('e')) return att;
                        return 0;
                    });
                    'step 1'
                    if (result.bool) {
                        var target = result.targets[0], count = player.countCards('e');
                        event.target = result.targets[0];
                        if (player.countCards('e')) {
                            var promptx = `###${get.translation(player)}对你发动了【应时】###是否弃置${get.cnNumber(count)}张牌，令此技能本回合失效？或点击“取消”，令其与此牌结算后视为对你使用一张同名牌。'}`;
                            event.bool = target.chooseToDiscard(promptx, count, 'he').set('ai', card => {
                                if (_status.event.goon) return 15 - get.value(card);
                                return 0;
                            }).set('goon', !get.tag(trigger.card, 'norepeat') && get.effect(target, trigger.card, trigger.player, target) < 0);
                        }
                        else event.bool = false;
                    }
                    'step 2'
                    if (event.bool) {
                        player.addTempSkill('mdtxyingshi_disabled');
                    }
                    else {
                        trigger.getParent().effectCount++;
                    }
                },
                subSkill: {
                    disabled: {
                        charlotte: true,
                        mark: true,
                        intro: {
                            content: '本回合已失效'
                        }
                    },
                },
            },
            mdtxwuwei: {
                audio: 2,
                enable: 'phaseUse',
                filter: function (event, player, card) {
                    var count = player.getStat('skill').mdtxwuwei;
                    if (count && count > player.countMark('mdtxwuwei_count')) return false;
                    var colors = [];
                    player.getCards('h', card => colors.add(get.color(card)));
                    return colors.some(color => event.filterCard(get.autoViewAs(lib.skill.mdtxwuwei.viewAs, player.getCards('h', { color: color })), player, event));
                },
                viewAs: { name: 'sha', storage: { mdtxwuwei: true } },
                locked: false,
                mod: {
                    targetInRange(card) {
                        if (card.storage && card.storage.mdtxwuwei) return true;
                    },
                    cardUsable(card, player, num) {
                        if (card.storage && card.storage.mdtxwuwei) return Infinity;
                    },
                },
                filterCard: () => false,
                selectCard: -1,
                precontent: function (event, player) {
                    'step 0'
                    var colors = [];
                    player.getCards('h', card => colors.add(get.color(card)));
                    var evt = event.getParent();
                    colors = colors.filter(color => evt.filterCard(get.autoViewAs(lib.skill.mdtxwuwei.viewAs, player.getCards('h', { color: color })), player, evt));
                    colors = colors.map(color => (color == 'none' ? 'none2' : color));
                    player.chooseControl(colors, 'cancel2').set('prompt', '武威：将一种颜色的所有手牌当作【杀】使用').set('ai', function () {
                        var player = _status.event.player, controls = _status.event.controls.slice();
                        controls.remove('cancel2');
                        return controls.sort((a, b) => {
                            return player.countCards('h', { color: a == 'none2' ? 'none' : a }) - player.countCards('h', { color: b == 'none2' ? 'none' : b });
                        })[0];
                    })
                    'step 1'
                    if (result.control) {
                        var color = result.control == 'none2' ? 'none' : result.control;
                        if (color == 'cancel2') {
                            event.getParent().goto(0);
                            return;
                        }
                        player.addTempSkill('mdtxwuwei_effect');
                        event.result.cards = player.getCards('h', { color: color });
                        event.result.card.cards = player.getCards('h', { color: color });
                        event.getParent().addCount = false;
                        delete event.getParent().addCount_extra;
                    }
                },
                ai: {
                    order: function (item, player) {
                        return get.order({ name: 'sha' }, player) - 1;
                    },
                },
                subSkill: {
                    effect: {
                        charlotte: true,
                        trigger: { player: 'useCard' },
                        filter: function (event, player) {
                            return (event.card.storage || []).mdtxwuwei && (event.cards || []).length;
                        },
                        forced: true,
                        popup: false,
                        silent: true,
                        priority: 3,
                        content: function () {
                            'step 0'
                            var func = function () {
                                var event = _status.event;
                                var controls = [link => {
                                    var evt = _status.event;
                                    if (evt.dialog && evt.dialog.buttons) {
                                        for (let i = 0; i < evt.dialog.buttons.length; i++) {
                                            var button = evt.dialog.buttons[i];
                                            button.classList.remove('selectable');
                                            button.classList.remove('selected');
                                            var counterNode = button.querySelector('.caption');
                                            if (counterNode) {
                                                counterNode.childNodes[0].innerHTML = '';
                                            }
                                        }
                                        ui.selected.buttons.length = 0;
                                        game.check();
                                    }
                                    return;
                                }];
                                event.controls = [ui.create.control(controls.concat(['清除选择', 'stayleft']))];
                            };
                            if (event.isMine()) func();
                            else if (event.isOnline()) event.player.send(func);
                            var types = [];
                            trigger.cards.forEach(card => types.add(get.type2(card, player)));
                            player.chooseButton(['武威：请选择' + get.cnNumber(types.length) + '次以下项', [['摸一张牌', '令目标角色本回合非锁定技失效', '令本回合〖武威〗可发动次数+1'].map((item, i) => [i, item]), 'textbutton']]).set('forced', true).set('selectButton', [types.length, types.length + 1]).set('filterButton', button => {
                                var selected = ui.selected.buttons.slice().map(i => i.link);
                                if (selected.length >= _status.event.selectButton[0]) return false;
                                return button.link != 1 || !selected.includes(1);
                            }).set('ai', button => {
                                var selected = ui.selected.buttons.slice().map(i => i.link);
                                if (_status.event.selectButton >= 3) return selected.includes(button.link) ? 0 : 1;
                                return [0, 2, 1].slice(0, _status.event.selectButton).includes(button.link) ? 1 : 0;
                            }).set('custom', {
                                add: {
                                    confirm: function (bool) {
                                        if (bool != true) return;
                                        var event = _status.event.parent;
                                        if (event.controls) event.controls.forEach(i => i.close());
                                        if (ui.confirm) ui.confirm.close();
                                        game.uncheck();
                                    },
                                    button: function () {
                                        if (ui.selected.buttons.length) return;
                                        var event = _status.event;
                                        if (event.dialog && event.dialog.buttons) {
                                            for (let i = 0; i < event.dialog.buttons.length; i++) {
                                                var button = event.dialog.buttons[i];
                                                var counterNode = button.querySelector('.caption');
                                                if (counterNode) {
                                                    counterNode.childNodes[0].innerHTML = '';
                                                }
                                            }
                                        }
                                        if (!ui.selected.buttons.length) {
                                            var evt = event.parent;
                                            if (evt.controls) evt.controls[0].classList.add('disabled');
                                        }
                                    },
                                },
                                replace: {
                                    button: function (button) {
                                        var event = _status.event;
                                        if (!event.isMine() || !event.filterButton(button)) return;
                                        if (button.classList.contains('selectable') == false) return;
                                        button.classList.add('selected');
                                        ui.selected.buttons.push(button);
                                        let counterNode = button.querySelector('.caption');
                                        var count = ui.selected.buttons.filter(i => i == button).length;
                                        if (counterNode) {
                                            counterNode = counterNode.childNodes[0];
                                            counterNode.innerHTML = `×${count}`;
                                        }
                                        else {
                                            counterNode = ui.create.caption(`<span style="font-family:xinwei; text-shadow:#FFF 0 0 4px, #FFF 0 0 4px, rgba(74,29,1,1) 0 0 3px;">×${count}</span>`, button);
                                        }
                                        var evt = event.parent;
                                        if (evt.controls) evt.controls[0].classList.remove('disabled');
                                        game.check();
                                    },
                                },
                            });
                            'step 1'
                            if (result.bool) {
                                result.links.sort((a, b) => a - b);
                                for (var i of result.links) {
                                    game.log(player, '选择了', '#g【武威】', '的', '#y第' + get.cnNumber(i + 1, true) + '项');
                                }
                                if (result.links.includes(0)) player.draw(result.links.filter(count => count == 0).length);
                                if (result.links.includes(1)) {
                                    for (var target of trigger.targets || []) {
                                        target.addTempSkill('mdtxwuwei_fengyin');
                                    }
                                }
                                if (result.links.includes(2)) {
                                    player.addTempSkill('mdtxwuwei_count');
                                    player.addMark('mdtxwuwei_count', result.links.filter(count => count == 2).length, false);
                                }
                                if (Array.from({ length: 3 }).map((_, i) => i).every(i => result.links.includes(i))) {
                                    trigger.baseDamage++;
                                    game.log(trigger.card, '造成的伤害', '#y+1');
                                }
                            }
                        },
                    },
                    count: {
                        charlotte: true,
                        onremove: true,
                        intro: {
                            content: '本回合〖武威〗可发动次数+#'
                        },
                    },
                    fengyin: {
                        inherit: 'fengyin',
                    },
                },
            },
            mdtxsushen: {
                audio: 2,
                audioname: ['mdtx_jiaxu2'],
                unique: true,
                limited: true,
                enable: 'phaseUse',
                skillAnimation: true,
                animationColor: 'blue',
                content: function () {
                    player.awakenSkill('mdtxsushen');
                    player.storage.mdtxsushen_reload = [Boolean(player.storage.mdtxfumou), player.countCards('h'), player.hp];
                    player.addSkill('mdtxsushen_reload');
                    player.addSkill('mdtxrushi');
                },
                derivation: 'mdtxrushi',
                ai: {
                    order: function (item, player) {
                        if (player.countCards('h') >= 5) {
                            return player.countCards('h') * 2;
                        } else {
                            return 0;
                        }
                    },
                    result: {
                        player: function (player, target) {
                            if (player.countCards('h') < 5) {
                                return 0;
                            } else {
                                return 1;
                            }
                        },
                    },
                },
                subSkill: {
                    reload: {
                        charlotte: true,
                        onremove: true,
                        mark: true,
                        intro: {
                            content: function (storage) {
                                return ['【覆谋】状态：' + ['阳', '阴'][storage[0] ? 1 : 0], '手牌数：' + storage[1], '体力值：' + storage[2]].join('<br>');
                            }
                        },
                    },
                },
            },
            mdtxrushi: {
                audio: 2,
                audioname: ['mdtx_jiaxu2'],
                unique: true,
                limited: true,
                enable: 'phaseUse',
                skillAnimation: true,
                animationColor: 'blue',
                content: function () {
                    var storage = player.storage.mdtxsushen_reload;
                    player.awakenSkill('mdtxrushi');
                    player.removeSkill('mdtxsushen_reload');
                    if (Boolean(player.storage.mdtxfumou) !== storage[0]) {
                        if (player.hasSkill('mdtxfumou', null, null, false)) {
                            player.changeZhuanhuanji('mdtxfumou');
                        }
                    }
                    if (player.countCards('h') != storage[1]) {
                        if (player.countCards('h') < storage[1]) {
                            player.drawTo(storage[1]);
                        }
                        else {
                            player.chooseToDiscard('h', true, player.countCards('h') - storage[1]);
                        }
                    }
                    if (player.hp != storage[2]) {
                        player[player.hp > storage[2] ? 'loseHp' : 'recover'](Math.abs(player.hp - storage[2]));
                    }
                    if (player.getStat('skill').mdtxfumou) {
                        delete player.getStat('skill').mdtxfumou;
                    }
                },
                ai: {
                    order: function (item, player) {
                        var storage = player.storage.mdtxsushen_reload;
                        if (player.countCards('h') >= storage[1]) {
                            return 0;
                        } else {
                            return 1;
                        }
                    },
                    result: {
                        player: function (player, target) {
                            var storage = player.storage.mdtxsushen_reload;
                            if (player.countCards('h') >= storage[1] || player.hp >= storage[2]) {
                                return 0;
                            } else {
                                return 1;
                            }
                        },
                    },
                },
            },
            mdtxfumou: {
                audio: 2,
                audioname: ['mdtx_jiaxu2'],
                zhuanhuanji: true,
                enable: 'phaseUse',
                usable: 1,
                owner: 'mdtx_jiaxu',
                mark: true,
                marktext: "☯",
                intro: {
                    content: function (storage, player, skill) {
                        if (player.storage.mdtxfumou == true) return '出牌阶段限一次，你可以观看一名其他角色所有手牌并展示至多一半数量（向上取整）张，令其依次使用展示牌（无距离限制且不可响应）。';
                        return '出牌阶段限一次，你可以观看一名其他角色所有手牌并展示至多一半数量（向上取整）张，令另一名其他角色获得展示牌，然后你与失去牌的角色各摸等量张牌。';
                    },
                },
                filter: function (event, player) {
                    return game.hasPlayer(function (current) {
                        if (current != player) {
                            return current.countCards('h') > 0;
                        }
                    });
                },
                filterTarget: function (card, player, target) {
                    if (target == player) return false;
                    return target.countCards('h') > 0;
                },
                selectTarget: 1,
                content: function () {
                    'step 0'
                    var num = Math.ceil(target.countCards('h') / 2);
                    event.target = target;
                    player.choosePlayerCard('覆谋：选择展示' + get.translation(event.target) + '的' + get.cnNumber(num) + '张牌', event.target, 'h', num, true).set('ai', function (card) {
                        var player = _status.event.player;
                        if (player.storage.mdtxfumou != true) return get.value(card) * (-get.attitude(player, event.target));
                        return target.getUseValue(card, false) * get.attitude(player, event.target);
                    }).set('visible', true).set('storage', player.storage.mdtxfumou);
                    'step 1'
                    if (result.cards.length) {
                        event.cards = result.cards;
                        player.showCards(event.cards, get.translation(player) + '发动了【覆谋】');
                    } else event.finish();
                    'step 2'
                    if (player.storage.mdtxfumou == true) {
                        for (var card of event.cards) {
                            if (event.target.hasUseTarget(card, false)) {
                                event.target.chooseUseTarget(card, true, false, 'nodistance').set('oncard', card => {
                                    game.log(_status.event.card, '不可被响应');
                                    _status.event.directHit.addArray(game.players);
                                });
                            }
                        }
                        event.goto(4);
                    } else {
                        if (game.hasPlayer(function (current) {
                            return current != player && current != event.target;
                        })) {
                            player.chooseTarget('请选择获得' + get.translation(event.cards) + '的目标', true, function (card, player, target) {
                                return target != player && target != event.target;
                            }).set('ai', function (target) {
                                return get.attitude(_status.event.player, target);
                            });
                        } else {
                            event.goto(4);
                        }
                    }
                    'step 3'
                    if (result.bool) {
                        var target = result.targets[0];
                        target.gain(event.cards, event.target, 'give');
                        game.asyncDraw([player, event.target], event.cards.length);
                    }
                    'step 4'
                    player.changeZhuanhuanji('mdtxfumou', null, player.storage.mdtxfumou ? 0 : 1);
                },
                ai: {
                    order: 7,
                    result: {
                        target: function (player, target) {
                            if (player.storage.mdtxfumou == true) {
                                return target.countCards('h');
                            } else {
                                if (get.attitude(player, target) >= 3) return target.countCards('h');
                                if (get.attitude(player, target) < 0) return -target.countCards('h');
                            }
                        },
                    },
                },
                group: ['mdtxfumou_change'],
                subSkill: {
                    change: {
                        trigger: {
                            global: 'phaseBefore',
                            player: 'enterGame',
                        },
                        direct: true,
                        filter: function (event, player) {
                            return event.name != 'phase' || game.phaseNumber == 0;
                        },
                        content: function () {
                            'step 0'
                            player.chooseControl('阳', '阴').set('prompt', '覆谋：选择你的转换技初始状态');
                            'step 1'
                            if (result.control) {
                                if (result.index == 1) {
                                    player.changeZhuanhuanji('mdtxfumou', null, 1);
                                }
                                event.finish();
                            }
                        },
                    },
                }
            },
            mdtxkuangzhan: {
                audio: 2,
                enable: 'phaseUse',
                usable: 1,
                filter: function (event, player) {
                    return player.countCards("h") < player.maxHp;
                },
                content: function () {
                    "step 0"
                    event.num = player.maxHp - player.countCards("h");
                    player.draw(event.num);
                    "step 1"
                    if (game.hasPlayer(function (current) {
                        return current != player && player.canCompare(current);
                    })) {
                        player.chooseTarget('狂战：与一名角色拼点', true, function (card, player, target) {
                            return target != player && player.canCompare(target);
                        }).set('ai', function (target) {
                            const player = get.player();
                            if (target.countCards('h') >= player.countCards('h')) return 0;
                            return get.effect(target, { name: 'sha' }, player, player) + 1;
                        });
                        event.num--;
                    }
                    else event.finish();
                    "step 2"
                    if (result.bool) {
                        event.target = result.targets[0];
                        var target = result.targets[0];
                        player.chooseToCompare(target);
                    }
                    "step 3"
                    if (result.bool) player.useCard({ name: "sha", isCard: true }, event.target);
                    else event.target.useCard({ name: "sha", isCard: true }, player);
                    "step 4"
                    if (event.num > 0) event.goto(1);
                },
                ai: {
                    order: 1,
                    result: {
                        player: function (player, target) {
                            let num = player.maxHp - player.countCards('h');
                            for (let i of game.players) {
                                if (get.attitude(player, i) <= 0) num -= i.countCards('h');
                            }
                            if (num <= 0) return 1;
                            return 0;
                        },
                    },
                },
            },
            mdtxkangyong: {
                trigger: {
                    player: "phaseBegin",
                },
                audio: 2,
                forced: true,
                charlotte: true,
                filter: function (event, player) {
                    return player.hp < player.maxHp
                },
                content: function () {
                    var num = player.maxHp - player.hp;
                    player.recover(num);
                    player.addTempSkill("mdtxkangyong_damage");
                    player.addMark("mdtxkangyong_damage", num);
                },
                subSkill: {
                    damage: {
                        onremove: true,
                        marktext: "亢勇",
                        intro: {
                            content: "回合结束失去#点体力",
                        },
                        trigger: {
                            player: "phaseEnd",
                        },
                        audio: "mdtxkangyong",
                        forced: true,
                        charlotte: true,
                        content: function () {
                            var num = player.countMark("mdtxkangyong_damage");
                            player.removeMark("mdtxkangyong_damage", num);
                            if (num > player.hp) player.loseHp(player.hp - 1);
                            else player.loseHp(num);
                            player.removeSkill("mdtxkangyong_damage");
                        },
                    },
                },
            },
            mdtxtaozhou: {
                audio: 2,
                enable: 'phaseUse',
                filter: function (event, player) {
                    return game.hasPlayer(c => {
                        return c.countCards('h') > 0 && c != player;
                    }) && player.storage.mdtxtaozhou == 0;
                },
                filterTarget: function (card, player, target) {
                    return target != player && target.countCards('h') > 0
                },
                selectTarget: 1,
                init: function (player) {
                    player.storage.mdtxtaozhou = 0;
                },
                content: function () {
                    'step 0'
                    player.chooseControl([1, 2, 3]).set('prompt', '请选择一个数字').set('ai', () => 1);
                    'step 1'
                    event.mdtxtaozhouNum = result.control;
                    target.chooseCard('h', '交给' + get.translation(player) + '至多3张手牌', [0, Math.min(3, target.countCards('h'))], true).set('ai', (card) => {
                        return 5 - get.value(card);
                    });
                    'step 2'
                    if (result.bool) {
                        if (result.cards.length > 0) player.gain(result.cards, target, 'giveAuto').giver = target;
                        if (result.cards.length >= event.mdtxtaozhouNum) {
                            player.draw();
                            target.draw();
                        } else if (event.mdtxtaozhouNum > result.cards.length) {
                            target.addSkill('mdtxtaozhou_d');
                            target.storage.mdtxtaozhou_d = event.mdtxtaozhouNum - result.cards.length;
                            if (event.mdtxtaozhouNum - result.cards.length >= 2) {
                                //target.useCard({ name: 'sha' }, player, false);
                                target.addSkill('mdtxzijin');
                            }
                        }
                        player.storage.mdtxtaozhou = event.mdtxtaozhouNum;
                    }
                },
                ai: {
                    order: 10,
                    result: {
                        player: 1,
                        target: -2,
                    },
                },
                group: 'mdtxtaozhou_r',
                subSkill: {
                    d: {
                        trigger: {
                            player: "damageBegin3",
                        },
                        direct: true,
                        filter: function (event, player) {
                            return player.storage.mdtxtaozhou_d > 0;
                        },
                        mark: true,
                        marktext: '讨州',
                        intro: {
                            // markcount:function(storage,player){
                            //     return storage;
                            // },
                            content: '下#次受到的伤害+1',
                        },
                        onremove: function (player) {
                            delete player.storage.mdtxtaozhou_d;
                        },
                        content: function () {
                            trigger.num++;
                            player.storage.mdtxtaozhou_d--;
                            if (player.storage.mdtxtaozhou_d == 0) player.removeSkill('mdtxtaozhou_d');
                        }
                    },
                    r: {
                        audio: 2,
                        trigger: {
                            global: "roundStart",
                        },
                        direct: true,
                        charlotte: true,
                        filter: function (event, player) {
                            return player.storage.mdtxtaozhou > 0;
                        },
                        content: function () {
                            player.storage.mdtxtaozhou--;
                        }
                    }
                }
            },
            mdtxhoude: {
                audio: 2,
                trigger: {
                    target: "useCardToTargeted",
                },
                direct: true,
                filter: function (event, player) {
                    return !player.hasSkill('mdtxhoude_1') && event.card && get.name(event.card) == 'sha' && get.color(event.card) == 'red' && player.countCards('he') && _status.currentPhase != player && _status.currentPhase.isPhaseUsing();
                },
                content: function () {
                    'step 0'
                    player.chooseToDiscard('是否弃置一张牌令此【杀】对你无效', 'he', 1, false);
                    player.addTempSkill('mdtxhoude_1', 'phaseUseEnd');
                    'step 1'
                    if (result.bool) {
                        player.logSkill('mdtxhoude');
                        trigger.excluded.push(player);
                    }
                },
                grup: 'mdtxhoude_sy',
                subSkill: {
                    1: { charlotte: true },
                    2: { charlotte: true },
                    sy: {
                        trigger: {
                            target: "useCardToBefore",
                        },
                        direct: true,
                        priority: 15,
                        filter: function (event, player) {
                            return event.player != player && !player.hasSkill('mdtxhoude_2') && event.card && get.color(event.card) == 'black' && get.type(event.card) == 'trick' && event.player.countCards('he') && _status.currentPhase != player && _status.currentPhase.isPhaseUsing();
                        },
                        content: function () {
                            'step 0'
                            player.addTempSkill('mdtxhoude_2', 'phaseUseEnd');
                            player.discardPlayerCard(trigger.target, 'he', false);
                            'step 1'
                            if (result.bool) {
                                trigger.cancel();
                            }
                        },
                    }
                }
            },
            mdtxzijin: {
                audio: 2,
                forced: true,
                trigger: { player: 'useCardAfter' },
                filter: function (event, player) {
                    return !event.mdtxzijin;
                },
                content: function () {
                    'step 0'
                    if (player.countCards('he') == 0) {
                        player.loseHp();
                        event.finish();
                    }
                    else player.chooseControl('弃置1张牌', '失去1点体力').set('prompt', '自矜：请选择一项').set('ai', () => {
                        var player = _status.event.player;
                        if (player.countCards('he') >= player.hp) return 0;
                        else if (player.hp <= 2) return 1;
                        return 0;
                    });
                    'step 1'
                    if (result.index == 0) player.chooseToDiscard('弃置1张牌', 1, 'he', true);
                    else player.loseHp();
                },
                group: 'mdtxzijin_1',
                subSkill: {
                    1: {
                        trigger: {
                            source: "damageBegin1",
                        },
                        direct: true,
                        filter: function (event, player) {
                            return event.card && event.card.name != undefined && event.getParent(2).name == 'useCard';
                        },
                        content: function () {
                            trigger.getParent(2).mdtxzijin = true;
                        }
                    }
                }
            },
            dcjianzhuan: {
                audio: 2,
                trigger: { player: 'useCard' },
                forced: true,
                init: function (player) {
                    if (!player.storage.dcjianzhuan) player.storage.dcjianzhuan = [1, 2, 3, 4];
                    if (!player.storage.dcjianzhuanC) player.storage.dcjianzhuanC = [];
                },
                onremove: function (player) {
                    delete player.storage.dcjianzhuan;
                    delete player.storage.dcjianzhuanC;
                },
                filter: function (event, player) {
                    if (!player.isPhaseUsing()) return false;
                    return player.storage.dcjianzhuan && player.storage.dcjianzhuan.length && player.storage.dcjianzhuanC && player.storage.dcjianzhuan.length - player.storage.dcjianzhuanC.length > 0;
                },
                content: function () {
                    'step 0'
                    event.jianzhuanX = player.getHistory('useSkill', e => e.skill == 'dcjianzhuan').length;
                    var list = [];
                    var nl = player.storage.dcjianzhuan.slice();
                    var ln = player.storage.dcjianzhuanC.slice();
                    if (nl.includes(1) && !ln.includes(1)) list.push('令一名角色弃置' + event.jianzhuanX + '张牌');
                    if (nl.includes(2) && !ln.includes(2)) list.push('摸' + event.jianzhuanX + '张牌');
                    if (nl.includes(3) && !ln.includes(3)) list.push('重铸' + event.jianzhuanX + '张牌');
                    if (nl.includes(4) && !ln.includes(4)) list.push('弃置' + event.jianzhuanX + '张牌');
                    event.list = list;
                    player.chooseControl().set('choiceList', list).set('prompt', '选择一项执行');
                    'step 1'
                    var char = event.list[result.index].charAt(0);
                    var x = Math.min(player.countCards('he'), event.jianzhuanX);
                    if (char != '令') {
                        switch (char) {
                            case '摸':
                                player.draw(event.jianzhuanX);
                                player.storage.dcjianzhuanC.add(2);
                                break;
                            case '重':
                                player.chooseToChongzhu(('重铸' + x + '张牌'), 'he', x, true);
                                player.storage.dcjianzhuanC.add(3);
                                break;
                            case '弃':
                                player.chooseToDiscard('弃置' + x + '张牌', 'he', x, true);
                                player.storage.dcjianzhuanC.add(4);
                                break;
                        }
                        event.finish();
                    } else {
                        player.storage.dcjianzhuanC.add(1);
                        player.chooseTarget('选择一名角色令其弃置' + event.jianzhuanX + '张牌', true).set('ai', (target) => {
                            return -get.attitude(_status.event.player, target);
                        })
                    }
                    'step 2'
                    if (result.bool) {
                        var target = result.targets[0];
                        var x = Math.min(event.jianzhuanX, target.countCards('he'));
                        target.chooseToDiscard('弃置' + x + '张牌', 'he', x, true);
                    }
                },
                group: 'dcjianzhuan_d',
                subSkill: {
                    d: {
                        trigger: {
                            player: 'phaseUseEnd'
                        },
                        charlotte: true,
                        direct: true,
                        filter: function (event, player) {
                            return player.storage.dcjianzhuan && player.storage.dcjianzhuan.length > 0 && player.storage.dcjianzhuanC;
                        },
                        content: function () {
                            if (player.storage.dcjianzhuanC.length == player.storage.dcjianzhuan.length) {
                                var num = player.storage.dcjianzhuan.randomGet();
                                var index = player.storage.dcjianzhuan.indexOf(num);
                                if (index !== -1) {
                                    player.storage.dcjianzhuan.splice(index, 1);
                                }
                                var str;
                                switch (num) {
                                    case 1:
                                        str = '令一名角色弃置X张牌';
                                        break;
                                    case 2:
                                        str = '摸X张牌';
                                        break;
                                    case 3:
                                        str = '重铸X张牌';
                                        break;
                                    case 4:
                                        str = '弃X张牌';
                                        break;
                                }
                                game.log(player, '失去了', '#g【渐专】', '的', '#y' + str, '的选项');
                            }
                            player.storage.dcjianzhuanC = [];
                        }
                    }
                },
            },
            dcfanshi: {
                audio: 2,
                trigger: {
                    player: "phaseJieshuBegin",
                },
                derivation: "dcfudou",
                forced: true,
                juexingji: true,
                skillAnimation: true,
                animationColor: "thunder",
                filter: function (event, player) {
                    return player.storage.dcjianzhuan && player.storage.dcjianzhuan.length == 1 && player.hasSkill('dcjianzhuan');
                },
                content: function () {
                    'step 0'
                    event.times = 0;
                    event.char = player.storage.dcjianzhuan[0];
                    event.jianzhuanX = 1;
                    'step 1'
                    var x = Math.min(player.countCards('he'), event.jianzhuanX);
                    var char = event.char;
                    if (char != 1) {
                        switch (char) {
                            case 2:
                                player.draw(event.jianzhuanX);
                                break;
                            case 3:
                                player.chooseToChongzhu(('重铸' + x + '张牌'), 'he', x, true);
                                break;
                            case 4:
                                player.chooseToDiscard('弃置' + x + '张牌', 'he', x, true);
                                break;
                        }
                        event.goto(3);
                    } else {
                        player.chooseTarget('选择一名角色令其弃置' + event.jianzhuanX + '张牌', true).set('ai', (target) => {
                            return -get.attitude(_status.event.player, target);
                        })
                    }
                    'step 2'
                    if (result.bool) {
                        var target = result.targets[0];
                        var x = Math.min(event.jianzhuanX, target.countCards('he'));
                        target.chooseToDiscard('弃置' + x + '张牌', 'he', x, true);
                    }
                    'step 3'
                    event.times++;
                    if (event.times < 3) event.goto(1);
                    'step 4'
                    player.gainMaxHp(2);
                    player.recover(2);
                    player.removeSkill('dcjianzhuan');
                    player.addSkill('dcfudou');
                }
            },
            dcfudou: {
                audio: 2,
                trigger: {
                    player: 'useCardToPlayered'
                },
                filter: function (event, player) {
                    if (event.targets.length != 1 || event.target == player) return false;
                    var color = get.color(event.card);
                    if (!['black', 'red'].includes(color)) return false;
                    var bool;
                    if (player.getAllHistory('damage', function (e) {
                        return e.player == player && e.getParent().player == event.targets[0];
                    }).length > 0) bool = true;
                    else bool = false;
                    return color == 'black' ? (bool == true) : (bool == false);
                },
                check: function (event, player) {
                    var color = get.color(event.card);
                    if (color == 'red') return get.attitude(player, event.target) > 0;
                    else if (player.hp > 1) return get.attitude(player, event.target) < 0;
                    else return 0;
                },
                prompt2: function (event, player) {
                    return '与' + get.translation(event.target) + '各' + (get.color(event.card) == 'black' ? '失去1点体力' : '摸一张牌');
                },
                content: function () {
                    var color = get.color(trigger.card),
                        target = trigger.target;
                    if (color == 'red') {
                        player.draw();
                        target.draw();
                    } else {
                        player.loseHp();
                        target.loseHp();
                    }
                },
            },
            dcsanshi: {
                trigger: {
                    global: 'roundStart'
                },
                forced: true,
                filter: function (event, player) {
                    return game.roundNumber == 1;
                },
                content: function () {
                    'step 0'
                    event.list = []
                    for (var i = 0; i < 13; i++) {
                        event.list[i] = [];
                    }
                    'step 1'
                    for (var i = 0; i < ui.cardPile.childNodes.length; i++) {
                        var card = ui.cardPile.childNodes[i];
                        for (var j = 0; j < 13; j++) {
                            if (get.number(card) == j + 1) event.list[j].push(card);
                        }
                    }
                    'step 2'
                    for (var i = 0; i < 13; i++) {
                        var card = event.list[i].randomGet();
                        player.addGaintag(card, 'dcsanshix');
                        if (!card.gaintagFixed) card.gaintagFixed = [];
                        card.gaintagFixed = ['dcsanshix'];
                        player.markAuto('dcsanshi', card);
                    }
                },
                group: ['dcsanshi_xinghou', 'dcsanshi_xiaochou'],
                subSkill: {
                    xinghou: {
                        trigger: {
                            global: 'phaseJieshuBegin'
                        },
                        forced: true,
                        popup: false,
                        content: function () {
                            var list = [];
                            var list2 = [];
                            player.getHistory('useCard', function (e) {
                                if (e.cards) list2.push(e.cards[0]);
                            })
                            game.getGlobalHistory('cardMove', function (evt) {
                                if (evt.name == 'lose') {
                                    if (evt.position == ui.discardPile) {
                                        for (var i of evt.cards) {
                                            if (i.hasGaintag('dcsanshix') && !list2.contains(i)) list.push(i);
                                        };
                                    }
                                } else {
                                    if (evt.name == 'cardsDiscard') {
                                        for (var i of evt.cards) {
                                            if (i.hasGaintag('dcsanshix') && !list2.contains(i)) list.push(i);
                                        };
                                    }
                                }
                            });
                            if (list.length) {
                                player.gain(list, 'gain2');
                                player.logSkill('dcsanshi');
                            }
                        }
                    },
                    xiaochou: {
                        trigger: {
                            player: 'useCard'
                        },
                        forced: true,
                        filter: function (event, player) {
                            return event.cards && event.cards.length == 1 && event.cards[0].hasGaintag('dcsanshix');
                        },
                        content: function () {
                            trigger.directHit.addArray(game.players);
                        },
                        ai: {
                            directHit_ai: true,
                            skillTagFilter: function (player, tag, arg) {
                                if (arg && arg.card && arg.card.length == 1 && arg.card.hasGaintag('dcsanshix')) return true;
                                return false;
                            }
                        }
                    },
                },
            },
            dczhenrao: {
                audio: 2,
                trigger: {
                    player: 'useCardToPlayered',
                    target: 'useCardToTargeted',
                },
                direct: true,
                init: function (player) {
                    if (!player.storage.dczhenrao) player.storage.dczhenrao = [];
                },
                filter: function (event, player, name) {
                    if (!event.targets || event.player == event.target) return false;
                    if (name == 'useCardToPlayered') return game.hasPlayer(p => {
                        return !player.storage.dczhenrao.includes(p) && event.targets.includes(p) && p.countCards('h') > player.countCards('h');
                    })
                    return !player.storage.dczhenrao.includes(event.player) && event.player.countCards('h') > player.countCards('h');
                },
                content: function () {
                    'step 0'
                    if (event.triggername == 'useCardToPlayered') {
                        player.chooseTarget('对一名角色造成1点伤害', function (card, player, target) {
                            return !player.storage.dczhenrao.includes(target) && trigger.targets.includes(target) && target.countCards('h') > player.countCards('h');
                        }).set('ai', (target) => {
                            var player = _status.event.player;
                            if (get.damageEffect(target, player, player) <= 0) return false;
                            return -get.attitude(player, target);
                        });
                    } else {
                        player.chooseBool('对' + get.translation(trigger.player) + '造成1点伤害').set('ai', () => {
                            if (get.attitude(_status.event.player, _status.event.getParent().player) <= 0) return true;
                            else return false;
                        });
                    }
                    'step 1'
                    if (result.bool) {
                        var target;
                        if (event.triggername == 'useCardToPlayered') target = result.targets[0];
                        else target = trigger.player;
                        target.damage();
                        player.storage.dczhenrao.add(target);
                    }
                },
                group: 'dczhenrao_1',
                subSkill: {
                    1: {
                        trigger: {
                            global: 'phaseEnd'
                        },
                        direct: true,
                        charlotte: true,
                        priority: 10,
                        filter: function (event, player) {
                            return player.storage.dczhenrao && player.storage.dczhenrao.length > 0;
                        },
                        content: function () {
                            player.storage.dczhenrao.length = 0;
                        },
                    }
                }
            },
            dcchenlue: {
                audio: 2,
                enable: 'phaseUse',
                skillAnimation: true,
                animationColor: 'thunder',
                limited: true,
                onremove: function (player, skill) {
                    var cards = player.getExpansions('dcchenluex');
                    if (cards.length) player.loseToDiscardpile(cards);
                },
                content: function () {
                    player.awakenSkill('dcchenlue');
                    var list = [];
                    for (var i = 0; i < ui.cardPile.childNodes.length; i++) {
                        var card = ui.cardPile.childNodes[i];
                        if (card.hasGaintag('dcsanshix')) list.push(card);
                    }
                    for (var j = 0; j < ui.discardPile.childNodes.length; j++) {
                        var card = ui.discardPile.childNodes[j];
                        if (card.hasGaintag('dcsanshix')) list.push(card);
                    }
                    var list1 = game.filterPlayer(play => play != player);
                    for (var k = 0; k < list1.length; k++) {
                        for (var l = 0; l < list1[k].countCards('hej'); l++) {
                            if (list1[k].getCards('hej')[l].hasGaintag('dcsanshix')) list.push(list1[k].getCards('hej')[l]);
                        }
                    }
                    for (var m = 0; m < player.countCards('ej'); m++) {
                        if (player.getCards('ej')[m].hasGaintag('dcsanshix')) list.push(player.getCards('ej')[m]);
                    }
                    player.gain(list, 'gain2');
                    player.addTempSkill('dcchenlue_x', {
                        player: 'phaseUseEnd'
                    });
                },
                ai: {
                    order: 9,
                    result: {
                        player: function (player) {
                            var v = 0;
                            game.players.forEach((c) => {
                                if (get.attitude(c, player) < 0) v += 1.5;
                            });
                            if (game.players.length > 2) return v - 2;
                            else return v;
                        }
                    }
                },
                group: 'dcchenlue_d',
                subSkill: {
                    x: {
                        direct: true,
                        mark: true,
                        marktext: '沉略',
                        intro: {
                            content: function (event, player) {
                                return '回合结束时，将所有“死士”牌移出游戏，直到' + get.translation(player) + '死亡'
                            }
                        },
                        charlotte: true,
                        onremove: function (player) {
                            var list = [];
                            for (var i = 0; i < ui.cardPile.childNodes.length; i++) {
                                var card = ui.cardPile.childNodes[i];
                                if (card.hasGaintag('dcsanshix')) list.push(card);
                            }
                            for (var j = 0; j < ui.discardPile.childNodes.length; j++) {
                                var card = ui.discardPile.childNodes[j];
                                if (card.hasGaintag('dcsanshix')) list.push(card);
                            }
                            var list1 = game.players;
                            for (var k = 0; k < list1.length; k++) {
                                for (var l = 0; l < list1[k].countCards('hej'); l++) {
                                    if (list1[k].getCards('hej')[l].hasGaintag('dcsanshix')) list.push(list1[k].getCards('hej')[l]);
                                }
                            }
                            if (list.length) player.addToExpansion(list, player, 'giveAuto').gaintag.add('dcchenlue_d');
                        }
                    },
                    d: {
                        audio: 'dcchenlue',
                        trigger: {
                            player: "die"
                        },
                        marktext: '死士',
                        intro: {
                            name: '被移出的死士牌',
                            content: "expansion",
                            markcount: "expansion",
                        },
                        forced: true,
                        forceDie: true,
                        content: function () {
                            var cards = player.getExpansions('dcchenluex');
                            if (cards.length) player.loseToDiscardpile(cards);
                        }
                    }
                }
            },
            mdtxpingliao: {
                audio: 2,
                audioname: ['mdtx_simayi2'],
                forced: true,
                trigger: {
                    player: 'useCardBegin'
                },
                filter: function (event, player) {
                    return event.card && event.card.name == 'sha';
                },
                content: function () {
                    'step 0'
                    event.respondList = [];
                    event.currentRespond = player.next;
                    'step 1'
                    if (event.currentRespond != player) {
                        if (player.inRange(event.currentRespond)) {
                            event.currentRespond.chooseCard('是否打出一张红色基本牌', 'h', function (card) {
                                return get.color(card) == 'red' && get.type(card) == 'basic'
                            }).set('ai', function (card) {
                                var player = _status.event.getParent().player,
                                    target = _status.event.player;
                                if (get.attitude(target, player) <= 0) {
                                    if (target.hasShan()) return 6 - get.value(card) + (target.maxHp - target.hp) + player.countCards('h') / 2.5;
                                    else return 3 - get.value(card) + (target.maxHp - target.hp) + Math.floor(player.countCards('h') / 2);
                                } else {
                                    var count = game.countPlayer(function (c) {
                                        return player.inRange(c);
                                    });
                                    if (count > 2) return 0;
                                    else return 8 - get.value(card);
                                }
                            })
                        } else event.goto(3);
                    } else event.goto(4);
                    'step 2'
                    if (result.bool) {
                        event.respondList.add(event.currentRespond);
                        event.currentRespond.respond(result.cards[0]);
                    }
                    'step 3'
                    event.currentRespond = event.currentRespond.next;
                    event.goto(1);
                    'step 4'
                    var c = 0;
                    for (var i = 0; i < trigger.targets.length; i++) {
                        if (!event.respondList.contains(trigger.targets[i])) trigger.targets[i].addTempSkill('yijue2');
                    }
                    for (var j of event.respondList) {
                        for (var k of trigger.targets) {
                            if (!j.contains(k)) c++;
                        }
                    }
                    if (c > 0) {
                        player.draw(2);
                        event._trigger.unCount = true;
                    }
                },
                group: 'mdtxpingliao_1',
                subSkill: {
                    1: {
                        trigger: {
                            player: "useCardAfter",
                        },
                        direct: true,
                        charlotte: true,
                        filter: function (event, player) {
                            return event.card && event.card.name == 'sha' && event.unCount;
                        },
                        content: function () {
                            if (trigger.addCount !== false) {
                                trigger.addCount = false;
                                trigger.player.getStat().card.sha--;
                            }
                        },
                        sub: true,
                    },
                }
            },
            mdtxquanmou: {
                audio: 2,
                audioname: ['mdtx_simayi2'],
                mark: true,
                zhuanhuanji: true,
                owner: 'mdtx_simayi',
                marktext: "☯",
                intro: {
                    content: function (storage, player, skill) {
                        var str = '';
                        if (player.storage.mdtxquanmou3.length > 0) str += '<li>对［' + get.translation(player.storage.mdtxquanmou3) + '］造成伤害时，防止此伤害';
                        if (player.storage.mdtxquanmou2.length > 0) str += '<li>对［' + (get.translation(player.storage.mdtxquanmou2)) + '］造成伤害后，可对至多三名其他角色各造成一点伤害';
                        if (player.storage.mdtxquanmou == true) return '出牌阶段每名角色限一次，你可以令攻击范围内一名其他角色交给你一张牌，此阶段你下次对其造成伤害后，可以对至多三名其他角色(该角色除外)各造成1点伤害<br><br>' + str;
                        return '出牌阶段每名角色限一次，你可以令攻击范围内一名其他角色交给你一张牌，防止你此阶段下次对其造成的伤害<br><br>' + str;
                    },
                },
                init: function (player) {
                    player.storage.mdtxquanmou2 = [];
                    player.storage.mdtxquanmou3 = [];
                },
                enable: 'phaseUse',
                filter: function (event, player) {
                    return game.hasPlayer(function (c) {
                        return !c.hasSkill('mdtxquanmou_r') && player.inRange(c);
                    })
                },
                filterTarget: function (card, player, target) {
                    return !target.hasSkill('mdtxquanmou_r') && player.inRange(target);
                },
                content: function () {
                    'step 0'
                    if (target.countCards('he')) target.chooseCard('he', '选择一张牌交给' + get.translation(player), true);
                    'step 1'
                    if (result.bool) {
                        player.gain(result.cards[0], 'giveAuto');
                    }
                    'step 2'
                    target.addTempSkill('mdtxquanmou_r');
                    if (player.storage.mdtxquanmou != true) {
                        target.addTempSkill('mdtxquanmou_p', 'phaseUseEnd');
                        player.storage.mdtxquanmou3.add(target);
                        player.changeZhuanhuanji('mdtxquanmou', null, 1);
                    }
                    else {
                        player.storage.mdtxquanmou2.add(target);
                        player.changeZhuanhuanji('mdtxquanmou', null, 0);
                    }
                },
                ai: {
                    order: 10,
                    result: {
                        target: function (player, target) {
                            if (player.storage.mdtxquanmou != true) return 1;
                            else -1.2;
                        },
                        player: function (player, target) {
                            if (game.hasPlayer(function (c) {
                                return !c.hasSkill('mdtxquanmou_r') && player.inRange(c) && (get.attitude(player, c) <= 0 || (get.attitude(player, c) > 0 && c.hp < 2 && c.countCards('h') > 2));
                            })) return 0.6;
                            else return 0;
                        },
                    },
                },
                group: ['mdtxquanmou_d', 'mdtxquanmou_c', 'mdtxquanmou_change'],
                subSkill: {
                    change: {
                        trigger: {
                            global: "phaseBefore",
                            player: "enterGame",
                        },
                        direct: true,
                        filter: function (event, player) {
                            return event.name != "phase" || game.phaseNumber == 0;
                        },
                        content: function () {
                            "step 0"
                            player.chooseControl('阳', '阴').set('prompt', '权谋：选择你的转换技初始状态');
                            "step 1"
                            if (result.control) {
                                if (result.index == 0) {
                                    event.finish();
                                }
                                else if (result.index == 1) {
                                    player.changeZhuanhuanji('mdtxquanmou');
                                    event.finish();
                                }
                                else {
                                    event.finish();
                                }
                            }
                        },
                    },
                    r: { charlotte: true, },
                    p: {
                        trigger: {
                            player: "damageBegin4",
                        },
                        direct: true,
                        charlotte: true,
                        onremove: true,
                        filter: function (event, player) {
                            return event.source.hasSkill('mdtxquanmou');
                        },
                        content: function () {
                            player.removeSkill('mdtxquanmou_p');
                            trigger.cancel();
                            var index = trigger.source.storage.mdtxquanmou3.indexOf(player);
                            if (index !== -1) {
                                trigger.source.storage.mdtxquanmou3.splice(index, 1);
                            }
                        },
                        ai: {
                            nofire: true,
                            nodamage: true,
                            notrick: true,
                            nothunder: true,
                            effect: {
                                target: function (card, player, target, current) {
                                    if (get.tag(card, 'damage')) return [0, 0];
                                },
                            },
                        },
                    },
                    d: {
                        trigger: {
                            source: "damageSource",
                        },
                        direct: true,
                        charlotte: true,
                        filter: function (event, player) {
                            return game.hasPlayer(function (c) {
                                return player.storage.mdtxquanmou2 && player.storage.mdtxquanmou2.includes(event.player);
                            })
                        },
                        content: function () {
                            'step 0'
                            player.chooseTarget([1, 3], '选择至多3名其他角色并对他们造成伤害', function (card, player, target) {
                                return target != player && target != trigger.player;
                            }).set('ai', function (target) {
                                return -get.attitude(player, target);
                            });
                            'step 1'
                            if (result.bool) {
                                for (var i of result.targets) {
                                    player.line(i);
                                    i.damage();
                                }
                                var index = player.storage.mdtxquanmou2.indexOf(trigger.player);
                                if (index !== -1) {
                                    player.storage.mdtxquanmou2.splice(index, 1);
                                }
                            }
                        }
                    },
                    c: {
                        trigger: {
                            player: 'phaseUseEnd'
                        },
                        direct: true,
                        charlotte: true,
                        lastDo: true,
                        content: function () {
                            player.storage.mdtxquanmou2 = [];
                            player.storage.mdtxquanmou3 = [];
                        }
                    },
                },
                mod: {
                    aiOrder: function (player, card, num) {
                        if (get.subtype(card) == 'equip1' && get.info(card)) {
                            var info = get.info(card);
                            if (info && info.distance && info.distance.attackFrom) return num -= info.distance.attackFrom * 2;
                        }
                    },
                    aiValue: (player, card, val) => {
                        if (get.subtype(card) == 'equip1' && get.info(card)) {
                            var info = get.info(card);
                            if (info && info.distance && info.distance.attackFrom) return val -= info.distance.attackFrom * 2;
                        }
                    },
                },
            },
            mdtxmengmou: {
                audio: 2,
                audioname: ['mdtx_lusu2'],
                zhuanhuanji: true,
                owner: 'mdtx_lusu',
                mark: true,
                marktext: "☯",
                intro: {
                    content: function (storage, player, skill) {
                        if (player.storage.mdtxmengmou == true) return '当你获得其他角色或其他角色获得你的手牌后，你可以令该角色打出' + get.cnNumber(player.hp) + '张【杀】，且每少打出1张便失去1点体力。';
                        return '当你获得其他角色或其他角色获得你的手牌后，你可以令该角色使用' + get.cnNumber(player.hp) + '张【杀】，且每造成1点伤害便回复1点体力。';
                    },
                },
                group: ['mdtxmengmou_1', 'mdtxmengmou_sha', 'mdtxmengmou_change'],
                subSkill: {
                    change: {
                        trigger: {
                            global: "phaseBefore",
                            player: "enterGame",
                        },
                        direct: true,
                        filter: function (event, player) {
                            return event.name != "phase" || game.phaseNumber == 0;
                        },
                        content: function () {
                            "step 0"
                            player.chooseControl('阳', '阴').set('prompt', '盟谋：选择你的转换技初始状态');
                            "step 1"
                            if (result.control) {
                                if (result.index == 0) {
                                    event.finish();
                                }
                                else if (result.index == 1) {
                                    player.changeZhuanhuanji('mdtxmengmou', null, 1);
                                    event.finish();
                                }
                                else {
                                    event.finish();
                                }
                            }
                        },
                    },
                    'sha': {
                        trigger: {
                            global: "damageBegin",
                        },
                        filter: function (event, player) {
                            return event.card && event.card.name == 'sha' && event.getParent(4).name == 'mdtxmengmou_1';
                        },
                        direct: true,
                        silent: true,
                        content: function () {
                            trigger.source.recover();
                        }
                    },
                    '1': {
                        audio: 'mdtxmengmou',
                        direct: true,
                        trigger: {
                            player: 'gainAfter',
                            global: 'gainAfter',
                        },
                        filter: function (event, player) {
                            if (!event.source || !event.cards || event.cards.length <= 0) return false;
                            if (event.source != player && event.player != player) return false;
                            if (event.source == event.player) return false;
                            if (!player.storage.mdtxmengmou) return !player.hasSkill('mdtxmengmou_forb1');
                            else return !player.hasSkill('mdtxmengmou_forb2');
                        },
                        content: function () {
                            'step 0'
                            if (trigger.source != player) event.target = trigger.source;
                            else event.target = trigger.player;
                            player.chooseBool('盟谋：是否令' + get.translation(event.target) + (!player.storage.mdtxmengmou ? '使用' : '打出') + player.maxHp + '张【杀】，每' + (!player.storage.mdtxmengmou ? '造成1点伤害便回复1点体力' : '少打出1张便失去1点体力')).set('ai', function () {
                                var player = _status.event.player;
                                if (!player.storage.mdtxmengmou) {
                                    if (get.attitude(player, event.target) > 0) {
                                        return true;
                                    } else {
                                        return false;
                                    }
                                } else {
                                    if (get.attitude(player, event.target) < 0) {
                                        return true;
                                    } else {
                                        return false;
                                    }
                                }
                            });
                            'step 1'
                            if (result.bool) {
                                player.logSkill('mdtxmengmou', event.target);
                                if (!player.storage.mdtxmengmou) {
                                    player.addTempSkill('mdtxmengmou_forb1', 'phaseEnd');
                                }
                                else {
                                    player.addTempSkill('mdtxmengmou_forb2', 'phaseEnd');
                                }
                                player.changeZhuanhuanji('mdtxmengmou', null, player.storage.mdtxmengmou ? 0 : 1);
                                // player.addSkill('mdtxmengmou_ban');

                                event.cnum = 0;
                                if (!player.storage.mdtxmengmou) event.goto(4);
                            }
                            else event.finish();
                            'step 2'
                            var cardus = event.target.getCards('h', card => {
                                return get.name(card) == 'sha';
                            });
                            if (cardus.length > 0 && event.target.isIn()) {
                                var prompt = '盟谋：请使用一张【杀】';
                                event.target.chooseToUse(prompt, function (card, player, event) {
                                    if (get.itemtype(card) != 'card' || get.name(card) != 'sha') return false;
                                    return lib.filter.filterCard.apply(this, arguments);
                                }).set('targetRequired', true).set('complexSelect', true);
                            }
                            event.finish();
                            'step 3'
                            if (result.bool) {
                                event.cnum++;
                                if (event.cnum >= player.maxHp) event.finish();
                                else event.goto(2)
                            } else event.finish();
                            'step 4'
                            var next = event.target.chooseToRespond('盟谋：请打出' + player.maxHp + '张【杀】，每少打出1张便失去1点体力', [1, player.maxHp], { name: 'sha' });
                            next.autochoose = lib.filter.autoRespondSha;
                            'step 5'
                            game.delay(0.5);
                            if (result.bool) {
                                var num = result.cards.length;
                                if (num < player.maxHp) event.target.loseHp(player.maxHp - num);
                            }
                            else event.target.loseHp(player.maxHp);
                        }
                    },
                    'forb1': { charlotte: true },
                    'forb2': { charlotte: true },
                }
            },
            mdtxmingshi: {
                audio: 2,
                audioname: ['mdtx_lusu2'],
                trigger: {
                    player: 'phaseDrawBegin'
                },
                content: function () {
                    trigger.num += 2;
                    player.addTempSkill('mdtxmingshi_draw', 'phaseDrawAfter');
                },
                subSkill: {
                    draw: {
                        trigger: { player: 'phaseDrawEnd' },
                        direct: true,
                        filter: function (event, player) {
                            return player.countCards('h') >= 3;
                        },
                        content: function () {
                            'step 0'
                            player.chooseCard('明势：选择并展示三张手牌', Math.min(3, player.countCards('h')), true);
                            'step 1'
                            if (result.bool) {
                                player.showCards(result.cards, '明势：' + get.translation(player) + '展示了' + result.cards.length + '张手牌');
                                event.cards = result.cards;
                                player.chooseTarget('明势：选择一名其他角色并令其获得其中一张牌', true, lib.filter.notMe).set('ai', function (target) {
                                    if (player.hasSkill('mdtxmengmou')) {
                                        if (!player.storage.mdtxmengmou) {
                                            return get.attitude(_status.event.player, target);
                                        } else {
                                            return -get.attitude(_status.event.player, target);
                                        }
                                    }
                                    return get.attitude(_status.event.player, target);
                                });
                            } else {
                                event.finish();
                            }
                            'step 2'
                            if (result.bool) {
                                event.target = result.targets[0];
                                event.target.chooseButton(['明势：选择并获得' + get.translation(player) + '一张牌', event.cards], true);
                            }
                            'step 3'
                            if (result.bool) event.target.gain(result.links, player, 'giveAuto').giver = player;

                        },
                        sub: true,
                    },
                },
            },
            mdtxronghuo: {
                audio: 2,
                audioname: ['mdtx_zhouyu2'],
                trigger: { source: 'damageBegin1' },
                forced: true,
                filter: function (event, player) {
                    return event.card && ((event.card.name == 'sha' && event.card.nature == 'fire') || event.card.name == 'huogong');
                },
                content: function () {
                    var list = [];
                    for (var i = 0; i < game.players.length; i++) {
                        if (!list.contains(game.players[i].group)) list.add(game.players[i].group);
                    }
                    trigger.num = list.length;
                }
            },
            mdtxyingmou: {
                audio: 2,
                trigger: { player: 'useCardAfter' },
                audioname: ['mdtx_zhouyu2'],
                zhuanhuanji: true,
                owner: 'mdtx_zhouyu',
                mark: true,
                marktext: "☯",
                intro: {
                    content: function (storage, player, skill) {
                        if (player.storage.mdtxyingmou == true) return '你使用牌指定其他角色结算后可选择其中一个目标，令手牌数最多的一名角色对其使用手牌中所有〖伤害〗牌，若该角色没有〖伤害〗牌则将手牌弃至与你相同。';
                        return '你使用牌指定其他角色结算后可选择其中一个目标，你将手牌摸至与其相同，然后视为对其使用一张【火攻】（至多摸五张）。';

                    },
                },
                usable: 1,
                direct: true,
                filter: function (event, player) {
                    var list = [];
                    var targets = event._targets || event.targets;
                    for (var i = 0; i < targets.length; i++) {
                        if (targets[i].isAlive() && targets[i] != player) {
                            if (!player.storage.mdtxyingmou && player.canUse('huogong', targets[i], false) && targets[i].countCards('h') > 0) {
                                list.push(targets[i]);
                            } else {
                                list.push(targets[i]);
                            }
                        }
                    }
                    if (!event.targets || !event.card || event.targets.length == 0 || event.target == player) return false;
                    return list.length > 0;
                },
                content: function () {
                    'step 0'
                    if (!player.storage.mdtxyingmou) {
                        player.chooseTarget(get.prompt('mdtxyingmou'), '选择一名目标角色，摸牌至与其相同（至多摸五张），然后视为对其使用一张【火攻】', function (card, player, target) {
                            return _status.event.targets.contains(target) && target != player && target.countCards('h') > 0;
                        }).set('ai', function (target) {
                            return 2 - get.attitude(_status.event.player, target);
                        }).set('targets', trigger.targets);
                    } else {
                        player.chooseTarget(get.prompt('mdtxyingmou'), '选择一名目标角色，令手牌数最多的一名角色对其使用手牌中所有的伤害类牌，若无则将手牌弃至与你相同', function (card, player, target) {
                            return _status.event.targets.contains(target) && target != player;
                        }).set('ai', function (target) {
                            return 2 - get.attitude(_status.event.player, target);
                        }).set('targets', trigger.targets);
                    }
                    'step 1'
                    if (result.bool) {
                        player.logSkill('mdtxyingmou', result.targets);
                        if (!player.storage.mdtxyingmou) {
                            var target = result.targets[0];
                            var num = Math.min(5, target.countCards('h'));
                            if (num > player.countCards('h')) player.draw(num - player.countCards('h'));
                            if (player.canUse('huogong', target, false)) player.useCard({ name: 'huogong', isCard: false }, target, false);
                            player.changeZhuanhuanji('mdtxyingmou', null, 1);
                            event.finish();
                        } else {
                            player.changeZhuanhuanji('mdtxyingmou', null, 0);
                            event.target0 = result.targets[0];
                            var list = [];
                            var num = 0;
                            game.players.forEach(function (current) {
                                if (current.countCards('h') > num) {
                                    list.length = 0;
                                    list.add(current);
                                    num = current.countCards('h');
                                }
                                else if (current.countCards('h') == num) {
                                    list.add(current);
                                }
                            })
                            player.chooseTarget('英谋：选择一名手牌数最多的角色', true, function (card, player, target) {
                                return list.contains(target);
                            }).set('ai', function (target) {
                                return -get.attitude(_status.event.player, target);
                            });
                        }
                    } else {
                        event.finish();
                        player.storage.counttrigger.mdtxyingmou--;
                    }
                    'step 2'
                    if (result.bool) {
                        event.target1 = result.targets[0];
                    } else event.finish();
                    'step 3'
                    var cardus = event.target1.getCards('h', card => {
                        return get.tag(card, 'damage');
                    });
                    if (cardus.length == 0) {
                        if (event.target1.countCards('h') > player.countCards('h')) event.target1.chooseToDiscard(event.target1.countCards('h') - player.countCards('h'), '英谋：将手牌弃置至与' + get.translation(player) + '相同', true);
                        event.finish();
                    }
                    'step 4'
                    var cardus = event.target1.getCards('h', card => {
                        return get.tag(card, 'damage') && event.target1.canUse(card, event.target0, false);
                    });
                    if (cardus.length > 0 && event.target0.isIn()) {
                        var prompt = '英谋：请选择对' + get.translation(event.target0) + '使用一张伤害类牌';
                        event.target1.chooseToUse(prompt, function (card, player, event) {
                            if (get.itemtype(card) != 'card' || !get.tag(card, 'damage')) return false;
                            return lib.filter.filterCard.apply(this, arguments);
                        }, true).set('targetRequired', true).set('complexSelect', true).set('filterTarget', function (card, player, target) {
                            if (target != _status.event.sourcex && !ui.selected.targets.contains(_status.event.sourcex)) return false;
                            return lib.filter.targetEnabled.apply(this, arguments);
                        }).set('sourcex', event.target0);
                    }
                    else event.finish();
                    'step 5'
                    if (result.bool) event.goto(4);
                    else event.finish();
                },
                group: ['mdtxyingmou_change'],
                subSkill: {
                    change: {
                        trigger: {
                            global: "phaseBefore",
                            player: "enterGame",
                        },
                        direct: true,
                        filter: function (event, player) {
                            return event.name != "phase" || game.phaseNumber == 0;
                        },
                        content: function () {
                            "step 0"
                            player.chooseControl('阳', '阴').set('prompt', '英谋：选择你的转换技初始状态');
                            "step 1"
                            if (result.control) {
                                if (result.index == 0) {
                                    event.finish();
                                }
                                else if (result.index == 1) {
                                    player.changeZhuanhuanji('mdtxyingmou');
                                    event.finish();
                                }
                                else {
                                    event.finish();
                                }
                            }
                        },
                    },
                },
            },
        }
};
}

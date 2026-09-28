export default function createImportedCharacters(lib, game, ui, get, ai, _status) {
    const MJS_LUTOU_VALID = ['auto', 'yuanhua', 'shizhounian', 'shousha'];
    const mjs_lutouCfg = lib.config.extension_名将杀_supplement003_lutou || 'auto';
    const MJS_LUTOU_DIRS = {"原画":["mjs003_baiqi.jpg","mjs003_baoyuan.jpg","mjs003_caoren.jpg","mjs003_huoqvbin.jpg","mjs003_junwnaghou.jpg","mjs003_lianpo.jpg","mjs003_lixin.jpg","mjs003_longju.jpg","mjs003_luxun.jpg","mjs003_mengtian.jpg","mjs003_panan.jpg","mjs003_simarui.jpg","mjs003_simayan.jpg","mjs003_suwu.jpg","mjs003_taoyuanming.jpg","mjs003_wangdao.jpg","mjs003_wangjun.jpg","mjs003_weihuacun.jpg","mjs003_weijie.jpg","mjs003_wnag.jpg","mjs003_xielinyun.jpg","mjs003_xunguan.jpg","mjs003_yangxianrong.jpg","mjs003_yingzheng.jpg","mjs003_zahoshe.jpg","mjs003_zhanghan.jpg","mjs003_zhaoyun.jpg","mjs003_zudi.jpg","mjs003_zuoci.jpg"],"十周年露头":["mjs003_baiqi.jpg","mjs003_baoyuan.jpg","mjs003_caoren.jpg","mjs003_huoqvbin.jpg","mjs003_junwnaghou.jpg","mjs003_lianpo.jpg","mjs003_lixin.jpg","mjs003_longju.jpg","mjs003_luxun.jpg","mjs003_mengtian.jpg","mjs003_panan.jpg","mjs003_simarui.jpg","mjs003_simayan.jpg","mjs003_suwu.jpg","mjs003_taoyuanming.jpg","mjs003_wangdao.jpg","mjs003_wangjun.jpg","mjs003_wangjun.zip","mjs003_weihuacun.jpg","mjs003_weijie.jpg","mjs003_wnag.jpg","mjs003_xielinyun.jpg","mjs003_xunguan.jpg","mjs003_yangxianrong.jpg","mjs003_yingzheng.jpg","mjs003_zahoshe.jpg","mjs003_zhanghan.jpg","mjs003_zhaoyun.jpg","mjs003_zudi.jpg","mjs003_zuoci.jpg"],"手杀露头":["mjs003_baiqi.jpg","mjs003_baoyuan.jpg","mjs003_caoren.jpg","mjs003_huoqvbin.jpg","mjs003_junwnaghou.jpg","mjs003_lianpo.jpg","mjs003_lixin.jpg","mjs003_longju.jpg","mjs003_luxun.jpg","mjs003_mengtian.jpg","mjs003_panan.jpg","mjs003_simarui.jpg","mjs003_simayan.jpg","mjs003_suwu.jpg","mjs003_taoyuanming.jpg","mjs003_wangdao.jpg","mjs003_wangjun.jpg","mjs003_weihuacun.jpg","mjs003_weijie.jpg","mjs003_wnag.jpg","mjs003_xielinyun.jpg","mjs003_xunguan.jpg","mjs003_yangxianrong.jpg","mjs003_yingzheng.jpg","mjs003_zahoshe.jpg","mjs003_zhanghan.jpg","mjs003_zhaoyun.jpg","mjs003_zudi.jpg","mjs003_zuoci.jpg"]};
    const skin = mjs_lutouCfg === 'auto' ? lib.config.extension_十周年UI_outcropSkin : mjs_lutouCfg;
    const MJS_LUTOU_DIR = skin === 'shizhounian' ? '十周年露头' : skin === 'shousha' ? '手杀露头' : '原画';
    const mjsImg = file => 'ext:名将杀/assets/incremental/image/' + (MJS_LUTOU_DIRS[MJS_LUTOU_DIR].includes(file) ? MJS_LUTOU_DIR : '原画') + '/' + file;
    lib.mjLutouSave = value => game.saveConfig('extension_名将杀_supplement003_lutou', MJS_LUTOU_VALID.includes(value) ? value : 'auto');

	var mjs_shizuEnterSkill = function (skillId, opts) {
		lib.mjsShizuEnters = lib.mjsShizuEnters || {}
		lib.mjsShizuEnters[skillId] = opts
		var enter = {
			direct: true,
			popup: false,
			audio: opts.audio,
			init: function (player) {
				if (player.storage[skillId + '_done']) return
				player.storage[skillId + '_pending'] = true
				var started = _status.gameDrawed || (typeof game.phaseNumber == 'number' && game.phaseNumber > 0)
				if (!started) return
				if (player.storage[skillId + '_queued']) return
				player.storage[skillId + '_queued'] = true
				var next = game.createEvent(skillId)
				next.player = player
				next.setContent(enter.content)
			},
			trigger: { global: 'gameDrawEnd' },
			filter: function (event, player) {
				return !player.storage[skillId + '_done'] && player.storage[skillId + '_pending']
			},
			content: function () {
				'step 0'
				event.enterOpts = lib.mjsShizuEnters[event.name]
				if (event.enterOpts && event.enterOpts.audio) game.trySkillAudio(event.name, player, true)
				if (!event.enterOpts) {
					event.finish()
					return
				}
				event.enterNoTarget = !event.enterOpts.target
				player.chooseBool(event.enterOpts.prompt).set(
					'ai',
					event.enterOpts.boolAI ||
						function () {
							return true
						}
				)
				'step 1'
				if (!result.bool) {
					player.storage[event.name + '_done'] = true
					event.finish()
					return
				}
				if (event.enterNoTarget) {
					player.storage[event.name + '_done'] = true
					event.enterOpts.effect(player, null, event)
					event.finish()
					return
				}
				player
					.chooseTarget(event.enterOpts.target.prompt, event.enterOpts.target.filter)
					.set('ai', event.enterOpts.target.ai)
				'step 2'
				if (!result.bool || !result.targets || !result.targets.length) {
					player.storage[event.name + '_done'] = true
					event.finish()
					return
				}
				player.storage[event.name + '_done'] = true
				event.enterOpts.effect(player, result.targets[0], event)
			}
		}
		if (opts.forced) {
			delete enter.direct
			delete enter.popup
			enter.init = function (player) {
				if (player.storage[skillId + '_done']) return
				var started = _status.gameDrawed || (typeof game.phaseNumber == 'number' && game.phaseNumber > 0)
				if (!started) return
				if (player.storage[skillId + '_queued']) return
				player.storage[skillId + '_queued'] = true
				player.storage[skillId + '_done'] = true
				var next = game.createEvent(skillId)
				next.player = player
				next.setContent(enter.content)
			}
			enter.forced = true
			delete enter.filter
			enter.content = opts.content
		}
		for (var key in opts) {
			if (['prompt', 'boolAI', 'target', 'effect', 'audio', 'forced', 'content', 'extraTrigger'].indexOf(key) < 0) {
				enter[key] = opts[key]
			}
		}
		if (opts.extraTrigger) {
			for (var ek in opts.extraTrigger) {
				var addv = opts.extraTrigger[ek]
				if (enter.trigger[ek] == undefined) {
					enter.trigger[ek] = addv
				} else {
					var basev = Array.isArray(enter.trigger[ek]) ? enter.trigger[ek].slice(0) : [enter.trigger[ek]]
					var addlist = Array.isArray(addv) ? addv : [addv]
					for (var ei = 0; ei < addlist.length; ei++) {
						if (basev.indexOf(addlist[ei]) < 0) basev.push(addlist[ei])
					}
					enter.trigger[ek] = basev
				}
			}
		}
		if (opts.audio) enter.audio = opts.audio
		return enter
	}
	return {
		name: '名将杀',
		content: function (config, pack) {
			if (
				lib.skill.mdtxbizuo &&
				lib.skill.mdtxbizuo.filter &&
				lib.skill.mdtxbizuo.filter.call &&
				!lib.skill.mdtxbizuo.filter.guarded
			) {
				var _bizuoOrig = lib.skill.mdtxbizuo.filter
				lib.skill.mdtxbizuo.filter = function (e, p) {
					if (!game.filterPlayer(i => i.getSeatNum() == 1)[0]) return false
					return _bizuoOrig.call(this, e, p)
				}
				lib.skill.mdtxbizuo.filter.guarded = true
			}
			lib.init.css(lib.assetURL + 'extension/名将杀/assets/incremental/css', 'updateContent')
			lib.init.css(lib.assetURL + 'extension/名将杀/assets/incremental/css', 'control')
			if (!lib._mj_xue_ready) {
				lib._mj_xue_ready = true
				lib.mjXue = {
					cost: { sha: 1 },
					selfOnly: { tao: true },
					noSave: { jiu: true },
					includeSelf: { wanjian: true, nanman: true },
					noCounter: { wuxie: true },
					firstTurn: { juedou: true },
					noDodge: { shan: true },
					contentOverride: {
						wuzhong: function () {
							'step 0'
							target.draw(1)
						},
						taoyuan: function () {
							'step 0'
							var min = 99
							for (var i = 0; i < game.players.length; i++) {
								if (game.players[i].isAlive() && game.players[i].hp < min) min = game.players[i].hp
							}
							if (target.hp == min) target.recover(event.baseDamage || 1)
						},
						guohe: function () {
							'step 0'
							var cs = target.getCards('hej')
							if (cs.length) {
								var c = cs.randomGet()
								target.discard(c)
								game.log(player, '对', target, '使用', card, '，随机弃置了', c)
							}
						},
						shunshou: function () {
							'step 0'
							var cs = target.getCards('hej')
							if (cs.length) {
								var c = cs.randomGet()
								player.gain(c, target, 'give')
								game.log(player, '对', target, '使用', card, '，随机获得了', c)
							}
						},
						jiedao: function () {
							'step 0'
							if (
								event.directHit ||
								!event.addedTarget ||
								(!_status.connectMode && lib.config.skip_shan && !target.hasSha())
							) {
								event.finish()
								return
							}
							target
								.chooseToUse(
									'对' + get.translation(event.addedTarget) + '使用一张杀（削：拒绝出杀也不会交出武器）',
									function (card, player) {
										if (get.name(card) != 'sha') return false
										return lib.filter.filterCard.apply(this, arguments)
									}
								)
								.set('targetRequired', true)
								.set('complexSelect', true)
								.set('filterTarget', function (card, player, target) {
									if (target != _status.event.sourcex && !ui.selected.targets.contains(_status.event.sourcex))
										return false
									return lib.filter.filterTarget.apply(this, arguments)
								})
								.set('sourcex', event.addedTarget)
								.set('addCount', false)
								.set('respondTo', [player, card])
							'step 1'
						}
					}
				}
				lib.mjXueAddTag = function (cards) {
					if (!cards) return
					if (get.itemtype(cards) == 'card') cards = [cards]
					for (var i = 0; i < cards.length; i++) {
						var card = cards[i]
						if (!card || !card.addGaintag) continue
						if (card.hasGaintag && card.hasGaintag('mjs003_skill_mjs_qiang_tag')) card.removeGaintag('mjs003_skill_mjs_qiang_tag', true)
						card.addGaintag('mjs003_skill_mjs_xue_tag')
						if (!card.gaintagFixed) card.gaintagFixed = []
						if (!card.gaintagFixed.contains('mjs003_skill_mjs_xue_tag')) {
							card.gaintagFixed.push('mjs003_skill_mjs_xue_tag')
						}
					}
					lib.mjXueRemoveTag = cards => {
						if (!cards) return
						if (get.itemtype(cards) == 'card') cards = [cards]
						for (var i = 0; i < cards.length; i++) {
							var card = cards[i]
							if (!card || !card.removeGaintag) continue
							if (!card.hasGaintag || !card.hasGaintag('mjs003_skill_mjs_xue_tag')) continue
							card.removeGaintag('mjs003_skill_mjs_xue_tag', true)
						}
					}
				}
				lib.mjXueHasTag = card => {
					if (!card) return false
					if (card.hasGaintag && card.hasGaintag('mjs003_skill_mjs_xue_tag')) return true
					var cards = card.cards
					if (cards) {
						for (var i = 0; i < cards.length; i++) {
							if (cards[i].hasGaintag && cards[i].hasGaintag('mjs003_skill_mjs_xue_tag')) return true
						}
					}
					return false
				}
				lib.mjXueNormal = function (player) {
					return !!(player && player.hasSkill && player.hasSkill('mjs003_skill_mjs_dangzheng'))
				}
				lib.mjXueIsRescue = function (event) {
					var cs = typeof event.getParent == 'function' ? event.getParent('chooseToUse') : null
					if (cs && cs.type == 'dying' && cs.dying) return true
					if (event.targets) {
						for (var i = 0; i < event.targets.length; i++) {
							if (event.targets[i] && event.targets[i].isDying && event.targets[i].isDying()) return true
						}
					}
					return false
				}
				lib.mjXueCounterOwn = function (event) {
					if (event.type == 'wuxie') {
						if (event.source == event.player) return true
						if (event.source2 && event.source2.contains(event.player)) return true
						return false
					}
					var evt2 = event.parent
					var depth = 0
					while (evt2 && depth < 10) {
						var m = evt2._info_map
						if (m) {
							var em = m._source || m
							if (em.target == event.player) return true
							if (em.targets && em.targets.contains(event.player)) return true
							if (em.target || em.targets) return false
							return true
						}
						evt2 = evt2.parent
						depth++
					}
					return true
				}
				var mjXueSelfOnly = function (name) {
					var info = lib.card[name]
					if (!info) return
					var _savable = info.savable
					info.savable = function (card, player, target) {
						var base = typeof _savable == 'function' ? _savable.apply(this, arguments) : _savable
						if (base === false) return false
						if (lib.mjXueHasTag(card) && target != player && !lib.mjXueNormal(player)) return false
						return true
					}
					var _modTarget = info.modTarget
					if (typeof _modTarget == 'function') {
						info.modTarget = function (card, player, target) {
							if (lib.mjXueHasTag(card) && target != player && !lib.mjXueNormal(player)) return false
							return _modTarget.apply(this, arguments)
						}
					}
				}
				for (var mjXueName in lib.mjXue.selfOnly) mjXueSelfOnly(mjXueName)
				var mjXueNoSave = function (name) {
					var info = lib.card[name]
					if (!info) return
					var _savable = info.savable
					info.savable = function (card, player, target) {
						var base = typeof _savable == 'function' ? _savable.apply(this, arguments) : _savable
						if (base === false) return false
						if (lib.mjXueHasTag(card) && !lib.mjXueNormal(player)) return false
						return true
					}
				}
				for (var mjXueName2 in lib.mjXue.noSave) mjXueNoSave(mjXueName2)
				var mjXueIncludeSelf = function (name) {
					var info = lib.card[name]
					if (!info || typeof info.filterTarget != 'function') return
					var _filterTarget = info.filterTarget
					info.filterTarget = function (card, player, target) {
						if (target == player && lib.mjXueHasTag(card) && !lib.mjXueNormal(player)) return true
						return _filterTarget.apply(this, arguments)
					}
				}
				for (var mjXueName3 in lib.mjXue.includeSelf) mjXueIncludeSelf(mjXueName3)
				lib.mjXueParsed = {}
				lib.mjXueOrigParsed = {}
				for (var mjXueName4 in lib.mjXue.contentOverride) {
					lib.mjXueParsed[mjXueName4] = lib.init.parsex(lib.mjXue.contentOverride[mjXueName4])
				}
				for (var mjXueName5 in lib.mjXue.contentOverride) {
					;(function (name) {
						if (!lib.card[name]) return
						lib.mjXueOrigParsed[name] = lib.init.parsex(lib.card[name].content)
						lib.card[name].content = async function (event, trigger, player) {
							const { cards, card } = event
							const content = lib.mjXueHasTag(cards && cards[0]) && !lib.mjXueNormal(player)
								? lib.mjXueParsed[card.name] : lib.mjXueOrigParsed[card.name]
							// Dispatch the compiled body directly. The current compiler captures
							// its step array; changing event.content cannot replace that array.
							event.goto(0).updateStep()
							await content.call(this, event)
						}
					})(mjXueName5)
				}
			}
			setTimeout(function () {
				if (lib.skill['mjs003_skill_mjs_xue_test_cost'] && !lib.skill.global.includes('mjs003_skill_mjs_xue_test_cost'))
					game.addGlobalSkill('mjs003_skill_mjs_xue_test_cost')
			}, 0)
			setTimeout(function () {
				if (lib.skill['mjs003_skill_mjs_die_audio'] && !lib.skill.global.includes('mjs003_skill_mjs_die_audio'))
					game.addGlobalSkill('mjs003_skill_mjs_die_audio')
			}, 0)

			if (!lib._mj_qiang_ready) {
				lib._mj_qiang_ready = true
				lib.mjQiang = {
					selfAny: {},
					saveAny: {},
					dodgeDraw: {},
					extraDamage: {},
					contentOverride: {}
				}
				lib.mjQiangAddTag = function (cards) {
					if (!cards) return
					if (get.itemtype(cards) == 'card') cards = [cards]
					for (var i = 0; i < cards.length; i++) {
						var card = cards[i]
						if (!card || !card.addGaintag) continue
						if (card.hasGaintag && card.hasGaintag('mjs003_skill_mjs_xue_tag')) card.removeGaintag('mjs003_skill_mjs_xue_tag', true)
						card.addGaintag('mjs003_skill_mjs_qiang_tag')
						if (!card.gaintagFixed) card.gaintagFixed = []
						if (!card.gaintagFixed.contains('mjs003_skill_mjs_qiang_tag')) {
							card.gaintagFixed.push('mjs003_skill_mjs_qiang_tag')
						}
					}
				}
				lib.mjQiangRemoveTag = function (cards) {
					if (!cards) return
					if (get.itemtype(cards) == 'card') cards = [cards]
					for (var i = 0; i < cards.length; i++) {
						var card = cards[i]
						if (!card || !card.removeGaintag) continue
						if (!card.hasGaintag || !card.hasGaintag('mjs003_skill_mjs_qiang_tag')) continue
						card.removeGaintag('mjs003_skill_mjs_qiang_tag', true)
					}
				}
				lib.mjQiangHasTag = function (card) {
					if (!card) return false
					if (card.hasGaintag && card.hasGaintag('mjs003_skill_mjs_qiang_tag')) return true
					var cards = card.cards
					if (cards) {
						for (var i = 0; i < cards.length; i++) {
							if (cards[i].hasGaintag && cards[i].hasGaintag('mjs003_skill_mjs_qiang_tag')) return true
						}
					}
					return false
				}
				var mjQiangSelfAny = function (name) {
					var info = lib.card[name]
					if (!info) return
					var _filterTarget = info.filterTarget
					if (typeof _filterTarget == 'function') {
						info.filterTarget = function (card, player, target) {
							if (target != player && lib.mjQiangHasTag(card) && target.hp < target.maxHp) return true
							return _filterTarget.apply(this, arguments)
						}
					}
					var _modTarget = info.modTarget
					if (typeof _modTarget == 'function') {
						info.modTarget = function (card, player, target) {
							if (target != player && lib.mjQiangHasTag(card) && target.hp < target.maxHp) return true
							return _modTarget.apply(this, arguments)
						}
					}
				}
				for (var mjQiangName in lib.mjQiang.selfAny) mjQiangSelfAny(mjQiangName)
				var mjQiangSaveAny = function (name) {
					var info = lib.card[name]
					if (!info) return
					var _savable = info.savable
					info.savable = function (card, player, target) {
						if (lib.mjQiangHasTag(card) && target != player) return true
						return typeof _savable == 'function' ? _savable.apply(this, arguments) : _savable
					}
				}
				for (var mjQiangName2 in lib.mjQiang.saveAny) mjQiangSaveAny(mjQiangName2)
				lib.mjQiangParsed = {}
				lib.mjQiangOrigParsed = {}
				for (var mjQiangName4 in lib.mjQiang.contentOverride) {
					lib.mjQiangParsed[mjQiangName4] = lib.init.parsex(lib.mjQiang.contentOverride[mjQiangName4])
				}
				for (var mjQiangName5 in lib.mjQiang.contentOverride) {
					;(function (name) {
						if (!lib.card[name]) return
						lib.mjQiangOrigParsed[name] = lib.init.parsex(lib.card[name].content)
						lib.card[name].content = async function (event, trigger, player) {
							const { cards, card } = event
							var marked = false
							if (cards) {
								for (var i = 0; i < cards.length; i++) {
									if (lib.mjQiangHasTag(cards[i])) {
										marked = true
										break
									}
								}
							}
							const content = marked ? lib.mjQiangParsed[card.name] : lib.mjQiangOrigParsed[card.name]
							event.goto(0).updateStep()
							await content.call(this, event)
						}
					})(mjQiangName5)
				}
			}
			setTimeout(function () {
				if (lib.skill['mjs003_skill_mjs_qiang_test_boost'] && !lib.skill.global.includes('mjs003_skill_mjs_qiang_test_boost'))
					game.addGlobalSkill('mjs003_skill_mjs_qiang_test_boost')
			}, 0)

			if (!lib._mjs_shizu_ready) {
				lib._mjs_shizu_ready = true

				lib.mjsShizuAddTag = function (cards) {
					if (!cards) return
					if (get.itemtype(cards) == 'card') cards = [cards]
					for (var i = 0; i < cards.length; i++) {
						var card = cards[i]
						if (!card || !card.addGaintag) continue
						card.addGaintag('mjs003_skill_mjs_shizu_tag')
						if (!card.gaintagFixed) card.gaintagFixed = []
						if (!card.gaintagFixed.contains('mjs003_skill_mjs_shizu_tag')) card.gaintagFixed.push('mjs003_skill_mjs_shizu_tag')
					}
				}
				lib.mjsShizuRemoveTag = function (cards) {
					if (!cards) return
					if (get.itemtype(cards) == 'card') cards = [cards]
					for (var i = 0; i < cards.length; i++) {
						var card = cards[i]
						if (!card || !card.removeGaintag) continue
						if (!card.hasGaintag || !card.hasGaintag('mjs003_skill_mjs_shizu_tag')) continue
						card.removeGaintag('mjs003_skill_mjs_shizu_tag', true)
					}
				}
				lib.mjsShizuHasTag = function (card) {
					if (!card) return false
					if (card.hasGaintag && card.hasGaintag('mjs003_skill_mjs_shizu_tag')) return true
					var cards = card.cards
					if (cards) {
						for (var i = 0; i < cards.length; i++) {
							if (cards[i].hasGaintag && cards[i].hasGaintag('mjs003_skill_mjs_shizu_tag')) return true
						}
					}
					return false
				}

				lib.mjsShizuGet = function () {
					if (!_status.mjsShizu) _status.mjsShizu = []
					return _status.mjsShizu
				}
				lib.mjsShizuPush = function (cards, toTop) {
					if (!cards) return []
					if (get.itemtype(cards) == 'card') cards = [cards]
					cards = cards.slice(0)
					if (!cards.length) return []
					lib.mjsShizuAddTag(cards)
					game.cardsGotoSpecial(cards)
					var pile = lib.mjsShizuGet()
					if (toTop) {
						for (var i = cards.length - 1; i >= 0; i--) {
							if (pile.contains(cards[i])) continue
							pile.unshift(cards[i])
						}
					} else {
						pile.addArray(cards)
					}
					lib.mjsShizuUpdate()
					return cards
				}
				lib.mjsShizuTake = function (cards) {
					if (!cards) return
					if (get.itemtype(cards) == 'card') cards = [cards]
					var pile = lib.mjsShizuGet()
					for (var i = 0; i < cards.length; i++) pile.remove(cards[i])
					if (!pile.length) lib.mjsShizuReshuffle()
					lib.mjsShizuUpdate()
				}
				lib.mjsShizuDiscardGet = function () {
					if (!_status.mjsShizuDiscard) _status.mjsShizuDiscard = []
					return _status.mjsShizuDiscard
				}
				lib.mjsShizuDiscardPush = function (cards) {
					if (!cards) return []
					if (get.itemtype(cards) == 'card') cards = [cards]
					cards = cards.slice(0)
					if (!cards.length) return []
					lib.mjsShizuAddTag(cards)
					game.cardsGotoSpecial(cards)
					lib.mjsShizuDiscardGet().addArray(cards)
					lib.mjsShizuUpdate()
					return cards
				}
				lib.mjsShizuSpin = function () {
					var btn = window.mjsSzbg
					if (!btn) return
					btn.classList.remove('mjs-shizu-spin')
					void btn.offsetWidth
					btn.classList.add('mjs-shizu-spin')
					clearTimeout(btn._mjsSpinTimer)
					btn._mjsSpinTimer = setTimeout(function () {
						btn.classList.remove('mjs-shizu-spin')
					}, 500)
				}
				lib.mjsShizuReshuffle = function () {
					var junk = lib.mjsShizuDiscardGet()
					if (!junk.length) return false
					var cards = junk.slice(0)
					junk.length = 0
					cards.randomSort()
					game.shuffleNumber++
					lib.mjsShizuPush(cards)
					lib.mjsShizuSpin()
					return true
				}
				lib.mjsShizuUpdate = function () {
					game.updateMjsShizu()
				}
				if (!lib.mjsShizuCSSInjected) {
					lib.mjsShizuCSSInjected = true
					var style = document.createElement('style')
					style.type = 'text/css'
					style.textContent =
						'.mjs003_skill_mjs_shizu_pile_btn {' +
						'  position: absolute; left: 1%; top: 42%;' +
						'  width: 42px; height: 42px; line-height: 42px; text-align: center;' +
						'  font-size: 22px; font-family: xinwei, yuanli, serif; color: #fff;' +
						'  text-shadow: 0 0 2px #000, 0 0 2px #000;' +
						'  background: rgba(25,25,28,.72); border: 1px solid rgba(255,255,255,.4);' +
						'  border-radius: 50%; box-shadow: 0 0 6px rgba(0,0,0,.5);' +
						'  cursor: pointer; z-index: 90; user-select: none;' +
						'}' +
						'.mjs003_skill_mjs_shizu_pile_btn b { font-size: 15px; }' +
						'.mjs-shizu-face { display: block; width: 100%; height: 100%; font-size: 15px; }' +
						'.mjs-shizu-sep { font-size: 12px; display: inline-block; transform: translateY(-2px); }' +
						'.mjs003_skill_mjs_shizu_pile_btn.mjs-shizu-spin .mjs-shizu-face {' +
						'  animation: mjs-shizu-spin .5s ease;' +
						'}' +
						'@keyframes mjs-shizu-spin {' +
						'  from { transform: rotate(0deg); }' +
						'  to { transform: rotate(360deg); }' +
						'}'
					document.head.appendChild(style)
				}
				lib.mjsClampToArena = function (node, tx, ty) {
					var area = node.offsetParent
					if (!area || !area.clientWidth) return [tx, ty]
					var maxX = area.clientWidth - node.offsetLeft - node.offsetWidth
					var maxY = area.clientHeight - node.offsetTop - node.offsetHeight
					return [Math.max(-node.offsetLeft, Math.min(maxX, tx)), Math.max(-node.offsetTop, Math.min(maxY, ty))]
				}

				window.addEventListener('resize', function () {
					var list = [window.mjsSzbg, window.mjsCtlBtn]
					for (var i = 0; i < list.length; i++) {
						var n = list[i]
						if (!n || !n.parentNode) continue
						var m = window.getComputedStyle(n).transform
						if (!m || m == 'none') continue
						var arr = m.match(/matrix.*\((.+)\)/)[1].split(', ')
						var xy = lib.mjsClampToArena(n, parseFloat(arr[4]) || 0, parseFloat(arr[5]) || 0)
						n.style.transform = 'translate(' + xy[0] + 'px,' + xy[1] + 'px)'
					}
				})

				lib.mjsShizuDrag = function (node) {
					var isMobile = navigator.userAgent.match(/(Android|iPhone|SymbianOS|Windows Phone|iPad|iPod)/i)
					var down = isMobile ? 'touchstart' : 'mousedown'
					var move = isMobile ? 'touchmove' : 'mousemove'
					var up = isMobile ? 'touchend' : 'mouseup'
					var pos = function (e) {
						return isMobile ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : { x: e.clientX, y: e.clientY }
					}
					var startX,
						startY,
						offsetX = 0,
						offsetY = 0
					node.addEventListener(down, function (event) {
						node._dragging = true
						node._moved = false
						var p = pos(event)
						startX = p.x
						startY = p.y
						var m = window.getComputedStyle(node).transform
						if (m && m != 'none') {
							var arr = m.match(/matrix.*\((.+)\)/)[1].split(', ')
							offsetX = parseInt(arr[4], 10)
							offsetY = parseInt(arr[5], 10)
						}
					})
					document.addEventListener(move, function (event) {
						if (!node._dragging) return
						var p = pos(event)
						var dx = p.x - startX,
							dy = p.y - startY
						if (Math.abs(dx) + Math.abs(dy) > 5) node._moved = true
						var xy = lib.mjsClampToArena(node, (offsetX + dx) / game.documentZoom, (offsetY + dy) / game.documentZoom)
						node.style.transform = 'translate(' + xy[0] + 'px,' + xy[1] + 'px)'
					})
					document.addEventListener(up, function () {
						node._dragging = false
					})
				}
				game.updateMjsShizu = function () {
					if (lib.config['extension_名将杀_supplement003_shizuBtn'] === false) {
						if (window.mjsSzbg) {
							window.mjsSzbg.remove()
							window.mjsSzbg = null
						}
						return
					}
					game.broadcast(function (mjs003_skill_mjs_shizu) {
						_status.mjsShizu = mjs003_skill_mjs_shizu
					}, _status.mjsShizu)
					var num = lib.mjsShizuGet().length
					if (!num && !lib.mjsShizuDiscardGet().length) {
						if (window.mjsSzbg) {
							window.mjsSzbg.remove()
							window.mjsSzbg = null
						}
						return
					}
					var btn = window.mjsSzbg
					if (!btn || !btn.parentNode) {
						btn = window.mjsSzbg = ui.create.div('.mjs003_skill_mjs_shizu_pile_btn', ui.arena)
						lib.mjsShizuDrag(btn)
						btn.onclick = function () {
							if (this._moved) {
								this._moved = false
								return
							}
							var num2 = lib.mjsShizuGet().length
							var junk2 = lib.mjsShizuDiscardGet().length
							if (!num2 && !junk2) return
							if (window.mjsSzinfo) {
								clearTimeout(window.mjsSzdtimer)
								window.mjsSzinfo.remove()
								window.mjsSzinfo = null
							}
							var box = ui.create.div('.mjs-ctl-panel.mjs-sz-info', document.body)
							box.innerHTML =
								'<div class="mjs-ctl-title">士 族 牌 堆</div>' +
								'<div class="mjs-sz-line">牌堆 <b>' +
								num2 +
								'</b> 张 / 弃牌堆 <b>' +
								junk2 +
								'</b> 张</div>'

							box.onclick = function () {
								clearTimeout(window.mjsSzdtimer)
								box.remove()
								if (window.mjsSzinfo === box) window.mjsSzinfo = null
							}
							window.mjsSzinfo = box
							window.mjsSzdtimer = setTimeout(function () {
								box.remove()
								if (window.mjsSzinfo === box) window.mjsSzinfo = null
							}, 1600)
						}
					}
					var junk = lib.mjsShizuDiscardGet().length
					btn.innerHTML =
						'<span class="mjs-shizu-face"><b>' +
						num +
						'</b><span class="mjs-shizu-sep">/</span><b>' +
						junk +
						'</b></span>'
				}
				lib.mjsShizuGetDiscard = function () {
					var cards = []
					var nodes = Array.prototype.slice.call(ui.discardPile.childNodes)
					for (var i = 0; i < nodes.length; i++) {
						if (get.itemtype(nodes[i]) == 'card' && lib.mjsShizuHasTag(nodes[i])) cards.push(nodes[i])
					}
					return cards
				}
				lib.mjsShizuAllow = function (player) {
					return !!(player && player.storage && (player.storage.mjs003_skill_mjs_shizu || player.storage.mjs003_skill_mjs_shizu_granted))
				}
				lib.mjsShizuIsClan = function (player) {
					return !!(player && player.storage && player.storage.mjs003_skill_mjs_shizu)
				}

				lib.mjsShizuMember = function () {
					for (var i = 0; i < game.players.length; i++) {
						if (lib.mjsShizuIsClan(game.players[i])) return true
						if (game.players[i].hasSkill && game.players[i].hasSkill('mjs003_skill_mjs_shizu')) return true
					}
					return false
				}
				lib.mjsShizuInitPile = function () {
					if (_status.mjsShizu_pile_built) return false
					if (!lib.mjsShizuMember()) return false
					var mj_pileNum = parseInt(String(lib.config['extension_名将杀_supplement003_shizuNum'] || 'n10').replace('n', ''), 10)
					if (!(mj_pileNum > 0)) mj_pileNum = 10
					var num = Math.min(mj_pileNum, ui.cardPile.childNodes.length)
					if (num <= 0) return false
					_status.mjsShizu_pile_built = true
					var cards = get.cards(num)
					lib.mjsShizuAddTag(cards)
					game.cardsGotoSpecial(cards)
					lib.mjsShizuGet().addArray(cards)
					game.log(get.cnNumber(num) + '张牌被转化为士族牌，放入了士族牌堆')
					return true
				}
				lib.mjsShizuPeekTop = function (player, n) {
					if (!lib.mjsShizuGet || !lib.mjsShizuInitPile) return []
					if (!_status.mjsShizu_pile_built && lib.mjsShizuInitPile()) {
						if (player && !player.hasSkill('mjs003_skill_mjs_shizu_pile')) player.addSkill('mjs003_skill_mjs_shizu_pile')
						lib.mjsShizuUpdate()
					}
					if (!lib.mjsShizuGet().length && lib.mjsShizuReshuffle()) {
						game.log('士族牌堆已摸空，', get.cnNumber(lib.mjsShizuGet().length), '张士族牌洗回了士族牌堆')
					}
					return lib.mjsShizuGet().slice(0, n)
				}
				lib.mjsShizuTakeEachType = function (player) {
					if (!lib.mjsShizuGet || !lib.mjsShizuInitPile) return []
					if (!_status.mjsShizu_pile_built && lib.mjsShizuInitPile()) {
						if (player && !player.hasSkill('mjs003_skill_mjs_shizu_pile')) player.addSkill('mjs003_skill_mjs_shizu_pile')
						lib.mjsShizuUpdate()
					}
					if (!lib.mjsShizuGet().length && lib.mjsShizuReshuffle()) {
						game.log('士族牌堆已摸空，', get.cnNumber(lib.mjsShizuGet().length), '张士族牌洗回了士族牌堆')
					}
					var groups = {}
					var arr = lib.mjsShizuGet()
					for (var i = 0; i < arr.length; i++) {
						var t = get.type2(arr[i])
						if (!groups[t]) groups[t] = []
						groups[t].push(arr[i])
					}
					var got = []
					for (var k in groups) got.push(groups[k][0])
					if (!got.length) return []
					lib.mjsShizuTake(got)
					return got
				}
			}
			;(function () {
				var FUNCS = [
					'伤害',
					'回复',
					'摸牌',
					'弃牌',
					'横置',
					'翻面',
					'复活',
					'换人',
					'重启',
					'搜索',
					'托管',
					'F12',
					'距离'
				]
				var NO_NUM = ['横置', '翻面', '换人', '复活', '重启', '搜索', '托管', 'F12', '距离']
				var NO_TARGET = ['重启', '搜索', '托管', 'F12', '距离']
				var NUMS = [1, 2, 3, 4, 5]
				var state = { func: null, num: null, targets: [] }
				var panel = null

				var drag = function (node) {
					var isMobile = navigator.userAgent.match(/(Android|iPhone|SymbianOS|Windows Phone|iPad|iPod)/i)
					var down = isMobile ? 'touchstart' : 'mousedown'
					var move = isMobile ? 'touchmove' : 'mousemove'
					var up = isMobile ? 'touchend' : 'mouseup'
					var pos = function (e) {
						return isMobile ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : { x: e.clientX, y: e.clientY }
					}
					var startX,
						startY,
						offsetX = 0,
						offsetY = 0
					node.addEventListener(down, function (event) {
						node._dragging = true
						node._moved = false
						var p = pos(event)
						startX = p.x
						startY = p.y
						var m = window.getComputedStyle(node).transform
						if (m && m != 'none') {
							var arr = m.match(/matrix.*\((.+)\)/)[1].split(', ')
							offsetX = parseInt(arr[4], 10)
							offsetY = parseInt(arr[5], 10)
						}
					})
					document.addEventListener(move, function (event) {
						if (!node._dragging) return
						var p = pos(event)
						var dx = p.x - startX,
							dy = p.y - startY
						if (Math.abs(dx) + Math.abs(dy) > 5) node._moved = true
						var xy = lib.mjsClampToArena(node, (offsetX + dx) / game.documentZoom, (offsetY + dy) / game.documentZoom)
						node.style.transform = 'translate(' + xy[0] + 'px,' + xy[1] + 'px)'
					})
					document.addEventListener(up, function () {
						node._dragging = false
					})
				}

				var needNum = function () {
					return !!state.func && NO_NUM.indexOf(state.func) == -1
				}
				var needTarget = function () {
					return !!state.func && NO_TARGET.indexOf(state.func) == -1
				}
				var canRun = function () {
					return !!state.func && (!needNum() || !!state.num) && (!needTarget() || state.targets.length > 0)
				}
				var refreshRun = function () {
					if (!panel) return
					var run = panel.querySelector('.mjs-ctl-run')
					if (!run) return
					run.classList.toggle('mjs-ctl-ready', canRun())
				}

				var ctlLog = function () {
					if (typeof game.log != 'function') return
					if (!_status.event || typeof _status.event.getLogv != 'function') return
					game.log.apply(game, arguments)
				}

				var MARK = 'mjs003_skill_mjs_distance_mark'
				var distOn = false
				var distTimer = null
				var distRefresh = function () {
					if (!game.players || !game.players.length) return
					for (var i = 0; i < game.players.length; i++) {
						var p = game.players[i]
						if (!p) continue
						if (p == game.me) {
							if (p.marks && p.marks[MARK]) p.unmarkSkill(MARK)
							continue
						}
						p.updateMark(MARK)
					}
				}
				var mjsDistToggle = function (btn) {
					if (!distOn && !game.me) {
						alert('观察模式下没有「你」这个参照角色，无法显示距离。')
						return
					}
					distOn = !distOn
					if (btn) btn.classList.toggle('mjs-ctl-on', distOn)
					var i, p
					if (distOn) {
						distRefresh()
						if (!distTimer) distTimer = setInterval(distRefresh, 1000)
						ctlLog('【控制助手】显示距离标记（数字＝「他到你 / 你到他」；再点一次「距离」清除）')
					} else {
						if (distTimer) {
							clearInterval(distTimer)
							distTimer = null
						}
						for (i = 0; i < game.players.length; i++) {
							p = game.players[i]
							if (p && p.marks && p.marks[MARK]) p.unmarkSkill(MARK)
						}
						ctlLog('【控制助手】已清除距离标记')
					}
				}

				var buildTargets = function () {
					var row = panel.querySelector('.mjs-ctl-row-targets')
					if (!row) return
					row.innerHTML = ''
					var list = []
					for (var i = 0; i < game.players.length; i++) list.push(game.players[i])
					for (var j = 0; j < game.dead.length; j++) list.push(game.dead[j])
					for (var k = 0; k < list.length; k++) {
						;(function (current) {
							var dead = current.isDead()
							var btn = ui.create.div('.mjs-ctl-pbtn', row)
							btn.innerHTML = get.translation(current) + (dead ? '（亡）' : '')
							if (dead) btn.classList.add('mjs-ctl-dead')
							if (state.targets.indexOf(current) != -1) btn.classList.add('mjs-ctl-on')
							if (NO_TARGET.indexOf(state.func) != -1) btn.classList.add('mjs-ctl-dis')
							btn.onclick = function () {
								if (NO_TARGET.indexOf(state.func) != -1) return
								var idx = state.targets.indexOf(current)
								if (idx == -1) state.targets.push(current)
								else state.targets.splice(idx, 1)
								btn.classList.toggle('mjs-ctl-on', state.targets.indexOf(current) != -1)
								refreshRun()
							}
						})(list[k])
					}
				}

				var syncCtlOrigin = function () {
					if (!panel || !window.mjsCtlBtn) return
					var b = window.mjsCtlBtn.getBoundingClientRect()
					panel.style.setProperty('--mjs-ctl-dx', b.left + b.width / 2 - window.innerWidth / 2 + 'px')
					panel.style.setProperty('--mjs-ctl-dy', b.top + b.height / 2 - window.innerHeight / 2 + 'px')
				}

				var buildPanel = function () {
					panel.innerHTML = ''
					var close = ui.create.div('.mjs-ctl-close', panel, '✕ 关闭')
					close.onclick = function () {
						syncCtlOrigin()
						panel.classList.add('mjs-ctl-hidden')
					}
					var ctlTitle = ui.create.div('.mjs-ctl-logo', panel)
					ctlTitle.innerHTML = '<img src="' + lib.assetURL + 'extension/名将杀/assets/incremental/image/logo.png" alt="名将杀">'
					ui.create.div('.mjs-ctl-tip', panel, '可在名将杀扩菜单里面关闭该按钮')
					var rowFunc = ui.create.div('.mjs-ctl-row', panel)
					for (var i = 0; i < FUNCS.length; i++) {
						;(function (name) {
							var btn = ui.create.div('.mjs-ctl-btn', rowFunc, name)
							if (state.func == name) btn.classList.add('mjs-ctl-on')
							btn.onclick = function () {
								if (name == '重启') {
									ctlLog('【控制助手】重启游戏')
									if (panel) panel.classList.add('mjs-ctl-hidden')
									game.reload()
									return
								}
								if (name == '搜索') {
									if (!window.诗笺_manual || typeof window.诗笺_manual.show != 'function') {
										alert('未找到「全能搜索」扩展，请先在扩展管理中启用它。')
										return
									}
									ctlLog('【控制助手】打开全能搜索')
									if (panel) panel.classList.add('mjs-ctl-hidden')
									window.诗笺_manual.show()
									return
								}
								if (name == '托管') {
									if (!ui || !ui.auto || typeof ui.auto.click != 'function') {
										alert('未找到游戏自带的托管按钮，无法切换托管。')
										return
									}
									ctlLog('【控制助手】切换托管')
									if (panel) panel.classList.add('mjs-ctl-hidden')
									ui.auto.click()
									return
								}
								if (name == 'F12') {
									var mjsRemote = null
									try {
										var mjsEV =
											window.process && window.process.versions ? parseFloat(window.process.versions.electron) : NaN
										if (mjsEV >= 14) mjsRemote = require('@electron/remote')
										else mjsRemote = require('electron').remote
									} catch (e) {
										mjsRemote = null
									}
									if (!mjsRemote || typeof mjsRemote.getCurrentWindow != 'function') {
										alert('当前环境不支持打开控制台（仅桌面客户端可用）。')
										return
									}
									ctlLog('【控制助手】切换开发者工具')
									if (panel) panel.classList.add('mjs-ctl-hidden')
									mjsRemote.getCurrentWindow().toggleDevTools()
									return
								}
								if (name == '距离') {
									mjsDistToggle(btn)
									return
								}
								state.func = name
								if (NO_NUM.indexOf(name) != -1) state.num = null
								if (NO_TARGET.indexOf(name) != -1) state.targets = []
								var all = rowFunc.querySelectorAll('.mjs-ctl-btn')
								for (var t = 0; t < all.length; t++) all[t].classList.toggle('mjs-ctl-on', all[t].innerHTML == name)
								var nbs = panel.querySelector('.mjs-ctl-row-nums').querySelectorAll('.mjs-ctl-btn')
								for (var u = 0; u < nbs.length; u++) {
									var v = nbs[u]._num
									if (NO_NUM.indexOf(name) != -1) nbs[u].classList.add('mjs-ctl-dis')
									else {
										nbs[u].classList.remove('mjs-ctl-dis')
										nbs[u].classList.toggle('mjs-ctl-on', state.num == v)
									}
								}
								var pbs = panel.querySelector('.mjs-ctl-row-targets').querySelectorAll('.mjs-ctl-pbtn')
								for (var w = 0; w < pbs.length; w++) {
									if (NO_TARGET.indexOf(name) != -1) {
										pbs[w].classList.add('mjs-ctl-dis')
										pbs[w].classList.remove('mjs-ctl-on')
									} else pbs[w].classList.remove('mjs-ctl-dis')
								}
								refreshRun()
							}
						})(FUNCS[i])
					}
					var rowNum = ui.create.div('.mjs-ctl-row.mjs-ctl-row-nums', panel)
					for (var n = 0; n < NUMS.length; n++) {
						;(function (v) {
							var btn = ui.create.div('.mjs-ctl-btn', rowNum, get.cnNumber(v))
							btn._num = v
							if (state.func && NO_NUM.indexOf(state.func) != -1) btn.classList.add('mjs-ctl-dis')
							else if (state.num == v) btn.classList.add('mjs-ctl-on')
							btn.onclick = function () {
								if (state.func && NO_NUM.indexOf(state.func) != -1) return
								state.num = state.num == v ? null : v
								var all = rowNum.querySelectorAll('.mjs-ctl-btn')
								for (var t = 0; t < all.length; t++) all[t].classList.toggle('mjs-ctl-on', all[t]._num == state.num)
								refreshRun()
							}
						})(NUMS[n])
					}
					ui.create.div('.mjs-ctl-row.mjs-ctl-row-targets', panel)
					var rowRun = ui.create.div('.mjs-ctl-row', panel)
					var runBtn = ui.create.div('.mjs-ctl-run', rowRun, '执行')
					runBtn.onclick = function () {
						if (!canRun()) return
						doRun()
						syncCtlOrigin()
						panel.classList.add('mjs-ctl-hidden')
					}
					var clearBtn = ui.create.div('.mjs-ctl-btn', rowRun, '清空选择')
					clearBtn.onclick = function () {
						state.func = null
						state.num = null
						state.targets = []
						buildPanel()
					}
					ui.create.div('.mjs-ctl-warn', panel, '※ 点「执行」效果会在你下一次操作（出牌 / 点按钮等）时生效。')
					buildTargets()
					refreshRun()
				}

				var doRun = function () {
					var num = state.num
					var func = state.func
					if (func == '重启') {
						ctlLog('【控制助手】重启游戏')
						if (panel) panel.classList.add('mjs-ctl-hidden')
						game.reload()
						return
					}
					var targets = state.targets.slice(0)
					while (targets.length) {
						var target = targets.shift()
						switch (func) {
							case '伤害':
								target.damage(num, 'nosource')
								break
							case '回复':
								target.recover(num, 'nosource')
								break
							case '摸牌':
								target.draw(num)
								break
							case '弃牌':
								target.discard(target.getCards('he').randomGets(num))
								break
							case '横置':
								target.link()
								break
							case '翻面':
								target.turnOver()
								break
							case '复活':
								target.revive(target.maxHp)
								break
							case '换人':
								game.swapPlayer(target)
								break
						}
					}
					ctlLog('【控制助手】', '#y' + func, '→', get.translation(state.targets))
				}

				if (!game.mjsSetTempBackground) {
					game.mjsSetTempBackground = function (name) {
						if (!ui.background || game.mjsTempBgCurrent === name) return
						if (game.mjsTempBgSnapshot === null || game.mjsTempBgSnapshot === undefined) {
							game.mjsTempBgSnapshot = {
								image: ui.background.style.backgroundImage,
								size: ui.background.style.backgroundSize,
								position: ui.background.style.backgroundPosition
							}
						}
						game.mjsTempBgCurrent = name
						ui.background.setBackgroundImage(name.replace('ext:', 'extension/'))
						ui.background.style.backgroundSize = 'cover'
						ui.background.style.backgroundPosition = '50% 50%'
					}
					game.mjsClearTempBackground = function () {
						var snap = game.mjsTempBgSnapshot
						game.mjsTempBgSnapshot = null
						game.mjsTempBgCurrent = null
						if (!ui.background || snap === null || snap === undefined) return
						ui.background.style.backgroundImage = snap.image
						ui.background.style.backgroundSize = snap.size
						ui.background.style.backgroundPosition = snap.position
					}
					if (!game._mjsBgOverHooked && game.over) {
						game._mjsBgOverHooked = true
						var mjsBgOverOld = game.over
						game.over = function (result) {
							if (game.mjsClearTempBackground) game.mjsClearTempBackground()
							return mjsBgOverOld.apply(this, arguments)
						}
					}
				}
				game.mjsCtlText = function (btn) {
					if (!btn) return
					var text = '控'
					try {
						if (game.me && _status.currentPhase && _status.currentPhase == game.me) {
							var mjsStage = {
								phaseZhunbei: '准',
								phaseJudge: '判',
								phaseDraw: '摸',
								phaseUse: '出',
								phaseDiscard: '弃',
								phaseJieshu: '结'
							}
							var evt = _status.event
							var guard = 0
							while (evt && guard++ < 50) {
								if (evt.name && mjsStage[evt.name]) {
									text = mjsStage[evt._mjsChangedTo] || mjsStage[evt.name]
									break
								}
								evt = evt.parent
							}
						}
					} catch (e) {}
					if (btn._mjsText !== text) {
						btn._mjsText = text
						btn.innerHTML = text
					}
				}

				game.mjsCtlUpdate = function () {
					if (lib.config['extension_名将杀_supplement003_ctlBtn'] === false) {
						if (window.mjsCtlBtn && window.mjsCtlBtn.parentNode) {
							window.mjsCtlBtn.remove()
							window.mjsCtlBtn = null
						}
						if (panel && panel.parentNode) {
							panel.remove()
							panel = null
						}
						return
					}
					if (_status.connectMode || _status.video) {
						if (window.mjsCtlBtn && window.mjsCtlBtn.parentNode) {
							window.mjsCtlBtn.remove()
							window.mjsCtlBtn = null
						}
						if (panel && panel.parentNode) {
							panel.remove()
							panel = null
						}
						return
					}
					if (!ui.arena) return
					var btn = window.mjsCtlBtn
					if (!btn || !btn.parentNode) {
						btn = window.mjsCtlBtn = ui.create.div('.mjs-ctl-ball', ui.arena)
						game.mjsCtlText(btn)
						drag(btn)
						btn.onclick = function () {
							if (this._moved) {
								this._moved = false
								return
							}
							if (!panel || !panel.parentNode) {
								panel = ui.create.div('.mjs-ctl-panel.mjs-ctl-hidden', document.body)
								buildPanel()
								syncCtlOrigin()
								void panel.offsetWidth
								panel.classList.remove('mjs-ctl-hidden')
							} else if (panel.classList.contains('mjs-ctl-hidden')) {
								state.targets = []
								buildPanel()
								syncCtlOrigin()
								void panel.offsetWidth
								panel.classList.remove('mjs-ctl-hidden')
							} else {
								syncCtlOrigin()
								panel.classList.add('mjs-ctl-hidden')
							}
						}
					}
					game.mjsCtlText(btn)
				}

				setInterval(function () {
					game.mjsCtlUpdate()
				}, 250)
				setTimeout(function () {
					game.mjsCtlUpdate()
				}, 0)
			})()

			if (!lib._mj_zuoci_ready) {
				lib._mj_zuoci_ready = true
				var mj_zuoci_baseLogSkill = lib.element.player.logSkill
				lib.element.player.logSkill = function (name, targets, nature, logv) {
					try {
						var skname = Array.isArray(name) ? name[0] : name
						if (
							typeof skname == 'string' &&
							this.storage &&
							this.storage.mjs003_skill_mjs_dunjia &&
							this.additionalSkills.mjs003_skill_mjs_dunjia &&
							this.additionalSkills.mjs003_skill_mjs_dunjia.contains(skname)
						) {
							var pl = this
							var card = this.storage.mjs003_skill_mjs_dunjia
							pl.smoothAvatar(false)
							pl.node.avatar.setBackground(card, 'character')
							setTimeout(function () {
								if (!pl.isDead() && pl.name1) {
									pl.smoothAvatar(false)
									pl.node.avatar.setBackground(pl.name1, 'character')
								}
							}, 1800)
						}
					} catch (e) {}
					return mj_zuoci_baseLogSkill.apply(this, arguments)
				}
			}

			;(function () {
				var base = lib.assetURL + 'extension/名将杀/assets/incremental/font/mjs-narrow2'
				try {
					if (window.FontFace) {
						var ff = new FontFace('mjs-narrow2', 'url("' + base + '.ttf")')
						ff.load()
							.then(function (f) {
								document.fonts.add(f)
							})
							['catch'](function (e) {})
					} else {
					}
				} catch (e) {}
				try {
					var PRIVATE_AREA = /[\uE000-\uF8FF]/
					var SKIP_FONT_TAG = /^(SCRIPT|STYLE)$/
					var fixTextNode = function (t) {
						if (!t || t.nodeType !== 3 || !t.nodeValue) return
						var el = t.parentNode
						if (!el || el.nodeType !== 1 || SKIP_FONT_TAG.test(el.nodeName)) return
						if (!PRIVATE_AREA.test(t.nodeValue)) return
						if ((el.style.fontFamily || '').indexOf('mjs-narrow2') !== -1) return
						var cur = window.getComputedStyle(el).fontFamily
						el.style.fontFamily = '"mjs-narrow2",' + (cur || 'sans-serif')
					}
					var fixSubtree = function (root) {
						if (!root) return
						if (root.nodeType === 3) {
							fixTextNode(root)
							return
						}
						if (root.nodeType !== 1 && root.nodeType !== 9 && root.nodeType !== 11) return
						var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null)
						var t
						while ((t = walker.nextNode())) fixTextNode(t)
					}
					var fixFonts = function () {
						fixSubtree(document.body || document.documentElement)
					}
					setTimeout(fixFonts, 300)
					if (window.MutationObserver) {
						var pending = []
						var scheduled = false
						var flush = function () {
							scheduled = false
							while (pending.length) fixSubtree(pending.shift())
						}
						var queue = function (node) {
							if (!node) return
							pending.push(node)
							if (!scheduled) {
								scheduled = true
								requestAnimationFrame(flush)
							}
						}
						var observer = new MutationObserver(function (muts) {
							for (var i = 0; i < muts.length; i++) {
								var m = muts[i]
								if (m.type === 'childList') {
									for (var j = 0; j < m.addedNodes.length; j++) queue(m.addedNodes[j])
								} else if (m.type === 'characterData') {
									queue(m.target && m.target.parentNode)
								}
							}
						})
						observer.observe(document.body || document.documentElement, {
							childList: true,
							subtree: true,
							characterData: true
						})
					}
					setInterval(function () {
						if (!document.hidden) fixFonts()
					}, 3000)
				} catch (e) {}
				try {
					if (!lib.__mjsBrokenFilters) lib.__mjsBrokenFilters = new WeakMap()
					lib.__mjsGuardOneFilter = function (id) {
						var info = lib.skill[id]
						if (!info || typeof info.filter !== 'function') return false
						if (info.filter.__mjsGuarded) return false
						var orig = info.filter
						var wrapped = function (event, player, name) {
							var set = lib.__mjsBrokenFilters.get(player)
							if (set && set.has(id)) return false
							try {
								return orig.apply(this, arguments)
							} catch (e) {
								var cur = lib.__mjsBrokenFilters.get(player)
								if (!cur) {
									cur = new Set()
									lib.__mjsBrokenFilters.set(player, cur)
								}
								cur.add(id)
								return false
							}
						}
						wrapped.__mjsGuarded = true
						info.filter = wrapped
						return true
					}
					lib.__mjsSkillFamily = function (skill) {
						var list = [skill]
						var i, j
						for (i = 0; i < list.length; i++) {
							var info = lib.skill[list[i]]
							if (!info) continue
							var group = []
							if (typeof info.group == 'string') group = [info.group]
							else if (Array.isArray(info.group)) group = info.group.slice(0)
							if (info.subSkill) {
								for (var key in info.subSkill) group.push(list[i] + '_' + key)
							}
							for (j = 0; j < group.length; j++) {
								if (group[j] && list.indexOf(group[j]) < 0) list.push(group[j])
							}
						}
						return list
					}
					lib.__mjsGuardFilter = function (skill) {
						var ids = lib.__mjsSkillFamily(skill)
						var guarded = []
						for (var i = 0; i < ids.length; i++) {
							if (lib.__mjsGuardOneFilter(ids[i])) guarded.push(ids[i])
						}
						return guarded
					}
				} catch (e) {}
			})()
			if (!game.mjsWCLog) {
				game.mjsWCDebug = false
				game.mjsWCLog = function () {
					if (game.mjsWCDebug !== true) return
					var a = Array.prototype.slice.call(arguments)
					a.unshift('[魏华存]')
				}
				game.mjsWCChain = function () {
					var e = _status.event
					var list = []
					var g = 0
					while (e && g++ < 12) {
						list.push(e.name)
						e = e.parent
					}
					return list.join(' < ')
				}
				game.mjsWCPhase = function (evt) {
					if (!evt) return '(无阶段事件)'
					return (
						evt.name +
						' step=' +
						(typeof evt.step == 'number' ? evt.step : '?') +
						(evt._mjsChangedTo ? ' 被换成=' + evt._mjsChangedTo : '') +
						' 队列=' +
						(evt.next ? evt.next.length : '?') +
						(evt.finished ? ' 已结束' : '')
					)
				}
				game.mjsWCRecord = function (player, phaseEvt, extra) {
					game.mjsWCLog(
						'[存思身神·记录] 决策=' +
							(player != game.me || _status.auto ? 'AI' : '人工') +
							' ｜ 阶段=' +
							game.mjsWCPhase(phaseEvt) +
							' ｜ ' +
							extra
					)
				}
				game.mjsWCPick = function (player, outside) {
					var map = (player.storage && player.storage.cunsi_phase_map) || {}
					var order =
						(player.phaseNumber || 0) >= 2 || outside
							? ['phaseUse', 'phaseDiscard', 'phaseJieshu', 'phaseZhunbei', 'phaseJudge']
							: ['phaseUse', 'phaseDiscard', 'phaseJieshu']
					for (var i = 0; i < order.length; i++) {
						if (!map[order[i]]) return order[i]
					}
					return null
				}

				game.mjsWCPickDraw = function (player, handAfter) {
					var map = (player.storage && player.storage.cunsi_phase_map) || {}
					if (!(handAfter > 10)) return null
					if (map.phaseDraw) return null
					return 'phaseDraw'
				}

				game.mjsWCSwap = function (player, handAfter, skipKey) {
					if (!player.storage) player.storage = {}
					var ph = game.phaseNumber || 0
					if (player.storage.cunsi_swapTurn === ph) return null
					var map = player.storage.cunsi_phase_map || {}
					var out = player.storage.cunsi_swapOut || []
					var order = ['phaseUse', 'phaseDiscard', 'phaseJieshu', 'phaseZhunbei', 'phaseJudge']
					var done = function (act, key) {
						player.storage.cunsi_swapTurn = ph
						player.storage.cunsi_phase_map = map
						player.storage.cunsi_swapOut = out
						player.updateMarks()
						return { act: act, key: key }
					}
					if (handAfter > 15) {
						for (var i = 0; i < order.length; i++) {
							var k = order[i]
							if (map[k] == 'phaseDraw' && out.indexOf(k) < 0 && k != skipKey) {
								map[k] = 'phaseUse'
								out.push(k)
								return done('borrow', k)
							}
						}
						return null
					}
					if (out.length) {
						var k2 = out.pop()
						if (map[k2] == 'phaseUse') map[k2] = 'phaseDraw'
						return done('return', k2)
					}
					return null
				}

				game.mjsWCSwapCheck = function (player, handAfter, skipKey) {
					if (!player.storage) return false
					if (player.storage.cunsi_swapTurn === (game.phaseNumber || 0)) return false
					var map = player.storage.cunsi_phase_map || {}
					var out = player.storage.cunsi_swapOut || []
					var order = ['phaseUse', 'phaseDiscard', 'phaseJieshu', 'phaseZhunbei', 'phaseJudge']
					if (handAfter > 15) {
						for (var i = 0; i < order.length; i++) {
							var k = order[i]
							if (map[k] == 'phaseDraw' && out.indexOf(k) < 0 && k != skipKey) return true
						}
						return false
					}
					return out.length > 0
				}

				game.mjsWCGainInHand = function (player, trigger) {
					var n = 0
					if (!trigger || !trigger.cards) return 0
					for (var i = 0; i < trigger.cards.length; i++) {
						var card = trigger.cards[i]
						if (get.owner(card) == player && get.position(card) == 'h') n++
					}
					return n
				}
				game.mjsWCLog('扩展已加载（调试日志默认关闭，game.mjsWCDebug = true 可开启）')
			}

			if (!lib.mjsAiSitKey)
				lib.mjsAiSitKey = function (p, lite) {
					var _sg0 = lib.mjsAiT ? lib.mjsAiT() : Date.now()
					try {
						var ev = _status.event
						var hop = 0
						while (!lite && ev && ev.parent && ev.name != 'phaseUse' && hop++ < 10) ev = ev.parent
						var s = lite ? 'lite' : ev ? ev.name || '?' : '?'
						s += '#' + (p && (p.playerid || p.name1)) + '#' + (p ? p.hp + '/' + p.maxHp : '')
						if (p && p.getCards) {
							var es = p.getCards('e')
							for (var i = 0; i < es.length; i++) s += '|' + ((es[i] && es[i].name) || '?')
						}
						if (typeof game != 'undefined' && game && game.players) {
							for (var j = 0; j < game.players.length; j++) {
								var q = game.players[j]
								if (!q || q === p) continue
								s += ';' + (q.hp || 0)
								if (q.getCards) {
									var qs = q.getCards('e')
									for (var k = 0; k < qs.length; k++) s += ',' + ((qs[k] && qs[k].name) || '?')
								}
							}
						}
						if (lib.mjsAiDiag) lib.mjsAiDiag('sitKey', (lib.mjsAiT ? lib.mjsAiT() : Date.now()) - _sg0)
						return s
					} catch (e) {
						return 'k' + (_status.event ? 'o' : '')
					}
				}
			if (!lib.mjsAiT)
				lib.mjsAiT = function () {
					return typeof performance != 'undefined' && performance.now ? performance.now() : Date.now()
				}
			if (!lib.mjsAiDiag)
				lib.mjsAiDiag = function (k, ms) {
					try {
						var d = game._mjsAiDiag
						if (!d) {
							d = game._mjsAiDiag = {}
							var ks = [
								'modCalls',
								'poolOrderCalls',
								'checkCalls',
								'planCache',
								'planNoNum',
								'planFull',
								'playHit',
								'playMiss',
								'canHit',
								'canMiss',
								'sitKey'
							]
							for (var i = 0; i < ks.length; i++) d[ks[i]] = 0
						}
						d[k] = (d[k] || 0) + 1
						if (typeof ms == 'number' && isFinite(ms)) d[k + 'Ms'] = Math.round(((d[k + 'Ms'] || 0) + ms) * 100) / 100
					} catch (e) {}
				}
			if (!lib._mj_jieMark_hooked) {
				lib._mj_jieMark_hooked = true
				var mjsChars = {}
				if (pack && pack.character && pack.character.character) {
					for (var mjsId in pack.character.character) mjsChars[mjsId] = true
				}
				lib.arenaReady.push(function () {
					if (
						lib.config.extensions &&
						lib.config.extensions.contains('十周年UI') &&
						lib.config['extension_十周年UI_enable'] &&
						lib.config['extension_十周年UI_showJieMark']
					) {
						var mjsPlayerInit = lib.element.player.init
						lib.element.player.init = function (character) {
							var player = mjsPlayerInit.apply(this, arguments)
							if (character && mjsChars[character] && window.dui) {
								if (this.$jieMark == undefined) {
									this.$jieMark = window.dui.element.create('jie-mark', this)
								} else {
									this.appendChild(this.$jieMark)
								}
								this.$jieMark.style.backgroundImage = 'url("' + lib.assetURL + 'extension/名将杀/assets/incremental/mark_mjs.png' + '")'
							}
							return player
						}
					}
				})
			}
			;(function () {
				var WJCARD = 'mjs_wujiang_weihuacun'
				var WJSKILL = 'mjs_wujiang_weihuacun_gain'
				var WJDYING = 'mjs_wujiang_weihuacun_dying'
				var WJMAXROUND = 20
				if (!lib.card[WJCARD]) {
					lib.card[WJCARD] = {
						type: 'wujiang',
						wuxieable: false,
						image: mjsImg('mjs003_weihuacun.jpg'),
						enable: false,
						multitarget: true,
						selectTarget: -1,
						filterTarget: function () {
							return true
						},
						cardPrompt: function () {
							return '获得时自动打出：对所有角色造成1点雷电伤害，重复此过程，直到一名角色进入濒死状态，然后销毁此牌。'
						},
						content: function () {
							'step 0'
							event.wjTargets = event.targets.slice(0)
							'step 1'
							if (event.wjTargets.length) {
								if (game.mjsWjHit === true) {
									event.finish()
									return
								}
								var wjTarget = event.wjTargets.shift()
								if (wjTarget && !wjTarget.isDead()) wjTarget.damage(1, 'thunder', 'nosource')
								game.delayx(game.mjsWjDelay == null ? 0.4 : game.mjsWjDelay)
								event.redo()
							}
						}
					}
				}
				lib.translate[WJCARD] = '魏华存'
				lib.translate['wujiang'] = '武将'
				lib.translate[WJCARD + '_info'] =
					'获得时自动打出：对所有角色造成1点雷电伤害，重复此过程，直到一名角色进入濒死状态，然后销毁此牌。'
				lib.skill[WJSKILL] = {
					trigger: { player: 'gainAfter' },
					forced: true,
					charlotte: true,
					silent: true,
					filter: function (event, player) {
						if (player != event.player) return false
						if (!event.cards) return false
						var wjHit = event.cards.some(function (card) {
							return card && card.name == 'mjs_wujiang_weihuacun'
						})
						if (wjHit && game.mjsWjDebug !== false) {
						}
						return wjHit
					},
					content: function () {
						'step 0'
						var wjEvt = typeof trigger != 'undefined' && trigger ? trigger : _status.event && _status.event._trigger
						var wjSrc = wjEvt && wjEvt.cards ? wjEvt.cards.slice(0) : []
						if (game.mjsWjDebug !== false) {
						}
						event.wjCards = wjSrc.filter(function (card) {
							return card && card.name == 'mjs_wujiang_weihuacun'
						})
						event.wjIndex = 0
						game.mjsWjLoop = true
						game.mjsWjHit = false
						'step 1'
						if (event.wjIndex >= event.wjCards.length) {
							game.mjsWjLoop = false
							game.mjsWjHit = false
							event.finish()
							return
						}
						event.wjCard = event.wjCards[event.wjIndex]
						event.wjRound = 0
						game.log(player, '获得了武将牌·魏华存，自动打出')
						'step 2'
						event.wjRound++
						if (event.wjRound > 20) {
							game.log('（魏华存：达到安全上限20轮，停止）')
							event.goto(4)
							return
						}
						player.useCard({ name: 'mjs_wujiang_weihuacun' }, game.filterPlayer())
						'step 3'
						var wjStop =
							game.mjsWjHit === true ||
							game.players.some(function (current) {
								return current.isDying() || current.hp <= 0
							})
						if (wjStop) {
							event.goto(4)
							return
						}
						game.delayx(game.mjsWjRoundDelay == null ? 0.6 : game.mjsWjRoundDelay)
						event.goto(2)
						'step 4'
						game.mjsWjLoop = false
						game.mjsWjHit = false
						game.log(player, '销毁了武将牌·魏华存')
						game.cardsGotoSpecial(event.wjCard)
						event.wjIndex++
						event.goto(1)
					}
				}
				lib.skill[WJDYING] = {
					trigger: { global: 'dying' },
					forced: true,
					charlotte: true,
					silent: true,
					filter: function () {
						return game.mjsWjLoop === true
					},
					content: function () {
						game.mjsWjHit = true
					}
				}
				game.addGlobalSkill(WJSKILL)
				game.addGlobalSkill(WJDYING)
			})()
			lib.mjsXlyWrapShizuInitPile = function () {
				if (!lib.mjsShizuInitPile || lib.mjsShizuInitPile.__xly) return false
				var orig = lib.mjsShizuInitPile
				var wrapped = function () {
					var count = 0
					for (var i = 0; i < game.players.length; i++) {
						var p = game.players[i]
						if (p.storage && p.storage.mjs003_skill_mjs_shizu) count++
						else if (p.hasSkill && p.hasSkill('mjs003_skill_mjs_shizu')) count++
					}
					if (count <= 0) return orig.apply(this, arguments)
					var mj_pileNum = parseInt(String(lib.config['extension_名将杀_supplement003_shizuNum'] || 'n10').replace('n', ''), 10)
					if (!(mj_pileNum > 0)) mj_pileNum = 10
					var key = 'extension_名将杀_supplement003_shizuNum'
					var backup = lib.config[key]
					lib.config[key] = 'n' + mj_pileNum * count
					try {
						return orig.apply(this, arguments)
					} finally {
						lib.config[key] = backup
					}
				}
				wrapped.__xly = true
				lib.mjsShizuInitPile = wrapped
				return true
			}
			lib.mjsXlyWrapShizuInitPile()
			if (!game.mjsXlyHooked) {
				game.mjsXlyHooked = true
				game.prepareArena = (function (old) {
					return function () {
						var res = old ? old.apply(this, arguments) : undefined
						if (lib.mjsXlyWrapShizuInitPile) lib.mjsXlyWrapShizuInitPile()
						return res
					}
				})(game.prepareArena)
			}
			if (!lib.translate.mjs003_skill_mjschitang_backup) lib.translate.mjs003_skill_mjschitang_backup = '\uE08C\uE08D'
		},
		precontent: function () {
			var SUP_PUA = ['\uE078', '\uE079', '\uE07A', '\uE07B', '\uE07C', '\uE07D', '\uE07E', '\uE07F', '\uE080', '\uE081']
			var supNum = function (n) {
				var s = String(n)
				var out = ''
				for (var i = 0; i < s.length; i++) {
					var d = s.charCodeAt(i) - 48
					out += d >= 0 && d <= 9 && SUP_PUA[d] ? SUP_PUA[d] : s.charAt(i)
				}
				return out
			}
			if (lib.translate._mjsWangjunCount) return
			var _base = lib.translate.mjs003_skill_mjsanzhulouchuan || '暗筑楼船'
			Object.defineProperty(lib.translate, 'mjs003_skill_mjsanzhulouchuan', {
				configurable: true,
				enumerable: true,
				get: function () {
					var ev = _status.event
					var player = ev && ev.player
					var owns = function (p) {
						return !!(p && p.hasSkill && p.hasSkill('mjs003_skill_mjsanzhulouchuan'))
					}
					if (!owns(player)) player = owns(game.me) ? game.me : null
					if (!player) return _base
					var max = 1
					try {
						max = lib.skill.mjs003_skill_mjsanzhulouchuan.usable(player)
					} catch (e) {
						return _base
					}
					if (typeof max != 'number' || max < 0) return _base
					return _base + supNum(max)
				},
				set: function (v) {
					_base = v
				}
			})
			lib.translate._mjsWangjunCount = true
			;(function () {
				lib.skill.mjs003_card_mjs_ju_auto = {
					charlotte: true,
					silent: true,
					popup: false,
					forced: true,
					trigger: { player: ['phaseBegin', 'phaseEnd'] },
					filter: function (event, player) {
						if (event.skill) return false
						if (!player || !player.isAlive()) return false
						return player.countCards('h', { name: 'mjs003_card_mjs_ju' }) > 0
					},
					content: function () {
						'step 0'
						event.juCards = player.getCards('h', { name: 'mjs003_card_mjs_ju' })
						event.juNum = event.juCards.length
						if (!event.juNum) {
							event.finish()
							return
						}
						player.lose(event.juCards, ui.cardPile)
						'step 1'
						var pile = ui.cardPile
						var juNodes = []
						for (var j = 0; j < pile.childNodes.length; j++) {
							var cn = pile.childNodes[j]
							if (cn && cn.name == 'mjs003_card_mjs_ju') juNodes.push(cn)
						}
						for (var k = 0; k < juNodes.length; k++) {
							pile.insertBefore(juNodes[k], pile.childNodes[get.rand(0, pile.childNodes.length)])
						}
						game.updateRoundNumber()
						player.draw(event.juNum)
						game.log(player, '将【菊】洗入牌堆，摸' + get.cnNumber(event.juNum) + '张牌')
					}
				}

				setTimeout(function () {
					if (lib.skill.mjs003_card_mjs_ju_auto && (!lib.skill.global || !lib.skill.global.contains('mjs003_card_mjs_ju_auto'))) {
						game.addGlobalSkill('mjs003_card_mjs_ju_auto')
					}
				}, 0)
			})()
		},
		help: {},
		config: {
			banner: {
				name:
					'<img src="' +
					lib.assetURL +
					'extension/名将杀/assets/incremental/image/logo.png" style="display:block;margin:8px auto 6px;width:78%;max-width:260px;border-radius:12px;box-shadow:0 0 16px rgba(240,200,90,.45),0 2px 6px rgba(0,0,0,.6);">' +
					'<span style="display:block;text-align:center;font-size:17px;font-weight:700;letter-spacing:6px;color:#f0c85a;text-shadow:0 0 5px rgba(0,0,0,.85);">名 将 杀</span>' +
					'<span style="display:block;text-align:center;font-size:11px;color:#9a9da6;margin-top:3px;">扩展版本 · v0.0.3 · 29 将 / 12 势力</span>' +
					'<span style="display:block;margin:7px 12px 2px;height:1px;background:linear-gradient(90deg,rgba(240,200,90,0),rgba(240,200,90,.65),rgba(240,200,90,0));"></span>',
				clear: true,
				nopointer: true,
				onclick: function () {
					return false
				}
			},
			loadUpdateContent: {
				name:
					'<span style="color:#f0c85a;font-weight:700;text-decoration:underline;">点击查看更新公告</span>' +
					'<span style="display:block;font-size:11px;color:#9a9da6;margin-top:2px;">查看本扩展的历史更新内容</span>',
				clear: true,
				intro: '名将杀历史更新公告',
				onclick: function () {
					if (_status.mjsUpdateContent) return false
					_status.mjsUpdateContent = true
					var oReq = new XMLHttpRequest()
					oReq.addEventListener('load', function () {
						var layer = ui.create.div(ui.window, '.mjs-updateContent')
						ui.create.div(layer, '.mjs-updateContentClose', function () {
							delete _status.mjsUpdateContent
							layer.remove()
						})
						ui.create.div(layer, {
							width: '100%',
							innerHTML: this.responseText
						})
					})
					oReq.addEventListener('error', function (err) {
						delete _status.mjsUpdateContent
						alert('获取更新公告失败')
					})
					oReq.open('GET', lib.assetURL + 'extension/名将杀/assets/incremental/updateContent')
					oReq.send()
				}
			},
			feedback: {
				name:
					'<span style="display:block;color:#5b471d;font-weight:700;">反馈与建议</span>' +
					'<span style="display:block;font-size:11px;color:#5b471d;margin-top:3px;line-height:1.7;">' +
					'不仅是报 bug——有什么想说的、想玩的，都可以发我邮箱：<br>' +
					'<span style="color:#5b471d;font-weight:700;">1670329631@qq.com</span>' +
					'</span>',
				clear: true,
				nopointer: true
			},
			lutou: {
				name: '立绘档位',
				init: 'auto',
				item: {
					auto: '跟随十周年UI',
					yuanhua: '原画',
					shizhounian: '十周年露头',
					shousha: '手杀露头'
				},
				onclick: function (result) {
					if (lib.mjLutouSave) lib.mjLutouSave(result)
					game.print('名将杀：立绘档位已保存，重启游戏生效')
				},
				intro:
					'武将立绘用哪一套图：<br>' +
					'· <b>跟随十周年UI</b>：由十周年UI 的「露头皮肤」开关决定（默认）<br>' +
					'· <b>原画</b>：始终使用 image/原画/<br>' +
					'· <b>十周年露头 / 手杀露头</b>：强制使用对应目录；该目录里没有这个武将的图时自动回落原画<br>' +
					'<span style="color:#8ab">改动后重新开始一局生效。</span><br>' +
					'<span style="color:#8ab">配置保存在当前游戏存档，重启后生效。</span>'
			},
			shizuNum: {
				name: '士族牌堆张数',
				init: 'n10',
				item: {
					n10: '10 张（原版）',
					n16: '16 张',
					n20: '20 张',
					n24: '24 张'
				},
				intro:
					'登场时（起手摸牌后），从牌堆顶转化多少张牌进「士族牌堆」。<br>' +
					'士族牌堆是给『士族』角色每轮查看、取牌用的独立小牌堆，张数越多可选的牌越多。<br>' +
					'<span style="color:#8ab">改动后重新开始一局生效。</span>'
			},
			shizuBtn: {
				name: '显示士族牌堆按钮',
				init: true,
				intro:
					'牌堆不为空时，在牌桌左侧显示可拖动的「士族」按钮。<br>' +
					'按钮只报张数、不显示牌面（保密规则与〖士族〗取牌一致）。<br>' +
					'关闭后仍可通过〖士族〗每轮发动取牌，只是没有常驻按钮。'
			},
			ctlBtn: {
				name: '显示控制按钮',
				init: true,
				intro:
					'在牌桌右侧显示可拖动的「控」悬浮按钮，点击弹出控制面板（伤害 / 回复 / 摸牌 / 弃牌 / 横置 / 翻面 / 复活 / 换人）。<br>' +
					'<span style="color:#8ab">关闭后按钮与面板会立即撤掉（每秒检查一次，无需重开一局）。</span><br>' +
					'<span style="color:#e8a33d">注意：点「执行」后效果要等你下一次操作才会生效 —— 这是引擎机制（等待你操作时主循环暂停，事件只能排队），不是卡住。</span>'
			},
			reset: {
				name:
					'<span style="color:#ff9a5a;font-weight:700;">恢复默认设置</span>' +
					'<span style="display:block;font-size:11px;color:#9a9da6;margin-top:2px;">点击恢复：立绘档位=跟随十周年UI，士族牌堆=10张，两个悬浮按钮=显示（重开本页查看）</span>',
				clear: true,
				onclick: function () {
					if (lib.mjLutouSave) lib.mjLutouSave('auto')
					else game.saveConfig('extension_名将杀_supplement003_lutou', 'auto')
					game.saveConfig('extension_名将杀_supplement003_shizuNum', 'n10')
					game.saveConfig('extension_名将杀_supplement003_shizuBtn', true)
					game.saveConfig('extension_名将杀_supplement003_ctlBtn', true)
					game.print('名将杀：设置已恢复默认')
					return false
				}
			}
		},
		package: {
			character: {
				character: {
					mjs003_yingzheng: [
						'male',
						'qun',
						5,
						['mjs003_skill_mjs_yitong', 'mjs003_skill_mjs_changcheng', 'mjs003_skill_mjs_qinnu'],
						[mjsImg('mjs003_yingzheng.jpg'), 'die_audio'],
						['zhu']
					],
					mjs003_lixin: ['male', 'qun', 4, ['mjs003_skill_mjs_zhuangyong', 'mjs003_skill_mjs_zhuifeng'], [mjsImg('mjs003_lixin.jpg'), 'die_audio'], []],
					mjs003_baiqi: [
						'male',
						'qun',
						6,
						['mjs003_skill_mjs_jianmie', 'mjs003_skill_mjs_liaodi', 'mjs003_skill_mjs_chuqi'],
						[mjsImg('mjs003_baiqi.jpg'), 'die_audio'],
						[]
					],
					mjs003_mengtian: [
						'male',
						'qun',
						6,
						['mjs003_skill_mjs_zhongxin', 'mjs003_skill_mjs_zhucheng'],
						[mjsImg('mjs003_mengtian.jpg'), 'die_audio'],
						[]
					],
					mjs003_wnag: ['female', 'wei', 4, ['mjs003_skill_mjs_shezi', 'mjs003_skill_mjs_zhongzhen'], [mjsImg('mjs003_wnag.jpg'), 'die_audio'], []],
					mjs003_zahoshe: [
						'male',
						'qun',
						4,
						['mjs003_skill_mjs_fenggong', 'mjs003_skill_mjs_xianglu'],
						[mjsImg('mjs003_zahoshe.jpg'), 'die_audio'],
						[]
					],
					mjs003_junwnaghou: [
						'female',
						'qun',
						4,
						['mjs003_skill_mjs_qiaojie', 'mjs003_skill_mjs_shiqin', 'mjs003_skill_mjs_huiyan'],
						[mjsImg('mjs003_junwnaghou.jpg'), 'die_audio'],
						[]
					],
					mjs003_panan: ['male', 'qun', 4, ['mjs003_skill_mjs_daowang', 'mjs003_skill_mjs_pancai', 'mjs003_skill_mjs_zhiguo'], [mjsImg('mjs003_panan.jpg')], []],
					mjs003_lianpo: ['male', 'qun', 4, ['mjs003_skill_mjs_fujing', 'mjs003_skill_mjs_fanfou'], [mjsImg('mjs003_lianpo.jpg'), 'die_audio'], []],
					mjs003_longju: ['male', 'qun', 6, ['mjs003_skill_mjs_anying', 'mjs003_skill_mjs_shiwu'], [mjsImg('mjs003_longju.jpg'), 'die_audio'], []],
					mjs003_xunguan: ['female', 'qun', 6, ['mjs003_skill_mjs_guanniang', 'mjs003_skill_mjs_powei'], [mjsImg('mjs003_xunguan.jpg')], []],
					mjs003_simayan: [
						'male',
						'qun',
						4,
						['mjs003_skill_mjs_nanzhong', 'mjs003_skill_mjs_dangzheng', 'mjs003_skill_mjs_xinlv'],
						[mjsImg('mjs003_simayan.jpg'), 'die_audio'],
						[]
					],
					mjs003_wangdao: [
						'male',
						'qun',
						4,
						['mjs003_skill_mjs_shizu', 'mjs003_skill_mjs_shizu_yiwu', 'mjs003_skill_mjs_shizu_zhenjing'],
						[mjsImg('mjs003_wangdao.jpg'), 'die_audio']
					],
					mjs003_zudi: ['male', 'qun', 6, ['mjs003_skill_mjs_wenji', 'mjs003_skill_mjs_jiji', 'mjs003_skill_mjs_zimu'], [mjsImg('mjs003_zudi.jpg'), 'die_audio']],
					mjs003_weihuacun: [
						'female',
						'qun',
						4,
						['mjs003_skill_mjs_cunsishenshen', 'mjs003_skill_mjs_shangqingzhenjing', 'mjs003_skill_mjs_huangtinghuaxian'],
						[mjsImg('mjs003_weihuacun.jpg')],
						[]
					],
					mjs003_caoren: [
						'male',
						'wei',
						4,
						['mjs003_skill_mjs_tianren', 'mjs003_skill_mjs_shimeng', 'mjs003_skill_mjs_fengfaxingling'],
						[mjsImg('mjs003_caoren.jpg'), 'die_audio'],
						[]
					],
					mjs003_simarui: [
						'male',
						'qun',
						6,
						['mjs003_skill_mjs_shangsiyaoyu', 'mjs003_skill_mjs_dujianghualong'],
						[mjsImg('mjs003_simarui.jpg'), 'die_audio'],
						[]
					],
					mjs003_zuoci: [
						'male',
						'qun',
						1,
						['mjs003_skill_mjs_xicao', 'mjs003_skill_mjs_dunjia', 'mjs003_skill_mjs_feisheng'],
						[mjsImg('mjs003_zuoci.jpg'), 'die_audio']
					],
					mjs003_zhaoyun: [
						'male',
						'shu',
						6,
						['mjs003_skill_mjsqijin', 'mjs003_skill_mjsshidan', 'mjs003_skill_mjsrulong'],
						[mjsImg('mjs003_zhaoyun.jpg'), 'die_audio']
					],
					mjs003_luxun: ['male', 'wu', 5, ['mjs003_skill_mjshuopo', 'mjs003_skill_mjsjieyi'], [mjsImg('mjs003_luxun.jpg'), 'die_audio']],
					mjs003_weijie: [
						'male',
						'qun',
						3,
						['mjs003_skill_mjsfengshenxiuyi', 'mjs003_skill_mjszhuyuzace', 'mjs003_skill_mjssimengchengji'],
						[mjsImg('mjs003_weijie.jpg'), 'die_audio']
					],
					mjs003_huoqvbin: [
						'male',
						'qun',
						6,
						['mjs003_skill_mjs_fenglangjuxu', 'mjs003_skill_mjs_heyijiawei', 'mjs003_skill_msjyingma'],
						[mjsImg('mjs003_huoqvbin.jpg'), 'die_audio']
					],
					mjs003_suwu: [
						'male',
						'qun',
						4,
						['mjs003_skill_mjhongyan', 'mjs003_skill_mjsniexue', 'mjs003_skill_mjshanshi'],
						[mjsImg('mjs003_suwu.jpg'), 'die_audio'],
						[]
					],
					mjs003_yangxianrong: [
						'female',
						'qun',
						4,
						['mjs003_skill_mjswufeiliuli', 'mjs003_skill_mjsfengluojinlao'],
						[mjsImg('mjs003_yangxianrong.jpg'), 'die_audio']
					],
					mjs003_wangjun: [
						'male',
						'qun',
						6,
						['mjs003_skill_mjsrongjinduansuo', 'mjs003_skill_mjsanzhulouchuan'],
						[mjsImg('mjs003_wangjun.jpg'), 'die_audio'],
						[]
					],
					mjs003_zhanghan: [
						'male',
						'qun',
						6,
						['mjs003_skill_mjsxianmei', 'mjs003_skill_mjsshetushoubing'],
						[mjsImg('mjs003_zhanghan.jpg'), 'die_audio'],
						[]
					],
					mjs003_taoyuanming: [
						'male',
						'qun',
						4,
						['mjs003_skill_mjscaiju', 'mjs003_skill_mjsguiqv', 'mjs003_skill_mjstaohuayuan'],
						[mjsImg('mjs003_taoyuanming.jpg'), 'die_audio'],
						[]
					],
					mjs003_xielinyun: [
						'male',
						'qun',
						4,
						['mjs003_skill_mjsxieshi', 'mjs003_skill_mjsshanshui', 'mjs003_skill_mjschitang'],
						[mjsImg('mjs003_xielinyun.jpg'), 'die_audio'],
						[]
					],
					mjs003_baoyuan: [
						'male',
						'qun',
						9,
						['mjs003_skill_mjsbaizhanwujie', 'mjs003_skill_mjsluzhuanfenghui', 'mjs003_skill_mjsxuruizhuizhan'],
						[mjsImg('mjs003_baoyuan.jpg'), 'die_audio']
					]
				},
				translate: {
					mjs003_yingzheng: '嬴政',
					mjs003_lixin: '李信',
					mjs003_baiqi: '白起',
					mjs003_skill_mjs_jianmie: '歼灭',
					mjs003_skill_mjs_liaodi: '\uE006\uE007',
					mjs003_skill_mjs_chuqi: '\uE008\uE009',
					mjs003_mengtian: '蒙恬',
					mjs003_skill_mjs_zhongxin: '忠信',
					mjs003_skill_mjs_zhucheng: '\uE02A\uE02B',
					mjs003_wnag: '王异',
					mjs003_zahoshe: '赵奢',
					mjs003_junwnaghou: '君王后',
					mjs003_panan: '潘安',
					mjs003_lianpo: '廉颇',
					mjs003_skill_mjs_daowang: '\uE032\uE033',
					mjs003_skill_mjs_pancai: '\uE034\uE035',
					mjs003_skill_mjs_zhiguo: '\uE036\uE037',
					mjs003_longju: '龙且',
					mjs003_xunguan: '荀灌',
					mjs003_simayan: '司马炎',
					mjs003_weihuacun: '魏华存',
					mjs003_caoren: '曹仁',
					mjs003_wangdao: '王导',
					mjs003_zudi: '祖逖',
					mjs003_simarui: '司马睿',
					mjs003_zuoci: '左慈',
					mjs003_zhaoyun: '赵云',
					mjs003_huoqvbin: '霍去病',
					mjs003_suwu: '苏武',
					mjs003_yangxianrong: '羊献容',
					mjs003_wangjun: '王濬',
					mjs003_zhanghan: '章邯',
					mjs003_taoyuanming: '陶渊明',
					mjs003_luxun: '陆逊',
					mjs003_weijie: '卫玠',
					mjs003_baoyuan: '暴鸢',
					mjs003_xielinyun: '谢灵运',
					qin: '<span style="font-weight:900;font-size:1.15em;letter-spacing:2px;color:#1a1408;text-shadow:2px 2px 0 #fff,-1px -1px 0 #fff,1px -1px 0 #fff,-1px 1px 0 #fff;">秦</span>',
					zhao: '<span style="font-weight:900;font-size:1.15em;letter-spacing:2px;color:#b0582c;text-shadow:2px 2px 0 #fff,-1px -1px 0 #fff,1px -1px 0 #fff,-1px 1px 0 #fff;">赵</span>',
					qi: '<span style="font-weight:900;font-size:1.15em;letter-spacing:2px;color:#492c48;text-shadow:2px 2px 0 #fff,-1px -1px 0 #fff,1px -1px 0 #fff,-1px 1px 0 #fff;">齐</span>',
					han_1:
						'<span style="font-weight:900;font-size:1.15em;letter-spacing:2px;color:#6e803e;text-shadow:2px 2px 0 #fff,-1px -1px 0 #fff,1px -1px 0 #fff,-1px 1px 0 #fff;">韩</span>',
					xijin:
						'<span style="font-weight:900;font-size:1.15em;letter-spacing:2px;color:#5c88a8;text-shadow:2px 2px 0 #fff,-1px -1px 0 #fff,1px -1px 0 #fff,-1px 1px 0 #fff;">西晋</span>',
					dongjin:
						'<span style="font-weight:900;font-size:1.15em;letter-spacing:2px;color:#556c7c;text-shadow:2px 2px 0 #fff,-1px -1px 0 #fff,1px -1px 0 #fff,-1px 1px 0 #fff;">东晋</span>',
					caowei:
						'<span style="font-weight:900;font-size:1.15em;letter-spacing:2px;color:#2f3b62;text-shadow:2px 2px 0 #fff,-1px -1px 0 #fff,1px -1px 0 #fff,-1px 1px 0 #fff;">曹魏</span>',
					xishu:
						'<span style="font-weight:900;font-size:1.15em;letter-spacing:2px;color:#5a1518;text-shadow:2px 2px 0 #fff,-1px -1px 0 #fff,1px -1px 0 #fff,-1px 1px 0 #fff;">西蜀</span>',
					sunwu:
						'<span style="font-weight:900;font-size:1.15em;letter-spacing:2px;color:#175121;text-shadow:2px 2px 0 #fff,-1px -1px 0 #fff,1px -1px 0 #fff,-1px 1px 0 #fff;">孙吴</span>',
					xichu:
						'<span style="font-weight:900;font-size:1.15em;letter-spacing:2px;color:#969799;text-shadow:2px 2px 0 #fff,-1px -1px 0 #fff,1px -1px 0 #fff,-1px 1px 0 #fff;">西楚</span>',
					donghan:
						'<span style="font-weight:900;font-size:1.15em;letter-spacing:2px;color:#b44d45;text-shadow:2px 2px 0 #fff,-1px -1px 0 #fff,1px -1px 0 #fff,-1px 1px 0 #fff;">东汉</span>',
					xihan:
						'<span style="font-weight:900;font-size:1.15em;letter-spacing:2px;color:#8f2f2a;text-shadow:2px 2px 0 #fff,-1px -1px 0 #fff,1px -1px 0 #fff,-1px 1px 0 #fff;">西汉</span>'
				},
				characterSort: {
					名将杀: {
						qin: ['mjs003_yingzheng', 'mjs003_lixin', 'mjs003_baiqi', 'mjs003_mengtian', 'mjs003_zhanghan'],
						zhao: ['mjs003_zahoshe', 'mjs003_lianpo'],
						qi: ['mjs003_junwnaghou'],
						han_1: ['mjs003_baoyuan'],
						caowei: ['mjs003_wnag', 'mjs003_caoren'],
						xishu: ['mjs003_zhaoyun'],
						sunwu: ['mjs003_luxun'],
						xijin: [
							'mjs003_panan',
							'mjs003_xunguan',
							'mjs003_simayan',
							'mjs003_weihuacun',
							'mjs003_yangxianrong',
							'mjs003_wangjun',
							'mjs003_weijie'
						],
						dongjin: ['mjs003_wangdao', 'mjs003_zudi', 'mjs003_simarui', 'mjs003_taoyuanming', 'mjs003_xielinyun'],
						xichu: ['mjs003_longju'],
						donghan: ['mjs003_zuoci'],
						xihan: ['mjs003_huoqvbin', 'mjs003_suwu']
					}
				}
			},
			card: {
				card: {
					mjs003_card_mjs_chi: {
						fullskin: true,
						type: 'basic',
						enable: true,
						notarget: true,
						global: 'mjs003_skill_g_mjs_chi',
						content: function () {
							var list = player.getCards('he', function (card) {
								return lib.filter.cardDiscardable(card, player, 'mjs003_card_mjs_chi')
							})
							if (list.length) player.discard(list.randomGets(1))
						},
						ai: {
							value: -5,
							useful: 6,
							order: 1,
							result: {
								player: function (player) {
									if (player.countCards('he') >= 4) return 1
									return -1
								}
							}
						}
					},
					mjs003_card_mjs_ju: {
						type: 'mjsju',
						enable: false,
						wuxieable: false,
						selectTarget: -1,
						filterTarget: function () {
							return false
						},
						cardPrompt: function () {
							return '无法被打出。回合开始/结束时，将此牌洗入牌堆，然后摸等量的牌（自动，无需确认）。'
						}
					},
					mjs003_card_mjs_yujian: {
						fullskin: true,
						type: 'equip',
						subtype: 'equip1',
						distance: {
							attackFrom: -2
						},
						skills: ['mjs003_skill_mjs_yujian_thunder', 'mjs003_skill_mjs_yujian_sha'],
						ai: {
							equipValue: 4
						}
					}
				},
				translate: {
					mjs003_card_mjs_ju: '菊',
					mjsju: '菊',
					mjs003_card_mjs_ju_info: '♣1。无法被打出。回合开始/结束时，将此牌洗入牌堆，然后摸等量的牌。',
					mjs003_card_mjs_chi: '笞',
					mjs003_card_mjs_chi_info: '出牌阶段，你可以使用此牌：随机弃置你的1张牌。此牌被弃置时，你失去1点体力。',
					mjs003_card_mjs_yujian: '玉剑',
					mjs003_card_mjs_yujian_info:
						'攻击范围2。锁定技，抵消你受到的雷电伤害。当你打出的【杀】即将造成伤害时，你可以将此伤害改为令目标失去等量体力。'
				}
			},
			skill: {
				skill: {
					mjs003_skill_g_mjs_chi: {
						cardSkill: true,
						trigger: {
							player: 'loseAfter',
							global: 'loseAsyncAfter'
						},
						forced: true,
						popup: false,
						filter: function (event, player) {
							if (event.type != 'discard' || event.getlx === false) return false
							var map = event.getl && event.getl(player)
							if (!map || !Array.isArray(map.hs) || !map.hs.length) return false
							return map.hs.some(function (card) {
								return get.name(card, player) == 'mjs003_card_mjs_chi'
							})
						},
						content: function () {
							var map = trigger.getl(player)
							var num = map.hs.filter(function (card) {
								return get.name(card, player) == 'mjs003_card_mjs_chi'
							}).length
							game.log(player, '触发了', '#g【笞】', '的效果')
							player.loseHp(num)
						}
					},
					mjs003_skill_mjs_yujian_thunder: {
						equipSkill: true,
						trigger: {
							player: 'damageBegin4'
						},
						forced: true,
						popup: false,
						filter: function (event, player) {
							if (event.nature != 'thunder') return false
							if (player.hasSkillTag('unequip2')) return false
							if (
								event.source &&
								event.source.hasSkillTag('unequip', false, {
									name: event.card ? event.card.name : null,
									target: player,
									card: event.card
								})
							)
								return false
							return true
						},
						content: function () {
							trigger.cancel()
							game.log(player, '的【玉剑】抵消了雷电伤害')
						}
					},
					mjs003_skill_mjs_yujian_sha: {
						direct: true,
						equipSkill: true,
						trigger: {
							source: 'damageBefore'
						},
						filter: function (event, player) {
							if (!event.card || event.card.name != 'sha') return false
							if (player.hasSkillTag('unequip2')) return false
							if (!(event.num > 0)) return false
							if (
								player.hasSkillTag('unequip', false, {
									name: event.card.name,
									target: event.player,
									card: event.card
								})
							)
								return false
							return true
						},
						content: function () {
							'step 0'
							player
								.chooseBool('玉剑：是否将此伤害改为令' + get.translation(trigger.player) + '失去等量体力？')
								.set('ai', function () {
									return get.attitude(player, trigger.player) < 0
								})
							'step 1'
							if (result.bool) {
								player.logSkill('mjs003_skill_mjs_yujian_sha', trigger.player)
								trigger.cancel()
								trigger.player.loseHp(trigger.num)
							}
						}
					},
					mjs003_skill_mjs_fenglangjuxu: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						trigger: {
							source: 'dying'
						},
						filter: function (event, player) {
							if (!event.player || event.player == player) return false
							return lib.skill.mjs003_skill_mjs_fenglangjuxu.transferableSkills(event.player).length > 0
						},
						direct: true,
						content: function () {
							'step 0'
							var target = trigger.player
							var skills = lib.skill.mjs003_skill_mjs_fenglangjuxu.transferableSkills(target)
							player
								.chooseControl(skills, 'cancel2')
								.set(
									'choiceList',
									skills.map(function (i) {
										return (
											'<div class="skill">【' +
											get.translation(i) +
											'】</div><div>' +
											get.skillInfoTranslation(i, target) +
											'</div>'
										)
									})
								)
								.set('displayIndex', false)
								.set('prompt', '封狼居胥：转移' + get.translation(target) + '的一个技能')
								.set('ai', function () {
									var choices = _status.event.controls.slice(0)
									choices.remove('cancel2')
									if (!choices.length) return 'cancel2'
									var negs = choices.filter(function (i) {
										var info = get.info(i)
										return info && info.ai && (info.ai.neg || info.ai.halfneg)
									})
									if (negs.length) return negs.randomGet()
									var limits = choices.filter(function (i) {
										var info = get.info(i)
										return info && (info.limited || info.juexing)
									})
									if (limits.length) return limits.randomGet()
									return choices.randomGet()
								})
							'step 1'
							if (result.control == 'cancel2') {
								event.finish()
								return
							}
							var skill = result.control
							var target = trigger.player
							player.logSkill('mjs003_skill_mjs_fenglangjuxu', target)
							var alreadyHas = player.hasSkill(skill)
							var hasStorage = Object.prototype.hasOwnProperty.call(target.storage, skill)
							var backupStorage = hasStorage ? target.storage[skill] : null
							var wasAwakened = target.awakenedSkills.contains(skill)
							var wasDisabled = target.disabledSkills[skill] ? target.disabledSkills[skill].slice(0) : null
							var tempExpire = target.tempSkills[skill]
							target.removeSkill(skill)
							if (alreadyHas) {
								game.log(
									player,
									'已拥有',
									'#g【' + get.translation(skill) + '】',
									'，不会重复获得；',
									target,
									'失去了该技能'
								)
							} else {
								if (tempExpire !== undefined) {
									player.addTempSkill(skill, tempExpire)
								} else {
									player.addSkill(skill)
								}
								if (lib.__mjsGuardFilter) lib.__mjsGuardFilter(skill)
								if (hasStorage) player.storage[skill] = backupStorage
								if (wasAwakened) player.awakenedSkills.add(skill)
								if (wasDisabled) {
									for (var i = 0; i < wasDisabled.length; i++) {
										player.disableSkill(wasDisabled[i], skill)
									}
								}
								game.log(player, '转移了', target, '的技能', '#g【' + get.translation(skill) + '】')
							}
						},
						transferableSkills: function (target) {
							return target.getSkills(null, false, false).filter(function (skill) {
								var info = get.info(skill)
								if (!info) return false
								if (info.charlotte) return false
								if (info.zhuSkill) return false
								if (info.fixed) return false
								if (get.skillInfoTranslation(skill, target).length == 0) return false
								return true
							})
						}
					},
					mjs003_skill_mjs_heyijiawei: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						trigger: {
							player: 'phaseEnd'
						},
						filter: function (event, player) {
							return !player.getStat('damage')
						},
						direct: true,
						content: function () {
							'step 0'
							player
								.chooseBool('何以家为：是否摸三张牌并立即进行一个额外出牌阶段？（此阶段结束时，你失去1点体力上限）')
								.set('ai', function () {
									var player = _status.event.player
									if (player.maxHp <= 1) return false
									if (player.countCards('h') <= 1) return true
									if (player.maxHp <= 2) return false
									return true
								})
							'step 1'
							if (!result.bool) {
								event.finish()
								return
							}
							player.logSkill('mjs003_skill_mjs_heyijiawei')
							player.draw(3)
							'step 2'
							var next = player.phaseUse()
							next.mjs003_skill_mjs_heyijiawei = true
							event.next.remove(next)
							trigger.next.push(next)
							player.addTempSkill('mjs003_skill_mjs_heyijiawei_cost')
						},
						subSkill: {
							cost: {
								trigger: {
									player: 'phaseUseEnd'
								},
								charlotte: true,
								forced: true,
								popup: false,
								filter: function (event, player) {
									return event.mjs003_skill_mjs_heyijiawei
								},
								content: function () {
									player.loseMaxHp()
								}
							}
						}
					},
					mjs003_skill_msjyingma: {
						trigger: {
							source: 'damageSource'
						},
						direct: true,
						content: () => {
							player.draw()
						}
					},
					mjs003_skill_mjsqijin: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						trigger: {
							player: ['useCardAfter', 'respondAfter']
						},
						forced: true,
						popup: false,
						silent: true,
						priority: 2,
						filter: function (event, player) {
							if (!event.card || (event.card.name != 'sha' && event.card.name != 'shan')) return false
							return true
						},
						content: function () {
							game.trySkillAudio('mjs003_skill_mjsqijin', player, true)
							player.storage.mjs003_skill_mjsqijin = (player.storage.mjs003_skill_mjsqijin || 0) + 1
							if (player.storage.mjs003_skill_mjsqijin == 1) player.markSkill('mjs003_skill_mjsqijin')
							player.updateMarks()
							if (player.storage.mjs003_skill_mjsqijin % 3 == 0) {
								player.storage.mjs003_skill_mjsqijin_hand = (player.storage.mjs003_skill_mjsqijin_hand || 0) + 1
								player.storage.mjs003_skill_mjsqijin_sha = (player.storage.mjs003_skill_mjsqijin_sha || 0) + 1
								game.log(player, '累计打出三张杀或闪，手牌上限+1、出牌阶段出杀次数+1')
							}
						},
						mod: {
							maxHandcard: function (player, num) {
								return num + (player.storage.mjs003_skill_mjsqijin_hand || 0)
							},
							cardUsable: function (card, player, num) {
								if (card.name == 'sha') return num + (player.storage.mjs003_skill_mjsqijin_sha || 0)
							},
							aiOrder: (player, card, num) => {
								if (card.name != 'sha' && card.name != 'shan') return num
								var evt = _status.event
								if (!evt || evt.name != 'chooseToUse' || evt.type != 'phase') return num
								var keep = player.countCards('h', function (c) {
									return c.name == 'sha' || c.name == 'shan'
								})
								if (keep <= 2) return -2
								return num
							}
						},
						marktext: '<span></span>',
						intro: {
							name: '七进七出',
							markcount: (storage, player) => ('一二三四五六七八九十'[storage - 1] || storage) + '进',
							content: (storage, player) =>
								'已累计打出' +
								(storage || 0) +
								'张杀或闪（每3张：手牌上限+1、出杀次数+1）；当前：手牌上限+' +
								(player.storage.mjs003_skill_mjsqijin_hand || 0) +
								'、出杀+' +
								(player.storage.mjs003_skill_mjsqijin_sha || 0)
						}
					},
					mjs003_skill_mjsshidan: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						trigger: {
							player: ['useCardAfter', 'respondAfter']
						},
						direct: true,
						filter: function (event, player) {
							if (!event.card || event.card.name != 'shan') return false
							return player.hasSha()
						},
						content: function () {
							'step 0'
							player.logSkill('mjs003_skill_mjsshidan')
							player
								.chooseToUse('是胆：是否使用一张杀？', function (card, player) {
									return card.name == 'sha'
								})
								.set('respondTo', trigger.respondTo || [trigger.player, trigger.card])
						},
						group: ['mjs003_skill_mjsshidan_sha'],
						subSkill: {
							sha: {
								enable: ['chooseToRespond', 'chooseToUse'],
								filterCard: {
									name: 'shan'
								},
								viewAs: {
									name: 'sha',
									isCard: true
								},
								viewAsFilter: function (player) {
									return player.countCards('h', { name: 'shan' }) > 0
								},
								position: 'hs',
								prompt: '是胆：将一张闪当杀打出',
								check: function () {
									return 1
								},
								ai: {
									order: function (item, player) {
										var evt = _status.event
										if (evt && evt.name == 'chooseToUse' && evt.type == 'phase') {
											var keep = player.countCards('h', function (c) {
												return c.name == 'sha' || c.name == 'shan'
											})
											if (keep <= 2) return 0
										}
										return 2.9
									},
									respondSha: true,
									skillTagFilter: function (player) {
										return player.countCards('hs', { name: 'shan' }) > 0
									},
									result: {
										player: 1
									},
									threaten: 1.5
								}
							}
						}
					},
					mjs003_skill_mjsrulong: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:3',
						trigger: {
							player: ['useCardAfter', 'respondAfter']
						},
						forced: true,
						popup: false,
						silent: true,
						filter: function (event, player) {
							if (!event.card || event.card.name != 'sha') return false
							return true
						},
						content: function () {
							game.trySkillAudio('mjs003_skill_mjsrulong', player, true)
							player.draw()
						},
						group: ['mjs003_skill_mjsrulong_shan'],
						subSkill: {
							shan: {
								enable: ['chooseToRespond', 'chooseToUse'],
								filterCard: {
									name: 'sha'
								},
								viewAs: {
									name: 'shan',
									isCard: true
								},
								viewAsFilter: function (player) {
									return player.countCards('h', { name: 'sha' }) > 0
								},
								position: 'hs',
								prompt: '如龙：将一张杀当闪打出',
								check: function () {
									return 1
								},
								ai: {
									order: function () {
										return 3.2
									},
									respondShan: true,
									skillTagFilter: function (player) {
										return player.countCards('hs', { name: 'sha' }) > 0
									},
									result: {
										player: 1
									},
									threaten: 1.5
								}
							}
						}
					},
					mjs003_skill_mjs_changcheng: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						forced: true,
						trigger: {
							global: 'roundStart'
						},
						filter: function (event, player) {
							return player.isAlive()
						},
						content: function () {
							game.trySkillAudio('mjs003_skill_mjs_changcheng', player, true)
							'step 0'
							var cards = get.cards(8)
							event._cards = cards
							player.$draw(cards.length)
							game.log(player, '翻开了牌堆顶的' + get.cnNumber(cards.length) + '张牌')
							var shanCards = []
							for (var i = 0; i < cards.length; i++) {
								if (cards[i].name == 'shan') shanCards.push(cards[i])
							}
							event._shanCards = shanCards
							if (shanCards.length) {
								player.addToExpansion(shanCards, 'draw').gaintag.add('mjs003_skill_mjs_changcheng_tag')
								game.log(player, '将' + get.cnNumber(shanCards.length) + '张【闪】放入了万里长城')
							}
							'step 1'
							var shanCards = event._shanCards || []
							var remaining = []
							for (var i = 0; i < event._cards.length; i++) {
								if (!shanCards.contains(event._cards[i])) remaining.push(event._cards[i])
							}
							if (!remaining.length) {
								event.finish()
								return
							}
							event._remaining = remaining
							var dialog = ui.create.dialog('万里长城：将剩余牌按原顺序放回牌堆顶，或弃置')
							dialog.add(remaining)
							var controls = []
							controls.push('放回牌堆顶')
							controls.push('弃置')
							player
								.chooseControl(controls)
								.set('dialog', dialog)
								.set('ai', function () {
									return 0
								})
							'step 2'
							if (result.control == '放回牌堆顶') {
								var cards = event._remaining
								for (var i = cards.length - 1; i >= 0; i--) {
									ui.cardPile.insertBefore(cards[i], ui.cardPile.firstChild)
								}
								game.log(player, '将' + get.cnNumber(cards.length) + '张牌按原顺序放回了牌堆顶')
							} else {
								game.cardsGotoSpecial(event._remaining)
								game.log(player, '弃置了' + get.cnNumber(event._remaining.length) + '张牌')
							}
						},

						group: ['mjs003_skill_mjs_changcheng2'],
						onremove: function (player) {
							var cards = player.getExpansions('mjs003_skill_mjs_changcheng_tag')
							if (cards.length) player.loseToDiscardpile(cards)
							player.unmarkSkill('mjs003_skill_mjs_changcheng_tag')
						}
					},
					mjs003_skill_mjs_changcheng2: {
						audio: 'mjs003_skill_mjs_changcheng',
						usable: 1,
						trigger: {
							global: ['chooseToRespondBefore', 'chooseToUseBefore']
						},
						filter: function (event, player) {
							if (event.responded) return false
							if (event.mjs003_skill_mjs_changcheng2) return false
							if (event.mjs003_skill_mjs_qinnu_trigger) return false
							var current = event.player
							if (current.group != player.group) return false
							if (current.group == 'ye') return false
							if (!event.filterCard({ name: 'shan' }, current, event)) return false
							return player.getExpansions('mjs003_skill_mjs_changcheng_tag').length > 0
						},
						content: function () {
							'step 0'
							var current = trigger.player
							event._current = current
							var shans = player.getExpansions('mjs003_skill_mjs_changcheng_tag')
							player
								.chooseCardButton('是否从万里长城中替' + get.translation(current) + '打出一张闪？', 1, shans)
								.set('ai', function (button) {
									var player = _status.event.player
									var current = _status.event.getParent().trigger.player
									if (get.attitude(player, current) <= 0) return 0
									return 1
								})
							'step 1'
							if (result.bool) {
								var card = result.links[0]
								event._card = card
								player.loseToDiscardpile(card)._triggered = null
							} else {
								event.finish()
							}
							'step 2'
							trigger.result = {
								bool: true,
								card: { name: 'shan', isCard: true }
							}
							trigger.responded = true
							trigger.animate = false
							trigger.mjs003_skill_mjs_changcheng2 = true
							game.log(player, '从万里长城中替' + get.translation(event._current) + '打出了一张闪')
						},
						ai: {
							respondShan: true,
							skillTagFilter: function (player) {
								if (player.getExpansions('mjs003_skill_mjs_changcheng_tag').length <= 0) return false
								return game.hasPlayer(function (current) {
									return current != player && current.group == player.group
								})
							}
						}
					},
					mjs003_skill_mjs_changcheng_tag: {
						intro: {
							markcount: 'expansion',
							mark: function (dialog, content, player) {
								var content = player.getExpansions('mjs003_skill_mjs_changcheng_tag')
								if (content && content.length) {
									if (player == game.me || player.isUnderControl()) {
										dialog.addAuto(content)
									} else {
										return '共有' + get.cnNumber(content.length) + '张闪'
									}
								}
							},
							content: function (content, player) {
								var content = player.getExpansions('mjs003_skill_mjs_changcheng_tag')
								if (content && content.length) {
									if (player == game.me || player.isUnderControl()) {
										return get.translation(content)
									}
									return '共有' + get.cnNumber(content.length) + '张闪'
								}
							}
						}
					},
					mjs003_skill_mjs_qinnu: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						enable: 'phaseUse',
						usable: 1,
						filter: function (event, player) {
							return true
						},
						content: function () {
							'step 0'
							var cards = get.cards(8)
							event._cards = cards
							event._shaCards = []
							event._targets = []
							player.$draw(cards.length)
							game.log(player, '翻开了牌堆顶的' + get.cnNumber(cards.length) + '张牌')
							for (var i = 0; i < cards.length; i++) {
								if (cards[i].name == 'sha') event._shaCards.push(cards[i])
							}
							if (event._shaCards.length) {
								game.log(player, '找到了' + get.cnNumber(event._shaCards.length) + '张【杀】')
								event._shaIndex = 0
								event.goto(1)
							} else {
								game.log(player, '没有找到【杀】')
								event.goto(5)
							}
							'step 1'
							if (event._shaIndex < event._shaCards.length) {
								var sha = event._shaCards[event._shaIndex]
								event._currentSha = sha
								var availableTargets = game.filterPlayer(function (target) {
									return target != player && !event._targets.contains(target)
								})
								if (!availableTargets.length) {
									game.log(player, '没有可用目标，剩余的【杀】将被弃置')
									event.goto(3)
									return
								}
								var dialog = ui.create.dialog('秦弩：为第' + get.cnNumber(event._shaIndex + 1) + '张【杀】选择一个目标')
								dialog.add([sha])
								player
									.chooseTarget(dialog, function (card, player, target) {
										return target != player && !event._targets.contains(target)
									})
									.set('ai', function (target) {
										var effect = get.effect(target, { name: 'sha' }, player, player)
										var attitude = get.attitude(player, target)
										if (attitude < 0) return effect
										return effect * 0.5
									})
							} else {
								event.goto(3)
							}
							'step 2'
							if (result.bool) {
								var target = result.targets[0]
								event._targets.push(target)
								game.log(player, '为第' + get.cnNumber(event._shaIndex + 1) + '张【杀】选择了', target)
								event._shaIndex++
								event.goto(1)
							} else {
								event.goto(3)
							}
							'step 3'
							if (event._targets.length) {
								event._useIndex = 0
								event.goto(4)
							} else {
								event.goto(5)
							}
							'step 4'
							if (event._useIndex < event._shaCards.length && event._useIndex < event._targets.length) {
								var sha = event._shaCards[event._useIndex]
								var target = event._targets[event._useIndex]
								game.log(player, '对', target, '使用了', sha)
								player.useCard(sha, target, false).set('mjs003_skill_mjs_qinnu_trigger', true)
								event._useIndex++
								event.redo()
							} else {
								event.goto(5)
							}
							'step 5'
							var remaining = []
							for (var i = 0; i < event._cards.length; i++) {
								if (!event._shaCards || !event._shaCards.contains(event._cards[i])) {
									remaining.push(event._cards[i])
								}
							}
							if (!remaining.length) {
								event.finish()
								return
							}
							event._remaining = remaining
							var dialog = ui.create.dialog('秦弩：将剩余牌按原顺序放回牌堆顶，或弃置')
							dialog.add(remaining)
							player
								.chooseControl('放回牌堆顶', '弃置')
								.set('dialog', dialog)
								.set('ai', function () {
									return 0
								})
							'step 6'
							if (result.control == '放回牌堆顶') {
								var cards = event._remaining
								for (var i = cards.length - 1; i >= 0; i--) {
									ui.cardPile.insertBefore(cards[i], ui.cardPile.firstChild)
								}
								game.log(player, '将' + get.cnNumber(cards.length) + '张牌按原顺序放回了牌堆顶')
							} else {
								game.cardsGotoSpecial(event._remaining)
								game.log(player, '弃置了' + get.cnNumber(event._remaining.length) + '张牌')
							}
						},
						ai: {
							order: 9,
							result: {
								player: 1
							},
							threaten: 1.5
						}
					},
					mjs003_skill_mjs_yitong: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						trigger: {
							global: 'damageSource'
						},
						filter: function (event, player) {
							return !!(event.source && event.source.group == player.group)
						},
						direct: true,
						content: function () {
							'step 0'
							var target = trigger.player
							if (target == player) {
								event.finish()
								return
							}
							event._target = target
							var controls = ['吞并', '下野']
							player
								.chooseControl(controls)
								.set('prompt', '一统：你可以选择一项')
								.set('ai', function () {
									var attitude = get.attitude(player, target)
									if (attitude > 0) return 0
									return 1
								})
							'step 1'
							if (result.control == '吞并') {
								event._target.changeGroup(player.group)
								game.log(player, '将', event._target, '的势力改为与', player, '相同')
								player.logSkill('mjs003_skill_mjs_yitong')
							} else {
								event._target.group = 'ye'
								game.log(player, '令', event._target, '下野')
								player.logSkill('mjs003_skill_mjs_yitong')
							}
							'step 2'
							var groups = []
							var allPlayers = game.players.slice(0).concat(game.dead.slice(0))
							for (var i = 0; i < allPlayers.length; i++) {
								if (allPlayers[i].isOut()) continue
								if (allPlayers[i].group == 'ye') continue
								if (!groups.contains(allPlayers[i].group)) {
									groups.push(allPlayers[i].group)
								}
							}
							var onlyYeAndSelf = false
							if (groups.length <= 2) {
								if (groups.contains('ye') && groups.contains(player.group)) {
									onlyYeAndSelf = true
								} else if (groups.length <= 1) {
									onlyYeAndSelf = true
								}
							}
							if (onlyYeAndSelf && !player.storage.mjs003_skill_mjs_yitong_triggered) {
								player.storage.mjs003_skill_mjs_yitong_triggered = true
								player.recover(player.maxHp - player.hp)
								game.log(player, '回复了全部体力')
								player.$skill('一统', 'legend', 'orange')
							}
						},
						ai: {
							threaten: 1.5
						},
						group: ['mjs003_skill_mjs_yitong_phase'],
						subSkill: {
							phase: {
								audio: 'mjs003_skill_mjs_yitong',
								trigger: {
									player: 'phaseBegin'
								},
								filter: function (event, player) {
									return player.storage.mjs003_skill_mjs_yitong_triggered
								},
								forced: true,
								content: function () {
									'step 0'
									event._targets = []
									for (var i = 0; i < game.players.length; i++) {
										if (game.players[i].group == 'ye') {
											event._targets.push(game.players[i])
										}
									}
									event._index = 0
									'step 1'
									if (event._index < event._targets.length) {
										var target = event._targets[event._index]
										var cards = target.getCards('hej')
										if (cards.length) {
											var card = cards.randomGet()
											player.gain(card, target, 'give')
											game.log(player, '从', target, '处获得了一张牌')
										}
										event._index++
										event.redo()
									}
								},
								sub: true,
								parentskill: 'mjs003_skill_mjs_yitong'
							}
						}
					},
					mjs003_skill_mjs_jianmie: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						trigger: {
							player: 'useCard',
							source: 'damageEnd'
						},
						filter: function (event, player) {
							if (!event.card || event.card.name != 'sha') return false
							var shaTargets = []
							if (event.name == 'useCard') {
								shaTargets = event.targets || []
							} else {
								if (event.player) shaTargets = [event.player]
							}
							return game.hasPlayer(function (target) {
								return target != player && !shaTargets.contains(target) && target.countCards('hej') > 0
							})
						},
						direct: true,
						content: function () {
							'step 0'
							var shaTargets = []
							if (trigger.name == 'useCard') {
								shaTargets = (trigger.targets || []).slice(0)
							} else {
								if (trigger.player) shaTargets = [trigger.player]
							}
							player
								.chooseTarget(
									'歼灭：弃置一名角色区域内的一张牌（不能选择此【杀】的目标）',
									function (card, player, target) {
										return (
											target != player && !_status.event.shaTargets.contains(target) && target.countCards('hej') > 0
										)
									}
								)
								.set('ai', function (target) {
									var player = _status.event.player
									var att = get.attitude(player, target)
									if (att >= 0) return 0
									var val = -att * 2
									var es = target.getCards('e')
									for (var i = 0; i < es.length; i++) {
										var sub = get.subtype(es[i])
										if (sub == 'equip2') val += 8
										else if (sub == 'equip4') val += 5
										else val += 2
									}
									if (target.countCards('h') >= 3) val += 2
									if (target.hp <= 2) val += 1
									return val
								})
								.set('shaTargets', shaTargets)
							'step 1'
							if (result.bool) {
								var target = result.targets[0]
								player.logSkill('mjs003_skill_mjs_jianmie', target)
								player.discardPlayerCard(target, 'hej', true)
							}
						},
						ai: {
							threaten: 1.5,
							effect: {
								player: function (card, player, target) {
									if (!card || card.name != 'sha') return
									if (target == player) return
									if (get.attitude(player, target) >= 0) return
									var hasTarget = game.hasPlayer(function (current) {
										if (get.attitude(player, current) >= 0) return false
										if (
											current.countCards('e', function (eq) {
												return get.subtype(eq) == 'equip2' || get.subtype(eq) == 'equip4'
											})
										)
											return true
										if (current.countCards('h') >= 3) return true
										return false
									})
									if (
										hasTarget &&
										game.hasPlayer(function (current) {
											return (
												current != player &&
												current != target &&
												get.attitude(player, current) < 0 &&
												current.countCards('hej') > 0
											)
										})
									)
										return [1, 4]
								}
							}
						}
					},
					mjs003_skill_mjs_liaodi: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						trigger: {
							global: 'loseEnd'
						},
						filter: function (event, player) {
							if (event.player == player) return false
							if (event.player.countCards('h') > 0) return false
							for (var i = 0; i < event.cards.length; i++) {
								if (event.cards[i].original == 'h') return true
							}
							return false
						},
						direct: true,
						content: function () {
							game.trySkillAudio('mjs003_skill_mjs_liaodi', player, true)
							'step 0'
							var target = trigger.player
							player
								.chooseToUse('料敌：是否对' + get.translation(target) + '使用一张杀？', function (card, player) {
									return card.name == 'sha'
								})
								.set('target', target)
								.set('filterTarget', function (card, player, target) {
									return target == _status.event.target
								})
								.set('ai', function () {
									var target = trigger.player
									var eff = get.effect(target, { name: 'sha' }, player, player)
									if (eff <= 0) return 0
									if (player.hasSha()) return eff
									return 0
								})
						},
						ai: {
							threaten: 1.5
						}
					},
					mjs003_skill_mjs_chuqi: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						group: ['mjs003_skill_mjs_chuqi_gain'],
						enable: ['chooseToUse', 'chooseToRespond'],
						filter: function (event, player) {
							if (_status.currentPhase == player) return false
							if (player.storage.mjs003_skill_mjs_chuqi_used) return false
							if (!player.countCards('h')) return false
							var names = ['sha', 'shan', 'tao', 'jiu']
							for (var i = 0; i < names.length; i++) {
								if (event.filterCard({ name: names[i] }, player, event)) return true
							}
							return false
						},
						hiddenCard: function (player, name) {
							if (['sha', 'shan', 'tao', 'jiu'].indexOf(name) == -1) return false
							if (_status.currentPhase == player) return false
							if (player.storage.mjs003_skill_mjs_chuqi_used) return false
							return player.countCards('h') > 0
						},
						chooseButton: {
							dialog: function (event, player) {
								var names = ['sha', 'shan', 'tao', 'jiu']
								var list = []
								for (var i = 0; i < names.length; i++) {
									if (event.filterCard({ name: names[i] }, player, event)) {
										list.push(['基本', '', names[i]])
									}
									if (names[i] == 'sha') {
										for (var j = 0; j < lib.inpile_nature.length; j++) {
											if (event.filterCard({ name: 'sha', nature: lib.inpile_nature[j] }, player, event)) {
												list.push(['基本', '', 'sha', lib.inpile_nature[j]])
											}
										}
									}
								}
								return ui.create.dialog('出奇', [list, 'vcard'], 'hidden')
							},
							check: function (button) {
								var player = _status.event.player
								var pe = _status.event.getParent()
								var card = { name: button.link[2], nature: button.link[3] }
								if (pe.type == 'respondShan' && button.link[2] == 'shan') return 10
								if (
									pe.name == 'chooseToUse' &&
									pe.type != 'phase' &&
									pe.type != 'respondShan' &&
									button.link[2] == 'sha'
								)
									return 8
								switch (button.link[2]) {
									case 'shan':
										return 5
									case 'tao':
										return 4
									case 'sha': {
										if (button.link[3] == 'fire') return 2.95
										if (button.link[3] == 'thunder' || button.link[3] == 'ice') return 2.92
										return 2.9
									}
									case 'jiu':
										return 1
								}
								return 0
							},
							backup: function (links, player) {
								return {
									audio: 'mjs003_skill_mjs_chuqi',
									filterCard: function (card, player) {
										return true
									},
									selectCard: 1,
									position: 'h',
									viewAs: {
										name: links[0][2],
										nature: links[0][3],
										isCard: true
									},
									popname: true,
									precontent: function () {
										player.storage.mjs003_skill_mjs_chuqi_used = true
										player.addTempSkill('mjs003_skill_mjs_chuqi_reset', 'phaseAfter')
									}
								}
							},
							prompt: function (links, player) {
								return '将一张手牌当' + get.translation(links[0][3] || '') + get.translation(links[0][2]) + '使用或打出'
							}
						},
						subSkill: {
							reset: {
								onremove: function (player) {
									delete player.storage.mjs003_skill_mjs_chuqi_used
								},
								sub: true,
								parentskill: 'mjs003_skill_mjs_chuqi'
							},
							gain: {
								audio: 'mjs003_skill_mjs_chuqi',
								trigger: {
									player: ['useCard', 'respond']
								},
								forced: true,
								popup: false,
								filter: function (event, player) {
									return event.skill == 'mjs003_skill_mjs_chuqi_backup'
								},
								content: function () {
									var cardSha = get.cardPile(function (card) {
										return card.name == 'sha'
									})
									if (cardSha) {
										player.gain(cardSha, 'gain2')
										game.log(player, '获得了一张【杀】')
									}
								},
								sub: true,
								parentskill: 'mjs003_skill_mjs_chuqi'
							}
						},
						ai: {
							order: function () {
								return 3.2
							},
							respondSha: true,
							respondShan: true,
							skillTagFilter: function (player) {
								if (_status.currentPhase == player) return false
								if (player.storage.mjs003_skill_mjs_chuqi_used) return false
								return player.countCards('h') > 0
							},
							result: {
								player: 1
							},
							threaten: 1.5
						}
					},
					mjs003_skill_mjs_zhongxin: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						trigger: {
							global: 'useCardToTarget'
						},
						direct: true,
						filter: function (event, player) {
							if (event.card.name != 'sha') return false
							if (event.target == player || event.player == player) return false
							if (event.targets.length > 1) return false
							if (player.storage.mjs003_skill_mjs_zhongxin_used) return false
							return true
						},
						content: function () {
							'step 0'
							player
								.chooseBool(
									get.prompt('mjs003_skill_mjs_zhongxin', trigger.target),
									'将' + get.translation(trigger.card) + '的目标改为你'
								)
								.set('ai', function () {
									var evt = _status.event
									var target = evt.zhTarget,
										source = evt.zhSource,
										player = evt.player
									if (get.attitude(player, target) <= 0) return false
									var shu = 1 + (player.storage.mjs003_skill_mjs_zhucheng_add || 0)
									var safe = player.countCards('h', 'shan') > 0 || player.getEquip(2) || player.hp >= target.hp
									if (get.attitude(player, source) < 0) {
										if (safe) return true
										return shu >= 2 && player.hp > 2
									}
									if (target.hp <= 1 && (player.countCards('h', 'shan') > 0 || player.getEquip(2))) return true
									return shu >= 3 && player.hp > 2
								})
								.set('zhTarget', trigger.target)
								.set('zhSource', trigger.player)
							'step 1'
							if (result.bool) {
								player.logSkill('mjs003_skill_mjs_zhongxin', trigger.target)
								player.storage.mjs003_skill_mjs_zhongxin_used = true
								player.addTempSkill('mjs003_skill_mjs_zhongxin_reset', 'phaseAfter')
								trigger.getParent().targets.remove(trigger.target)
								trigger.getParent().triggeredTargets2.remove(trigger.target)
								trigger.getParent().targets.push(player)
								trigger.untrigger()
								trigger.player.line(player)
								game.log(player, '将', trigger.card, '的目标改为了自己')
							}
						},
						subSkill: {
							reset: {
								charlotte: true,
								onremove: function (player) {
									delete player.storage.mjs003_skill_mjs_zhongxin_used
								},
								sub: true,
								parentskill: 'mjs003_skill_mjs_zhongxin'
							}
						},
						ai: {
							threaten: 1.1
						}
					},
					mjs003_skill_mjs_zhucheng: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						forced: true,
						trigger: {
							target: 'useCardToTarget'
						},
						filter: function (event, player) {
							return event.card.name == 'sha'
						},
						content: function () {
							game.trySkillAudio('mjs003_skill_mjs_zhucheng', player, true)
							var num = 1 + (player.storage.mjs003_skill_mjs_zhucheng_add || 0)
							player.draw(num)
						},
						mark: true,
						marktext: '城',
						intro: {
							markcount: function (storage, player) {
								return 1 + (player.storage.mjs003_skill_mjs_zhucheng_add || 0)
							},
							content: function (storage, player) {
								return (
									'下次成为【杀】的目标时摸' +
									get.cnNumber(1 + (player.storage.mjs003_skill_mjs_zhucheng_add || 0)) +
									'张牌；若未受到该【杀】伤害则数量+1，直到你的下个回合开始'
								)
							}
						},
						group: ['mjs003_skill_mjs_zhucheng_dodge', 'mjs003_skill_mjs_zhucheng_reset'],
						subSkill: {
							dodge: {
								trigger: {
									target: 'shaUnhirt'
								},
								forced: true,
								silent: true,
								charlotte: true,
								filter: function (event, player) {
									return event.card && event.card.name == 'sha'
								},
								content: function () {
									if (!player.storage.mjs003_skill_mjs_zhucheng_add) player.storage.mjs003_skill_mjs_zhucheng_add = 0
									player.storage.mjs003_skill_mjs_zhucheng_add++
									player.updateMarks()
									game.log(
										player,
										'的【筑城】可摸牌数量增加到' + get.cnNumber(1 + player.storage.mjs003_skill_mjs_zhucheng_add) + '张'
									)
								},
								sub: true,
								parentskill: 'mjs003_skill_mjs_zhucheng',
								popup: false
							},
							reset: {
								trigger: {
									player: 'phaseBegin'
								},
								forced: true,
								silent: true,
								charlotte: true,
								content: function () {
									player.storage.mjs003_skill_mjs_zhucheng_add = 0
									player.updateMarks()
								},
								sub: true,
								parentskill: 'mjs003_skill_mjs_zhucheng',
								popup: false
							}
						},
						ai: {
							threaten: 1.1
						}
					},
					mjs003_skill_mjs_shezi: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						trigger: {
							player: 'damageEnd'
						},
						direct: true,
						filter: function (event, player) {
							return player.isAlive()
						},
						content: function () {
							'step 0'
							player
								.chooseTarget(get.prompt('mjs003_skill_mjs_shezi'), function (card, player, target) {
									return true
								})
								.set('ai', function (target) {
									var player = _status.event.player
									if (target == player && player.countCards('h') < player.getHandcardLimit()) return 10
									if (get.attitude(player, target) > 0 && target.countCards('h') < target.getHandcardLimit()) return 5
									if (get.attitude(player, target) < 0 && target.countCards('h') > target.getHandcardLimit()) return 3
									return 0
								})
							'step 1'
							if (result.bool) {
								var target = result.targets[0]
								player.logSkill('mjs003_skill_mjs_shezi', target)
								event._m_sheziTarget = target
								target.discard(target.getCards('h'))
							} else event.finish()
							'step 2'
							var target = event._m_sheziTarget
							if (target.isAlive()) {
								target.drawTo(target.getHandcardLimit())
							}
						},
						ai: {
							maixie: true,
							threaten: 0.8
						}
					},
					mjs003_skill_mjs_zhongzhen: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						trigger: {
							player: 'phaseJieshuBegin'
						},
						direct: true,
						filter: function (event, player) {
							return game.hasPlayer(function (current) {
								return current != player && current.countCards('h') != player.countCards('h')
							})
						},
						content: function () {
							'step 0'
							player
								.chooseTarget(get.prompt('mjs003_skill_mjs_zhongzhen'), function (card, player, target) {
									return target != player
								})
								.set('ai', function (target) {
									var player = _status.event.player
									var diff = Math.abs(target.countCards('h') - player.countCards('h'))
									if (diff < 1) return 0
									if (diff >= 2 && player.hp <= 1) return 0
									if (get.attitude(player, target) > 0 && target.countCards('h') < player.countCards('h'))
										return diff * 2
									if (get.attitude(player, target) < 0 && target.countCards('h') > player.countCards('h'))
										return diff * 2
									return 0
								})
							'step 1'
							if (result.bool) {
								var target = result.targets[0]
								player.logSkill('mjs003_skill_mjs_zhongzhen', target)
								var diff = target.countCards('h') - player.countCards('h')
								var absDiff = Math.abs(diff)
								if (diff < 0) {
									target.draw(-diff)
								} else if (diff > 0) {
									target.discard(target.getCards('h').randomGets(diff))
								}
								if (absDiff >= 2) {
									player.damage(1)
								}
							}
						},
						ai: {
							threaten: 0.9
						}
					},
					mjs003_skill_mjs_fenggong: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						enable: 'phaseUse',
						usable: 1,
						filterTarget: function (card, player, target) {
							return target != player
						},
						content: function () {
							'step 0'
							var next = target.phaseDiscard()
							event._phaseDiscardEvt = next
							'step 1'
							var evt = event._phaseDiscardEvt
							if (evt && evt.cards && evt.cards.length) {
								player.gain(evt.cards, 'gain2')
								game.log(player, '获得了' + get.cnNumber(evt.cards.length) + '张牌')
							}
						},
						ai: {
							order: 8,
							result: {
								target: function (player, target) {
									return -Math.max(0, target.needsToDiscard())
								}
							}
						}
					},
					mjs003_skill_mjs_xianglu: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						enable: 'phaseUse',
						usable: 1,
						filterTarget: function (card, player, target) {
							return target != player
						},
						content: function () {
							'step 0'
							var cards = get.cards(5)
							event._cards1 = cards
							var shaCards = [],
								otherCards = []
							for (var i = 0; i < cards.length; i++) {
								if (cards[i].name == 'sha') shaCards.push(cards[i])
								else otherCards.push(cards[i])
							}
							event._sha1 = shaCards
							player.showCards(cards)
							if (otherCards.length) player.gain(otherCards, 'gain2')
							event._idx1 = 0
							'step 1'
							if (event._idx1 >= event._sha1.length) {
								event.goto(2)
								return
							}
							var sha = event._sha1[event._idx1]
							target.useCard(sha, player)
							event._idx1++
							event.goto(1)
							'step 2'
							var cards = get.cards(5)
							event._cards2 = cards
							var shaCards = [],
								otherCards = []
							for (var i = 0; i < cards.length; i++) {
								if (cards[i].name == 'sha') shaCards.push(cards[i])
								else otherCards.push(cards[i])
							}
							event._sha2 = shaCards
							target.showCards(cards)
							if (otherCards.length) target.gain(otherCards, 'gain2')
							event._idx2 = 0
							'step 3'
							if (event._idx2 >= event._sha2.length) {
								event.finish()
								return
							}
							var sha = event._sha2[event._idx2]
							player.useCard(sha, target)
							event._idx2++
							event.goto(3)
						},
						ai: {
							order: 9,
							result: {
								target: function (player, target) {
									var handLimit = target.getHandcardLimit()
									var current = target.countCards('h')
									if (current >= handLimit - 1) return -3
									return -target.countCards('h')
								}
							}
						}
					},
					mjs003_skill_mjs_qiaojie: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						trigger: {
							target: 'useCardToTarget'
						},
						usable: 1,
						filter: function (event, player) {
							return get.type(event.card, 'trick') == 'trick' && event.player != player
						},
						content: function () {
							'step 0'
							game.trySkillAudio('mjs003_skill_mjs_qiaojie', player, true)
							trigger.excluded.push(player)
							'step 1'
							trigger.player.useCard({ name: 'sha' }, player)
						},
						ai: {
							threaten: 0.8,
							effect: {
								target: function (card, player, target) {
									if (get.type(card, 'trick') == 'trick' && player != target) return 0.5
								}
							}
						}
					},
					mjs003_skill_mjs_shiqin: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						trigger: {
							player: 'damageEnd'
						},
						usable: 1,
						direct: true,
						filter: function (event, player) {
							if (!event.source || !event.source.isAlive()) return false
							return event.source.hp > player.hp || event.source.countCards('h') > player.countCards('h')
						},
						content: function () {
							'step 0'
							event._hpUp = trigger.source.hp > player.hp
							event._cardUp = trigger.source.countCards('h') > player.countCards('h')
							if (event._hpUp && event._cardUp) {
								player
									.chooseControl('摸牌', '回复')
									.set('prompt', '事秦：选择一项')
									.set('ai', function () {
										return player.isDamaged() ? '回复' : '摸牌'
									})
							} else if (event._hpUp) event._result = { control: '摸牌' }
							else event._result = { control: '回复' }
							'step 1'
							event._choice = result.control
							var prompt = event._choice == '摸牌' ? '令一名角色摸1张牌' : '令一名角色回复1点体力'
							player
								.chooseTarget(prompt, function (card, player, target) {
									return true
								})
								.set('ai', function (target) {
									var player = _status.event.player
									if (event._choice == '摸牌') return get.attitude(player, target)
									return get.attitude(player, target) * (target.isDamaged() ? 1 : 0.1)
								})
							'step 2'
							if (result.bool) {
								var target = result.targets[0]
								player.logSkill('mjs003_skill_mjs_shiqin', target)
								if (event._choice == '摸牌') target.draw(1)
								else target.recover(1)
							}
						},
						ai: {
							threaten: 0.9
						}
					},
					mjs003_skill_mjs_huiyan: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						trigger: {
							global: 'gameStart'
						},
						direct: true,
						content: function () {
							'step 0'
							player
								.chooseTarget('慧眼：选择一名男性角色', function (card, player, target) {
									return target != player && target.sex == 'male'
								})
								.set('ai', function (target) {
									var player = _status.event.player
									var att = get.attitude(player, target)
									if (att <= 0) return 0
									var hpDiff = Math.abs(player.hp - target.hp)
									var cardDiff = Math.abs(player.countCards('h') - target.countCards('h'))
									return att * 3 - hpDiff - cardDiff
								})
							'step 1'
							if (result.bool) {
								var target = result.targets[0]
								player.logSkill('mjs003_skill_mjs_huiyan', target)
								player.storage.mjs003_skill_mjs_huiyan = target
								player.storage.mjs003_skill_mjs_huiyan_used = false
								player.addSkill('mjs003_skill_mjs_huiyan_watch')
							}
						},
						group: ['mjs003_skill_mjs_huiyan_watch', 'mjs003_skill_mjs_huiyan_reset'],
						subSkill: {
							watch: {
								trigger: {
									global: ['changeHp', 'gain', 'lose']
								},
								forced: true,
								silent: true,
								charlotte: true,
								filter: function (event, player) {
									var target = player.storage.mjs003_skill_mjs_huiyan
									return target && target.isAlive() && !player.storage.mjs003_skill_mjs_huiyan_used
								},
								content: function () {
									var target = player.storage.mjs003_skill_mjs_huiyan
									if (player.hp == target.hp || player.countCards('h') == target.countCards('h')) {
										player.storage.mjs003_skill_mjs_huiyan_used = true
										player.draw(1)
										target.draw(1)
										game.log(player, '和', target, '的数值首次相同，各摸1张牌')
									}
								},
								sub: true,
								parentskill: 'mjs003_skill_mjs_huiyan',
								popup: false
							},
							reset: {
								trigger: {
									player: 'phaseBegin'
								},
								forced: true,
								silent: true,
								charlotte: true,
								content: function () {
									player.storage.mjs003_skill_mjs_huiyan_used = false
								},
								sub: true,
								parentskill: 'mjs003_skill_mjs_huiyan',
								popup: false
							}
						},
						ai: {
							threaten: 1.1
						}
					},
					mjs003_skill_mjs_daowang: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						limited: true,
						skillAnimation: true,
						animationColor: 'thunder',
						trigger: {
							global: 'dieAfter'
						},
						direct: true,
						filter: function (event, player) {
							if (player.storage.mjs003_skill_mjs_daowang) return false
							return event.player != player
						},
						content: function () {
							'step 0'
							var dead = trigger.player
							var cards = []
							for (var i = 0; i < ui.discardPile.childNodes.length; i++) {
								var card = ui.discardPile.childNodes[i]
								var used = dead.getHistory('useCard', function (evt) {
									return evt.cards && evt.cards.contains(card)
								})
								var responded = dead.getHistory('respond', function (evt) {
									return evt.cards && evt.cards.contains(card)
								})
								if (used.length + responded.length > 0) cards.push(card)
							}
							event._cards = cards
							player
								.chooseBool(
									get.prompt('mjs003_skill_mjs_daowang'),
									'获得弃牌堆中' + get.translation(dead) + '使用/打出过的' + get.cnNumber(event._cards.length) + '张牌'
								)
								.set('ai', function () {
									var cards = event._cards
									var num = cards.length
									if (num === 0) return false
									if (player.hp <= 1 || player.countCards('h') <= 1) return true
									var totalValue = 0
									for (var i = 0; i < num; i++) {
										totalValue += get.value(cards[i])
									}
									var att = get.attitude(player, trigger.player)
									var threshold = att > 0 ? 1 : 2
									return num >= threshold && totalValue >= 7
								})
							'step 1'
							if (result.bool) {
								player.awakenSkill('mjs003_skill_mjs_daowang')
								player.logSkill('mjs003_skill_mjs_daowang')
								player.gain(event._cards, 'gain2')
								game.log(player, '获得了' + get.cnNumber(event._cards.length) + '张牌')
							}
						},
						ai: {
							threaten: 1.5
						},
						mark: true,
						marktext: '悼亡',
						intro: {
							content: 'limited'
						},
						init: function (player, skill) {
							player.storage[skill] = false
						}
					},
					mjs003_skill_mjs_pancai: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						trigger: {
							player: 'phaseJieshuBegin'
						},
						direct: true,
						filter: function (event, player) {
							return player.countCards('h') > 0
						},
						init: function (player) {
							player.storage.mjs003_skill_mjs_pancai_used = []
						},
						content: function () {
							'step 0'
							var list = []
							for (var i = 0; i < lib.inpile.length; i++) {
								var name = lib.inpile[i]
								var type = get.type(name)
								if ((type == 'trick' || type == 'delay') && !player.storage.mjs003_skill_mjs_pancai_used.contains(name)) {
									list.push(name)
								}
							}
							if (!list.length) {
								event.finish()
								return
							}
							event._list = list
							var dialog = ui.create.dialog('潘才：选择一种锦囊牌')
							var vcards = []
							for (var i = 0; i < list.length; i++) {
								vcards.push(['锦囊', '', list[i]])
							}
							dialog.add([vcards, 'vcard'])
							player
								.chooseCard(get.prompt('mjs003_skill_mjs_pancai'), '将一张手牌当作选择的锦囊牌使用', 1)
								.set('dialog', dialog)
								.set('ai', function (card) {
									var player = _status.event.player
									var list = _status.event.getParent()._list
									if (card.hasGaintag('mjs003_skill_mjs_zhiguo_tag')) return 10 + (6 - get.value(card))
									return 6 - get.value(card)
								})
							'step 1'
							if (result.bool) {
								event._cards = result.cards
								var vcards = []
								for (var i = 0; i < event._list.length; i++) {
									vcards.push(['锦囊', '', event._list[i]])
								}
								player
									.chooseButton(ui.create.dialog('选择要当作哪种锦囊牌', [vcards, 'vcard']), true)
									.set('ai', function (button) {
										var name = button.link[2]
										if (name == 'wuzhong') return 10
										if (name == 'guohe') return 8
										if (name == 'shunshou') return 7
										if (name == 'wuxie') return 6
										if (name == 'lebu') return 5
										if (name == 'bingliang') return 4
										return 3
									})
							} else {
								event.finish()
							}
							'step 2'
							if (result.bool) {
								var trickName = result.links[0][2]
								event._trickName = trickName
								player.logSkill('mjs003_skill_mjs_pancai')
								player.storage.mjs003_skill_mjs_pancai_used.push(trickName)
								player.chooseUseTarget({ name: trickName }, event._cards, false)
							} else {
								event.finish()
							}
							'step 3'
							if (event._trickName) {
								player.storage.mjs003_skill_mjs_pancai_trick = event._trickName
								player.addTempSkill('mjs003_skill_mjs_pancai_give', { player: 'phaseBegin' })
							}
						},
						group: ['mjs003_skill_mjs_pancai_give', 'mjs003_skill_mjs_pancai_reset'],
						subSkill: {
							give: {
								audio: 'mjs003_skill_mjs_pancai',
								trigger: {
									global: 'phaseJieshuBegin'
								},
								direct: true,
								filter: function (event, player) {
									if (event.player == player) return false
									if (!player.storage.mjs003_skill_mjs_pancai_trick) return false
									return event.player.countCards('he') > 0
								},
								content: function () {
									'step 0'
									var target = trigger.player
									event._target = target
									target
										.chooseCard(
											'he',
											'是否交给' +
												get.translation(player) +
												'一张牌？然后你可以将一张牌当作' +
												get.translation(player.storage.mjs003_skill_mjs_pancai_trick) +
												'使用或打出'
										)
										.set('ai', function (card) {
											var target = _status.event.player
											var player = _status.event.getParent().player
											var att = get.attitude(target, player)
											if (att <= 0) return 0
											return 7 - get.value(card)
										})
									'step 1'
									if (result.bool) {
										event._giveCard = result.cards[0]
										event._target.give(event._giveCard, player)
										game.log(event._target, '交给了', player, '一张牌')
									} else {
										event.finish()
									}
									'step 2'
									var trickName = player.storage.mjs003_skill_mjs_pancai_trick
									event._trickName = trickName
									if (!event._target.countCards('he')) {
										event.finish()
										return
									}
									player
										.chooseBool(
											'是否令' + get.translation(event._target) + '将一张牌当作' + get.translation(trickName) + '使用？'
										)
										.set('ai', function () {
											var p = _status.event.player
											var t = _status.event.getParent()._target
											return get.attitude(p, t) > 0
										})
									'step 3'
									if (result.bool) {
										event._target
											.chooseCard('he', '将一张牌当作' + get.translation(event._trickName) + '使用', 1)
											.set('ai', function (card) {
												return 6 - get.value(card)
											})
									} else {
										event.finish()
									}
									'step 4'
									if (result.bool) {
										event._target.chooseUseTarget({ name: event._trickName, isCard: true }, result.cards, false)
									}
								},
								sub: true,
								parentskill: 'mjs003_skill_mjs_pancai'
							},
							reset: {
								trigger: {
									player: 'phaseBegin'
								},
								forced: true,
								silent: true,
								charlotte: true,
								content: function () {
									delete player.storage.mjs003_skill_mjs_pancai_trick
								},
								sub: true,
								parentskill: 'mjs003_skill_mjs_pancai',
								popup: false
							}
						},
						ai: {
							threaten: 1.2
						}
					},
					mjs003_skill_mjs_zhiguo: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						trigger: {
							player: 'phaseBegin'
						},
						forced: true,
						content: function () {
							'step 0'
							var others = game.filterPlayer(function (current) {
								return current != player && current.countCards('h') > 0
							})
							if (!others.length) {
								event.finish()
								return
							}
							event._others = others
							event._shownCards = []
							event._countMap = {}
							event._idx = 0
							'step 1'
							if (event._idx >= event._others.length) {
								event.goto(2)
								return
							}
							var target = event._others[event._idx]
							var hs = target.getCards('h')
							var num = Math.min(2, hs.length)
							var shown = hs.randomGets(num)
							target.showCards(shown, get.translation(target) + '展示了' + get.cnNumber(num) + '张手牌')
							for (var i = 0; i < shown.length; i++) {
								var name = get.name(shown[i])
								event._countMap[name] = (event._countMap[name] || 0) + 1
							}
							event._shownCards = event._shownCards.concat(shown)
							event._idx++
							event.redo()
							'step 2'
							var countMap = event._countMap
							var names = []
							for (var name in countMap) {
								names.push({ name: name, count: countMap[name] })
							}
							names.sort(function (a, b) {
								return b.count - a.count
							})
							var topNames = []
							var ni = 0
							while (topNames.length < 2 && ni < names.length) {
								var count = names[ni].count
								var tied = []
								while (ni < names.length && names[ni].count == count) {
									tied.push(names[ni].name)
									ni++
								}
								while (topNames.length < 2 && tied.length) {
									var pick = tied.randomGet()
									tied.remove(pick)
									topNames.push(pick)
								}
							}
							if (!topNames.length) {
								event.finish()
								return
							}
							var gained = []
							for (var i = 0; i < topNames.length; i++) {
								var card = get.cardPile(function (c) {
									return get.name(c) == topNames[i]
								})
								if (card) {
									gained.push(card)
								}
							}
							if (gained.length) {
								player.gain(gained, 'draw').gaintag.add('mjs003_skill_mjs_zhiguo_tag')
								if (!player.storage.mjs003_skill_mjs_zhiguo_cards) player.storage.mjs003_skill_mjs_zhiguo_cards = []
								for (var i = 0; i < gained.length; i++) {
									player.storage.mjs003_skill_mjs_zhiguo_cards.push(gained[i].cardid)
								}
								game.log(player, '获得了' + get.cnNumber(gained.length) + '张牌')
							}
						},
						group: ['mjs003_skill_mjs_zhiguo_use'],
						subSkill: {
							use: {
								audio: 'mjs003_skill_mjs_zhiguo',
								trigger: {
									player: ['useCardAfter', 'respondAfter']
								},
								direct: true,
								filter: function (event, player) {
									if (!event.cards || !player.storage.mjs003_skill_mjs_zhiguo_cards || !player.storage.mjs003_skill_mjs_zhiguo_cards.length)
										return false
									var has = false
									for (var i = 0; i < event.cards.length; i++) {
										if (player.storage.mjs003_skill_mjs_zhiguo_cards.contains(event.cards[i].cardid)) {
											has = true
										}
									}
									if (!has) {
										return false
									}
									return true
								},
								content: function () {
									'step 0'
									for (var i = 0; i < trigger.cards.length; i++) {
										player.storage.mjs003_skill_mjs_zhiguo_cards.remove(trigger.cards[i].cardid)
									}
									var remaining = player.getCards('h', function (card) {
										return card.hasGaintag('mjs003_skill_mjs_zhiguo_tag')
									})
									if (remaining.length > 0) {
										event.finish()
										return
									}
									player
										.chooseTarget(get.prompt('mjs003_skill_mjs_zhiguo'), '令一名角色获得一张锦囊牌')
										.set('ai', function (target) {
											return get.attitude(_status.event.player, target)
										})
									'step 1'
									if (result.bool) {
										player.logSkill('mjs003_skill_mjs_zhiguo', result.targets[0])
										var target = result.targets[0]
										var trick = get.cardPile(function (card) {
											return get.type(card) == 'trick'
										})
										if (trick) {
											target.gain(trick, 'draw')
											game.log(target, '获得了一张锦囊牌')
										}
									}
								},
								sub: true,
								parentskill: 'mjs003_skill_mjs_zhiguo'
							}
						},
						ai: {
							threaten: 1.3
						}
					},
					mjs003_skill_mjs_zhiguo_tag: {},
					mjs003_skill_mjs_xue_tag: {},
					mjs003_skill_mjs_qiang_test_boost: {
						charlotte: true,
						audio: 'ext:名将杀/assets/incremental:false',
						trigger: {
							global: ['useCard', 'shaMiss']
						},
						forced: true,
						popup: false,
						mod: {
							cardEnabled2: function (card, player) {
								if (!lib.mjQiang || !lib.mjQiangHasTag(card)) return
								var name = get.name(card)
								if (lib.mjQiang.selfAny && lib.mjQiang.selfAny[name] && !player.isDamaged()) return true
							},
							targetEnabled: function (card, player, target) {
								if (!lib.mjQiang || !lib.mjQiangHasTag(card)) return
								if (target == player) return
								var name = get.name(card)
								if (lib.mjQiang.saveAny && lib.mjQiang.saveAny[name]) return true
								if (lib.mjQiang.selfAny && lib.mjQiang.selfAny[name] && target.hp < target.maxHp) return true
							},
							cardSavable: function (card, player, target) {
								if (!lib.mjQiang || !lib.mjQiangHasTag(card)) return
								var name = get.name(card)
								if (lib.mjQiang.saveAny && lib.mjQiang.saveAny[name]) return true
							}
						},
						filter: function (event, player, name) {
							if (!lib.mjQiang) return false
							if (name == 'shaMiss') {
								if (!lib.mjQiang.dodgeDraw || !lib.mjQiang.dodgeDraw.shan) return false
								var resp = event.responded
								if (resp && resp.cards && resp.cards.length && !lib.mjQiangHasTag(resp.cards[0])) return false
								return true
							}
							if (name != 'useCard') return false
							if (!event.card || !event.cards || !event.cards.length) return false
							var cname = get.name(event.card)
							if (!lib.mjQiang.extraDamage || typeof lib.mjQiang.extraDamage[cname] != 'number') return false
							var marked = event.cards.some(function (card) {
								return card.hasGaintag && card.hasGaintag('mjs003_skill_mjs_qiang_tag')
							})
							if (!marked) return false
							return true
						},
						content: function () {
							'step 0'
							var useEvt = trigger
							if (trigger.name == 'shaMiss') {
								if (useEvt.mjs_qiang_draw_done) {
									event.finish()
									return
								}
								useEvt.mjs_qiang_draw_done = true
								var resp = useEvt.responded
								if (!resp || !resp.cards || !resp.cards.length) {
									event.finish()
									return
								}
								if (!lib.mjQiangHasTag(resp.cards[0])) {
									event.finish()
									return
								}
								useEvt.target.draw()
								game.log(useEvt.target, '的', resp.cards[0], '带有', '#y强', '标记，闪避成功后摸了一张牌')
								event.finish()
								return
							}
							if (useEvt.mjs_qiang_dmg_done) {
								event.finish()
								return
							}
							useEvt.mjs_qiang_dmg_done = true
							var name = get.name(useEvt.card)
							var add = lib.mjQiang.extraDamage[name]
							if (!useEvt.customArgs) useEvt.customArgs = { default: {} }
							if (!useEvt.customArgs.default) useEvt.customArgs.default = {}
							useEvt.customArgs.default.baseDamage =
								(useEvt.customArgs.default.baseDamage || useEvt.baseDamage || 1) + add
							game.log(useEvt.player, '的', useEvt.card, '带有', '#y强', '标记，伤害 +' + add)
						},
						ai: {
							save: true,
							skillTagFilter: function (player, tag, target) {
								if (!lib.mjQiang || !lib.mjQiang.saveAny) return false
								var cards = player.getCards('hs')
								for (var i = 0; i < cards.length; i++) {
									if (lib.mjQiangHasTag(cards[i]) && lib.mjQiang.saveAny[get.name(cards[i])]) return true
								}
								return false
							}
						}
					},
					mjs003_skill_mjs_qiang_test: {
						audio: 'ext:名将杀/assets/incremental:false',
						enable: 'phaseUse',
						usable: 1,
						content: function () {
							var hs = player.getCards('h')
							if (!hs.length) return
							lib.mjQiangAddTag(hs)
							game.log(player, '将所有手牌加上了', '#y强', '标记')
						},
						check: function () {
							return 1
						},
						ai: {
							order: 1,
							result: {
								player: 1
							}
						}
					},
					mjs003_skill_mjs_qiang_tag: {},
					mjs003_skill_mjs_xue_test: {
						audio: 'ext:名将杀/assets/incremental:false',
						enable: 'phaseUse',
						usable: 1,
						content: function () {
							var hs = player.getCards('h')
							if (!hs.length) return
							lib.mjXueAddTag(hs)
							game.log(player, '将所有手牌加上了', '#y削', '标记')
						},
						check: function (card) {
							var player = _status.event.player
							var basic = 0,
								other = 0
							var hs = player.getCards('h')
							for (var i = 0; i < hs.length; i++) {
								if (get.type(hs[i], 'trick') == 'basic') basic++
								else other++
							}
							return other >= basic ? 1 : -1
						},
						ai: {
							order: 1,
							result: {
								player: 1
							}
						}
					},
					mjs003_skill_mjs_bianruo: {
						audio: 'ext:名将杀/assets/incremental:false',
						enable: 'phaseUse',
						usable: 1,
						content: function () {
							var cards = []
							for (var i = 0; i < ui.cardPile.childNodes.length; i++) {
								cards.push(ui.cardPile.childNodes[i])
							}
							if (!cards.length) return
							lib.mjXueAddTag(cards)
							game.log(player, '将牌堆里的', get.cnNumber(cards.length), '张牌全部加上了', '#y削', '标记')
						},
						check: function (card) {
							var player = _status.event.player
							if (
								game.hasPlayer(function (current) {
									return current != player && current.isFriendOf(player) && current.hasSkill('mjs003_skill_mjs_dangzheng')
								})
							)
								return 1
							return -1
						},
						ai: {
							order: 1,
							result: {
								player: 1
							}
						}
					},
					mjs003_skill_mjs_xue_test_cost: {
						charlotte: true,
						audio: 'ext:名将杀/assets/incremental:false',
						trigger: {
							global: ['useCardBefore', 'useCard', 'shaMiss']
						},
						forced: true,
						popup: false,
						mod: {
							cardSavable: function (card, player, target) {
								if (lib.mjXueNormal(player)) return
								if (!lib.mjXue || !lib.mjXueHasTag(card)) return
								var name = get.name(card)
								if (lib.mjXue.noSave && lib.mjXue.noSave[name]) return false
								if (lib.mjXue.selfOnly && lib.mjXue.selfOnly[name] && target != player) return false
							},
							cardEnabled2: function (card, player) {
								if (lib.mjXueNormal(player)) return
								var evt = _status.event
								if (!evt || evt.type != 'wuxie') return
								if (get.name(card) != 'wuxie' || !lib.mjXueHasTag(card)) return
								if (!lib.mjXueCounterOwn(evt)) return false
							},
							cardEnabled: function (card, player) {
								if (lib.mjXueNormal(player)) return
								var xueCost = lib.mjXue && lib.mjXue.cost ? lib.mjXue.cost[get.name(card)] : 0
								if (xueCost && !card.nature && lib.mjXueHasTag(card)) {
									var he = player.getCards('he')
									var own = 0
									if (card.cards && card.cards.length) {
										for (var xi = 0; xi < card.cards.length; xi++) {
											if (he.indexOf(card.cards[xi]) != -1) own++
										}
									} else if (card.isCard) own = 1
									if (he.length - own < xueCost) return false
								}
								var evt = _status.event
								if (!evt || evt.type != 'wuxie') return
								if (get.name(card) != 'wuxie' || !lib.mjXueHasTag(card)) return
								if (!lib.mjXueCounterOwn(evt)) return false
							}
						},
						filter: function (event, player, name) {
							if (!lib.mjXue) return false
							if (!event.card || !event.cards || !event.cards.length) return false
							var marked = event.cards.some(function (card) {
								return card.hasGaintag('mjs003_skill_mjs_xue_tag')
							})
							if (!marked) return false
							if (name == 'shaMiss') {
								if (event.target && lib.mjXueNormal(event.target)) return false
							} else if (event.player && lib.mjXueNormal(event.player)) return false
							event.mjs_xue_tname = name
							var cname = get.name(event.card)
							if (name == 'useCard') {
								return !!(lib.mjXue.firstTurn && lib.mjXue.firstTurn[cname])
							}
							if (name == 'shaMiss') {
								if (!lib.mjXue.noDodge || !lib.mjXue.noDodge.shan) return false
								var resp = event.responded
								if (!resp || !resp.cards || !resp.cards.length) return false
								if (!lib.mjXueHasTag(resp.cards[0])) return false
								return (event.baseDamage || 1) + (event.extraDamage || 0) >= 2
							}
							if (lib.mjXue.cost && lib.mjXue.cost[cname]) return true
							if (lib.mjXue.noSave && lib.mjXue.noSave[cname] && lib.mjXueIsRescue(event)) return true
							if (lib.mjXue.noCounter && lib.mjXue.noCounter[cname]) return true
							return false
						},
						content: function () {
							'step 0'
							var useEvt = trigger
							if (useEvt.mjs_xue_tname == 'useCard') {
								if (useEvt.mjs_xue_flip_done) {
									event.finish()
									return
								}
								useEvt.mjs_xue_flip_done = true
								if (useEvt.customArgs && useEvt.customArgs.default) {
									useEvt.customArgs.default.turn = useEvt.player
								}
								event.finish()
								return
							}
							if (useEvt.mjs_xue_tname == 'shaMiss') {
								var shaEvt = trigger
								if (shaEvt.mjs_xue_shan_applied) {
									event.finish()
									return
								}
								shaEvt.mjs_xue_shan_applied = true
								var shan = shaEvt.responded.cards[0]
								shaEvt._result = { bool: false }
								shaEvt.extraDamage = (shaEvt.extraDamage || 0) - 1
								game.log(shaEvt.target, '的', shan, '带有', '#y削', '标记，只能抵挡1点伤害')
								event.finish()
								return
							}
							if (useEvt.mjs_xue_done) {
								event.finish()
								return
							}
							useEvt.mjs_xue_done = true
							var name = get.name(useEvt.card)
							if (lib.mjXue.noSave && lib.mjXue.noSave[name] && lib.mjXueIsRescue(useEvt)) {
								game.log(useEvt.player, '的', useEvt.card, '带有', '#y削', '标记，不能在濒死时用于回体力')
								useEvt.cancel()
								event.finish()
								return
							}
							if (lib.mjXue.noCounter && lib.mjXue.noCounter[name] && !lib.mjXueCounterOwn(useEvt)) {
								game.log(useEvt.player, '的', useEvt.card, '带有', '#y削', '标记，只能抵消对自己生效的锦囊')
								useEvt.cancel()
								event.finish()
								return
							}
							if (!lib.mjXue.cost || !lib.mjXue.cost[name]) {
								event.finish()
								return
							}
							var cost = lib.mjXue.cost[name] || 1
							event._useEvt = useEvt
							if (useEvt.card.nature) {
								var pool = useEvt.player.getCards('h', function (card) {
									return !useEvt.cards.contains(card)
								})
								var toDiscard = []
								while (toDiscard.length < cost && pool.length) {
									var rand = pool.randomGet()
									pool.remove(rand)
									toDiscard.push(rand)
								}
								if (toDiscard.length) {
									useEvt.player.discard(toDiscard)
									game.log(useEvt.player, '的', useEvt.card, '随机弃置了', toDiscard)
								}
								event.finish()
								return
							}
							var spare = useEvt.player.countCards('he', function (card) {
								return !useEvt.cards.contains(card)
							})
							if (spare < cost) {
								game.log(useEvt.player, '无牌支付', '#y削', '的代价，', useEvt.card, '无效')
								useEvt.cancel()
								event.finish()
								return
							}
							if (!useEvt.player.isUnderControl(true) || _status.auto) {
								var pool = useEvt.player.getCards('he', function (card) {
									return !useEvt.cards.contains(card)
								})
								var pay = []
								while (pay.length < cost && pool.length) {
									var cheapest = null
									var best = Infinity
									for (var i = 0; i < pool.length; i++) {
										var v = get.value(pool[i])
										if (v < best) {
											best = v
											cheapest = pool[i]
										}
									}
									pay.push(cheapest)
									pool.remove(cheapest)
								}
								if (pay.length < cost) {
									game.log(useEvt.player, '未支付', '#y削', '的代价，', useEvt.card, '无效')
									useEvt.cancel()
								} else {
									useEvt.player.discard(pay)
									game.log(useEvt.player, '为', useEvt.card, '支付了', '#y削', '的代价')
								}
								event.finish()
								return
							}
							useEvt.player
								.chooseToDiscard(
									'he',
									cost,
									'削：弃置' + get.cnNumber(cost) + '张牌，否则' + get.translation(useEvt.card) + '无效',
									function (card) {
										return !useEvt.cards.contains(card)
									}
								)
								.set('ai', function (card) {
									return get.value(useEvt.card) - get.value(card)
								})
							'step 1'
							var useEvt = event._useEvt
							if (!result.bool) {
								game.log(useEvt.player, '未支付', '#y削', '的代价，', useEvt.card, '无效')
								useEvt.cancel()
							}
						}
					},
					mjs003_skill_mjs_fujing: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						enable: 'phaseUse',
						usable: 1,
						filterTarget: function (card, player, target) {
							return target != player && player.inRange(target) && target.countCards('hej') >= 2
						},
						content: function () {
							'step 0'
							player.choosePlayerCard(target, 'hej', 2, true).set('ai', function (button) {
								return get.value(button.link)
							})
							'step 1'
							if (result.bool && result.cards.length) {
								event._cards = result.cards.slice()
								player.gain(result.cards, target, 'giveAuto').gaintag.add('mjs003_skill_mjs_fujing_tag')
								if (!player.storage.mjs003_skill_mjs_fujing_cardids) player.storage.mjs003_skill_mjs_fujing_cardids = []
								for (var i = 0; i < event._cards.length; i++) {
									player.storage.mjs003_skill_mjs_fujing_cardids.push(event._cards[i].cardid)
								}
								player.storage.mjs003_skill_mjs_fujing_target = target
								player.addSkill('mjs003_skill_mjs_fujing_return')
							}
						},
						ai: {
							order: 8,
							result: {
								target: function (player, target) {
									if (player.hp <= 1) return 0
									return -1.5
								},
								player: 1
							},
							threaten: 1.2
						}
					},
					mjs003_skill_mjs_fujing_return: {
						charlotte: true,
						trigger: {
							global: 'phaseBegin'
						},
						forced: true,
						popup: false,
						filter: function (event, player) {
							return (
								event.player == player.storage.mjs003_skill_mjs_fujing_target &&
								player.storage.mjs003_skill_mjs_fujing_cardids &&
								player.storage.mjs003_skill_mjs_fujing_cardids.length
							)
						},
						content: function () {
							'step 0'
							player.loseHp(1)
							'step 1'
							var cardids = player.storage.mjs003_skill_mjs_fujing_cardids || []
							var target = player.storage.mjs003_skill_mjs_fujing_target
							var toReturn = []
							var hs = player.getCards('h')
							for (var i = 0; i < hs.length; i++) {
								if (hs[i].hasGaintag('mjs003_skill_mjs_fujing_tag') || cardids.contains(hs[i].cardid)) {
									hs[i].removeGaintag('mjs003_skill_mjs_fujing_tag')
									toReturn.push(hs[i])
								}
							}
							if (toReturn.length && target.isAlive()) {
								target.gain(toReturn, player, 'giveAuto')
							}
							delete player.storage.mjs003_skill_mjs_fujing_cardids
							delete player.storage.mjs003_skill_mjs_fujing_target
							player.removeSkill('mjs003_skill_mjs_fujing_return')
						}
					},
					mjs003_skill_mjs_fujing_tag: {},
					mjs003_skill_mjs_fanfou: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						trigger: {
							player: 'phaseJieshu'
						},
						direct: true,
						frequent: true,
						mark: true,
						marktext: '饭',
						markcount: function (storage, player) {
							return player.storage.mjs003_skill_mjs_fanfou_bonus || 0
						},
						intro: {
							content: function (storage, player) {
								var bonus = player.storage.mjs003_skill_mjs_fanfou_bonus || 0
								if (bonus === 0) return '当前无加成'
								return '出杀次数+' + bonus
							}
						},
						content: function () {
							'step 0'
							var shaUsed = player.getHistory('useCard', function (evt) {
								return evt.card && evt.card.name == 'sha'
							}).length
							event._shaUsed = shaUsed
							if (shaUsed === 0) {
								var num = Math.max(0, player.maxHp - player.countCards('h'))
								if (num <= 0) {
									event.finish()
									return
								}
								event._num = num
								player
									.chooseBool(get.prompt('mjs003_skill_mjs_fanfou'), '摸' + num + '张牌至手牌上限，之后出杀次数+1')
									.set('ai', function () {
										return true
									})
							} else {
								var maxUsable = 1 + (player.storage.mjs003_skill_mjs_fanfou_bonus || 0)
								var remaining = maxUsable - shaUsed
								if (remaining <= 0) {
									event.finish()
									return
								}
								event._num = remaining
								player.chooseBool(get.prompt('mjs003_skill_mjs_fanfou'), '摸' + remaining + '张牌').set('ai', function () {
									return true
								})
							}
							'step 1'
							if (!result.bool) {
								event.finish()
								return
							}
							player.logSkill('mjs003_skill_mjs_fanfou')
							if (event._shaUsed === 0) {
								player.draw(event._num)
								if (!player.storage.mjs003_skill_mjs_fanfou_bonus) player.storage.mjs003_skill_mjs_fanfou_bonus = 0
								player.storage.mjs003_skill_mjs_fanfou_bonus++
								player.markSkill('mjs003_skill_mjs_fanfou')
								player.addSkill('mjs003_skill_mjs_fanfou_mod')
							} else {
								player.draw(event._num)
							}
						},
						ai: {
							threaten: 0.8
						}
					},
					mjs003_skill_mjs_fanfou_mod: {
						charlotte: true,
						silent: true,
						popup: false,
						mod: {
							cardUsable: function (card, player, num) {
								if (card.name == 'sha') return num + (player.storage.mjs003_skill_mjs_fanfou_bonus || 0)
							}
						},
						forced: true
					},
					mjs003_skill_mjs_die_audio: {
						guanghuan: true,
						trigger: { global: 'dieAfter' },
						silent: true,
						popup: false,
						filter: function (event, player) {
							if (!lib.config.background_speak) return false
							var dead = event.player
							return dead && dead.name && dead.name.indexOf('mjs003_') == 0 && lib.character[dead.name]
						},
						content: function () {
							game.playAudio('..', 'extension', '名将杀/assets/incremental/audio/die', trigger.player.name)
						}
					},
					mjs003_skill_mjs_zhuangyong: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						trigger: {
							source: 'damageEnd'
						},
						forced: true,
						filter: function (event, player) {
							return player.hp < player.maxHp
						},
						content: function () {
							game.trySkillAudio('mjs003_skill_mjs_zhuangyong', player, true)
							player.recover()
						},
						group: ['mjs003_skill_mjs_zhuangyong_plus'],
						ai: {
							damageBonus: true
						}
					},
					mjs003_skill_mjs_zhuangyong_plus: {
						audio: 'mjs003_skill_mjs_zhuangyong',
						trigger: {
							source: 'damageBegin1'
						},
						forced: true,
						usable: 1,
						filter: function (event, player) {
							return player.hp >= player.maxHp
						},
						content: function () {
							'step 0'
							player.chooseBool('壮勇：是否令伤害+1？').set('ai', function () {
								return get.attitude(player, trigger.player) < 0
							})
							'step 1'
							if (result.bool) {
								trigger.num++
								game.log(player, '发动', '#g【壮勇】', '令伤害+1')
							}
						},
						sub: true,
						parentskill: 'mjs003_skill_mjs_zhuangyong'
					},
					mjs003_skill_mjs_zhuifeng: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						enable: 'phaseUse',
						filter: function (event, player) {
							if (player.storage.mjs003_skill_mjs_zhuifeng_disabled) return false
							if (player.storage.mjs003_skill_mjs_zhuifeng_nopay) return false
							var cost = player.storage.mjs003_skill_mjs_zhuifeng_cost || 1
							return player.countCards('he') >= cost
						},
						content: function () {
							'step 0'
							var cost = player.storage.mjs003_skill_mjs_zhuifeng_cost || 1
							player.chooseToDiscard('he', cost, '追风：弃' + cost + '张牌，出杀次数+1').set('ai', function (card) {
								return 5 - get.value(card)
							})
							'step 1'
							if (result.bool) {
								if (!player.storage.mjs003_skill_mjs_zhuifeng_bonus) player.storage.mjs003_skill_mjs_zhuifeng_bonus = 0
								player.storage.mjs003_skill_mjs_zhuifeng_bonus++
								player.storage.mjs003_skill_mjs_zhuifeng_cost = 2
								game.log(player, '发动', '#g【追风】', '，出杀次数+1')
							}
							else if (player != game.me || _status.auto) player.storage.mjs003_skill_mjs_zhuifeng_nopay = true
						},
						mod: {
							cardUsable: function (card, player, num) {
								if (card.name == 'sha') return num + (player.storage.mjs003_skill_mjs_zhuifeng_bonus || 0)
							}
						},
						group: 'mjs003_skill_mjs_zhuifeng_kill',
						subSkill: {
							kill: {
								trigger: {
									source: 'dieAfter'
								},
								forced: true,
								filter: function (event, player) {
									return !player.storage.mjs003_skill_mjs_zhuifeng_disabled
								},
								content: function () {
									'step 0'
									var shaUsed = player.getHistory('useCard', function (evt) {
										return evt.card && evt.card.name == 'sha'
									}).length
									if (shaUsed > 0) {
										player.draw(shaUsed * 2)
										game.log(player, '击杀，摸' + shaUsed * 2 + '张牌')
									}
									player.storage.mjs003_skill_mjs_zhuifeng_disabled = true
								},
								sub: true,
								parentskill: 'mjs003_skill_mjs_zhuifeng'
							},
							reset: {
								trigger: {
									player: 'phaseBegin'
								},
								forced: true,
								silent: true,
								popup: false,
								charlotte: true,
								content: function () {
									delete player.storage.mjs003_skill_mjs_zhuifeng_cost
									delete player.storage.mjs003_skill_mjs_zhuifeng_disabled
									delete player.storage.mjs003_skill_mjs_zhuifeng_nopay
								},
								sub: true,
								parentskill: 'mjs003_skill_mjs_zhuifeng'
							}
						},
						ai: {
							order: function (card, player) {
								if (player.storage.mjs003_skill_mjs_zhuifeng_disabled) return -1
								if (player.storage.mjs003_skill_mjs_zhuifeng_cost) return -1
								var cost = player.storage.mjs003_skill_mjs_zhuifeng_cost || 1
								if (player.countCards('he') < cost) return -1
								if (
									!player.getCards('he').some(function (c) {
										return 5 - get.value(c) > 0
									})
								)
									return -1
								if (player.countCards('h', 'sha') > 0) return 3.5
								return 1
							},
							result: {
								player: 1
							},
							threaten: 1.3
						}
					},
					mjs003_skill_mjs_guanniang: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						priority: 1,
						trigger: {
							player: 'damageEnd'
						},
						filter: function (event, player) {
							return game.hasPlayer(function (current) {
								return (
									current != player &&
									current.getCards('hej').some(function (card) {
										return !lib.mjXueHasTag(card)
									})
								)
							})
						},
						content: function () {
							'step 0'
							game.trySkillAudio('mjs003_skill_mjs_guanniang', player, true)
							player
								.chooseTarget('灌娘：选择一名角色，削弱其区域内的2张牌', function (card, player, target) {
									if (target == player) return false
									return target.getCards('hej').some(function (c) {
										return !lib.mjXueHasTag(c)
									})
								})
								.set('ai', function (target) {
									var me = _status.event.player
									if (target == me) return -999
									var att = get.attitude(me, target)
									var untagged = target.getCards('hej').filter(function (c) {
										return !lib.mjXueHasTag(c)
									})
									if (untagged.length === 0) return -10
									if (att >= 2) return -5
									var score = 0
									score += -att * 3.0
									score += Math.min(untagged.length, 2) * 3.5
									score += Math.min(target.countCards('hej'), 6) * 0.25
									if (untagged.length <= 2 && target.countCards('hej') > 0) score += 4.5
									return score
								})
							'step 1'
							if (!result.bool) {
								event.finish()
								return
							}
							var target = result.targets[0]
							event._target = target
							var hs = target.getCards('hej').filter(function (card) {
								return !lib.mjXueHasTag(card)
							})
							var toTag = []
							if (hs.length <= 2) {
								toTag = hs.slice(0)
							} else {
								var pool = hs.slice(0)
								while (toTag.length < 2 && pool.length) {
									var card = pool.randomGet()
									pool.remove(card)
									toTag.push(card)
								}
							}
							if (toTag.length) {
								lib.mjXueAddTag(toTag)
								game.log(player, '削弱了', target, '区域内的', get.cnNumber(toTag.length), '张牌')
							}
							'step 2'
							var target2 = event._target
							var hs2 = target2.getCards('hej')
							var allTagged =
								hs2.length > 0 &&
								!hs2.some(function (card) {
									return !lib.mjXueHasTag(card)
								})
							if (allTagged) {
								target2.addSkill('mjs003_skill_mjs_guanniang_debuff')
								target2.addMark('mjs003_skill_mjs_guanniang_debuff', 1, false)
								target2.markSkill('mjs003_skill_mjs_guanniang_debuff')
								var mjFlip = function (p) {
									var m = p.marks && p.marks.mjs003_skill_mjs_guanniang_debuff
									if (!m || !m.firstChild) return
									var fc = m.firstChild
									if (fc.reversed) {
										fc.reversed = false
										fc.style.transform = 'none'
									} else {
										fc.reversed = true
										fc.style.transform = 'rotate(180deg)'
									}
								}
								game.broadcastAll(mjFlip, target2)
								setTimeout(function () {
									game.broadcastAll(mjFlip, target2)
								}, 520)
								game.log(target2, '区域内的牌全部被削弱，手牌上限', '#y-1')
							}
						},
						ai: {
							threaten: 1.1
						}
					},
					mjs003_skill_mjs_guanniang_debuff: {
						charlotte: true,
						marktext: '灌娘',
						mod: {
							maxHandcard: function (player, num) {
								var add = player.countMark('mjs003_skill_mjs_guanniang_debuff')
								if (add > 0) return num - add
							}
						},
						intro: {
							name: '灌娘',
							markcount: function (storage, player) {
								return player.countMark('mjs003_skill_mjs_guanniang_debuff')
							},
							content: '手牌上限-#'
						}
					},
					mjs003_skill_mjs_powei: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						limited: true,
						skillAnimation: true,
						animationColor: 'fire',
						trigger: {
							player: 'damageEnd'
						},
						direct: true,
						filter: function (event, player) {
							return player.isAlive()
						},
						content: function () {
							'step 0'
							player
								.chooseBool(get.prompt('mjs003_skill_mjs_powei'), '受到1点伤害至体力=1，然后弃置场上所有削弱牌，每2张换1张非削弱牌')
								.set('ai', function () {
									var me = _status.event.player
									if (me.hp <= 1) return false
									var enemies = []
									var teammates = []
									game.filterPlayer().forEach(function (current) {
										if (current == me) return
										if (get.attitude(me, current) < 0) enemies.push(current)
										else if (get.attitude(me, current) > 0) teammates.push(current)
									})
									if (enemies.length === 0) return false
									var enemyUntagged = 0
									var teamUntagged = 0
									enemies.forEach(function (current) {
										enemyUntagged += current.getCards('h').filter(function (card) {
											return !lib.mjXueHasTag(card)
										}).length
									})
									teammates.forEach(function (current) {
										teamUntagged += current.getCards('h').filter(function (card) {
											return !lib.mjXueHasTag(card)
										}).length
									})
									if (enemyUntagged > 0) return true
									if (teamUntagged > 0) return true
									return false
								})
							'step 1'
							if (!result.bool) {
								event.finish()
								return
							}
							player.awakenSkill('mjs003_skill_mjs_powei')
							player.logSkill('mjs003_skill_mjs_powei')
							event._xue = 0
							'step 2'
							event._loop = (event._loop || 0) + 1
							if (player.isAlive() && player.hp > 1 && event._loop <= 20) {
								player.damage(1)
								event.redo()
							}
							'step 3'
							var ps = game.filterPlayer()
							for (var i = 0; i < ps.length; i++) {
								var cs = ps[i].getCards('hej', function (card) {
									return lib.mjXueHasTag(card)
								})
								if (cs.length) {
									event._xue += cs.length
									ps[i].discard(cs)
								}
							}
							if (event._xue) {
								game.log(player, '发动破围，弃置了场上' + get.cnNumber(event._xue) + '张', '#y削', '弱牌')
							} else {
								game.log(player, '发动破围，但场上没有削弱牌')
							}
							'step 4'
							var num = Math.floor(event._xue / 2)
							if (num <= 0) {
								event.finish()
								return
							}
							var pool = []
							for (var i = 0; i < ui.discardPile.childNodes.length; i++) {
								var card = ui.discardPile.childNodes[i]
								if (card && !lib.mjXueHasTag(card)) pool.push(card)
							}
							var got = []
							while (got.length < num && pool.length) {
								var card = pool.randomGet()
								pool.remove(card)
								got.push(card)
							}
							if (got.length) {
								player.gain(got, 'gain2')
								game.log(player, '获得了弃牌堆中' + get.cnNumber(got.length) + '张非削弱牌')
							}
							if (got.length < num) {
								player.draw(num - got.length)
								game.log(player, '摸' + get.cnNumber(num - got.length) + '张牌')
							}
						},
						ai: {
							threaten: 1.3
						},
						mark: true,
						marktext: '奋身',
						intro: {
							content: 'limited'
						},
						init: function (player, skill) {
							player.storage[skill] = false
						}
					},
					mjs003_skill_mjs_nanzhong: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						trigger: {
							global: ['useCard', 'respond']
						},
						forced: true,
						popup: false,
						mark: true,
						marktext: '终',
						intro: {
							name: '难终',
							content: function (storage, player) {
								var count = player.storage.mjs003_skill_mjs_nanzhong_count || 0
								if (count > 15) count = 15
								var str = '已累计打出削弱牌：' + count + ' / 15'
								if (player.storage.mjs003_skill_mjs_nanzhong_done)
									str += '<br>已失去〖谠正〗，并获得：每回合限一次，当你获得牌时，削弱这些牌'
								return str
							},
							markcount: function (storage, player) {
								var count = player.storage.mjs003_skill_mjs_nanzhong_count || 0
								return Math.min(count, 15)
							}
						},
						filter: function (event, player) {
							if (!lib.mjXue) return false
							if (!event.cards || !event.cards.length) return false
							return event.cards.some(function (card) {
								return lib.mjXueHasTag(card)
							})
						},
						content: function () {
							var count = 0
							for (var i = 0; i < trigger.cards.length; i++) {
								if (lib.mjXueHasTag(trigger.cards[i])) count++
							}
							if (!count) return
							player.storage.mjs003_skill_mjs_nanzhong_count = (player.storage.mjs003_skill_mjs_nanzhong_count || 0) + count
							player.markSkill('mjs003_skill_mjs_nanzhong')
							if (trigger.player == player) {
								player.logSkill('mjs003_skill_mjs_nanzhong')
								player.draw(1)
							}
							if (!player.storage.mjs003_skill_mjs_nanzhong_done && player.storage.mjs003_skill_mjs_nanzhong_count >= 15) {
								player.storage.mjs003_skill_mjs_nanzhong_done = true
								if (player.hasSkill('mjs003_skill_mjs_dangzheng')) player.removeSkill('mjs003_skill_mjs_dangzheng')
								game.log(player, '累计打出15张削弱牌，失去', '#g【谠正】', '，〖难终〗获得新的效果')
								player.$skill('难终', 'legend', 'orange')
							}
						},
						group: ['mjs003_skill_mjs_nanzhong_gain', 'mjs003_skill_mjs_nanzhong_reset'],
						subSkill: {
							gain: {
								trigger: {
									player: 'gainAfter'
								},
								direct: true,
								filter: function (event, player) {
									if (!player.storage.mjs003_skill_mjs_nanzhong_done) return false
									if (player.storage.mjs003_skill_mjs_nanzhong_gain_used) return false
									return !!(event.cards && event.cards.length)
								},
								content: function () {
									'step 0'
									player.storage.mjs003_skill_mjs_nanzhong_gain_used = true
									player
										.chooseBool('难终：是否削弱获得的' + get.cnNumber(trigger.cards.length) + '张牌？')
										.set('ai', function () {
											return true
										})
									'step 1'
									if (!result.bool) {
										event.finish()
										return
									}
									lib.mjXueAddTag(trigger.cards)
									player.logSkill('mjs003_skill_mjs_nanzhong')
									game.log(player, '发动〖难终〗，削弱了获得的' + get.cnNumber(trigger.cards.length) + '张牌')
								},
								sub: true,
								parentskill: 'mjs003_skill_mjs_nanzhong'
							},
							reset: {
								trigger: {
									global: 'phaseBegin'
								},
								forced: true,
								silent: true,
								popup: false,
								charlotte: true,
								content: function () {
									delete player.storage.mjs003_skill_mjs_nanzhong_gain_used
								},
								sub: true,
								parentskill: 'mjs003_skill_mjs_nanzhong'
							}
						},
						ai: {
							threaten: 1.2
						}
					},
					mjs003_skill_mjs_dangzheng: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						mod: {
							cardname: function (card, player) {
								if (card.name == 'jiu') {
									var last = player.storage.mjs003_skill_mjs_dangzheng_last
									if (last) return last
								}
							}
						},
						group: ['mjs003_skill_mjs_dangzheng_record'],
						subSkill: {
							record: {
								trigger: {
									global: 'useCard'
								},
								forced: true,
								silent: true,
								popup: false,
								charlotte: true,
								filter: function (event, player) {
									return !!(event.card && get.type(event.card, 'trick') == 'trick')
								},
								content: function () {
									player.storage.mjs003_skill_mjs_dangzheng_last = trigger.card.name
								},
								sub: true,
								parentskill: 'mjs003_skill_mjs_dangzheng'
							}
						},
						ai: {
							threaten: 1.2
						}
					},
					mjs003_skill_mjs_xinlv: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						limited: true,
						skillAnimation: true,
						animationColor: 'fire',
						enable: 'phaseUse',
						filterCard: true,
						selectCard: 1,
						position: 'h',
						discard: false,
						lose: false,
						filter: function (event, player) {
							return player.countCards('h') > 0
						},
						check: function (card) {
							if (get.name(card) == 'sha') return 10
							return 8 - get.value(card)
						},
						content: function () {
							var name = cards[0].name
							var list = []
							game.filterPlayer().forEach(function (current) {
								list = list.concat(current.getCards('hej'))
							})
							var piles = [ui.cardPile, ui.discardPile, ui.special]
							for (var i = 0; i < piles.length; i++) {
								var pile = piles[i]
								if (!pile) continue
								for (var j = 0; j < pile.childNodes.length; j++) {
									list.push(pile.childNodes[j])
								}
							}
							var toTag = []
							for (var k = 0; k < list.length; k++) {
								var card = list[k]
								if (card && card.name == name) toTag.push(card)
							}
							if (toTag.length) lib.mjXueAddTag(toTag)
							player.awakenSkill('mjs003_skill_mjs_xinlv')
							player.addSkill('mjs003_skill_mjs_xinlv_effect')
							game.log(player, '发动〖新律〗，削弱了游戏中' + get.cnNumber(toTag.length) + '张' + get.translation(name))
						},
						ai: {
							order: function (skill, player) {
								if (!player) player = _status.event.player
								if (!player || !player.countCards('h', 'sha')) return -1
								return 7
							},
							result: {
								player: 1
							},
							threaten: 1.4
						},
						mark: true,
						marktext: '泰始',
						intro: {
							content: 'limited'
						},
						init: function (player, skill) {
							player.storage[skill] = false
						}
					},
					mjs003_skill_mjs_xinlv_effect: {
						audio: 'ext:名将杀/assets/incremental:false',
						priority: 1,
						trigger: {
							player: ['useCard', 'respond']
						},
						direct: true,
						filter: function (event, player) {
							if (!lib.mjXue) return false
							if (!event.cards || !event.cards.length) return false
							return event.cards.some(function (card) {
								return lib.mjXueHasTag(card)
							})
						},
						content: function () {
							'step 0'
							player
								.chooseTarget('新律：削弱一名角色区域内的2张牌', function (card, player, target) {
									return target.getCards('hej').some(function (c) {
										return !lib.mjXueHasTag(c)
									})
								})
								.set('ai', function (target) {
									var me = _status.event.player
									var untagged = target.getCards('hej').filter(function (c) {
										return !lib.mjXueHasTag(c)
									})
									if (untagged.length === 0) return -10
									if (target == me) return 6
									var myUntagged = me.getCards('hej').filter(function (c) {
										return !lib.mjXueHasTag(c)
									})
									if (myUntagged.length > 0) return -1
									var att = get.attitude(me, target)
									if (att > 0) return -1
									var score = -att * 2.5
									score += Math.min(untagged.length, 2) * 3
									return score
								})
							'step 1'
							if (!result.bool) {
								event.finish()
								return
							}
							var target = result.targets[0]
							var hs = target.getCards('hej').filter(function (card) {
								return !lib.mjXueHasTag(card)
							})
							var toTag = []
							if (hs.length <= 2) {
								toTag = hs.slice(0)
							} else {
								var pool = hs.slice(0)
								while (toTag.length < 2 && pool.length) {
									var card = pool.randomGet()
									pool.remove(card)
									toTag.push(card)
								}
							}
							if (toTag.length) {
								lib.mjXueAddTag(toTag)
								player.logSkill('mjs003_skill_mjs_xinlv_effect', target)
								game.log(player, '削弱了', target, '区域内的' + get.cnNumber(toTag.length) + '张牌')
							}
						},
						ai: {
							threaten: 1.3
						}
					},
					mjs003_skill_mjs_anying: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						trigger: {
							player: 'phaseJieshu'
						},
						group: ['mjs003_skill_mjs_anying_down'],
						subSkill: {
							down: {
								audio: 'ext:名将杀/assets/incremental:false',
								trigger: {
									player: 'phaseBegin'
								},
								forced: true,
								popup: false,
								filter: function (event, player) {
									return player.maxHp > player.hp
								},
								content: function () {
									'step 0'
									event.num = Math.max(0, player.maxHp - player.hp)
									if (event.num > 0) player.loseMaxHp(event.num)
									'step 1'
									if (event.num > 0) player.draw(event.num * 2)
								}
							}
						},
						content: function () {
							'step 0'
							var hs = player.getCards('h')
							event.num = hs.length
							if (hs.length) player.discard(hs)
							'step 1'
							if (event.num > 0) player.gainMaxHp(event.num)
							player.recover(1)
						},
						ai: {
							threaten: 1.2
						}
					},
					mjs003_skill_mjs_shiwu: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						trigger: {
							global: 'useCardToAfter'
						},
						direct: true,
						filter: function (event, player) {
							if (get.name(event.card) != 'sha') return false
							if (event.player == player) return false
							if (!event.target || !event.target.isAlive()) return false
							return player.inRange(event.target)
						},
						content: function () {
							'step 0'
							event.tar = trigger.target
							player
								.chooseBool('恃武：失去1点体力，摸2张牌，并对' + get.translation(event.tar) + '使用一张【杀】？')
								.set('ai', function () {
									var p = _status.event.player
									if (p.hp <= 1) return false
									return p.countCards('h', 'sha') > 0
								})
							'step 1'
							if (!result.bool) {
								event.finish()
								return
							}
							player.loseHp(1)
							player.draw(2)
							'step 2'
							var t = event.tar
							if (!t || !t.isAlive()) {
								event.finish()
								return
							}
							var next = player.chooseToUse(
								'恃武：对' + get.translation(t) + '使用一张【杀】',
								function (card, player) {
									if (get.name(card) != 'sha') return false
									return lib.filter.filterCard.apply(this, arguments)
								}
							)
							next.set('filterTarget', function (card, player, target) {
								return target == t
							})
							next.set('targetRequired', true)
							next.set('addCount', false)
						},
						ai: {
							threaten: 1.2
						}
					},

					mjs003_skill_mjs_shizu_tag: {},
					_mjs003_skill_mjs_shizu_init: {
						trigger: { global: 'gameDrawEnd' },
						forced: true,
						charlotte: true,
						silent: true,
						popup: false,
						filter: function (event, player) {
							return player == game.players[0]
						},
						content: function () {
							_status.mjsShizu = []
							_status.mjsShizuDiscard = []
							_status.mjsShizu_pile_built = false
							lib.mjsShizuInitPile()
							for (var i = 0; i < game.players.length; i++) {
								if (lib.mjsShizuIsClan(game.players[i])) game.players[i].addSkill('mjs003_skill_mjs_shizu_pile')
								if (
									lib.mjsShizuAllow(game.players[i]) &&
									!lib.mjsShizuIsClan(game.players[i]) &&
									!game.players[i].hasSkill('mjs003_skill_mjs_shizu_allowed')
								)
									game.players[i].addSkill('mjs003_skill_mjs_shizu_allowed')
							}
							lib.mjsShizuUpdate()
						}
					},
					mjs003_skill_mjs_shizu_pile: {
						charlotte: true,
						silent: true,
						popup: false,
						marktext: '士',
						intro: {
							markcount: function () {
								return lib.mjsShizuGet().length
							},
							mark: function (dialog) {
								var num = lib.mjsShizuGet().length
								var junk = lib.mjsShizuDiscardGet().length
								if (!num && !junk) return '士族牌堆与弃牌堆中都没有牌'
								dialog.addAuto(
									'牌堆 ' +
										get.cnNumber(num) +
										' 张 / 弃牌堆 ' +
										get.cnNumber(junk) +
										' 张，内容保密。每轮开始时你可以查看牌堆顶部的 5 张。'
								)
							},
							content: function () {
								var num = lib.mjsShizuGet().length
								var junk = lib.mjsShizuDiscardGet().length
								if (!num && !junk) return '士族牌堆与弃牌堆中都没有牌'
								return '牌堆 ' + get.cnNumber(num) + ' 张 / 弃牌堆 ' + get.cnNumber(junk) + ' 张（内容保密）'
							}
						}
					},
					mjs003_skill_mjs_shizu_allowed: {
						charlotte: true,
						silent: true,
						popup: false,
						nopop: true,
						mark: true,
						marktext: '允许',
						intro: {
							content: '允许：本局游戏中你可以使用士族牌，但你不是士族。'
						}
					},
					mjs003_skill_mjs_wenji: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						group: ['mjs003_skill_mjs_wenji_chang', 'mjs003_skill_mjs_wenji_shuffle']
					},
					mjs003_skill_mjs_wenji_chang: mjs_shizuEnterSkill('mjs003_skill_mjs_wenji_chang', {
						audio: 'ext:名将杀/assets/incremental:false',
						prompt: '闻鸡：立即进行一个出牌阶段？',
						boolAI: function () {
							return true
						},
						effect: function (player) {
							player.phaseUse()
						}
					}),
					mjs003_skill_mjs_wenji_shuffle: {
						audio: 'ext:名将杀/assets/incremental:false',
						trigger: { global: 'washCardAfter' },
						forced: true,
						filter: function (event, player) {
							return player.isAlive()
						},
						content: function () {
							game.trySkillAudio('mjs003_skill_mjs_wenji', player, true)
							player.phaseUse()
						}
					},
					mjs003_skill_mjs_jiji: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						enable: 'phaseUse',
						usable: 1,
						filter: function (event, player) {
							return ui.cardPile.hasChildNodes()
						},
						ai: {
							order: 10,
							result: {
								player: 1
							}
						},
						content: function () {
							'step 0'
							var pile = ui.cardPile.childNodes
							event.jcard = pile[Math.floor(pile.length / 2)]
							player.showCards(event.jcard, '击楫：牌堆中间的牌')
							'step 1'
							player.storage.mjs003_skill_mjs_jiji_effect = event.jcard
							lib.translate.mjs003_skill_mjs_jiji_effect_bg = get.translation(event.jcard.suit)
							if (player.marks && player.marks.mjs003_skill_mjs_jiji_effect) player.unmarkSkill('mjs003_skill_mjs_jiji_effect')
							if (!player.hasSkill('mjs003_skill_mjs_jiji_effect')) player.addSkill('mjs003_skill_mjs_jiji_effect')
							else player.markSkill('mjs003_skill_mjs_jiji_effect')
							game.log(player, '亮出了牌堆中间的', event.jcard)
						}
					},
					mjs003_skill_mjs_jiji_effect: {
						charlotte: true,
						silent: true,
						popup: false,
						nopop: true,
						mark: true,
						marktext: '♠',
						mod: {
							aiOrder: function (player, card, num) {
								var shown = player.storage.mjs003_skill_mjs_jiji_effect
								if (!shown || !ui.cardPile.contains(shown)) return
								if (!card || typeof card != 'object') return
								if (get.suit(shown) == get.suit(card) || get.number(shown) == get.number(card)) {
									return num + 10
								}
							}
						},
						intro: {
							name: function (storage) {
								if (!storage || !storage.suit) return '击楫'
								return '击楫 · ' + get.translation(storage.suit + '2') + get.strNumber(storage.number)
							},
							markcount: function (storage) {
								return storage && storage.number ? get.strNumber(storage.number) : 0
							},
							content: function (storage) {
								if (!storage || !storage.suit) return '击楫：尚未亮牌。'
								return (
									'击楫：已亮出 ' +
									get.translation(storage.suit + '2') +
									get.strNumber(storage.number) +
									'，你打出同花色或同点数的牌会额外结算一次。'
								)
							}
						},
						trigger: { player: ['useCardAfter', 'respondAfter'] },
						filter: function (event, player) {
							var card = player.storage.mjs003_skill_mjs_jiji_effect
							if (!card || !ui.cardPile.contains(card)) {
								if (player.marks && player.marks['mjs003_skill_mjs_jiji_effect']) {
									player.unmarkSkill('mjs003_skill_mjs_jiji_effect')
								}
								return false
							}
							if (!event.card || event.card == card) return false
							if (event.mjs003_skill_mjs_jiji_re) return false
							return get.suit(card) == get.suit(event.card) || get.number(card) == get.number(event.card)
						},
						content: function () {
							'step 0'
							if (trigger.name == 'useCard' && trigger.targets && trigger.targets.length) {
								trigger.player.useCard(trigger.card, trigger.targets.slice(0), false, 'noai').set('mjs003_skill_mjs_jiji_re', true)
							}
							'step 1'
							var top = []
							var nodes = ui.cardPile.childNodes
							for (var i = nodes.length - 1; i >= 0 && top.length < 3; i--) top.push(nodes[i])
							if (!top.length) return
							event.top = top
							player.viewCards('击楫：牌堆顶的 ' + top.length + ' 张牌', top)
							'step 2'
							player.chooseBool('击楫：是否弃置牌堆顶的 ' + event.top.length + ' 张牌？').set('ai', function () {
								return true
							})
							'step 3'
							if (result.bool) {
								game.cardsDiscard(event.top)
								game.log(player, '弃置了牌堆顶的', get.cnNumber(event.top.length), '张牌')
							}
						}
					},
					mjs003_skill_mjs_zimu: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						group: ['mjs003_skill_mjs_zimu_skip', 'mjs003_skill_mjs_zimu_gain']
					},
					mjs003_skill_mjs_zimu_skip: {
						charlotte: true,
						silent: true,
						popup: false,
						trigger: { player: 'phaseBegin' },
						forced: true,
						content: function () {
							game.trySkillAudio('mjs003_skill_mjs_zimu', player, true)
							player.skip('phaseDraw')
						}
					},
					mjs003_skill_mjs_zimu_gain: {
						audio: 'ext:名将杀/assets/incremental:false',
						trigger: { global: 'phaseEnd' },
						filter: function (event, player) {
							if (!player || !player.isAlive() || !ui.discardPile) return false
							var types = {}
							var nodes = Array.prototype.slice.call(ui.discardPile.childNodes)
							for (var i = 0; i < nodes.length; i++) {
								var c = nodes[i]
								if (!c || get.itemtype(c) != 'card') continue
								var t = get.type(c, 'trick')
								if (t) types[t] = true
							}
							var n = 0
							for (var k in types) n++
							return n >= 2
						},
						check: function (trigger, player) {
							return !player || player.hp > 2
						},
						content: function () {
							'step 0'
							player
								.chooseControl('失去1点体力', '失去1点体力上限')
								.set('prompt', '自募：失去 1 点体力或 1 点体力上限')
								.set('ai', function (event, player) {
									var p = player || _status.event.player
									if (p.hp == p.maxHp) return '失去1点体力'
									if (p.hp < p.maxHp - 1 || p.hp <= 2) return '失去1点体力上限'
									return '失去1点体力'
								})
							'step 1'
							if (result.index == 1) {
								player.loseMaxHp(1)
							} else {
								player.loseHp(1)
							}
							'step 2'
							var groups = {}
							var nodes = Array.prototype.slice.call(ui.discardPile.childNodes)
							for (var i = 0; i < nodes.length; i++) {
								var c = nodes[i]
								if (!c || get.itemtype(c) != 'card') continue
								var t = get.type(c, 'trick')
								if (!t) continue
								if (!groups[t]) groups[t] = []
								if (!groups[t].contains(c)) groups[t].push(c)
							}
							var keys = Object.keys(groups)
							keys.sort(function () {
								return Math.random() - 0.5
							})
							var gain = []
							for (var i = 0; i < keys.length && i < 3; i++) {
								gain.push(groups[keys[i]].randomGet())
							}
							if (!gain.length) return
							player.gain(gain, 'gain2')
							game.log(player, '获得了', gain.length, '张牌')
						}
					},
					mjs003_skill_mjs_shizu: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						group: ['mjs003_skill_mjs_shizu_round'],
						init: function (player) {
							player.storage.mjs003_skill_mjs_shizu = true
						},
						ai: {
							threaten: 1.2
						}
					},
					mjs003_skill_mjs_shizu_revive: {
						charlotte: true,
						silent: true,
						popup: false,
						init: function (player) {
							var _origRevive = player.revive
							player.revive = function () {
								_origRevive.apply(this, arguments)
								if (lib.mjsShizuIsClan && lib.mjsShizuIsClan(this) && !this.hasSkill('mjs003_skill_mjs_shizu_pile')) {
									this.addSkill('mjs003_skill_mjs_shizu_pile')
								}
								if (
									lib.mjsShizuAllow &&
									lib.mjsShizuIsClan &&
									lib.mjsShizuAllow(this) &&
									!lib.mjsShizuIsClan(this) &&
									!this.hasSkill('mjs003_skill_mjs_shizu_allowed')
								) {
									this.addSkill('mjs003_skill_mjs_shizu_allowed')
								}
							}
						}
					},

					mjs003_skill_mjs_shizu_round: {
						audio: 'ext:名将杀/assets/incremental:false',
						charlotte: true,
						trigger: {
							global: 'roundStart'
						},
						filter: function (event, player) {
							if (!player.isAlive()) return false
							if (!_status.mjsShizu_pile_built) return true
							return lib.mjsShizuGet().length > 0 || lib.mjsShizuDiscardGet().length > 0
						},
						check: function () {
							return true
						},
						content: function () {
							'step 0'
							game.trySkillAudio('mjs003_skill_mjs_shizu', player, true)
							event.top = lib.mjsShizuPeekTop(player, 5)
							var num = Math.min(2, event.top.length)
							if (!num) {
								event.finish()
								return
							}
							player
								.chooseCardButton(
									'士族：查看士族牌堆顶的' +
										get.cnNumber(event.top.length) +
										'张牌，选择获得其中' +
										get.cnNumber(num) +
										'张',
									event.top,
									num
								)
								.set('ai', function (button) {
									var player = _status.event.player
									var top = lib.mjsShizuGet().slice(0, 5)
									var best = 0
									for (var i = 0; i < top.length; i++) {
										best = Math.max(best, get.value(top[i], player))
									}
									if (best < 6) return Math.random()
									return get.value(button.link, player)
								})
							'step 1'
							if (result.bool && result.links && result.links.length) {
								var got = result.links.slice(0)
								lib.mjsShizuTake(got)
								player.gain(got, 'draw')
								game.log(player, '从士族牌堆获得了', get.cnNumber(got.length) + '张士族牌')
							}
						},
						ai: {
							threaten: 1.2
						}
					},
					_mjs003_skill_mjs_shizu_gate: {
						mod: {
							cardEnabled2: function (card, player) {
								if (!lib.mjsShizuHasTag(card)) return
								if (lib.mjsShizuAllow(player)) return
								return false
							}
						}
					},
					_mjs003_skill_mjs_shizu_recycle: {
						trigger: {
							global: ['cardsDiscardAfter', 'loseAfter', 'loseAsyncAfter']
						},
						forced: true,
						silent: true,
						popup: false,
						charlotte: true,
						filter: function (event, player) {
							return lib.mjsShizuGetDiscard().length > 0
						},
						content: function () {
							'step 0'
							var cards = lib.mjsShizuGetDiscard()
							if (!cards.length) return
							lib.mjsShizuDiscardPush(cards)
							game.log(get.cnNumber(cards.length) + '张士族牌进入了士族弃牌堆')
						}
					},
					mjs003_skill_mjs_shizu_yiwu: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						enable: 'phaseUse',
						usable: 1,
						position: 'he',
						selectCard: [1, Infinity],
						discard: false,
						lose: false,
						filter: function (event, player) {
							return (
								player.countCards('he', function (card) {
									return !lib.mjsShizuHasTag(card)
								}) > 0
							)
						},
						filterCard: function (card) {
							return !lib.mjsShizuHasTag(card)
						},
						check: function (card) {
							if (lib.mjsShizuHasTag(card)) return -1
							return 6 - get.value(card, _status.event.player)
						},
						group: ['mjs003_skill_mjs_shizu_yiwu_chang'],
						subSkill: {
							chang: mjs_shizuEnterSkill('mjs003_skill_mjs_shizu_yiwu_chang', {
								audio: 'ext:名将杀/assets/incremental:false',
								prompt: '夷吾：令一名其他角色在本局游戏中可以打出士族牌？',
								boolAI: function () {
									var player = _status.event.player
									return game.hasPlayer(function (current) {
										return (
											current != player &&
											current.isAlive() &&
											get.attitude(player, current) > 0 &&
											!lib.mjsShizuAllow(current)
										)
									})
								},
								target: {
									prompt: '夷吾：选择一名其他角色',
									filter: function (card, player, target) {
										return target != player
									},
									ai: function (target) {
										var player = _status.event.player
										var att = get.attitude(player, target)
										if (att <= 0) return -1
										if (lib.mjsShizuAllow(target)) return 0.5
										return att + 1
									}
								},
								effect: function (player, target) {
									game.broadcastAll(function (t) {
										t.storage.mjs003_skill_mjs_shizu_granted = true
										if (!t.hasSkill('mjs003_skill_mjs_shizu_allowed')) t.addSkill('mjs003_skill_mjs_shizu_allowed')
									}, target)
									if (lib.mjsShizuIsClan(target) && !target.hasSkill('mjs003_skill_mjs_shizu_pile')) {
										target.addSkill('mjs003_skill_mjs_shizu_pile')
									}
									lib.mjsShizuUpdate()
									game.log(player, '令', target, '在本局游戏中可以打出士族牌')
								}
							})
						},
						content: function () {
							'step 0'
							event._cards = cards.slice(0)
							lib.mjsShizuPush(event._cards, true)
							game.log(player, '将', get.cnNumber(event._cards.length) + '张牌转化为士族牌，放入了士族牌堆顶')
							'step 1'
							var num = event._cards.length
							player
								.chooseControl('+1', '-1')
								.set('prompt', '夷吾：选择目标获得的士族牌数量')
								.set(
									'prompt2',
									'本次转化 ' +
										get.cnNumber(num) +
										' 张；目标将获得 ' +
										get.cnNumber(num + 1) +
										' 张或 ' +
										get.cnNumber(Math.max(0, num - 1)) +
										' 张'
								)
								.set('ai', function () {
									return 0
								})
							'step 2'
							if (!result || !result.control) {
								event.finish()
								return
							}
							event.delta = result.control == '+1' ? 1 : -1
							player
								.chooseTarget('夷吾：选择获得士族牌的角色', function (card, player, target) {
									return true
								})
								.set('ai', function (target) {
									var player = _status.event.player
									var allTagged =
										player.countCards('h') > 0 &&
										player.countCards('h', function (card) {
											return !lib.mjsShizuHasTag(card)
										}) == 0
									if (target == player) {
										if (!allTagged) return 10
										var ally = game.hasPlayer(function (current) {
											return (
												current != player &&
												current.isAlive() &&
												get.attitude(player, current) > 0 &&
												lib.mjsShizuAllow(current)
											)
										})
										return ally ? -1 : 10
									}
									var att = get.attitude(player, target)
									if (att <= 0) return -1
									return Math.min(9, att + (lib.mjsShizuAllow(target) ? 5 : 0))
								})
							'step 3'
							if (!result.bool || !result.targets || !result.targets.length) {
								event.finish()
								return
							}
							var target = result.targets[0]
							var num2 = Math.max(0, event._cards.length + event.delta)
							var got = lib.mjsShizuGet().slice(0, num2)
							if (got.length) {
								lib.mjsShizuTake(got)
								target.gain(got, 'draw')
								game.log(player, '令', target, '获得了', get.cnNumber(got.length), '张士族牌')
							} else {
								game.log(player, '令', target, '获得了', get.cnNumber(0), '张士族牌')
							}
						},
						ai: {
							order: 5,
							result: {
								player: 1
							},
							threaten: 1.2
						}
					},
					mjs003_skill_mjs_shizu_zhenjing: {
						audio: 'ext:名将杀/assets/incremental:false',
						trigger: {
							target: 'useCardToAfter'
						},
						filter: function (event, player) {
							if (event.player == player) return false
							if (event.responded) return false
							return lib.mjsShizuGet().length > 0
						},
						content: function () {
							'step 0'
							player
								.chooseTarget('镇静：选择获得 1 张士族牌的角色', function (card, player, target) {
									return true
								})
								.set('ai', function (target) {
									return get.attitude(_status.event.player, target)
								})
							'step 1'
							if (!result.bool || !result.targets || !result.targets.length) {
								event.finish()
								return
							}
							var target = result.targets[0]
							var got = lib.mjsShizuGet().slice(0, 1)
							if (got.length) {
								lib.mjsShizuTake(got)
								target.gain(got, 'draw')
								game.log(player, '令', target, '获得了 1 张士族牌')
							}
						},
						ai: {
							threaten: 1.2
						}
					},
					mjs003_skill_mjs_xicao: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						trigger: { player: 'useCard2' },
						direct: true,
						group: ['mjs003_skill_mjs_xicao_skip', 'mjs003_skill_mjs_xicao_duel'],
						filter: function (event, player) {
							if (!event.targets || event.targets.length != 1) return false
							if (!event.targets[0] || event.targets[0] == player) return false
							var info = lib.card[get.name(event.card)]
							if (!info || info.type == 'delay') return false
							if (event.mjs003_skill_mjs_xicao_fake) return false
							return game.hasPlayer(function (current) {
								return (
									current != player &&
									!event.targets.contains(current) &&
									lib.filter.targetInRange(event.card, player, current) &&
									lib.filter.targetEnabled(event.card, player, current)
								)
							})
						},
						content: function () {
							'step 0'
							player
								.chooseTarget('戏曹：是否额外指定一名其他角色为目标？', function (card, player, target) {
									var evt = _status.event.getTrigger()
									return (
										target != player &&
										!evt.targets.contains(target) &&
										lib.filter.targetInRange(evt.card, player, target) &&
										lib.filter.targetEnabled(evt.card, player, target)
									)
								})
								.set('ai', function (target) {
									var evt = _status.event.getTrigger()
									var eff = get.effect(target, evt.card, evt.player, evt.player)
									if (eff <= 0) return eff
									if (target.hp <= 1) eff += 2
									return eff - 0.2
								})
							'step 1'
							if (!result.bool || !result.targets || !result.targets.length) {
								event.finish()
								return
							}
							player.logSkill('mjs003_skill_mjs_xicao', result.targets)
							trigger.targets.addArray(result.targets)
							game.log(result.targets, '成为了', trigger.card, '的额外目标')
							player
								.chooseTarget(
									'戏曹：指定其中一名目标为虚假目标（其可正常响应此牌，但此牌不会对其生效）',
									true,
									function (card, player, target) {
										return _status.event.mjs003_skill_mjs_xicao_targets.contains(target)
									},
									[1, 1]
								)
								.set('mjs003_skill_mjs_xicao_targets', trigger.targets.slice(0))
								.set('ai', function (target) {
									var evt = _status.event.getTrigger()
									var score = get.effect(target, evt.card, evt.player, evt.player)
									if (target.mayHaveShan()) score -= 1.5
									return score
								})
							'step 2'
							var fake = result.targets[0]
							trigger.mjs003_skill_mjs_xicao_fake = fake
							if (get.name(trigger.card) == 'sha') {
								if (!trigger.customArgs) trigger.customArgs = { default: {} }
								trigger.customArgs[fake.playerid] = { unhurt: true }
							}
							game.log(fake, '成为了', trigger.card, '的虚假目标')
							player.popup('戏曹')
						},
						subSkill: {
							skip: {
								trigger: { player: 'useCardToBefore' },
								forced: true,
								silent: true,
								popup: false,
								filter: function (event, player) {
									if (event.type != 'card' || !event.target) return false
									var uc = event.getParent('useCard')
									if (!uc || uc.mjs003_skill_mjs_xicao_fake != event.target) return false
									var name = get.name(event.card)
									return name != 'sha' && name != 'juedou'
								},
								content: function () {
									trigger.setContent('emptyEvent')
								}
							},
							duel: {
								trigger: { global: 'damageBegin4' },
								forced: true,
								silent: true,
								popup: false,
								filter: function (event, player) {
									if (!event.player) return false
									var evt = event.parent
									while (evt && !(evt.name == 'juedou' && evt.type == 'card')) {
										evt = evt.parent
									}
									if (!evt) return false
									var uc = evt.getParent('useCard')
									if (!uc || !uc.mjs003_skill_mjs_xicao_fake) return false
									var fake = uc.mjs003_skill_mjs_xicao_fake
									if (event.player == fake && evt.target == fake) return true
									return event.source == fake && event.player == evt.player
								},
								content: function () {
									trigger.cancel()
								}
							}
						}
					},
					mjs003_skill_mjs_dunjia: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						trigger: { player: 'phaseBegin' },
						forced: true,
						direct: true,
						silent: true,
						priority: 1,
						content: function () {
							'step 0'
							var dunjiaBan = []
							var pack = lib.characterPack['mjs']
							var pool = []
							for (var i in pack) {
								if (
									dunjiaBan.indexOf(i) < 0 &&
									i != player.name1 &&
									i != player.name2 &&
									lib.character[i] &&
									lib.character[i][3] &&
									lib.character[i][3].length
								) {
									pool.push(i)
								}
							}
							if (!pool.length) {
								event.finish()
								return
							}
							var seen = player.storage.mjs003_skill_mjs_dunjia_seen
							if (!Array.isArray(seen)) seen = []
							var fresh = pool.filter(function (name) {
								return !seen.contains(name)
							})
							if (fresh.length < 3) {
								seen = []
								fresh = pool.slice()
							}
							event.list = fresh.randomGets(3)
							for (var j = 0; j < event.list.length; j++) {
								if (!seen.contains(event.list[j])) seen.push(event.list[j])
							}
							player.storage.mjs003_skill_mjs_dunjia_seen = seen
							if (player.isUnderControl()) game.swapPlayerAuto(player)
							player
								.chooseButton(['遁甲：选择一名武将，直到你的下回合开始获得其所有技能', [event.list, 'character']], true)
								.set('ai', function (button) {
									var skills = lib.character[button.link][3]
									var sum = 0
									for (var i = 0; i < skills.length; i++) {
										sum += get.skillRank(skills[i], 'in')
									}
									return sum
								})
							'step 1'
							if (!result.bool || !result.links || !result.links.length) {
								event.finish()
								return
							}
							var name = result.links[0]
							var skills = lib.character[name][3]
							player.logSkill('mjs003_skill_mjs_dunjia')
							var olds = player.additionalSkills.mjs003_skill_mjs_dunjia ? player.additionalSkills.mjs003_skill_mjs_dunjia.slice(0) : []
							var oldName = player.storage.mjs003_skill_mjs_dunjia
							if (oldName && lib.character[oldName]) {
								for (var i = 0; i < lib.character[oldName][3].length; i++) {
									if (!olds.contains(lib.character[oldName][3][i])) olds.push(lib.character[oldName][3][i])
								}
							}
							for (var i = 0; i < player.skills.length; i++) {
								var sk = player.skills[i]
								if (
									sk.indexOf('mjs_') == 0 &&
									sk != 'mjs003_skill_mjs_xicao' &&
									sk != 'mjs003_skill_mjs_dunjia' &&
									sk != 'mjs003_skill_mjs_feisheng' &&
									!olds.contains(sk) &&
									!skills.contains(sk)
								)
									olds.push(sk)
							}
							for (var i = 0; i < olds.length; i++) {
								player.$removeSkill(olds[i])
							}
							player.additionalSkills.mjs003_skill_mjs_dunjia = skills.slice()
							player.addAdditionalSkill('mjs003_skill_mjs_dunjia', skills.slice(), true)

							for (var si = 0; si < skills.length; si++) {
								var s2 = skills[si]
								if (player.skills.contains(s2)) continue
								player.skills.add(s2)
								game.broadcast(
									function (player, skill) {
										player.skills.add(skill)
									},
									player,
									s2
								)
							}
							player.flashAvatar('mjs003_skill_mjs_dunjia', name)
							player.storage.mjs003_skill_mjs_dunjia = name
							player.markSkill('mjs003_skill_mjs_dunjia')
							game.broadcastAll(
								function (player, name) {
									var mark = player.marks.mjs003_skill_mjs_dunjia
									if (!mark) return
									if (mark.firstChild) {
										mark.firstChild.innerHTML =
											'<span style="display:inline-block">' + get.translation(name) + '</span>'
									}
								},
								player,
								name
							)
							game.log(player, '获得了', '#y' + get.translation(name), '的所有技能（直到你的下回合开始）')
							player.popup(name)
						},
						intro: {
							nocount: true,
							content: function (storage, player) {
								var skills = player.additionalSkills.mjs003_skill_mjs_dunjia || []
								if (!skills.length) return '暂无借用技能'
								var list = []
								for (var i = 0; i < skills.length; i++) {
									list.push('【' + get.translation(skills[i]) + '】')
								}
								return '当前借用 ' + get.translation(storage) + '：' + list.join('、')
							}
						}
					},
					mjs003_skill_mjs_feisheng: mjs_shizuEnterSkill('mjs003_skill_mjs_feisheng', {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						extraTrigger: { player: 'phaseBegin' },
						forced: true,
						direct: true,
						popup: false,
						silent: true,
						content: function () {
							'step 0'
							player.judge()
							'step 1'
							event.num1 = result.number
							player.judge()
							'step 2'
							event.num2 = result.number
							player.maxHp = event.num1
							if (player.hp < player.maxHp) player.hp = player.maxHp
							player.update()
							player.storage.mjs003_skill_mjs_feisheng = event.num2
							game.log(
								player,
								'的判定点数依次为',
								'#y' + event.num1 + '、' + event.num2,
								'：体力值与上限变为' + event.num1 + '，手牌上限变为' + event.num2
							)
							player.popup('飞升')
							game.trySkillAudio('mjs003_skill_mjs_feisheng', player, true)
						},
						group: ['mjs003_skill_mjs_feisheng_limit'],
						subSkill: {
							limit: {
								mod: {
									maxHandcardFinal: function (player, num) {
										if (typeof player.storage.mjs003_skill_mjs_feisheng == 'number') {
											return player.storage.mjs003_skill_mjs_feisheng
										}
									}
								},
								charlotte: true,
								sub: true
							}
						}
					}),
					mjs003_skill_mjs_shangsiyaoyu: mjs_shizuEnterSkill('mjs003_skill_mjs_shangsiyaoyu', {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						forced: true,
						content: function () {
							'step 0'
							event.asked = []
							event.agree = 0
							event.current = player.next
							'step 1'
							if (!event.current || event.current == player || event.asked.contains(event.current)) {
								event.goto(3)
								return
							}
							event.asked.push(event.current)
							event.current
								.chooseBool('上巳耀舆', '是否令' + get.translation(player) + '因此技能装备的装备种类 +1？')
								.set('ai', function () {
									return get.attitude(_status.event.player, player) > 0
								})
							'step 2'
							if (result.bool) {
								event.agree++
								player.line(event.current, 'green')
							}
							event.current = event.current.next
							event.goto(1)
							'step 3'
							event.count = Math.min(event.agree + 3, 5)
							event.types = []
							event.tried = []
							event.exhausted = false
							game.log(
								player,
								'上巳耀舆：' + get.cnNumber(event.agree) + '名角色同意，需装备' + get.cnNumber(event.count) + '种装备'
							)
							'step 4'
							if (event.types.length >= event.count) {
								event.goto(6)
								return
							}
							event.card = get.cardPile2(function (card) {
								return get.type(card) == 'equip' && !event.tried.contains(card)
							})
							if (!event.card) {
								event.exhausted = true
								event.goto(6)
								return
							}
							event.tried.push(event.card)
							player.gain(event.card, 'gain2')
							'step 5'
							player.equip(event.card)
							var subtype = get.subtype(event.card)
							if (subtype && !event.types.contains(subtype)) event.types.push(subtype)
							event.goto(4)
							'step 6'
							if (event.exhausted) {
								game.log(player, '上巳耀舆：牌堆里的装备牌已摸空（共摸过' + get.cnNumber(event.tried.length) + '张）')
							}
							game.log(player, '上巳耀舆：共装备了' + get.cnNumber(event.types.length) + '种装备')
						}
					}),
					mjs003_skill_mjs_dujianghualong: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						trigger: { global: ['loseAfter', 'cardsDiscardAfter', 'gainAfter'] },
						forced: true,
						silent: true,
						mark: true,
						marktext: '化龙',
						intro: {
							name: '化龙',
							markcount: function (storage, player) {
								return player.storage.mjs_dujiang_count || 0
							}
						},
						filter: function (event, player) {
							if (event.cards && event.cards.length) {
								if (event.name == 'lose' && event.position == ui.discardPile && event.cards.filterInD('d').length)
									return true
								if (event.name == 'cardsDiscard' && event.cards.filterInD('d').length) return true
							}
							if (!player.storage.mjs_dujiang_ready && ui.discardPile.childNodes.length > ui.cardPile.childNodes.length)
								return true
							return false
						},
						content: function () {
							game.trySkillAudio('mjs003_skill_mjs_dujianghualong', player, true)
							if (trigger.name == 'lose' || trigger.name == 'cardsDiscard') {
								var cards = (trigger.cards || []).filterInD('d')
								if (cards.length) {
									var count = player.storage.mjs_dujiang_count || 0
									if (count >= 8) count -= 8
									count += cards.length
									while (count >= 8) {
										count -= 8
										player.draw()
										game.log(player, '渡江化龙：弃牌堆已积累8张牌，摸一张牌')
									}
									if (count === 0) count = 8
									player.storage.mjs_dujiang_count = count
									player.markSkill('mjs003_skill_mjs_dujianghualong')
								}
							}
							if (
								!player.storage.mjs_dujiang_ready &&
								ui.discardPile.childNodes.length > ui.cardPile.childNodes.length
							) {
								player.storage.mjs_dujiang_ready = true
								if (!player.hasSkill('mjs003_skill_mjs_tongshengyuchuang')) player.addSkill('mjs003_skill_mjs_tongshengyuchuang')
								player.drawTo(player.getHandcardLimit())
								game.log(player, '渡江化龙：弃牌堆多于牌堆，手牌上限+1，获得技能【同升御床】')
							}
						},
						mod: {
							maxHandcard: function (player, num) {
								if (player.storage.mjs_dujiang_ready) return num + 1
							}
						}
					},
					mjs003_skill_mjs_tongshengyuchuang: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						trigger: { player: 'gainAfter' },
						usable: 1,
						direct: true,
						filter: function (event, player) {
							return player.countCards('h') >= player.getHandcardLimit()
						},
						content: function () {
							'step 0'
							player
								.chooseTarget(1, '同升御床：令一名其他角色摸牌至手牌上限', function (card, player, target) {
									return target != player
								})
								.set('ai', function (target) {
									var player = _status.event.player
									var num = target.getHandcardLimit() - target.countCards('h')
									if (num <= 0) return 0
									if (get.attitude(player, target) > 0) return 1 + num * 0.5
									return 0
								})
							'step 1'
							if (result.bool && result.targets && result.targets.length) {
								var target = result.targets[0]
								player.logSkill('mjs003_skill_mjs_tongshengyuchuang', target)
								target.drawTo(target.getHandcardLimit())
								game.log(target, '同升御床：摸牌至手牌上限')
							}
						}
					},
					mjs003_skill_mjs_cunsishenshen: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						zzKeys: ['phaseZhunbei', 'phaseJudge', 'phaseDraw', 'phaseUse', 'phaseDiscard', 'phaseJieshu'],
						zzNames: ['准备阶段', '判定阶段', '摸牌阶段', '出牌阶段', '弃牌阶段', '结束阶段'],
						audio: false,
						mark: true,
						marktext: '存思',
						intro: {
							name: '阶段转化',
							markcount: function (storage, player) {
								var map = player.storage.cunsi_phase_map
								if (!map) return 0
								var n = 0
								for (var i in map) {
									if (map[i] != i) n++
								}
								return n
							},
							content: function (storage, player) {
								var map = player.storage.cunsi_phase_map
								var keys = lib.skill.mjs003_skill_mjs_cunsishenshen.zzKeys
								var names = lib.skill.mjs003_skill_mjs_cunsishenshen.zzNames
								if (!map || !keys) return '尚未转化任何阶段'
								var list = []
								for (var i = 0; i < keys.length; i++) {
									var to = map[keys[i]]
									if (to && to != keys[i]) list.push(names[i] + ' → ' + names[keys.indexOf(to)])
								}
								return list.length ? list.join('<br>') : '尚未转化任何阶段'
							}
						},
						trigger: { player: 'gainAfter' },
						filter: function (event, player) {
							if (!event.cards || !event.cards.length) return false
							if (event.relatedLose) return false
							for (var i = 0; i < event.cards.length; i++) {
								if (get.owner(event.cards[i]) == player && get.position(event.cards[i]) == 'h') return true
							}
							return false
						},
						direct: true,
						content: function () {
							'step 0'
							var mjsPh = trigger.getParent('phase')
							if (mjsPh) mjsPh._mjsFire = (mjsPh._mjsFire || 0) + 1
							game.mjsWCLog(
								'存思身神 · 发动 ｜ 触发器 ' +
									trigger.name +
									' ｜ 获得牌 ' +
									(trigger.cards ? trigger.cards.length : 0) +
									' 张 ｜ 阶段 ' +
									game.mjsWCPhase(mjsPh) +
									' ｜ 本阶段第 ' +
									(mjsPh ? mjsPh._mjsFire : '?') +
									' 次'
							)
							var mjsLogOutside = _status.currentPhase != player
							var mjsLogWill = game.mjsWCPick(player, mjsLogOutside)
							var mjsLogHand = player.countCards('h')
							var mjsLogHandAfter = mjsLogHand - game.mjsWCGainInHand(player, trigger)
							game.mjsWCLog(
								'　AI档位：她的回合数=' +
									(player.phaseNumber || 0) +
									' ｜ 本次=' +
									(mjsLogOutside ? '回合外' : '自己回合') +
									' ｜ 候选=' +
									((player.phaseNumber || 0) >= 2 || mjsLogOutside ? '出牌/弃牌/结束/准备/判定' : '出牌/弃牌/结束') +
									' ｜ 手牌(放回前→放回后)=' +
									mjsLogHand +
									'→' +
									mjsLogHandAfter +
									' ｜ AI选中=' +
									(game.mjsWCPick(player, mjsLogOutside) || '无可改阶段') +
									' ｜ 摸牌→出牌=' +
									(game.mjsWCPickDraw(player, mjsLogHandAfter) ? '可做' : '不做') +
									' ｜ 借还=' +
									(game.mjsWCSwapCheck(player, mjsLogHandAfter, mjsLogWill) ? '可做' : '不做') +
									' ｜ 发动=' +
									!!(
										game.mjsWCPick(player, mjsLogOutside) ||
										game.mjsWCPickDraw(player, mjsLogHandAfter) ||
										game.mjsWCSwapCheck(player, mjsLogHandAfter, mjsLogWill)
									)
							)
							game.mjsWCLog('　事件链：' + game.mjsWCChain())
							var cards = []
							for (var i = 0; i < trigger.cards.length; i++) {
								var card = trigger.cards[i]
								if (get.owner(card) == player && get.position(card) == 'h') cards.push(card)
							}
							if (!cards.length) {
								game.mjsWCLog('　手牌里已找不到本次获得的牌 → 直接结束（不询问）')
								event.finish()
								return
							}
							game.mjsWCLog('　可放回的牌 ' + cards.length + ' 张 → 弹出询问框')
							event._cards = cards
							event._mjsHandBefore = player.countCards('h')
							event._mjsOutside = _status.currentPhase != player
							player
								.chooseBool(
									get.prompt2('mjs003_skill_mjs_cunsishenshen'),
									'将本次获得的' +
										get.cnNumber(cards.length) +
										'张牌按原顺序放回牌堆顶，然后将你的1个阶段永久改为另1个阶段'
								)
								.set('ai', function (evt, p) {
									var outside = _status.currentPhase != p
									var mjsAiHA = p.countCards('h') - game.mjsWCGainInHand(p, trigger)
									var mjsAiWill = game.mjsWCPick(p, outside)
									return !!(
										game.mjsWCPick(p, outside) ||
										game.mjsWCPickDraw(p, mjsAiHA) ||
										game.mjsWCSwapCheck(p, mjsAiHA, mjsAiWill)
									)
								})
							'step 1'
							game.mjsWCLog('　玩家选择放回 = ' + result.bool)
							if (!result.bool) {
								game.mjsWCRecord(
									player,
									trigger.getParent('phase'),
									'获得=' +
										(event._cards ? event._cards.length : 0) +
										'张 ｜ 放回=否 ｜ 映射不变 ' +
										JSON.stringify(player.storage.cunsi_phase_map || {})
								)
								event.finish()
								return
							}
							player.lose(event._cards, ui.cardPile).set('visible', true)
							'step 2'
							var back = event._cards.slice(0)
							for (var i = back.length - 1; i >= 0; i--) {
								ui.cardPile.insertBefore(back[i], ui.cardPile.firstChild)
							}
							game.mjsWCLog(
								'　已放回牌堆顶 ' + back.length + ' 张 ｜ 牌堆现有 ' + ui.cardPile.childNodes.length + ' 张'
							)
							event._mjsHandAfter = event._mjsHandBefore - back.length
							game.mjsWCLog('　手牌：放回前 ' + event._mjsHandBefore + ' → 放回后 ' + event._mjsHandAfter)
							for (var j = 0; j < back.length; j++) {
								var ow = get.owner(back[j])
								game.mjsWCLog(
									'　　第' +
										(j + 1) +
										'张 ' +
										get.name(back[j]) +
										' ｜ owner=' +
										(ow ? ow.name : '无') +
										' ｜ 位置=' +
										(get.position(back[j]) || 'undefined')
								)
							}
							var phaseEvt = trigger.getParent('phase')
							if (phaseEvt) phaseEvt._mjsPutBack = (phaseEvt._mjsPutBack || 0) + back.length
							game.log(player, '将', back, '按原顺序放回牌堆顶')
							event._keys = lib.skill.mjs003_skill_mjs_cunsishenshen.zzKeys
							event._names = lib.skill.mjs003_skill_mjs_cunsishenshen.zzNames
							if ((player != game.me || _status.auto) && !game.mjsWCPick(player, event._mjsOutside)) {
								game.mjsWCLog('　AI 且没有阶段可改 → 跳过选阶段，直接处理「手牌>10」那一步')
								event.goto(6)
								return
							}
							'step 3'
							player
								.chooseControl(event._names)
								.set('prompt', '存思身神：选择要【被改掉】的阶段')
								.set('ai', function (evt, p) {
									var k = game.mjsWCPick(p, _status.currentPhase != p)
									if (!k) return 0
									var idx = lib.skill.mjs003_skill_mjs_cunsishenshen.zzKeys.indexOf(k)
									return idx < 0 ? 0 : idx
								})
							'step 4'
							event._from = event._keys[result.index]
							event._fromName = event._names[result.index]
							game.mjsWCLog('　选定【被改掉】的阶段：' + event._fromName + '（' + event._from + '）')
							var toNames = []
							var toKeys = []
							var i
							for (i = 0; i < event._keys.length; i++) {
								if (event._keys[i] != event._from && event._keys[i] == 'phaseDraw') {
									toNames.push(event._names[i])
									toKeys.push(event._keys[i])
								}
							}
							for (i = 0; i < event._keys.length; i++) {
								if (event._keys[i] != event._from && event._keys[i] != 'phaseDraw') {
									toNames.push(event._names[i])
									toKeys.push(event._keys[i])
								}
							}
							event._toNames = toNames
							event._toKeys = toKeys
							game.mjsWCLog('　可选目标阶段：' + toNames.join('、'))
							player
								.chooseControl(toNames)
								.set('prompt', '存思身神：将【' + event._fromName + '】永久改为')
								.set('ai', function (evt, p) {
									var idx = evt._toNames.indexOf('摸牌阶段')
									return idx >= 0 ? idx : 0
								})
							'step 5'
							var to = event._toKeys[result.index]
							var toName = event._toNames[result.index]
							if (!player.storage.cunsi_phase_map) player.storage.cunsi_phase_map = {}
							player.storage.cunsi_phase_map[event._from] = to
							event._mjsChangedKey = event._from
							player.updateMarks()
							player.logSkill('mjs003_skill_mjs_cunsishenshen')
							game.log(player, '将【' + event._fromName + '】永久改为【' + toName + '】')
							game.mjsWCRecord(
								player,
								trigger.getParent('phase'),
								'获得=' +
									(event._cards ? event._cards.length : 0) +
									'张 ｜ 放回=是 ｜ 被改=' +
									event._fromName +
									' → 目标=' +
									toName +
									' ｜ 映射=' +
									JSON.stringify(player.storage.cunsi_phase_map)
							)
							game.mjsWCLog('　★ 写入映射：' + event._from + ' → ' + to)
							game.mjsWCLog('　当前映射表：' + JSON.stringify(player.storage.cunsi_phase_map))
							game.mjsWCLog(
								'　上清真经已在身 = ' +
									player.hasSkill('mjs003_skill_mjs_shangqingzhenjing') +
									' ｜ mjs_seq=' +
									JSON.stringify(player.storage.mjs_seq || []) +
									' ｜ extra_draw=' +
									!!player.storage.mjs_extra_draw +
									' ｜ extra_use=' +
									!!player.storage.mjs_extra_use
							)
							event.goto(6)
							'step 6'
							if (player != game.me || _status.auto) {
								if (game.mjsWCPickDraw(player, event._mjsHandAfter)) {
									if (!player.storage.cunsi_phase_map) player.storage.cunsi_phase_map = {}
									player.storage.cunsi_phase_map.phaseDraw = 'phaseUse'
									player.updateMarks()
									game.log(player, '将【摸牌阶段】永久改为【出牌阶段】')
									game.mjsWCLog(
										'　★ 手牌>10（放回后 ' +
											event._mjsHandAfter +
											' 张，放回前 ' +
											event._mjsHandBefore +
											'）→ 写入映射：phaseDraw → phaseUse'
									)
									game.mjsWCLog('　当前映射表：' + JSON.stringify(player.storage.cunsi_phase_map))
									game.mjsWCRecord(
										player,
										trigger.getParent('phase'),
										'手牌=放回后 ' +
											event._mjsHandAfter +
											'张（放回前 ' +
											event._mjsHandBefore +
											') ｜ 手牌>10（放回后）→ 摸牌阶段改为出牌阶段 ｜ 映射=' +
											JSON.stringify(player.storage.cunsi_phase_map)
									)
								}
							}
							'step 7'
							var mjsZzK = lib.skill.mjs003_skill_mjs_cunsishenshen.zzKeys
							var mjsZzN = lib.skill.mjs003_skill_mjs_cunsishenshen.zzNames
							var mjsMapNow = player.storage.cunsi_phase_map || {}
							var mjsCan = []
							for (var mjsI = 0; mjsI < mjsZzK.length; mjsI++) {
								if (mjsMapNow[mjsZzK[mjsI]] == 'phaseDraw') mjsCan.push(mjsZzN[mjsI])
							}
							if (player != game.me || _status.auto) {
								var mjsSwap = game.mjsWCSwap(player, event._mjsHandAfter, event._mjsChangedKey)
								if (mjsSwap) {
									var mjsZZKeys = lib.skill.mjs003_skill_mjs_cunsishenshen.zzKeys
									var mjsZZNames = lib.skill.mjs003_skill_mjs_cunsishenshen.zzNames
									var mjsSwapIdx = mjsZZKeys ? mjsZZKeys.indexOf(mjsSwap.key) : -1
									var mjsSwapName = mjsSwapIdx < 0 ? mjsSwap.key : mjsZZNames[mjsSwapIdx]
									var mjsSwapTo = mjsSwap.act == 'borrow' ? '出牌阶段' : '摸牌阶段'
									var mjsSwapVerb = mjsSwap.act == 'borrow' ? '改为' : '改回'
									game.log(player, '将【' + mjsSwapName + '】' + mjsSwapVerb + '【' + mjsSwapTo + '】')
									game.mjsWCLog(
										'　★ 借还（' +
											(mjsSwap.act == 'borrow' ? '借' : '还') +
											'）：' +
											mjsSwapName +
											' → ' +
											mjsSwapTo +
											' ｜ 放回后手牌 ' +
											event._mjsHandAfter +
											' ｜ 欠账=' +
											JSON.stringify(player.storage.cunsi_swapOut) +
											' ｜ 映射=' +
											JSON.stringify(player.storage.cunsi_phase_map)
									)
									game.mjsWCRecord(
										player,
										trigger.getParent('phase'),
										'手牌=放回后 ' +
											event._mjsHandAfter +
											'张 ｜ ' +
											(mjsSwap.act == 'borrow' ? '>15 借一个阶段' : '≤15 还一个阶段') +
											'：' +
											mjsSwapName +
											' → ' +
											mjsSwapTo +
											' ｜ 欠账=' +
											JSON.stringify(player.storage.cunsi_swapOut) +
											' ｜ 映射=' +
											JSON.stringify(player.storage.cunsi_phase_map)
									)
								}
							}
						}
					},
					mjs003_skill_mjs_shangqingzhenjing: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						zzKeys: ['phaseZhunbei', 'phaseJudge', 'phaseDraw', 'phaseUse', 'phaseDiscard', 'phaseJieshu'],
						zzNames: ['准备阶段', '判定阶段', '摸牌阶段', '出牌阶段', '弃牌阶段', '结束阶段'],
						audio: false,
						marktext: '上清',
						intro: {
							name: '额外阶段',
							markcount: function (storage, player) {
								var n = 0
								if (player.storage.mjs_extra_draw) n++
								if (player.storage.mjs_extra_use) n++
								return n
							},
							content: function (storage, player) {
								var list = []
								if (player.storage.mjs_extra_draw) list.push('额外摸牌阶段')
								if (player.storage.mjs_extra_use) list.push('额外出牌阶段')
								return list.length ? list.join('<br>') : '尚未获得额外阶段'
							}
						},
						init: function (player) {
							if (!player.storage.mjs_seq) player.storage.mjs_seq = []
						},
						onremove: true,
						group: ['mjs003_skill_mjs_shangqingzhenjing_change', 'mjs003_skill_mjs_shangqingzhenjing_marker', 'mjs003_skill_mjs_shangqingzhenjing_record'],
						subSkill: {
							change: {
								charlotte: true,
								forced: true,
								silent: true,
								popup: false,
								trigger: {
									player: [
										'phaseZhunbeiBefore',
										'phaseJudgeBefore',
										'phaseDrawBefore',
										'phaseUseBefore',
										'phaseDiscardBefore',
										'phaseJieshuBefore'
									]
								},
								content: function () {
									if (trigger._mjsRenamed) {
										game.mjsWCLog('[change] ' + trigger.name + ' 是改名后补打的 Before → 跳过，避免二次转化')
										return
									}
									var phaseEvt = trigger.getParent('phase')
									if (phaseEvt) {
										phaseEvt._mjsGainCount = 0
										phaseEvt._mjsUseCount = 0
										phaseEvt._mjsPutBack = 0
										phaseEvt._mjsFire = 0
									}
									var map = player.storage.cunsi_phase_map
									var to = map ? map[trigger.name] : null
									game.mjsWCLog(
										'[change] ' +
											trigger.name +
											' 开始 ｜ 阶段 ' +
											game.mjsWCPhase(phaseEvt) +
											' ｜ 映射表=' +
											JSON.stringify(map || {}) +
											' ｜ 本次替换=' +
											(to && to != trigger.name ? trigger.name + '→' + to : '不替换')
									)
									if (!map) return
									if (trigger._mjsExtra) {
										game.mjsWCLog('[change] 本阶段是上清真经奖励的额外阶段 → 不替换，保持原生阶段')
										return
									}
									if (to && to != trigger.name) {
										trigger._mjsChangedTo = to
										if (to == 'phaseDraw' && typeof trigger.num != 'number') {
											trigger.num = 2
											if (
												(get.config('first_less') || _status.connectMode || _status.first_less_forced) &&
												game.phaseNumber == 1
											)
												trigger.num--
										}
										trigger.setContent(to)
										if (!trigger._mjsOrigName) trigger._mjsOrigName = trigger.name
										var mjsFrom = trigger.name
										trigger.name = to
										trigger._mjsRenamed = true
										trigger.trigger(to + 'Before')
										game.mjsWCLog('[change] ★ 阶段事件改名 ' + mjsFrom + ' → ' + to + ' ｜ 已补打 ' + to + 'Before')
									}
								},
								sub: true,
								parentskill: 'mjs003_skill_mjs_shangqingzhenjing'
							},
							marker: {
								charlotte: true,
								forced: true,
								silent: true,
								popup: false,
								trigger: { player: ['gainAfter', 'useCardAfter', 'respondAfter'] },
								content: function () {
									var phaseEvt = trigger.getParent('phase')
									if (!phaseEvt) return
									if (trigger.name == 'gain') {
										phaseEvt._mjsGainCount = (phaseEvt._mjsGainCount || 0) + (trigger.cards ? trigger.cards.length : 0)
									} else {
										phaseEvt._mjsUseCount = (phaseEvt._mjsUseCount || 0) + 1
									}
									game.mjsWCLog(
										'[marker] ' +
											trigger.name +
											' ｜ 阶段 ' +
											game.mjsWCPhase(phaseEvt) +
											' ｜ 累计 获得=' +
											(phaseEvt._mjsGainCount || 0) +
											' 放回=' +
											(phaseEvt._mjsPutBack || 0) +
											' 使用/打出=' +
											phaseEvt._mjsUseCount
									)
								},
								sub: true,
								parentskill: 'mjs003_skill_mjs_shangqingzhenjing'
							},
							record: {
								charlotte: true,
								forced: true,
								silent: true,
								popup: false,
								trigger: {
									player: [
										'phaseZhunbeiAfter',
										'phaseJudgeAfter',
										'phaseDrawAfter',
										'phaseUseAfter',
										'phaseDiscardAfter',
										'phaseJieshuAfter'
									]
								},
								content: function () {
									var phaseEvt = trigger.getParent('phase')
									var gainCount = phaseEvt && phaseEvt._mjsGainCount ? phaseEvt._mjsGainCount : 0
									var putBack = phaseEvt && phaseEvt._mjsPutBack ? phaseEvt._mjsPutBack : 0
									var useCount = phaseEvt && phaseEvt._mjsUseCount ? phaseEvt._mjsUseCount : 0
									if (!player.storage.mjs_seq) player.storage.mjs_seq = []
									player.storage.mjs_seq.push({ gain: gainCount > 0, use: useCount > 0 })
									while (player.storage.mjs_seq.length > 5) player.storage.mjs_seq.shift()
									var seq = player.storage.mjs_seq
									game.mjsWCLog(
										'[record] ' +
											trigger.name +
											' 结束 ｜ 阶段 ' +
											game.mjsWCPhase(phaseEvt) +
											' ｜ 获得=' +
											gainCount +
											' 放回=' +
											putBack +
											' 使用/打出=' +
											useCount +
											' ｜ 序列=' +
											JSON.stringify(seq)
									)
									if (seq.length >= 5) {
										var noGain = true
										var noUse = true
										for (var i = 0; i < seq.length; i++) {
											if (seq[i].gain) noGain = false
											if (seq[i].use) noUse = false
										}
										if (noGain && !player.storage.mjs_extra_draw) {
											player.storage.mjs_extra_draw = true
											player.storage.mjs_seq = []
											player.popup('上清真经')
											game.log(player, '因', '#g【上清真经】', '永久获得1个摸牌阶段')
											game.mjsWCLog('　★ 达成：永久获得 1 个摸牌阶段（extra_draw = true）')
											player.markSkill('mjs003_skill_mjs_shangqingzhenjing')
										}
										if (noUse && !player.storage.mjs_extra_use) {
											player.storage.mjs_extra_use = true
											player.storage.mjs_seq = []
											player.popup('上清真经')
											game.log(player, '因', '#g【上清真经】', '永久获得1个出牌阶段')
											game.mjsWCLog('　★ 达成：永久获得 1 个出牌阶段（extra_use = true）')
											player.markSkill('mjs003_skill_mjs_shangqingzhenjing')
										}
									}
									if (trigger._mjsExtra) {
										game.mjsWCLog('　本阶段是「额外阶段」→ 不再追加，避免死循环')
										return
									}
									if (trigger._mjsOrigName && trigger._mjsOrigName != trigger.name) {
										game.mjsWCLog('[record] 本阶段原名 ' + trigger._mjsOrigName + '，已被改名成 ' + trigger.name)
									}
									var extraKey = null
									var mjsName = trigger._mjsOrigName || trigger.name
									if (mjsName == 'phaseDraw' && player.storage.mjs_extra_draw) extraKey = 'phaseDraw'
									else if (mjsName == 'phaseUse' && player.storage.mjs_extra_use) extraKey = 'phaseUse'
									if (!extraKey || !phaseEvt) return
									var next = player[extraKey]()
									next._mjsExtra = true
									event.next.remove(next)
									phaseEvt.next.unshift(next)
									game.mjsWCLog('　★ 追加额外阶段 ' + extraKey + ' ｜ 队列长度=' + phaseEvt.next.length)
								},
								sub: true,
								parentskill: 'mjs003_skill_mjs_shangqingzhenjing'
							}
						},
						ai: { threaten: 1.5 }
					},
					mjs003_skill_mjs_huangtinghuaxian: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						trigger: { player: 'die' },
						direct: true,
						forceDie: true,
						content: function () {
							'step 0'
							player
								.chooseBool('黄庭化仙：是否将魏华存的武将牌洗入牌堆？')
								.set('forceDie', true)
								.set('ai', function () {
									return true
								})
							'step 1'
							if (result.bool) {
								event.wjLogged = true
								player.logSkill('mjs003_skill_mjs_huangtinghuaxian')
								var wjCard = game.createCard2('mjs_wujiang_weihuacun', 'spade', 1)
								ui.cardPile.insertBefore(wjCard, ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length)])
								game.updateRoundNumber()
								game.log(player, '将武将牌·魏华存洗入了牌堆')
							}
							'step 2'
							if (
								!game.filterPlayer(function (current) {
									return current != player
								}).length
							) {
								event.finish()
								return
							}
							player
								.chooseTarget(
									'黄庭化仙：是否将一张【玉剑】置入一名其他角色的装备区？',
									function (card, player, target) {
										return target != player
									}
								)
								.set('forceDie', true)
								.set('ai', function (target) {
									return get.attitude(_status.event.player, target)
								})
							'step 3'
							if (result.bool && result.targets && result.targets.length) {
								var target = result.targets[0]
								if (!event.wjLogged) player.logSkill('mjs003_skill_mjs_huangtinghuaxian', target)
								else player.line(target, 'green')
								target.equip(game.createCard2('mjs003_card_mjs_yujian', 'spade', 2))
								game.log(player, '将【玉剑】置于了', target, '的装备区')
							}
						},
						ai: {
							expose: 0.5
						}
					},
					mjs003_skill_mjs_tianren: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						trigger: {
							global: 'changeHp'
						},
						filter: function (event, player) {
							var target = event.player
							if (target == player || !target.isAlive()) return false
							if (target.hp != 1) return false
							if (player.hp <= 1) return false
							var list = player.storage.mjs003_skill_mjs_tianren
							if (list && list.contains(target)) return false
							return true
						},
						check: function (event, player) {
							return get.attitude(player, event.player) > 0 ? 1 : 0
						},
						content: function () {
							'step 0'
							game.trySkillAudio('mjs003_skill_mjs_tianren', player, true)
							event.target = trigger.player
							if (!player.storage.mjs003_skill_mjs_tianren) player.storage.mjs003_skill_mjs_tianren = []
							player.storage.mjs003_skill_mjs_tianren.add(event.target)
							event.num = player.hp - 1
							player.loseHp(event.num)
							'step 1'
							if (event.target.isAlive()) event.target.recover(event.num)
						},
						oncancel: function (trigger, player) {
							if (!player.storage.mjs003_skill_mjs_tianren) player.storage.mjs003_skill_mjs_tianren = []
							player.storage.mjs003_skill_mjs_tianren.add(trigger.player)
						}
					},
					mjs003_skill_mjs_shimeng: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						group: ['mjs003_skill_mjs_shimeng_shan', 'mjs003_skill_mjs_shimeng_count'],
						subSkill: {
							shan: {
								audio: 'mjs003_skill_mjs_shimeng',
								enable: ['chooseToRespond', 'chooseToUse'],
								filterCard: true,
								position: 'hes',
								viewAs: {
									name: 'shan'
								},
								viewAsFilter: function (player) {
									return player.hp == 1 && player.countCards('hes') > 0
								},
								prompt: '誓盟拒守：将一张牌（手牌或装备区）当【闪】使用或打出',
								check: function () {
									return 1
								},
								ai: {
									respondShan: true,
									skillTagFilter: function (player) {
										return player.hp == 1
									},
									order: function () {
										return get.order({ name: 'shan' }) + 0.1
									},
									useful: -1,
									value: -1,
									basic: {
										useful: [7, 5.1, 2],
										value: [6, 5.1, 2]
									},
									result: {
										player: 1
									}
								},
								sub: true,
								parentskill: 'mjs003_skill_mjs_shimeng'
							},
							count: {
								audio: 'mjs003_skill_mjs_shimeng',
								trigger: {
									player: ['useCard1', 'respond']
								},
								forced: true,
								popup: false,
								filter: function (event, player) {
									return _status.currentPhase != player && player.hp > 0
								},
								content: () => {
									player.storage.mjs003_skill_mjs_shimeng =
										(player.storage.mjs003_skill_mjs_shimeng || 0) + (trigger.cards ? trigger.cards.length : 1)
									while (player.storage.mjs003_skill_mjs_shimeng >= 3 && player.hp < player.maxHp) {
										player.storage.mjs003_skill_mjs_shimeng -= 3
										player.logSkill('mjs003_skill_mjs_shimeng')
										player.recover()
									}
								},
								sub: true,
								parentskill: 'mjs003_skill_mjs_shimeng'
							}
						}
					},
					mjs003_skill_mjs_fengfaxingling: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						trigger: {
							global: ['gainAfter', 'loseAsyncAfter']
						},
						filter: function (event, player) {
							var target = _status.currentPhase
							if (!target || !target.isIn() || target == player) return false
							if (event.name == 'loseAsync' && event.type != 'gain') return false
							var pd = event.getParent('phaseDraw', true)
							if (pd && pd.player == target) return false
							var cards = event.getg && event.getg(target)
							if (!cards || !cards.length) return false
							return cards.some(function (card) {
								return get.type2(card) == 'trick'
							})
						},
						logTarget: function () {
							return _status.currentPhase
						},
						check: function (event, player) {
							var target = _status.currentPhase
							return !!target && get.attitude(player, target) <= 0
						},
						content: function () {
							'step 0'
							var target = _status.currentPhase
							if (!target || !target.isIn()) {
								event.finish()
								return
							}
							var cards = (trigger.getg ? trigger.getg(target) : []).filter(function (card) {
								return get.type2(card) == 'trick'
							})
							if (!cards.length) {
								event.finish()
								return
							}
							var card = cards.randomGet()
							var before = get.translation(card)
							card.init(['club', 1, 'mjs003_card_mjs_chi'])
							game.log(target, '获得的', before, '被转化为了', card)
						},
						group: ['mjs003_skill_mjs_fengfaxingling_discard']
					},
					mjs003_skill_mjs_fengfaxingling_discard: {
						audio: 'mjs003_skill_mjs_fengfaxingling',
						charlotte: true,
						trigger: {
							global: ['loseAfter', 'loseAsyncAfter']
						},
						forced: true,
						popup: false,
						filter: function (event, player) {
							return lib.skill.mjs003_skill_mjs_fengfaxingling_discard.candidates(event, player).length > 0
						},
						candidates: function (event, player) {
							if (event.type != 'discard' || event.getlx === false) return []
							if (typeof game.filterPlayer != 'function' || typeof event.getl != 'function') return []
							var list = game.filterPlayer(function (target) {
								if (target == player || !target.isIn()) return false
								var pd = event.getParent('phaseDiscard', true)
								if (pd && pd.player == target) return false
								var map = event.getl(target)
								if (!map || !map.cards2 || !map.cards2.length) return false
								return target.countCards('h', { name: 'mjs003_card_mjs_chi' }) > 0
							})
							return list.sortBySeat()
						},
						content: function () {
							'step 0'
							event._mjsList = lib.skill.mjs003_skill_mjs_fengfaxingling_discard.candidates(trigger, player)
							event._mjsIndex = 0
							'step 1'
							if (event._mjsIndex >= event._mjsList.length) {
								event.finish()
								return
							}
							var target = event._mjsList[event._mjsIndex]
							event._mjsIndex++
							event._mjsCur = target
							player
								.chooseBool('奉法行令：是否对' + get.translation(target) + '造成1点伤害？（其手牌中还有【笞】）')
								.set('ai', function () {
									return get.damageEffect(event._mjsCur, player, player) > 0
								})
							'step 2'
							if (result.bool && event._mjsCur.isIn()) {
								player.logSkill('mjs003_skill_mjs_fengfaxingling_discard', event._mjsCur)
								event._mjsCur.damage(player)
							}
							event.goto(1)
						}
					},
					mjs003_skill_mjsliangchaofengyi: {
						audio: 'ext:名将杀/assets/incremental:false',
						enable: 'phaseUse',
						usable: 2,
						group: ['mjs003_skill_mjsliangchaofengyi_enter', 'mjs003_skill_mjsliangchaofengyi_reset'],
						filter: function (event, player) {
							return lib.skill.mjs003_skill_mjsliangchaofengyi.borrowPool(player, game, get, lib).length > 0
						},
						content: function () {
							'step 0'
							var list = lib.skill.mjs003_skill_mjsliangchaofengyi.borrowPool(player, game, get, lib)
							if (!list.length) {
								event.finish()
								return
							}
							var owners = lib.skill.mjs003_skill_mjsliangchaofengyi.borrowOwners(player, game, get, lib)
							player
								.chooseControl(list, 'cancel2')
								.set(
									'choiceList',
									list.map(function (skill) {
										return (
											'<div class="skill">【' +
											get.translation(skill) +
											'】</div><div class="text center">' +
											get.translation(owners[skill]) +
											' 的技能</div><div>' +
											get.skillInfoTranslation(skill, owners[skill]) +
											'</div>'
										)
									})
								)
								.set('displayIndex', false)
								.set('prompt', '两朝凤仪：发动场上的 1 个「出牌阶段限 1 次」技能')
								.set('ai', function () {
									var controls = _status.event.controls.slice(0)
									controls.remove('cancel2')
									if (!controls.length) return 'cancel2'
									controls.sort(function (a, b) {
										var oa = get.order(a),
											ob = get.order(b)
										if (typeof oa != 'number') oa = -1
										if (typeof ob != 'number') ob = -1
										if (oa != ob) return ob - oa
										return get.skillRank(b, 'in') - get.skillRank(a, 'in')
									})
									return controls[0]
								})
							'step 1'
							if (!result || !result.control || result.control == 'cancel2') {
								event.finish()
								return
							}
							var skill = result.control
							player.storage.mjs003_skill_mjsliangchaofengyi_used = player.storage.mjs003_skill_mjsliangchaofengyi_used || []
							player.storage.mjs003_skill_mjsliangchaofengyi_used.add(skill)
							player.logSkill('mjs003_skill_mjsliangchaofengyi')
							game.log(player, '发动了场上的', '#g【' + get.translation(skill) + '】')
							var info = get.info(skill)
							var next = player.chooseToUse()
							next.set('prompt', '两朝凤仪：发动【' + get.translation(skill) + '】')
							next.backup(skill)
							if (info.filterCard && info.discard != false && info.lose != false && !info.viewAs) {
								var cards = player.getCards(next.position)
								for (var i = 0; i < cards.length; i++) {
									if (!lib.filter.cardDiscardable(cards[i], player)) cards[i].uncheck('useSkill')
								}
							}
							next.set(
								'ai1',
								info.filterCard
									? info.check || get.unuseful2
									: function () {
											return 1
										}
							)
						},
						borrowPool: function (player, game, get, lib, only) {
							var list = []
							var used = player.storage.mjs003_skill_mjsliangchaofengyi_used || []
							game.countPlayer(function (current) {
								if (current == player || (only && current != only)) return
								var skills = current.getSkills(true, true)
								game.expandSkills(skills)
								for (var i = 0; i < skills.length; i++) {
									var skill = skills[i]
									if (list.contains(skill) || used.contains(skill) || player.hasSkill(skill)) continue
									if (!lib.skill.mjs003_skill_mjsliangchaofengyi.isOncePerPhase(skill, current, get, lib)) continue
									list.push(skill)
								}
							})
							return list
						},
						borrowOwners: function (player, game, get, lib) {
							var map = {}
							game.countPlayer(function (current) {
								if (current == player) return
								var skills = current.getSkills(true, true)
								game.expandSkills(skills)
								for (var i = 0; i < skills.length; i++) {
									if (map[skills[i]] === undefined) map[skills[i]] = current
								}
							})
							return map
						},
						learnPool: function (target, lib, get) {
							var list = []
							for (var skill in lib.skill) {
								if (target && target.hasSkill(skill)) continue
								if (!lib.skill.mjs003_skill_mjsliangchaofengyi.isOncePerPhase(skill, target, get, lib)) continue
								list.push(skill)
							}
							return list
						},
						isOncePerPhase: function (skill, owner, get, lib) {
							var info = lib.skill[skill]
							if (!info) return false
							if (info.charlotte || info.sub || info.temp || info.unique) return false
							if (info.limited || info.juexingji || info.zhuSkill || info.fixed || info.viceSkill || info.equipSkill)
								return false
							var enable = info.enable
							var ok = false
							if (enable == 'phaseUse') ok = true
							else if (Array.isArray(enable) && enable.indexOf('phaseUse') >= 0) ok = true
							if (!ok) return false
							if (info.usable !== 1) return false
							if (!lib.translate[skill]) return false
							if (!get.skillInfoTranslation(skill, owner).length) return false
							return true
						},
						gift: function () {
							'step 0'
							var pool = lib.skill.mjs003_skill_mjsliangchaofengyi.learnPool(player, lib, get)
							var three = pool.randomGets(3)
							if (!three.length) {
								event.finish()
								return
							}
							player
								.chooseControl(three)
								.set(
									'choiceList',
									three.map(function (skill) {
										return (
											'<div class="skill">【' +
											get.translation(skill) +
											'】</div><div>' +
											get.skillInfoTranslation(skill, player) +
											'</div>'
										)
									})
								)
								.set('displayIndex', false)
								.set('prompt', '两朝凤仪：选择获得 1 个「出牌阶段限 1 次」的技能')
								.set('ai', function () {
									var controls = _status.event.controls.slice(0)
									controls.sort(function (a, b) {
										return get.skillRank(b, 'in') - get.skillRank(a, 'in')
									})
									return controls[0]
								})
							'step 1'
							if (!result || !result.control) {
								event.finish()
								return
							}
							player.addSkill(result.control)
							game.log(player, '获得了', '#g【' + get.translation(result.control) + '】')
							if (source && source != player) {
								game.log(source, '令', player, '获得了 1 个「出牌阶段限 1 次」的技能')
							}
						},
						ai: {
							order: function (item, player) {
								if (!player || !player.hasSkill('mjs003_skill_mjsliangchaofengyi')) return 0
								var pool = lib.skill.mjs003_skill_mjsliangchaofengyi.borrowPool(player, game, get, lib)
								if (!pool.length) return 0
								var best = 0
								for (var i = 0; i < pool.length; i++) {
									var o = get.order(pool[i])
									if (typeof o == 'number' && o > best) best = o
								}
								return Math.max(1, best)
							},
							result: {
								player: 1
							}
						}
					},
					mjs003_skill_mjsliangchaofengyi_enter: mjs_shizuEnterSkill('mjs003_skill_mjsliangchaofengyi_enter', {
						audio: 'ext:名将杀/assets/incremental:false',
						prompt: '两朝凤仪：是否选择一名其他角色，令其选择获得 1 个「出牌阶段限 1 次」的技能？',
						boolAI: function () {
							var player = _status.event.player
							return game.hasPlayer(function (current) {
								return current != player && current.isAlive() && get.attitude(player, current) > 0
							})
						},
						target: {
							prompt: '两朝凤仪：选择一名其他角色',
							filter: function (card, player, target) {
								return target != player
							},
							ai: function (target) {
								var player = _status.event.player
								var att = get.attitude(player, target)
								return att > 0 ? att + 1 : att
							}
						},
						effect: function (player, target) {
							var next = game.createEvent('mjs003_skill_mjsliangchaofengyi_gift')
							next.source = player
							next.player = target
							next.setContent(lib.skill.mjs003_skill_mjsliangchaofengyi.gift)
						}
					}),
					mjs003_skill_mjsliangchaofengyi_reset: {
						charlotte: true,
						trigger: {
							player: 'phaseBegin'
						},
						filter: function (event, player) {
							return !event.skill
						},
						silent: true,
						forced: true,
						popup: false,
						direct: true,
						content: function () {
							player.storage.mjs003_skill_mjsliangchaofengyi_used = []
						}
					},
					mjs003_skill_mjswufeiliuli: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						global: 'mjs003_skill_mjswufeiliuli_option',
						group: ['mjs003_skill_mjswufeiliuli_hpmax'],
						mark: true,
						marktext: '五废',
						intro: {
							name: '废立',
							markcount: function (storage, player) {
								return player.storage.mjs003_skill_mjswufeiliuli_count || 0
							},
							content: function (storage, player) {
								return (
									'手牌上限修正：' +
									(player.storage.mjs003_skill_mjswufeiliuli_delta || 0) +
									'<br>累计改变 ' +
									(player.storage.mjs003_skill_mjswufeiliuli_count || 0) +
									' 次（累计 6 次或手牌上限变为 0 ⇒ 技能修改为「两朝凤仪」并重新登场）'
								)
							}
						},
						mod: {
							maxHandcard: function (player, num) {
								return num + (player.storage.mjs003_skill_mjswufeiliuli_delta || 0)
							}
						},
						owner: function (game) {
							return game.findPlayer(function (current) {
								return current.hasSkill('mjs003_skill_mjswufeiliuli')
							})
						},
						change: function (player, delta, game, get, lib) {
							if (!player || !player.hasSkill('mjs003_skill_mjswufeiliuli')) return
							player.storage.mjs003_skill_mjswufeiliuli_delta = (player.storage.mjs003_skill_mjswufeiliuli_delta || 0) + delta
							player.storage.mjs003_skill_mjswufeiliuli_count = (player.storage.mjs003_skill_mjswufeiliuli_count || 0) + 1
							player.updateMark('mjs003_skill_mjswufeiliuli')
							player.update()
							if (player.getHandcardLimit() <= 0 || player.storage.mjs003_skill_mjswufeiliuli_count >= 6) {
								lib.skill.mjs003_skill_mjswufeiliuli.transform(player, game, get, lib)
							}
						},
						transform: function (player, game, get, lib) {
							var next = game.createEvent('mjs003_skill_mjswufeiliuli_transform')
							next.player = player
							next.setContent(lib.skill.mjs003_skill_mjswufeiliuli.transformContent)
						},
						transformContent: function () {
							'step 0'
							event.reason = player.getHandcardLimit() <= 0 ? '手牌上限变为 0' : '手牌上限累计改变 6 次'
							player.logSkill('mjs003_skill_mjswufeiliuli')
							game.log(player, '的' + event.reason + '，将武将技能修改为', '#g【两朝凤仪】', '，并重新登场')
							player.popup('两朝凤仪')
							'step 1'
							game.removeGlobalSkill('mjs003_skill_mjswufeiliuli_option')
							player.removeSkill('mjs003_skill_mjswufeiliuli')
							player.removeSkill('mjs003_skill_mjsfengluojinlao')
							delete player.storage.mjs003_skill_mjswufeiliuli_delta
							delete player.storage.mjs003_skill_mjswufeiliuli_count
							delete player.storage.mjs003_skill_mjsliangchaofengyi_used
							'step 2'
							player.discard(player.getCards('hej'))
							'step 3'
							player.link(false)
							'step 4'
							player.turnOver(false)
							'step 5'
							player.directgain(get.cards(4))
							player._start_cards = player.getCards('h')
							'step 6'
							var initialMaxHp = player.storage.mjs003_skill_mjswufeiliuli_maxHp
							if (typeof initialMaxHp != 'number') initialMaxHp = player.maxHp
							if (player.maxHp < initialMaxHp) {
								player.maxHp = initialMaxHp
								player.update()
							}
							if (player.hp < player.maxHp) player.recover(player.maxHp - player.hp)
							player.update()
							'step 7'
							player.addSkill('mjs003_skill_mjsliangchaofengyi')
							'step 8'
							player.phaseUse()
						},
						subSkill: {
							option: {
								audio: 'ext:名将杀/assets/incremental:false',
								name: '五废六立',
								description:
									'其他角色可在其出牌阶段使用此技能 2 次：令「五废六立」的拥有者手牌上限 +1，然后其可以令你摸 1 张牌；或令其手牌上限 -1。',
								enable: 'phaseUse',
								usable: 2,
								filter: function (event, player) {
									var owner = lib.skill.mjs003_skill_mjswufeiliuli.owner(game)
									return !!owner && owner != player
								},
								content: function () {
									'step 0'
									var owner = lib.skill.mjs003_skill_mjswufeiliuli.owner(game)
									if (!owner) {
										event.finish()
										return
									}
									event.owner = owner
									player
										.chooseControl('手牌上限+1', '手牌上限-1')
										.set('owner', owner)
										.set('prompt', '五废六立：选择' + get.translation(owner) + '的手牌上限变化')
										.set('ai', function () {
											var evt = _status.event
											return get.attitude(evt.player, evt.owner) > 0 ? '手牌上限+1' : '手牌上限-1'
										})
									'step 1'
									if (!result || !result.control) {
										event.finish()
										return
									}
									event.delta = result.control == '手牌上限+1' ? 1 : -1
									player.logSkill('mjs003_skill_mjswufeiliuli_option', event.owner)
									game.log(player, '令', event.owner, '的手牌上限', event.delta > 0 ? '#g+1' : '#y-1')
									lib.skill.mjs003_skill_mjswufeiliuli.change(event.owner, event.delta, game, get, lib)
									if (event.delta > 0) {
										event.owner
											.chooseBool('五废六立：是否令' + get.translation(player) + '摸 1 张牌？')
											.set('user', player)
											.set('ai', function () {
												var evt = _status.event
												return get.attitude(evt.player, evt.user) > 0
											})
									}
									'step 2'
									if (event.delta > 0 && result.bool) player.draw()
								},
								ai: {
									order: function (item, player) {
										var owner = lib.skill.mjs003_skill_mjswufeiliuli.owner(game)
										if (!owner || owner == player) return 0
										return get.attitude(player, owner) > 0 ? 9.6 : 7.5
									},
									result: {
										player: 1
									}
								}
							}
						}
					},
					mjs003_skill_mjsfengluojinlao: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						group: ['mjs003_skill_mjsfengluojinlao_turn', 'mjs003_skill_mjsfengluojinlao_absorb'],
						mod: {
							playerEnabled: function (card, player, target) {
								if (player != target) return false
							}
						}
					},
					mjs003_skill_mjswufeiliuli_hpmax: {
						charlotte: true,
						trigger: {
							global: 'gameStart'
						},
						silent: true,
						forced: true,
						popup: false,
						direct: true,
						content: function () {
							player.storage.mjs003_skill_mjswufeiliuli_maxHp = player.maxHp
						}
					},
					mjs003_skill_mjsfengluojinlao_turn: {
						charlotte: true,
						trigger: {
							global: 'phaseBegin'
						},
						filter: function (event, player) {
							return !event.skill
						},
						forced: true,
						silent: true,
						popup: false,
						direct: true,
						content: function () {
							player.damage(1, 'nosource')
						}
					},
					mjs003_skill_mjsfengluojinlao_absorb: {
						charlotte: true,
						trigger: {
							player: 'damageBegin4'
						},
						forced: true,
						silent: true,
						popup: false,
						direct: true,
						filter: function (event, player) {
							return player.getHandcardLimit() > 0
						},
						content: function () {
							trigger.cancel()
							game.log(player, '的【凤落金牢】吸收了伤害，手牌上限 -1')
							lib.skill.mjs003_skill_mjswufeiliuli.change(player, -1, game, get, lib)
						}
					},
					mjs003_skill_mjhongyan: {
						enable: 'phaseUse',
						usable: 1,
						filter: function (event, player) {
							if (!player.countCards('he')) return false
							return game.hasPlayer(function (current) {
								return current != player && current.countCards('he') > 0
							})
						},
						filterTarget: function (card, player, target) {
							return target != player && target.countCards('he') > 0
						},
						content: function () {
							'step 0'
							target.chooseCard('he', '交给' + get.translation(player) + '一张牌', true)
							'step 1'
							if (!result.bool) {
								event.finish()
								return
							}
							event.cardsFrom = result.cards.slice(0)
							player.gain(result.cards, target, 'giveAuto')
							'step 2'
							player.chooseCard('he', '交给' + get.translation(target) + '一张牌', true).ai = function (card) {
								var score = lib.skill.mjs003_skill_mjhongyan.cardScore(card, player, get)
								var given = event.cardsFrom && event.cardsFrom[0] ? get.number(event.cardsFrom[0], target) : 0
								if (get.number(card, false) > given) score += 6
								else score -= 6
								return score
							}
							'step 3'
							if (!result.bool) {
								event.finish()
								return
							}
							event.cardsBack = result.cards.slice(0)
							target.gain(result.cards, player, 'giveAuto')
							'step 4'
							var numBack = get.number(event.cardsBack[0], player)
							var numFrom = get.number(event.cardsFrom[0], target)
							if (numBack > numFrom) {
								player.storage.mjs003_skill_mjhongyan_from = (player.storage.mjs003_skill_mjhongyan_from || 0) + (numBack - numFrom)
							} else {
								player.storage.mjs003_skill_mjhongyan_other = (player.storage.mjs003_skill_mjhongyan_other || 0) + (numFrom - numBack)
							}
							lib.skill.mjs003_skill_mjhongyan.reward(player, lib, game, get)
						},
						reached: function (player, game, get) {
							return (
								game.countPlayer(function (current) {
									return current != player && get.distance(player, current) > 1
								}) == 0
							)
						},
						reward: function (player, lib, game, get) {
							if (!lib.skill.mjs003_skill_mjhongyan.reached(player, game, get)) return
							player.draw(game.countPlayer())
							player.removeSkill('mjs003_skill_mjhongyan')
						},
						group: ['mjs003_skill_mjhongyan_check'],
						check: function () {
							var player = _status.event.player
							return lib.skill.mjs003_skill_mjhongyan.worth(player, game, get) ? 1 : 0
						},
						cardScore: function (card, player, get) {
							var num = get.number(card, false) * 0.9 - get.value(card, player) * 1.6
							if (['tao', 'jiu', 'wuxie'].contains(card.name)) num -= 2.5
							if (get.subtype(card) == 'equip3') num -= 4
							return num
						},
						worth: function (player, game, get) {
							if (lib.skill.mjs003_skill_mjhongyan.reached(player, game, get)) return false
							var target = null
							game.countPlayer(function (current) {
								if (!target && current != player && current.countCards('he') && get.attitude(player, current) <= 0)
									target = current
							})
							if (!target) return false
							return (
								player.countCards('he', function (card) {
									return lib.skill.mjs003_skill_mjhongyan.cardScore(card, player, get) > 0
								}) > 0
							)
						},
						ai: {
							order: function (item, player) {
								return lib.skill.mjs003_skill_mjhongyan.worth(player, game, get) ? 15 : 0
							},
							result: {
								player: 1,
								target: function (player, target) {
									if (get.attitude(player, target) > 0) return -99
									var num = 0
									num += Math.min(3, target.countCards('h')) * 1.3
									if (target.countCards('e', { subtype: 'equip3' })) num += 1.8
									num += get.value(target.getCards('e'), player) * 0.4
									var canWin = player.countCards('he', function (card) {
										return lib.skill.mjs003_skill_mjhongyan.cardScore(card, player, get) > 0
									})
									num += canWin ? 1.5 : -2
									return -num
								}
							}
						}
					},
					mjs003_skill_mjhongyan_check: {
						charlotte: true,
						trigger: {
							player: 'phaseBegin'
						},
						silent: true,
						forced: true,
						popup: false,
						direct: true,
						filter: function (event, player) {
							return lib.skill.mjs003_skill_mjhongyan.reached(player, game, get)
						},
						content: function () {
							lib.skill.mjs003_skill_mjhongyan.reward(player, lib, game, get)
						}
					},
					mjs003_skill_mjsniexue: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						enable: 'phaseUse',
						usable: 1,
						filter: function (event, player) {
							return lib.skill.mjs003_skill_mjsniexue.dist(player, game, get) && player.countCards('he', { type: 'equip' }) > 0
						},
						position: 'he',
						selectCard: 1,
						filterCard: {
							type: 'equip'
						},
						discard: false,
						lose: false,
						content: function () {
							'step 0'
							cards[0]._destroy = true
							player.lose(cards, ui.discardPile)
							'step 1'
							game.log(cards[0], '被销毁了')
							player.draw(3)
						},
						dist: function (player, game, get) {
							return (
								game.countPlayer(function (current) {
									return current != player && get.distance(current, player) <= 1
								}) == 0
							)
						},
						group: ['mjs003_skill_mjsniexue_draw'],
						check: function (card) {
							var player = _status.event.player
							var num = 10
							var subtype = get.subtype(card)
							if (player.isDisabled(subtype)) num += 6
							if (subtype == 'equip3') num -= 12
							if (subtype == 'equip4') num += 3
							if (subtype == 'equip1') {
								var better = player.hasCard(function (c) {
									return c != card && get.subtype(c) == 'equip1' && get.value(c, player) > get.value(card, player)
								}, 'he')
								if (!better) {
									better = game.hasPlayer(function (current) {
										var weapon = current == player ? null : current.getEquip(1)
										return weapon && get.value(weapon, player) > get.value(card, player)
									})
								}
								if (better) num += 2
							}
							num -= get.value(card, player) * 1.2
							return num
						},
						ai: {
							order: 6,
							result: {
								player: 1
							}
						}
					},
					mjs003_skill_mjsniexue_draw: {
						charlotte: true,
						trigger: {
							player: 'phaseDrawBegin2'
						},
						forced: true,
						silent: true,
						popup: false,
						direct: true,
						filter: function (event, player) {
							return !event.numFixed && lib.skill.mjs003_skill_mjsniexue.dist(player, game, get)
						},
						content: function () {
							trigger.num--
						}
					},
					mjs003_skill_mjshanshi: mjs_shizuEnterSkill('mjs003_skill_mjshanshi', {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						silent: true,
						forced: true,
						content: function () {
							player.storage.mjs003_skill_mjshanshi = game.countPlayer()
						},
						mod: {
							globalFrom: function (from, to, distance) {
								if (from == to) return distance
								return distance + (from.storage.mjs003_skill_mjshanshi || 0) - (from.storage.mjs003_skill_mjhongyan_from || 0)
							},
							globalTo: function (from, to, distance) {
								if (from == to) return distance
								return distance + (to.storage.mjs003_skill_mjshanshi || 0) - (to.storage.mjs003_skill_mjhongyan_other || 0)
							}
						}
					}),
					mjs003_skill_mjs_distance_mark: {
						charlotte: true,
						marktext: '距',
						intro: {
							name: '距离',
							markcount: function (storage, player) {
								var me = game.me
								if (!me || me == player) return 0
								return get.distance(player, me) + '/' + get.distance(me, player)
							},
							content: function (storage, player) {
								var me = game.me
								if (!me || me == player) return ''
								return (
									get.translation(player) +
									'到你（' +
									get.translation(me) +
									'）的距离：' +
									get.distance(player, me) +
									'<br>' +
									'你到' +
									get.translation(player) +
									'的距离：' +
									get.distance(me, player) +
									'<br><span style="opacity:0.7">（每名角色身上的「距」标记同理；控制面板【距离】按钮开关）</span>'
								)
							}
						}
					},
					mjs003_skill_mjsrongjinduansuo: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						enable: 'phaseUse',
						usable: 1,
						line: 'fire',
						filter: function (event, player) {
							return game.hasPlayer(function (current) {
								return lib.skill.mjs003_skill_mjsrongjinduansuo.filterTarget(null, player, current)
							})
						},
						filterTarget: function (card, player, target) {
							return target != player
						},
						countXue: function (target) {
							return target.getCards('hej', function (card) {
								return get.suit(card) == 'diamond'
							}).length
						},
						content: function () {
							'step 0'
							event.xue = target.getCards('hej', function (card) {
								return get.suit(card) == 'diamond'
							})
							event.num = event.xue.length
							if (event.num > 0) {
								game.log(target, '区域内的', event.xue, '被销毁了')
								target.lose(event.xue, ui.special, 'visible')
							} else {
								game.log(target, '区域内没有♦️牌')
							}
							'step 1'
							if (event.num > 0) {
								player.addTempSkill('mjs003_skill_mjsrongjinduansuo_sha')
								player.addMark('mjs003_skill_mjsrongjinduansuo_sha', event.num, false)
							}
							game.log(player, '本回合使用【杀】的次数上限+' + get.cnNumber(event.num))
						},
						ai: {
							order: 6,
							result: {
								player: 1,
								target: function (player, target) {
									var num = lib.skill.mjs003_skill_mjsrongjinduansuo.countXue(target)
									var res = target.countCards('h') + target.countCards('e')
									return -(num * 2 + res)
								}
							}
						},
						subSkill: {
							sha: {
								charlotte: true,
								onremove: true,
								marktext: '索',
								intro: {
									name: '熔金断索',
									content: '本回合使用【杀】的次数上限+$'
								},
								mod: {
									cardUsable: function (card, player, num) {
										if (card.name == 'sha') return num + player.countMark('mjs003_skill_mjsrongjinduansuo_sha')
									}
								}
							}
						}
					},
					mjs003_skill_mjsanzhulouchuan: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						enable: 'phaseUse',
						init: function (player) {
							player.addSkill('mjs003_skill_mjsanzhulouchuan_round')
						},
						usable: function (player) {
							return 1 + (player.storage.mjs003_skill_mjsanzhulouchuan_count || 0)
						},
						filter: function (event, player) {
							if (get.skillCount('mjs003_skill_mjsanzhulouchuan', player) >= lib.skill.mjs003_skill_mjsanzhulouchuan.usable(player)) return false
							var cards = player.getCards('h')
							if (!cards.length) return false
							var suits = lib.skill.mjs003_skill_mjsanzhulouchuan.pileSuits()
							return cards.some(function (card) {
								return suits[get.suit(card)]
							})
						},
						pileSuits: function () {
							var suits = {}
							var pile = ui.cardPile.childNodes
							for (var i = 0; i < pile.length; i++) {
								if (get.type(pile[i]) == 'equip') suits[get.suit(pile[i])] = true
							}
							return suits
						},
						getEquip: function (card) {
							var suit = get.suit(card)
							return get.cardPile2(function (c) {
								return get.type(c) == 'equip' && get.suit(c) == suit
							})
						},
						content: function () {
							'step 0'
							player
								.chooseCard('h', true, '暗筑楼船：选择一张手牌，将其转化为同花色的装备牌', function (card) {
									return !!lib.skill.mjs003_skill_mjsanzhulouchuan.getEquip(card)
								})
								.set('ai', function (card) {
									return 4 - get.value(card)
								})
							'step 1'
							var card = result.cards[0]
							if (!card) {
								event.finish()
								return
							}
							event.card = card
							event.suit = get.suit(card)
							var equip = lib.skill.mjs003_skill_mjsanzhulouchuan.getEquip(card)
							if (!equip) {
								event.finish()
								return
							}
							event.equipName = equip.name
							game.broadcastAll(
								function (card, suit, number, name) {
									card.init([suit, number, name])
								},
								card,
								event.suit,
								get.number(card, false),
								event.equipName
							)
							game.log(player, '将', card, '转化为', get.translation(event.equipName))
							'step 2'
							var gain = get.cardPile2(function (c) {
								return get.suit(c) == event.suit
							})
							if (gain) player.gain(gain, 'gain2')
						},
						ai: {
							order: 6,
							result: {
								player: 1
							}
						},
						group: ['mjs003_skill_mjsanzhulouchuan_round'],
						subSkill: {
							round: {
								audio: 'ext:名将杀/assets/incremental:false',
								trigger: {
									global: 'roundFinish'
								},
								forced: true,
								popup: false,
								filter: function (event, player) {
									return game.hasPlayer(function (current) {
										return current.countCards('e') > player.countCards('e')
									})
								},
								content: function () {
									player.storage.mjs003_skill_mjsanzhulouchuan_count = (player.storage.mjs003_skill_mjsanzhulouchuan_count || 0) + 1
									player.markSkill('mjs003_skill_mjsanzhulouchuan')
									game.log(
										player,
										'〖暗筑楼船〗发动次数上限永久+1，当前上限',
										'#y' + get.cnNumber(1 + player.storage.mjs003_skill_mjsanzhulouchuan_count) + '次'
									)
								}
							}
						}
					},
					mjs003_skill_mjsxianmei: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						trigger: {
							player: 'phaseUseEnd'
						},
						forced: true,
						mark: true,
						marktext: '枚',
						intro: {
							name: '衔枚',
							markcount: function (storage, player) {
								return player.storage.mjs003_skill_mjsxianmei || 0
							},
							content: function (storage, player) {
								var num = player.storage.mjs003_skill_mjsxianmei || 0
								if (!num) return '本局还没有衔枚过'
								return '之后每个出牌阶段出杀次数 +' + num
							}
						},
						filter: function (event, player) {
							var used = player.getHistory('useCard', function (evt) {
								return evt.card && evt.getParent('phaseUse') == event && get.name(evt.card, player) == 'sha'
							})
							if (used.length) return false
							var responded = player.getHistory('respond', function (evt) {
								return evt.card && evt.getParent('phaseUse') == event && get.name(evt.card, player) == 'sha'
							})
							return responded.length == 0
						},
						content: function () {
							'step 0'
							game.trySkillAudio('mjs003_skill_mjsxianmei', player, true)
							player.skip('phaseDiscard')
							if (!player.storage.mjs003_skill_mjsxianmei) player.storage.mjs003_skill_mjsxianmei = 0
							player.storage.mjs003_skill_mjsxianmei++
							player.markSkill('mjs003_skill_mjsxianmei')
							if (!player.hasSkill('mjs003_skill_mjsxianmei_mod')) player.addSkill('mjs003_skill_mjsxianmei_mod')
							game.log(player, '衔枚：出杀次数 +1（累计 +' + player.storage.mjs003_skill_mjsxianmei + '）')
						},
						mod: {
							aiOrder: function (player, card, num) {
								if (num <= 0) return
								if ((player.storage.mjs003_skill_mjsxianmei || 0) >= 2) return
								if (get.itemtype(card) != 'card' || get.name(card, player) != 'sha') return
								var used = player.getHistory('useCard', function (evt) {
									return evt.card && get.name(evt.card, player) == 'sha'
								}).length
								var responded = player.getHistory('respond', function (evt) {
									return evt.card && get.name(evt.card, player) == 'sha'
								}).length
								if (used + responded) return
								var kill = game.hasPlayer(function (current) {
									return (
										current != player &&
										current.hp <= 1 &&
										player.canUse(card, current, null, true) &&
										get.damageEffect(current, player, player, get.nature(card)) > 0
									)
								})
								if (kill) return
								return 0
							}
						}
					},
					mjs003_skill_mjsxianmei_mod: {
						charlotte: true,
						silent: true,
						popup: false,
						forced: true,
						mod: {
							cardUsable: function (card, player, num) {
								if (card.name == 'sha') return num + (player.storage.mjs003_skill_mjsxianmei || 0)
							}
						}
					},
					mjs003_skill_mjsshetushoubing: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						enable: 'phaseUse',
						group: ['mjs003_skill_mjsshetushoubing_clear'],
						subSkill: {
							clear: {
								trigger: { global: 'phaseAfter' },
								forced: true,
								silent: true,
								charlotte: true,
								priority: -100,
								content: function () {
									delete player.storage.mjs003_skill_mjsshetushoubing_used
								},
								sub: true
							}
						},
						filter: function (event, player) {
							var card = { name: 'sha' }
							var num = get.info(card).usable
							if (typeof num == 'function') num = num(card, player)
							var skills = player.getSkills().concat(lib.skill.global)
							game.expandSkills(skills)
							skills = skills.filter(function (skill) {
								var info = get.info(skill)
								return info && info.mod && info.mod.cardUsable
							})
							skills.forEach(function (skill) {
								if (skill == 'zhuge_skill') return
								var result = get.info(skill).mod.cardUsable.call(player, card, player, num)
								if (result != undefined) num = result
							})
							if (typeof num != 'number') num = 1
							var used = player.storage.mjs003_skill_mjsshetushoubing_used || 0
							return used < num
						},
						content: function () {
							'step 0'
							player.storage.mjs003_skill_mjsshetushoubing_used = (player.storage.mjs003_skill_mjsshetushoubing_used || 0) + 1
							var cards = []
							var nodes = ui.discardPile.childNodes
							for (var i = 0; i < nodes.length; i++) {
								if (get.name(nodes[i], player) == 'sha') cards.push(nodes[i])
							}
							for (var i = 0; i < cards.length; i++) {
								ui.cardPile.insertBefore(cards[i], ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length)])
								cards[i].fix()
							}
							if (cards.length) game.log(player, '将', cards, '洗回牌堆')
							else game.log(player, '弃牌堆里没有【杀】')
							event.count = 0
							'step 1'
							player.draw('visible')
							'step 2'
							event.count++
							var drawn = result
							if (event.count < 50 && drawn && drawn.length && get.name(drawn[0], player) == 'sha') event.goto(1)
						},
						ai: {
							order: function (item, player) {
								var num = 0
								var nodes = ui.discardPile.childNodes
								for (var i = 0; i < nodes.length; i++) {
									if (get.name(nodes[i], player) == 'sha') num++
								}
								if ((player.storage.mjs003_skill_mjsxianmei || 0) < 2 || !player.countCards('h', { name: 'sha' })) return 9
								return num >= 2 ? 9 : 2.5
							},
							result: {
								player: 1
							}
						}
					},

					mjs003_skill_mjshuopo: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						enable: 'phaseUse',
						usable: 1,
						filter: function (event, player) {
							return (
								player.countCards('he') > 0 &&
								game.hasPlayer(function (current) {
									return current != player
								})
							)
						},
						content: function () {
							'step 0'
							player.chooseCardTarget({
								position: 'he',
								filterCard: true,
								selectCard: 1,
								filterTarget: lib.filter.notMe,
								selectTarget: 1,
								ai1: function (card) {
									var suit = get.suit(card, false)
									var gain = 0
									game.filterPlayer(function (current) {
										if (current == player) return
										var list = current.getCards('ej')
										for (var i = 0; i < list.length; i++) {
											if (get.suit(list[i], false) == suit) gain++
										}
									})
									return (1 + gain * 3) / Math.max(0.1, get.value(card))
								},
								ai2: function (target) {
									var player = _status.event.player
									if (get.attitude(player, target) >= 0) return 0
									var card = ui.selected.cards && ui.selected.cards[0]
									var suit = card ? get.suit(card, false) : null
									var hit = 0
									var list = target.getCards('ej')
									for (var i = 0; i < list.length; i++) {
										if (suit && get.suit(list[i], false) == suit) hit++
									}
									return hit * 2 + target.countCards('h') * 0.5 + 1
								},
								prompt: '火破连营：交给一名其他角色一张牌',
								prompt2: lib.translate.mjs003_skill_mjshuopo_info
							})
							'step 1'
							if (!result.bool) {
								event.finish()
								return
							}
							event.target = result.targets[0]
							event.card = result.cards[0]
							player.give(event.card, event.target)
							'step 2'
							var suit = get.suit(event.card, false)
							event.destroyList = event.target.getCards('hej').filter(function (c) {
								return get.suit(c, false) == suit
							})
							for (var i = 0; i < event.destroyList.length; i++) {
								event.destroyList[i]._destroy = true
								game.log(event.destroyList[i], '被销毁了')
							}
							if (event.destroyList.length) event.target.lose(event.destroyList)
							'step 3'
							if (event.destroyList.length >= 3) event.target.damage(1, 'fire', player)
						},
						ai: {
							result: {
								player: 1
							},
							order: function (item, player) {
								var hasEquip = false
								var maxHand = 0
								for (var i = 0; i < game.players.length; i++) {
									var current = game.players[i]
									if (current == player) continue
									if (get.attitude(player, current) >= 0) continue
									if (current.isOut && current.isOut()) continue
									var vis = current.countCards('ej')
									if (vis > 0) hasEquip = true
									var hand = current.countCards('h')
									if (hand > maxHand) maxHand = hand
								}
								if (hasEquip) return 6
								if (maxHand >= 3) return 4
								return 0
							}
						}
					},
					mjs003_skill_mjsjieyi: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						trigger: {
							player: ['useCard', 'respond']
						},
						forced: true,
						filter: function (event, player) {
							if (!event.card) return false
							if (
								!player.hasHistory('lose', function (evt) {
									return evt.hs && evt.hs.length > 0 && evt.getParent() == event
								})
							)
								return false
							var num = player.countCards('h')
							return game.players.every(function (current) {
								return current == player || current.countCards('h') >= num
							})
						},
						content: function () {
							game.trySkillAudio('mjs003_skill_mjsjieyi', player, true)
							player.draw(1)
						}
					},
					mjs003_skill_mjsfengshenxiuyi: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						mod: {
							maxHandcard: (player, num) => {
								var extra = player.storage.mjs003_skill_mjsfengshenxiuyi_extra
								if (typeof extra != 'number') extra = 0
								return 6 + extra
							}
						},
						group: ['mjs003_skill_mjsfengshenxiuyi_hurt', 'mjs003_skill_mjsfengshenxiuyi_draw', 'mjs003_skill_mjsfengshenxiuyi_clear'],
						subSkill: {
							hurt: {
								trigger: { player: 'damageBegin' },
								usable: 1,
								forced: true,
								filter: function (event, player) {
									return event.num > 0 && player.getHandcardLimit() > player.hp
								},
								content: function () {
									game.trySkillAudio('mjs003_skill_mjsfengshenxiuyi', player, true)
									trigger.cancel()
									player.storage.mjs003_skill_mjsfengshenxiuyi_extra = (player.storage.mjs003_skill_mjsfengshenxiuyi_extra || 0) - trigger.num
									game.log(player, '将受到的', get.cnNumber(trigger.num), '点伤害改为减少等量手牌上限')
								},
								ai: {
									filterDamage: true,
									skillTagFilter: function (player) {
										return !player.storage.counttrigger || !player.storage.counttrigger.mjs003_skill_mjsfengshenxiuyi_hurt
									}
								},
								sub: true
							},
							draw: {
								trigger: { player: ['useCard', 'respond'] },
								forced: true,
								filter: function (event, player) {
									if (!event.card) return false
									var types = player.storage.mjs003_skill_mjsfengshenxiuyi_type
									if (types && types[get.type(event.card)]) return false
									var goon = true
									game.filterPlayer().forEach(function (current) {
										if (current == player) return
										current.getCards('h').forEach(function (card) {
											if (get.name(card) == get.name(event.card)) goon = false
										})
									})
									return goon
								},
								content: function () {
									'step 0'
									var type = get.type(trigger.card)
									var types = player.storage.mjs003_skill_mjsfengshenxiuyi_type
									if (!types) types = player.storage.mjs003_skill_mjsfengshenxiuyi_type = {}
									types[type] = (types[type] || 0) + 1
									var names = []
									game.filterPlayer().forEach(function (current) {
										if (current == player) return
										current.getCards('h').forEach(function (card) {
											names.add(get.name(card))
										})
									})
									event.names = names
									player.storage.mjs003_skill_mjsfengshenxiuyi_extra = (player.storage.mjs003_skill_mjsfengshenxiuyi_extra || 0) + 1
									game.log(player, '的手牌上限+1')
									'step 1'
									var cards = []
									for (var i = 0; i < ui.cardPile.childNodes.length; i++) {
										var card = ui.cardPile.childNodes[i]
										if (event.names.contains(get.name(card))) cards.push(card)
									}
									if (cards.length) {
										var card = cards.randomGet()
										player.gain(card, 'gain2')
										game.log(player, '获得了牌堆中的', card)
									}
								},
								sub: true
							},
							clear: {
								trigger: { global: 'phaseEnd' },
								forced: true,
								charlotte: true,
								filter: function (event, player) {
									return player.storage.mjs003_skill_mjsfengshenxiuyi_type
								},
								content: function () {
									delete player.storage.mjs003_skill_mjsfengshenxiuyi_type
								},
								sub: true
							}
						}
					},
					mjs003_skill_mjssimengchengji: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						enable: 'phaseUse',
						filter: function (event, player) {
							return !player.hasSkill('mjs003_skill_mjssimengchengji_used')
						},
						content: function () {
							'step 0'
							var names = []
							game.filterPlayer().forEach(function (current) {
								if (current == player) return
								current.getCards('h').forEach(function (card) {
									names.add(get.name(card))
								})
							})
							var cards = []
							for (var i = 0; i < ui.cardPile.childNodes.length; i++) {
								var card = ui.cardPile.childNodes[i]
								if (!names.contains(get.name(card))) cards.push(card)
							}
							if (cards.length) {
								var card = cards.randomGet()
								player.gain(card, 'gain2')
							} else {
								player.addTempSkill('mjs003_skill_mjssimengchengji_used')
								event.finish()
							}
							'step 1'
							player.loseHp(1)
						},
						ai: {
							order: 9.5,
							result: {
								player: function (player) {
									if (player.hp <= 1) return 0
									return 1
								}
							}
						},
						subSkill: {
							used: {
								charlotte: true,
								sub: true
							}
						}
					},
					mjs003_skill_mjszhuyuzace: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						trigger: { player: ['useCard', 'respond'] },
						direct: true,
						priority: 1,
						filter: function (event, player) {
							if (!event.card) return false
							var name = get.name(event.card)
							if (!name) return false
							var dmin = Infinity
							game.players.forEach(function (c) {
								if (c == player) return
								var d = get.distance(player, c)
								if (d < dmin) dmin = d
							})
							if (dmin == Infinity) return false
							return game.hasPlayer(function (c) {
								return c != player && get.distance(player, c) == dmin
							})
						},
						content: function () {
							'step 0'
							event.cardName = get.name(trigger.card)
							event.dmin = Infinity
							game.players.forEach(function (c) {
								if (c == player) return
								var d = get.distance(player, c)
								if (d < event.dmin) event.dmin = d
							})
							player.chooseTarget(
								'珠玉在侧：削弱一名与你距离最近的其他角色（其手牌中与此牌同名的牌将被削弱）',
								function (card, player, target) {
									return target != player && get.distance(player, target) == event.dmin
								},
								function (target) {
									return -get.attitude(player, target)
								}
							)
							'step 1'
							if (result.bool && result.targets && result.targets.length) {
								var t = result.targets[0]
								player.logSkill('mjs003_skill_mjszhuyuzace', t)
								var cards = t.getCards('h', function (x) {
									return get.name(x) == event.cardName
								})
								if (cards.length) {
									lib.mjXueAddTag(cards)
									game.log(player, '削弱了', t, '手牌中的', cards.length, '张同名牌')
								}
							}
						}
					},
					mjs003_skill_mjscaiju: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						mod: {
							ignoredHandcard: function (card, player) {
								return get.name(card) == 'mjs003_card_mjs_ju'
							},
							cardDiscardable: function (card, player, name) {
								if (name == 'phaseDiscard' && get.name(card) == 'mjs003_card_mjs_ju') return false
							}
						},
						trigger: {
							global: 'damageSource'
						},
						filter: function (event, player) {
							return Boolean(event.source)
						},
						direct: true,
						content: function () {
							'step 0'
							event.mjsOptAdd = '添加【菊】到牌堆底'
							event.mjsOptGet = '获得一张【菊】'
							event.mjsHasJue = false
							var nodes = ui.cardPile.childNodes
							for (var i = 0; i < nodes.length; i++) {
								if (nodes[i] && nodes[i].name == 'mjs003_card_mjs_ju') {
									event.mjsHasJue = true
									break
								}
							}
							var choices = [event.mjsOptAdd, event.mjsOptGet]
							choices.push('cancel2')
							player
								.chooseControl(choices)
								.set('prompt', get.prompt('mjs003_skill_mjscaiju'))
								.set('prompt2', lib.translate.mjs003_skill_mjscaiju_info)
								.set('ai', function () {
									if (player.storage.mjs003_skill_mjsguiqv) return event.mjsHasJue ? event.mjsOptGet : event.mjsOptAdd
									return event.mjsOptAdd
								})
							'step 1'
							if (!result.control || result.control == 'cancel2') {
								event.finish()
								return
							}
							player.logSkill('mjs003_skill_mjscaiju')
							if (result.control == event.mjsOptGet) {
								var card = get.cardPile2(function (c) {
									return c.name == 'mjs003_card_mjs_ju'
								})
								if (!card) {
									game.log('牌堆里没有【菊】，无法获得')
									event.finish()
									return
								}
								player.gain(card, 'gain2')
								game.log(player, '从牌堆获得了', card)
								game.updateRoundNumber()
							} else {
								var card2 = game.createCard2('mjs003_card_mjs_ju', 'club', 1)
								ui.cardPile.appendChild(card2)
								game.updateRoundNumber()
								game.log(player, '将', card2, '加入了牌堆底')
							}
						}
					},
					mjs003_skill_mjsguiqv: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						enable: 'phaseUse',
						limited: true,
						content: function () {
							'step 0'
							player.awakenSkill('mjs003_skill_mjsguiqv')
							player.addSkill('mjs003_skill_mjsguiqv_dist')
							var cs = player.getCards('h')
							if (cs.length) player.discard(cs)
							'step 1'
							var all = []
							var pushJue = function (nodes) {
								for (var k = 0; k < nodes.length; k++) {
									if (nodes[k] && nodes[k].name == 'mjs003_card_mjs_ju') all.push(nodes[k])
								}
							}
							pushJue(ui.cardPile.childNodes)
							pushJue(ui.discardPile.childNodes)
							var ps = game.players.slice(0).concat(game.dead)
							for (var j = 0; j < ps.length; j++) pushJue(ps[j].getCards('hejx'))
							if (all.length) {
								player.gain(all, 'gain2')
								game.log(player, '从任意位置获得了', all.length, '张【菊】')
								game.updateRoundNumber()
							}
						},
						subSkill: {
							dist: {
								charlotte: true,
								silent: true,
								popup: false,
								forced: true,
								description: '其他角色与你的距离永久+1',
								mod: {
									globalTo: function (source, player, distance) {
										return distance + 1
									}
								},
								sub: true,
								parentskill: 'mjs003_skill_mjsguiqv'
							}
						},
						ai: {
							result: {
								player: 1
							},
							order: function (item, player) {
								var n = 0
								var count = function (nodes) {
									for (var i = 0; i < nodes.length; i++) {
										if (nodes[i] && nodes[i].name == 'mjs003_card_mjs_ju') n++
									}
								}
								count(ui.cardPile.childNodes)
								count(ui.discardPile.childNodes)
								var ps = game.players.slice(0).concat(game.dead)
								for (var j = 0; j < ps.length; j++) count(ps[j].getCards('hejx'))
								return n >= 8 ? 9 : 0
							}
						},
						mark: true,
						marktext: '归去',
						intro: {
							content: 'limited'
						},
						skillAnimation: true,
						init: function (player, skill) {
							player.storage[skill] = false
						}
					},
					mjs003_skill_mjstaohuayuan: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						marktext: '桃花',
						enable: 'phaseUse',
						limited: true,
						content: function () {
							'step 0'
							player.awakenSkill('mjs003_skill_mjstaohuayuan')
							player.addSkill('mjs003_skill_mjstaohuayuan_back')
							player.addSkill('mjs003_skill_mjstaohuayuan_draw')
							game.mjsSetTempBackground('ext:名将杀/assets/incremental/image/background/taohuayuanbg.png')
							player.storage.mjs_tym_seen = 0
							player.out('mjs003_skill_mjstaohuayuan')
						},
						subSkill: {
							back: {
								charlotte: true,
								silent: true,
								popup: false,
								forced: true,
								forceOut: true,
								trigger: {
									global: 'roundStart'
								},
								filter: function (event, player) {
									if (!player.isOut() || !player.outSkills || !player.outSkills.contains('mjs003_skill_mjstaohuayuan')) return false
									return ((player.storage && player.storage.mjs_tym_seen) || 0) >= 1
								},
								content: function () {
									player.in('mjs003_skill_mjstaohuayuan')
									player.removeSkill('mjs003_skill_mjstaohuayuan_back')
									player.removeSkill('mjs003_skill_mjstaohuayuan_draw')
									game.mjsClearTempBackground()
								},
								name: '桃花源',
								description: '本轮结束时，从桃花源返回。',
								sub: true,
								parentskill: 'mjs003_skill_mjstaohuayuan'
							},
							draw: {
								charlotte: true,
								silent: true,
								popup: false,
								forced: true,
								forceOut: true,
								trigger: { global: 'phaseAfter' },
								filter: function (event, player) {
									return (
										event.player != player &&
										player.isOut() &&
										player.outSkills &&
										player.outSkills.contains('mjs003_skill_mjstaohuayuan')
									)
								},
								content: function () {
									var cards = player.getTopCards ? player.getTopCards(1) : get.cards(1)
									game.log(player, '摸了' + get.cnNumber(1) + '张牌')
									player.gain(cards, 'draw').includeOut = true
									player.storage.mjs_tym_seen = (player.storage.mjs_tym_seen || 0) + 1
								},
								sub: true,
								parentskill: 'mjs003_skill_mjstaohuayuan',
								name: '桃花源',
								description: '在“桃花源”期间，其他角色回合结束时，你摸一张牌。'
							}
						},
						ai: {
							result: {
								player: 1
							},
							order: function (item, player) {
								var real = player.countCards('h') - player.countCards('h', { name: 'mjs003_card_mjs_ju' })
								if (!player.storage.mjs003_skill_mjsguiqv && player.hp > 1 && real > 1) return 0
								return player.storage.mjs003_skill_mjsguiqv ? 10 : 8
							}
						}
					},
					mjs003_skill_mjsxieshi: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						trigger: { global: 'roundFinish' },
						forced: true,
						init: function (player, skill) {
							player.storage.mjs003_skill_mjs_shizu = true
						},
						filter: function (event, player) {
							if (!lib.mjsShizuGet || !lib.mjsShizuDiscardGet || !lib.mjsShizuIsClan) return false
							if (!lib.mjsShizuIsClan(player)) return false
							if (!player.isAlive()) return false
							return lib.mjsShizuGet().length > 0 || lib.mjsShizuDiscardGet().length > 0
						},
						content: function () {
							'step 0'
							game.trySkillAudio('mjs003_skill_mjsxieshi', player, true)
							var got = lib.mjsShizuTakeEachType(player)
							if (!got.length) return
							player.gain(got, 'draw')
							game.log(player, '从士族牌堆获得了', get.cnNumber(got.length) + '张士族牌')
						}
					},
					mjs003_skill_mjsshanshui: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						trigger: { player: 'useCard' },
						forced: true,
						silent: true,
						mod: {
							aiOrder: function (player, card, num) {
								if (lib.mjsAiDiag) lib.mjsAiDiag('modCalls')
								var mjsPlayable = function (x, p) {
									try {
										if (!lib.filter.cardEnabled(x, p)) return false
										if (!lib.filter.cardUsable(x, p)) return false
										var info = get.info(x)
										if (info && info.notarget) return true
										if (typeof p.hasUseTarget != 'function') return true
										return p.hasUseTarget(x)
									} catch (e) {
										return false
									}
								}
								var mjsPlayableOf = function (x, p) {
									var _t0 = lib.mjsAiT ? lib.mjsAiT() : Date.now()
									var key = lib.mjsAiSitKey ? lib.mjsAiSitKey(p, true) : 'ev:' + _status.event
									var cache = _status.mjsShanshuiPlay
									if (!cache || cache.k !== key) {
										cache = { k: key, cards: [], vals: [] }
										_status.mjsShanshuiPlay = cache
									}
									var i = -1
									for (var j = 0; j < cache.cards.length; j++)
										if (cache.cards[j] === x && cache.vals[j].p === p) {
											i = j
											break
										}
									if (lib.mjsAiDiag) lib.mjsAiDiag('playHit', (lib.mjsAiT ? lib.mjsAiT() : Date.now()) - _t0)
									if (i >= 0) return cache.vals[i].v
									var v = mjsPlayable(x, p)
									cache.cards.push(x)
									cache.vals.push({ p: p, v: v })
									if (lib.mjsAiDiag) lib.mjsAiDiag('playMiss', (lib.mjsAiT ? lib.mjsAiT() : Date.now()) - _t0)
									return v
								}

								var mjsPlan = function (p, need) {
									var _t0 = lib.mjsAiT ? lib.mjsAiT() : Date.now()
									var hs = p.getCards('h')
									var key = lib.mjsAiSitKey ? lib.mjsAiSitKey(p) : 'ev:' + _status.event
									var hit = _status.mjsShanshuiPlan
									if (hit && hit.k === key && hit.need === need && hit.p === p && hit.hs.length === hs.length) {
										var same = true
										for (var i = 0; i < hs.length; i++)
											if (hit.hs[i] !== hs[i]) {
												same = false
												break
											}
										if (lib.mjsAiDiag) lib.mjsAiDiag('planCache', (lib.mjsAiT ? lib.mjsAiT() : Date.now()) - _t0)
										if (same) return hit.sol
									}
									var pre = [true]
									for (var i = 0; i < hs.length; i++) {
										var v0 = get.number(hs[i])
										if (typeof v0 != 'number' || v0 < 1 || v0 > 13) continue
										for (var s = need; s >= v0; s--) if (pre[s - v0]) pre[s] = true
									}
									if (!pre[need]) {
										_status.mjsShanshuiPlan = { k: key, need: need, p: p, hs: hs.slice(0), sol: [] }
										if (lib.mjsAiDiag) lib.mjsAiDiag('planNoNum', (lib.mjsAiT ? lib.mjsAiT() : Date.now()) - _t0)
										return []
									}
									var items = []
									for (var i = 0; i < hs.length; i++) {
										var v = get.number(hs[i])
										if (typeof v != 'number' || v < 1 || v > 13) continue
										if (!mjsPlayableOf(hs[i], p)) continue
										items.push({ card: hs[i], n: v, ng: !hs[i].mjsShanshuiPrize })
									}
									var reach = function (skip) {
										var any = [],
											mixed = []
										any[0] = true
										for (var i = 0; i < items.length; i++) {
											var it = items[i]
											if (skip && it.card === skip) continue
											for (var s = need; s >= it.n; s--) {
												if (!any[s - it.n]) continue
												any[s] = true
												if (it.ng || mixed[s - it.n]) mixed[s] = true
											}
										}
										return { any: any, mixed: mixed }
									}
									var sol = []
									var full = reach(null)
									if (full.any[need] && full.mixed[need]) {
										for (var i = 0; i < items.length; i++) {
											var it = items[i]
											var t = need - it.n
											if (t < 0) continue
											var r = reach(it.card)
											if (!r.any[t]) continue
											if (!(it.ng || r.mixed[t])) continue
											sol.push(it.card)
										}
									}
									_status.mjsShanshuiPlan = { k: key, need: need, p: p, hs: hs.slice(0), sol: sol }
									if (lib.mjsAiDiag) lib.mjsAiDiag('planFull', (lib.mjsAiT ? lib.mjsAiT() : Date.now()) - _t0)
									return sol
								}
								var n = get.number(card)
								if (typeof n != 'number') {
									if (!_status.mjsAiSkipN) {
										_status.mjsAiSkipN = true
									}
									return num
								}
								var cur = (player && player.storage && player.storage.mjs003_skill_mjsshanshui) || 0
								var need = 13 - cur
								var sol = []
								if (need >= 1 && need <= 13) {
									try {
										sol = mjsPlan(player, need)
									} catch (e) {
										sol = []
									}
									if (sol.indexOf(card) >= 0) {
										return num + 100
									}
								}
								if (cur + n === 13) {
									if (!(card && card.mjsShanshuiPrize)) {
										return num + 10
									}
								}
								if (cur + n > 13) {
									var rO = num - 6
									return num > 0 && rO < 1 ? 1 : rO
								}
								return num
							}
						},
						mark: true,
						marktext: '差',
						intro: {
							name: '山水',
							markcount: function (storage, player) {
								var cur = (player && player.storage && player.storage.mjs003_skill_mjsshanshui) || 0
								return 13 - (cur % 13)
							},
							content: function (storage, player) {
								var cur = (player && player.storage && player.storage.mjs003_skill_mjsshanshui) || 0
								var diff = 13 - (cur % 13)
								return (
									'累计点数：' +
									cur +
									' / 13<br>还差 ' +
									diff +
									' 点' +
									(cur >= 13 ? '（已打满，下一张牌重置后重新累计）' : '（打满 13：获得点数6 和7的牌各1张）')
								)
							}
						},
						filter: function (event, player) {
							if (!event.card) return false
							var n = get.number(event.card)
							return typeof n == 'number'
						},
						content: function () {
							'step 0'
							var theCard = (trigger && trigger.card) || (event && event.card)
							var n = theCard ? get.number(theCard) : undefined
							if (typeof n != 'number') return
							var cur = (player.storage.mjs003_skill_mjsshanshui || 0) + n
							if (cur > 13) {
								player.storage.mjs003_skill_mjsshanshui = 0
								player.updateMarks()
								return
							}
							if (cur < 13) {
								player.storage.mjs003_skill_mjsshanshui = cur
								player.updateMarks()
								return
							}
							player.storage.mjs003_skill_mjsshanshui = 0
							player.updateMarks()
							var c6 = get.cardPile2(function (c) {
								return get.number(c) == 6
							})
							var c7 = get.cardPile2(function (c) {
								return get.number(c) == 7
							})
							var got = []
							if (c6) got.push(c6)
							if (c7) got.push(c7)
							if (!got.length) {
								game.log('牌堆里没有点数为6和7的牌，无法获得')
								return
							}
							player.logSkill('mjs003_skill_mjsshanshui')
							for (var gi = 0; gi < got.length; gi++) got[gi].mjsShanshuiPrize = true
							player.gain(got, 'gain2')
							game.log(player, '从牌堆获得了', get.cnNumber(got.length) + '张牌')
							game.updateRoundNumber()
						}
					},
					mjs003_skill_mjschitang: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						enable: 'phaseUse',
						usable: 1,
						filter: function (event, player) {
							var has = {}
							var hs = player.getCards('h')
							for (var i = 0; i < hs.length; i++) has[get.number(hs[i])] = true
							for (var n = 1; n <= 13; n++) if (!has[n]) return true
							return false
						},
						chooseButton: {
							dialog: function (event, player) {
								var dialog = ui.create.dialog(get.prompt2('mjs003_skill_mjschitang'))
								var has = {}
								var hs = player.getCards('h')
								for (var i = 0; i < hs.length; i++) has[get.number(hs[i])] = true
								var list = []
								for (var n = 1; n <= 13; n++) if (!has[n]) list.push([n, get.strNumber(n)])
								dialog.add([list, 'tdnodes'])
								return dialog
							},
							select: 1,
							check: function (button) {
								if (lib.mjsAiDiag) lib.mjsAiDiag('checkCalls')
								var player = _status.event.player
								var canUse = function (x) {
									var _c0 = lib.mjsAiT ? lib.mjsAiT() : Date.now()
									try {
										var key = lib.mjsAiSitKey ? lib.mjsAiSitKey(player, true) : 'ev:' + _status.event
										var cache = _status.mjsShanshuiPlay
										if (!cache || cache.k !== key) {
											cache = { k: key, cards: [], vals: [] }
											_status.mjsShanshuiPlay = cache
										}
										var ci = -1
										for (var cj = 0; cj < cache.cards.length; cj++)
											if (cache.cards[cj] === x && cache.vals[cj].p === player) {
												ci = cj
												break
											}
										if (lib.mjsAiDiag) lib.mjsAiDiag('canHit', (lib.mjsAiT ? lib.mjsAiT() : Date.now()) - _c0)
										if (ci >= 0) return cache.vals[ci].v
										var v
										if (!lib.filter.cardEnabled(x, player)) v = false
										else if (!lib.filter.cardUsable(x, player)) v = false
										else {
											var info = get.info(x)
											if (info && info.notarget) v = true
											else if (typeof player.hasUseTarget != 'function') v = true
											else v = player.hasUseTarget(x)
										}
										cache.cards.push(x)
										cache.vals.push({ p: player, v: v })
										if (lib.mjsAiDiag) lib.mjsAiDiag('canMiss', (lib.mjsAiT ? lib.mjsAiT() : Date.now()) - _c0)
										return v
									} catch (e) {
										return false
									}
								}
								var num = button.link
								var best = 0
								var found = false
								var nodes = ui.cardPile && ui.cardPile.childNodes ? ui.cardPile.childNodes : []
								for (var i = 0; i < nodes.length; i++) {
									if (!nodes[i] || !nodes[i].name || get.number(nodes[i]) != num || !canUse(nodes[i])) continue
									found = true
									var vv = get.value(nodes[i], player)
									if (typeof vv == 'number' && !isNaN(vv)) best = Math.max(best, vv)
								}
								if (!found) {
									return -1
								}
								var curC = (player && player.storage && player.storage.mjs003_skill_mjsshanshui) || 0
								var needC = 13 - curC
								if (num === needC && needC >= 1 && needC <= 13) {
									var reachC = [true]
									var hsC = player.getCards('h')
									for (var i2 = 0; i2 < hsC.length; i2++) {
										var pc = get.number(hsC[i2])
										if (typeof pc != 'number' || !canUse(hsC[i2])) continue
										for (var sc = needC; sc >= pc; sc--) if (reachC[sc - pc]) reachC[sc] = true
									}
									if (!reachC[needC]) {
										return 20
									}
								}
								if (best < 6) return Math.random()
								return best
							},
							backup: function (result, player) {
								return {
									num: result[0],
									content: function () {
										'step 0'
										var num = lib.skill.mjs003_skill_mjschitang_backup.num
										var found = []
										var nodes = ui.cardPile.childNodes
										for (var i = 0; i < nodes.length; i++) {
											if (nodes[i] && nodes[i].name && get.number(nodes[i]) == num) found.push(nodes[i])
										}
										if (!found.length) {
											game.log('牌堆里没有点数为' + num + '的牌，无法获得')
											event.finish()
											return
										}
										if (found.length == 1) {
											player.gain(found[0], 'gain2')
											game.log(player, '从牌堆获得了', found[0])
											game.updateRoundNumber()
											event.finish()
											return
										}
										player
											.chooseCardButton('池塘春草：选择获得的点数为 ' + num + ' 的牌', found, 1)
											.set('ai', function (button) {
												var p = _status.event.player
												var card = button.link
												var v = get.value(card, p)
												var playable = true
												try {
													var info = get.info(card)
													playable =
														lib.filter.cardEnabled(card, p) &&
														lib.filter.cardUsable(card, p) &&
														(info && info.notarget
															? true
															: typeof p.hasUseTarget != 'function'
																? true
																: p.hasUseTarget(card))
												} catch (e) {
													playable = false
												}
												return playable ? v + 1000 : v
											})
										'step 1'
										if (result.bool && result.links && result.links.length) {
											var card = result.links[0]
											player.gain(card, 'gain2')
											game.log(player, '从牌堆获得了', card)
											game.updateRoundNumber()
										}
									}
								}
							}
						},
						ai: {
							order: function (item, player) {
								if (lib.mjsAiDiag) lib.mjsAiDiag('poolOrderCalls')
								if (player && player.getStat && get.skillCount && get.skillCount('mjs003_skill_mjschitang', player) >= 1) return -1
								var has = {}
								var canUse = function (x) {
									var _c0 = lib.mjsAiT ? lib.mjsAiT() : Date.now()
									try {
										var key = lib.mjsAiSitKey ? lib.mjsAiSitKey(player, true) : 'ev:' + _status.event
										var cache = _status.mjsShanshuiPlay
										if (!cache || cache.k !== key) {
											cache = { k: key, cards: [], vals: [] }
											_status.mjsShanshuiPlay = cache
										}
										var ci = -1
										for (var cj = 0; cj < cache.cards.length; cj++)
											if (cache.cards[cj] === x && cache.vals[cj].p === player) {
												ci = cj
												break
											}
										if (lib.mjsAiDiag) lib.mjsAiDiag('canHit', (lib.mjsAiT ? lib.mjsAiT() : Date.now()) - _c0)
										if (ci >= 0) return cache.vals[ci].v
										var v
										if (!lib.filter.cardEnabled(x, player)) v = false
										else if (!lib.filter.cardUsable(x, player)) v = false
										else {
											var info = get.info(x)
											if (info && info.notarget) v = true
											else if (typeof player.hasUseTarget != 'function') v = true
											else v = player.hasUseTarget(x)
										}
										cache.cards.push(x)
										cache.vals.push({ p: player, v: v })
										if (lib.mjsAiDiag) lib.mjsAiDiag('canMiss', (lib.mjsAiT ? lib.mjsAiT() : Date.now()) - _c0)
										return v
									} catch (e) {
										return false
									}
								}
								var hs = player.getCards('h')
								for (var i = 0; i < hs.length; i++) has[get.number(hs[i])] = true
								var cur = (player && player.storage && player.storage.mjs003_skill_mjsshanshui) || 0
								var need = 13 - cur
								var canSelf = false
								if (need >= 1 && need <= 13) {
									var reach = [true]
									var hsP = player.getCards('h')
									for (var i = 0; i < hsP.length; i++) {
										var pv = get.number(hsP[i])
										if (typeof pv != 'number' || !canUse(hsP[i])) {
											if (pv != null) {
												_status.mjsAiExcl = _status.mjsAiExcl || {}
												if (!_status.mjsAiExcl[pv]) {
													_status.mjsAiExcl[pv] = true
												}
											}
											continue
										}
										for (var s = need; s >= pv; s--) if (reach[s - pv]) reach[s] = true
									}
									canSelf = !!reach[need]
								}
								if (canSelf) {
									return 0
								}
								if (
									need >= 1 &&
									need <= 13 &&
									get.cardPile2(function (c) {
										return get.number(c) == need && canUse(c)
									})
								) {
									return 10
								}
								for (var n = 1; n <= 13; n++) {
									if (has[n]) continue
									if (
										get.cardPile2(function (c) {
											return get.number(c) == n && canUse(c)
										})
									) {
										return 6
									}
								}
								return 0
							},
							result: {
								player: 1
							}
						}
					},
					mjs003_skill_mjsbaizhanwujie: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						trigger: { player: 'damageEnd' },
						forced: true,
						filter: function (event, player) {
							return event.card && event.card.name == 'sha' && event.num > 0
						},
						content: function () {
							game.trySkillAudio('mjs003_skill_mjsbaizhanwujie', player, true)
							player.draw(2)
						},
						ai: { maixie: true }
					},
					mjs003_skill_mjsluzhuanfenghui: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						mod: {
							selectTarget: function (card, player, range) {
								if (card.name != 'sha') return
								if (_status.event && typeof _status.event.isMine == 'function' && _status.event.isMine()) {
									range[0] = 0
									range[1] = 0
								} else {
									range[0] = 0
									range[1] = 1
								}
							},
							aiOrder: function (player, card, num) {
								if (card.name == 'sha') return Math.max(num, 6)
							}
						},

						group: ['mjs003_skill_mjsluzhuanfenghui_target', 'mjs003_skill_mjsluzhuanfenghui_count'],
						subSkill: {
							target: {
								trigger: { player: 'useCard1' },
								forced: true,
								popup: false,
								charlotte: true,
								filter: function (event, player) {
									return event.card && event.card.name == 'sha'
								},
								content: function () {
									'step 0'
									player.judge()
									'step 1'
									var list = game.filterPlayer().sortBySeat(player)
									var target = list[(result.number - 1) % list.length]
									trigger.targets = [target]
									game.trySkillAudio('mjs003_skill_mjsluzhuanfenghui', player, true)
									game.log(player, '〖路转锋回〗判定', result.card, '，目标改为', target)
								}
							},
							count: {
								trigger: { player: 'useCardAfter' },
								forced: true,
								popup: false,
								charlotte: true,
								filter: function (event, player) {
									return event.card && event.card.name == 'sha' && event.addCount !== false
								},
								content: function () {
									trigger.addCount = false
									player.getStat().card.sha--
								}
							}
						}
					},
					mjs003_skill_mjsxuruizhuizhan: {
						audio: 'ext:名将杀/assets/incremental/audio/skill:2',
						priority: 1,
						group: ['mjs003_skill_mjsxuruizhuizhan_damage'],
						trigger: { player: 'useCardAfter' },
						forced: true,
						filter: function (event, player) {
							return event.card && event.card.name == 'sha' && event.targets && event.targets.length > 0
						},
						content: function () {
							var storage = player.storage.mjs003_skill_mjsxuruizhuizhan || (player.storage.mjs003_skill_mjsxuruizhuizhan = [])
							trigger.targets.forEach(function (target) {
								var hit = player.hasHistory('sourceDamage', function (evt) {
									return evt.card == trigger.card && evt.player == target && evt.num > 0
								})
								if (!hit && !storage.contains(target.playerid)) {
									storage.push(target.playerid)
									target.addSkill('mjs003_skill_mjsxuruizhuizhan_mark')
									target.addMark('mjs003_skill_mjsxuruizhuizhan_mark', 1, false)
								}
							})
						},
						subSkill: {
							mark: {
								charlotte: true,
								marktext: '加伤',
								intro: {
									nocount: true,
									name: '加伤',
									content: '暴鸢对其使用的下一张【杀】伤害 +1'
								}
							},
							damage: {
								trigger: { source: 'damageBegin1' },
								forced: true,
								popup: false,
								charlotte: true,
								filter: function (event, player) {
									if (!event.card || event.card.name != 'sha' || !event.player) return false
									var storage = player.storage.mjs003_skill_mjsxuruizhuizhan
									return !!storage && storage.contains(event.player.playerid)
								},
								content: function () {
									trigger.num++
									game.trySkillAudio('mjs003_skill_mjsxuruizhuizhan', player, true)
									player.storage.mjs003_skill_mjsxuruizhuizhan.remove(trigger.player.playerid)
									trigger.player.removeMark('mjs003_skill_mjsxuruizhuizhan_mark', 1, false)
									trigger.player.unmarkSkill('mjs003_skill_mjsxuruizhuizhan_mark')
									trigger.player.removeSkill('mjs003_skill_mjsxuruizhuizhan_mark')
								}
							}
						}
					}
				},
				translate: {
					mjs003_skill_mjs_yujian_thunder: '玉剑',
					mjs003_skill_mjs_yujian_thunder_info: '锁定技，抵消你受到的雷电伤害。',
					mjs003_skill_mjs_yujian_sha: '玉剑',
					mjs003_skill_mjs_yujian_sha_info: '当你打出的【杀】即将造成伤害时，你可以将此伤害改为令目标失去等量体力。',
					mjs003_skill_mjs_shizu_allowed: '允许使用士族牌',
					mjs003_skill_mjs_distance_mark: '距离',
					mjs003_skill_mjs_distance_mark_info:
						'控制面板【距离】按钮的标记：显示每名角色与你的双向距离（他到你 / 你到他）。' +
						'点一次显示，再点一次清除；不属任何武将技能，仅作观察用。',
					mjs003_skill_mjsqijin: '\uE01A\uE01B',
					mjs003_skill_mjsshidan: '\uE01C\uE01D',
					mjs003_skill_mjsrulong: '\uE01E\uE01F',
					mjs003_skill_mjsqijin_info: '你每累计打出 3 张【杀】或【闪】后，你的手牌上限 + 1，每个出牌阶段的出杀次数 + 1。',
					mjs003_skill_mjsshidan_info: '闪避，你可以立即使用 1 张【杀】；你的【杀】可以当作【闪】打出。',
					mjs003_skill_mjsrulong_info: '出杀，摸 1 张牌；你的【闪】可以当作【杀】打出。',
					mjs003_skill_mjs_zimu_gain: '自募',
					mjs003_skill_mjs_changcheng: '\uE024\uE025',
					mjs003_skill_mjs_changcheng_bg: '城',
					mjs003_skill_mjs_changcheng_tag: '长城',
					mjs003_skill_mjs_changcheng_tag_bg: '城',
					mjs003_skill_mjs_changcheng_info:
						'锁定技，每轮开始时，你翻开牌堆顶的八张牌，将其中的【闪】放入万里长城，然后你可以将剩余牌按原顺序放回牌堆顶或弃置。每回合限一次，与你势力相同的角色需要使用或打出一张【闪】时，你可以从万里长城中替其打出一张【闪】。',
					mjs003_skill_mjs_changcheng2: '长城',
					mjs003_skill_mjs_changcheng2_info:
						'每回合限一次，与你势力相同的角色需要使用或打出一张【闪】时，你可以从万里长城中替其打出一张【闪】。',
					mjs003_skill_mjs_qinnu: '\uE022\uE023',
					mjs003_skill_mjs_qinnu_info:
						'出牌阶段限一次，你可以翻开牌堆顶的八张牌，为其中的每张【杀】选择一名不同的其他角色作为目标并依次对其使用，然后将剩余牌按原顺序放回牌堆顶或弃置。',
					mjs003_skill_mjs_yitong: '\uE020\uE021',
					mjs003_skill_mjs_yitong_info:
						'与你势力相同的角色造成伤害后，你可以将受伤角色的势力改为与你相同或令该角色下野。当全场首次仅存在一种势力时，你回复全部体力，在接下来本局游戏中，你的回合开始时，你从每个在野角色处随机获得一张牌。',
					mjs003_skill_mjs_jianmie: '歼灭',
					mjs003_skill_mjs_jianmie_info: '当你使用杀或者用杀造成伤害时，你可以弃置不是此【杀】目标的一名角色区域内的一张牌。',
					mjs003_skill_mjs_liaodi: '\uE006\uE007',
					mjs003_skill_mjs_liaodi_info: '当其他角色失去最后的手牌时，你可以立刻对其打出一张杀。',
					mjs003_skill_mjs_chuqi: '\uE008\uE009',
					mjs003_skill_mjs_chuqi_info:
						'每个回合限一次，当你在回合外需要使用或打出基本牌时，你可以选择一种基本牌，将一张手牌当做该基本牌使用或打出，然后获得一张【杀】。',
					mjs003_skill_mjs_zhongxin: '忠信',
					mjs003_skill_mjs_zhongxin_info: '每回合限一次，当一名其他角色成为其他角色【杀】的目标时，你可以将此【杀】的目标改为你。',
					mjs003_skill_mjs_zhucheng: '\uE02A\uE02B',
					mjs003_skill_mjs_zhucheng_info:
						'当你成为杀的目标时，你摸一张牌，若你未受到此杀伤害，令此技能可以摸牌的数量+1，直到你的下个回合开始。',
					mjs003_skill_mjs_shezi: '\uE040\uE041',
					mjs003_skill_mjs_shezi_info: '当你受到伤害时，你可以令一名角色弃置所有手牌并摸牌至手牌上限。',
					mjs003_skill_mjs_zhongzhen: '\uE042\uE043',
					mjs003_skill_mjs_zhongzhen_info:
						'回合结束时，你可以令一名其他角色的手牌数变为与你相同，若其手牌数因此改变≥2，你受到一点伤害。',
					mjs003_skill_mjs_fenggong: '\uE038\uE039',
					mjs003_skill_mjs_fenggong_info: '出牌阶段限一次，你可以令一名其他角色进行一个弃牌阶段，你获得其在此阶段内弃置的牌。',
					mjs003_skill_mjs_xianglu: '\uE03A\uE03B',
					mjs003_skill_mjs_xianglu_info:
						'出牌阶段限一次，你可以选择一名其他角色，翻开牌堆顶的5张牌，你获得其中除杀之外的牌，令其对你依次打出剩余杀，然后，其对你再次执行此效果。',
					mjs003_skill_mjs_qiaojie: '\uE02C\uE02D',
					mjs003_skill_mjs_qiaojie_info: '每个回合限一次，当你成为其他角色打出的锦囊牌目标时，你可以将其转化为杀并对你打出。',
					mjs003_skill_mjs_shiqin: '\uE02E\uE02F',
					mjs003_skill_mjs_shiqin_info:
						'每个回合限一次，体力值大于你的角色对你造成伤害后，你可以令一名角色摸1张牌；手牌数大于你的角色对你造成伤害后，你可以令一名角色回复1点体力值。',
					mjs003_skill_mjs_huiyan: '\uE030\uE031',
					mjs003_skill_mjs_huiyan_info:
						'游戏开始时，你选择一名男性角色，每个回合你们的体力值或手牌数变化后首次相同，你们各摸1张牌。',
					mjs003_skill_mjs_daowang: '\uE032\uE033',
					mjs003_skill_mjs_daowang_info: '限定技，当一名其他角色阵亡后，你可以获得弃牌堆中其打出过的所有牌。',
					mjs003_skill_mjs_pancai: '\uE034\uE035',
					mjs003_skill_mjs_pancai_info:
						'回合结束时，你可以将1张牌当作任意1张锦囊牌打出，每种牌限1次。然后直到你的下个回合开始，其他角色的回合结束时，可以交给你1张牌，然后你可以令其将1张牌当作此锦囊牌打出。',
					mjs003_skill_mjs_zhiguo: '\uE036\uE037',
					mjs003_skill_mjs_zhiguo_info:
						'锁定技，回合开始时，令所有有手牌的其他角色随机展示2张手牌，然后添加展示次数最多的2种牌各1张至你的手牌。当你打出手牌中因此获得的所有牌后，可以令一名角色获得1张锦囊牌。',
					mjs003_skill_mjs_zhiguo_tag: '果',
					mjs003_skill_mjs_zhiguo_tag_bg: '果',
					mjs003_skill_mjs_xue_tag: '削',
					mjs003_skill_mjs_xue_tag_bg: '削',
					mjs003_skill_mjs_xue_test_cost: '削',
					mjs003_skill_mjs_bianruo: '变弱',
					mjs003_skill_mjs_xue_test: '削弱',
					mjs003_skill_mjs_xue_test_info:
						'出牌阶段限一次，你可以将所有手牌加上"削"标记。有"削"标记的牌结算时被削弱：【杀】使用时须先弃置一张其他牌，属性【杀】改为随机弃置一张手牌；【桃】只能对自己使用；【酒】不能在濒死时用于回体力；【决斗】由你先出杀；【万箭齐发】和【南蛮入侵】你也在目标范围内；【无中生有】改为摸一张牌；【桃园结义】只有体力最低的角色回复1点体力（并列都回复）；【过河拆桥】改为随机弃置目标区域里的一张牌；【顺手牵羊】改为随机获得目标区域里的一张牌（距离限制保留）；【借刀杀人】目标拒绝出杀时不转移武器；【无懈可击】只能抵消对自己生效的锦囊；【闪】只能抵挡【杀】的1点伤害（其余伤害照常结算）。',
					mjs003_skill_mjs_bianruo_info: '出牌阶段限一次，你可以将牌堆里的所有牌加上"削"标记。',
					mjs003_skill_mjs_fujing: '\uE03C\uE03D',
					mjs003_skill_mjs_fujing_info:
						'出牌阶段限1次，你可以获得攻击范围内一名其他角色区域内的2张牌，其下个回合开始时，你失去1点体力，然后将因此获得的牌交回。',
					mjs003_skill_mjs_fujing_return: '负荆',
					mjs003_skill_mjs_fujing_tag: '荆',
					mjs003_skill_mjs_fujing_tag_bg: '荆',
					mjs003_skill_mjs_fanfou: '\uE03E\uE03F',
					mjs003_skill_mjs_fanfou_info:
						'回合结束时，若你的出杀次数：为0，你可以摸牌至手牌上限，并且之后每个出牌阶段的出杀次数+1；不为0，你摸剩余出杀次数张牌。',
					mjs003_skill_mjs_fanfou_mod: '饭否',
					mjs003_skill_mjs_zhuangyong: '\uE026\uE027',
					mjs003_skill_mjs_zhuangyong_info:
						'当你造成伤害后，若你的体力值不满，则你回复1点体力；每个回合限1次，当你即将造成伤害时，若你的体力值满，你可以令此伤害+1。',
					mjs003_skill_mjs_zhuifeng: '\uE028\uE029',
					mjs003_skill_mjs_zhuifeng_info:
						'你可以弃置1张牌，出杀次数+1，然后令此技能需要弃置的牌数改为2直到当前回合结束。击杀时，你本回合每打出过1张杀，就可以摸2张牌，然后此技能本回合无效。',
					mjs003_skill_mjs_guanniang: '\uE018\uE019',
					mjs003_skill_mjs_guanniang_info: '受伤，你可以削弱一名角色的 2 张牌，然后若其所有牌都被削弱，令其手牌上限 - 1。',
					mjs003_skill_mjs_powei: '\uE016\uE017',
					mjs003_skill_mjs_powei_info:
						'限定技，当你受到伤害时，你可以受到1点伤害，然后重复此过程，直到你的体力值=1；然后弃置场上所有削弱牌，每因此弃置2张削弱牌，你就获得1张非削弱牌。',
					mjs003_skill_mjs_nanzhong: '\uE010\uE011',
					mjs003_skill_mjs_nanzhong_info:
						'当你打出削弱牌时，你摸一张牌。当所有角色累计打出15张削弱牌后，你失去技能〖谠正〗，且此技能获得：每回合限一次，当你获得牌时，削弱这些牌。',
					mjs003_skill_mjs_dangzheng: '\uE012\uE013',
					mjs003_skill_mjs_dangzheng_info: '你的【酒】只能当作上一张被打出的锦囊牌打出。你打出的削弱牌以普通牌效果生效。',
					mjs003_skill_mjs_xinlv: '\uE014\uE015',
					mjs003_skill_mjs_xinlv_info:
						'限定，你选择 1 张手牌，削弱游戏中所有同名牌，接下来本局游戏，当你打出削弱牌后，可以削弱一名角色的 2 张牌。',
					mjs003_skill_mjs_xinlv_effect: '新律',
					mjs003_skill_mjs_anying: '\uE050\uE051',
					mjs003_skill_mjs_anying_info:
						'回合结束时，你可以弃置所有手牌，并增加等量体力上限，然后回复1点体力；回合开始时，你的体力上限减少至体力值，每减少1点，摸2张牌。',
					mjs003_skill_mjs_shiwu: '\uE052\uE053',
					mjs003_skill_mjs_shiwu_info:
						'其他角色打出杀后，若目标也在你的攻击范围内，你可以失去1点体力，摸2张牌，并且可以对相同目标打出1张杀。',
					mjs003_skill_mjs_shizu: '\uE044\uE045',
					mjs003_skill_mjs_shizu_info:
						'每轮开始时，你查看士族牌堆顶的 5 张牌，并且选择获得其中 2 张牌。（士族：游戏开始时，将牌堆顶的 10 张牌转化为士族牌并放入士族牌堆。士族牌堆与公共牌堆相互独立，并且只有"士族"角色，才可以打出士族牌。）',
					mjs003_skill_mjs_shizu_round: '士族',
					mjs003_skill_mjs_shizu_yiwu: '\uE046\uE047',
					mjs003_skill_mjs_shizu_yiwu_info:
						'登场，你可以令一名其他角色在本局游戏中可以打出士族牌。出牌阶段限 1 次，你可以将至少 1 张牌转化为士族牌并放入士族牌堆顶，然后令一名角色获得等量 + 1 或 - 1 张士族牌。',
					mjs003_skill_mjs_shizu_zhenjing: '\uE048\uE049',
					mjs003_skill_mjs_shizu_zhenjing_info:
						'当你成为其他角色打出牌的目标，并且没有响应此牌后，你可以令一名角色获得 1 张士族牌。',
					mjs003_skill_mjs_shizu_tag: '士',
					mjs003_skill_mjs_shizu_tag_bg: '士',
					mjs003_skill_mjsbaizhanwujie: '\uE098\uE099',
					mjs003_skill_mjsbaizhanwujie_info: '当你受到【杀】的伤害时，摸2张牌。',
					mjs003_skill_mjsluzhuanfenghui: '\uE09A\uE09B',
					mjs003_skill_mjsluzhuanfenghui_info: '你无法选择杀的目标，你的杀的目标根据卜卦结果决定。你的杀不计入出杀次数。',
					mjs003_skill_mjsxuruizhuizhan: '\uE09C\uE09D',
					mjs003_skill_mjsxuruizhuizhan_info: '当你对一名角色打出杀后，若此杀未造成伤害，则你对目标角色打出的下1张杀的伤害+1。',
					mjs003_skill_mjs_wenji: '\uE04A\uE04B',
					mjs003_skill_mjs_wenji_info: '登场 / 牌堆洗牌后，你立即进行 1 个出牌阶段。',
					mjs003_skill_mjs_jiji: '\uE04C\uE04D',
					mjs003_skill_mjs_jiji_info:
						'出牌阶段限 1 次，你可以亮出牌堆中间的 1 张牌，在此牌离开牌堆前，你打出的与此牌花色或点数相同的牌生效 2 次，且在打出后，你可以查看并选择是否弃置牌堆顶的 3 张牌。',
					mjs003_skill_mjs_zimu: '\uE04E\uE04F',
					mjs003_skill_mjs_cunsishenshen: '\uE05A\uE05B',
					mjs003_skill_mjs_cunsishenshen_info:
						'当你从牌堆获得牌时，你可以将这些牌按原顺序放回牌堆顶，然后将自己的 1 个阶段永久改为另 1 个阶段。',
					mjs003_skill_mjs_shangqingzhenjing: '\uE05C\uE05D',
					mjs003_skill_mjs_huangtinghuaxian: '\uE064\uE065',
					mjs003_skill_mjs_huangtinghuaxian_info:
						'阵亡，你可以将魏华存的武将牌洗入牌堆，并且可以将1张【玉剑】添加至一名其他角色的装备区。',
					mjs003_skill_mjs_tianren: '\uE05E\uE05F',
					mjs003_skill_mjs_shimeng: '\uE060\uE061',
					mjs003_skill_mjs_tianren: '\uE05E\uE05F',
					mjs003_skill_mjs_tianren_info: '其他角色体力值首次变为1时，你可以失去体力至1点，你每因此失去1点体力，就令其回复1点体力。',
					mjs003_skill_mjs_shimeng: '\uE060\uE061',
					mjs003_skill_mjs_shimeng_info:
						'当你的体力值等于1时，你可以将任意牌当作闪打出。你在回合外每累计打出3张牌时，你回复1点体力。',
					mjs003_skill_mjs_fengfaxingling: '\uE062\uE063',
					mjs003_skill_mjs_fengfaxingling_info:
						'其他角色在其回合内的非摸牌阶段获得战法牌时，你可以将其中随机1张转化为【笞】；其他角色在非弃牌阶段弃牌时，若其手牌中存在【笞】，你可以对其造成1点伤害。',
					mjs003_skill_mjs_shangqingzhenjing_info:
						'每种效果限 1 次，你的每个阶段结束时，若你连续 5 个阶段没有获得 / 打出牌，你之后的回合永久获得 1 个摸牌 / 出牌阶段。',
					mjs003_skill_mjs_shangsiyaoyu: '\uE054\uE055',
					mjs003_skill_mjs_dujianghualong: '\uE058\uE059',
					mjs003_skill_mjs_tongshengyuchuang: '\uE056\uE057',
					mjs003_skill_mjs_shangsiyaoyu_info:
						'登场，所有其他角色依次选择是否令你因此技能装备的装备种类 +1。然后你获得并装备装备牌直到你因此技能装备装备牌种类达到x。（x 为选择 “令你装备种类 + 1” 的角色数量+3，x至多为5）',
					mjs003_skill_mjs_dujianghualong_info:
						'每当有8张牌进入弃牌堆，你摸1张牌。当弃牌堆中的牌数量首次大于牌堆中的牌数时，你的手牌上限+1，并摸牌至手牌上限，然后获得技能“同升御床”。',
					mjs003_skill_mjs_tongshengyuchuang_info:
						'每个回合限1次，当你获得牌时，若你的手牌数≥你的手牌上限，你可以令一名其他角色摸牌至手牌上限。',
					mjs003_skill_mjs_zimu_info:
						'你始终跳过摸牌阶段。每个角色的回合结束时，你可以失去 1 点体力或 1 点体力上限，然后随机获得本回合进入弃牌堆的 3 种不同类型的牌各 1 张。',
					mjs003_skill_mjs_xicao: '\uE00E\uE00F',
					mjs003_skill_mjs_xicao_info:
						'你打出的以其他角色为唯一目标的牌可以额外选择另一名其他角色为目标，然后你指定其中一个目标为虚假目标。（虚假目标可以正常响应此牌，但是此牌最终不会对其生效）',
					mjs003_skill_mjs_dunjia: '\uE00C\uE00D',
					mjs003_skill_mjs_dunjia_info: '回合开始，从随机三名武将中选择一名，直到你的下回合开始，获得其所有技能。',
					mjs003_skill_mjs_feisheng: '\uE00A\uE00B',
					mjs003_skill_mjs_feisheng_info: '登场和回合开始时，卜卦 2 次，根据点数依次确定你当前的体力值和手牌上限。',
					mjs003_skill_mjs_fenglangjuxu: '\uE000\uE001',
					mjs003_skill_mjs_fenglangjuxu_ab: '\uE000\uE001',
					mjs003_skill_mjs_fenglangjuxu_info: '当你造成其他角色重伤时，你可以选择其一个技能，转移给你。',
					mjs003_skill_mjs_heyijiawei: '\uE002\uE003',
					mjs003_skill_mjs_heyijiawei_ab: '\uE002\uE003',
					mjs003_skill_mjs_heyijiawei_info:
						'回合结束时，若你本回合没有造成过伤害，你可以摸三张牌，立即进行一个额外出牌阶段；此额外出牌阶段结束时，你失去1点体力上限。',
					mjs003_skill_msjyingma: '\uE004\uE005',
					mjs003_skill_msjyingma_ab: '\uE004\uE005',
					mjs003_skill_msjyingma_info: '造成伤害后，摸一张牌。',
					mjs003_skill_mjhongyan: '\uE066\uE067',
					mjs003_skill_mjhongyan_info:
						'出牌阶段限 1 次，你可以令一名其他角色交给你 1 张牌，然后你交回给其 1 张牌。若你交回的牌点数更大，你与所有其他角色的距离减少这两张牌点数的差值，否则所有其他角色与你的距离减少这两张牌点数的差值。当你与所有其他角色的距离均≤1 时，你摸存活人数张牌，然后失去此技能。',
					mjs003_skill_mjsniexue: '\uE068\uE069',
					mjs003_skill_mjsniexue_info:
						'若所有其他角色与你的距离均大于 1，你摸牌阶段的摸牌数 - 1，并且出牌阶段限 1 次，你可以销毁 1 张装备牌，摸 3 张牌。',
					mjs003_skill_mjshanshi: '\uE06A\uE06B',
					mjs003_skill_mjshanshi_info: '游戏开始时，场上每有一名角色，你就与所有其他角色相互的距离 + 1。',
					mjs003_skill_mjsrongjinduansuo: '\uE072\uE073',
					mjs003_skill_mjsrongjinduansuo_info: '出牌阶段限 1 次，你可以销毁一名其他角色区域内的所有♦️牌，并增加等量的出杀次数。',
					mjs003_skill_mjsrongjinduansuo_sha: '\uE072\uE073',
					mjs003_skill_mjsrongjinduansuo_sha_bg: '索',
					mjs003_skill_mjsanzhulouchuan: '\uE074\uE075',
					mjs003_skill_mjsanzhulouchuan_info:
						'出牌阶段限 1 次，你可以将 1 张手牌选择并转化为 1 张相同花色的装备牌，并获得 1 张相同花色的牌。每轮结束时，若你的装备区牌数不是全场最多，此技能的发动次数永久 + 1。',
					mjs003_skill_mjsxianmei: '衔枚',
					mjs003_skill_mjsxianmei_info: '若你在出牌阶段没有打出杀，你跳过弃牌阶段，并且你之后每个出牌阶段的出杀次数 + 1。',
					mjs003_skill_mjsxianmei_mod: '衔枚',
					mjs003_skill_mjsxianmei_mod_info: '出杀次数 +N（N 为〖衔枚〗累计次数）。',
					mjs003_skill_mjsshetushoubing: '\uE076\uE077',
					mjs003_skill_mjsshetushoubing: '\uE076\uE077',
					mjs003_skill_mjsshetushoubing_info: '你可以消耗 1 次出杀次数，将弃牌堆中的所有杀洗回牌堆，然后摸牌直到摸到的牌不是杀。',
					mjs003_skill_mjsliangchaofengyi: '\uE06C\uE06D',
					mjs003_skill_mjsliangchaofengyi_info:
						'登场，你可以选择一名其他角色，令其选择获得 1 个 “出牌阶段限 1 次” 的技能。出牌阶段限 2 次，你可以选择发动一名其他角色的 “出牌阶段限 1 次” 的技能。',
					mjs003_skill_mjswufeiliuli: '\uE06E\uE06F',
					mjs003_skill_mjswufeiliuli_info:
						'其他角色出牌阶段限 2 次，令你的手牌上限 + 1，然后你可以令其摸 1 张牌；或令你的手牌上限 - 1。当你的手牌上限变为 0 或累计改变 6 次后，将你的武将技能修改为 “两朝凤仪”，然后你重新登场，并立即进行 1 个出牌阶段。',
					mjs003_skill_mjsfengluojinlao: '\uE070\uE071',
					mjs003_skill_mjsfengluojinlao_info:
						'你打出的牌无法选择其他角色为目标。每个角色的回合开始时，你受到 1 点伤害。当你即将受到伤害时，若你的手牌上限 > 0，将此伤害改为手牌上限 - 1。',
					mjs003_skill_mjsfengshenxiuyi: '\uE092\uE093',
					mjs003_skill_mjsfengshenxiuyi_info:
						'每个回合限1次，当你即将受到伤害时，若你的手牌上限>体力值，则改为减少等量的手牌上限。 当你打出牌时，每回合每种类型的牌限1次，若所有其他角色手牌中都不存在与此牌相同牌名的牌，则你的手牌上限+1，并随机获得1张与其他角色手牌中相同牌名的牌。',
					mjs003_skill_mjszhuyuzace: '\uE094\uE095',
					mjs003_skill_mjszhuyuzace_info: '当你打出牌后，你可以削弱一名与你距离最近的其他角色手牌中所有相同牌名的牌。',
					mjs003_skill_mjssimengchengji: '\uE096\uE097',
					mjs003_skill_mjssimengchengji_info:
						'出牌阶段，你可以获得1张与所有其他角色手牌中牌名都不相同的牌，然后失去1点体力，若没有因此获得牌，此技能失效直到当前回合结束。',
					mjs003_skill_mjsfengshenxiuyi_hurt: '\uE092\uE093',
					mjs003_skill_mjsfengshenxiuyi_draw: '\uE092\uE093',
					mjs003_skill_mjsfengshenxiuyi_clear: '\uE092\uE093',
					mjs003_skill_mjssimengchengji_used: '\uE096\uE097',
					mjs003_skill_mjshuopo: '\uE08E\uE08F',
					mjs003_skill_mjshuopo_info:
						'出牌阶段限一次，你可以交给一名其他角色1张牌。然后烧毁其任意区域内与此牌花色相同的所有牌，若烧毁的牌>=3张，对其造成 1 点火焰伤害。',
					mjs003_skill_mjsjieyi: '\uE090\uE091',
					mjs003_skill_mjsjieyi_info: '当你打出手牌时，若你的手牌数全场最低，摸 1 张牌。',
					mjs003_skill_mjscaiju: '\uE082\uE083',
					mjs003_skill_mjscaiju_info:
						'当有角色造成伤害时，你可以添加一张【菊】到牌堆底，或者获得一张【菊】，你的【菊】不计入手牌上限。',
					mjs003_skill_mjsguiqv: '\uE084\uE085',
					mjs003_skill_mjsguiqv_info: '限定，你可以弃置牌，然后从任意位置获得所有【菊】，其他角色与你距离永久 + 1',
					mjs003_skill_mjstaohuayuan: '\uE086\uE087',
					mjs003_skill_mjstaohuayuan_info:
						'限定，你可以离开游戏，进入“桃花源”，本轮结束时返回。（在“桃花源”期间，每回合结束，你摸一张牌）',
					mjs003_skill_mjsxieshi: '\uE088\uE089',
					mjs003_skill_mjsxieshi_info: '士族。每轮结束时，获得士族牌堆中每种类型的牌各1张。',
					mjs003_skill_mjsshanshui: '\uE08A\uE08B',
					mjs003_skill_mjsshanshui_info: '当你打出牌的总点数等于13时，获得点数6和7的牌各1张；大于13时，重置此技能。',
					mjs003_skill_mjschitang: '\uE08C\uE08D',
					mjs003_skill_mjschitang_backup: '\uE08C\uE08D',
					mjs003_skill_mjschitang_info: '出牌阶段限1次，可以选择1个你手牌中没有的点数，选择并添加1张此点数的牌到你的手牌。'
				}
			},
			intro: '名将杀的复刻版本，有些技能在无名杀实现不了，但是进行了一下本土化调整，尽量原汁原味。<br>',
			author: '高山流水',
			diskURL: '',
			forumURL: '',
			version: '1.0'
		},
		files: {
			character: [],
			card: ['mjs003_card_mjs_chi.png'],
			skill: []
		}
	}
}

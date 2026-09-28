import fs from 'node:fs/promises';import path from 'node:path';import {createHash} from 'node:crypto';
const file='apps/core/extension/packs/名将杀/main/imported-characters.js',out='output/dynamic-remediation/20260926-r01/experience-r09',before=await fs.readFile(file);
await fs.mkdir(path.dirname(out+'/before/'+file),{recursive:true});await fs.writeFile(out+'/before/'+file,before,{flag:'wx'});
let s=before.toString().replaceAll('\r\n','\n');
const old1=`lib.card[name].content = function () {
							'step 0'
							if (lib.mjXueHasTag(cards && cards[0]) && !lib.mjXueNormal(player)) {
								event.content = lib.mjXueParsed[card.name]
							} else {
								event.content = lib.mjXueOrigParsed[card.name]
							}
							event.step = -1
						}`;
const next1=`lib.card[name].content = async function (event, trigger, player) {
							const { cards, card } = event
							const content = lib.mjXueHasTag(cards && cards[0]) && !lib.mjXueNormal(player)
								? lib.mjXueParsed[card.name] : lib.mjXueOrigParsed[card.name]
							// Dispatch the compiled body directly. The current compiler captures
							// its step array; changing event.content cannot replace that array.
							event.goto(0).updateStep()
							await content.call(this, event)
						}`;
if(!s.includes(old1))throw Error('xue wrapper changed');s=s.replace(old1,next1);
const a="lib.card[name].content = function () {\n\t\t\t\t\t\t\t'step 0'\n\t\t\t\t\t\t\tvar marked = false";
const b="lib.card[name].content = async function (event, trigger, player) {\n\t\t\t\t\t\t\tconst { cards, card } = event\n\t\t\t\t\t\t\tvar marked = false";
if(!s.includes(a))throw Error('qiang wrapper changed');s=s.replace(a,b);
const c="event.content = marked ? lib.mjQiangParsed[card.name] : lib.mjQiangOrigParsed[card.name]\n\t\t\t\t\t\t\tevent.step = -1";
if(!s.includes(c))throw Error('qiang dispatch changed');s=s.replace(c,"const content = marked ? lib.mjQiangParsed[card.name] : lib.mjQiangOrigParsed[card.name]\n\t\t\t\t\t\t\tevent.goto(0).updateStep()\n\t\t\t\t\t\t\tawait content.call(this, event)");
await fs.writeFile(file+'.r09.tmp',s);await fs.rename(file+'.r09.tmp',file);const sha=b=>createHash('sha256').update(b).digest('hex');await fs.writeFile(out+'/game-fix.json',JSON.stringify({file,beforeSHA256:sha(before),afterSHA256:sha(s),cause:'Legacy card content replacement and negative step incompatible with captured ArrayCompiler body'},null,2));

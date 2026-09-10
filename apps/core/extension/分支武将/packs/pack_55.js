// Extracted from mode/brawl.js; legacy startup and engine/UI patches are not executed.
export default function(lib, game, ui, get, ai, _status) {
return {
"skill": {
   							qianlidanji_phase:{
   								trigger:{global:'phaseBefore'},
   								forced:true,
   								silent:true,
   								firstDo:true,
   								content:function(){
   									player.removeSkill('qianlidanji_phase');
   									player.insertPhase();
   								},
   							},
   						},
"translate": {
   							pujing:'普净',
   							huban:'胡班',
   						}
};
}

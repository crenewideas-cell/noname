// Adapt the migrated CSS to current engine nodes without replacing game methods.
export async function mountVisuals(doc, base, data, parts, preview = false) {
 const body = doc.body;
 const previous = body.getAttribute("data-shousha-parts");
 body.dataset.shoushaParts = parts.join(" ");
 const links = [];
 for (const part of parts) {
  const file = data.cssFiles[part]; if (!file) continue;
  const link = doc.createElement("link"); link.rel="stylesheet"; link.href=base+file; doc.head.append(link); links.push(link);
 }
 const image = source => data.resources[source] ? `url("${base}${data.resources[source]}")` : "none";
 const ten="extension/十周年UI", hand="extension/手杀ui";
 const rules=[];
 const add=(part,selector,css)=>{if(parts.includes(part))rules.push(`${selector.split(",").map(s=>`body[data-shousha-parts]:not(.shousha-online) ${s}`).join(",")}{${css}}`);};
 add("arena","#window",`background-image:${image("image/background/1.jpg")};background-size:cover;background-position:center`);
 add("arena","#arena","background:transparent");
 for(const [source,file] of Object.entries(data.resources)) {
  const mode=source.match(/^extension\/如真似幻\/images\/mode\/([a-zA-Z0-9_-]+)\.jpg$/)?.[1];
  if(mode && mode!=="connect") {
   add("modes",`#splash [data-ui-mode="${mode}"] .lobby-art`,`content:url("${base}${file}")`);
   add("modes",`#splash [link="${mode}"]>.avatar`,`background-image:url("${base}${file}")`);
  }
 }
 add("players","#arena .player","width:120px;height:180px");
 add("players","#arena .player>.avatar","left:0;top:0;width:100%;height:100%;border-radius:8px;background-position:top");
 add("players","#arena .player>.name","z-index:5;left:5px;top:10px;font-size:20px;text-shadow:0 1px 3px black");
 add("players","#arena .player>.identity","z-index:6");
 add("players","#arena .player>.framebg",`display:block;pointer-events:none;inset:0;width:100%;height:100%;background-image:${image(ten+"/image/decoration/border.png")};background-size:100% 100%`);
 add("hp","#arena .player>.hp","z-index:5;left:auto;right:5px;bottom:8px;top:auto;width:14px;display:flex;flex-direction:column");
 add("hp","#arena .player>.hp>div","position:relative;margin:1px;width:12px;height:12px");
 add("buttons","#control .control",`background-image:${image(ten+"/assets/image/control_button.png")};background-color:transparent;background-size:100% 100%;border:0;box-shadow:none;color:#f5e4bc;min-height:38px`);
 add("buttons","#control .control>div","font-size:20px;padding:7px 18px;text-shadow:0 1px 3px #000");
 add("buttons","#control .control.disabled","filter:grayscale(1);opacity:.65");
 add("buttons","#system>div>div",`background-image:${image(ten+"/assets/image/control_button.png")};background-size:100% 100%;color:#f5e4bc;border:0`);
 add("menus","#window .dialog:not(.hidden)",`background-color:#201b16e8;border:1px solid #aa9061;border-radius:8px;color:#efdfbd`);
 add("menus",".menu,.menubg","background-color:#211e1bef;border-color:#aa9061;color:#efdfbd");
 add("menus","#window .button.character","border:1px solid #bca572;border-radius:5px;box-shadow:0 2px 8px #0009");
 add("cards","#window .card:not(.infohidden)","border-radius:7px;background-size:100% 100%");
 for(const [id,file] of Object.entries(data.cards)) {
  const selector=`#window .card[data-card-name="${id}"]:not(.infohidden):not(:empty)`;
  add("cards",selector,`background-image:url("${base}${file}")!important;background-size:100% 100%`);
  add("cards",selector+">.image","background-image:none!important");
 }
 add("cardback","#window .card.infohidden,#window .card:empty",`background-image:${image(ten+"/assets/image/cardstyle_back.png")}!important;background-size:100% 100%`);
 add("lines",".linexy",`background-image:${image(hand+"/line.png")};background-size:100% 100%`);
 const font=data.resources["extension/如真似幻/fonts/shousha.ttf"];
 if (parts.includes("fonts") && font) {
  rules.push(`@font-face{font-family:shousha-standard;src:url("${base}${font}");font-display:swap}`);
  add("fonts","#window,.menu","font-family:shousha-standard,serif");
 }
 const style=doc.createElement("style");style.textContent=rules.join("\n");doc.head.append(style);links.push(style);
 style.textContent += `.ss-settlement{position:fixed;inset:0;z-index:10000;background:#090706cc;display:flex;align-items:center;justify-content:center;color:#f2dfb3;font:18px shousha-standard,serif;backdrop-filter:blur(5px)}.ss-settlement-panel{position:relative;width:min(780px,90vw);max-height:88vh;overflow:auto;text-align:center;background:#241c16ed;border:2px solid #ad8d53;border-radius:8px;padding:20px}.ss-settlement-panel>img{position:relative;width:220px;max-height:130px;object-fit:contain}.ss-settlement table{position:relative;width:100%;border-collapse:collapse;margin:12px 0}.ss-settlement td,.ss-settlement th{padding:9px;border-bottom:1px solid #bda16a44}.ss-settlement button{position:relative;padding:12px 22px;background:#665031;color:#ffe9b8;border:1px solid #bda16a;border-radius:6px;cursor:pointer}`;
 // The online room is deliberately outside the migrated appearance.
 const update=()=>body.classList.toggle("shousha-online",!!doc.querySelector(".online-lobby,.online-dialog,.session-entry.online-visible"));
 let observer;
 if (!preview) {observer=new MutationObserver(update);observer.observe(body,{childList:true,subtree:true});update();}
 return ()=>{observer?.disconnect();links.forEach(link=>link.remove());body.classList.remove("shousha-online");if(previous===null)body.removeAttribute("data-shousha-parts");else body.setAttribute("data-shousha-parts",previous);};
}

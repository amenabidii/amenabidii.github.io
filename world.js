// Two doors at the north end of each room. The southern arch leads back.
const rooms = {
 queue:["The referral rush","Get past the wasta queue-jumpers and take both proofs to the interview desk in the east.","#contact","Studio","studio","Atrium","atrium","#ebb17f"],
 atrium:["The atrium","Help Amen earn a software position. Start north-west at Work, then take your evidence to the code lab.","#research","Work","work","Campus","campus","#6de9cd"],
 work:["Amen’s office","At a library printer, a file on a phone needed a way onto a shared PC. Fly-QR grew out of that small frustration.","#project-0","Research","research","Studio","studio","#86ceff"],
 campus:["Campus commons","As a peer moderator, Amen co-guided 49 incoming AUC students. Two doors lead beyond orientation.","#campus","Fieldwork","field","Music","music","#efc77c"],
 research:["Research lab","A team led by Amen explored sleep, stress, memory and reaction time across 80,000 records.","#project-5","Studio","studio","Atrium","atrium","#baacff"],
 studio:["Night-shift code lab","Turn back the clock in The Observer Paradox and the observer still remembers. Try that mechanic in the project gallery.","#project-4","Workshop","work","Hiring","queue","#ec98ad"],
 field:["Kasserine field station","More than 240 young people contributed to climate research. Amen co-led a petition that gathered over 400 signatures.","#activism","Music","music","Atrium","atrium","#a7e8a4"],
 music:["Bedroom & piano","Amen played piano at more than 15 university events with AUC Musicana. Approach the upright piano to hear G Minor Bach from Piano Tiles 2.","#piano","Fieldwork","field","Campus","campus","#ffb1a0"]
};
const canvas=document.querySelector("#world-canvas");
const ctx=canvas.getContext("2d");
const stage=canvas.parentElement;
const hero=new Image();
hero.src="little-amen.svg";
let room="atrium", x=176,y=174,started=false,muted=false,context,musicTimer,melodyStep=0;
const visited=new Set();
const trail=[];
let roomAction="",currentItem=null;
let cameraX=0,cameraY=0;
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const notice=document.querySelector("#world-toast");
function notifyWorld(text){notice.textContent=text;notice.hidden=!text;}

function block(a,b,w,h,color){ctx.fillStyle=color;ctx.fillRect(a,b,w,h);}
function door(centerX,label,accent){
 const a=centerX-16;
 block(a+1,3,30,44,"#07121e");block(a+3,6,26,38,accent);block(a+6,10,20,34,"#192b3c");block(a+9,14,14,24,"#0b1827");block(a+20,27,3,3,accent);
 ctx.font="bold 9px monospace";ctx.textAlign="center";const w=ctx.measureText(label).width;
 block(a+16-w/2-3,45,w+6,12,"#0a1621");ctx.fillStyle=accent;ctx.fillText(label,a+16,54);
}
function paint(){
 const accent=rooms[room][7];
 cameraX=clamp(x-canvas.width/2,0,mapWidth-canvas.width);
 cameraY=clamp(y-canvas.height/2,0,mapHeight-canvas.height);
 ctx.save();ctx.translate(-Math.round(cameraX),-Math.round(cameraY));
 sceneArt();drawAtmosphere();
 door(westDoorX,rooms[room][3],accent);door(eastDoorX,rooms[room][5],accent);
 if(trail.length){block(backDoorX-14,mapHeight-26,28,25,"#081722");ctx.fillStyle=accent;ctx.font="bold 10px monospace";ctx.textAlign="center";ctx.fillText("BACK",backDoorX,mapHeight-9);}
 const drawHero=()=>{
   block(x-9,y-2,19,4,"#152932");
   if(hero.complete&&hero.naturalWidth)ctx.drawImage(hero,Math.round(x)-13,Math.round(y)-30-Math.round(Math.abs(Math.sin(stride/6))*2),26,32);
 };
 let drawn=false;
 for(const item of [...furniture[room]].sort((a,b)=>(a[2]+a[4])-(b[2]+b[4]))){
   if(!drawn&&item[2]+item[4]>y){drawHero();drawn=true;}
   drawFurniture(item);
 }
 if(!drawn)drawHero();
 ctx.restore();
 // The pocket map marks the player, both exits, and the current camera window.
 block(268,5,79,45,"#08121ce6");
 ctx.strokeStyle="#557480";ctx.strokeRect(270+cameraX*(74/mapWidth),7+cameraY*(40/mapHeight),canvas.width*(74/mapWidth),canvas.height*(40/mapHeight));
 for(const px of [westDoorX,eastDoorX])block(270+px*(74/mapWidth),11,3,3,accent);
 block(270+x*(74/mapWidth),7+y*(40/mapHeight),4,4,"#fff3ba");
 const item=nearby(),button=document.querySelector("#inspect");
 if(started&&item!==currentItem){
   currentItem=item;
   const atPiano=item?.[0]==="piano";
   if(atPiano!==bachActive){bachActive=atPiano;music();}
   notifyWorld(item ? (item[0]==="piano"?"♪ G Minor Bach · Piano Tiles 2":(item[5]||item[0])+" nearby") : "");
 }
 button.hidden=!started||!item;
 button.disabled=!item;
 button.textContent=item?"Inspect · "+(item[5]||item[0]):"Inspect nearby object";
}
hero.onload=paint;
function tone(freq,duration,volume,type="triangle"){
 if(muted||document.hidden||!context||context.state!=="running")return;
 const osc=context.createOscillator(),gain=context.createGain(),t=context.currentTime;
 osc.type=type;osc.frequency.value=freq;gain.gain.setValueAtTime(.001,t);
 gain.gain.exponentialRampToValueAtTime(volume,t+.012);gain.gain.exponentialRampToValueAtTime(.001,t+duration);
 osc.connect(gain).connect(context.destination);osc.start(t);osc.stop(t+duration+.01);
 osc.onended=()=>{osc.disconnect();gain.disconnect();};
}
function enter(id,back=false){
 if(!back && id!==room)trail.push(room);
 roomAction="";room=id;bachActive=false;currentItem=null;notifyWorld("");visited.add(room); x=backDoorX;y=mapHeight-86;
 if(room==="queue"){checkpoint=45;resetQueue();}
 const [name,note,url]=rooms[room];
 document.querySelector("#room-name").textContent=name;
 document.querySelector("#room-note").textContent=note;
 const link=document.querySelector("#room-link");link.hidden=false;link.href=url;
 link.onclick=()=>{const target=document.querySelector(url);if(target?.tagName==="DETAILS")target.open=true;};
 updateQuestLabel();music();
 tone(523,.22,.09);paint();
}
const directions={ArrowUp:"up",w:"up",ArrowLeft:"left",a:"left",ArrowDown:"down",s:"down",ArrowRight:"right",d:"right"};
const held=new Map();
let frame=0,previous=0,stride=0;
let stick=null;
function clearMovement(){stick=null;held.clear();cancelAnimationFrame(frame);frame=0;previous=0;paint();}
function nearby(){
 let closest=null,best=23;
 for(const item of furniture[room]){
   
   const [,a,b,w,h]=item;
   const d=Math.hypot(Math.max(a-x,0,x-a-w),Math.max(b+h*.55-y,0,y-b-h));
   if(d<best){best=d;closest=item;}
 }
 return closest;
}
function inspect(){
 const item=nearby();if(!item)return;
 roomAction=item[5]||item[0];notifyWorld(item[6]||("A "+item[0]+" in "+rooms[room][0]+"."));
 if(item[0]!=="piano")tone(392,.12,.07);
 award(item);
 paint();
}
document.querySelector("#inspect").onclick=inspect;
function canStand(px,py){
 return px>=14&&px<=mapWidth-14&&py>=44&&py<=mapHeight-12&&!furniture[room].some(([,a,b,w,h])=>
   px>a-5&&px<a+w+5&&py>b+h*.60-2&&py<b+h+2);
}
function advance(dx,dy){
 if(canStand(x+dx,y))x+=dx;
 if(canStand(x,y+dy))y+=dy;
 if(y<=49&&(Math.abs(x-westDoorX)<14||Math.abs(x-eastDoorX)<14)){enter(rooms[room][x<backDoorX?4:6]);clearMovement();return;}
 if(trail.length&&y>=mapHeight-23&&Math.abs(x-backDoorX)<15){enter(trail.pop(),true);clearMovement();}
}
function walk(now){
 const dt=previous?Math.min((now-previous)/1000,.04):1/60;
 previous=now;
 const active=new Set(held.values());
 const dx=stick?.dx || Number(active.has("right"))-Number(active.has("left"));
 const dy=stick?.dy || Number(active.has("down"))-Number(active.has("up"));
 const length=Math.hypot(dx,dy);
 if(length){
   const ox=x,oy=y;
   advance(dx/length*116*dt,dy/length*116*dt);
   if(held.size||stick)stride+=Math.hypot(x-ox,y-oy);
   paint();
 }
 if(room==="queue"&&!offer){chase(dt,now);paint();}
 if(held.size||stick||(room==="queue"&&!offer&&!document.hidden))frame=requestAnimationFrame(walk);
 else {frame=0;previous=0;}
}
function hold(key,dir){
 held.set(key,dir);
 if(!frame)frame=requestAnimationFrame(walk);
}
document.querySelector("#world-start").onclick=()=>{
 started=true;document.querySelector("#world-intro").hidden=true;document.querySelector(".world-panel").hidden=false;
 try{context=new AudioContext();context.resume().catch(()=>{});}catch{}
 enter("atrium");resizeWorld(true);stage.focus({preventScroll:true});
};
stage.onkeydown=e=>{
 if(started&&e.key.toLowerCase()==="e"){e.preventDefault();if(!e.repeat)inspect();return;}
 const dir=directions[e.key]||directions[e.key.toLowerCase()];
 if(started&&dir){e.preventDefault();hold(e.code,dir);}
};
window.addEventListener("keyup",e=>held.delete(e.code));
stage.addEventListener("blur",clearMovement);
window.addEventListener("blur",clearMovement);
document.addEventListener("visibilitychange",()=>{if(document.hidden)clearMovement();});
document.querySelectorAll("[data-dir]").forEach(button=>{
 button.onpointerdown=e=>{e.preventDefault();button.setPointerCapture(e.pointerId);hold(e.pointerId,button.dataset.dir);};
 button.onlostpointercapture=e=>held.delete(e.pointerId);
 button.onclick=e=>{if(e.detail===0){hold("tap",button.dataset.dir);setTimeout(()=>held.delete("tap"),100);}};
});
document.querySelector("#world-mute").onclick=e=>{
 muted=!muted;e.currentTarget.setAttribute("aria-pressed",String(muted));e.currentTarget.textContent=muted?"Enable audio":"Mute audio";
 if(context){(muted?context.suspend():context.resume()).catch(()=>{});}music();
};
document.addEventListener("visibilitychange",()=>{
 music();if(!document.hidden&&room==="queue"&&!offer&&!frame)frame=requestAnimationFrame(walk);
});
stage.addEventListener("focus",()=>{if(room==="queue"&&!offer&&!frame)frame=requestAnimationFrame(walk);});
paint();
const cursorEffects=matchMedia("(hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)");
document.addEventListener("pointermove",event=>{
 if(!cursorEffects.matches)return;
 document.body.style.setProperty("--mx",event.clientX+"px");
 document.body.style.setProperty("--my",event.clientY+"px");
},{passive:true});

canvas.onpointerdown=e=>{
 if(!started||stick)return;
 stage.focus({preventScroll:true});
 canvas.setPointerCapture(e.pointerId);
 stick={id:e.pointerId,startX:e.clientX,startY:e.clientY,dx:0,dy:0};
 if(!frame)frame=requestAnimationFrame(walk);
};
canvas.onpointermove=e=>{
 if(stick?.id!==e.pointerId)return;
 const dx=e.clientX-stick.startX,dy=e.clientY-stick.startY;
 const length=Math.hypot(dx,dy);
 stick.dx=length>4?dx/length:0;
 stick.dy=length>4?dy/length:0;
};
canvas.onlostpointercapture=e=>{if(stick?.id===e.pointerId)stick=null;};
const expandWorld=document.querySelector("#expand-world");
function resizeWorld(expanded){
 document.querySelector("#lab").classList.toggle("expanded",expanded);
 expandWorld.setAttribute("aria-pressed",String(expanded));
 expandWorld.textContent=expanded?"Exit wide view":"Expand game";
 if(started)stage.focus({preventScroll:true});
}
expandWorld.onclick=()=>resizeWorld(expandWorld.getAttribute("aria-pressed")!=="true");
window.addEventListener("keydown",event=>{if(event.key==="Escape"&&expandWorld.getAttribute("aria-pressed")==="true")resizeWorld(false);});

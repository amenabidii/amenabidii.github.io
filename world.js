// Two doors at the north end of each room. The southern arch leads back.
const rooms = {
 atrium:["The atrium","Choose Work or Campus. Explore six rooms to fill your field journal.","#research","Work","work","Campus","campus","#6de9cd"],
 work:["The workshop","At a library printer, a file on a phone needed a way onto a shared PC. Fly-QR grew out of that small frustration.","#project-0","Research","research","Studio","studio","#86ceff"],
 campus:["Campus commons","As a peer moderator, Amen co-guided 49 incoming AUC students. Two doors lead beyond orientation.","#campus","Fieldwork","field","Music","music","#efc77c"],
 research:["Research lab","A team led by Amen explored sleep, stress, memory and reaction time across 80,000 records.","#project-5","Studio","studio","Atrium","atrium","#baacff"],
 studio:["Prototype studio","Turn back the clock in The Observer Paradox and the observer still remembers. Try that mechanic in the project gallery.","#project-4","Workshop","work","Research","research","#ec98ad"],
 field:["Kasserine field station","More than 240 young people contributed to climate research. Amen co-led a petition that gathered over 400 signatures.","#activism","Music","music","Atrium","atrium","#a7e8a4"],
 music:["Music room","Amen played piano at more than 15 university events with AUC Musicana. The melody here is an original game loop.","#piano","Fieldwork","field","Campus","campus","#ffb1a0"]
};
const canvas=document.querySelector("#world-canvas");
const ctx=canvas.getContext("2d");
const stage=canvas.parentElement;
const hero=new Image();
hero.src="little-amen.svg";
let room="atrium", x=176,y=174,started=false,muted=false,context,musicTimer,melodyStep=0;
const visited=new Set();
const trail=[];
const walls={
 atrium:[[3,2],[3,3],[7,2],[7,3],[5,4]],work:[[3,3],[4,3],[7,4]],campus:[[3,4],[7,3],[6,3]],
 research:[[2,3],[3,3],[6,4],[7,4]],studio:[[4,3],[6,3],[7,3]],field:[[2,4],[3,4],[7,3]],music:[[3,3],[4,3],[7,4]]
};
function block(a,b,w,h,color){ctx.fillStyle=color;ctx.fillRect(a,b,w,h);}
function door(tileX,label,accent){
 const a=tileX*32;
 block(a+1,3,30,44,"#07121e");block(a+3,6,26,38,accent);block(a+6,10,20,34,"#192b3c");block(a+9,14,14,24,"#0b1827");block(a+20,27,3,3,accent);
 ctx.font="bold 9px monospace";ctx.textAlign="center";const w=ctx.measureText(label).width;
 block(a+16-w/2-3,45,w+6,12,"#0a1621");ctx.fillStyle=accent;ctx.fillText(label,a+16,54);
}
function prop(a,b,color){
 block(a+1,b+17,30,12,"#0b1924");
 if(room==="field"||room==="campus"||room==="atrium"){
  block(a+10,b+16,14,12,"#925e4a");block(a+15,b+5,3,15,"#a6c67b");
  block(a+5,b+6,12,8,"#477d65");block(a+17,b+2,10,9,"#76ad83");
 }else{
  block(a+2,b+7,28,18,"#31475a");block(a+3,b+4,25,14,color);
  if(room==="music"){for(let i=0;i<7;i++)block(a+4+3*i,b+7,2,8,"#152431");}
  else{block(a+6,b+7,19,7,"#1a3443");block(a+8,b+10,10,1,color);}
 }
}
function paint(){
 const accent=rooms[room][7];
 for(let row=0;row<7;row++)for(let col=0;col<11;col++){
  const a=col*32,b=row*32,border=col===0||col===10||row===0||row===6;
  block(a,b,32,32,border?"#182e40":((row+col)%2?"#263c49":"#2a414c"));
  block(a,b,32,1,border?"#486476":"#334d55");block(a,b,1,32,"#203540");
  if(border){block(a+2,b+16,28,2,"#101f30");block(a+14,b+1,2,14,"#102332");}
  else{block(a+8,b+19,5,1,"#37515b");block(a+22,b+7,2,1,"#405862");}
 }
 door(2,rooms[room][3],accent);door(8,rooms[room][5],accent);
 for(const [col,row] of walls[room])prop(col*32,row*32,accent);
 if(trail.length){block(5*32+2,194,28,25,"#081722");ctx.fillStyle=accent;ctx.font="bold 10px monospace";ctx.textAlign="center";ctx.fillText("BACK",176,211);}
 block(x-9,y-2,19,4,"#152932");
 if(hero.complete&&hero.naturalWidth)ctx.drawImage(hero,Math.round(x)-13,Math.round(y)-30-Math.round(Math.abs(Math.sin(stride/6))*2),26,32);
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
const melody=[220,0,330,392,0,294,262,0,196,0,294,330,0,262,247,0];
function music(){
 clearInterval(musicTimer);
 if(!muted && !document.hidden && started)musicTimer=setInterval(()=>{
  const note=melody[melodyStep++%melody.length];if(note)tone(note,.3,.035,"sine");
 },350);
}
function enter(id,back=false){
 if(!back && id!==room)trail.push(room);
 room=id; visited.add(room); x=176;y=174;
 const [name,note,url]=rooms[room];
 document.querySelector("#room-name").textContent=name;
 document.querySelector("#room-note").textContent=note;
 const link=document.querySelector("#room-link");link.hidden=false;link.href=url;
 link.onclick=()=>{const target=document.querySelector(url);if(target?.tagName==="DETAILS")target.open=true;};
 document.querySelector("#world-count").textContent=visited.size===7?"JOURNAL COMPLETE":visited.size+" / 7 ROOMS";
 tone(523,.22,.09);paint();
}
const directions={ArrowUp:"up",w:"up",ArrowLeft:"left",a:"left",ArrowDown:"down",s:"down",ArrowRight:"right",d:"right"};
const held=new Map();
let frame=0,previous=0,stride=0;
function clearMovement(){held.clear();cancelAnimationFrame(frame);frame=0;previous=0;paint();}
function canStand(px,py){
 return px>=17 && px<=335 && py>=44 && py<=207 &&
 !walls[room].some(([a,b])=>px>a*32-5&&px<a*32+35&&py>b*32+8&&py<b*32+32);
}
function advance(dx,dy){
 if(canStand(x+dx,y))x+=dx;
 if(canStand(x,y+dy))y+=dy;
 if(y<=49&&(Math.abs(x-80)<14||Math.abs(x-272)<14)){enter(rooms[room][x<176?4:6]);clearMovement();return;}
 if(trail.length&&y>=200&&Math.abs(x-176)<15){enter(trail.pop(),true);clearMovement();}
}
function walk(now){
 const dt=previous?Math.min((now-previous)/1000,.04):1/60;
 previous=now;
 const active=new Set(held.values());
 const dx=Number(active.has("right"))-Number(active.has("left"));
 const dy=Number(active.has("down"))-Number(active.has("up"));
 const length=Math.hypot(dx,dy);
 if(length){
   const ox=x,oy=y;
   advance(dx/length*98*dt,dy/length*98*dt);
   if(held.size)stride+=Math.hypot(x-ox,y-oy);
   paint();
 }
 if(held.size)frame=requestAnimationFrame(walk);
 else {frame=0;previous=0;}
}
function hold(key,dir){
 held.set(key,dir);
 if(!frame)frame=requestAnimationFrame(walk);
}
document.querySelector("#world-start").onclick=()=>{
 started=true;document.querySelector("#world-intro").hidden=true;document.querySelector(".world-panel").hidden=false;
 try{context=new AudioContext();context.resume().catch(()=>{});}catch{}
 enter("atrium");music();stage.focus({preventScroll:true});
};
stage.onkeydown=e=>{
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
document.addEventListener("visibilitychange",music);
paint();
const cursorEffects=matchMedia("(hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)");
document.addEventListener("pointermove",event=>{
 if(!cursorEffects.matches)return;
 document.body.style.setProperty("--mx",event.clientX+"px");
 document.body.style.setProperty("--my",event.clientY+"px");
},{passive:true});

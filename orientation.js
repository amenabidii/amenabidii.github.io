// Characters stay in the orientation room between visits.
const orientationPeople=[
 ["Haitham",277,221,"#dea263"],["Jana",331,222,"#c6a1e7"],
 ["Student A",90,202,"#81d2bd"],["Student B",220,107,"#9cc7fb"],
 ["Student C",365,262,"#e4b2af"],["Student D",480,145,"#d8d88b"]
].map(([name,px,py,color],i)=>({
 item:["person",px-5,py-12,10,12,name],color,mode:i<2?"follow":"wander",
 homeX:px,homeY:py,phase:i*1.7
}));
const dancePad=["dance",67,249,83,32,"Dance floor"];
let danceUntil=0;
rooms.memory4[1]="Haitham and Jana start with you. Inspect a person to invite them along or ask them to wait. Bring your group to the dance floor and press E.";
function orientationAction(item){
 if(room!=="memory4")return false;
 if(item===dancePad){
   danceUntil=performance.now()+6500;
   notifyWorld("Orientation icebreaker · Dance together!");
   tone(523,.18,.05);return true;
 }
 const person=orientationPeople.find(p=>p.item===item);
 if(!person)return false;
 person.mode=person.mode==="follow"?"wait":"follow";
 notifyWorld(item[5]+(person.mode==="follow"?" joined your group.":" will wait here."));
 return true;
}
function orientationTick(dt,now){
 if(room!=="memory4"||document.hidden||!document.querySelector("#memory-choice").hidden)return;
 let leaderX=x,leaderY=y;
 for(const person of orientationPeople){
   const item=person.item,px=item[1]+5,py=item[2]+12;
   let tx=px,ty=py;
   if(person.mode==="follow"){
     const distance=Math.hypot(leaderX-px,leaderY-py);
     if(distance>19){tx=leaderX;ty=leaderY;}
     leaderX=px;leaderY=py;
   }else if(person.mode==="wander"){
     tx=person.homeX+18*Math.sin(now/1900+person.phase);
     ty=person.homeY+10*Math.cos(now/2200+person.phase);
   }
   const dx=tx-px,dy=ty-py,step=Math.min(1,dt*125/(Math.hypot(dx,dy)||1));
   if(canStand(px+dx*step,py))item[1]+=dx*step;
   if(canStand(px,py+dy*step))item[2]+=dy*step;
 }
 paint();
}
function drawOrientationFloor(){
 if(room!=="memory4")return;
 const [,px,py,w,h]=dancePad;
 for(let i=0;i<6;i++)for(let j=0;j<3;j++)block(px+i*w/6,py+j*h/3,w/6-1,h/3-1,(i+j)%2?"#536b81":"#816785");
 ctx.fillStyle="#fff";ctx.textAlign="center";ctx.font="bold 8px monospace";ctx.fillText("DANCE FLOOR",px+w/2,py+h/2+3);
}
function drawOrientationPeople(){
 if(room!=="memory4")return;
 for(const p of orientationPeople){
   const item=p.item,px=Math.round(item[1]+5),dancing=p.mode==="follow"&&performance.now()<danceUntil;
   const bounce=dancing?Math.round(3*Math.sin(performance.now()/130+p.phase)):0,py=Math.round(item[2]+12)+bounce;
   block(px-4,py-18,8,6,"#cf9e7c");block(px-4,py-20,8,3,"#41332f");
   block(px-5,py-12,10,9,p.color);block(px-7,py-10-bounce,3,4,p.color);block(px+4,py-10+bounce,3,4,p.color);
   block(px-4,py-3,3,4,"#162532");block(px+1,py-3,3,4,"#162532");
   ctx.textAlign="center";ctx.font="bold 8px monospace";ctx.fillStyle="#fff";ctx.fillText(item[5],px,py-23);
 }
}

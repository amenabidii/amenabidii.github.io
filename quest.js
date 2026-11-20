const scores={
 atrium:[340,"sine",[57,64,69,0,67,64,62,0]],
 work:[220,"triangle",[50,57,62,0,64,57,66,62]],
 campus:[310,"sine",[60,64,67,72,0,69,67,64]],
 research:[285,"sine",[54,61,66,73,0,68,61,0]],
 studio:[160,"square",[40,0,52,47,0,50,43,0]],
 field:[410,"triangle",[62,69,65,0,67,64,62,0]],
 music:[490,"sine",[55,62,67,70,0,65,62,0]],
 queue:[175,"triangle",[43,43,0,50,46,0,49,48]]
};
let bachActive=false;
function music(){
 clearTimeout(musicTimer);melodyStep=0;
 syncPiano(bachActive&&!muted&&!document.hidden&&started);
 function next(){
   if(muted||document.hidden||!started||bachActive)return;
   const [pulse,voice,notes]=scores[room],pitch=notes[melodyStep%notes.length];
   if(pitch)tone(440*2**((pitch-69)/12),pulse*.00091,voice==="square"?.014:.045,voice);
   melodyStep++;musicTimer=setTimeout(next,pulse);
 }
 next();
}
const evidence=new Set();
let offer=false, agents=[],checkpoint=45, catchGrace=0;
function resetQueue(){
 x=checkpoint;y=186;
 agents=[{x:226,y:81,pace:34},{x:340,y:255,pace:39},{x:480,y:102,pace:34}];
 catchGrace=performance.now()+1400;
}
function objective(){
 if(offer)return "Position secured";
 if(!evidence.has("project"))return "Work → inspect the printer";
 if(!evidence.has("debug"))return "Studio → inspect the green console";
 return room==="queue"?"Reach the interview desk →":"Studio → enter Hiring";
}
function updateQuestLabel(){document.querySelector("#world-count").textContent=objective();}
function award(item){
 if(room==="work"&&item[0]==="printer"){evidence.add("project");notifyWorld("Project evidence collected. Next: Studio → green console.");}
 if(room==="studio"&&item[0]==="terminal"){evidence.add("debug");notifyWorld("Build verified. Bring both proofs through the Hiring door.");}
 if(room==="queue"&&item[5]==="Interview desk"){
   if(evidence.size===2){offer=true;agents=[];notifyWorld("Offer signed! You helped Amen secure the software position.");tone(659,.5,.12);}
   else notifyWorld("The interview needs both proofs. "+objective()+".");
 }
 updateQuestLabel();
}
function chase(dt,now){
 if(room!=="queue"||offer||document.hidden)return;
 if(x>mapWidth/2&&checkpoint===45){checkpoint=mapWidth/2+4;notifyWorld("Shortlisted! Retry checkpoint reached.");}
 for(const agent of agents){
   const dist=Math.hypot(x-agent.x,y-agent.y);
   if(dist<13&&now>catchGrace){resetQueue();notifyWorld("A wasta referral jumped the line. Try another aisle — your evidence is safe.");return;}
   if(!dist)continue;
   const dx=(x-agent.x)*agent.pace*dt/dist,dy=(y-agent.y)*agent.pace*dt/dist;
   if(canStand(agent.x+dx,agent.y))agent.x+=dx;
   if(canStand(agent.x,agent.y+dy))agent.y+=dy;
 }
}
function drawAtmosphere(){
 if(room==="studio"){
   block(112,50,326,45,"#091c1c");
   ctx.font="7px monospace";ctx.textAlign="left";
   const lines=["SYS.MON  /  NIGHT BUILD","TRACE  >  SIGNAL FOUND","CHECK  >  TESTS PASS","BUILD  >  READY"];
   for(let i=0;i<4;i++){ctx.fillStyle=i===3?"#a7ffe2":"#56aa81";ctx.fillText(lines[i],119,61+i*9);}
   for(let i=0;i<40;i++){const h=4+Math.abs(Math.sin(i*.9+performance.now()/1200))*29;block(274+i*3.8,89-h,2,h,"#398e72");}
 }
 if(room==="queue"){
   ctx.font="bold 10px monospace";ctx.fillStyle="#ffe79a";ctx.textAlign="left";ctx.fillText("INTERVIEWS  →",mapWidth-190,191);
   for(const a of agents){
     block(a.x-6,a.y-18,12,13,"#69394d");block(a.x-4,a.y-26,8,8,"#d0a481");block(a.x-6,a.y-28,11,4,"#322b39");
     block(a.x-5,a.y-6,3,6,"#1a2531");block(a.x+2,a.y-6,3,6,"#1a2531");block(a.x+5,a.y-10,7,6,"#af754f");
     ctx.font="7px monospace";ctx.textAlign="center";ctx.fillStyle="#ffd6ae";ctx.fillText("WASTA",a.x,a.y-31);
   }
 }
}

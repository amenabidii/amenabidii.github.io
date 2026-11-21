const songScores=new Map();
let songSession=null;

// Note onsets and durations are stored in hundredths of a second.
function playSong(name){
 if(songSession?.name===name)return;
 if(songSession){
   clearTimeout(songSession.timer);
   songSession.bus.disconnect();
   songSession=null;
 }
 if(!name||!context)return;
 const bus=context.createGain();
 bus.gain.value=.82;bus.connect(context.destination);
 const session={name,bus,timer:0};songSession=session;
 if(!songScores.has(name)){
   songScores.set(name,fetch(name+"-notes.json").then(response=>{
     if(!response.ok)throw Error("Score unavailable");
     return response.json();
   }));
 }
 songScores.get(name).then(score=>{
   if(songSession!==session)return;
   const start=context.currentTime+.055;
   let index=0;
   function schedule(){
     if(songSession!==session)return;
     const now=context.currentTime;
     while(index<score.notes.length){
       const [tick,pitch,length,strength]=score.notes[index];
       const time=start+tick/100;
       if(time>now+.16)break;
       index++;
       if(time+.1<now)continue;
       const frequency=440*2**((pitch-69)/12);
       const delay=Math.max(0,time-now);
       const duration=length/100+.04;
       const level=.07*strength/100;
       tone(frequency,duration,level,"triangle",delay,bus);
       if(name==="bella")tone(frequency*2,Math.min(.11,duration),level*.28,"sine",delay,bus);
       else if(pitch<63)tone(frequency, duration,level*.36,"sine",delay,bus);
     }
     if(index<score.notes.length)session.timer=setTimeout(schedule,60);
   }
   schedule();
 }).catch(()=>{
   songScores.delete(name);
   if(songSession===session){playSong(null);notifyWorld("The score could not load. Approach the instrument again to retry.");}
 });
}

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
   // First sung hook of the official Bella clip, at 00:52.98.
   const cue=name==="bella"?5298:0;
   const start=context.currentTime+.055-cue/100;
   let index=score.notes.findIndex(note=>note[0]>=cue);
   if(index<0)return;
   let percussionStep=0;
   const eighth=60/105/2;
   function percussion(time,step){
     const delay=Math.max(0,time-context.currentTime);
     if(step%4===0)tone(90,.11,.067,"sine",delay,bus);
     if(step%4===2||step%8===7){
       const length=.055,buffer=context.createBuffer(1,Math.ceil(context.sampleRate*length),context.sampleRate);
       const samples=buffer.getChannelData(0);
       for(let i=0;i<samples.length;i++)samples[i]=(Math.random()*2-1)*Math.exp(-6*i/samples.length);
       const hit=context.createBufferSource(),filter=context.createBiquadFilter(),gain=context.createGain();
       filter.type="highpass";filter.frequency.value=1300;gain.gain.value=step%8===7?.045:.09;
       hit.buffer=buffer;hit.connect(filter).connect(gain).connect(bus);hit.start(time);
       hit.onended=()=>{hit.disconnect();filter.disconnect();gain.disconnect();};
     }
   }
   function schedule(){
     if(songSession!==session)return;
     const now=context.currentTime;
     if(name==="bella"){
       let time=start+cue/100+percussionStep*eighth;
       while(time<=now+.16&&time<start+score.duration/100){
         if(time>=now-.05)percussion(Math.max(now,time),percussionStep);
         percussionStep++;time=start+cue/100+percussionStep*eighth;
       }
     }
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
       if(name==="bella"){
         tone(frequency*2,Math.min(.11,duration),level*.28,"sine",delay,bus);
         if(pitch<=52)tone(frequency,Math.min(duration,.48),level*.85,"sine",delay,bus);
       }
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

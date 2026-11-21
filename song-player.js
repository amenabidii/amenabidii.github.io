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
     if(name==="flamenco"){
       let time=start+percussionStep*eighth;
       while(time<=now+.16&&time<start+score.duration/100){
         if(time>=now-.05)percussion(Math.max(now,time),percussionStep);
         percussionStep++;time=start+percussionStep*eighth;
       }
     }
     while(index<score.notes.length){
       const [tick,pitch,length,strength,voice]=score.notes[index];
       const time=start+tick/100;
       if(time>now+.16)break;
       index++;
       if(time+.1<now)continue;
       const frequency=440*2**((pitch-69)/12);
       const delay=Math.max(0,time-now);
       const duration=length/100+.04;
       const level=.07*strength/100;
       if(voice){
         if(voice==="cymbal"){
           const buffer=context.createBuffer(1,Math.ceil(context.sampleRate*duration),context.sampleRate);
           const samples=buffer.getChannelData(0);
           for(let i=0;i<samples.length;i++)samples[i]=(Math.random()*2-1)*Math.exp(-7*i/samples.length);
           const source=context.createBufferSource(),filter=context.createBiquadFilter(),gain=context.createGain();
           source.buffer=buffer;filter.type="highpass";filter.frequency.value=4500;gain.gain.value=level;
           source.connect(filter).connect(gain).connect(bus);source.start(now+delay);
           source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect();};
         }else{
           const sustained=["strings","horn","bass"].includes(voice);
           const osc=context.createOscillator(),gain=context.createGain(),onset=context.currentTime+delay;
           osc.type=voice==="tom"||voice==="bass"?"sine":"triangle";
           osc.frequency.setValueAtTime(frequency,onset);
           if(voice==="tom")osc.frequency.exponentialRampToValueAtTime(frequency*.53,onset+duration);
           gain.gain.setValueAtTime(.0001,onset);
           gain.gain.exponentialRampToValueAtTime(level,onset+(sustained?.09:.008));
           if(sustained)gain.gain.setValueAtTime(level*.82,onset+duration-.1);
           gain.gain.exponentialRampToValueAtTime(.0001,onset+duration);
           osc.connect(gain).connect(bus);osc.start(onset);osc.stop(onset+duration);
           osc.onended=()=>{osc.disconnect();gain.disconnect();};
         }
         continue;
       }
       tone(frequency,duration,level,"triangle",delay,bus);
       if(name==="flamenco"){
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

// Find the missing soundcheck notes, then play them back at the bedroom desk.
const soundcheckStops=[
 ["work",115,250,"C",262],["research",480,265,"E",330],["campus",85,255,"G",392]
];
const collectedNotes=new Set();
let soundcheckComplete=false;
for(const [location,px,py,note] of soundcheckStops)
 furniture[location].push(["songnote",px,py,20,26,"Lost note "+note]);
const mixer=["mixer",460,132,46,29,"Soundcheck mixer"];
furniture.music.push(mixer);
rooms.music[1]+=" Three soundcheck notes are missing. Visit the mixer for clues.";
function drawSoundcheck(item){
 const [kind,a,b,w,h]=item;
 if(kind==="songnote"){
   const found=collectedNotes.has(room);
   block(a,b,w,h,found?"#324552":"#413358");block(a+2,b+2,w-4,2,found?"#597176":"#f3beec");
   sceneLabel(found?"✓":"♪",a+w/2,b+15);sceneLabel(item[5].slice(-1),a+w/2,b+25);
 }else{
   block(a,b,w,h,"#233747");block(a+2,b+2,w-4,7,"#0c2028");
   for(let i=0;i<3;i++){block(a+5+i*12,b+12,3,13,"#82949b");block(a+3+i*12,b+13+i*2,7,3,"#efbb80");}
   sceneLabel("SOUNDCHECK",a+w/2,b-3);
 }
}
function inspectSoundcheck(item){
 if(item[0]==="songnote"){
   const stop=soundcheckStops.find(s=>s[0]===room);
   collectedNotes.add(room);tone(stop[4],.38,.085);
   notifyWorld("Recovered "+stop[3]+" · "+collectedNotes.size+"/3. "+(collectedNotes.size===3?"Return to the bedroom mixer.":"Next clue: "+soundcheckStops.find(s=>!collectedNotes.has(s[0]))[0]+" room."));
   return true;
 }
 if(item!==mixer)return false;
 if(collectedNotes.size<3){
   notifyWorld("Soundcheck · Find the glowing notes in "+soundcheckStops.filter(s=>!collectedNotes.has(s[0])).map(s=>s[0]).join(", ")+". Then return here.");return true;
 }
 if(soundcheckComplete){confirmPortal(["",0,0,0,0,"Musicana backstage"],"memory6");return true;}
 clearMovement();
 const panel=document.querySelector("#memory-choice");panel.replaceChildren();panel.hidden=false;
 const prompt=document.createElement("strong");prompt.textContent="Soundcheck · Play C, E, G in order to open the backstage pass.";panel.append(prompt);
 let next=0;
 for(const [, , ,note,freq] of [...soundcheckStops].reverse()){
   const key=document.createElement("button");key.textContent=note;panel.append(key);
   key.onclick=()=>{
     tone(freq,.3,.09);
     if(note!==soundcheckStops[next][3]){next=0;prompt.textContent="Try the phrase again: C → E → G.";return;}
     next++;
     if(next<3){prompt.textContent="✓ "+soundcheckStops.slice(0,next).map(s=>s[3]).join(" · ")+" — next: "+soundcheckStops[next][3];return;}
     soundcheckComplete=true;panel.hidden=true;stage.focus({preventScroll:true});
     confirmPortal(["",0,0,0,0,"Musicana backstage"],"memory6");
   };
 }
 const leave=document.createElement("button");leave.textContent="Return to room";leave.onclick=()=>{panel.hidden=true;stage.focus({preventScroll:true});};panel.append(leave);panel.querySelector("button").focus();
 return true;
}

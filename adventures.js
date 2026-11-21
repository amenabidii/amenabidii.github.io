// Each small adventure reveals its historical outcome after two playable steps.
// Tasks are illustrative scenes inspired by the corresponding achievement.
const episodes=[
 [["shelf","Application file","Gather the application pages."],["desk","Award letter","Open the scholarship letter."]],
 [["terminal","Source desk","Trace a claim to its source."],["desk","Demo station","Show the fact-checking workflow."]],
 [["table","Exam booklet","Review the computer science paper."],["notice","Results board","Find the regional and national ranks."]],
 [["tent","Listening circle","Gather the field team’s observations."],["map","Advocacy table","Bring the observations into a petition."]],
 [["notice","Welcome board","Identify resources for the new cohort."],["map","Orientation route","Guide the group through its first stops."]],
 [["terminal","Market screen","Review the simulated market."],["chart","Closing bell","Read the portfolio after ten sessions."]],
 [["shelf","Score library","Select the concert score."],["piano","Campus stage","Play the closing cadence."]],
 [["table", "Profile desk", "Pick an accomplishment to introduce yourself with."], ["notice", "Practice microphone", "Give your introduction."]],
 [["map", "Reception desk", "Check the reception programme."], ["desk", "Photo spot", "Join the ambassador for a photograph."]],
 [["table", "Project table", "Meet the J2R group."], ["notice", "Certificate desk", "Collect the participation certificate."]],
 [["map", "Centre entrance", "Look for a barrier on the voter route."], ["desk", "Observer desk", "Record the location and impact."]],
 [["table", "Facility map", "Trace a visitor’s route through the building."], ["notice", "Report desk", "Add an observation to the assessment."]],
];
const storyProgress=new Map(),stampBook=new Set();
let lightsLow=false,plantWatered=false,benchTempo=false;
const homeDoors=[
 [58,"Projects","work"],[180,"Research","research"],
 [304,"Campus","campus"],[428,"Hackathon","studio"],[550,"Awards","atrium"]
];
function doorsHere(){
 if(room==="music")return homeDoors;
 if(room==="research")return [[80,"Studio","studio"],[304,"P.A.R.","field"],[528,"Atrium","atrium"]];
 if(room.startsWith("memory"))return [[westDoorX,"Back to topic",honors[Number(room.slice(6))].room],[eastDoorX,"Bedroom","music"]];
 return [[westDoorX,rooms[room][3],rooms[room][4]],[eastDoorX,rooms[room][5],rooms[room][6]]];
}
function portal(id,px,py){
 const h=honors[id];
 return ["portal",px,py,32,44,h.name,"Step inside to discover "+h.name+".",id];
}
honors.forEach((h,id)=>{
 const key="memory"+id;
 const theme=h.room,steps=episodes[id];
 rooms[key]=[h.name,"A playable reconstruction. Start with "+steps[0][1]+", then find "+steps[1][1]+".","#achievements","Topic",theme,"Bedroom","music",rooms[theme][7]];
 sceneColors[key]=sceneColors[theme];scores[key]=scores[theme];
 furniture[key]=[
   [steps[0][0],125,116,64,46,steps[0][1],steps[0][2]],
   [steps[1][0],384,152,72,51,steps[1][1],steps[1][2]],
   ["plant",21,82,25,38],["bench",221,230,66,26],["shelf",510,79,68,54]
 ];
 const sibling=honors.slice(0,id).filter(other=>other.room===theme).length;
 if(id<7)furniture[theme].push(portal(id,170+sibling*194,225));
 // The awards gallery also offers a direct portal into every story.
 furniture.atrium.push(portal(id,19+(id%8)*76,202+Math.floor(id/8)*56));
});
furniture.music.push(["desk",423,212,76,45,"Writing desk","Browse the project shelf."],["notice",215,83,51,32,"Team photograph","Twelve young researchers in Kasserine, including Dhiya, Ranya and Amen."],["map",288,242,50,30,"Door atlas","North wall, left to right: projects, research, campus, hackathon and awards."]);
rooms.memory6[1]="An imagined Musicana concert. Approach the piano to play the synth arrangement of Oblivion, then explore the score library.";
rooms.music[0]="Amen’s bedroom";
rooms.music[1]="Start at the north wall: five doors open into my work, research and community. Inspect the room to find a score, a journal and a team photograph.";
function drawPortal(item){
 const [,px,py,w,h,label,,id]=item,accent=rooms["memory"+id][7];
 block(px-2,py+h-6,w+4,7,"#101e2a");
 ctx.strokeStyle=accent;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(px+w/2,py+h/2,w*.44,h*.46,0,0,Math.PI*2);ctx.stroke();ctx.lineWidth=1;
 block(px+w/2-4,py+h/2-4,8,8,stampBook.has(id)?"#efc96a":accent);
 ctx.font="bold 8px monospace";ctx.textAlign="center";ctx.fillStyle="#fff6df";ctx.fillText(label.split(" ").slice(0,2).join(" "),px+w/2,py+h+10);
}
const homeHints={
 bed:"Bedside journal · "+honors[0].body,
 shelf:"Score shelf · Choose the piano to hear G Minor Bach from Piano Tiles 2.",
 table:"Calendar · I’m seeking a summer 2027 internship in analytics, software or applied research.",
 notice:"Team photograph · Dhiya, Ranya and I were three of 12 P.A.R. researchers in Kasserine.",
 map:"Door atlas · Projects, Research, Campus, Hackathon and Awards run from left to right.",
 desk:"Writing desk · The Projects door leads to the shared computer that inspired Fly-QR."
};
function exploreItem(item){
 if(item[0]==="portal"){confirmPortal(item);return true;}
 if(room.startsWith("memory")){
   const id=Number(room.slice(6)),items=furniture[room],step=storyProgress.get(id)||0;
   if(item!==items[0]&&item!==items[1])return false;
   if(item===items[1]&&step===0){notifyWorld("First find "+items[0][5]+".");return true;}
   if(item===items[0]){storyProgress.set(id,Math.max(step,1));notifyWorld(item[6]+" Next: "+items[1][5]+".");}
   else finishMemory(id);
   return true;
 }
 if(room!=="music")return false;
 switch(item[0]){
 case "lamp":lightsLow=!lightsLow;notifyWorld(lightsLow?"Reading lamp off · dusk settles over the room.":"Reading lamp on · warm light returns.");break;
 case "plant":plantWatered=true;notifyWorld("Watered the plant. A new leaf unfolds.");break;
 case "bench":notifyWorld("Piano bench · Walk up to the upright to start the full performance. Step away to stop, or use the game’s sound switch.");break;
 case "shelf":notifyWorld(homeHints.shelf+" Journal: "+stampBook.size+"/"+honors.length+" stories.");break;
 case "bed":notifyWorld(homeHints.bed);break;
 case "desk":notifyWorld(homeHints.desk);break;
 default:if(!homeHints[item[0]])return false;notifyWorld(homeHints[item[0]]);
 }
 return true;
}
// Follow the player's actual route so the team retraces turns around furniture.
let teamTrail=[],teamDistance=0,teamTask=null;
function teamRoster(){

 if(room==="memory1")return ["Teammate","Teammate"];

 return [];
}
function resetTeam(){teamTrail=[[x,y,0]];teamDistance=0;teamTask=null;}
function moveTeam(ox,oy){
 if(!teamRoster().length)return;
 const delta=Math.hypot(x-ox,y-oy);if(delta===0||delta>30)return;
 teamTask=null;teamDistance+=delta;
 if(teamDistance-teamTrail[teamTrail.length-1][2]>=3)teamTrail.push([x,y,teamDistance]);
 while(teamTrail.length>2&&teamDistance-teamTrail[1][2]>240)teamTrail.shift();
}
function drawTeam(){
 const people=teamRoster();
 if(!people.length||!teamTrail.length)return;
 for(let i=people.length-1;i>=0;i--){
  const distance=teamDistance-(i+1)*14;
  const pos=teamTrail.find(p=>p[2]>=distance)||teamTrail[teamTrail.length-1];
  let px=pos[0],py=pos[1];
  if(distance<0){px+=((i%4)-1.5)*17;py+=12+Math.floor(i/4)*12;}
  if(teamTask){px=teamTask[0]+(i%4-1.5)*19;py=teamTask[1]+Math.floor(i/4)*13;}
  const color=["#e9a85e","#cfa2ed","#81c9be","#a4b9de"][i%4];
  block(px-4,py-18,8,6,"#cb9979");block(px-5,py-20,10,4,i===1?"#44302d":"#352b2d");
  block(px-5,py-12,10,9,color);block(px-4,py-3,3,4,"#182532");block(px+1,py-3,3,4,"#182532");
  if(teamTask){block(px+4,py-10,5,4,"#ecdfae");}
  if(people[i]){ctx.font="bold 7px monospace";ctx.textAlign="center";ctx.fillStyle="#fff";ctx.fillText(people[i],px,py-23);}
 }
}
function joinTask(item){if(teamRoster().length)teamTask=[item[1]+item[3]/2,item[2]+item[4]+10];}
const memoryChoices=[
 ["Pack for the scholarship move. Which campus belongs on the travel card?",["Cairo · AUC","Tunis · INSAT"],0,"The scholarship took Amen to the American University in Cairo."],
 ["Your team finds a claim with no source. What should VeriNews show?",["A verified badge","A request for evidence"],1,"A claim needs supporting evidence before a fact-check can move forward."],
 ["Which result belongs on the regional computer science leaderboard?",["First place","Thirtieth place"],0,"First regionally and thirtieth nationally are two different achievements."],
 ["The team has listened to young residents. How should the findings travel next?",["Publish their private notes","Bring shared priorities to local authorities"],1,"Use the shared priorities to build the climate petition together."],
 ["A new student is lost on orientation day. What can the welcome group offer?",["A guided route to campus resources","The next exam ranking"],0,"The peer moderators helped students find resources and settle into AUC."],
 ["A virtual EGP 250,000 portfolio gains 22%. What is its closing value?",["EGP 272,000","EGP 305,000"],1,"EGP 250,000 × 1.22 = EGP 305,000 in the simulation."],
 ["The final campus performance is starting. Where does Amen take his place?",["At the piano","At the drum kit"],0,"Amen plays piano with AUC Musicana."],
 ["Which introduction gives a listener evidence?", ["A specific project and what I contributed", "A list of adjectives"], 0, "A specific project and what I contributed."],
 ["Who recognized Amen in Egypt?", ["A trading competition judge", "The Tunisian ambassador"], 1, "The Tunisian ambassador."],
 ["What does the J2R certificate document?", ["Participation", "A national ranking"], 0, "Participation."],
 ["Which observation can an organizer act on?", ["The building looks busy", "The entrance has steps and no accessible route"], 1, "The entrance has steps and no accessible route."],
 ["What belongs in the assessment?", ["A documented barrier and a practical recommendation", "An assumption about every visitor"], 0, "A documented barrier and a practical recommendation."],
];
function finishMemory(id){
 if(stampBook.has(id)){notifyWorld(honors[id].body);return;}
 clearMovement();
 const panel=document.querySelector("#memory-choice"),[prompt,options,correct,hint]=memoryChoices[id];
 panel.replaceChildren();panel.hidden=false;
 const title=document.createElement("strong");title.textContent=prompt;panel.append(title);
 const feedback=document.createElement("p");feedback.setAttribute("role","status");
 for(const [i,value] of options.entries()){
  const button=document.createElement("button");button.textContent=value;
  button.onclick=()=>{
   if(i!==correct){feedback.textContent=hint;return;}
   stampBook.add(id);storyProgress.set(id,2);panel.hidden=true;
   if(id===6)[392,466,587].forEach((pitch,j)=>setTimeout(()=>tone(pitch,.3,.07),j*130));
   else tone(659,.3,.08);
   paint();notifyWorld(honors[id].body+" · Journal "+stampBook.size+"/"+honors.length);
   stage.focus({preventScroll:true});
  };panel.append(button);
 }
 const leave=document.createElement("button");leave.textContent="Return to room";leave.onclick=()=>{panel.hidden=true;stage.focus({preventScroll:true});};panel.append(feedback,leave);panel.querySelector("button").focus();
}

function confirmPortal(item,destination="memory"+item[7]){
 const panel=document.querySelector("#memory-choice");
 clearMovement();
 const title=document.createElement("strong"),accept=document.createElement("button"),cancel=document.createElement("button");
 title.textContent="Enter "+item[5]+"?";accept.textContent="Enter room (E)";cancel.textContent="Stay here (Esc)";
 function close(){panel.hidden=true;panel.onkeydown=null;stage.focus({preventScroll:true});}
 accept.onclick=()=>{close();enter(destination);};
 cancel.onclick=close;
 panel.onkeydown=e=>{
   if(e.code!=="KeyE"&&!["e","escape"].includes(e.key.toLowerCase()))return;
   e.preventDefault();e.stopPropagation();
   if(!e.repeat)(e.key==="Escape"?cancel:accept).click();
 };
 panel.replaceChildren(title,accept,cancel);panel.hidden=false;accept.focus({preventScroll:true});
}

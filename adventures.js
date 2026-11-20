// Each small adventure reveals its historical outcome after two playable steps.
// Tasks are illustrative scenes inspired by the corresponding achievement.
const episodes=[
 [["shelf","Application file","Gather the application pages."],["desk","Award letter","Open the scholarship letter."]],
 [["terminal","Source desk","Trace a claim to its source."],["desk","Demo station","Show the fact-checking workflow."]],
 [["table","Exam booklet","Review the computer science paper."],["notice","Results board","Find the regional and national ranks."]],
 [["tent","Listening circle","Gather the field team’s observations."],["map","Advocacy table","Bring the observations into a petition."]],
 [["notice","Welcome board","Identify resources for the new cohort."],["map","Orientation route","Guide the group through its first stops."]],
 [["terminal","Market screen","Review the simulated market."],["chart","Closing bell","Read the portfolio after ten sessions."]],
 [["shelf","Score library","Select the concert score."],["piano","Campus stage","Play the closing cadence."]]
];
const storyProgress=new Map(),stampBook=new Set();
let lightsLow=false,plantWatered=false,benchTempo=false;
const homeDoors=[
 [48,"Projects","work"],[147,"Research","research"],[245,"P.A.R.","field"],
 [348,"Campus","campus"],[448,"Hackathon","studio"],[552,"Awards","atrium"]
];
function doorsHere(){
 if(room==="music")return homeDoors;
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
 furniture[theme].push(portal(id,170+sibling*194,225));
 // The awards gallery also offers a direct portal into every story.
 furniture.atrium.push(portal(id,35+id*80,170+(id%2)*55));
});
furniture.music.push(["desk",423,212,76,45,"Writing desk","Browse the project shelf."],["notice",215,83,51,32,"Team photograph","Twelve young researchers in Kasserine, including Dhiya, Ranya and Amen."],["map",288,242,50,30,"Door atlas","North wall, left to right: projects, research, P.A.R., campus, hackathon and awards."]);
rooms.music[0]="Amen’s bedroom";
rooms.music[1]="Start at the north wall: six doors open into my work, research and community. Inspect the room to find a score, a journal and a team photograph.";
function drawPortal(item){
 const [,px,py,w,h,label,id]=item,accent=rooms["memory"+id][7];
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
 map:"Door atlas · Projects, Research, P.A.R., Campus, Hackathon and Awards run from left to right.",
 desk:"Writing desk · The Projects door leads to the shared computer that inspired Fly-QR."
};
function exploreItem(item){
 if(item[0]==="portal"){enter("memory"+item[7]);clearMovement();return true;}
 if(room.startsWith("memory")){
   const id=Number(room.slice(6)),items=furniture[room],step=storyProgress.get(id)||0;
   if(item!==items[0]&&item!==items[1])return false;
   if(item===items[1]&&step===0){notifyWorld("First find "+items[0][5]+".");return true;}
   if(item===items[0]){storyProgress.set(id,Math.max(step,1));notifyWorld(item[6]+" Next: "+items[1][5]+".");}
   else{storyProgress.set(id,2);stampBook.add(id);notifyWorld(honors[id].body+" · Journal "+stampBook.size+"/"+honors.length);tone(659,.3,.08);}
   return true;
 }
 if(room!=="music")return false;
 switch(item[0]){
 case "lamp":lightsLow=!lightsLow;notifyWorld(lightsLow?"Reading lamp off · dusk settles over the room.":"Reading lamp on · warm light returns.");break;
 case "plant":plantWatered=true;notifyWorld("Watered the plant. A new leaf unfolds.");break;
 case "bench":benchTempo=!benchTempo;music();notifyWorld(benchTempo?"Practice tempo selected. Approach the piano.":"Performance tempo restored.");break;
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
 if(room==="field"||room==="memory3")return ["Dhiya","Ranya",...Array(9).fill("")];
 if(room==="memory1")return ["Teammate","Teammate"];
 if(room==="memory4")return ["Co-guide"];
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

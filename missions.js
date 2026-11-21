const roomTasks={
 music:["Pack for the day","bed","map"],
 atrium:["Plan your route","sofa","map"],
 work:["Recreate the library handoff","desk","printer"],
 campus:["Prepare for orientation","notice","table"],
 research:["Read the study","scope","chart"],
 studio:["Verify the build","notice","terminal"],
 field:["Turn observations into advocacy","tent","map"]
};
const discovered=new Set(),completed=new Set(),briefed=new Set();
let celebrationTimer=0;
function showGamePrompt(title,instructions,action,next){
 clearMovement();
 const panel=document.querySelector("#memory-choice");
 const heading=document.createElement("strong"),copy=document.createElement("p"),button=document.createElement("button");
 heading.textContent=title;copy.textContent=instructions;button.textContent=action;
 button.onclick=()=>{panel.hidden=true;panel.onkeydown=null;stage.focus({preventScroll:true});next?.();};
 panel.onkeydown=e=>{if(e.code==="KeyE"){e.preventDefault();e.stopPropagation();if(!e.repeat)button.click();}};
 panel.replaceChildren(heading,copy,button);panel.hidden=false;button.focus({preventScroll:true});
}
function missionStatus(){
 const hud=document.querySelector("#mission-hud");
 hud.textContent=(discovered.size*10+completed.size*100)+" pts · "+discovered.size+" finds · "+completed.size+"/"+Object.keys(rooms).length+" missions";
 hud.hidden=false;
}
function briefRoom(){
 document.querySelector("#mission-party").hidden=true;
 missionStatus();
 if(briefed.has(room))return;
 briefed.add(room);
 const task=roomTasks[room],steps=episodes[Number(room.replace("memory",""))];
 let title=rooms[room][0],hint;
 if(task){
   title=task[0];
   const labels=task.slice(1).map(kind=>{const item=furniture[room].find(f=>f[0]===kind);return item?.[5]||kind;});
   hint="Find and inspect both: "+labels.join(" and ")+".";
 }else if(steps){hint=steps.map(s=>s[1]+" — "+s[2]).join(" ")+" Answer the final question to earn your stamp.";}
 else hint="Bring the printer proof and the console proof. Dodge the hiring barriers and inspect the interview desk.";
 showGamePrompt(title,hint+" Walk close and press E or tap Inspect.","Begin mission (E)");
}
function finishMission(){
 if(completed.has(room))return;
 completed.add(room);missionStatus();
 const party=document.querySelector("#mission-party");party.hidden=false;
 clearTimeout(celebrationTimer);celebrationTimer=setTimeout(()=>party.hidden=true,3500);
}
function recordFind(item){
 if(!item||["door","portal"].includes(item[0]))return;
 const key=room+"/"+item[0];
 if(discovered.has(key))return;
 discovered.add(key);missionStatus();
 const task=roomTasks[room];
 if(task&&task.slice(1).every(kind=>discovered.has(room+"/"+kind)))finishMission();
}

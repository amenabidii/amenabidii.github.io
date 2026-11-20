// Each study pairs an illustrative process sample with a source visitors can open.
const exhibits = [
 ["Fly-QR","Scan a room|Connect two browsers|Transfer the file","https://github.com/amenabidii/FlyQR","Source code",0],
 ["VentureLab","Gather evidence|Challenge assumptions|Founder approves","https://github.com/amenabidii/VentureLab","Code and demo",1],
 ["Lapwise","Start session|Finish a task|Save its lap","https://lapwise-production.up.railway.app","Open Lapwise",2],
 ["YouTube Mix Blocker","Open a song|Inspect its queue|Keep the chosen video","https://github.com/amenabidii/Youtube-Mix-Blocker","Extension source",3],
 ["The Observer Paradox","Receive signal|Undo a turn|Observer remembers","observer.html","Play the memory prototype",4],
 ["Cognitive performance","Sleep & stress|ANOVA / regression|Reaction & memory","resume.pdf#page=1","Research summary",5],
 ["Study room booking","Observed bottleneck|Define requirements|University approval","resume.pdf#page=1","Project summary",6],
 ["Social media & productivity","65,000 records|Transform in dplyr|Plot in ggplot2","resume.pdf#page=1","Analysis summary",7],
 ["SOUTRA","Health information|Design the site|Pitch at Camp4SRH","resume.pdf#page=1","Project summary",8],
 ["#activism","240+ young people|Climate workshops|400+ signatures","resume.pdf#page=2","Fieldwork record",9],
 ["#access","Visit facilities|Document barriers|Report findings","resume.pdf#page=2","Assessment record",10],
 ["#campus","Welcome students|Explore AUC|49 students guided","resume.pdf#page=2","Campus experience",11],
 ["#piano","AUC Musicana|Piano|15+ events","#lab","Play the pads",12],
 ["#methods","80,000 observations|Compare groups|Check assumptions","#project-5","Explore the study",5],
 ["#interests","Perception|Learning|Human decisions","resume.pdf#page=1","Research interests",19]
];
const projectCards = [...document.querySelectorAll("#work details")];
exhibits.forEach(([key,steps,url,linkLabel,topic],i) => {
  const card = key.startsWith("#") ? document.querySelector(key) : projectCards[i];
  if (!key.startsWith("#")) card.id = "project-"+i;
  const diagram = document.createElement("figure");
  diagram.className = "process-sample";
  diagram.setAttribute("aria-label","Illustrated process");
  for (const step of steps.split("|")) {
    const node=document.createElement("span");
    node.textContent=step;
    diagram.append(node);
  }
  const actions=document.createElement("div");
  actions.className="exhibit-actions";
  const link=document.createElement("a");
  link.href=url;
  link.textContent=linkLabel;
  const button=document.createElement("button");
  button.type="button";
  button.textContent="Ask Amenos about this";
  button.onclick=()=> {
    if (!guide.open) launcher.click();
    ask(key.startsWith("#") ? card.querySelector("h3").textContent : key,topic);
  };
  actions.append(link,button);
  card.append(diagram,actions);
});
document.querySelectorAll('a[href^="#project-"]').forEach(link=>link.onclick=()=>{document.querySelector(link.hash).open=true;});


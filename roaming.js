// Choose a distant walkable tile and retrace a breadth-first search around furniture.
const roamingCharacters=new Map();
function roam(key,startX,startY,dt,speed){
 const id=room+"/"+key, grid=16, columns=Math.ceil(mapWidth/grid)+1;
 let actor=roamingCharacters.get(id);
 if(!actor){
   actor={x:startX,y:startY,path:[]};roamingCharacters.set(id,actor);
 }
 if(!actor.path.length){
   const first=Math.round(actor.y/grid)*columns+Math.round(actor.x/grid);
   const queue=[first],parent=new Map([[first,null]]),far=[];
   for(let i=0;i<queue.length;i++){
     const cell=queue[i],cx=(cell%columns)*grid,cy=Math.floor(cell/columns)*grid;
     if(Math.abs(cx-actor.x)>mapWidth*.45)far.push(cell);
     for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
       const nx=cx+dx*grid,ny=cy+dy*grid,n=cell+dx+dy*columns;
       if(parent.has(n)||!canStand(nx,ny)||!canStand((cx+nx)/2,(cy+ny)/2))continue;
       parent.set(n,cell);queue.push(n);
     }
   }
   const choices=far.length?far:queue;
   let target=choices[Math.floor(Math.random()*choices.length)];
   while(target!==first){actor.path.push([(target%columns)*grid,Math.floor(target/columns)*grid]);target=parent.get(target);}
   actor.path.reverse();
 }
 const next=actor.path[0];
 if(next){
   const dx=next[0]-actor.x,dy=next[1]-actor.y,d=Math.hypot(dx,dy);
   const f=Math.min(1,dt*speed/(d||1));actor.x+=dx*f;actor.y+=dy*f;
   if(f===1)actor.path.shift();
 }
 return actor;
}
function tickRoamers(){
 if(document.hidden||!document.querySelector("#memory-choice").hidden)return;
 if(room==="field"||room==="memory3"){
   roam("Dhiya",255,190,.06,35);roam("Ranya",345,185,.06,39);
 }else if(room==="music"&&guitarActive){
   roam("dancer",238,178,.06,43);roam("bull",282,180,.06,54);
 }
}

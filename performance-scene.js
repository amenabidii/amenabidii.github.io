// Pixel performers for the two playable music scenes.
function stagePerson(px,py,coat,arms,shades=false){
 block(px-4,py-22,8,8,"#c99574");block(px-5,py-24,10,4,"#392c2c");
 block(px-6,py-14,12,11,coat);block(px-5,py-3,4,5,"#152332");block(px+1,py-3,4,5,"#152332");
 block(px-8+arms,py-12-arms,4,4,"#d4a084");block(px+4-arms,py-12-arms,4,4,"#d4a084");
 if(shades){block(px-5,py-20,10,3,"#090d14");block(px-1,py-14,2,8,"#e1ddd2");}
}
function sceneLabel(text,px,py){
 ctx.font="bold 8px monospace";ctx.textAlign="center";ctx.fillStyle="#fff0c7";ctx.fillText(text,px,py);
}
function drawPerformance(){
 const time=performance.now()/1000;
 if(room==="field"||room==="memory3"){
   for(const [i,name] of ["Dhiya","Ranya"].entries()){
     const pos=roamingCharacters.get(room+"/"+name);if(!pos)continue;
     const px=pos.x,py=pos.y;
     stagePerson(px,py,i?"#c693df":"#d69b62",Math.round(Math.sin(time*3+i)));
     sceneLabel(name,px,py-28);
   }
 }
 if(room==="music"&&guitarActive){
   const dance=roamingCharacters.get(room+"/dancer"),animal=roamingCharacters.get(room+"/bull");
   if(dance){
     const {x:px,y:py}=dance;stagePerson(px,py,"#d83c50",Math.round(2*Math.sin(time*5)));
     ctx.fillStyle="#da3650";ctx.beginPath();ctx.moveTo(px,py-16);ctx.lineTo(px-11,py);ctx.lineTo(px+12,py);ctx.fill();
   }
   if(animal){
     const {x:px,y:py}=animal;
     block(px,py-9,22,10,"#3b292a");block(px-6,py-12,9,9,"#352729");block(px-8,py-15,3,5,"#f4dab3");block(px,py-15,2,4,"#f4dab3");
     for(const offset of [1,15])block(px+offset,py,4,5+Math.round(2*Math.sin(time*6+offset)),"#231e26");
   }
   const beat=Math.round(2*Math.sin(time*11));
   stagePerson(328,239,"#71aaad",beat);block(321,230,15,13,"#aa7350");block(325,231,7,4,"#67432e");
   stagePerson(368,235,"#c49068",-beat);block(362,224,10,10,"#bd844b");block(370,223,16,3,"#e1bd84");
   sceneLabel("Cajón",328,210);sceneLabel("Bass",368,206);

 }
 if(room!=="memory6")return;
 const live=bachActive,beat=live?Math.round(2*Math.sin(time*9)):0;
 if(live)stagePerson(355,176,"#79aba8",beat);
 for(const [dx,dy] of [[-8,0],[6,0],[0,7]]){block(349+dx,170+dy,13,8,"#8e4944");block(349+dx,170+dy,13,2,"#dfd8bf");}
 block(338,159,2,23,"#9ba5a8");block(331,158,16,3,"#e8b85e");
 stagePerson(478,176,"#637da9",beat);block(471,164,12,9,"#e48d58");block(480,163,17,3,"#bba284");
 stagePerson(288,162,"#887aaa",beat);block(274,153,30,5,"#dedacd");block(276,158,3,13,"#29353e");
 stagePerson(224,166,"#69907b",beat);block(219,155,11,9,"#bc8252");block(226,152,20,3,"#ddc5a0");
 for(let i=0;i<4;i++)stagePerson(350+i*32,254+(i%2)*5,"#273748",live?(Math.floor(time*5+i)%2)*3:0,true);
 sceneLabel(live?"President Dallal & guests · Bravo, Musicana!":"President Dallal & guests",398,218);
}

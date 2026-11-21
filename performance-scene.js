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
     const px=260+i*90+30*Math.sin(time*.64+i),py=185+13*Math.sin(time*.91+i*2);
     stagePerson(px,py,i?"#c693df":"#d69b62",Math.round(Math.sin(time*3+i)));
     sceneLabel(name,px,py-28);
   }
 }
 if(room==="music"&&guitarActive){
   const dancer=236+12*Math.sin(time*2),bull=279+15*Math.cos(time*2);
   stagePerson(dancer,179,"#d83c50",Math.round(2*Math.sin(time*5)));
   ctx.fillStyle="#da3650";ctx.beginPath();ctx.moveTo(dancer,163);ctx.lineTo(dancer-11,179);ctx.lineTo(dancer+12,179);ctx.fill();
   block(bull,171,22,10,"#3b292a");block(bull-6,168,9,9,"#352729");block(bull-8,165,3,5,"#f4dab3");block(bull,165,2,4,"#f4dab3");
   for(const offset of [1,15])block(bull+offset,180,4,5+Math.round(2*Math.sin(time*6+offset)),"#231e26");

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

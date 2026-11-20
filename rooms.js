const rooms = {
 queue:["The referral rush","Get past the wasta queue-jumpers and take both proofs to the interview desk in the east.","#contact","Studio","studio","Atrium","atrium","#ebb17f"],
 atrium:["The atrium","Help Amen earn a software position. Start north-west at Work, then take your evidence to the code lab.","#research","Work","work","Campus","campus","#6de9cd"],
 work:["Amen’s office","At a library printer, a file on a phone needed a way onto a shared PC. Fly-QR grew out of that small frustration.","#project-0","Research","research","Studio","studio","#86ceff"],
 campus:["Campus commons","As a peer moderator, Amen co-guided 49 incoming AUC students. Two doors lead beyond orientation.","#campus","Fieldwork","field","Music","music","#efc77c"],
 research:["Research lab","A team led by Amen explored sleep, stress, memory and reaction time across 80,000 records.","#project-5","Studio","studio","Atrium","atrium","#baacff"],
 studio:["Night-shift code lab","Turn back the clock in The Observer Paradox and the observer still remembers. Try that mechanic in the project gallery.","#project-4","Workshop","work","Hiring","queue","#ec98ad"],
 field:["Kasserine field station","More than 240 young people contributed to climate research. Amen co-led a petition that gathered over 400 signatures.","#activism","Music","music","Atrium","atrium","#a7e8a4"],
 music:["Bedroom & piano","Amen played piano at more than 15 university events with AUC Musicana. Approach the upright piano to hear G Minor Bach from Piano Tiles 2.","#piano","Fieldwork","field","Campus","campus","#ffb1a0"]
};
// Furniture positions are in floor pixels. Depth is the solid footprint at the base.
const furniture={
 atrium:[
  ["sofa",19,80,70,34,"The reading corner","The two routes start here. Follow Work for software and research, or Campus for fieldwork and music."],
  ["table",101,112,38,23],["plant",136,52,22,40],["shelf",236,82,88,39],
  ["map",190,126,52,32,"Visitor atlas","Seven places connect this world. The dark arch at the bottom of each room retraces your last doorway."],
  ["plant",20,153,22,34]],
 work:[
  ["desk",17,72,90,46,"Development desk","Fly-QR connects a phone to a shared computer without opening a personal messaging account."],
  ["printer",119,96,34,31,"Try the printer","A page slides out. The trip from a phone to a library printer is what inspired Fly-QR."],
  ["chair",51,125,23,32],["shelf",236,67,93,46],["sofa",229,149,70,33],["plant",300,132,21,30]],
 campus:[
  ["notice",137,57,61,37,"Orientation board","As a peer moderator, Amen co-guided 49 incoming students at AUC."],
  ["sofa",17,91,70,33],["table",66,142,54,24],["sofa",236,91,75,34],["plant",285,145,24,33],["plant",107,56,22,32]],
 research:[
  ["scope",22,69,80,44,"Analysis bench","The cognition study used ANOVA and regression to explore associations in 80,000 records."],
  ["chart",130,60,57,33],["desk",232,93,91,44],["chair",257,145,22,29],["shelf",33,157,74,32]],
 studio:[
  ["terminal",24,70,80,52,"Build console","In The Observer Paradox, undo rewinds the simulation while the Observer log keeps its memory."],
  ["chair",48,133,24,29],["notice",126,57,64,39],["table",208,112,60,25],["shelf",271,140,61,38],["plant",300,59,22,32]],
 field:[
  ["tent",15,68,77,54,"Field tent","In Kasserine, young people documented how climate change affected their health, education and livelihoods."],
  ["map",115,93,55,34,"Survey table","Amen helped lead a local climate petition that gathered over 400 signatures."],
  ["tree",232,61,41,54],["tree",286,105,43,58],["bench",212,159,61,23],["plant",34,148,26,33]],
 music:[
  ["bed",17,66,52,74,"Bedside notebook","This imagined bedroom connects Amen’s life on campus with his piano performances."],
  ["lamp",80,83,21,37],["piano",202,72,101,56,"Play the upright piano","Now playing: the full performance of Luo Ni’s G Minor Bach from Piano Tiles 2. Amen performs with AUC Musicana."],
  ["bench",225,140,51,21],["shelf",93,57,60,39],["plant",305,150,24,37],["table",38,158,48,23]]
};
furniture.queue=[
 ["desk",303,82,86,48,"Interview desk","Present the project and debug evidence for the software position."],
 ["bench",82,60,56,19],["bench",85,144,57,21],["bench",180,84,52,19],["bench",223,161,61,22],
 ["notice",22,46,44,38,"Candidate check-in","Avoid the queue jumpers and head east. Your evidence stays with you if you get caught."]
];
const sceneColors={queue:["#4c3c43","#624c52","#ddac73"],
 atrium:["#38474d","#435455","#b6a271"],work:["#283d51","#354c5d","#75a0a9"],
 campus:["#544844","#67594c","#b49b71"],research:["#354050","#414d60","#8296bb"],
 studio:["#142e29","#24463c","#50b380"],field:["#455648","#576751","#8c9f69"],
 music:["#574443","#69534c","#c69576"]
};
const mapWidth=608,mapHeight=320;
const westDoorX=80,eastDoorX=mapWidth-80,backDoorX=mapWidth/2;
// Spread the furnishings across a walkable floor larger than the camera viewport.
for(const items of Object.values(furniture)){
 for(const item of items){item[1]=Math.round(item[1]*1.65);item[2]=Math.round(item[2]*1.30);}
}
function sceneArt(){
 const [floor,seam,trim]=sceneColors[room];
 block(0,0,mapWidth,mapHeight,floor);
 for(let j=0;j<25;j++){
   block(0,38+j*14,mapWidth,1,seam);
   for(let i=-1;i<11;i++)block(i*76+(j%2)*38,39+j*14,1,13,seam);
 }
 block(0,0,mapWidth,38,"#1b2937");block(0,34,mapWidth,4,trim);
 // A recessed window overlooks distant city lights or the field station hills.
 block(116,3,119,29,"#091824");block(119,5,113,23,"#44627a");
 for(let i=0;i<15;i++){
   const h=3+(i*19)%15;block(119+i*8,28-h,7,h,"#273e53");
   if(i%2)block(121+i*8,29-h,2,2,"#dfbb7b");
 }
 block(173,4,3,25,trim);block(115,28,121,3,trim);
 block(0,38,6,mapHeight-38,"#172630");block(mapWidth-6,38,6,mapHeight-38,"#172630");
 const rug=room==="music"?"#93575d":room==="field"?"#656953":"#446571";
 block(113,137,112,62,rug);
 for(const inset of [3,7]){ctx.strokeStyle=trim;ctx.strokeRect(113+inset+.5,137+inset+.5,111-inset*2,61-inset*2);}
 for(let i=0;i<12;i++){block(116+i*9,135,3,2,trim);block(116+i*9,199,3,2,trim);}
}
function drawFurniture(item){
 const [kind,a,b,w,h,label]=item;
 ctx.save();ctx.translate(a,b);ctx.scale(w/64,h/48);
 const r=block;
 const dark="#162433",wood="#986c55",edge="#d6a377",paper="#e6dabb",mint="#79d7c0";
 function poly(points,color){ctx.fillStyle=color;ctx.beginPath();points.forEach(([px,py],i)=>i?ctx.lineTo(px,py):ctx.moveTo(px,py));ctx.closePath();ctx.fill();}
 function base(){r(3,28,58,8,wood);r(6,36,5,11,dark);r(54,36,5,11,dark);r(3,26,58,3,edge);}
 function screen(x,w){r(x,3,w,19,dark);r(x+2,5,w-4,14,"#345667");r(x+4,8,w/2,2,mint);r(x+4,12,w/3,1,paper);r(x+w/2-2,22,4,4,dark);}
 r(3,42,59,5,"#29343a");
 switch(kind){
 case "desk":case "terminal":
   base();screen(6,kind==="desk"?24:42);if(kind==="desk")screen(32,22);
   r(13,27,28,3,"#5a7781");r(49,23,5,5,paper);break;
 case "printer":
   r(7,18,50,22,"#a7b7b7");r(10,16,44,7,dark);r(16,1,31,15,paper);r(13,32,38,8,dark);
   r(18,36,27,roomAction==="Try the printer"?12:6,paper);r(49,24,4,3,mint);break;
 case "sofa":
   r(5,9,53,25,"#537779");r(8,12,22,15,"#74968d");r(33,12,21,15,"#729188");r(2,23,6,15,dark);r(56,23,6,15,dark);
   r(7,28,49,10,"#658985");r(6,39,5,7,wood);r(54,39,5,7,wood);break;
 case "table":case "bench":case "map":
   base();if(kind==="map"){r(10,14,44,15,paper);poly([[12,22],[22,17],[28,20],[36,16],[46,21],[40,25],[21,26]],"#77977c");r(36,19,3,3,"#b05548");}
   if(kind==="table"){r(12,20,17,7,paper);r(37,17,7,10,"#dca17c");}break;
 case "shelf":
   r(2,1,60,44,wood);for(let j=0;j<2;j++){r(5,4+j*20,54,16,dark);
    for(let i=0;i<8;i++){const ht=8+(i*7+j*3)%8;r(7+i*6,19+j*20-ht,4,ht,["#b78969","#6bada3","#a79bbe","#dcb673"][i%4]);}}
   break;
 case "plant":case "tree":
   if(kind==="plant"){poly([[15,29],[48,29],[43,46],[20,46]],wood);r(12,28,39,5,edge);}
   r(29,10,6,kind==="tree"?35:20,wood);
   for(const [u,v,c] of [[6,9,"#3d7769"],[20,0,"#528f78"],[33,8,"#6ca281"],[15,18,"#4b856b"]])poly([[u,v+9],[u+8,v],[u+23,v+2],[u+22,v+13],[u+9,v+17]],c);break;
 case "piano":
   r(4,2,56,31,"#493b3e");r(6,5,52,3,edge);r(9,10,46,13,"#70504b");r(23,13,17,9,paper);r(31,13,1,9,wood);
   r(2,26,60,9,dark);for(let i=0;i<18;i++){r(5+i*3,27,2.7,7,paper);if(i%7!==2&&i%7!==6)r(7+i*3,26,1.8,4,dark);}
   r(7,35,5,12,wood);r(52,35,5,12,wood);break;
 case "bed":
   r(4,1,56,44,wood);r(7,5,50,34,paper);r(13,6,37,8,"#fff1d5");r(7,17,50,23,"#668a9c");r(7,18,50,3,"#99b5ae");r(4,39,56,5,edge);break;
 case "chair":
   r(11,4,42,21,"#597281");r(10,24,44,8,"#71899a");r(28,31,6,10,dark);r(13,41,37,4,dark);break;
 case "lamp":poly([[21,2],[42,2],[56,19],[9,19]],"#f8cb87");r(29,19,5,23,wood);r(16,42,31,4,dark);break;
 case "scope":
   base();r(17,21,23,5,dark);r(25,10,5,13,paper);poly([[22,6],[27,2],[37,12],[32,16]],mint);r(40,17,7,9,"#779ec3");break;
 case "notice":case "chart":
   r(1,1,62,40,edge);r(4,4,56,34,kind==="chart"?"#253d4d":"#9d7559");
   if(kind==="chart"){for(let i=0;i<8;i++)r(8+i*6,33-(i*11)%23,4,2+(i*11)%23,mint);}
   else for(let i=0;i<5;i++){const bx=7+i*10,by=8+(i%2)*9;r(bx,by,10,12,paper);r(bx+4,by,2,2,"#944f52");}
   r(6,41,3,6,dark);r(55,41,3,6,dark);break;
 case "tent":
   poly([[1,42],[20,3],[45,3],[63,42]],"#bd9464");poly([[1,42],[20,3],[37,42]],"#d1aa75");poly([[9,42],[21,17],[30,42]],dark);break;
 }
 ctx.restore();
 if(label){block(a+w/2-2,b-4,4,4,"#ffdd96");}
}

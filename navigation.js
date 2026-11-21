const speedControl=document.querySelector("#player-speed");
speedControl.oninput=()=>{document.querySelector("#speed-value").value=(speedControl.value/116).toFixed(1)+"×";};
const siteHeader=document.querySelector("header");
let scrollMark=window.scrollY;
window.addEventListener("scroll",()=>{
 const y=window.scrollY;
 if(Math.abs(y-scrollMark)<8 && y>80)return;
 siteHeader.classList.toggle("header-away",y>100 && y>scrollMark);
 scrollMark=y;
},{passive:true});
document.addEventListener("click",event=>{
 const link=event.target.closest("a[href]");
 if(link)link.target=link.getAttribute("href").startsWith("#")?"_self":"_blank";
},true);

// Stream the full artist performance through its native player.
const pianoDock=document.querySelector("#piano-dock");
const pianoFact=document.querySelector("#piano-fact");
let player=null,pianoRequested=false,apiLoading=false,factTimer=0;
function syncPiano(active){
 if(active===pianoRequested)return;
 pianoRequested=active;pianoDock.hidden=!active;clearInterval(factTimer);pianoFact.hidden=true;
 if(!active){player?.pauseVideo?.();return;}
 if(player?.playVideo){player.playVideo();return;}
 if(!apiLoading){
   apiLoading=true;
   const script=document.createElement("script");script.src="https://www.youtube.com/iframe_api";
   script.onerror=()=>{apiLoading=false;};document.head.append(script);
 }
}
window.onYouTubeIframeAPIReady=()=>{
 player=new YT.Player("piano-performance",{
   videoId:"UnMhEEttY2w",host:"https://www.youtube-nocookie.com",
   playerVars:{playsinline:1,origin:location.origin},
   events:{
    onReady:({target})=>{if(pianoRequested)target.playVideo();},
    onStateChange:({data,target})=>{
      clearInterval(factTimer);
      if(data!==YT.PlayerState.PLAYING)return;
      if(!pianoRequested){target.pauseVideo();return;}
      factTimer=setInterval(()=>{
        if(target.getCurrentTime()<5)return;
        pianoFact.textContent="Fun fact · Amen has played this piece on piano and brought it into his pixel bedroom. This performance is by Jacob’s Piano.";
        pianoFact.hidden=false;clearInterval(factTimer);
      },500);
    }
   }
 });
};

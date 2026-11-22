const amenosChat = (() => {
  const history = [];
  let endpoint;
  async function getEndpoint() {
    if (!endpoint) endpoint = fetch("https://raw.githubusercontent.com/amenabidii/amenabidii.github.io/main/amenos-config.json", {signal:AbortSignal.timeout(2500)})
      .then(r=>r.ok?r.json():null).then(c=>c?.endpoint || "").catch(()=>{endpoint=null;return "";});
    return endpoint;
  }
  async function answer(text, language, render) {
    const url=await getEndpoint();
    if (!url) return null;
    const user={role:"user",content:text.slice(0,400)};
    const response=await fetch(url,{method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({messages:[...history,user],language}),signal:AbortSignal.timeout(30000)});
    if (!response.ok) {
      const detail = await response.json().catch(() => ({}));
      throw Object.assign(new Error("AI unavailable"), {code: detail.code});
    }
    const reader=response.body.pipeThrough(new TextDecoderStream()).getReader();
    const marker="[[ASK_AMEN]]";
    let buffer="",result="",complete=false;
    try {
      while(!complete){
        const {done,value}=await reader.read();
        if(done) break;
        buffer+=value;
        let end;
        while((end=buffer.indexOf("\n"))>=0){
          const line=buffer.slice(0,end).trimEnd();buffer=buffer.slice(end+1);
          if(!line.startsWith("data:"))continue;
          const payload=line.slice(5).trim();
          if(payload==="[DONE]")continue;
          const event=JSON.parse(payload);
          if(event.type==="response.output_text.delta" || event.type==="response.refusal.delta"){
            result+=event.delta;
            if(!marker.startsWith(result.trimStart()))render(result.trimStart().replace(/^\[\[ASK_AMEN\]\]\s*/,""));
          }
          if(event.type==="response.completed")complete=true;
          if(["error","response.failed","response.incomplete"].includes(event.type))throw Error("Incomplete reply");
        }
      }
    } finally {await reader.cancel();}
    if(!complete || !result.trim())throw Error("Empty reply");
    const referral=result.trimStart().startsWith(marker);
    const content=result.trim().replace(/^\[\[ASK_AMEN\]\]\s*/,"");
    history.push(user,{role:"assistant",content:content.slice(0,1600)});
    if(history.length>8)history.splice(0,2);
    return {content,referral};
  }
  return {answer};
})();

import { instructions } from "./instructions.mjs";

const origin = "https://amenabidii.github.io";
const languages = new Set(["auto","en","fr","tn","ar-TN","ar-EG"]);
export default {
  async fetch(request, env) {
    const headers = {"Access-Control-Allow-Origin":origin,"Vary":"Origin","Cache-Control":"no-store"};
    const error = (status, message) => Response.json({error:message},{status,headers});
    if (new URL(request.url).pathname !== "/chat") return error(404,"Unknown route");
    if (request.headers.get("Origin") !== origin) return error(403,"Unknown origin");
    if (request.method === "OPTIONS") return new Response(null,{headers:{...headers,"Access-Control-Allow-Methods":"POST","Access-Control-Allow-Headers":"Content-Type"}});
    if (request.method !== "POST") return error(405,"Use POST");
    if (!env.OPENAI_API_KEY) return error(503,"AI unavailable");
    if (!request.headers.get("Content-Type")?.startsWith("application/json")) return error(415,"Expected JSON");
    if (!(await env.VISITOR_LIMIT.limit({key:request.headers.get("CF-Connecting-IP") || "unknown"})).success) return error(429,"Please pause before asking again");
    let data;
    try {
      const reader=request.body.getReader(), decoder=new TextDecoder();
      let size=0, raw="";
      while(true){
        const {done,value}=await reader.read(); if(done) break;
        size+=value.length;
        if(size>24000){await reader.cancel();return error(413,"Conversation too large");}
        raw+=decoder.decode(value,{stream:true});
      }
      data=JSON.parse(raw+decoder.decode());
    } catch { return error(400,"Invalid message"); }
    const turns=data?.messages;
    if (!languages.has(data?.language) || !Array.isArray(turns) || turns.length<1 || turns.length>9 || turns.length%2!==1 ||
      turns.some((t,i)=>t?.role!==(i%2?"assistant":"user") || typeof t.content!=="string" || !t.content.trim() || t.content.length>(i%2?1600:400))) return error(400,"Invalid conversation");
    if (!(await env.SITE_LIMIT.limit({key:"portfolio"})).success) return error(429,"Chat is busy");
    try {
      const upstream=await fetch("https://api.openai.com/v1/responses",{
        method:"POST",headers:{Authorization:"Bearer "+env.OPENAI_API_KEY,"Content-Type":"application/json"},
        body:JSON.stringify({model:env.OPENAI_MODEL,instructions:instructions+"\nReply language preference: "+data.language,input:turns.map(({role,content})=>({role,content})),max_output_tokens:450,store:false,stream:true}),signal:request.signal
      });
      if(!upstream.ok) return error(503,"AI unavailable");
      return new Response(upstream.body,{headers:{...headers,"Content-Type":"text/event-stream"}});
    } catch { return error(503,"AI unavailable"); }
  }
};

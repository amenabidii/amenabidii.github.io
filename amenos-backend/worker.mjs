import { instructions } from "./instructions.mjs";

import { greetingReply } from "./greetings.mjs";
import { portfolioNotes } from "./portfolio-notes.mjs";

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
    if (!env.AI) return error(503,"AI unavailable");
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
      let answer = greetingReply(turns.at(-1).content, data.language);
      if (!answer) {
        const messages = [
          {role: "system", content: instructions + "\nAdditional published portfolio entries (first-person statements are Amen’s):\n" + portfolioNotes.join("\n") + "\nReply language preference: " + data.language},
          ...turns.map(({role, content}) => ({role, content}))
        ];
        const result = await env.AI.run("@cf/meta/llama-3.1-8b-instruct-fp8-fast", {
          messages, max_tokens: 450, temperature: 0.2
        });
        answer = result.response;
      }
      if (!answer?.trim()) return error(503, "AI unavailable");
      const events = [
        {type: "response.output_text.delta", delta: answer},
        {type: "response.completed"}
      ];
      return new Response(events.map(event => "data: " + JSON.stringify(event) + "\n\n").join(""), {
        headers: {...headers, "Content-Type": "text/event-stream"}
      });
    } catch (cause) {
      if (/neurons|daily (?:free )?(?:limit|allocation|quota)/i.test(cause.message || "")) {
        return Response.json({code:"daily_quota"}, {status:429, headers});
      }
      return error(503,"AI unavailable");
    }
  }
};

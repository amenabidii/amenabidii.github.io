const inquiry=document.querySelector("#inquiry"), inquiryForm=document.querySelector("#inquiry-form");
const domain=["Standard .com domain","$11.81 / year","https://porkbun.com/tld/com"];
const pilots={
 Lapwise:{index:2,challenge:"Lapwise needs continuous hosting and a persistent SQLite volume so accounts and lap history survive a restart. A larger community would require tested backups and a database migration plan.",rows:[["Railway Pro pilot, compute and volume usage within included credit","$20 / month minimum","https://railway.com/pricing"],["SQLite software","$0","https://sqlite.org/copyright.html"],domain],total:"$71.81"},
 "Fly-QR":{index:0,challenge:"A direct transfer keeps traffic off the relay. Shared or restricted networks can force a relay, raising bandwidth and Redis costs.",rows:[["Vercel Pro, one developer seat","$20 / month","https://vercel.com/pricing"],["Redis Cloud Essentials, entry tier","from $5 / month","https://redis.io/pricing/"],domain],total:"$86.81"},
 VentureLab:{index:1,challenge:"The local Docker and Ollama demo can run on existing hardware. This scenario funds a shared CPU demo. Before opening it widely, the team needs to benchmark model memory, latency and simultaneous founders.",rows:[["16 GiB, eight-vCPU demo VM with SSD","$96 / month","https://www.digitalocean.com/pricing/droplets"],["Local inference on the same VM","$0 separate API charge","https://ollama.com/"],domain],total:"$299.81"}
};
let inquiryKind="",selectedPilot="";
function showInquiry(kind,project=""){
 if(inquiry.dataset.busy)return;
 inquiryKind=kind;selectedPilot=project;inquiryForm.reset();
 document.querySelector("#inquiry-title").textContent=project?"Invest in "+project:kind==="Hiring"?"Tell me about the position":"Let’s build something together";
 document.querySelector("#opportunity-label").textContent=kind==="Hiring"?"Organization and role":project?"Organization or area of interest":"Project or idea";
 document.querySelector("#brief-label").textContent=kind==="Hiring"?"Responsibilities, location and timing":project?"What would you like to discuss?":"Your idea, timing and how you’d like to work together";
 document.querySelector("#inquiry-status").textContent="";
 const box=document.querySelector("#funding");box.replaceChildren();
 if(project){
  const plan=pilots[project],note=document.createElement("p");note.textContent=plan.challenge;
  const table=document.createElement("table");table.innerHTML="<caption>Illustrative three-month launch budget · USD</caption><thead><tr><th>Item and price source</th><th>Unit cost</th></tr></thead>";
  const body=table.createTBody();
  for(const [label,cost,url] of plan.rows){const row=body.insertRow(),source=document.createElement("a");source.href=url;source.textContent=label;row.insertCell().append(source);row.insertCell().textContent=cost;}
  const foot=table.createTFoot().insertRow();foot.insertCell().textContent="Three months + one year of domain";foot.insertCell().textContent=plan.total;
  const limits=document.createElement("p");limits.textContent="Planning estimate at November 2026 rates, before taxes, usage overages, outreach and labor. Actual costs depend on demand.";
  const terms=document.createElement("p");terms.textContent="Contact me for the rollout plan and to discuss a potential share of future earnings if the project succeeds. Any revenue share depends on a separate agreement and actual revenue.";
  box.append(note,table,limits,terms);
 }
 inquiry.showModal();
}
document.querySelectorAll("[data-inquiry]").forEach(b=>b.onclick=()=>showInquiry(b.dataset.inquiry));
for(const [name,plan] of Object.entries(pilots)){
 const b=document.createElement("button");b.type="button";b.textContent="Invest in this project";b.onclick=()=>showInquiry("Investment inquiry",name);projectCards[plan.index].querySelector(".exhibit-actions").append(b);
}
inquiry.querySelector(".dismiss").onclick=()=>inquiry.close();
inquiry.addEventListener("cancel",e=>{if(inquiry.dataset.busy)e.preventDefault();});
inquiryForm.onsubmit=async e=>{
 e.preventDefault();if(inquiry.dataset.busy||!inquiryForm.reportValidity())return;
 const f=inquiryForm.elements,status=document.querySelector("#inquiry-status");
 const email=f.email.value.trim(),details=[inquiryKind,selectedPilot,f.sender.value.trim(),f.opportunity.value.trim(),f.brief.value.trim()].filter(Boolean).join("\n\n");
 inquiry.dataset.busy="1";const controls=[...inquiry.querySelectorAll("input,textarea,button")];controls.forEach(c=>c.disabled=true);
 status.textContent="Sending…";
 try{
  const res=await fetch("https://formsubmit.co/ajax/amenabidii@aucegypt.edu",{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({email,message:details,_subject:"Portfolio · "+inquiryKind+(selectedPilot?" · "+selectedPilot:"")}),signal:AbortSignal.timeout(20000)});
  const receipt=await res.json();if(!res.ok||String(receipt.success)!=="true")throw Error();
  inquiryForm.reset();status.textContent="The email service accepted your message for Amen.";
 }catch{status.textContent="Delivery could not be confirmed. Your details are still here. You can also contact Amen at the email below.";}
 finally{delete inquiry.dataset.busy;controls.forEach(c=>c.disabled=false);}
};

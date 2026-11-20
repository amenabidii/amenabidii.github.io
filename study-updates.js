// Five-number summaries from the project's descriptive statistics (N = 80,000).
const studyMeasures={
 reaction:{unit:"ms",values:[200,300.15,400.36,499.25,599.99],note:"The middle half of reaction times spanned about 199 ms. Comparing the two sleep groups gave a very small effect (Cohen’s d = 0.013, p = 0.0601)."},
 memory:{unit:"points",values:[40,55,70,85,99],note:"Half of memory scores fell between 55 and 85. The high- and low-stress groups had nearly identical average scores (Cohen’s d = −0.003, p = 0.6423)."},
 screen:{unit:"h/day",values:[1,3.8,6.5,9.2,12],note:"Higher daily screen time was associated with lower cognitive scores (r = −0.1985). The strength of that relationship varied by exercise frequency (interaction p = 0.0116)."},
 sleep:{unit:"hours",values:[4,5.5,7,8.5,10],note:"Median sleep duration was seven hours. In the report’s median-split comparison, reaction times differed little between the two sleep groups."}
};
const selectMeasure=document.querySelector("#measure");
function renderStudy(){
 const {values,unit,note}=studyMeasures[selectMeasure.value];
 const plot=document.querySelector(".quartiles"),output=document.querySelector("#stat-values");
 const pct=v=>100*(v-values[0])/(values[4]-values[0])+"%";
 plot.style.setProperty("--q1",pct(values[1]));plot.style.setProperty("--q3",pct(values[3]));plot.style.setProperty("--median",pct(values[2]));
 output.replaceChildren();
 ["Min","25th","Median","75th","Max"].forEach((label,i)=>{const cell=document.createElement("span");const value=document.createElement("strong");value.textContent=values[i]+" "+unit;cell.append(label,value);output.append(cell);});
 document.querySelector("#stat-note").textContent=note;
}
selectMeasure.onchange=renderStudy;renderStudy();
const signup=document.querySelector("#subscribe-form");
signup.onsubmit=async event=>{
 event.preventDefault();
 if(!signup.reportValidity()||signup.dataset.busy)return;
 const email=signup.elements.email.value.trim(),date=new Date().toISOString();
 const status=document.querySelector("#subscribe-status"),controls=[...signup.elements];
 signup.dataset.busy="1";controls.forEach(el=>el.disabled=true);status.textContent="Submitting…";
 try{
  const res=await fetch("https://formsubmit.co/ajax/amenabidii@aucegypt.edu",{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({email,consent:"I agree to receive email from Amen about new projects and major portfolio updates.",signup_date:date,_subject:"Portfolio updates · opt-in request"}),signal:AbortSignal.timeout(20000)});
  const receipt=await res.json();if(!res.ok||String(receipt.success)!=="true")throw Error();
  signup.reset();status.textContent="Your signup request was accepted for delivery to Amen.";
 }catch{status.textContent="The signup could not be confirmed. Please retry or email Amen to request updates.";}
 finally{delete signup.dataset.busy;controls.forEach(el=>el.disabled=false);}
};

const honors=[
 {image:"tl",caption:"Welcome dinner for the new Tomorrow’s Leaders cohort",post:"7513679790877515777",tag:"Scholarship",name:"Tomorrow’s Leaders",year:"2025",body:"Selected from more than 1,000 Tunisian applicants for a fully funded undergraduate scholarship supported by MEPI.",action:"Open the award letter",room:"campus"},
 {image:"verinews",caption:"VeriNews project logo",tag:"Hackathon",name:"VeriNews",year:"2022",body:"Our fact-checking prototype took first place in MENA at Digital Innovations for Peace. I was responsible for website design and development.",action:"Launch the prototype story",room:"studio"},
 {tag:"Academics",name:"National Baccalaureate Excellence",year:"2024",body:"I scored 18.15/20, ranked first regionally in Computer Science and 30th among 6,800 students nationally.",action:"Unfold the results sheet",room:"research"},
 {image:"par",caption:"Participatory Action Research with UNICEF Tunisie",post:"7441940176433684480",tag:"Research",name:"P.A.R. Kasserine",year:"2022",body:"Our 12-person research team worked with more than 240 young people. I co-led a climate petition that gathered over 400 signatures.",action:"Reassemble the field notes",room:"field"},
 {image:"fye",caption:"First Year Experience orientation at AUC",post:"7502075407463116800",tag:"Leadership",name:"First Year Experience",year:"2026",body:"I co-guided 49 incoming students at AUC, introducing university resources and helping them settle in.",action:"Open the orientation map",room:"campus"},
 {image:"finomics",caption:"Finomics stock market simulation at AUC",post:"7510346015758036992",tag:"Finance",name:"Finomics simulation",year:"2026",body:"Across ten simulated trading sessions, I managed a virtual EGP 250,000 portfolio, returned 22% and finished in the top five.",action:"Read the trading journal",room:"work"},
 {image:"musicana",caption:"Musicana at AUC’s Ramadan iftar packing event",post:"7432898243820179457",tag:"Music",name:"AUC Musicana",year:"Campus life",body:"I performed at more than 15 university events and received recognition from AUC President Ahmad Dallal.",action:"Lift the piano lid",room:"music"}
];
const highlights=document.querySelector("#honors-list");
for(const h of honors){
 const li=document.createElement("li"),tag=document.createElement("span");
 tag.className="award-tag "+h.tag.toLowerCase();tag.textContent=h.tag;
 const desc=document.createElement("details"),summary=document.createElement("summary"),title=document.createElement("strong"),p=document.createElement("p");
 title.textContent=h.name+" · "+h.year;p.textContent=h.body;summary.append(tag,title);desc.append(summary,p);li.append(desc);if(h.image){
   const figure=document.createElement("figure"),image=document.createElement("img"),caption=document.createElement("figcaption");
   image.src="honors/"+h.image+".webp";image.alt=h.caption;image.loading="lazy";
   caption.textContent=h.caption;
   if(h.post){
     const link=document.createElement("a");link.href="https://www.linkedin.com/feed/update/urn:li:activity:"+h.post+"/";
     link.textContent="View post";caption.append(" · ",link);
   }figure.append(image,caption);desc.append(figure);
 }
 highlights.append(li);
}
const activityStories = [
  {tag:"Scholarship", match:/welcome dinner|new cohort|usher|welcome.*leader/i, post:"7513679790877515777", title:"Welcoming 55 new scholars", text:"I ushered at the welcome dinner for 55 new students from across MENA. Meeting the incoming cohort reminded me how unfamiliar AUC felt when I first arrived."},
  {tag:"Scholarship", match:/symposium|fundrais|triple i|evidence to action/i, post:"7454159851665989632", title:"From evidence to action", text:"For the April 18–19 Tomorrow’s Leaders Symposium, I reached out to NGOs and partners on the fundraising committee. A panel on research in MENA introduced me to three barriers to putting evidence into policy: ignorance, inertia and ideology. Timing and communication stayed with me as much as the research itself."},
  {tag:"Scholarship", match:/team.building|sherief/i, post:"7429160337079345152", title:"Preparing for the symposium", text:"The Tomorrow’s Leaders committees started preparing with a team-building session led by former team member Sherief Khalil and the TL staff. The activities focused on communication, trust and sharing responsibility across committees."},
  {tag:"Leadership", match:/first year|orientation|peer moderat|\bfye\b|haitham|jana shahin/i, post:"7502075407463116800", title:"Helping a group of 49 find its feet", text:"Haitham Ahmed Aloqab, Jana Shahin and I guided 49 students during orientation for a class of over 1,400 freshmen. We ran activities, answered questions and helped the quieter students feel comfortable joining in."},
  {tag:"Finance", match:/finomics|trading simulation|broker|market simulation/i, post:"7510346015758036992", title:"When a simulated order fails", text:"In the AUC Business Association simulation, participants moved prices through supply and demand. Missed trades and failed orders taught me how liquidity, timing and commissions affect a decision. Sessions with NAEEM Holding, Beltone and Wadi Degla Developments brought an industry perspective to the exercise."},
  {tag:"Music", match:/iftar|ramadan|packing/i, post:"7432898243820179457", title:"Piano after the packing shift", text:"I played piano with Musicana at AUC’s Ramadan iftar packing event. Across 43 student organizations, volunteers prepared over 6,000 packs for families in Egypt. President Ahmad Dallal and Dean of Students Yorgun Marcel joined the event."},
  {tag:"Music", match:/culturefest|tahrir|musicana/i, post:"7453509800308502528", title:"On stage at Tahrir CultureFest", text:"I performed with Musicana at Tahrir CultureFest 2026. Between performances I explored immersive VR and listened to conversations with Amr Mostafa and Sherif Nouredin about culture, creativity and Cairo."},
  {tag:"Research", match:/unicef|activism|fieldwork|radhia|participatory action/i, post:"7441940176433684480", title:"Where my activism began", text:"Participatory Action Research with UNICEF Tunisie was my first experience working alongside professionals on a community issue. It gave me the confidence to take on more advocacy work. Radhia Louhichi helped make that first opportunity possible."}
];
for(const story of activityStories){
  const row=Array.from(highlights.children).find(li=>li.querySelector(".award-tag").textContent===story.tag);
  const details=document.createElement("details"),summary=document.createElement("summary"),p=document.createElement("p"),link=document.createElement("a");
  summary.textContent=story.title;p.textContent=story.text;link.textContent="Read the LinkedIn post";
  link.href="https://www.linkedin.com/feed/update/urn:li:"+ (story.post==="7429160337079345152"?"ugcPost":"activity")+":"+story.post+"/";
  details.append(summary,p,link);row.lastElementChild.append(details);
}

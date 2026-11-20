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
 const desc=document.createElement("div"),title=document.createElement("strong"),p=document.createElement("p");
 title.textContent=h.name+" · "+h.year;p.textContent=h.body;desc.append(title,p);li.append(tag,desc);if(h.image){
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

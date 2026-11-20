const guide = document.querySelector("#guide");
const question = document.querySelector("#question");
const conversation = document.querySelector("#conversation");
const form = document.querySelector("#ask-form");
const topics = [
  [/fly\s*-?\s*qr|file shar|webrtc/i, "Fly-QR", "Rooms expire after 20 minutes. Scanning a code or entering an eight-character key connects the devices. Transfers up to 100 MB use WebRTC with a Socket.IO fallback."],
  [/venture\s*lab|hackathon|founder/i, "VentureLab", "One agent gathers evidence and another challenges assumptions. A rules-based judge can ask the founder to repeat, pivot, stop or proceed. The builder needs founder approval before writing its prototype."],
  [/lapwise|stopwatch|pomodoro/i, "Lapwise", "I wanted one clock for an entire session. If I finish one chapter and start the next, each gets its own lap. A break pauses the current lap. Friends can compare progress and challenge each other."],
  [/youtube|mix blocker/i, "YouTube Mix Blocker", "It distinguishes an automatically attached radio queue from a Mix the listener chose. All processing happens in the browser."],
  [/observer|paradox|c\+\+|game/i, "The Observer Paradox", "This C++17 class prototype takes place at fictional ECHO-7. A turn can trigger a transmission or equipment event. Undo restores the world snapshot while the Observer keeps its memory."],
  [/cogniti|sleep|reaction|memory/i,"Cognitive performance"],
  [/study room|booking/i,"Study room booking"],
  [/social media|productivity analysis/i,"Social media & productivity"],
  [/soutra|reproductive/i,"SOUTRA"],
  [/climate|activis|petition|unicef/i,"#activism","In Kasserine, we also facilitated climate and renewable-energy workshops using participatory tools. I helped plan advocacy campaigns with local authorities."],
  [/accessib|disabilit|election/i,"#access","The Humanity & Inclusion assessment covered at least eight public and private facilities. The election observations were a separate activity."],
  [/mentor|orientation|campus|education|scholar|studying/i,"#campus","I study Data Science at the American University in Cairo, with minors in Computer Science and Business Administration. I expect to graduate in December 2028. My coursework includes statistical inference, applied probability and machine learning."],
  [/piano|pianist|music|stage/i,"#piano"],
  [/e-?mail|contact|reach (you|him|amen)|get in touch/i,"#contact","Email Amen at amenabidii@aucegypt.edu."],
  [/currently|right now|doing now|do now|these days|at the moment/i,"#campus","Amen studies Data Science at the American University in Cairo, with minors in Computer Science and Business Administration. He is seeking a summer 2027 internship."],
  [/skill|tech stack|technologies/i,"#work","Amen works with Python, C++, JavaScript, R and SQL. His web projects use React, Node.js, WebRTC and Redis. His analysis work uses Pandas, ggplot2, ANOVA and regression."],
  [/internship|hire|opportunit/i,"#contact"],
  [/project|portfolio|built/i,"#work","Try Fly-QR for browser networking, Lapwise for time tracking, or The Observer Paradox for C++ and interactive fiction."],
  [/activities|extracurricular|fieldwork/i,"#about","Ask about the climate petition, accessibility assessments, campus mentoring or Musicana."],
];
const outside = "That’s outside my portfolio notes. Try a question about my projects, community work, education or music.";
let lastTopic;
let pending;
async function reply(text) {
  if (/^(hey|hi|hello|salaam)[!. ]*$/i.test(text)) return "Hi, I’m Amenos. Ask me about Amen’s projects, studies, music or fieldwork.";
  if (/recipe|weather|politics|stock price/i.test(text)) return outside;
  const followUp = /^(tell me more|more|what else|go on)[?.! ]*$/i.test(text);
  let topic = followUp ? lastTopic : topics.find(([pattern]) => pattern.test(text));
  if (!topic && !followUp) {
    topic = quickMatch(text);
    if (!topic) {
      warmSearch();
      if (!modelReady) return "Which part of Amen’s portfolio do you mean? Try a project name, his degree, skills, music or community work.";
      topic = await semanticTopic(text);
    }
  }
  if (!topic || /ignore .*instructions|write (a|me)|recipe|weather|politics|stock price/i.test(text)) {
    lastTopic = null;
    return outside;
  }
  const [,target,extra] = topic;
  const source = target.startsWith("#") ? document.querySelector(target)
    : [...document.querySelectorAll("details")].find(item => item.querySelector("summary").textContent.startsWith(target));
  const paragraphs = source ? [...source.querySelectorAll("p")] : [];
  const base = paragraphs.map(p => p.textContent.trim()).slice(0,2).join(" ");
  const answer = followUp ? (base || extra) : (extra || base);
  lastTopic = topic;
  return answer || outside;
}
function message(text, className) {
  const p = document.createElement("p");
  p.dir="auto";
  p.className = className;
  p.textContent = text;
  conversation.append(p);
  conversation.scrollTop = conversation.scrollHeight;
  return p;
}
async function ask(text, topicId) {
  if (!text || pending) return;
  message(text, "visitor");
  pending = true;
  const bubble = message("Amenos is typing…", "answer");
  guide.classList.add("thinking");
  try {
    const [answer] = await Promise.all([localizedReply(text,topicId),new Promise(done => setTimeout(done,650))]);
    bubble.dir="auto";
    bubble.textContent = answer;
    if (offerReferral) appendDraftButton(bubble,text);
  } catch {
    bubble.textContent = "My search is unavailable. Try an email, project or activity suggestion.";
  } finally {
    guide.classList.remove("thinking");
    conversation.scrollTop = conversation.scrollHeight;
    pending = null;
  }
}
const launcher = document.querySelector("#ask-amen");
launcher.onclick = () => {
  if (guide.open) return guide.close();
  guide.show();
  suggestQuestions();
  warmSearch();
  launcher.setAttribute("aria-expanded", "true");
  question.focus({preventScroll:true});
};
guide.addEventListener("close", () => { launcher.setAttribute("aria-expanded","false"); launcher.focus({preventScroll:true}); });
guide.addEventListener("keydown", event => { if (event.key === "Escape") guide.close(); });
document.querySelector("#close-guide").onclick = () => guide.close();
form.onsubmit = event => {
  event.preventDefault();
  if (pending || !question.value.trim()) return;
  ask(question.value.trim());
  question.value = "";
};
function suggestQuestions() {
  if (conversation.querySelector(".chat-choices")) return;
  const intro=message("Want a starting point? Pick a question or write your own.", "answer");
  const choices=document.createElement("span");
  choices.className="chat-choices";
  for(const title of ["Why did Amen create Fly-QR?", "What does Amen do now?", "Which skills does Amen use?", "Tell me about the climate petition"]) {
    const button=document.createElement("button");
    button.type="button";
    button.textContent=title;
    button.onclick=()=>ask(title);
    choices.append(button);
  }
  intro.append(choices);
}
// Keep inference off the page thread. Exact questions stay available offline.
let searchWorker;
const topicQuestions = [
  "How can I send a document from a phone to a computer at the library?",
  "How do you evaluate business ideas with agents and founder approvals?",
  "How does the stopwatch track time spent on each task?",
  "Can I stop automatic music queues in my browser?",
  "Tell me about the interactive fiction simulation in the Western Desert.",
  "How did the team analyse stress and cognitive performance?",
  "What did Amen build for reserving rooms at university?",
  "What research explored productivity and screen habits?",
  "What digital health platform did he design?",
  "What environmental advocacy and local climate action did he take part in?",
  "How did he help assess barriers for disabled voters?",
  "Where does he attend university and what degree is he pursuing?",
  "Does he play a musical instrument or perform live?",
  "How can someone get in touch with him? What is his email address?",
  "What does Amen do these days? What is he working on now?",
  "What programming languages and developer tools does he know?",
  "Is he looking for work experience or summer internships?",
  "Which software projects has he made?",
  "What does he do outside of classes?"
];
// A lightweight weighted index handles paraphrases even before the model loads.
const stopWords = new Set("how can i a an the of to for in my your at from and or his he she him you me do does did do what which when where who are is am on it with has have amen about tell during that these".split(" "));
function words(text) {
  return new Set((text.toLowerCase().match(/[a-z0-9]+/g) || []).filter(word => !stopWords.has(word)));
}
const examples = [
  "transfer files devices sending documents sharing", "startup validate idea business founders",
  "timers task tracking laps productivity tracker", "browser extension playlist video",
  "fiction story game undo simulation", "memory sleep stress dataset",
  "reserve rooms reservation library booking", "screen habits productivity analysis",
  "health platform reproductive Tunisia", "climate petition advocacy environment",
  "accessibility disability barriers voters", "degree university college major graduation studying studies school education",
  "instrument performances pianist concert stage music", "email address contact reach message",
  "currently today doing now lately present occupation", "languages tools programming skills stack coding",
  "job internship employment summer hiring", "projects apps software builds", "extracurricular volunteering hobbies free time"
];
const quickIndex = topicQuestions.map((question,i) => words(question+" "+examples[i]));
function quickMatch(text) {
  const terms = words(text);
  const scores = quickIndex.map((entry,index) => {
    let score = 0;
    for (const term of terms) {
      if (entry.has(term)) score += Math.log((quickIndex.length+1) / quickIndex.filter(row => row.has(term)).length);
    }
    return {index,score};
  }).sort((a,b) => b.score-a.score);
  const [best,next] = scores;
  return best.score >= 2.9 && best.score-next.score >= 1 ? topics[best.index] : undefined;
}
let modelReady = false;
function warmSearch() {
  if (searchWorker) return;
  try {
    searchWorker = new Worker("semantic-worker.js",{type:"module"});
    searchWorker.onmessage = event => { modelReady = event.data === "ready"; };
    searchWorker.onerror = () => { modelReady = false; };
    searchWorker.postMessage({questions:topicQuestions});
  } catch { modelReady = false; }
}
function semanticTopic(text) {
  return new Promise(resolve => {
    const timeout = setTimeout(() => {
      modelReady = false;
      searchWorker.terminate();
      searchWorker = null;
      resolve(undefined);
    },1500);
    searchWorker.onmessage = event => { clearTimeout(timeout); resolve(topics[event.data]); };
    searchWorker.postMessage({text});
  });
}


function replyAbout(id) {
  if (id === 19) return "Amen is interested in computer vision, robot perception, distributed systems and trustworthy AI. These are research interests. His completed research includes statistical studies of cognition and productivity.";
  lastTopic=topics[id];
  const [,target,extra]=lastTopic;
  const card=target.startsWith("#") ? document.querySelector(target) : projectCards[id];
  return [...new Set([card?.querySelector("p")?.textContent,extra].filter(Boolean))].join(" ");
}

let offerReferral=false;
const escalate=[
 "That’s a brilliant question for Amen. I don’t have that detail in my notes. Edit a draft below or email amenabidii@aucegypt.edu.",
 "Excellente question pour Amen ! Je n’ai pas ce détail. Tu peux modifier ton brouillon ci-dessous ou écrire à amenabidii@aucegypt.edu.",
 "Sou2el behi barcha! Ma 3andich el détail hedha. Tnajjem tbaddel el message w tab3athou l Amen: amenabidii@aucegypt.edu.",
 "سؤال باهي برشا! ما عنديش التفصيل هذا. تنجّم تبدّل المساج وتبعثه لآمن: amenabidii@aucegypt.edu.",
 "سؤال حلو أوي! التفصيلة دي مش عندي. تقدر تعدّل الرسالة وتبعتها لآمن: amenabidii@aucegypt.edu."
];
async function localizedReply(text,topicId) {
  offerReferral=false;
  const choice=document.querySelector("#language").value;
  const locale=topicId===undefined ? detectLanguage(text) : (choice==="auto" ? conversationLocale : choice);
  conversationLocale=locale;
  const col=localeNames.indexOf(locale);
  const opener=col<0?"":languageOpeners[col]+" ";
  const missing=()=>{offerReferral=true;return opener+escalate[col+1];};
  if(topicId===undefined && /salary|budget|how much|combien coûte|salaire|prix|قداش يكلّف|مرتب|بكام|تكلفة|funding|revenue|daily users|personal phone/i.test(text)) return missing();
  if(topicId===undefined && /recipe|weather|politics|stock price|طقس|ماتش|météo|recette/i.test(text)) return ["I cover Amen’s portfolio. Try a project, his studies or his music.","Je réponds sur le parcours d’Amen. Demande-moi un projet ou ses études.","Nahki 3la parcours mta3 Amen. Es2elni 3al 9raya walla projet.","نحكي على مسيرة آمن. اسألني على القراية وإلا مشروع.","أنا هنا عشان أحكي عن آمن. اسألني عن دراسته أو مشاريعه."][col+1];
  const origin = projectOrigin(text,col);
  if(origin) return opener+origin;
  if(col<0){
    if(topicId===19 || /research interests|robot perception|interested in/i.test(text)) return replyAbout(19);
    const answer=topicId===undefined ? await reply(text) : replyAbout(topicId);
    return answer===outside || answer.startsWith("Which part") ? missing() : answer;
  }
  if(/^(bonjour|salut|aslema|salem|عسلامة|أهلا|اهلا|ازيك)[!.؟ ]*$/i.test(text)) return opener;
  let id=topicId;
  if(id===undefined) {
    id=localeTopics.findIndex(pattern=>pattern.test(text));
    if(id<0) id=topics.findIndex(([pattern])=>pattern.test(text));
    if(id<0 && /encore|زيد|zid|كمان/i.test(text)) id=topics.indexOf(lastTopic);
    if(id<0 && modelReady) id=topics.indexOf(await semanticTopic(text));
  }
  if(!translations[id]) return missing();
  lastTopic=topics[id];
  return opener+translations[id][col];
}
const handoff=document.querySelector("#handoff");
function appendDraftButton(bubble,text){
  const button=document.createElement("button");
  button.textContent=["Draft a question","Préparer un message","Ekteb l Amen","اكتب لآمن","اكتب لآمن"][localeNames.indexOf(conversationLocale)+1];
  button.type="button";
  button.onclick=()=>{
    if(handoff.hidden) handoff.elements.message.value=text;
    handoff.hidden=false;
    handoff.elements.message.focus();
  };
  bubble.append(document.createElement("br"),button);
}
document.querySelector("#discard").onclick=()=>{handoff.reset();handoff.hidden=true;};
handoff.onsubmit=async event=>{
  event.preventDefault();
  if(handoff.dataset.sending || !handoff.reportValidity()) return;
  const email=handoff.elements.email.value.trim();
  const question=handoff.elements.message.value.trim();
  const status=document.querySelector("#send-status");
  if(!question){status.textContent="Please enter a question.";return;}
  handoff.dataset.sending="true";
  const fields=[...handoff.querySelectorAll("button,input,textarea")];
  fields.forEach(field=>field.disabled=true);
  status.textContent="Sending…";
  try {
    const response=await fetch("https://formsubmit.co/ajax/amenabidii@aucegypt.edu",{
      method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},
      body:JSON.stringify({email,message:question,_subject:"Amenos · Visitor question"}),
      signal:AbortSignal.timeout(20000)
    });
    const receipt=await response.json();
    if(!response.ok || String(receipt.success)!=="true") throw new Error("Submission unavailable");
    handoff.reset();
    handoff.hidden=true;
    message("The email service accepted your question for Amen.","answer");
    status.textContent="";
  } catch {
    status.textContent="Delivery could not be confirmed. Your draft is saved here while this page is open.";
  } finally {
    delete handoff.dataset.sending;
    fields.forEach(field=>field.disabled=false);
  }
};
function projectOrigin(text,col) {
  if(!/why|motivat|inspir|reason|pourquoi|3lech|3lash|alech|3leh|leeh|علاش|ليه|سبب/i.test(text)) return "";
  if(/fly[\s‐‑–-]*qr/i.test(text) || (lastTopic===topics[0] && /^(why|pourquoi|علاش|ليه)[ ؟?!.]*$/i.test(text))){
    lastTopic=topics[0];
    return [
      "Fly-QR started with a printing problem. At a university library or printing centre, getting a file from a phone to a shared computer could mean signing into a personal messaging account. Amen built a temporary QR-linked room so you can send the file, print it and end the session without that login.",
      "Au départ, il voulait simplement imprimer un fichier. À la bibliothèque, transférer un document du téléphone vers un ordinateur partagé pouvait demander une connexion à sa messagerie personnelle. Il a donc créé une salle temporaire accessible par QR code.",
      "El fekra jet mel impression fel bibliothèque. Bech yhez fichier mel téléphone lel PC elli yesta3mlouh ennes lkol, ken يلزمو y7ell compte personnel. 3mal Fly-QR bech yscan(i) code, yab3ath el fichier w ysakker el session.",
      "الحكاية بدات في الطباعة في المكتبة. باش يعدّي ملف من التليفون للـPC المشترك، كان يلزمو يحلّ حساب الميساجات متاعو. عمل Fly-QR باش يسكانّي كود ويعدّي الملف ويسكّر الجلسة.",
      "الفكرة بدأت من الطباعة في المكتبة. عشان ينقل ملف من الموبايل لكمبيوتر مشترك، كان ممكن يضطر يفتح حساب الرسايل الشخصي. عمل Fly-QR عشان يمسح كود ويبعت الملف ويقفل الجلسة."
    ][col+1];
  }
  const motives = [
    [/lapwise/i,["Amen wanted a timer that could follow a whole session without making him restart it for every task. Recording each completed task as a lap solved that problem.","Amen voulait suivre toute une séance sans relancer le minuteur à chaque tâche. Chaque tâche terminée devient un tour chronométré.","7ab timer yetba3 séance kemla bla ma y3awed ystartih fi kol tâche. Kol tâche wallét lap.","حبّ تايمر يتبع الحصّة الكل من غير ما يعاود يشعلو لكل مهمّة. كل مهمّة تولّي دورة بوقتها.","كان عايز مؤقت يتابع الجلسة كلها من غير ما يبدأه تاني لكل مهمة. كل مهمة بقى ليها لفة بوقتها."]],
    [/study room|réservation|حجز/i,["Amen noticed problems managing study-room reservations and availability at AUC. He turned those observations into requirements, secured university approval and completed the booking solution as a volunteer.","Amen a observé des difficultés de réservation à la bibliothèque. Il les a traduites en exigences, obtenu l’accord de l’université et réalisé la solution bénévolement.","Chaf mochkla fel réservation fel bibliothèque. 7added el besoins, khdha موافقة el fac w kammel el solution bénévole.","شاف مشاكل في حجز قاعات القراية، حدّد المطلوب وخذا موافقة الجامعة وكمّل الحلّ بالتطوّع.","لاحظ مشاكل في حجز قاعات المذاكرة. حدّد المطلوب، خد موافقة الجامعة وكمّل الحل كمتطوع."]],
    [/youtube|mix blocker/i,["Opening a single song could unexpectedly attach an entire Mix. Amen wanted to keep that song and its timestamp while preserving playlists people actually chose.","Ouvrir un morceau pouvait ajouter un Mix entier. Amen voulait garder la vidéo et son horodatage tout en respectant les playlists choisies.","T7ell ghneya wa7da w YouTube yzid Mix kemel. Amen 7ab ykhalli el ghneya w wa9tha.","تحلّ غناية وحدة ويوتيوب يزيد Mix كامل. آمن حبّ يخلّي الغناية وتوقيتها ويحترم اختيارك.","تفتح أغنية واحدة، فيضيف يوتيوب Mix كامل. آمن حب يسيب الأغنية وتوقيتها ويحافظ على اختيارك."]]
  ];
  const match=motives.find(([pattern])=>pattern.test(text));
  if(match) return match[1][col+1];
  return "";
}

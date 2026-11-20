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
  const followUp = /^(tell me more|more|what else|go on)[?.! ]*$/i.test(text);
  let topic = followUp ? lastTopic : topics.find(([pattern]) => pattern.test(text));
  if (!topic && !followUp) topic = await semanticTopic(text);
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
  p.className = className;
  p.textContent = text;
  conversation.append(p);
  conversation.scrollTop = conversation.scrollHeight;
  return p;
}
async function ask(text) {
  if (!text || pending) return;
  message(text, "visitor");
  pending = true;
  const bubble = message("Amenos is typing…", "answer");
  guide.classList.add("thinking");
  try {
    const answer = await reply(text);
    bubble.textContent = answer;
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
document.querySelector("#prompts").onclick = event => {
  if (event.target.matches("button")) ask(event.target.textContent);
};


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
function semanticTopic(text) {
  return new Promise((resolve,reject) => {
    searchWorker ??= new Worker("semantic-worker.js",{type:"module"});
    const timeout = setTimeout(() => finish(-1), 45000);
    function finish(index) {
      clearTimeout(timeout);
      if (index === -1) {
        searchWorker.terminate();
        searchWorker = null;
        reject(new Error("Semantic search unavailable"));
      } else resolve(topics[index]);
    }
    searchWorker.onmessage = event => finish(event.data);
    searchWorker.onerror = () => finish(-1);
    searchWorker.postMessage({text, questions:topicQuestions});
  });
}


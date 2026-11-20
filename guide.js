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
  [/mentor|orientation|campus|education|scholar|studying/i,"#campus","I expect to graduate in December 2028. My coursework includes statistical inference, applied probability and machine learning."],
  [/piano|pianist|music|stage/i,"#piano"],
  [/contact|internship|email|hire/i,"#contact"],
  [/project|portfolio|built/i,"#work","Try Fly-QR for browser networking, Lapwise for time tracking, or The Observer Paradox for C++ and interactive fiction."],
  [/activities|extracurricular|fieldwork/i,"#about","Ask about the climate petition, accessibility assessments, campus mentoring or Musicana."],
];
const outside = "That’s outside my portfolio notes. Try a question about my projects, community work, education or music.";
let lastTopic;
let pending;
function reply(text) {
  const followUp = /^(tell me more|more|what else|go on)[?.! ]*$/i.test(text);
  const topic = followUp ? lastTopic : topics.find(([pattern]) => pattern.test(text));
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
function ask(text) {
  if (!text || pending) return;
  message(text, "visitor");
  const answer = reply(text);
  const bubble = message("Little Amen is typing…", "answer");
  guide.classList.add("thinking");
  pending = setTimeout(() => {
    bubble.textContent = answer;
    guide.classList.remove("thinking");
    conversation.scrollTop = conversation.scrollHeight;
    pending = null;
  }, 700);
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


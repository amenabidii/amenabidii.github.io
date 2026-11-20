const cursorEffects = matchMedia("(hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)");
document.addEventListener("pointermove", event => {
  if (!cursorEffects.matches) return;
  document.body.style.setProperty("--mx", event.clientX + "px");
  document.body.style.setProperty("--my", event.clientY + "px");
}, { passive:true });

const slider = document.querySelector("#frequency");
const display = document.querySelector("#lab-display");
const controls = document.querySelector("#lab-input");
const modeLabel = document.querySelector("#mode-label");
const notes = document.querySelector("#lab-note");
const beats = [true,false,false,true,false,true,false,false];
let word = "Amen";
let devices = 3;
function element(tag, text) {
  const node = document.createElement(tag);
  node.textContent = text;
  return node;
}
function paint() {
  const mode = Number(slider.value);
  display.className = "lab-display mode-" + mode;
  display.replaceChildren();
  if (mode === 0) {
    beats.forEach((on,i) => {
      const bar = element("span","");
      bar.style.height = (on ? [85,64,98,72,88,58,80,67][i] : 8) + "%";
      display.append(bar);
    });
  } else if (mode === 1) {
    for (const character of word || " ") {
      const column = element("span",character);
      const binary = character.codePointAt(0).toString(2).padStart(8,"0");
      for (const bit of binary) column.append(element("i",bit === "1" ? "●" : "·"));
      display.append(column);
    }
  } else {
    for (let i=0;i<devices;i++) {
      const node = element("span",String(i+1));
      const angle = Math.PI * 2 * i / devices;
      node.style.left = (50+32*Math.cos(angle))+"%";
      node.style.top = (50+32*Math.sin(angle))+"%";
      display.append(node);
    }
    display.append(element("b", devices*(devices-1)/2+" links"));
  }
}
function selectMode() {
  const mode = Number(slider.value);
  const names = ["Rhythm","Text loom","Peer room"];
  modeLabel.textContent = names[mode].toUpperCase();
  slider.setAttribute("aria-valuetext", names[mode]);
  document.querySelector("output").value = mode+1+" / 3";
  notes.textContent = [
    "Build an eight-step visual rhythm. Tap a beat to lift or mute its column.",
    "Weave a word into light. Each column shows one character’s binary code, with bright dots for ones.",
    "Design a sharing room. Add devices to see how many direct pairs are possible."
  ][mode];
  controls.replaceChildren();
  if (mode === 0) {
    beats.forEach((on,i) => {
      const button = element("button",String(i+1));
      button.setAttribute("aria-label","Beat "+(i+1));
      button.setAttribute("aria-pressed",String(on));
      button.onclick = () => { beats[i]=!beats[i]; button.setAttribute("aria-pressed",String(beats[i])); paint(); };
      controls.append(button);
    });
  } else {
    const label = element("label",mode === 1 ? "Your word " : "Devices ");
    const input = element("input","");
    if (mode === 1) { input.maxLength=8; input.value=word; }
    else { input.type="range"; input.min=2; input.max=8; input.value=devices; }
    input.oninput = () => { if (mode === 1) word=input.value; else devices=Number(input.value); paint(); };
    label.append(input);
    controls.append(label);
  }
  paint();
}
slider.addEventListener("input",selectMode);
selectMode();

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const frequency = document.querySelector("#frequency");
const output = document.querySelector("output");
let phase = 0;

function drawSignal() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  const harmonics = Number(frequency.value);
  output.value = harmonics + "×";
  for (let row = 0; row < 74; row++) {
    const depth = row / 73;
    context.beginPath();
    context.strokeStyle = "hsl(" + (174 + 49 * depth) + " 94% " + (78 - 17 * depth) + "%)";
    for (let sample = 0; sample <= 210; sample++) {
      const u = sample / 210;
      const envelope = Math.sin(Math.PI * u) ** 1.5;
      const angle = u * Math.PI * harmonics + depth * 5 + phase;
      const amplitude = envelope * (65 + 28 * Math.sin(depth * Math.PI));
      const x = 42 + u * 514 + (1 - depth) * 78;
      const y = 153 + depth * 165 + Math.sin(angle) * amplitude
        + Math.sin(angle * 0.5 + depth) * envelope * 39 - u * 34;
      if (sample === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }
    context.stroke();
  }
}

frequency.addEventListener("input", drawSignal);
canvas.addEventListener("pointermove", event => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const bounds = canvas.getBoundingClientRect();
  phase = (event.clientX - bounds.left) / bounds.width * Math.PI;
  drawSignal();
});
drawSignal();


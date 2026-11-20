const visionLab = document.createElement("section");
visionLab.className = "vision-lab";
visionLab.innerHTML = `<h4>Can you find Amenos’ glasses?</h4>
<p>Turn up the edge threshold. Which outlines disappear first?</p>
<div class="vision-pair"><figure><img src="amenos-face.svg" alt="Pixel portrait of Amenos wearing glasses"><figcaption>Original</figcaption></figure>
<figure><canvas width="96" height="96" aria-label="Detected outlines of the portrait"></canvas><figcaption>Detected edges</figcaption></figure></div>
<label>Edge threshold <input type="range" min="1" max="255" value="48"><output>48</output></label>
<small aria-live="polite"></small>`;
document.querySelector("#interests").append(visionLab);
const portrait = visionLab.querySelector("img");
function prepareEdges() {
  const canvas = visionLab.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const size = canvas.width;
  ctx.fillStyle = "#0a1720";
  ctx.fillRect(0, 0, size, size);
  ctx.drawImage(portrait, 0, 0, size, size);
  const pixels = ctx.getImageData(0, 0, size, size);
  const light = Array.from({length:size * size}, (_, i) => {
    const j = 4 * i;
    return 0.2126 * pixels.data[j] + 0.7152 * pixels.data[j+1] + 0.0722 * pixels.data[j+2];
  });
  const threshold = visionLab.querySelector("input");
  function renderEdges() {
    let count = 0;
    for (let i = 0; i < light.length; i++) {
      const dx = i % size ? light[i] - light[i-1] : 0;
      const dy = i >= size ? light[i] - light[i-size] : 0;
      const edge = Math.hypot(dx, dy) >= threshold.valueAsNumber;
      if (edge) count++;
      pixels.data.set(edge ? [131,239,218,255] : [10,23,32,255], 4*i);
    }
    ctx.putImageData(pixels, 0, 0);
    visionLab.querySelector("output").value = threshold.value;
    visionLab.querySelector("small").textContent = count + " of 9,216 pixels pass the contrast test.";
  }
  threshold.oninput = renderEdges;
  renderEdges();
}
if (portrait.complete && portrait.naturalWidth) prepareEdges();
else portrait.addEventListener("load", prepareEdges, {once:true});

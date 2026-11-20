// The game piano plays one octave above the guitar arrangement.
const pianoFact = document.querySelector("#piano-fact");
let pianoBus = null;
let pianoTimer = 0;
let pianoFactTimer = 0;

function syncPiano(active) {
  if (!active) {
    clearTimeout(pianoTimer);
    clearTimeout(pianoFactTimer);
    pianoFact.hidden = true;
    pianoBus?.disconnect();
    pianoBus = null;
    return;
  }
  if (pianoBus || !context) return;
  pianoBus = context.createGain();
  pianoBus.connect(context.destination);
  const secondsPerTick = 0.6 / 480;
  const start = context.currentTime + 0.035;
  let cursor = 0;
  function schedule() {
    const horizon = context.currentTime + 0.14;
    while (cursor < pianoScore.length) {
      const [tick, pitch, length] = pianoScore[cursor];
      const time = start + tick * secondsPerTick;
      if (time > horizon) break;
      cursor++;
      const duration = length * secondsPerTick + 0.03;
      if (time + duration <= context.currentTime) continue;
      const voice = context.createOscillator();
      const envelope = context.createGain();
      voice.type = pitch < 55 ? "sine" : "triangle";
      voice.frequency.value = 440 * 2 ** ((pitch + 12 - 69) / 12);
      envelope.gain.setValueAtTime(0.001, time);
      envelope.gain.exponentialRampToValueAtTime(0.08, time + 0.012);
      envelope.gain.exponentialRampToValueAtTime(0.001, time + duration);
      voice.connect(envelope).connect(pianoBus);
      voice.start(time);
      voice.stop(time + duration + 0.01);
      voice.onended = () => { voice.disconnect(); envelope.disconnect(); };
    }
    if (cursor < pianoScore.length) pianoTimer = setTimeout(schedule, 60);
  }
  schedule();
  pianoFactTimer = setTimeout(() => {
    pianoFact.textContent = "Fun fact · Amen has played this piece on piano. Here, each note comes from the game’s own synthesizer.";
    pianoFact.hidden = false;
    pianoFactTimer = setTimeout(() => { pianoFact.hidden = true; }, 6500);
  }, 5000);
}

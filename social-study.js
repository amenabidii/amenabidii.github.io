// Hourly bins from social_media_vs_productivity.csv: records, valid scores, mean score.
const usageBins = [[4399, 4067, 4.99], [4030, 3723, 4.92], [5052, 4615, 4.96], [5217, 4795, 4.95], [4154, 3841, 4.96], [2464, 2282, 4.95], [1168, 1084, 4.93], [453, 420, 4.76], [116, 102, 4.95], [33, 28, 5.19], [8, 8, 4.63], [1, 1, 5.27], [23, 22, 5.03], [21, 19, 4.07], [19, 16, 5.06], [30, 27, 4.69], [24, 23, 4.23], [23, 22, 4.87]];
const studyPanel = document.createElement("section");
studyPanel.className = "usage-study";
studyPanel.innerHTML = `<h4>How does productivity vary with time on social media?</h4>
<p>I plotted social media habits for our three-person data science project. Drag the slider to explore one hour group at a time.</p>
<div class="usage-bars" aria-hidden="true"></div>
<label for="usage-hour">Daily social media use</label> <output for="usage-hour"></output>
<input id="usage-hour" type="range" min="0" max="17" step="1" value="3">
<p class="usage-result" aria-live="polite"></p><small>Source · DSCI 1 team study, spring 2025 · 30,000 records. Bar height shows group size. Averages exclude missing scores.</small>`;
document.querySelector("#interests").append(studyPanel);
const usageSlider = studyPanel.querySelector("input");
const usageBars = studyPanel.querySelector(".usage-bars");
const largestGroup = Math.max(...usageBins.map(group => group[0]));
for (const [count] of usageBins) {
  const bar = document.createElement("i");
  bar.style.height = (100 * count / largestGroup) + "%";
  usageBars.append(bar);
}
function showUsageGroup() {
  const hour = usageSlider.valueAsNumber;
  const [records, scored, mean] = usageBins[hour];
  const label = hour + " to under " + (hour + 1) + " hours";
  usageSlider.setAttribute("aria-valuetext", label);
  studyPanel.querySelector("output").value = label;
  Array.from(usageBars.children).forEach((bar, i) => bar.classList.toggle("selected", i === hour));
  studyPanel.querySelector(".usage-result").textContent = records.toLocaleString() + " records in this group. Average productivity score: " + mean.toFixed(2) + " across " + scored.toLocaleString() + " recorded scores.";
}
usageSlider.oninput = showUsageGroup;
showUsageGroup();

const chapters = [...document.querySelectorAll(".chapters article")];
const chapterLinks = document.querySelectorAll(".chapter-nav a");
let scheduled = false;

function updateChapter() {
  const readingLine = window.innerHeight * 0.45;
  let current = chapters[0];
  for (const chapter of chapters) {
    if (chapter.getBoundingClientRect().top <= readingLine) current = chapter;
  }
  for (const chapter of chapters) chapter.classList.toggle("active", chapter === current);
  for (const link of chapterLinks) {
    if (link.hash === "#" + current.id) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  }
  scheduled = false;
}

function scheduleUpdate() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(updateChapter);
}

window.addEventListener("scroll", scheduleUpdate, { passive: true });
window.addEventListener("resize", scheduleUpdate);
updateChapter();

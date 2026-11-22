---
layout: null
---
(async () => {
  const revision = "{{ site.github.build_revision }}";
  if (!/^[a-f0-9]{40}$/i.test(revision)) return;
  const key = "amenos-last-release";
  try {
    if (localStorage.getItem(key) === revision) return;
  } catch { return; }
  let description = "There’s a new version of Amen’s portfolio to explore.";
  try {
    const response = await fetch("https://api.github.com/repos/amenabidii/amenabidii.github.io/commits/" + revision, {signal: AbortSignal.timeout(2500)});
    if (response.ok) {
      const title = (await response.json()).commit.message.split("\n")[0];
      if (title) description = title.slice(0, 140);
    }
  } catch {}
  const notice = document.createElement("aside");
  notice.className = "release-notice";
  notice.setAttribute("aria-label", "Portfolio update");
  const heading = document.createElement("strong");
  heading.textContent = "What’s new?";
  const copy = document.createElement("span");
  copy.textContent = description;
  const close = document.createElement("button");
  close.type = "button";
  close.setAttribute("aria-label", "Dismiss update");
  close.textContent = "×";
  close.onclick = () => notice.remove();
  notice.append(heading, copy, close);
  document.body.append(notice);
  try { localStorage.setItem(key, revision); } catch {}
  setTimeout(() => { if (!notice.matches(":focus-within, :hover")) notice.remove(); }, 14000);
})();

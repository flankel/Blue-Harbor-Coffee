// /js/loader.js

async function init() {
  const root = document.getElementById("loader-root");
  const body = document.getElementById("body");

  if (!root || !body) return;

  const startTime = Date.now();

  const res = await fetch("loader.html");
  const html = await res.text();
  root.innerHTML = html;

  const loader = document.getElementById("loader");

  if (!loader) {
    body.classList.remove("opacity-0");
    return;
  }

  // 👇 これ追加（超重要）
  loader.style.opacity = "1";

  const MIN_TIME = 1200;
  const elapsed = Date.now() - startTime;
  const wait = Math.max(0, MIN_TIME - elapsed);

  setTimeout(() => {

    loader.style.opacity = "0";

    setTimeout(() => {
      loader.style.display = "none";
      body.classList.remove("opacity-0");
    }, 700);

  }, wait);
}

init();

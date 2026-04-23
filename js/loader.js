// /js/loader.js

async function init() {
  const root = document.getElementById("loader-root");
  const body = document.getElementById("body");

  if (!root || !body) return;

  try {
    // loader読み込み
    const res = await fetch("loader.html");
    const html = await res.text();
    root.innerHTML = html;

    const loader = document.getElementById("loader");

    if (!loader) {
      body.classList.remove("opacity-0");
      return;
    }

    // 👇 load待たない
    setTimeout(() => {

      loader.style.opacity = "0";

      setTimeout(() => {
        loader.style.display = "none";
        body.classList.remove("opacity-0");
      }, 700);

    }, 800); // 少し長めにして視認できるように

  } catch (e) {
    console.error(e);
    body.classList.remove("opacity-0");
  }
}

init();

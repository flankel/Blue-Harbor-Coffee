// /js/loader.js

async function loadLoader() {
  const res = await fetch("loader.html");
  const html = await res.text();
  document.getElementById("loader-root").innerHTML = html;
}

function initLoader() {
  window.addEventListener("load", () => {

    const loader = document.getElementById("loader");
    const body = document.getElementById("body");

    setTimeout(() => {

      loader.style.opacity = "0";

      setTimeout(() => {
        loader.style.display = "none";
        body.classList.remove("opacity-0");
      }, 700);

    }, 600);

  });
}

// 実行
loadLoader().then(initLoader);

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

    // loaderが無かったら即表示（保険）
    if (!loader) {
      body.classList.remove("opacity-0");
      return;
    }

    // ページロード後に処理
    window.addEventListener("load", () => {

      setTimeout(() => {

        loader.style.opacity = "0";

        setTimeout(() => {
          loader.style.display = "none";
          body.classList.remove("opacity-0");
        }, 700);

      }, 600);

    });

  } catch (e) {
    console.error("Loader error:", e);
    body.classList.remove("opacity-0"); // エラー時も表示
  }
}

init();

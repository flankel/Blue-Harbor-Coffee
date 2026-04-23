async function init() {

  const root = document.getElementById("loader-root");
  const body = document.getElementById("body");

  if (!root || !body) return;

  const startTime = Date.now();

  try {

    // =========================
    // 🔥 パス修正（GitHub Pages安定版）
    // =========================
    const res = await fetch("/Blue-Harbor-Coffee/loader.html");
    const html = await res.text();

    root.innerHTML = html;

    // =========================
    // DOM反映を確実に待つ
    // =========================
    requestAnimationFrame(() => {

      const loader = document.querySelector(".loader");

      // loaderが存在しない場合は即表示
      if (!loader) {
        body.style.opacity = "1";
        body.classList.remove("opacity-0");
        return;
      }

      // =========================
      // 表示開始
      // =========================
      loader.style.display = "flex";
      loader.style.opacity = "1";

      // =========================
      // 最低表示時間制御
      // =========================
      const MIN_TIME = 1200;
      const elapsed = Date.now() - startTime;
      const wait = Math.max(0, MIN_TIME - elapsed);

      setTimeout(() => {

        loader.style.opacity = "0";

        setTimeout(() => {

          loader.style.display = "none";

          // =========================
          // 本体表示（ここが最重要）
          // =========================
          body.style.opacity = "1";
          body.classList.remove("opacity-0");

        }, 600);

      }, wait);

    });

  } catch (err) {

    console.error("Loader Error:", err);

    // エラー時は強制表示
    body.style.opacity = "1";
    body.classList.remove("opacity-0");
  }
}

init();

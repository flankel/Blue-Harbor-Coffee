async function init() {

  // =========================
  // 必要な要素取得
  // =========================
  const root = document.getElementById("loader-root");
  const body = document.getElementById("body");

  if (!root || !body) return;

  // =========================
  // 開始時間（最低表示時間制御）
  // =========================
  const startTime = Date.now();

  try {

    // =========================
    // loader.html 読み込み
    // =========================
    const res = await fetch("./loader.html");
    const html = await res.text();

    // =========================
    // DOMに挿入
    // =========================
    root.innerHTML = html;

    // =========================
    // DOM反映待ち（安定化）
    // =========================
    setTimeout(() => {

      // 🔥 ここを修正（id → class）
      const loader = document.querySelector(".loader");

      if (!loader) {
        body.classList.remove("opacity-0");
        return;
      }

      // =========================
      // 強制表示
      // =========================
      loader.style.opacity = "1";
      loader.style.display = "flex";

      // =========================
      // 最低表示時間制御
      // =========================
      const MIN_TIME = 1200;
      const elapsed = Date.now() - startTime;
      const wait = Math.max(0, MIN_TIME - elapsed);

      // =========================
      // フェードアウト
      // =========================
      setTimeout(() => {

        loader.style.opacity = "0";

        setTimeout(() => {
          loader.style.display = "none";
          body.classList.remove("opacity-0");
        }, 700);

      }, wait);

    }, 0);

  } catch (error) {

    console.error("Loader Error:", error);

    body.classList.remove("opacity-0");
  }
}

// =========================
// 実行
// =========================
init();

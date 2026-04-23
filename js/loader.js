// /js/loader.js

async function init() {

  // =========================
  // 要素取得
  // =========================
  const root = document.getElementById("loader-root");
  const body = document.getElementById("body");

  if (!root || !body) return;

  // =========================
  // 開始時間（表示時間制御用）
  // =========================
  const startTime = Date.now();

  try {

    // =========================
    // loader.html 読み込み
    // =========================
    const res = await fetch("loader.html");
    const html = await res.text();
    root.innerHTML = html;

    // =========================
    // loader取得
    // =========================
    const loader = document.getElementById("loader");

    if (!loader) {
      body.classList.remove("opacity-0");
      return;
    }

    // =========================
    // 🔥 強制表示（これが最重要）
    // =========================
    loader.style.opacity = "1";
    loader.style.display = "flex";

    // =========================
    // 最低表示時間（調整OK）
    // =========================
    const MIN_TIME = 1200;

    const elapsed = Date.now() - startTime;
    const wait = Math.max(0, MIN_TIME - elapsed);

    // =========================
    // フェードアウト処理
    // =========================
    setTimeout(() => {

      loader.style.opacity = "0";

      setTimeout(() => {

        loader.style.display = "none";

        // =========================
        // 本体表示
        // =========================
        body.classList.remove("opacity-0");

      }, 700);

    }, wait);

  } catch (error) {

    console.error("Loader Error:", error);

    // エラー時は強制表示
    body.classList.remove("opacity-0");

  }

}

// =========================
// 実行
// =========================
init();

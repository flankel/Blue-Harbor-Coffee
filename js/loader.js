export function initLoader() {
  console.log("loader start");

  const root = document.getElementById("loader-root");
  if (!root) {
    console.error("loader-root not found");
    return;
  }

  fetch("./loader.html")
    .then(res => {
      if (!res.ok) {
        throw new Error("loader.html not found: " + res.status);
      }
      return res.text();
    })
    .then(html => {

      // ① DOM注入
      root.innerHTML = html;

      // ② DOM取得（必ずここでやる）
      const percentEl = document.getElementById("percent");
      const coffeeFill = document.getElementById("coffee-fill");

      if (!percentEl || !coffeeFill) {
        console.error("loader elements missing");
        return;
      }

      let percent = 0;

      const duration = 5000; // 5秒固定
      const intervalTime = 50;
      const step = 100 / (duration / intervalTime);

      const interval = setInterval(() => {

        percent += step;

        if (percent > 100) percent = 100;

        // 数値更新
        percentEl.textContent = Math.floor(percent);

        // コーヒー満ちる
        coffeeFill.style.height = percent + "%";

        // 濃さ変化（コーヒー感アップ）
        coffeeFill.style.filter = `brightness(${0.7 + percent / 300})`;

        // 完了処理
        if (percent >= 100) {
          clearInterval(interval);

          setTimeout(() => {
            root.style.transition = "opacity 0.6s ease";
            root.style.opacity = "0";

            setTimeout(() => root.remove(), 600);
          }, 300);
        }

      }, intervalTime);

    })
    .catch(err => {
      console.error("loader error:", err);
    });
}

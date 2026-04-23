export function initLoader() {
  console.log("loader start");

  const root = document.getElementById("loader-root");
  if (!root) return;

  fetch("./loader.html")
    .then(res => {
      if (!res.ok) throw new Error("loader.html not found");
      return res.text();
    })
    .then(html => {

      root.innerHTML = html;

      requestAnimationFrame(() => {

        const percentEl = document.getElementById("percent");
        const coffeeFill = document.getElementById("coffee-fill");
        const waveLayer = document.querySelectorAll(".wave");

        if (!percentEl || !coffeeFill) {
          console.error("loader elements missing");
          return;
        }

        let percent = 0;

        const duration = 5000;
        const stepTime = 50;
        const step = 100 / (duration / stepTime);

        const interval = setInterval(() => {

          percent += step;
          if (percent > 100) percent = 100;

          const p = Math.floor(percent);
          percentEl.textContent = p;

          // =========================
          // ☕ コーヒー（安定満ちる）
          // =========================
          coffeeFill.style.transform = `scaleY(${percent / 100})`;
          coffeeFill.style.transformOrigin = "bottom";

          coffeeFill.style.filter = `brightness(${0.8 + percent / 350})`;

          // =========================
          // 🌊 波（CSS主体・補助のみ）
          // =========================

          // =========================
          // 背景（海の深さ）
          // =========================
          root.style.background = `linear-gradient(
            to bottom,
            rgba(255,255,255,1),
            rgba(59,130,246,${percent / 300})
          )`;

          // =========================
          // 完了演出（海が開く）
          // =========================
          if (percent >= 100) {
            clearInterval(interval);

            // 🌊 波を左右に開く
            waveLayer.forEach((wave, i) => {

              wave.style.transition = "transform 1s ease, opacity 0.8s ease";

              if (i % 2 === 0) {
                wave.style.transform = "translateX(-200%)";
              } else {
                wave.style.transform = "translateX(200%)";
              }

              wave.style.opacity = "0";
            });

            // ☕ コーヒーは“消さない”（重要修正）
            // → 空に見えるバグの原因なので削除

            // 全体フェードアウト（ここで初めて消す）
            setTimeout(() => {

              root.style.transition = "opacity 0.8s ease";
              root.style.opacity = "0";

              setTimeout(() => {
                root.remove();
              }, 800);

            }, 900);
          }

        }, stepTime);

      });

    })
    .catch(err => console.error("loader error:", err));
}

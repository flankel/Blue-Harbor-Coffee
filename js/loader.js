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
          // ☕ コーヒー（液体）
          // =========================
          coffeeFill.style.transform = `scaleY(${percent / 100})`;
          coffeeFill.style.transformOrigin = "bottom";

          // ほんの少し質感変化（リアル化）
          coffeeFill.style.filter = `brightness(${0.75 + percent / 300})`;

          // =========================
          // 🌊 波（CSS主体・JSは補助のみ）
          // =========================
          waveLayer.forEach(wave => {
            wave.style.opacity = 0.5 + percent / 300;
          });

          // =========================
          // 背景（海の雰囲気）
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
                wave.style.transform = "translateX(-150%)";
              } else {
                wave.style.transform = "translateX(150%)";
              }

              wave.style.opacity = "0";
            });

            // ☕ コーヒー消える
            coffeeFill.style.transition = "opacity 0.8s ease";
            coffeeFill.style.opacity = "0";

            // フェードアウト → 本体表示
            setTimeout(() => {

              root.style.transition = "opacity 0.6s ease";
              root.style.opacity = "0";

              setTimeout(() => {
                root.remove();
                // 👉 ここで index.html 完全表示状態
              }, 600);

            }, 900);
          }

        }, stepTime);

      });

    })
    .catch(err => console.error("loader error:", err));
}

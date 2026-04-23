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
        const cup = coffeeFill?.parentElement; // ←重要（カップ全体制御用）
        const waveLayer = document.querySelectorAll(".wave");

        if (!percentEl || !coffeeFill || !cup) {
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
          // ☕ コーヒー（はみ出し防止前提）
          // =========================
          coffeeFill.style.transform = `scaleY(${percent / 100})`;
          coffeeFill.style.transformOrigin = "bottom";

          coffeeFill.style.filter = `brightness(${0.8 + percent / 350})`;

          // =========================
          // 🌊 波（触らない）
          // =========================

          // =========================
          // 背景
          // =========================
          root.style.background = `linear-gradient(
            to bottom,
            rgba(255,255,255,1),
            rgba(59,130,246,${percent / 300})
          )`;

          // =========================
          // 完了演出
          // =========================
          if (percent >= 100) {
            clearInterval(interval);

            // 🌊 波を開く
            waveLayer.forEach((wave, i) => {
              wave.style.transition = "transform 1s ease, opacity 0.8s ease";

              if (i % 2 === 0) {
                wave.style.transform = "translateX(-180%)";
              } else {
                wave.style.transform = "translateX(180%)";
              }

              wave.style.opacity = "0";
            });

            // ☕ コーヒーは即消さない（ここ重要修正）
            setTimeout(() => {
              coffeeFill.style.transition = "opacity 0.8s ease";
              coffeeFill.style.opacity = "0";
            }, 300); // ←遅延

            // カップ全体をフェードアウト
            setTimeout(() => {

              cup.style.transition = "opacity 0.8s ease";
              cup.style.opacity = "0";

              root.style.transition = "opacity 0.6s ease";
              root.style.opacity = "0";

              setTimeout(() => {
                root.remove();
              }, 600);

            }, 900);
          }

        }, stepTime);

      });

    })
    .catch(err => console.error("loader error:", err));
}

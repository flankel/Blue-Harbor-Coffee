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
        const cup = document.querySelector(".cup"); // あれば

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

          // コーヒー満ちる（海の深さ）
          coffeeFill.style.transform = `scaleY(${percent / 100})`;
          coffeeFill.style.transformOrigin = "bottom";

          // 波の強さ（揺れ）
          waveLayer.forEach(wave => {
            wave.style.transform = `translateX(${-percent / 3}px)`;
            wave.style.opacity = 0.4 + percent / 250;
          });

          // 完了前は「海の中にいる感じ」
          root.style.background = `linear-gradient(
            to bottom,
            rgba(255,255,255,1),
            rgba(59,130,246,${percent / 300})
          )`;

          // =========================
          // 完了 → 海が開く演出
          // =========================
          if (percent >= 100) {
            clearInterval(interval);

            // 🌊 波を左右に開く
            if (waveLayer.length) {
              waveLayer.forEach((wave, i) => {
                wave.style.transition = "all 0.8s ease";

                if (i % 2 === 0) {
                  wave.style.transform = "translateX(-120%)";
                } else {
                  wave.style.transform = "translateX(120%)";
                }

                wave.style.opacity = "0";
              });
            }

            // カップも沈む or 消える
            if (coffeeFill) {
              coffeeFill.style.transition = "all 0.8s ease";
              coffeeFill.style.opacity = "0";
            }

            // フェードアウト
            setTimeout(() => {
              root.style.transition = "opacity 0.6s ease";
              root.style.opacity = "0";

              setTimeout(() => {
                root.remove();

                // 👉 ここで「完全にページ表示完了」
              }, 600);

            }, 800);
          }

        }, stepTime);

      });

    })
    .catch(err => console.error("loader error:", err));
}

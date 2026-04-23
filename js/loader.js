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

      // DOM注入
      root.innerHTML = html;

      // ⭐DOM確定待ち（スマホ対策）
      requestAnimationFrame(() => {

        const percentEl = document.getElementById("percent");
        const coffeeFill = document.getElementById("coffee-fill");
        const drip = document.getElementById("drip"); // ←追加（ドリップ対応）

        if (!percentEl || !coffeeFill) {
          console.error("loader elements missing");
          return;
        }

        let percent = 0;

        const duration = 5000;
        const intervalTime = 50;
        const step = 100 / (duration / intervalTime);

        const interval = setInterval(() => {

          percent += step;
          if (percent > 100) percent = 100;

          const p = Math.floor(percent);

          // 数値更新
          percentEl.textContent = p;

          // コーヒー満ちる
          coffeeFill.style.height = percent + "%";

          // 濃さ変化（リアルな抽出感）
          coffeeFill.style.filter = `brightness(${0.75 + percent / 300})`;

          // 🌊 波の強さ変化（あれば効く）
          coffeeFill.style.opacity = 0.85 + percent / 1000;

          // 💧 ドリップ演出（あれば動く）
          if (drip) {
            const dripY = Math.sin(percent / 8) * 2;
            drip.style.transform = `translate(-50%, ${dripY}px)`;

            // 途中でポタッ演出
            if (p % 15 === 0) {
              drip.animate([
                { transform: "translate(-50%, 0px) scale(1)" },
                { transform: "translate(-50%, 8px) scale(0.8)" },
                { transform: "translate(-50%, 0px) scale(1)" }
              ], {
                duration: 180,
                easing: "ease-out"
              });
            }

            // 完了で消える
            if (percent >= 98) {
              drip.style.opacity = "0";
            }
          }

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

      });

    })
    .catch(err => {
      console.error("loader error:", err);
    });
}

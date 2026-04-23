export function initLoader() {
  const root = document.getElementById("loader-root");

  if (!root) return;

  let percent = 0;

  const percentEl = () => document.getElementById("percent");
  const coffeeFill = () => document.getElementById("coffee-fill");

  // 5秒 = 5000ms
  const duration = 5000;
  const intervalTime = 50; // 20fpsくらい
  const step = 100 / (duration / intervalTime);

  const timer = setInterval(() => {
    percent += step;

    if (percent >= 100) percent = 100;

    // 表示更新
    if (percentEl()) {
      percentEl().textContent = Math.floor(percent);
    }

    // コーヒー満ちる（高さ0→100%）
    if (coffeeFill()) {
      coffeeFill().style.height = percent + "%";
    }

    if (percent >= 100) {
      clearInterval(timer);

      setTimeout(() => {
        root.style.transition = "opacity 0.6s ease";
        root.style.opacity = "0";

        setTimeout(() => root.remove(), 600);
      }, 300);
    }
  }, intervalTime);
}

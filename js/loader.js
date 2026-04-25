export function initLoader() {

  const root = document.getElementById("loader-root");
  if (!root) return;

  // =========================
  // 扉 + ローダー
  // =========================
  root.innerHTML = `
  <div id="door-wrapper">

    <!-- 左扉 -->
    <div class="door left">
      <div class="door-inner">
        <span class="door-text">Blue Harbor Coffee</span>
      </div>
    </div>

    <!-- 右扉 -->
    <div class="door right">
      <div class="door-inner">
        <span class="door-text">Since 2024</span>
      </div>
    </div>

    <!-- 中央ローディング -->
    <div id="loader-center">
      <div class="cup">${cupSVG()}</div>
      <p id="loading-text">Brewing...</p>
    </div>

  </div>
  `;

  injectStyle();

  // =========================
  // ローディング演出
  // =========================
  const text = document.getElementById("loading-text");
  const words = ["Brewing...", "Pouring...", "Almost Ready..."];
  let i = 0;

  const interval = setInterval(() => {
    i = (i + 1) % words.length;
    text.textContent = words[i];
  }, 1200);

  // =========================
  // 終了 → 扉OPEN
  // =========================
  setTimeout(() => {
    clearInterval(interval);

    const left = document.querySelector(".door.left");
    const right = document.querySelector(".door.right");

    left.style.transform = "translateX(-100%)";
    right.style.transform = "translateX(100%)";

    // 少し遅れて削除
    setTimeout(() => {
      root.remove();
    }, 1200);

  }, 3500);
}

function injectStyle() {
  const style = document.createElement("style");

  style.textContent = `
  #door-wrapper {
    position: fixed;
    inset: 0;
    display: flex;
    z-index: 9999;
    overflow: hidden;
    background: #f7f4ef;
  }

  .door {
    width: 50%;
    height: 100%;
    background: #2c3330;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 1.2s ease;
    position: relative;
  }

  .door-inner {
    color: #eae7df;
    font-family: 'Jost', sans-serif;
    letter-spacing: 0.2em;
    font-size: 14px;
    opacity: 0.8;
  }

  .door.left {
    border-right: 1px solid rgba(255,255,255,0.1);
  }

  .door.right {
    border-left: 1px solid rgba(255,255,255,0.1);
  }

  /* 中央ローディング */
  #loader-center {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }

  #loading-text {
    margin-top: 16px;
    font-size: 12px;
    letter-spacing: 0.2em;
    color: #c2a87a;
    font-family: 'Jost', sans-serif;
  }

  .cup svg {
    width: 40px;
    height: auto;
  }
  `;

  document.head.appendChild(style);
}

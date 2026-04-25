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

function cupSVG() {
  return `
  <svg width="40" height="48" viewBox="0 0 38 46" fill="none">
    <path d="M14 7 Q16 3 18 7" stroke="#c2a87a" stroke-width="1.2"/>
    <path d="M20 5 Q22 1 24 5" stroke="#c2a87a" stroke-width="1.2"/>
    <rect x="6" y="12" width="26" height="27" rx="3" stroke="#eae7df" stroke-width="1.5"/>
    <path d="M32 19 Q43 19 43 26 Q43 33 32 31" stroke="#eae7df" stroke-width="1.5"/>
    <line x1="4" y1="39" x2="34" y2="39" stroke="#eae7df" stroke-width="1.5"/>
    <circle cx="19" cy="26" r="4" stroke="#c2a87a" stroke-width="1.2"/>
  </svg>
  `;
}

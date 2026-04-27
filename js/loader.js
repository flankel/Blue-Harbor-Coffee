export function initLoader() {

  const root = document.getElementById("loader-root");
  if (!root) return;

  // =========================
  // 扉 + ローダー
  // =========================
  root.innerHTML = `
  <div id="door-wrapper">

    <!-- 上扉（モバイル） / 左扉（PC） -->
    <div class="door door-a">
      <div class="door-inner">
        <span class="door-text">Blue Harbor Coffee</span>
      </div>
    </div>

    <!-- 下扉（モバイル） / 右扉（PC） -->
    <div class="door door-b">
      <div class="door-inner">
        <span class="door-text">Since 2024</span>
      </div>
    </div>

    <!-- 中央ローディング -->
    <div id="loader-center">
      <div class="drip">${dripSVG()}</div>
      <p id="loading-text">0%</p>
    </div>

  </div>
  `;

  injectStyle();

  // =========================
  // パーセンテージ制御
  // =========================
  const text = document.getElementById("loading-text");
  const liquid = document.getElementById("coffee-liquid");

  let percent = 0;

  const interval = setInterval(() => {
    percent++;

    // テキスト更新
    text.textContent = percent + "%";

    // コーヒーの高さ（%に応じて上昇）
    liquid.setAttribute("height", percent * 0.25 + 2);

    if (percent >= 100) {
      clearInterval(interval);
      openDoors();
    }

  }, 30);


  // =========================
  // 扉OPEN
  // =========================
  function openDoors() {

    const a = document.querySelector(".door-a");
    const b = document.querySelector(".door-b");

    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      // 上下に開く
      a.style.transform = "translateY(-100%)";
      b.style.transform = "translateY(100%)";
    } else {
      // 左右に開く
      a.style.transform = "translateX(-100%)";
      b.style.transform = "translateX(100%)";
    }

    setTimeout(() => {
      root.remove();
    }, 1200);
  }
}


// =========================
// スタイル
// =========================
function injectStyle() {
  const style = document.createElement("style");

  style.textContent = `
  #door-wrapper {
    position: fixed;
    inset: 0;
    display: flex;
    z-index: 9999;
    overflow: hidden;
    background: #2c3330; /* ← 白画面排除 */
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
    font-size: 14px;
    letter-spacing: 0.2em;
    color: #c2a87a;
    font-family: 'Jost', sans-serif;
  }

  .drip svg {
    width: 60px;
    height: auto;
  }

  /* =========================
     モバイル対応（上下扉）
  ========================= */
  @media (max-width: 768px) {
    #door-wrapper {
      flex-direction: column;
    }

    .door {
      width: 100%;
      height: 50%;
    }
  }
  `;

  document.head.appendChild(style);
}


// =========================
// ドリップSVG
// =========================
function dripSVG() {
  return `
  <svg viewBox="0 0 60 80" fill="none">

    <!-- ドリッパー -->
    <path d="M20 10 L40 10 L35 25 L25 25 Z"
      stroke="#eae7df" stroke-width="1.5"/>

    <!-- 落ちる雫 -->
    <circle cx="30" cy="32" r="2" fill="#c2a87a">
      <animate attributeName="cy" values="32;45;32" dur="1s" repeatCount="indefinite"/>
    </circle>

    <!-- カップ枠 -->
    <rect x="15" y="45" width="30" height="20" rx="3"
      stroke="#eae7df" stroke-width="1.5"/>

    <!-- コーヒー液体 -->
    <rect id="coffee-liquid"
      x="15" y="65"
      width="30"
      height="2"
      fill="#c2a87a" />

    <!-- ソーサー -->
    <line x1="12" y1="67" x2="48" y2="67"
      stroke="#eae7df" stroke-width="1.5"/>

  </svg>
  `;
}

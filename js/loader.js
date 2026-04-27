export function initLoader() {

  const root = document.getElementById("loader-root");
  if (!root) return;

  root.innerHTML = `
  <div id="door-wrapper">

    <!-- 中央ライン -->
    <div id="center-line"></div>

    <!-- 扉A -->
    <div class="door door-a">
      <div class="door-inner">
        <span class="door-text">Blue Harbor Coffee</span>
      </div>
    </div>

    <!-- 扉B -->
    <div class="door door-b">
      <div class="door-inner">
        <span class="door-text">Since 2024</span>
      </div>
    </div>

    <!-- ローディング -->
    <div id="loader-center">
      <div class="drip">${dripSVG()}</div>
      <p id="loading-text">0%</p>
    </div>

  </div>
  `;

  injectStyle();

  const text = document.getElementById("loading-text");
  const liquid = document.getElementById("coffee-liquid");

  let percent = 0;

  const interval = setInterval(() => {
    percent++;
    text.textContent = percent + "%";
    liquid.setAttribute("height", percent * 0.25 + 2);

    if (percent >= 100) {
      clearInterval(interval);
      openDoors();
    }
  }, 30);


  function openDoors() {
    const a = document.querySelector(".door-a");
    const b = document.querySelector(".door-b");
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      // 中央から上下に開く
      a.style.transform = "translateY(-100%)";
      b.style.transform = "translateY(100%)";
    } else {
      // 中央から左右に開く
      a.style.transform = "translateX(-100%)";
      b.style.transform = "translateX(100%)";
    }

    setTimeout(() => {
      root.remove();
    }, 1200);
  }
}


// =========================
// CSS
// =========================
function injectStyle() {
  const style = document.createElement("style");

  style.textContent = `
  #door-wrapper {
    position: fixed;
    inset: 0;
    z-index: 9999;
    overflow: hidden;
    background: #2c3330;
  }

  /* 中央ライン */
  #center-line {
    position: absolute;
    background: rgba(255,255,255,0.15);
    z-index: 10;
  }

  /* PC：縦線 */
  #center-line {
    width: 1px;
    height: 100%;
    left: 50%;
    top: 0;
  }

  .door {
    position: absolute;
    background: #2c3330;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 1.2s ease;
  }

  /* =========================
     PC（左右に開く）
  ========================= */
  .door-a {
    width: 50%;
    height: 100%;
    left: 0;
    top: 0;
    transform-origin: right center;
  }

  .door-b {
    width: 50%;
    height: 100%;
    right: 0;
    top: 0;
    transform-origin: left center;
  }

  /* テキスト */
  .door-inner {
    color: #eae7df;
    font-family: 'Jost', sans-serif;
    letter-spacing: 0.2em;
    font-size: 14px;
    opacity: 0.8;
  }

  /* ローディング */
  #loader-center {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    z-index: 5;
  }

  #loading-text {
    margin-top: 16px;
    font-size: 14px;
    letter-spacing: 0.2em;
    color: #c2a87a;
  }

  .drip svg {
    width: 60px;
  }

  /* =========================
     スマホ（上下に開く）
  ========================= */
  @media (max-width: 768px) {

    #center-line {
      width: 100%;
      height: 1px;
      top: 50%;
      left: 0;
    }

    .door-a {
      width: 100%;
      height: 50%;
      top: 0;
      left: 0;
      transform-origin: center bottom;
    }

    .door-b {
      width: 100%;
      height: 50%;
      bottom: 0;
      left: 0;
      transform-origin: center top;
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

    <path d="M20 10 L40 10 L35 25 L25 25 Z"
      stroke="#eae7df" stroke-width="1.5"/>

    <circle cx="30" cy="32" r="2" fill="#c2a87a">
      <animate attributeName="cy" values="32;45;32" dur="1s" repeatCount="indefinite"/>
    </circle>

    <rect x="15" y="45" width="30" height="20" rx="3"
      stroke="#eae7df" stroke-width="1.5"/>

    <rect id="coffee-liquid"
      x="15" y="65"
      width="30"
      height="2"
      fill="#c2a87a" />

    <line x1="12" y1="67" x2="48" y2="67"
      stroke="#eae7df" stroke-width="1.5"/>

  </svg>
  `;
}

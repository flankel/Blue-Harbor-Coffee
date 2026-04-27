export function initLoader() {

  const root = document.getElementById("loader-root");
  if (!root) return;

  // =========================
  // 高さ補正（スマホ100vh対策）
  // =========================
  function setFullHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  setFullHeight();
  window.addEventListener("resize", setFullHeight);

  // =========================
  // HTML
  // =========================
  root.innerHTML = `
  <div id="door-wrapper">

    <!-- 左 or 上 -->
    <div class="door left">
      <div class="door-inner">
        <span>Blue Harbor Coffee</span>
      </div>
    </div>

    <!-- 右 or 下 -->
    <div class="door right">
      <div class="door-inner">
        <span>Since 2024</span>
      </div>
    </div>

    <!-- 中央ローダー -->
    <div id="loader-center">
      <div class="drip-wrap">
        ${dripSVG()}
      </div>
      <p id="loading-text">0%</p>
    </div>

  </div>
  `;

  injectStyle();

  // =========================
  // ローディング進行
  // =========================
  const percentText = document.getElementById("loading-text");
  const coffeeFill = document.getElementById("coffee-fill");
  const dripStream = document.getElementById("drip-stream");

  let progress = 0;

  const interval = setInterval(() => {

    progress += Math.random() * 12;

    if (progress >= 100) progress = 100;

    percentText.textContent = Math.floor(progress) + "%";

    // カップ内のコーヒー増加
    coffeeFill.setAttribute("height", progress * 0.28);
    coffeeFill.setAttribute("y", 44 - (progress * 0.28));

    if (progress >= 100) {
      clearInterval(interval);

      // ドリップ停止
      dripStream.style.opacity = "0";

      // ドリップ要素を消す
      setTimeout(() => {
        const center = document.getElementById("loader-center");
        center.style.opacity = "0";
      }, 400);

      // 扉OPEN
      setTimeout(() => {
        openDoor();
      }, 800);
    }

  }, 200);
}

function openDoor() {

  const isMobile = window.innerWidth < 768;

  const left = document.querySelector(".door.left");
  const right = document.querySelector(".door.right");

  if (isMobile) {
    left.style.transform = "translateY(-100%)";
    right.style.transform = "translateY(100%)";
  } else {
    left.style.transform = "translateX(-100%)";
    right.style.transform = "translateX(100%)";
  }

  // 削除（そのままトップページ表示）
  setTimeout(() => {
    document.getElementById("loader-root").remove();
  }, 1200);
}

function injectStyle() {

  const style = document.createElement("style");

  style.textContent = `
  :root {
    --vh: 1vh;
  }

  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    background: #f7f4ef;
  }

  #loader-root {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: calc(var(--vh) * 100);
    z-index: 9999;
  }

  #door-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    overflow: hidden;
    background: #2c3330;
    position: relative;
  }

  .door {
    background: #2c3330;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 1.2s ease;
    position: relative;
    z-index: 2;
  }

  .door-inner {
    color: #eae7df;
    font-family: 'Jost', sans-serif;
    letter-spacing: 0.2em;
    font-size: 12px;
    opacity: 0.7;
  }

  /* PC */
  @media (min-width: 768px) {
    .door {
      width: 50%;
      height: 100%;
    }
    .door.left {
      border-right: 1px solid rgba(255,255,255,0.1);
    }
    .door.right {
      border-left: 1px solid rgba(255,255,255,0.1);
    }
  }

  /* スマホ */
  @media (max-width: 767px) {
    #door-wrapper {
      flex-direction: column;
    }
    .door {
      width: 100%;
      height: 50%;
    }
    .door.left {
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    .door.right {
      border-top: 1px solid rgba(255,255,255,0.1);
    }
  }

  /* ローダー */
  #loader-center {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 3;
    transition: opacity 0.4s ease;
  }

  #loading-text {
    margin-top: 14px;
    font-size: 11px;
    letter-spacing: 0.2em;
    color: #c2a87a;
    font-family: 'Jost', sans-serif;
  }

  .drip-wrap {
    width: 60px;
    height: 70px;
    overflow: hidden;
  }

  svg {
    display: block;
  }
  `;

  document.head.appendChild(style);
}

function dripSVG() {
  return `
  <svg width="60" height="70" viewBox="0 0 60 70">

    <!-- ドリッパー -->
    <polygon points="15,10 45,10 35,25 25,25"
      stroke="#eae7df" stroke-width="1.2" fill="none"/>

    <!-- フィルター -->
    <line x1="20" y1="14" x2="40" y2="14" stroke="#eae7df" stroke-width="1"/>
    <line x1="22" y1="18" x2="38" y2="18" stroke="#eae7df" stroke-width="1"/>

    <!-- コーヒー滴 -->
    <rect id="drip-stream" x="29" y="25" width="2" height="10" fill="#c2a87a">
      <animate attributeName="height" values="6;14;6" dur="0.8s" repeatCount="indefinite"/>
    </rect>

    <!-- カップ -->
    <rect x="18" y="35" width="24" height="18" rx="3"
      stroke="#eae7df" stroke-width="1.2" fill="none"/>

    <!-- コーヒー中身（クリップ） -->
    <clipPath id="cup-clip">
      <rect x="18" y="35" width="24" height="18" rx="3"/>
    </clipPath>

    <rect id="coffee-fill"
      x="18"
      y="53"
      width="24"
      height="0"
      fill="#c2a87a"
      clip-path="url(#cup-clip)"
    />

  </svg>
  `;
}

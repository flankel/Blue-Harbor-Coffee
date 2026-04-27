export function initLoader() {

  const root = document.getElementById("loader-root");
  if (!root) return;

  root.innerHTML = `
  <div id="door-wrapper">

    <div id="center-line"></div>

    <div class="door door-a">
      <div class="door-inner">
        <span class="door-text">Blue Harbor Coffee</span>
      </div>
    </div>

    <div class="door door-b">
      <div class="door-inner">
        <span class="door-text">Since 2024</span>
      </div>
    </div>

    <div id="loader-center">
      <div class="drip">${dripSVG()}</div>
      <p id="loading-text">0%</p>
    </div>

  </div>
  `;

  injectStyle();

  const text = document.getElementById("loading-text");
  const liquid = document.getElementById("coffee-liquid");
  const loaderCenter = document.getElementById("loader-center");

  const CUP_BOTTOM = 74;
  const CUP_TOP = 52;
  const CUP_HEIGHT = CUP_BOTTOM - CUP_TOP;

  let percent = 0;

  const interval = setInterval(() => {

    percent++;
    text.textContent = percent + "%";

    const h = (percent / 100) * CUP_HEIGHT;
    const y = CUP_BOTTOM - h;

    liquid.setAttribute("height", h);
    liquid.setAttribute("y", y);

    if (percent >= 100) {
      clearInterval(interval);

      text.textContent = "Loading Completed";

      // 👇 ここだけ調整（短く＋ふわっと強化）
      setTimeout(() => {
        const wrapper = document.getElementById("door-wrapper");
        if (wrapper) wrapper.classList.add("fade-out");
        loaderCenter.classList.add("fade-out");
      }, 50); // ← かなり短縮

      setTimeout(openDoors, 900); // ← 少し早めに扉開始
    }
  }, 28);

  function openDoors() {

    const a = document.querySelector(".door-a");
    const b = document.querySelector(".door-b");
    const isMobile = window.innerWidth <= 768;

    setTimeout(() => {
      if (isMobile) {
        a.style.transform = "translateY(-100%)";
      } else {
        a.style.transform = "translateX(-100%)";
      }
    }, 80);

    setTimeout(() => {
      if (isMobile) {
        b.style.transform = "translateY(100%)";
      } else {
        b.style.transform = "translateX(100%)";
      }
    }, 180);

    setTimeout(() => {
      root.remove();
    }, 1400);
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
    background: transparent;

    opacity: 1;

    /* 👇 ふわっと強化 */
    transition: opacity 1.2s cubic-bezier(0.22, 1, 0.36, 1);
  }

  #door-wrapper.fade-out {
    opacity: 0;
  }

  #center-line {
    position: absolute;
    width: 1px;
    height: 100%;
    left: 50%;
    top: 0;
    background: rgba(255,255,255,0.2);
    z-index: 20;
  }

  .door {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 1.6s cubic-bezier(0.77, 0, 0.18, 1);
    background: linear-gradient(to right, #232826, #2c3330 50%, #1f2523);
  }

  .door::after {
    content: "";
    position: absolute;
    inset: 0;
    box-shadow: inset 0 0 40px rgba(0,0,0,0.4);
  }

  .door-a {
    width: 50%;
    height: 100%;
    left: 0;
    top: 0;
  }

  .door-b {
    width: 50%;
    height: 100%;
    right: 0;
    top: 0;
  }

  .door-inner {
    color: #eae7df;
    font-family: 'Jost', sans-serif;
    letter-spacing: 0.25em;
    font-size: 13px;
    opacity: 0.75;
  }

  #loader-center {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 30;
    pointer-events: none;

    /* 👇 ここも強化 */
    transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1),
                transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
  }

  #loader-center.fade-out {
    opacity: 0;
    transform: translateY(16px) scale(0.96);
  }

  #loading-text {
    margin-top: 14px;
    font-size: 13px;
    letter-spacing: 0.25em;
    color: #c2a87a;
  }

  .drip svg {
    width: 64px;
  }

  @media (max-width: 768px) {

    #center-line {
      width: 100%;
      height: 1px;
      top: 50%;
      left: 0;
    }

    .door {
      background: linear-gradient(to bottom, #232826, #2c3330 50%, #1f2523);
    }

    .door-a {
      width: 100%;
      height: 50%;
      top: 0;
      left: 0;
      z-index: 2;
    }

    .door-b {
      width: 100%;
      height: 50%;
      top: 50%;
      left: 0;
      z-index: 1;
    }
  }

  .steam {
    opacity: 0.4;
    animation: steam 2.5s ease-in-out infinite;
  }

  @keyframes steam {
    0% { transform: translateY(0); opacity: 0.3; }
    100% { transform: translateY(-14px); opacity: 0; }
  }
  `;

  document.head.appendChild(style);
}


// =========================
// SVG
// =========================
function dripSVG() {
  return `
  <svg viewBox="0 0 60 90" fill="none">

    <path class="steam" d="M28 5 Q30 0 32 5" stroke="#c2a87a" stroke-width="1"/>

    <path d="M18 15 L42 15 L36 32 L24 32 Z"
      stroke="#eae7df" stroke-width="1.5"/>

    <circle cx="30" cy="38" r="2" fill="#c2a87a">
      <animate attributeName="cy" values="38;52;38" dur="0.9s" repeatCount="indefinite"/>
    </circle>

    <rect x="15" y="52" width="30" height="22" rx="4"
      stroke="#eae7df" stroke-width="1.5"/>

    <defs>
      <clipPath id="cup-clip">
        <rect x="15" y="52" width="30" height="22" rx="4"/>
      </clipPath>
    </defs>

    <rect id="coffee-liquid"
      x="15"
      y="74"
      width="30"
      height="0"
      fill="#c2a87a"
      clip-path="url(#cup-clip)" />

    <line x1="12" y1="76" x2="48" y2="76"
      stroke="#eae7df" stroke-width="1.5"/>

  </svg>
  `;
}

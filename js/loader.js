export function initLoader() {

  const root = document.getElementById("loader-root");

  if (sessionStorage.getItem("loaderShown")) {
    if (root) {
      root.style.background = "transparent";
      root.style.pointerEvents = "none";
    }
    document.body.classList.add("loaded");
    return;
  }
  sessionStorage.setItem("loaderShown", "true");

  if (!root) return;

  // ★ 初回だけここで背景を付与
  root.style.background = "#1f2523";

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

      setTimeout(() => {
        loaderCenter.classList.add("fade-out");
      }, 400);

      setTimeout(openDoors, 900);
    }
  }, 28);


  function openDoors() {

    const a = document.querySelector(".door-a");
    const b = document.querySelector(".door-b");
    const line = document.getElementById("center-line");
    const wrapper = document.getElementById("door-wrapper");
    const root = document.getElementById("loader-root");
    const isMobile = window.innerWidth <= 768;

    if (line) {
      line.style.transition = "opacity 0.15s ease, transform 0.2s ease";
      line.style.opacity = "0";
      line.style.transform = isMobile
        ? "translateY(-20px)"
        : "translateX(-20px)";
      line.style.willChange = "transform, opacity";
    }

    if (root) {
      root.style.background = "transparent";
    }

    setTimeout(() => {
      if (isMobile) {
        a.style.transform = "translateY(-110%)";
      } else {
        a.style.transform = "translateX(-110%)";
      }
    }, 120);

    setTimeout(() => {
      if (isMobile) {
        b.style.transform = "translateY(110%)";
      } else {
        b.style.transform = "translateX(110%)";
      }
    }, 240);

    setTimeout(() => {
      if (line) line.remove();
      if (wrapper) wrapper.remove();
      if (root) root.remove();
      document.body.classList.add("loaded");
    }, 1400);
  }
}


// =========================
// CSS
// =========================
function injectStyle() {
  const style = document.createElement("style");

  style.textContent = `
  #loader-root {
    position: fixed;
    inset: 0;
    z-index: 999999;
    background: transparent; /* ★ここだけ変更（黒削除） */
  }

  #door-wrapper {
    position: absolute;
    inset: 0;
    overflow: hidden;
    background: transparent;
  }

  #center-line {
    position: absolute;
    width: 1px;
    height: 100%;
    left: 50%;
    top: 0;
    background: rgba(255,255,255,0.2);
    z-index: 20;
    will-change: transform, opacity;
    backface-visibility: hidden;
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
    transition: opacity 0.4s ease, transform 0.4s ease;
  }

  #loader-center.fade-out {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
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

    .door-a, .door-b {
      width: 100%;
      height: 50%;
    }

    .door-a { top: 0; }
    .door-b { top: 50%; }
  }
  `;

  document.head.appendChild(style);
}

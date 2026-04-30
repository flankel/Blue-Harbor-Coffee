export function initLoader() {

  const root = document.getElementById("loader-root");

  // =========================
  // 2回目以降（完全スキップ）
  // =========================
  if (sessionStorage.getItem("loaderShown")) {
    if (root) {
      root.style.display = "none";
    }
    document.body.classList.add("loaded");
    return;
  }

  sessionStorage.setItem("loaderShown", "true");

  if (!root) return;

  // ★CSS注入（必須）
  injectStyle();

  // ★HTML生成
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

  root.style.display = "block";
  root.style.opacity = "1";
  root.style.background = "#1f2523";

  const text = document.getElementById("loading-text");
  const liquid = document.getElementById("coffee-liquid");
  const loaderCenter = document.getElementById("loader-center");

  const CUP_BOTTOM = 74;
  const CUP_TOP = 52;
  const CUP_HEIGHT = CUP_BOTTOM - CUP_TOP;

  let percent = 0;

  const interval = setInterval(() => {

    percent++;
    if (text) text.textContent = percent + "%";

    // ★安全処理（SVG未生成でも落とさない）
    if (liquid) {
      const h = (percent / 100) * CUP_HEIGHT;
      const y = CUP_BOTTOM - h;

      liquid.setAttribute("height", h);
      liquid.setAttribute("y", y);
    }

    if (percent >= 100) {
      clearInterval(interval);

      if (text) text.textContent = "Loading Completed";

      if (loaderCenter) {
        setTimeout(() => {
          loaderCenter.classList.add("fade-out");
        }, 400);
      }

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
      if (a) {
        a.style.transform = isMobile
          ? "translateY(-110%)"
          : "translateX(-110%)";
      }
    }, 120);

    setTimeout(() => {
      if (b) {
        b.style.transform = isMobile
          ? "translateY(110%)"
          : "translateX(110%)";
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
// CSS（これが injectStyle）
// =========================
function injectStyle() {
  const style = document.createElement("style");

  style.textContent = `
  #loader-root {
    position: fixed;
    inset: 0;
    z-index: 999999;
    opacity: 0;
    background: transparent;
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
  }

  .door {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 1.6s cubic-bezier(0.77, 0, 0.18, 1);
    background: linear-gradient(to right, #232826, #2c3330 50%, #1f2523);
  }

  .door-a { width: 50%; height: 100%; left: 0; top: 0; }
  .door-b { width: 50%; height: 100%; right: 0; top: 0; }

  .door-inner {
    color: #eae7df;
    font-family: sans-serif;
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

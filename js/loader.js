// loader.js
(function () {

  function initLoader(options = {}) {

    const duration = options.duration || 3500;
    const root = document.getElementById("loader-root");
    if (!root) return;

    // =========================
    // HTML生成
    // =========================
    root.innerHTML = `
      <div id="loader" style="
        position:fixed;
        inset:0;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        background:#f7f4ef;
        font-family:sans-serif;
      ">

        <div style="margin-bottom:30px; position:relative; width:160px; height:160px;">
          <div id="ringOuter" style="
            position:absolute;
            inset:0;
            border:1px solid rgba(0,0,0,0.2);
            border-radius:50%;
          "></div>

          <div style="
            position:absolute;
            inset:25px;
            border:1px solid rgba(0,0,0,0.1);
            border-radius:50%;
          "></div>

          <div style="
            position:absolute;
            inset:0;
            display:flex;
            align-items:center;
            justify-content:center;
          ">
            ${cupSVG()}
          </div>
        </div>

        <h1 style="font-size:40px; margin-bottom:10px;">Havsbris</h1>

        <div style="
          display:flex;
          align-items:center;
          gap:15px;
          margin-top:20px;
        ">
          <div id="barL" style="
            width:60px;
            height:2px;
            background:#c2a87a;
            transform-origin:left;
            transform:scaleX(0);
          "></div>

          <span id="loadLabel" style="font-size:14px;">0%</span>

          <div id="barR" style="
            width:60px;
            height:2px;
            background:#c2a87a;
            transform-origin:right;
            transform:scaleX(0);
          "></div>
        </div>

      </div>
    `;

    // =========================
    // Tick生成
    // =========================
    const ring = document.getElementById("ringOuter");

    for (let i = 0; i < 24; i++) {
      const tick = document.createElement("div");

      tick.style.position = "absolute";
      tick.style.top = "50%";
      tick.style.left = "50%";
      tick.style.width = "1px";
      tick.style.height = "8px";
      tick.style.background = "rgba(0,0,0,0.3)";
      tick.style.transformOrigin = "0 -75px";
      tick.style.transform =
        `translateX(-50%) rotate(${i * 15}deg)`;

      ring.appendChild(tick);
    }

    // =========================
    // DOM取得
    // =========================
    const labelEl = document.getElementById("loadLabel");
    const barL = document.getElementById("barL");
    const barR = document.getElementById("barR");

    let progress = 0;

    // =========================
    // パーセンテージ進行
    // =========================
    const progressInterval = setInterval(() => {

      // 減速カーブ（自然な進み）
      progress += (100 - progress) * 0.08;

      if (progress >= 99.5) {
        progress = 100;
      }

      const value = Math.floor(progress);

      labelEl.textContent = value + "%";

      barL.style.transform = `scaleX(${progress / 100})`;
      barR.style.transform = `scaleX(${progress / 100})`;

      if (progress === 100) {
        clearInterval(progressInterval);
      }

    }, 50);

    // =========================
    // 終了処理
    // =========================
    setTimeout(() => {

      progress = 100;
      labelEl.textContent = "100%";

      clearInterval(progressInterval);

      const loader = document.getElementById("loader");
      const page   = document.getElementById("page");

      loader.style.transition = "opacity 0.8s ease";
      loader.style.opacity = "0";

      if (page) {
        page.style.transition = "opacity 0.8s ease 0.4s";
        page.style.opacity = "1";
        page.style.pointerEvents = "auto";
      }

      setTimeout(() => {
        loader.remove();
      }, 1200);

    }, duration);

  }

  // =========================
  // カップSVG
  // =========================
  function cupSVG() {
    return `
      <svg width="40" height="45" viewBox="0 0 38 46" fill="none">
        <rect x="6" y="12" width="26" height="27" rx="2" stroke="#2c3330"/>
        <path d="M32 19 Q43 19 43 26 Q43 33 32 31" stroke="#2c3330"/>
        <line x1="4" y1="39" x2="34" y2="39" stroke="#2c3330"/>
      </svg>
    `;
  }

  // =========================
  // 自動起動
  // =========================
  document.addEventListener("DOMContentLoaded", () => {

    if (!sessionStorage.getItem("visited")) {

      sessionStorage.setItem("visited", "true");

      initLoader({
        duration: 3500
      });

    } else {

      const page = document.getElementById("page");

      if (page) {
        page.style.opacity = "1";
        page.style.pointerEvents = "auto";
      }

    }

  });

})();

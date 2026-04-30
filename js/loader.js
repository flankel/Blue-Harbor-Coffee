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

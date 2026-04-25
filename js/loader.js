export function initLoader() {

  // =========================
  // root取得（🔥ここが最重要）
  // =========================
  const root = document.getElementById("loader-root");
  if (!root) return;

  // =========================
  // HTML生成（body上書きしない）
  // =========================
  root.innerHTML = `
  <div id="loader">
    <span class="corner tl" id="c-tl">Oslo · Norway</span>
    <span class="corner tr" id="c-tr">57°N</span>
    <span class="corner bl" id="c-bl">Fjordside</span>
    <span class="corner br" id="c-br">Since 1937</span>

    <div class="ring-wrap" id="ring">
      <div class="ring-outer" id="ringOuter"></div>
      <div class="ring-inner"></div>
      <div class="cup-center">
        ${cupSVG()}
      </div>
    </div>

    <div class="brand" id="brand">
      <h1 class="brand-name">Havsbris</h1>
      <p class="brand-sub">Kaffehus · Fjordside</p>
    </div>

    <div class="load-row" id="loadRow">
      <div class="bar" id="barL"></div>
      <span class="load-label" id="loadLabel">Loading</span>
      <div class="bar right" id="barR"></div>
    </div>

    <div class="morse" id="morse">
      <div class="m-dash"></div>
      <div class="m-dot"></div>
      <div class="m-dot"></div>
      <div class="m-dash"></div>
      <div class="m-dot"></div>
    </div>
  </div>
  `;

  injectStyle();

  // =========================
  // Helper
  // =========================
  const el = id => document.getElementById(id);

  const animate = (element, props, delay = 0) => {
    setTimeout(() => {
      if (element) Object.assign(element.style, props);
    }, delay);
  };

  // =========================
  // Tick生成
  // =========================
  const ringOuter = el('ringOuter');
  const TICKS = 24;

  for (let i = 0; i < TICKS; i++) {
    const tick = document.createElement('div');
    tick.className = 'tick';
    tick.style.transform =
      `translateX(-50%) rotate(${i * (360 / TICKS)}deg) translateY(-82px)`;
    ringOuter.appendChild(tick);
  }

  // =========================
  // Morse
  // =========================
  document.querySelectorAll('.m-dash, .m-dot').forEach((p, i) => {
    p.style.animation = `morseFlash 2s ease-in-out ${i * 0.28}s infinite`;
  });

  // =========================
  // Entrance animation
  // =========================
  ['c-tl','c-tr','c-bl','c-br'].forEach((id,i)=>{
    animate(el(id), {
      animation: `fadeUp 0.8s ease ${i*0.12}s forwards`
    });
  });

  animate(el('ring'), { animation: 'fadeUp 1s 0.3s forwards' });
  animate(el('brand'), { animation: 'fadeUp 1s 0.7s forwards' });
  animate(el('loadRow'), { animation: 'fadeUp 0.8s 1.1s forwards' });

  setTimeout(()=>{
    el('barL').style.animation = 'scaleBar 1.2s forwards';
    el('barR').style.animation = 'scaleBar 1.2s forwards';
  },1300);

  animate(el('morse'), { animation: 'fadeUp 0.6s 1.5s forwards' });

  // =========================
  // Loading表示
  // =========================
  const labels = ['Loading','Brewing','Almost there'];
  let idx = 0;

  setTimeout(()=>{
    const interval = setInterval(()=>{
      idx = (idx+1)%labels.length;
      const label = el('loadLabel');

      if (!label) return;

      label.style.opacity = '0';
      setTimeout(()=>{
        label.textContent = labels[idx];
        label.style.opacity = '1';
      },300);
    },1400);

    // =========================
    // 終了処理（🔥ここも重要）
    // =========================
    setTimeout(()=>{
      clearInterval(interval);

      root.style.opacity = '0';
      root.style.transition = '0.8s';

      setTimeout(()=>{
        root.remove(); // ← loader-rootごと削除
      },800);

    },3800);

  },1200);
}


// =========================
// SVG
// =========================
function cupSVG() {
  return `
  <svg width="38" height="46" viewBox="0 0 38 46">
    <path d="M14 7 Q16 3 18 7" stroke="#7a8c82"/>
    <path d="M20 5 Q22 1 24 5" stroke="#7a8c82"/>
    <rect x="6" y="12" width="26" height="27" rx="2" stroke="#2c3330"/>
    <path d="M32 19 Q43 19 43 26 Q43 33 32 31" stroke="#2c3330"/>
    <line x1="4" y1="39" x2="34" y2="39" stroke="#2c3330"/>
    <circle cx="19" cy="26" r="4" stroke="#c2a87a"/>
  </svg>
  `;
}


// =========================
// CSS注入
// =========================
function injectStyle() {
  const style = document.createElement('style');

  style.textContent = `
  body { margin:0; background:#f7f4ef; }

  #loader {
    position:fixed; inset:0;
    display:flex; flex-direction:column;
    align-items:center; justify-content:center;
    background:#f7f4ef;
  }

  .corner { position:absolute; font-size:10px; opacity:0; }
  .tl{top:28px;left:28px;}
  .tr{top:28px;right:28px;}
  .bl{bottom:28px;left:28px;}
  .br{bottom:28px;right:28px;}

  .ring-wrap { width:172px;height:172px;opacity:0; }
  .ring-outer { position:absolute; inset:0; border:1px solid #aaa; border-radius:50%; animation:rotateCW 22s linear infinite;}
  .ring-inner { position:absolute; inset:24px; border:1px solid #ccc; border-radius:50%; animation:rotateCCW 14s linear infinite;}

  .tick { position:absolute; top:50%; left:50%; width:1px; height:8px; background:#999; }

  .brand, .load-row, .morse { opacity:0; }

  .bar { height:1px; width:52px; background:#c2a87a; transform:scaleX(0); }

  @keyframes rotateCW { to{transform:rotate(360deg);} }
  @keyframes rotateCCW { to{transform:rotate(-360deg);} }
  @keyframes fadeUp { from{opacity:0; transform:translateY(14px);} to{opacity:1;} }
  @keyframes scaleBar { to{transform:scaleX(1);} }
  @keyframes morseFlash { 0%,100%{opacity:.2;} 50%{opacity:1;} }
  `;

  document.head.appendChild(style);
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("data/storeInfo.json");
    const data = await res.json();

    renderHero(data.hero);
    renderGallery(data.gallery);
    renderMap(data.map);
    renderStoreInfo(data);
    renderAccess(data);

  } catch (err) {
    console.error("storeInfoの読み込みに失敗:", err);
  }
});

/* =========================
   HERO
========================= */
function renderHero(hero) {
  const img = document.getElementById("hero-image");
  const title = document.getElementById("hero-title");

  if (img) img.src = hero.image;
  if (title) title.textContent = hero.title;
}

/* =========================
   GALLERY
========================= */
function renderGallery(gallery) {
  const container = document.getElementById("gallery");
  if (!container) return;

  container.innerHTML = gallery.map(item => `
    <img src="${item.src}"
         alt="${item.alt}"
         class="rounded-xl shadow-md w-full h-64 object-cover">
  `).join("");
}

/* =========================
   MAP
========================= */
function renderMap(map) {
  const mapImg = document.getElementById("map-image");
  const iframe = document.getElementById("google-map");

  if (mapImg) mapImg.src = map.image;
  if (iframe) iframe.src = map.googleEmbed;
}

/* =========================
   STORE INFO
========================= */
function renderStoreInfo(data) {
  const main = document.getElementById("store-info-main");
  const pcHours = document.getElementById("store-hours");

  if (!main) return;

  const store = data.store;

  /* --- PC 表示エリア --- */
  if (pcHours) {
    pcHours.innerHTML = `
      <div class="w-full">
        <p class="text-xs tracking-widest text-gray-400 font-eng uppercase mb-3 text-center">
          Opening Hours
        </p>
        ${renderHours(data.hours)}
      </div>
    `;
  }

  /* --- メイン（スマホ・共通）エリア --- */
  main.innerHTML = `
    <h3 class="text-2xl font-bold tracking-wide text-left">
      ${store.name}
    </h3>

    <!-- Address -->
    <div class="mt-6">
      <p class="text-xs tracking-widest text-gray-400 font-eng uppercase mb-1 text-left">
        Address
      </p>
      <p class="text-lg leading-relaxed text-left">
        ${store.address}
      </p>
    </div>

    <!-- Phone -->
    <div class="mt-4">
      <p class="text-xs tracking-widest text-gray-400 font-eng uppercase mb-1 text-left">
        Phone Number
      </p>
      <p class="text-lg text-left">
        <a href="tel:${store.phone.replace(/-/g, "")}"
           class="text-blue-600 hover:underline">
          ${store.phone}
        </a>
      </p>
    </div>

    <!-- Opening Hours (Mobile Only) -->
    <div class="md:hidden mt-6">
      <p class="text-xs tracking-widest text-gray-400 font-eng uppercase mb-3 text-left">
        Opening Hours
      </p>
      ${renderHours(data.hours)}
    </div>

    <!-- Facilities -->
    <div class="mt-6">
      <p class="text-xs tracking-widest text-gray-400 font-eng uppercase mb-3 text-left">
        Facilities
      </p>
      ${renderFacilities(data.facilities)}
    </div>

    <!-- SNS -->
    <div class="mt-6">
      ${renderSNS(data.sns)}
    </div>
  `;
}

/* =========================
   ACCESS
========================= */
function renderAccess(data) {
  const container = document.getElementById("access-info");
  if (!container) return;

  const store = data.store;

  container.innerHTML = `
    <div class="bg-white p-8 rounded-2xl shadow-md border border-gray-100 max-w-xl mx-auto text-center">
      <h3 class="text-sm tracking-widest text-gray-400 mb-4">
        ACCESS
      </h3>

      <div class="space-y-2 text-sm text-gray-700 leading-relaxed">
        ${store.access.map(a => `<p>${a}</p>`).join("")}
      </div>
    </div>
  `;
}

/* =========================
   HOURS (修正済み黒板デザイン)
========================= */
function renderHours(hours) {
  const isMobile = window.innerWidth < 768;

  // 手書き風フォント読み込み
  if (!document.getElementById('chalk-fonts')) {
    const link = document.createElement('link');
    link.id = 'chalk-fonts';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Klee+One:wght@600&family=Itim&display=swap';
    document.head.appendChild(link);
  }

  // スマホとPCでサイズを微調整
  const fontSizeDay = isMobile ? '16px' : '20px';
  const fontSizeTime = isMobile ? '15px' : '20px';
  const boardPadding = isMobile ? '15px 12px' : '25px 24px';

  return `
    <style>
      .chalk-text { font-family: 'Klee One', 'Itim', cursive; }
      .chalk-title { font-family: 'Caveat', cursive; }
      .no-wrap { white-space: nowrap; }
    </style>

    <div class="max-w-md mx-auto chalk-text">
      <!-- 木枠 -->
      <div class="p-3 sm:p-4 rounded-lg"
           style="
             background: #3e2b1e;
             box-shadow: 0 10px 30px rgba(0,0,0,0.5);
             border: 4px solid #4e3626;
           ">

        <!-- 黒板本体 -->
        <div class="rounded shadow-inner relative overflow-hidden"
             style="
               background: #1a1c1d;
               padding: ${boardPadding};
               min-height: 420px;
             ">

          <!-- チョーク粉 -->
          <div class="absolute inset-0 pointer-events-none opacity-20"
               style="
                 background-image: radial-gradient(#ffffff 0.5px, transparent 0.5px);
                 background-size: 20px 20px;
               ">
          </div>

          <!-- ヘッダー -->
          <div class="flex justify-between items-center relative z-10 mb-2">
            <div style="color: #f5f5f5; font-size: 20px; transform: rotate(-10deg);">≛</div>
            <div class="chalk-title ${isMobile ? 'text-3xl' : 'text-4xl'} text-white tracking-wide">
              Opening Hours
            </div>
            <div class="opacity-80">
              <svg width="34" height="34" viewBox="0 0 64 64" fill="none" stroke="#f5f5f5" stroke-width="2.5">
                <path d="M15 32c0-8 4-12 15-12s15 4 15 12c0 10-5 15-15 15s-15-5-15-15z" />
                <path d="M45 28c4 0 7 2 7 6s-3 6-7 6" />
                <path d="M12 50h36" />
              </svg>
            </div>
          </div>

          <div style="border-top: 1px dotted rgba(255,255,255,0.3); margin-bottom: 16px;"></div>

          <!-- リスト -->
          <div class="relative z-10" style="display:flex; flex-direction:column; gap:4px;">
            ${hours.map((h) => {
              const isSunday = h.day === "日";
              const isHighlight = h.highlight === "red" || isSunday;
              const textColor = h.highlight === "blue" ? "#a5f3fc" : (isHighlight ? "#ff9a9a" : "#f1f1f1");
              const dotColor = isHighlight ? "rgba(255,154,154,0.2)" : "rgba(255,255,255,0.15)";

              return `
                <div style="
                  display: flex; 
                  justify-content: space-between; 
                  align-items: baseline; 
                  padding: 6px 0;
                  border-bottom: 1px dotted ${dotColor};
                  color: ${textColor};
                ">
                  <span style="font-size: ${fontSizeDay}; min-width: 1.5em;">${h.day}</span>
                  <span class="no-wrap" style="font-size: ${fontSizeTime}; font-weight: 600; letter-spacing: 0.05em;">
                    ${h.closed ? 'CLOSED' : `${h.open} — ${h.close}`}
                  </span>
                </div>
                ${h.note ? `
                  <div style="color: ${textColor}; font-size: 11px; text-align: right; margin-top: 2px; opacity: 0.8; line-height: 1.4;">
                    ※ ${isMobile ? h.note.replace("場合 ", "場合<br>") : h.note}
                  </div>
                ` : ''}
              `;
            }).join("")}
          </div>

          <!-- 装飾植物 -->
          <div class="absolute bottom-12 right-2 opacity-30 pointer-events-none">
             <svg width="50" height="50" viewBox="0 0 64 64" fill="none" stroke="#f1f1f1" stroke-width="1.5">
               <path d="M10 55 Q25 45 35 15" />
               <path d="M35 15 Q45 10 50 20 Q35 25 35 15" />
               <path d="M30 35 Q40 30 45 40 Q25 40 30 35" />
             </svg>
          </div>

          <!-- フッター -->
          <div class="mt-8 text-center relative z-10">
            <div style="letter-spacing: 0.2em; color: #bbbbbb; font-size: 12px;">
              BLUE HARBOR COFFEE
            </div>
            <div class="mt-2 opacity-40">
              <svg width="100" height="6" viewBox="0 0 120 8" class="mx-auto">
                <path d="M0 5 Q15 0 30 5 T60 5 T90 5 T120 5" fill="none" stroke="white" stroke-width="1"/>
              </svg>
            </div>
          </div>

        </div>
      </div>
    </div>
  `;
}

/* =========================
   FACILITIES
========================= */
function renderFacilities(facilities) {
  return `
    <div class="grid grid-cols-2 gap-y-3 text-sm text-left">
      ${facilities.map(f => `
        <div class="font-eng font-medium text-gray-600">${f.label}</div>
        <div>${f.value}</div>
      `).join("")}
    </div>
  `;
}

/* =========================
   SNS
========================= */
function renderSNS(sns) {
  return `
    <div>
      <p class="text-xs tracking-widest text-gray-400 font-eng uppercase mb-2">
        SNS
      </p>
      <div class="text-lg text-left space-x-4">
        <a href="${sns.instagram}" class="text-blue-600 hover:underline">
          Instagram
        </a>
        <a href="${sns.twitter}" class="text-blue-600 hover:underline">
          X (Twitter)
        </a>
      </div>
    </div>
  `;
}

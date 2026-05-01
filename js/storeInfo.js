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

  /* =========================
     PC
  ========================= */
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

  /* =========================
     スマホ
  ========================= */
  main.innerHTML = `
    <h3 class="text-2xl font-bold tracking-wide text-left">
      ${store.name}
    </h3>

    <!-- Address -->
    <div>
      <p class="text-xs tracking-widest text-gray-400 font-eng uppercase mb-1 text-left">
        Address
      </p>
      <p class="text-lg leading-relaxed text-left">
        ${store.address}
      </p>
    </div>

    <!-- Phone -->
    <div>
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

    <!-- Opening Hours -->
    <div class="md:hidden">
      <p class="text-xs tracking-widest text-gray-400 font-eng uppercase mb-3 text-left">
        Opening Hours
      </p>
      ${renderHours(data.hours)}
    </div>

    <!-- Facilities -->
    <div>
      <p class="text-xs tracking-widest text-gray-400 font-eng uppercase mb-3 text-left">
        Facilities
      </p>
      ${renderFacilities(data.facilities)}
    </div>

    <!-- SNS -->
    ${renderSNS(data.sns)}
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
   HOURS（🔥黒板デザインに変更）
========================= */
/**
 * 黒板風デザイン（デザイン案②）を再現したrenderHours関数
 */
function renderHours(hours) {
  const isMobile = window.innerWidth < 768;

  // 手書き風フォントを動的に読み込み（すでに読み込まれている場合はスキップされます）
  if (!document.getElementById('chalk-fonts')) {
    const link = document.createElement('link');
    link.id = 'chalk-fonts';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Klee+One:wght@600&family=Itim&display=swap';
    document.head.appendChild(link);
  }

  return `
    <!-- フォントスタイル定義 -->
    <style>
      .chalk-text { font-family: 'Klee One', 'Itim', cursive; }
      .chalk-title { font-family: 'Caveat', cursive; }
    </style>

    <div class="max-w-md mx-auto chalk-text">
      <!-- 木枠（深みのあるダークブラウン） -->
      <div class="p-4 rounded-lg"
           style="
             background: #3e2b1e;
             box-shadow: 
               0 15px 35px rgba(0,0,0,0.5),
               inset 0 0 15px rgba(0,0,0,0.5);
             border: 4px solid #4e3626;
           ">

        <!-- 黒板本体 -->
        <div class="p-6 rounded shadow-inner relative overflow-hidden"
             style="
               background: #1a1c1d;
               border: 1px solid #2a2a2a;
               min-height: 450px;
             ">

          <!-- チョークの粉っぽさ（テクスチャ） -->
          <div class="absolute inset-0 pointer-events-none opacity-30"
               style="
                 background-image: 
                   radial-gradient(#ffffff 0.5px, transparent 0.5px),
                   radial-gradient(#ffffff 0.5px, transparent 0.5px);
                 background-size: 30px 30px;
                 background-position: 0 0, 15px 15px;
                 filter: blur(0.5px);
               ">
          </div>

          <!-- ☕ ヘッダー装飾（アクセントとマグ） -->
          <div class="flex justify-between items-start relative z-10 mb-2">
            <div style="color: #f5f5f5; font-size: 24px; transform: rotate(-10deg);"> ≛ </div>
            <div class="text-center">
              <div class="chalk-title text-4xl text-white tracking-wide" style="line-height: 1.2;">
                Opening Hours
              </div>
            </div>
            <div class="opacity-90">
              <svg width="40" height="40" viewBox="0 0 64 64" fill="none" stroke="#f5f5f5" stroke-width="2">
                <path d="M15 32c0-8 4-12 15-12s15 4 15 12c0 10-5 15-15 15s-15-5-15-15z" />
                <path d="M45 28c4 0 7 2 7 6s-3 6-7 6" />
                <path d="M22 14c1-4 3-4 4 0M30 14c1-4 3-4 4 0" />
                <path d="M12 50h36" />
              </svg>
            </div>
          </div>

          <!-- 区切り点線 -->
          <div style="border-top: 1.5px dotted rgba(255,255,255,0.4); margin: 10px 0 20px 0;"></div>

          <!-- 営業時間リスト -->
          <div class="relative z-10" style="display:flex; flex-direction:column; gap:6px;">
            ${hours.map((h, index) => {
              const isSunday = h.day === "日";
              const isHighlight = h.highlight === "red" || isSunday;
              const textColor = h.highlight === "blue" ? "#a5f3fc" : (isHighlight ? "#ff9a9a" : "#f1f1f1");
              const dotColor = isHighlight ? "rgba(255,154,154,0.3)" : "rgba(255,255,255,0.2)";

              return `
                <div style="
                  display: flex; 
                  justify-content: space-between; 
                  align-items: center; 
                  padding: 4px 0;
                  border-bottom: 1px dotted ${dotColor};
                  color: ${textColor};
                ">
                  <span class="text-xl px-2" style="text-shadow: 0 0 2px rgba(255,255,255,0.2);">${h.day}</span>
                  <span class="text-xl font-medium tracking-wider" style="text-shadow: 0 0 2px rgba(255,255,255,0.2);">
                    ${h.closed ? 'CLOSED' : `${h.open} - ${h.close}`}
                  </span>
                </div>
                ${h.note ? `
                  <div class="text-right" style="color: ${textColor}; font-size: 13px; margin-top: -2px; padding-bottom: 8px; opacity: 0.9;">
                    ※ ${isMobile ? h.note.replace("場合 ", "場合<br>") : h.note}
                  </div>
                ` : ''}
              `;
            }).join("")}
          </div>

          <!-- 🌿 装飾（右下の植物） -->
          <div class="absolute bottom-10 right-4 opacity-40">
             <svg width="60" height="60" viewBox="0 0 64 64" fill="none" stroke="#ff9a9a" stroke-width="1.5">
               <path d="M10 50 Q30 45 40 10" />
               <path d="M38 15 Q45 15 48 25 Q35 25 38 15" />
               <path d="M33 30 Q40 30 43 40 Q30 40 33 30" />
               <path d="M28 45 Q35 45 38 55 Q25 55 28 45" />
             </svg>
          </div>

          <!-- フッター（店名と波線） -->
          <div class="mt-8 text-center relative z-10">
            <div style="letter-spacing: 0.15em; color: #f1f1f1; font-size: 15px; opacity: 0.9;">
              BLUE HARBOR COFFEE
            </div>
            <div class="mt-1" style="opacity: 0.6;">
              <svg width="120" height="8" viewBox="0 0 120 8" class="mx-auto">
                <path d="M0 5 Q15 0 30 5 T60 5 T90 5 T120 5" fill="none" stroke="white" stroke-width="1"/>
              </svg>
            </div>
          </div>

        </div> <!-- /黒板 -->
      </div> <!-- /木枠 -->
    </div>
  `;
}

/**
 * 施設情報用（デザインに変更がないため元を維持）
 */
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
/**
 * 施設情報用（デザインに変更がないため元を維持）
 */
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

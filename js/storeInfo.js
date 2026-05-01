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
function renderHours(hours) {

  const isMobile = window.innerWidth < 768;

  return `
    <div class="max-w-md mx-auto">

      <!-- 木枠（立体） -->
      <div class="p-3 rounded-2xl"
           style="
             background: linear-gradient(145deg, #8b5a2b, #5c3b1e);
             box-shadow:
               0 10px 25px rgba(0,0,0,0.4),
               inset 2px 2px 4px rgba(255,255,255,0.2),
               inset -2px -2px 4px rgba(0,0,0,0.4);
           ">

        <!-- 内側木 -->
        <div class="p-2 rounded-xl"
             style="
               background: linear-gradient(145deg, #6f4522, #3e2615);
               box-shadow:
                 inset 1px 1px 2px rgba(255,255,255,0.1),
                 inset -1px -1px 2px rgba(0,0,0,0.6);
             ">

          <!-- 黒板 -->
          <div class="p-6 rounded-lg relative overflow-hidden"
               style="
                 background:
                   radial-gradient(circle at 20% 20%, rgba(255,255,255,0.05), transparent 40%),
                   radial-gradient(circle at 80% 80%, rgba(255,255,255,0.04), transparent 40%),
                   #1c1c1c;
                 box-shadow:
                   inset 0 0 10px rgba(0,0,0,0.8);
                 color: #f1f1f1;
               ">

            <!-- チョーク粉 -->
            <div class="absolute inset-0 pointer-events-none opacity-20"
                 style="
                   background-image:
                     radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px);
                   background-size: 18px 18px;
                 ">
            </div>

            <!-- ☕ マグ（線ゆらぎ風） -->
            <div class="absolute top-4 right-5 opacity-80">
              <svg width="46" height="46" viewBox="0 0 64 64" fill="none" stroke="#f5f5f5" stroke-width="2.2" stroke-linecap="round">
                <path d="M12 34 h30 q10 0 10 10 q0 10 -10 10 h-30 z"/>
                <path d="M42 36 h8 q6 0 6 6 q0 6 -6 6 h-8"/>
                <path d="M22 22 q2 -8 6 0"/>
                <path d="M30 22 q2 -8 6 0"/>
              </svg>
            </div>

            <!-- 🌿 葉 -->
            <div class="absolute bottom-4 right-5 opacity-60">
              <svg width="46" height="46" viewBox="0 0 64 64" fill="none" stroke="#f5f5f5" stroke-width="2" stroke-linecap="round">
                <path d="M12 52 C24 20, 44 20, 56 52"/>
                <path d="M28 40 C32 30, 44 30, 48 40"/>
              </svg>
            </div>

            <!-- タイトル -->
            <div class="text-center mb-4">
              <div class="tracking-widest text-lg" style="letter-spacing: 0.15em;">
                OPENING HOURS
              </div>
              <div class="text-xs mt-1" style="color:#bbbbbb;">
                営業時間
              </div>
            </div>

            <!-- 点線 -->
            <div style="border-top:1px dashed rgba(255,255,255,0.4); margin-bottom:16px;"></div>

            <!-- 本体 -->
            <div style="display:flex; flex-direction:column; gap:8px;">

              ${hours.map(h => {

                if (h.closed) {
                  return `
                    <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.2); padding-bottom:4px;">
                      <span>${h.day}</span>
                      <span style="color:#ff6b6b; font-weight:bold;">CLOSED</span>
                    </div>
                  `;
                }

                const isSunday = h.day === "日";

                let color = "#f1f1f1";

                if (h.highlight === "blue") {
                  color = "#7dd3fc";
                }

                if (h.highlight === "red" || isSunday) {
                  color = "#ff6b6b";
                }

                let noteColor = "#bbbbbb";

                if (h.highlight === "red" || isSunday) {
                  noteColor = "#ff8a8a";
                }

                return `
                  <div style="border-bottom:1px solid rgba(255,255,255,0.2); padding-bottom:4px;">

                    <div style="display:flex; justify-content:space-between;">

                      <span style="color:${color}; letter-spacing:0.1em;">
                        ${h.day}
                      </span>

                      <span style="color:${color}; font-weight:bold;">
                        ${h.open} - ${h.close}
                      </span>

                    </div>

                    ${
                      h.note
                        ? `
                          <div style="color:${noteColor}; font-size:12px; margin-top:4px;">
                            ${
                              (isMobile && h.day === "日")
                                ? h.note.replace("場合 ", "場合<br>")
                                : h.note
                            }
                          </div>
                        `
                        : ""
                    }

                  </div>
                `;
              }).join("")}

            </div>

            <!-- 下線 -->
            <div style="margin-top:16px; border-top:1px dashed rgba(255,255,255,0.4);"></div>

            <!-- 店名 -->
            <div style="text-align:center; margin-top:8px; font-size:12px; letter-spacing:0.2em; color:#bbbbbb;">
              BLUE HARBOR COFFEE
            </div>

          </div>

        </div>
      </div>

    </div>
  `;
}/* =========================
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

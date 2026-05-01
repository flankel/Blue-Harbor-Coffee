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
    <div class="max-w-md mx-auto rounded-xl shadow-lg overflow-hidden border border-gray-700">

      <!-- 黒板本体 -->
      <div class="bg-neutral-900 text-white p-6 font-mono relative">

        <!-- タイトル -->
        <div class="text-center mb-4">
          <div class="text-xl tracking-widest">
            OPENING HOURS
          </div>
          <div class="text-xs text-gray-400 mt-1">
            営業時間
          </div>
        </div>

        <!-- 区切り線 -->
        <div class="border-t border-dashed border-gray-500 mb-4"></div>

        <!-- 各行 -->
        <div class="space-y-2">

          ${hours.map(h => {

            if (h.closed) {
              return `
                <div class="flex justify-between items-center border-b border-white/20 pb-1">
                  <span class="tracking-widest">${h.day}</span>
                  <span class="text-red-400 font-bold">CLOSED</span>
                </div>
              `;
            }

            const isSunday = h.day === "日";

            let textClass = "text-white";

            if (h.highlight === "blue") {
              textClass = "text-blue-300 font-bold";
            }

            if (h.highlight === "red" || isSunday) {
              textClass = "text-red-400 font-bold";
            }

            let noteClass = "text-gray-400 text-xs mt-1";

            if (h.highlight === "red" || isSunday) {
              noteClass = "text-red-300 text-xs mt-1";
            }

            return `
              <div class="border-b border-white/20 pb-1">

                <div class="flex justify-between items-center">
                  <span class="tracking-widest ${textClass}">
                    ${h.day}
                  </span>

                  <span class="${textClass}">
                    ${h.open} - ${h.close}
                  </span>
                </div>

                ${
                  h.note
                    ? `
                      <div class="${noteClass}">
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

        <!-- フッター -->
        <div class="mt-5 pt-3 border-t border-dashed border-gray-500 text-center text-xs text-gray-400 tracking-widest">
          BLUE HARBOR COFFEE
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

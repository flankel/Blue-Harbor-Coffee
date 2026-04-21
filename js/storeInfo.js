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
   STORE INFO（修正版）
========================= */
function renderStoreInfo(data) {
  const main = document.getElementById("store-info-main");
  const pcHours = document.getElementById("store-hours");
  const mobileHours = document.getElementById("store-hours-mobile");

  if (!main) return;

  const store = data.store;

  /* =========================
     PC（左右）
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
     スマホ（順序固定）
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

    <!-- Opening Hours（スマホのみここで順序保証） -->
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
   HOURS（🔥修正ポイントここ）
========================= */
function renderHours(hours) {
  return `
    <div class="text-sm max-w-xs mx-auto">
      <table class="w-full border border-gray-300 rounded-lg overflow-hidden table-fixed">
        <tbody class="divide-y divide-gray-200">

          ${hours.map(h => {

            /* =========================
               CLOSED処理
            ========================= */
            if (h.closed) {
              return `
                <tr>
                  <th class="bg-white px-2 py-2 text-left font-medium w-12 border-r-2 border-gray-400">
                    ${h.day}
                  </th>
                  <td class="px-3 py-2 font-bold text-red-600 text-center border-l-2 border-gray-400">
                    CLOSED
                  </td>
                </tr>
              `;
            }

            /* =========================
               色判定（メイン）
            ========================= */
            const isSunday = h.day === "Sun";

            let textClass = "text-gray-800";

            if (h.highlight === "blue") {
              textClass = "text-blue-700 font-bold";
            }

            if (h.highlight === "red" || isSunday) {
              textClass = "text-red-700 font-bold";
            }

            /* =========================
               NOTE色（重要）
            ========================= */
            let noteClass = "text-gray-500 text-xs mt-1";

            if (h.highlight === "red" || isSunday) {
              noteClass = "text-red-600 font-semibold text-xs mt-1";
            }

            return `
              <tr>

                <!-- 曜日 -->
                <th class="px-2 py-2 text-left w-12 border-r-2 border-gray-400 ${textClass}">
                  ${h.day}
                </th>

                <!-- 時間 -->
                <td class="px-3 py-2 text-center border-l-2 border-gray-400">

                  <div class="${textClass} font-bold">
                    ${h.open} — ${h.close}
                  </div>

                  ${h.note ? `
  <div class="${noteClass}">
    ${
      (isMobile && h.day === "日")
        ? h.note.replace(" ", "<br>")
        : h.note
    }
  </div>
` : ""}

                </td>

              </tr>
            `;
          }).join("")}

        </tbody>
      </table>
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

async function loadHome() {

  try {

    const res = await fetch("data/text.json");

    if (!res.ok) {
      throw new Error("JSON load failed");
    }

    const data = await res.json();

    renderHero(data.hero);
    renderConcept(data.concept);
    renderSections(data.sections);

  } catch (err) {

    console.error("renderHome error:", err);

    // 🔥 フォールバック（白画面防止）
    document.body.style.opacity = "1";
    document.getElementById("hero-title").textContent = "Loading Error";
  }
}

/* HERO */
function renderHero(hero) {

  if (!hero) return;

  document.getElementById("hero-subtitle").textContent = hero.subtitle || "";
  document.getElementById("hero-title").textContent = hero.title || "";
  document.getElementById("hero-btn").textContent = hero.button || "";
}

/* CONCEPT */
function renderConcept(concept) {

  if (!concept) return;

  document.getElementById("concept-label").textContent = concept.label || "";
  document.getElementById("concept-title").textContent = concept.title || "";

  document.getElementById("concept-desc").innerHTML =
    (concept.desc || "").replace(/\n/g, "<br>");
}

/* SECTIONS */
function renderSections(sections) {

  const container = document.getElementById("sections");

  if (!container || !Array.isArray(sections)) return;

  container.innerHTML = "";

  sections.forEach(sec => {

    const bodyHTML = (sec.body || []).map(line => `${line}<br>`).join("");

    const layout = sec.reverse
      ? "flex flex-col md:flex-row-reverse"
      : "flex flex-col md:flex-row";

    // 🔥 デフォルト色（night以外）
    const subtitleColor = sec.text ? sec.text : "text-blue-600";
    const bodyColor = sec.text ? sec.text : "text-gray-600";

    const html = `
      <div class="mb-24 ${layout} gap-10 items-stretch ${sec.bg || ""} ${sec.text || ""} p-8 rounded-xl">
        
        <img src="${sec.image || ""}" 
             class="w-full md:w-1/2 aspect-[4/3] object-cover rounded">

        <div class="w-full md:w-1/2 flex flex-col justify-center">
          
          <h3 class="text-2xl font-bold mb-2 ${sec.titleColor || ""}">
            ${sec.title || ""}
          </h3>

          <p class="text-sm font-eng mb-4 ${subtitleColor}">
            ${sec.subtitle || ""}
          </p>

          <p class="leading-loose ${bodyColor}">
            ${bodyHTML}
          </p>

        </div>
      </div>
    `;

    container.insertAdjacentHTML("beforeend", html);
  });
}

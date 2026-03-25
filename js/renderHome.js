// renderHome.js (PC版でも画像サイズ適正、高さ調整)

async function loadHome() {
  const res = await fetch("data/text.json");
  const data = await res.json();

  renderHero(data.hero);
  renderConcept(data.concept);
  renderSections(data.sections);
}

/* HERO */
function renderHero(hero) {
  document.getElementById("hero-subtitle").textContent = hero.subtitle;
  document.getElementById("hero-title").textContent = hero.title;
  document.getElementById("hero-btn").textContent = hero.button;
}

/* CONCEPT */
function renderConcept(concept) {
  document.getElementById("concept-label").textContent = concept.label;
  document.getElementById("concept-title").textContent = concept.title;

  document.getElementById("concept-desc").innerHTML =
    concept.desc.replace(/\n/g, "<br>");
}

/* SECTIONS */
function renderSections(sections) {
  const container = document.getElementById("sections");

  sections.forEach(sec => {
    const bodyHTML = sec.body.map(line => `${line}<br>`).join("");

    const layout = sec.reverse
      ? "flex flex-col md:flex-row-reverse"
      : "grid md:grid-cols-2";

    const textColor = sec.text || "text-gray-600";
    const titleColor = sec.titleColor || "";

    // セクションに min-height を設定しつつ、画像アスペクト比は元に戻す
    const html = `
      <div class="mb-24 ${layout} gap-10 items-center ${sec.bg} p-8 rounded-xl min-h-[auto] md:min-h-[500px] md:max-h-[650px]">
        <img src="${sec.image}" 
             class="w-full md:w-1/2 aspect-[4/3] object-cover rounded">
        <div class="${sec.reverse ? "md:w-1/2" : ""}">
          <h3 class="text-2xl font-bold mb-2 ${titleColor}">${sec.title}</h3>
          <p class="text-sm text-blue-600 font-eng mb-4">${sec.subtitle}</p>
          <p class="${textColor} leading-loose">${bodyHTML}</p>
        </div>
      </div>
    `;

    container.insertAdjacentHTML("beforeend", html);
  });
}

loadHome();

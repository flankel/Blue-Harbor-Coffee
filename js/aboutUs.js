document.addEventListener("DOMContentLoaded", async () => {
  injectCoffeeMugs();   // ★追加（マグ）
  loadContent();
});

// ==============================
// JSON読み込み
// ==============================
async function loadContent() {
  const res = await fetch("data/aboutUs.json");
  const data = await res.json();

  // PHILOSOPHY
  setText("philosophy-lead", data.philosophy.lead);
  setText("philosophy-text1", data.philosophy.text1);
  setText("philosophy-text2", data.philosophy.text2);

  // OWNER
  setText("owner-name", data.owner.name);
  setText("owner-text1", data.owner.text1);
  setText("owner-text2", data.owner.text2);

  // BEANS
  setText("beans-title", data.beans.title);
  setText("beans-text", data.beans.text);
  setBeansList("beans-list", data.beans.list);

  // FRUITS
  setText("fruits-text", data.fruits.text);
  setList("fruits-list", data.fruits.list);
}

// ==============================
// 汎用関数
// ==============================
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function setList(id, items) {
  const el = document.getElementById(id);
  if (!el) return;

  el.innerHTML = "";
  items.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    el.appendChild(li);
  });
}

// ==============================
// BEANS専用リスト（★豆追加）
// ==============================
function setBeansList(id, items) {
  const el = document.getElementById(id);
  if (!el) return;

  const template = document.getElementById("coffee-beans");

  el.innerHTML = "";

  items.forEach((item, index) => {
    const li = document.createElement("li");

    // ★ レイアウト用ラッパー
    const wrapper = document.createElement("div");
    wrapper.className = "flex items-start gap-3";

    // =========================
    // 豆SVG
    // =========================
    if (template) {
      const clone = template.content.cloneNode(true);

      // ID衝突回避
      const gradient = clone.querySelector("#beanMain");
      if (gradient) {
        const uniqueId = "beanMain-" + index + "-" + Math.random().toString(36).substr(2, 5);
        gradient.id = uniqueId;

        const ellipse = clone.querySelector("ellipse");
        if (ellipse) {
          ellipse.setAttribute("fill", `url(#${uniqueId})`);
        }
      }

      wrapper.appendChild(clone);
    }

    // =========================
    // テキスト
    // =========================
    const textWrap = document.createElement("div");

    const en = document.createElement("span");
    en.className = "name-en block text-lg font-semibold mb-1";
    en.textContent = item.name.en;

    const jp = document.createElement("span");
    jp.className = "name-jp block text-base mb-1";
    jp.textContent = item.name.jp;

    const descJp = document.createElement("span");
    descJp.className = "desc-jp block text-sm text-gray-700 mb-2";
    descJp.textContent = item.desc.jp;

    textWrap.appendChild(en);
    textWrap.appendChild(jp);
    textWrap.appendChild(descJp);

    wrapper.appendChild(textWrap);
    li.appendChild(wrapper);
    el.appendChild(li);
  });
}

// ==============================
// マグ装飾（★追加）
// ==============================
function injectCoffeeMugs() {
  const template = document.getElementById("coffee-mug");
  if (!template) return;

  document.querySelectorAll(".mug-row").forEach(container => {

    container.innerHTML = "";

    for (let i = 0; i < 5; i++) {
      const clone = template.content.cloneNode(true);

      // ★ 少しズラす（見た目向上）
      const wrapper = document.createElement("div");
      wrapper.style.transform = `
        translateY(${Math.abs(i - 2) * 4}px)
        rotate(${(i - 2) * 6}deg)
      `;

      // 湯気ずらし
      const steams = clone.querySelectorAll(".steam");
      steams.forEach((s, index) => {
        s.style.animationDelay = `${index * 0.3 + i * 0.2}s`;
      });

      wrapper.appendChild(clone);
      container.appendChild(wrapper);
    }

  });
}

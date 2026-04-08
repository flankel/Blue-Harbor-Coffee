document.addEventListener("DOMContentLoaded", async () => {
  injectCoffeeBeans();
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
// BEANS専用リスト
// ==============================
function setBeansList(id, items) {
  const el = document.getElementById(id);
  if (!el) return;

  el.innerHTML = "";

  items.forEach(item => {
    const li = document.createElement("li");

    const en = document.createElement("span");
    en.className = "name-en block text-lg font-semibold mb-1";
    en.textContent = item.name.en;

    const jp = document.createElement("span");
    jp.className = "name-jp block text-base mb-1";
    jp.textContent = item.name.jp;

    const descJp = document.createElement("span");
    descJp.className = "desc-jp block text-sm text-gray-700 mb-2";
    descJp.textContent = item.desc.jp;

    li.appendChild(en);
    li.appendChild(jp);
    li.appendChild(descJp);

    el.appendChild(li);
  });
}

// ==============================
// コーヒー豆装飾（★ここが本題）
// ==============================
function injectCoffeeBeans() {
  const template = document.getElementById("coffee-bean-single");
  if (!template) return;

  document.querySelectorAll(".bean-decoration").forEach(container => {

    // wrapper生成
    const wrapper = document.createElement("div");
    wrapper.className = "flex justify-center items-center gap-4";

    for (let i = 0; i < 5; i++) {

      // テンプレ複製
      const clone = template.content.cloneNode(true);

      // ===== ID衝突回避 =====
      const gradient = clone.querySelector("#beanMain");
      if (gradient) {
        const uniqueId = "beanMain-" + i + "-" + Math.random().toString(36).substr(2, 5);
        gradient.id = uniqueId;

        const ellipse = clone.querySelector("ellipse");
        if (ellipse) {
          ellipse.setAttribute("fill", `url(#${uniqueId})`);
        }
      }

      wrapper.appendChild(clone);
    }

    container.appendChild(wrapper);
  });
}

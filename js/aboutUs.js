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
// BEANS専用リスト（英語タイトル＋日本語名＋日本語説明）
// ==============================
function setBeansList(id, items) {
  const el = document.getElementById(id);
  if (!el) return;

  el.innerHTML = "";

  items.forEach(item => {
    const li = document.createElement("li");

    // 英語タイトル（大きめ）
    const en = document.createElement("span");
    en.className = "name-en block text-lg font-semibold mb-1";
    en.textContent = item.name.en;

    // 日本語名
    const jp = document.createElement("span");
    jp.className = "name-jp block text-base mb-1";
    jp.textContent = item.name.jp;

    // 日本語説明
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
// コーヒー豆装飾
// ==============================
function injectCoffeeBeans() {
  const tpl = document.getElementById("coffee-beans");
  if (!tpl) return;

  document.querySelectorAll(".bean-decoration").forEach(el => {
    el.appendChild(tpl.content.cloneNode(true));
  });
}

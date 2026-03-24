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
  setList("beans-list", data.beans.list);

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
// コーヒー豆装飾
// ==============================
function injectCoffeeBeans() {
  const tpl = document.getElementById("coffee-beans");
  if (!tpl) return;

  document.querySelectorAll(".bean-decoration").forEach(el => {
    el.appendChild(tpl.content.cloneNode(true));
  });
}

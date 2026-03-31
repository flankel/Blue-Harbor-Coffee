// ==============================
// Header読み込み + active制御
// ==============================

// 🔹 mainのpaddingをheader高さに合わせる
function adjustMainPadding() {
  const header = document.querySelector("#header header");
  const main = document.querySelector("main");

  if (!header || !main) return;

  // 高さ取得（安定させる）
  const rect = header.getBoundingClientRect();
  let h = rect.height;

  // 異常値防止（これが重要）
  if (h < 60) h = 60;
  if (h > 140) h = 140;

  main.style.paddingTop = h + "px";
}

fetch("header.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("header").innerHTML = data;

    // ==============================
    // 現在のページ取得（クエリ除去）
    // ==============================
    let current = location.pathname.split("/").pop();

    if (current.includes("?")) {
      current = current.split("?")[0];
    }

    if (current === "") {
      current = "index.html";
    }

    // ==============================
    // nav-link に active付与
    // ==============================
    document.querySelectorAll(".nav-link").forEach(link => {
      const href = link.getAttribute("href");
      if (!href) return;

      if (href === current) {
        link.classList.add("active");
      }
    });

    // 🔥 ここが超重要（3段階で確実に反映）
    requestAnimationFrame(adjustMainPadding);
    setTimeout(adjustMainPadding, 100);
    setTimeout(adjustMainPadding, 300);
  })
  .catch(err => {
    console.error("header読み込み失敗:", err);
  });

// 🔹 フォント・画像読み込み後にも再計算（PC対策）
window.addEventListener("load", adjustMainPadding);

// 🔹 リサイズ対応
let resizeTimeout;

window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(adjustMainPadding, 150);
});// ==============================
// Header読み込み + active制御
// ==============================

// 🔹 mainのpaddingをheader高さに合わせる
function adjustMainPadding() {
  const header = document.querySelector("#header header");
  const main = document.querySelector("main");

  if (!header || !main) return;

  // 高さ取得（安定させる）
  const rect = header.getBoundingClientRect();
  let h = rect.height;

  // 異常値防止（これが重要）
  if (h < 60) h = 60;
  if (h > 140) h = 140;

  main.style.paddingTop = h + "px";
}

fetch("header.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("header").innerHTML = data;

    // ==============================
    // 現在のページ取得（クエリ除去）
    // ==============================
    let current = location.pathname.split("/").pop();

    if (current.includes("?")) {
      current = current.split("?")[0];
    }

    if (current === "") {
      current = "index.html";
    }

    // ==============================
    // nav-link に active付与
    // ==============================
    document.querySelectorAll(".nav-link").forEach(link => {
      const href = link.getAttribute("href");
      if (!href) return;

      if (href === current) {
        link.classList.add("active");
      }
    });

    // 🔥 ここが超重要（3段階で確実に反映）
    requestAnimationFrame(adjustMainPadding);
    setTimeout(adjustMainPadding, 100);
    setTimeout(adjustMainPadding, 300);
  })
  .catch(err => {
    console.error("header読み込み失敗:", err);
  });

// 🔹 フォント・画像読み込み後にも再計算（PC対策）
window.addEventListener("load", adjustMainPadding);

// 🔹 リサイズ対応
let resizeTimeout;

window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(adjustMainPadding, 150);
});

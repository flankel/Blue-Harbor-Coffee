// ==============================
// Header読み込み + active制御
// ==============================

// 🔹 mainのpaddingをheader高さに合わせる
function adjustMainPadding() {
  const header = document.querySelector("header");
  const main = document.querySelector("main");

  // 要素がなければ何もしない
  if (!header || !main) return;

  // headerがfixedじゃない場合は適用しない（安全対策）
  if (!header.classList.contains("fixed")) return;

  // headerの高さを取得してmainに適用
  main.style.paddingTop = header.offsetHeight + "px";
}

fetch("header.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("header").innerHTML = data;

    // ==============================
    // 現在のページ取得（クエリ除去）
    // ==============================
    let current = location.pathname.split("/").pop();

    // クエリパラメータ除去（?以降）
    if (current.includes("?")) {
      current = current.split("?")[0];
    }

    // ルート対策（/ のとき）
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

    // 🔹 header描画後にpadding調整（超重要）
    adjustMainPadding();
  })
  .catch(err => {
    console.error("header読み込み失敗:", err);
  });

// 🔹 画面リサイズ時も再計算（スマホ回転対策）
let resizeTimeout;

window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(adjustMainPadding, 150);
});

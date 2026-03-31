// ==============================
// Header読み込み + active制御
// ==============================
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
  })
  .catch(err => {
    console.error("header読み込み失敗:", err);
  });

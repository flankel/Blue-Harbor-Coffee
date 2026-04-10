fetch("header.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("header").innerHTML = data;

    let current = location.pathname.split("/").pop();

    if (current.includes("?")) {
      current = current.split("?")[0];
    }

    if (current === "") {
      current = "index.html";
    }

    // =========================
    // TAKE OUT扱いページ定義
    // =========================
    const takeoutPages = [
      "takeout.html",
      "customer.html",
      "confirm.html",
      "complete.html"
    ];

    document.querySelectorAll(".nav-link").forEach(link => {
      const href = link.getAttribute("href");
      if (!href) return;

      // 通常のactive
      if (href === current) {
        link.classList.add("active");
      }

      // TAKE OUT強制active
      if (
        takeoutPages.includes(current) &&
        href === "takeout.html"
      ) {
        link.classList.add("active");
      }
    });
  })
  .catch(err => {
    console.error("header読み込み失敗:", err);
  });

fetch("header.html")
  .then(res => res.text())
  .then(data => {
    const headerContainer = document.getElementById("header");
    headerContainer.innerHTML = data;

    // ==============================
    // ナビのアクティブ判定
    // ==============================
    const current = location.pathname.split("/").pop();

    document.querySelectorAll(".nav-link").forEach(link => {
      const href = link.getAttribute("href");

      if (href === current || (current === "" && href === "index.html")) {
        link.classList.add("active");
      }
    });
  });

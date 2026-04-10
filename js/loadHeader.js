fetch("header.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("header").innerHTML = data;

    let current = location.pathname.split("/").pop().split("?")[0] || "index.html";

    const takeoutPages = new Set([
      "takeout.html",
      "customer.html",
      "confirm.html",
      "complete.html"
    ]);

    document.querySelectorAll(".nav-link").forEach(link => {
      const href = link.getAttribute("href");
      if (!href) return;

      // 通常active
      if (href === current) {
        link.classList.add("active");
      }

      // TAKEOUT強制active
      if (takeoutPages.has(current) && href === "takeout.html") {
        link.classList.add("active");
      }
    });
  });

fetch("header.html")
  .then(res => res.text())
  .then(data => {
    const headerContainer = document.getElementById("header");
    headerContainer.innerHTML = data;

    const header = headerContainer.querySelector("header");
    const spacer = document.getElementById("headerSpacer");

    if (!header || !spacer) return;

    // ==============================
    // 🔥 高さセット関数
    // ==============================
    const setHeight = () => {
      spacer.style.height = header.offsetHeight + "px";
    };

    // 初期実行（複数回で確実に合わせる）
    requestAnimationFrame(setHeight);
    setTimeout(setHeight, 50);
    setTimeout(setHeight, 150);
    setTimeout(setHeight, 300);

    // 🔥 これが最重要（高さ変化を自動追従）
    const observer = new ResizeObserver(() => {
      setHeight();
    });
    observer.observe(header);

    // ★ 現在のページを取得
    const current = location.pathname.split("/").pop();

    document.querySelectorAll(".nav-link").forEach(link => {
      const href = link.getAttribute("href");

      if (href === current || (current === "" && href === "index.html")) {
        link.classList.add("active");
      }
    });
  });


// ==============================
// 念のための保険
// ==============================
window.addEventListener("resize", () => {
  const header = document.querySelector("#header header");
  const spacer = document.getElementById("headerSpacer");

  if (header && spacer) {
    spacer.style.height = header.offsetHeight + "px";
  }
});

window.addEventListener("orientationchange", () => {
  const header = document.querySelector("#header header");
  const spacer = document.getElementById("headerSpacer");

  if (header && spacer) {
    spacer.style.height = header.offsetHeight + "px";
  }
});

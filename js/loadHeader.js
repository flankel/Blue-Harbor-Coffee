fetch("header.html")
  .then(res => res.text())
  .then(data => {
    const headerContainer = document.getElementById("header");
    headerContainer.innerHTML = data;

    // 🔥 複数回測定（スマホ対策）
    adjustHeaderSpacer();
    setTimeout(adjustHeaderSpacer, 100);
    setTimeout(adjustHeaderSpacer, 300);

    // ★ 現在のページを取得
    const current = location.pathname.split("/").pop();

    // ★ nav-link を全部チェック
    document.querySelectorAll(".nav-link").forEach(link => {
      const href = link.getAttribute("href");

      if (href === current || (current === "" && href === "index.html")) {
        link.classList.add("active");
      }
    });
  });


// ==============================
// header高さ調整（完全版）
// ==============================
function adjustHeaderSpacer() {
  const header = document.querySelector("#header header");
  const spacer = document.getElementById("headerSpacer");

  if (!header || !spacer) return;

  requestAnimationFrame(() => {
    spacer.style.height = header.offsetHeight + "px";
  });
}


// ==============================
// イベント
// ==============================
window.addEventListener("load", adjustHeaderSpacer);
window.addEventListener("resize", adjustHeaderSpacer);
window.addEventListener("orientationchange", adjustHeaderSpacer);

console.log("loader start");

const root = document.getElementById("loader-root");

if (!root) {
  console.log("loader-root not found");
}

fetch("./loader.html")
  .then(res => {
    if (!res.ok) throw new Error("loader.html not found");
    return res.text();
  })
  .then(html => {
    console.log("loader loaded");

    root.innerHTML = html;

    window.addEventListener("load", () => {
      console.log("window loaded");

      const el = document.getElementById("loader-root");

      if (!el) return;

      el.style.transition = "opacity 0.5s";
      el.style.opacity = "0";

      setTimeout(() => el.remove(), 500);
    });
  })
  .catch(err => {
    console.error("LOADER ERROR:", err);
    root.remove(); // ← 保険で強制解除
  });

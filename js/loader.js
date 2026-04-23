export function initLoader() {
  console.log("loader start");

  const root = document.getElementById("loader-root");

  fetch("./loader.html")
    .then(res => res.text())
    .then(html => {

      root.innerHTML = html;

      // ⭐ここで必ずDOM取得（重要）
      const percentEl = document.getElementById("percent");
      const coffeeFill = document.getElementById("coffee-fill");

      let percent = 0;

      const interval = setInterval(() => {
        percent += 1;

        if (percentEl) {
          percentEl.textContent = percent;
        }

        if (coffeeFill) {
          coffeeFill.style.height = percent + "%";
        }

        if (percent >= 100) {
          clearInterval(interval);

          setTimeout(() => {
            root.style.transition = "opacity 0.6s";
            root.style.opacity = "0";

            setTimeout(() => root.remove(), 600);
          }, 200);
        }
      }, 50);
    })
    .catch(err => console.error(err));
}

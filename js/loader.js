export function initLoader() {
  const isHome =
    location.pathname === "/" ||
    location.pathname.endsWith("index.html");

  if (!isHome) return;

  fetch("loader.html")
    .then(res => res.text())
    .then(html => {
      document.body.insertAdjacentHTML("afterbegin", html);

      window.addEventListener("load", () => {
        const loader = document.getElementById("loader-root");
        if (!loader) return;

        loader.style.transition = "opacity 0.5s ease";
        loader.style.opacity = "0";

        setTimeout(() => loader.remove(), 500);
      });
    });
}

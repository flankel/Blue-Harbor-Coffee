export function initLoader() {
  const root = document.getElementById("loader-root");

  if (!root) return;

  root.innerHTML = `
    <div style="
      position:fixed;
      inset:0;
      background:white;
      display:flex;
      align-items:center;
      justify-content:center;
    ">
      LOADING...
    </div>
  `;

  window.addEventListener("load", () => {
    root.style.opacity = "0";
    setTimeout(() => root.remove(), 500);
  });
}

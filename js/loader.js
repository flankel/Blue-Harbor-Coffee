export function initLoader() {
  console.log("✅ initLoader CALLED");

  const root = document.getElementById("loader-root");
  console.log("loader-root:", root);

  fetch("./loader.html")
    .then(res => {
      console.log("loader.html status:", res.status);
      return res.text();
    })
    .then(html => {
      console.log("loader.html loaded");

      root.innerHTML = html;

      console.log("HTML injected");

      const percent = document.getElementById("percent");
      console.log("percent element:", percent);
    })
    .catch(err => {
      console.error("❌ loader error:", err);
    });
}

export function initLoader() {
  console.log("1. initLoader start");

  const root = document.getElementById("loader-root");
  console.log("2. root =", root);

  fetch("./loader.html")
    .then(res => {
      console.log("3. fetch status =", res.status);
      return res.text();
    })
    .then(html => {
      console.log("4. html loaded");

      console.log("5. html =", html);

      root.innerHTML = html;

      console.log("6. injected");

      const percent = document.getElementById("percent");
      console.log("7. percent =", percent);
    })
    .catch(err => {
      console.error("❌ ERROR:", err);
    });
}

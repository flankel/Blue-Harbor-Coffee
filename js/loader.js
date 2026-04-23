async function init() {

  const root = document.getElementById("loader-root");
  const body = document.getElementById("body");

  if (!root || !body) return;

  const startTime = Date.now();

  try {

    const res = await fetch("./loader.html");
    const html = await res.text();

    root.innerHTML = html;

    // 🔥 DOM確実反映待ち
    setTimeout(() => {

      const loader = document.querySelector(".loader");

      // ❗ loaderが取れない場合は即表示解除
      if (!loader) {
        body.style.opacity = "1";
        body.classList.remove("opacity-0");
        return;
      }

      loader.style.opacity = "1";
      loader.style.display = "flex";

      const MIN_TIME = 1200;
      const elapsed = Date.now() - startTime;
      const wait = Math.max(0, MIN_TIME - elapsed);

      setTimeout(() => {

        loader.style.opacity = "0";

        setTimeout(() => {

          loader.style.display = "none";

          // 🔥 ここが最重要（強制表示）
          body.style.opacity = "1";
          body.classList.remove("opacity-0");

        }, 700);

      }, wait);

    }, 50);

  } catch (err) {

    console.error("Loader Error:", err);

    // 🔥 エラーでも必ず表示
    body.style.opacity = "1";
    body.classList.remove("opacity-0");
  }
}

init();

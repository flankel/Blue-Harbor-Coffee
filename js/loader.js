root.innerHTML = html;

// 🔥 これを入れる（DOM反映待ち）
requestAnimationFrame(() => {

  const loader = document.getElementById("loader");

  if (!loader) {
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
      body.classList.remove("opacity-0");
    }, 700);

  }, wait);

});

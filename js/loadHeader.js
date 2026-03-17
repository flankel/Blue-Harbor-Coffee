    fetch("header.html")
      .then(res => res.text())
      .then(data => {
        document.getElementById("header").innerHTML = data;
    
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

    function adjustHeaderSpacer() {
        const header = document.querySelector("header");
        const spacer = document.getElementById("headerSpacer");

        if (header && spacer) {
            spacer.style.height = header.offsetHeight + "px";
        }
    }

    window.addEventListener("load", adjustHeaderSpacer);
    window.addEventListener("resize", adjustHeaderSpacer);

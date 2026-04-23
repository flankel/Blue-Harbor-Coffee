// js/loader.js のイメージ
export function initLoader() {
    const root = document.getElementById('loader-root');
    // ここで SVG（マグカップと波）を innerHTML で流し込む
    root.innerHTML = `
        <div class="loader-inner">
            <div id="percent">0%</div>
        </div>
    `;

    // 読み込み完了（window.onload）を待ってからフェードアウトさせる
    window.addEventListener('load', () => {
        // 少し余韻を残して消すのがコツ
        setTimeout(() => {
            root.style.transition = 'opacity 0.8s ease';
            root.style.opacity = '0';
            setTimeout(() => root.remove(), 800);
        }, 1000); 
    });
}

export function initLoader() {
  const root = document.getElementById('loader-root');
  if (!root) return;

  // 1. デザインの流し込み（コーヒー色に変更、2重の波、同期計算修正）
  root.innerHTML = `
    <style>
      .mug-clip {
        clip-path: circle(50% at 50% 50%);
      }
      /* 波のアニメーションを2つ定義 */
      @keyframes wave-move-fast {
        0% { transform: translateX(-50%) rotate(0deg); }
        100% { transform: translateX(-50%) rotate(360deg); }
      }
      @keyframes wave-move-slow {
        0% { transform: translateX(-50%) rotate(0deg); }
        100% { transform: translateX(-50%) rotate(360deg); }
      }
      
      .wave-base {
        position: absolute;
        left: 50%;
        width: 250%; /* カップより大きくして横移動させる */
        height: 250%;
        border-radius: 42%; /* 角を丸めて波っぽく */
        transition: all duration-200 ease-linear;
      }
      /* メインのコーヒー（少し濃い） */
      .wave-primary {
        background-color: #6F4E37; /* リッチなコーヒーブラウン */
        opacity: 0.6;
        animation: wave-move-fast 5s infinite linear;
      }
      /* セカンダリのコーヒー（少し薄い、レイヤー効果） */
      .wave-secondary {
        background-color: #C6A664; /* ライトなタンカラー */
        opacity: 0.4;
        animation: wave-move-slow 7s infinite linear;
      }

      /* ローダーフェードアウト */
      #loader-root.fade-out {
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.8s ease-in-out;
      }
    </style>
    
    <div class="fixed inset-0 bg-white flex flex-col items-center justify-center z-[9999]" id="loader-bg">
      <div class="relative w-48 h-48 mb-10">
        <div class="absolute inset-0 border-[6px] border-blue-900 rounded-full z-20"></div>
        
        <div class="absolute inset-[6px] bg-gray-50 rounded-full overflow-hidden mug-clip z-10">
          <div id="wave-secondary" 
               class="wave-base wave-secondary"
               style="bottom: -250%;"></div>
          <div id="wave-primary" 
               class="wave-base wave-primary"
               style="bottom: -250%;"></div>
        </div>
      </div>

      <div class="font-eng text-6xl font-bold text-blue-900 tracking-tighter" id="percent-text">0%</div>
    </div>
  `;

  const wavePrimary = document.getElementById('wave-primary');
  const waveSecondary = document.getElementById('wave-secondary');
  const text = document.getElementById('percent-text');
  let progress = 0;

  // 2. 進捗アニメーションの制御
  const updateProgress = () => {
    if (progress <= 100) {
      text.innerText = `${progress}%`;
      
      // 波の高さを同期（正確な計算：-250%から-75%の範囲）
      // 0%のとき bottom: -250% (完全に空)
      // 100%のとき bottom: -75% (満杯。回転する四角形の中心がカップの中心に来る)
      const currentBottom = -250 + (progress * 1.75); 
      // 両方の波を同じ平均高さにする（レイヤー効果は横移動とopacityで出す）
      wavePrimary.style.bottom = `${currentBottom}%`;
      waveSecondary.style.bottom = `${currentBottom}%`;

      progress++;
      
      // 100%に近づくほど少しゆっくりにする演出（リアルな読み込み感）
      let speed = progress > 80 ? 60 : 30; 
      setTimeout(updateProgress, speed);
      
    } else {
      // 3. 100%完了後の挙動
      finishLoading();
    }
  };

  const finishLoading = () => {
    // ローダーをフェードアウトさせる
    root.classList.add('fade-out');

    // アニメーションが終わったタイミングで要素を完全に削除し、
    // 背後のメインコンテンツ（headerやmain）を操作可能にする
    setTimeout(() => {
      root.style.display = 'none';
    }, 800);
  };

  updateProgress();
}

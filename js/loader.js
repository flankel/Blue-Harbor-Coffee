export function initLoader() {
  const root = document.getElementById('loader-root');
  if (!root) return;

  // 1. デザインの流し込み（波のサイズと位置を最適化）
  root.innerHTML = `
    <style>
      .mug-clip {
        clip-path: circle(50% at 50% 50%);
      }
      .wave-animation {
        animation: wave-move 6s infinite linear;
      }
      @keyframes wave-move {
        0% { transform: translateX(-50%) rotate(0deg); }
        100% { transform: translateX(-50%) rotate(360deg); }
      }
      /* ローダー自体をフェードアウトさせるためのスタイル */
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
          <div id="wave-element" 
               class="absolute left-1/2 w-[250%] h-[250%] bg-blue-400 opacity-60 rounded-[42%] wave-animation transition-all duration-200 ease-linear"
               style="bottom: -220%;"></div>
        </div>
      </div>

      <div class="font-eng text-6xl font-bold text-blue-900 tracking-tighter" id="percent-text">0%</div>
    </div>
  `;

  const wave = document.getElementById('wave-element');
  const text = document.getElementById('percent-text');
  let progress = 0;

  // 2. 進捗アニメーションの制御
  const updateProgress = () => {
    if (progress <= 100) {
      text.innerText = `${progress}%`;
      
      // 波の高さ調整
      // 0%のとき bottom: -220% (ほぼ空)
      // 100%のとき bottom: -120% (満杯) 
      // ※回転する四角形なので、-100%付近がちょうど満杯に見える境界です
      const currentBottom = -220 + (progress); 
      wave.style.bottom = `${currentBottom}%`;

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

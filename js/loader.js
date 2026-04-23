export function initLoader() {
  const root = document.getElementById('loader-root');
  if (!root) return;

  // 1. HTMLとスタイルの流し込み
  root.innerHTML = `
    <style>
      .mug-clip {
        clip-path: circle(50% at 50% 50%);
      }
      .wave-animation {
        animation: wave-move 4s infinite linear;
      }
      @keyframes wave-move {
        0% { transform: translateX(-50%) rotate(0deg); }
        100% { transform: translateX(-50%) rotate(360deg); }
      }
    </style>
    
    <div class="fixed inset-0 bg-white flex flex-col items-center justify-center transition-opacity duration-1000" id="loader-bg">
      
      <div class="relative w-48 h-48 mb-8">
        <div class="absolute inset-0 border-4 border-blue-900 rounded-full z-20"></div>
        
        <div class="absolute inset-1 bg-gray-50 rounded-full overflow-hidden mug-clip z-10">
          <div id="wave-element" 
               class="absolute left-1/2 w-[300%] h-[300%] bg-blue-400 opacity-60 rounded-[40%] wave-animation transition-all duration-300 ease-out"
               style="bottom: -280%;"></div>
        </div>
      </div>

      <div class="font-eng text-5xl font-bold text-blue-900" id="percent-text">0%</div>
    </div>
  `;

  const wave = document.getElementById('wave-element');
  const text = document.getElementById('percent-text');
  const bg = document.getElementById('loader-bg');

  let progress = 0;

  // 2. 進捗のアニメーション（シミュレーション）
  const updateProgress = () => {
    // 実際はリソースの読み込み状況に合わせることも可能ですが、
    // 演出として一定速度で進ませるのが一般的です
    if (progress < 100) {
      progress += 1;
      text.innerText = `${progress}%`;
      
      // 波の高さを計算 (-280% から -130% くらいまで上昇)
      const bottomPos = -280 + (progress * 1.5);
      wave.style.bottom = `${bottomPos}%`;
      
      requestAnimationFrame(() => setTimeout(updateProgress, 30));
    } else {
      // 3. 完了後のフェードアウト処理
      setTimeout(() => {
        bg.classList.add('opacity-0');
        setTimeout(() => {
          root.innerHTML = ''; // メモリ解放のために中身を空に
        }, 1000);
      }, 500);
    }
  };

  updateProgress();
}

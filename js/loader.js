export function initLoader() {
  const root = document.getElementById('loader-root');
  if (!root) return;

  root.innerHTML = `
    <style>
      .cup-shape {
        position: relative;
        width: 160px;
        height: 140px;
        background-color: #ffffff;
        border: 6px solid #1e3a8a;
        border-bottom-left-radius: 80px 140px;
        border-bottom-right-radius: 80px 140px;
        overflow: hidden;
        z-index: 10;
      }

      .cup-handle {
        position: absolute;
        top: 30px;
        right: -45px;
        width: 60px;
        height: 80px;
        border: 6px solid #1e3a8a;
        border-radius: 0 40px 40px 0;
        z-index: 5;
      }

      @keyframes wave-move {
        0% { transform: translateX(-50%) rotate(0deg); }
        100% { transform: translateX(-50%) rotate(360deg); }
      }

      .wave-base {
        position: absolute;
        left: 50%;
        width: 350%; /* さらに大きくして回転の角を目立たなくする */
        height: 350%;
        border-radius: 40%;
        transition: bottom 0.3s ease-linear; /* 動きをより滑らかに */
        z-index: 15;
      }

      .wave-primary {
        background-color: #6F4E37;
        opacity: 0.9;
        animation: wave-move 6s infinite linear;
      }

      .wave-secondary {
        background-color: #C6A664;
        opacity: 0.4;
        animation: wave-move 10s infinite linear;
      }

      #loader-root.fade-out {
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.8s ease-in-out;
      }
    </style>
    
    <div class="fixed inset-0 bg-white flex flex-col items-center justify-center z-[9999]" id="loader-bg">
      <div class="relative mb-12">
        <div class="cup-shape">
          <div id="wave-secondary" class="wave-base wave-secondary" style="bottom: -360%;"></div>
          <div id="wave-primary" class="wave-base wave-primary" style="bottom: -360%;"></div>
        </div>
        <div class="cup-handle"></div>
      </div>
      <div class="font-eng text-6xl font-bold text-blue-900 tracking-tighter" id="percent-text">0%</div>
    </div>
  `;

  const wavePrimary = document.getElementById('wave-primary');
  const waveSecondary = document.getElementById('wave-secondary');
  const text = document.getElementById('percent-text');
  let progress = 0;

  const updateProgress = () => {
    if (progress <= 100) {
      text.innerText = `${progress}%`;
      
      /**
       * 【同期計算の修正】
       * 開始値: -360% (カップの底より完全に下)
       * 終了値: -175% (100%の時にちょうど縁に来る位置)
       * 185%の幅を100分割して進める
       */
      const currentBottom = -360 + (progress * 1.85); 
      
      wavePrimary.style.bottom = `${currentBottom}%`;
      waveSecondary.style.bottom = `${currentBottom + 1}%`;

      progress++;
      
      // 読み込み速度を少し落として、じっくりコーヒーが溜まる演出に
      let speed = progress > 90 ? 100 : 40; 
      setTimeout(updateProgress, speed);
      
    } else {
      finishLoading();
    }
  };

  const finishLoading = () => {
    root.classList.add('fade-out');
    setTimeout(() => {
      root.style.display = 'none';
    }, 800);
  };

  updateProgress();
}

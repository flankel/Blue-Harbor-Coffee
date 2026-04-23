export function initLoader() {
  const root = document.getElementById('loader-root');
  if (!root) return;

  // 初回アクセスチェック
  if (sessionStorage.getItem('hasLoaded')) {
    root.style.display = 'none';
    return;
  }
  sessionStorage.setItem('hasLoaded', 'true');

  root.innerHTML = `
    <style>
      .cup-shape {
        position: relative;
        width: 160px;
        height: 140px;
        background-color: #ffffff;
        border: 6px solid #1e3a8a; /* border-blue-900 */
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
        border: 6px solid #1e3a8a; /* border-blue-900 */
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
        width: 400%;
        height: 400%;
        border-radius: 43%;
        transition: bottom 0.5s ease-linear;
        z-index: 15;
      }

      .wave-primary {
        background-color: #6F4E37; /* コーヒー色 */
        opacity: 0.9;
        animation: wave-move 8s infinite linear;
      }

      .wave-secondary {
        background-color: #C6A664; /* タンカラー */
        opacity: 0.4;
        animation: wave-move 12s infinite linear;
      }

      /* 【追加】コーヒー豆のCSS描画 */
      .coffee-bean {
        position: relative;
        width: 18px;
        height: 12px;
        background-color: #6F4E37; /* コーヒー色 */
        border-radius: 50% / 50%; /* 楕円形 */
        display: inline-block;
        vertical-align: middle;
      }
      /* 豆の割れ目 */
      .coffee-bean::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 10%;
        width: 80%;
        height: 1.5px;
        background-color: #f3f4f6; /* bg-gray-100（割れ目の色） */
        transform: translateY(-50%) rotate(-5deg);
        border-radius: 2px;
      }

      #loader-root.fade-out {
        opacity: 0;
        pointer-events: none;
        transition: opacity 1.2s ease-in-out;
      }
    </style>
    
    <div class="fixed inset-0 bg-white flex flex-col items-center justify-center z-[9999]" id="loader-bg">
      <div class="relative mb-8"> <div class="cup-shape">
          <div id="wave-secondary" class="wave-base wave-secondary" style="bottom: -420%;"></div>
          <div id="wave-primary" class="wave-base wave-primary" style="bottom: -420%;"></div>
        </div>
        <div class="cup-handle"></div>
      </div>

      <div class="flex items-center gap-3 mb-12">
        <span class="coffee-bean opacity-80"></span>
        <span class="font-eng text-xl font-medium text-blue-900 tracking-[0.2em]">Now Brewing...</span>
        <span class="coffee-bean opacity-80"></span>
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
      const currentBottom = -420 + (progress * 2.1); 
      wavePrimary.style.bottom = `${currentBottom}%`;
      waveSecondary.style.bottom = `${currentBottom + 0.5}%`;

      progress++;
      // 速度は前回のまま、ゆっくりに設定
      let speed = progress > 85 ? 200 : 100; 
      setTimeout(updateProgress, speed);
    } else {
      finishLoading();
    }
  };

  const finishLoading = () => {
    root.classList.add('fade-out');
    setTimeout(() => {
      root.style.display = 'none';
    }, 1200);
  };

  updateProgress();
}

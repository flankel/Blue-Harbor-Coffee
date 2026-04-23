export function initLoader() {
  const root = document.getElementById('loader-root');
  if (!root) return;

  // 1. デザインの流し込み（横視点のカップ、波のCSS）
  root.innerHTML = `
    <style>
      /* 横視点のカップの形状（U字型） */
      .cup-shape {
        position: relative;
        width: 160px; /* カップの幅 */
        height: 140px; /* カップの高さ */
        background-color: #ffffff; /* カップの内側（空の部分） */
        border: 6px solid #1e3a8a; /* border-blue-900相当 */
        border-bottom-left-radius: 80px 140px; /* 下部を丸くしてカップらしく */
        border-bottom-right-radius: 80px 140px;
        overflow: hidden; /* 液体の波をカップ内に収める */
        z-index: 10;
      }

      /* カップの取っ手（C字型） */
      .cup-handle {
        position: absolute;
        top: 30px;
        right: -45px; /* カップの右側に配置 */
        width: 60px;
        height: 80px;
        border: 6px solid #1e3a8a; /* border-blue-900相当 */
        border-radius: 0 40px 40px 0; /* 右側だけ丸く */
        z-index: 5;
      }

      /* 波のアニメーション（2層） */
      @keyframes wave-move {
        0% { transform: translateX(-50%) rotate(0deg); }
        100% { transform: translateX(-50%) rotate(360deg); }
      }

      .wave-base {
        position: absolute;
        left: 50%;
        width: 300%; /* カップより大きくして横移動させる */
        height: 300%;
        border-radius: 42%; /* 角を丸めて波っぽく */
        transition: bottom 0.2s ease-linear; /* 水位上昇を滑らかに */
        z-index: 15;
      }

      /* メインのコーヒー（少し濃いブラウン） */
      .wave-primary {
        background-color: #6F4E37;
        opacity: 0.8;
        animation: wave-move 5s infinite linear;
      }

      /* セカンダリの波（少し薄い、レイヤー効果） */
      .wave-secondary {
        background-color: #C6A664;
        opacity: 0.5;
        animation: wave-move 7s infinite linear;
        border-radius: 40%;
      }

      /* ローダーフェードアウト */
      #loader-root.fade-out {
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.8s ease-in-out;
      }
    </style>
    
    <div class="fixed inset-0 bg-white flex flex-col items-center justify-center z-[9999]" id="loader-bg">
      <div class="relative mb-12">
        <div class="cup-shape">
          <div id="wave-secondary" 
               class="wave-base wave-secondary"
               style="bottom: -290%;"></div> <div id="wave-primary" 
               class="wave-base wave-primary"
               style="bottom: -290%;"></div> </div>
        <div class="cup-handle"></div>
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
      
      // 水位の同期計算（横視点のカップに最適化）
      // 0%のとき bottom: -290% (完全に空)
      // 100%のとき bottom: -150% (ちょうど満杯)
      // ※回転する大きな四角形なので、-150%付近がカップの上端に見えます
      const currentBottom = -290 + (progress * 1.4); 
      
      wavePrimary.style.bottom = `${currentBottom}%`;
      waveSecondary.style.bottom = `${currentBottom + 2}%`; // 少しずらして奥行きを出す

      progress++;
      
      // 100%に近づくほど少しゆっくりにする演出
      let speed = progress > 85 ? 70 : 30; 
      setTimeout(updateProgress, speed);
      
    } else {
      // 3. 100%完了後の挙動
      finishLoading();
    }
  };

  const finishLoading = () => {
    root.classList.add('fade-out');

    // フェードアウト後に要素を完全に削除
    setTimeout(() => {
      root.style.display = 'none';
    }, 800);
  };

  updateProgress();
}

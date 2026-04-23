export function initLoader() {
  const root = document.getElementById('loader-root');
  if (!root) return;

  // 初回アクセスチェック（タブを閉じるまで有効）
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
        transition: bottom 0.25s ease-linear; /* 速度に合わせた滑らかさ */
        z-index: 15;
      }

      .wave-primary {
        background-color: #6F4E37;
        opacity: 0.9;
        animation: wave-move 8s infinite linear;
      }

      .wave-secondary {
        background-color: #C6A664;
        opacity: 0.4;
        animation: wave-move 12s infinite linear;
      }

      /* 【追加】小さなコーヒー豆（ドット絵用） */
      @keyframes bean-shake {
        0%, 100% { transform: scale(1) translate(0, 0); }
        25% { transform: scale(1.05) translate(-1px, 0.5px); }
        75% { transform: scale(0.95) translate(1px, -0.5px); }
      }

      .coffee-bean-dot {
        position: relative;
        width: 10px; /* 文字を構成する粒のサイズ */
        height: 8px;
        background-color: #6F4E37; /* コーヒー色 */
        border-radius: 50% / 50%;
        display: inline-block;
        animation: bean-shake 0.3s infinite ease-in-out; /* 焙煎中の微振動 */
      }
      .coffee-bean-dot::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 10%;
        width: 80%;
        height: 1px;
        background-color: #f3f4f6;
        transform: translateY(-50%) rotate(-10deg);
        border-radius: 2px;
      }

      /* 【追加】豆の文字用グリッドシステム */
      .bean-text {
        display: grid;
        grid-template-columns: repeat(var(--text-cols), 1fr);
        gap: 2px; /* 豆と豆の間隔 */
        width: max-content;
      }

      #loader-root.fade-out {
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.8s ease-in-out; /* 完了時の余韻 */
      }
    </style>
    
    <div class="fixed inset-0 bg-white flex flex-col items-center justify-center z-[9999]" id="loader-bg">
      <div class="relative mb-12"> <div class="cup-shape">
          <div id="wave-secondary" class="wave-base wave-secondary" style="bottom: -420%;"></div>
          <div id="wave-primary" class="wave-base wave-primary" style="bottom: -420%;"></div>
        </div>
        <div class="cup-handle"></div>
      </div>

      <div class="mb-12" id="bean-text-area"></div>

      <div class="font-eng text-6xl font-bold text-blue-900 tracking-tighter" id="percent-text">0%</div>
    </div>
  `;

  // 豆文字のデータ定義（. = 豆あり、0 = 豆なし）
  // 3x5グリッドで各文字を表現
  const textData = {
    // N
    'N': [
      ['.',0,0],
      ['.',0,0],
      ['.',0,0],
      ['.',0,0],
      ['.',0,0]
    ],
    // o
    'o': [
      [0,'.',0],
      ['.',0,'.'],
      ['.',0,'.'],
      ['.',0,'.'],
      [0,'.',0]
    ],
    // w
    'w': [
      ['.',0,'.'],
      ['.',0,'.'],
      ['.',0,'.'],
      ['.',0,'.'],
      [0,'.',0]
    ],
    // B
    'B': [
      ['.',0,0],
      ['.',0,0],
      ['.',0,0],
      ['.',0,0],
      ['.',0,0]
    ],
    // r
    'r': [
      ['.',0,0],
      ['.',0,0],
      ['.',0,0],
      ['.',0,0],
      ['.',0,0]
    ],
    // e
    'e': [
      [0,'.',0],
      ['.',0,'.'],
      ['.',0,'.'],
      ['.',0,'.'],
      [0,'.',0]
    ],
    // w
    'w': [
      ['.',0,'.'],
      ['.',0,'.'],
      ['.',0,'.'],
      ['.',0,'.'],
      [0,'.',0]
    ],
    // i
    'i': [
      [0,'.',0],
      [0,'.',0],
      [0,'.',0],
      [0,'.',0],
      [0,'.',0]
    ],
    // n
    'n': [
      ['.',0,0],
      ['.',0,0],
      ['.',0,0],
      ['.',0,0],
      ['.',0,0]
    ],
    // g
    'g': [
      [0,'.',0],
      ['.',0,'.'],
      ['.',0,'.'],
      ['.',0,'.'],
      [0,'.',0]
    ],
    // .
    '.': [
      [0,0,0],
      [0,0,0],
      [0,0,0],
      [0,0,0],
      [0,'.',0]
    ]
  };

  // 文字列の描画処理
  const textArea = document.getElementById('bean-text-area');
  const textString = "NowBrewing...";
  textString.split('').forEach(char => {
    const charData = textData[char] || textData['.'];
    const cols = charData[0].length;
    
    // 文字ごとのグリッド作成
    const charGrid = document.createElement('div');
    charGrid.className = 'bean-text';
    charGrid.style.setProperty('--text-cols', cols);
    
    // 豆の配置
    charData.forEach(row => {
      row.forEach(cell => {
        const beanDot = document.createElement('div');
        if (cell === '.') {
          beanDot.className = 'coffee-bean-dot';
        } else {
          beanDot.className = 'w-2 h-2'; // 豆なしスペース
        }
        charGrid.appendChild(beanDot);
      });
    });
    
    // 文字と文字の間隔調整
    const charWrapper = document.createElement('div');
    charWrapper.className = 'inline-block mr-1'; // 文字間の余白
    charWrapper.appendChild(charGrid);
    textArea.appendChild(charWrapper);
  });

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
      // 速度を前回そのまま、高速に設定
      let speed = progress > 85 ? 100 : 50; 
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

'use strict';
// ════════════════════════════════════════════════════════════════
// gate.js — URLパラメータ方式によるend到達後の封鎖
//
// 仕組み：
//   signal.html のリンクを end.html?done=1 にしておく。
//   ブラウザバックすると signal.html?done=1 に戻る。
//   gate.js が ?done=1 を検知して画面を乗っ取る。
//   end.html 自身はチェック対象外。
// ════════════════════════════════════════════════════════════════

(function () {

  // end.html 自身は何もしない
  if (location.pathname.endsWith('end.html')) return;

  // URLパラメータに done=1 がなければ何もしない
  const params = new URLSearchParams(location.search);
  if (params.get('done') !== '1') return;

  // ─── done=1 を検知：画面を乗っ取る ──────────────────────────
  function takeover() {
    const style = document.createElement('style');
    style.textContent = `
      #gate-overlay {
        position: fixed; inset: 0; z-index: 99999;
        background: #000;
        display: flex; flex-direction: column;
        align-items: center; justify-content: center;
        gap: 40px; padding: 24px;
        font-family: 'Courier New', monospace;
      }
      #gate-overlay::before {
        content: '';
        position: absolute; inset: 0;
        background: repeating-linear-gradient(
          0deg, transparent, transparent 2px,
          rgba(0,0,0,0.25) 2px, rgba(0,0,0,0.25) 4px
        );
        pointer-events: none;
      }
      #gate-msg {
        color: #ff2b2b;
        font-size: clamp(13px, 2.5vw, 17px);
        letter-spacing: 3px;
        line-height: 2.6;
        text-align: center;
        text-shadow: 0 0 16px rgba(255,43,43,0.5);
        opacity: 0;
        animation: gate-in 1.2s ease 0.4s forwards;
      }
      #gate-btn {
        background: transparent;
        border: 1px solid #ff2b2b;
        color: #ff2b2b;
        font-family: 'Courier New', monospace;
        font-size: 13px;
        letter-spacing: 3px;
        padding: 14px 36px;
        cursor: pointer;
        opacity: 0;
        animation: gate-in 1s ease 1.8s forwards;
        transition: background 0.2s, box-shadow 0.2s;
        position: relative; z-index: 1;
      }
      #gate-btn:hover {
        background: rgba(255,43,43,0.1);
        box-shadow: 0 0 16px rgba(255,43,43,0.3);
      }
      @keyframes gate-in {
        from { opacity: 0; transform: translateY(8px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);

    const overlay = document.createElement('div');
    overlay.id = 'gate-overlay';
    overlay.innerHTML = `
      <div id="gate-msg">
        後戻りはできない。<br>
        お前はもう、そこには戻れない。
      </div>
      <button id="gate-btn" onclick="location.href='end.html?done=1'">
        ▸ 最終ファイルへ戻る
      </button>
    `;
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    document.body.style.pointerEvents = 'none';
    overlay.style.pointerEvents = 'all';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', takeover);
  } else {
    takeover();
  }

})();

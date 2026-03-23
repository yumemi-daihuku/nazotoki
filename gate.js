'use strict';
// ════════════════════════════════════════════════════════════════
// gate.js — pageshow + sessionStorage 方式
//
// FLAG_KEY      : end.html に到達したフラグ
// SEAL_FLAG_KEY : 独白完了（horrorSealForever呼び出し後）フラグ
//                 このフラグがある場合はメッセージを差し替える
// ════════════════════════════════════════════════════════════════

(function () {
  const FLAG_KEY      = 'NAZOTOKI_END_REACHED';
  const SEAL_FLAG_KEY = 'NAZOTOKI_END_SEALED';
  const isEnd         = location.pathname.endsWith('end.html');

  // ─── end.html：フラグをセット ─────────────────────────────────
  if (isEnd) {
    function setFlag() {
      try { sessionStorage.setItem(FLAG_KEY, '1'); } catch (e) {}
    }
    setFlag();
    window.addEventListener('pageshow', setFlag);
    window.addEventListener('beforeunload', setFlag);

    // horrorSealForever が呼ばれた時に SEAL_FLAG_KEY もセット
    const _origSeal = window.horrorSealForever;
    window.horrorSealForever = function () {
      try { sessionStorage.setItem(SEAL_FLAG_KEY, '1'); } catch (e) {}
      if (_origSeal) _origSeal();
    };
    return;
  }

  // ─── 他ページ：封鎖チェック ───────────────────────────────────
  function checkAndLock() {
    let reached = false;
    try { reached = sessionStorage.getItem(FLAG_KEY) === '1'; } catch (e) {}
    if (!reached) return;
    if (document.getElementById('gate-overlay')) return;

    // 独白完了フラグの確認
    let sealed = false;
    try { sealed = sessionStorage.getItem(SEAL_FLAG_KEY) === '1'; } catch (e) {}

    // メッセージ・ボタンラベルを状態で出し分け
    const msg = sealed
      ? '戻っても、もう意味はない。<br>……せいぜい、鏡に気を付けるんだな。'
      : '後戻りはできない。<br>お前はもう、ここには戻れない。';

    const btnLabel = sealed
      ? '▸ 最後をもう一度見る'
      : '▸ 最終ファイルへ戻る';

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
        letter-spacing: 3px; line-height: 2.6;
        text-align: center;
        text-shadow: 0 0 16px rgba(255,43,43,0.5);
        opacity: 0;
        animation: gate-in 1.2s ease 0.4s forwards;
        position: relative; z-index: 1;
      }
      #gate-btn {
        background: transparent;
        border: 1px solid #ff2b2b;
        color: #ff2b2b;
        font-family: 'Courier New', monospace;
        font-size: 13px; letter-spacing: 3px;
        padding: 14px 36px; cursor: pointer;
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
      <div id="gate-msg">${msg}</div>
      <button id="gate-btn" onclick="location.href='end.html'">${btnLabel}</button>
    `;
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    document.body.style.pointerEvents = 'none';
    overlay.style.pointerEvents = 'all';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkAndLock);
  } else {
    checkAndLock();
  }

  window.addEventListener('pageshow', checkAndLock);

})();

// Settings drawer (non-intrusive), preserves original colors
(function(){
  const panel = document.getElementById('aurenixSettings');
  const openBtn = document.getElementById('aurenixOpenSettings');
  const closeBtn = document.getElementById('aurenixCloseSettings');
  const bgSel = document.getElementById('aurenixBgMode');
  const animChk = document.getElementById('aurenixAnim');

  function init(){
    if(!panel) return;
    bgSel.value = localStorage.getItem('aurenix.bg') || 'off';
    animChk.checked = (localStorage.getItem('aurenix.anim') !== 'false');
  }
  function apply(){
    localStorage.setItem('aurenix.bg', bgSel.value);
    localStorage.setItem('aurenix.anim', animChk.checked ? 'true' : 'false');
    // trigger
    window.dispatchEvent(new StorageEvent('storage', { key: 'aurenix.bg', newValue: bgSel.value }));
    window.dispatchEvent(new StorageEvent('storage', { key: 'aurenix.anim', newValue: animChk.checked ? 'true' : 'false' }));
  }
  openBtn && (openBtn.onclick = ()=> panel.classList.remove('aurenix-hidden'));
  closeBtn && (closeBtn.onclick = ()=> panel.classList.add('aurenix-hidden'));
  bgSel && (bgSel.onchange = apply);
  animChk && (animChk.onchange = apply);
  init();
})();
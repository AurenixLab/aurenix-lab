document.addEventListener('click', async (e)=>{
  const btn = e.target.closest('.copybtn'); if(!btn) return;
  const pre = btn.closest('pre'); const code = pre.querySelector('code');
  if(!code) return; try{ await navigator.clipboard.writeText(code.textContent); const old = btn.textContent; btn.textContent='Copied'; setTimeout(()=>btn.textContent=old,1000);}catch(err){ alert('Copy failed: '+err.message); }
});

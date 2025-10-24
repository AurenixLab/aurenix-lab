(function(){
  function startType(el){
    if(!el) return;
    let list = [];
    try { list = JSON.parse(el.getAttribute('data-phrases') || "[]"); } catch(e){}
    if(!list.length) return;
    const cursor = el.nextElementSibling && el.nextElementSibling.classList.contains('cursor') ? el.nextElementSibling : null;
    let i=0,j=0,del=false;
    function tick(){
      const p=list[i];
      el.textContent = del ? p.slice(0,j--) : p.slice(0,j++);
      if(!del && j>p.length){ del=true; setTimeout(tick,1100); return; }
      if(del && j<0){ del=false; i=(i+1)%list.length; }
      setTimeout(tick, del?42:78);
    }
    tick();
    if(cursor){ setInterval(()=>cursor.classList.toggle('dim'),420); }
  }
  function applyLangPhrases(lang){
    document.querySelectorAll('[data-phrases-en]').forEach(el=>{
      const arr = el.getAttribute(lang==='de'?'data-phrases-de':'data-phrases-en');
      if(arr) el.setAttribute('data-phrases', arr);
    });
  }
  document.addEventListener('DOMContentLoaded',()=>{
    applyLangPhrases(localStorage.getItem('lang')||'de');
    document.querySelectorAll('[data-phrases]').forEach(startType);
    window.__applyLangPhrases = applyLangPhrases;
  });
})();

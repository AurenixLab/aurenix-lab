(function(){
  function startType(el){
    if(!el) return;
    let list = []; try{ list = JSON.parse(el.getAttribute('data-phrases')||'[]'); }catch(e){}
    if(!list.length) return;
    const max = list.reduce((a,b)=> a.length>b.length?a:b, "");
    const span = document.createElement('span'); span.style.position='absolute'; span.style.left='-9999px'; span.style.whiteSpace='pre'; span.style.font = getComputedStyle(el).font; span.textContent = max; document.body.appendChild(span);
    const w = span.getBoundingClientRect().width + 4; span.remove(); el.style.display='inline-block'; el.style.width = w+'px';
    let i=0,j=0,del=false; const cursor = el.nextElementSibling;
    function tick(){ const p=list[i]; el.textContent = del ? p.slice(0,j--) : p.slice(0,j++); if(!del && j>p.length){ del=true; setTimeout(()=>requestAnimationFrame(tick),900); return;} if(del && j<0){ del=false; i=(i+1)%list.length; } setTimeout(()=>requestAnimationFrame(tick), del?38:78); }
    tick(); if(cursor) setInterval(()=>cursor.classList.toggle('dim'),420);
  }
  function applyLang(lang){
    document.querySelectorAll('[data-en]').forEach(el=>{
      const en = el.getAttribute('data-en'); const de = el.getAttribute('data-de') || en;
      const txt = lang==='de' ? de : en;
      if(el.tagName==='INPUT' || el.tagName==='TEXTAREA') {
        if(el.placeholder) el.placeholder = txt; else el.value = txt;
      } else el.textContent = txt;
    });
    document.querySelectorAll('[data-phrases-en]').forEach(el=>{
      el.setAttribute('data-phrases', lang==='de' ? el.getAttribute('data-phrases-de') : el.getAttribute('data-phrases-en'));
    });
    document.querySelectorAll('.type').forEach(startType);
    localStorage.setItem('lang', lang);
    document.querySelectorAll('.lang button').forEach(b=>b.classList.remove('active'));
    document.querySelector('.lang button'+(lang==='de'?':last-child':':first-child')).classList.add('active');
  }
  document.addEventListener('DOMContentLoaded', ()=>{ const lang = localStorage.getItem('lang') || 'de'; applyLang(lang); });
  window.setLang = applyLang;
})();

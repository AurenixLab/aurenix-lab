/* core.js - rotator + small docs enhancements (no framework needed) */
(function(){
  // Helper: lazy 'loading' for <img> if missing
  document.querySelectorAll('img:not([loading])').forEach(img=> img.setAttribute('loading','lazy'));

  // Rotator: finds elements with [data-rotator] or injects a subtle badge if none
  function setupRotatorFor(el, items){
    if(!el) return;
    el.classList.add('aur-rotator');
    // keep original text as first item if not included
    const base = (el.dataset.originalText || el.textContent || '').trim();
    const unique = (arr)=> Array.from(new Set(arr.filter(Boolean).map(s=>s.trim())));
    let list = unique([base].concat(items||[]));
    // ensure >=3 items
    while(list.length < 3) list.push(list[list.length-1] || base || 'AurenixLab');
    // Build DOM
    const h = el.offsetHeight || 0;
    el.style.minHeight = h ? (h+'px') : undefined;
    const current = document.createElement('span'); current.className = 'aur-rot-item active'; current.textContent = list[0]; el.textContent = ''; el.appendChild(current);
    for(let i=1;i<list.length;i++){ const s=document.createElement('span'); s.className='aur-rot-item'; s.textContent=list[i]; el.appendChild(s); }
    let idx = 0, nodes = el.querySelectorAll('.aur-rot-item');
    setInterval(()=>{
      nodes[idx].classList.remove('active');
      idx = (idx + 1) % nodes.length;
      nodes[idx].classList.add('active');
    }, 2600);
  }

  // 1) Use explicit markers
  const marked = document.querySelectorAll('[data-rotator]');
  marked.forEach(el=>{
    try{
      const data = el.getAttribute('data-rotator-texts');
      const arr = data ? JSON.parse(data) : null;
      setupRotatorFor(el, arr);
    }catch(e){ setupRotatorFor(el, null); }
  });

  // 2) If page has no markers, upgrade the first visible H1 non-destructively
  if(marked.length === 0){
    const h1 = document.querySelector('h1');
    if(h1){
      h1.dataset.originalText = h1.textContent;
      const extras = [
        document.title || '',
        'Schnell. Stabil. Modern.',
        location.pathname.split('/').pop().replace(/\.html?$/,'')
      ];
      setupRotatorFor(h1, extras);
    }else{
      // 3) As a last resort, show a tiny rotating badge in the top-right
      const host = document.createElement('div'); host.className = 'aur-top-right';
      host.innerHTML = '<div class="aur-badge" data-rotator data-rotator-texts="[\"AurenixLab\",\"Schnell. Stabil. Modern.\",\"Optimiert v8\"]">•</div>';
      document.body.appendChild(host);
      const b = host.querySelector('[data-rotator]'); setupRotatorFor(b, JSON.parse(b.getAttribute('data-rotator-texts')));
    }
  }

  // Docs enhancements: if the filename contains "doc"
  if(/doc/i.test(location.pathname)){
    // Add quick filter for tables/lists
    const input = document.createElement('input');
    input.placeholder = 'Inhalt filtern…';
    input.style.cssText = 'position:sticky;top:10px;padding:8px 10px;border-radius:10px;border:1px solid currentColor;opacity:.85;margin:8px 0;';
    const container = document.body.querySelector('main, .content, .container, body') || document.body;
    container.prepend(input);
    input.addEventListener('input', ()=>{
      const q = input.value.toLowerCase();
      document.querySelectorAll('table tr, li, p').forEach(node=>{
        const t = (node.textContent||'').toLowerCase();
        node.style.display = t.includes(q) ? '' : 'none';
      });
    });
  }

  // Settings button (top-right): toggle rotator modes if needed in the future
  // (kept minimal to avoid altering your design)
})();
// Minimal markdown docs loader for v7 → v8 docs
(function(){
  const sidebar = document.getElementById('docsSidebar');
  const content = document.getElementById('docContent');
  const search = document.getElementById('docSearch');
  const PAGES = [
    { id: 'intro', title: 'Einführung', file: 'intro.md' },
    { id: 'setup', title: 'Setup', file: 'setup.md' },
    { id: 'usage', title: 'Benutzung', file: 'usage.md' },
    { id: 'api', title: 'API', file: 'api.md' },
    { id: 'faq', title: 'FAQ', file: 'faq.md' }
  ];
  function nav(){
    sidebar.innerHTML = PAGES.map(p=>`<a href="#${p.id}" data-id="${p.id}" style="display:block;padding:8px;border-radius:8px;text-decoration:none;color:inherit;opacity:.85">${p.title}</a>`).join('');
    sidebar.querySelectorAll('a').forEach(a=>{
      a.onclick = (e)=>{ e.preventDefault(); location.hash = a.dataset.id; load(a.dataset.id); };
    });
  }
  async function load(id){
    const page = PAGES.find(p=>p.id===id) || PAGES[0];
    sidebar.querySelectorAll('a').forEach(a=>a.style.background = (a.dataset.id===page.id)?'rgba(255,255,255,.06)':'transparent');
    const res = await fetch('./docs/'+page.file);
    const md = await res.text();
    content.innerHTML = render(md);
  }
  function render(md){
    md = md.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    md = md.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    md = md.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    md = md.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    md = md.replace(/\*(.*?)\*/gim, '<em>$1</em>');
    md = md.replace(/`{3}([\s\S]*?)`{3}/gim, '<pre><code>$1</code></pre>');
    md = md.replace(/`([^`]+)`/gim, '<code>$1</code>');
    md = md.replace(/^\- (.*$)/gim, '<li>$1</li>');
    md = md.replace(/\n\n/g, '<br/><br/>');
    md = md.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank">$1</a>');
    md = md.replace(/(<li>.*<\/li>)/gims, '<ul>$1</ul>');
    return md;
  }
  search && (search.oninput = ()=>{
    const q = search.value.toLowerCase();
    sidebar.querySelectorAll('a').forEach(a=> a.style.display = a.textContent.toLowerCase().includes(q) ? '' : 'none');
  });
  nav(); load(location.hash.substring(1) || 'intro'); addEventListener('hashchange', ()=>load(location.hash.substring(1)));
})();
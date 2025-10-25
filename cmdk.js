// Command Palette (Ctrl+K) to navigate within site — does not change original UI
(function(){
  const modal = document.getElementById('aurenixCmdk');
  const input = document.getElementById('aurenixCmdkInput');
  const list = document.getElementById('aurenixCmdkList');
  if(!modal||!input||!list) return;

  const links = Array.from(document.querySelectorAll('a[href]'))
    .filter(a => !a.href.startsWith('#'))
    .map(a => ({ label: a.textContent.trim() || a.href, href: a.getAttribute('href') }));

  function open(){ modal.classList.remove('aurenix-hidden'); input.value=''; render(''); input.focus(); }
  function close(){ modal.classList.add('aurenix-hidden'); }
  function render(q){
    list.innerHTML='';
    links.filter(x=>x.label.toLowerCase().includes(q.toLowerCase())).forEach(x=>{
      const li=document.createElement('li'); li.textContent=x.label; li.onclick=()=>{ location.href=x.href; close(); }; list.appendChild(li);
    });
  }
  document.addEventListener('keydown', (e)=>{
    if((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==='k'){ e.preventDefault(); open(); }
    if(e.key==='Escape') close();
  });
  input.oninput = (e)=>render(e.target.value);
})();
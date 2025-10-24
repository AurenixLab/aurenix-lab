const API = window.AURENIX_API || 'https://aurenix-lab-production.up.railway.app/send';
const QUEUE_KEY = 'aurenix_form_queue_v7';
async function sendNow(data){ const res = await fetch(API, { method:'POST', headers:{ 'Content-Type':'application/json' }, mode:'cors', body: JSON.stringify(data) }); if(!res.ok) throw new Error('Server '+res.status); return res.json(); }
async function enqueue(data){ const q = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]'); q.push({data, t: Date.now()}); localStorage.setItem(QUEUE_KEY, JSON.stringify(q)); }
async function processQueue(){ const q = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]'); if(!q.length) return; const rem=[]; for(const item of q){ try{ await sendNow(item.data); }catch(e){ rem.push(item); } } localStorage.setItem(QUEUE_KEY, JSON.stringify(rem)); }
setInterval(processQueue, 30*1000);
document.addEventListener('submit', async (e)=>{
  if(!e.target.matches('.aurenix-form')) return;
  e.preventDefault();
  const form = e.target; const sbtn = form.querySelector('button[type=submit]'); const ok = form.querySelector('.success');
  const data = Object.fromEntries(new FormData(form).entries()); data.topic = form.dataset.topic || 'Form';
  sbtn.disabled = true; sbtn.textContent = 'Sending...';
  try{ await sendNow(data); ok.style.display='block'; ok.textContent = '✅ Sent'; form.reset(); }
  catch(err){ await enqueue(data); ok.style.display='block'; ok.textContent = 'Saved offline — will retry automatically.'; }
  finally{ sbtn.disabled = false; sbtn.textContent = form.dataset.btn || 'Absenden'; }
});

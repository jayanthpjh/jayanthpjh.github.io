const root = document.documentElement;
const themeButton = document.querySelector('#theme-toggle');
const calmButton = document.querySelector('#calm-toggle');
const canvas = document.querySelector('#data-canvas');
const coreWrap = document.querySelector('#core-wrap');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function applyTheme(theme) {
  root.dataset.theme = theme;
  themeButton.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#07111f' : '#edf1f5';
}
let savedTheme;
try { savedTheme = localStorage.getItem('jp_theme'); } catch { savedTheme = null; }
applyTheme(savedTheme === 'light' ? 'light' : 'dark');
themeButton.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark'; applyTheme(next);
  try { localStorage.setItem('jp_theme', next); } catch { /* Private browsing can disable storage. */ }
});
calmButton.addEventListener('click', () => {
  const calm = document.body.classList.toggle('calm-mode'); calmButton.setAttribute('aria-pressed', String(calm)); calmButton.setAttribute('aria-label', calm ? 'Disable calm mode' : 'Enable calm mode');
});
const modes = {path:['A reliable data path.','Move from source systems to trusted decisions with every transformation visible.'],stream:['Streaming with a safety net.','Auto Loader, checkpoints, rescued fields, and observability keep high-volume events moving.'],cdc:['Current state, correctly.','Stage change feeds, deduplicate by business key, then merge inserts, updates, and deletes safely.']};
document.querySelectorAll('.mode-tab').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.mode-tab').forEach(item => item.classList.remove('active')); button.classList.add('active');
  const [title, description] = modes[button.dataset.mode]; document.querySelector('#core-title').textContent = title; document.querySelector('#core-description').textContent = description; coreWrap.dataset.mode = button.dataset.mode;
}));

function setupCanvas() {
  if (!canvas) return; const ctx = canvas.getContext('2d'); if (!ctx) return;
  let width = 0; let height = 0; let particles = []; let pointerX = .5; let pointerY = .5;
  const density = () => Math.min(75, Math.max(35, Math.floor((width * height) / 12000)));
  const resize = () => { const ratio = Math.min(window.devicePixelRatio || 1, 2); width = canvas.clientWidth; height = canvas.clientHeight; canvas.width = width * ratio; canvas.height = height * ratio; ctx.setTransform(ratio,0,0,ratio,0,0); particles = Array.from({length:density()},(_,index)=>({x:Math.random()*width,y:Math.random()*height,r:index%7===0?2:1,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25,alpha:.18+Math.random()*.5})); };
  const paint = (time = 0) => {
    ctx.clearRect(0,0,width,height); const drift = document.body.classList.contains('calm-mode') || prefersReducedMotion.matches ? 0 : Math.sin(time/1800)*.08;
    particles.forEach((particle,index)=>{ particle.x += particle.vx+drift; particle.y += particle.vy; if(particle.x<0||particle.x>width) particle.vx*=-1; if(particle.y<0||particle.y>height) particle.vy*=-1; const dx=pointerX*width-particle.x; const dy=pointerY*height-particle.y; const distance=Math.sqrt(dx*dx+dy*dy); if(distance<160&&!document.body.classList.contains('calm-mode')){particle.x+=dx*.00045;particle.y+=dy*.00045;} ctx.beginPath();ctx.arc(particle.x,particle.y,particle.r,0,Math.PI*2);ctx.fillStyle=index%5===0?`rgba(107,231,224,${particle.alpha})`:`rgba(102,166,255,${particle.alpha})`;ctx.fill();});
    for(let i=0;i<particles.length;i+=1){for(let j=i+1;j<particles.length;j+=1){const a=particles[i],b=particles[j],distance=Math.hypot(a.x-b.x,a.y-b.y);if(distance<105){ctx.strokeStyle=`rgba(102,166,255,${(1-distance/105)*.13})`;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}}}
    if(!prefersReducedMotion.matches) requestAnimationFrame(paint);
  };
  resize(); window.addEventListener('resize',resize,{passive:true}); coreWrap.addEventListener('pointermove',event=>{const rect=coreWrap.getBoundingClientRect();pointerX=(event.clientX-rect.left)/rect.width;pointerY=(event.clientY-rect.top)/rect.height;}); coreWrap.addEventListener('pointerleave',()=>{pointerX=.5;pointerY=.5;}); paint();
}
setupCanvas(); document.querySelector('#year').textContent = new Date().getFullYear();

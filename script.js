const root = document.documentElement;
const themeButton = document.querySelector('#theme-toggle');
const calmButton = document.querySelector('#calm-toggle');
const year = document.querySelector('#year');
const projectCards = [...document.querySelectorAll('[data-project]')];

const models = {
  gcp: {
    label: 'GCP / LOGISTICS', status: 'PROJECT PATH ACTIVE', headline: 'Batch systems, made trustworthy.',
    description: 'A field bridge turns shipment signals and operational files into a governed logistics lakehouse.',
    source: ['GCS + event feeds', 'Files · events · operational systems'], bridge: ['Map + transform', 'Source-to-target mapping'], quality: ['Quality gates', 'Validate · reconcile · observe'], serve: ['Delta + Unity Catalog', 'Governed bronze → gold'], output: ['Trusted decisions', 'BI · operations · cutover'],
    metrics: [['BATCH', 'delivery'], ['GOVERNED', 'lakehouse']]
  },
  aws: {
    label: 'AWS / E-COMMERCE', status: 'PROJECT PATH ACTIVE', headline: 'Streaming signals, without losing the source.',
    description: 'A forward-deployed path connects clickstream and CDC events to reliable order analytics.',
    source: ['S3 + clickstream', 'Events · orders · raw source'], bridge: ['Auto Loader + CDC', 'Capture inserts · updates · deletes'], quality: ['Replayable truth', 'Schema · lineage · checkpoints'], serve: ['Delta + Airflow', 'Low-latency serving'], output: ['Order decisions', 'Commerce · ops · analytics'],
    metrics: [['STREAMING', 'signal path'], ['CDC', 'zero-loss']]
  },
  azure: {
    label: 'AZURE / INSURANCE', status: 'PROJECT PATH ACTIVE', headline: 'Claims and quotes, one governed path.',
    description: 'A field bridge combines quote streams and claims change feeds with explicit quality gates.',
    source: ['ADLS + quote feeds', 'Claims · quotes · source tables'], bridge: ['Schema rescue + CDC', 'Evolve safely · preserve grain'], quality: ['Quality gates', 'Reject · reconcile · observe'], serve: ['Delta + ADF', 'Medallion lakehouse'], output: ['Underwriting insight', 'Claims · quotes · reporting'],
    metrics: [['MIXED', 'batch + stream'], ['QUALITY', 'gated']]
  }
};

function setTheme(theme) {
  root.dataset.theme = theme;
  themeButton?.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  localStorage.setItem('portfolio-theme', theme);
}
const savedTheme = localStorage.getItem('portfolio-theme');
setTheme(savedTheme === 'light' ? 'light' : 'dark');
themeButton?.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
calmButton?.addEventListener('click', () => {
  const calm = root.classList.toggle('calm-mode');
  calmButton.setAttribute('aria-pressed', String(calm));
  calmButton.setAttribute('aria-label', calm ? 'Disable calm mode' : 'Enable calm mode');
});

function updateModel(key, moveFocus = false) {
  const model = models[key];
  if (!model) return;
  const set = (id, value) => { const node = document.querySelector(`#${id}`); if (node) node.textContent = value; };
  set('model-title', model.label); set('model-status', model.status); set('model-headline', model.headline); set('model-description', model.description);
  [['source-title', model.source[0]], ['source-detail', model.source[1]], ['bridge-title', model.bridge[0]], ['bridge-detail', model.bridge[1]], ['quality-title', model.quality[0]], ['quality-detail', model.quality[1]], ['serve-title', model.serve[0]], ['serve-detail', model.serve[1]], ['output-title', model.output[0]], ['output-detail', model.output[1]], ['metric-one', model.metrics[0][0]], ['metric-one-label', model.metrics[0][1]], ['metric-two', model.metrics[1][0]], ['metric-two-label', model.metrics[1][1]]].forEach(([id, value]) => set(id, value));
  projectCards.forEach(card => { const active = card.dataset.project === key; card.classList.toggle('is-selected', active); card.setAttribute('aria-pressed', String(active)); });
  document.querySelector('#system-map')?.setAttribute('data-active-project', key);
  if (moveFocus) document.querySelector('#system-map')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
projectCards.forEach(card => {
  const select = () => updateModel(card.dataset.project, true);
  card.addEventListener('click', event => { if (event.target.closest('a')) return; select(); });
  card.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); select(); } });
});
updateModel('gcp');

const canvas = document.querySelector('#data-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d'); let width = 0; let height = 0; let particles = []; let pointer = { x: 0, y: 0, active: false };
  const density = () => window.innerWidth < 640 ? 28 : 52;
  const resize = () => { const ratio = Math.min(window.devicePixelRatio || 1, 2); width = canvas.clientWidth; height = canvas.clientHeight; canvas.width = width * ratio; canvas.height = height * ratio; ctx.setTransform(ratio, 0, 0, ratio, 0, 0); particles = Array.from({ length: density() }, (_, index) => ({ x: Math.random() * width, y: Math.random() * height, r: index % 8 === 0 ? 2 : 1, vx: (Math.random() - .5) * .22, vy: (Math.random() - .5) * .22, alpha: .16 + Math.random() * .35 })); };
  const draw = () => { ctx.clearRect(0, 0, width, height); const quiet = root.classList.contains('calm-mode') || window.matchMedia('(prefers-reduced-motion: reduce)').matches; particles.forEach((p, i) => { if (!quiet) { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > width) p.vx *= -1; if (p.y < 0 || p.y > height) p.vy *= -1; } const dx = pointer.active ? pointer.x - p.x : 0; const dy = pointer.active ? pointer.y - p.y : 0; const near = Math.max(0, 1 - Math.hypot(dx, dy) / 180); ctx.fillStyle = `rgba(107,231,224,${p.alpha + near * .38})`; ctx.beginPath(); ctx.arc(p.x, p.y, p.r + near, 0, Math.PI * 2); ctx.fill(); for (let j = i + 1; j < particles.length; j++) { const q = particles[j]; const distance = Math.hypot(p.x - q.x, p.y - q.y); if (distance < 105) { ctx.strokeStyle = `rgba(102,166,255,${(1 - distance / 105) * .11})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); } } }); if (!quiet) requestAnimationFrame(draw); };
  canvas.parentElement?.addEventListener('pointermove', event => { const rect = canvas.getBoundingClientRect(); pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top, active: true }; });
  canvas.parentElement?.addEventListener('pointerleave', () => { pointer.active = false; }); window.addEventListener('resize', resize); resize(); draw();
}
if (year) year.textContent = new Date().getFullYear();

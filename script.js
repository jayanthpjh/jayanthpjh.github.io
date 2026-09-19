const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const themeButton = document.querySelector('#theme-toggle');
const calmButton = document.querySelector('#calm-toggle');
const scene = document.querySelector('#scene');
const stages = document.querySelector('#stages');
const connections = document.querySelector('#connections');
const projectMetrics = document.querySelector('#project-metrics');
const projectMetricsSummary = document.querySelector('#project-metrics-summary');
const models = window.portfolioModels;
let selected = 'gcp';
let selectedStage;
const saved = key => { try { return localStorage.getItem(key); } catch { return null; } };
const save = (key,value) => { try { localStorage.setItem(key,value); } catch { /* Storage is optional. */ } };
function setTheme(theme) {
  root.dataset.theme = theme;
  const next = theme === 'dark' ? 'Light mode' : 'Dark mode';
  document.querySelector('#theme-label').textContent = next;
  themeButton.setAttribute('aria-label', `Switch to ${next.toLowerCase()}`);
  document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#101629' : '#f3f6fc';
  save('portfolio-theme',theme);
}
function syncMotion() {
  const quiet = reduced.matches || calmButton.getAttribute('aria-pressed') === 'true';
  root.classList.toggle('quiet',quiet);
}
setTheme(saved('portfolio-theme') === 'light' ? 'light' : 'dark');
themeButton.addEventListener('click',()=>setTheme(root.dataset.theme==='dark'?'light':'dark'));
calmButton.removeAttribute('aria-label');
calmButton.setAttribute('aria-pressed', String(saved('portfolio-calm')==='true'));
calmButton.addEventListener('click',()=>{
  const calm = calmButton.getAttribute('aria-pressed')!=='true';
  calmButton.setAttribute('aria-pressed',String(calm));
  save('portfolio-calm',String(calm)); syncMotion();
});
reduced.addEventListener('change',syncMotion); syncMotion();
const sculpture = kind => `<span class="sculpture ${kind}" aria-hidden="true"><i></i><i></i><i></i><b>${kind==='quality'?'✓':kind==='compute'?'⌘':kind==='analytics'?'▥':''}</b></span>`;
function showStage(id) {
  const node=models[selected].nodes.find(item=>item.id===id);
  if(!node) return;
  selectedStage=id;
  stages.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.stage===id)));
  document.querySelector('#stage-title').textContent=node.title;
  document.querySelector('#stage-description').textContent=node.detail;
  document.querySelector('#stage-category').textContent='ENGINEERING NOTE / '+node.kind.toUpperCase();
  connections.querySelectorAll('[data-from]').forEach(edge=>edge.classList.toggle('highlight',edge.dataset.from===id||edge.dataset.to===id));
}
function drawConnections() {
  const base=scene.getBoundingClientRect();
  if(!base.width) return;
  connections.setAttribute('viewBox',`0 0 ${base.width} ${base.height}`);
  const vertical=matchMedia('(max-width: 700px)').matches;
  connections.innerHTML='<defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="currentColor"/></marker></defs>';
  for(const [from,to] of models[selected].edges) {
    const a=stages.querySelector(`[data-stage="${from}"]`).getBoundingClientRect();
    const b=stages.querySelector(`[data-stage="${to}"]`).getBoundingClientRect();
    const x1=vertical?a.right-base.left:a.right-base.left-10;
    const y1=vertical?a.top+a.height/2-base.top:a.top+a.height*.40-base.top;
    const x2=vertical?b.right-base.left:b.left-base.left+10;
    const y2=vertical?b.top+b.height/2-base.top:b.top+b.height*.40-base.top;
    const d=vertical?`M${x1},${y1} H${base.width-4} V${y2} H${x2}`:`M${x1},${y1} C${(x1+x2)/2},${y1} ${(x1+x2)/2},${y2} ${x2},${y2}`;
    connections.insertAdjacentHTML('beforeend',`<g data-from="${from}" data-to="${to}"><path class="wire" d="${d}" marker-end="url(#arrow)"/><path class="flow" d="${d}"/></g>`);
  }
  showStage(selectedStage);
}
function renderProjectMetrics(model) {
  projectMetricsSummary.textContent = `${model.name} project metrics are selected.`;
  projectMetrics.innerHTML = model.metrics.map(item=>`<article class="metric-card"><strong>${item.value}</strong><span>${item.label}</span><p>${item.context}</p></article>`).join('');
}
function selectProject(key,fromCard=false) {
  if(!models[key]) return;
  selected=key;const model=models[key];
  scene.dataset.project=key;
  document.querySelectorAll('[data-select]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.select===key)));
  document.querySelectorAll('[data-project]').forEach(card=>card.classList.toggle('is-selected',card.dataset.project===key));
  stages.innerHTML=model.nodes.map((node,index)=>`<button class="stage" data-stage="${node.id}" style="--x:${node.x}%;--y:${node.y}%;--delay:${index*65}ms" aria-pressed="false">${sculpture(node.kind)}<span class="stage-title">${node.title}</span><span class="stage-caption">${node.caption}</span></button>`).join('');
  stages.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>showStage(button.dataset.stage)));
  document.querySelector('#deployment-note').textContent=model.evidence;
  document.querySelector('#architecture-source').href=`https://github.com/jayanthpjh/data-engineering-projects/tree/main/${model.slug}`;
  renderProjectMetrics(model);
  document.querySelector('#selection-status').textContent=`${model.name} selected. ${model.nodes.length} stages. Select a stage for its engineering details.`;
  showStage(model.nodes[0].id);
  // Read stable layout geometry; animation happens inside the stage, not on its button.
  drawConnections();
  if(fromCard) {
    document.querySelector(`.project-switch [data-select="${key}"]`).focus({preventScroll:true});
    document.querySelector('#architecture').scrollIntoView({behavior:root.classList.contains('quiet')?'instant':'smooth',block:'start'});
  }
}
document.querySelectorAll('[data-select]').forEach(button=>button.addEventListener('click',()=>selectProject(button.dataset.select,button.classList.contains('architecture-action'))));
new ResizeObserver(drawConnections).observe(scene);
selectProject('gcp');
document.fonts.ready.then(drawConnections);
document.querySelectorAll('.project-card').forEach((card,index)=>card.insertAdjacentHTML('afterbegin',`<div class="project-art" aria-hidden="true">${sculpture(['storage','compute','lake'][index])}<span>${['BATCH / ORCHESTRATE','STREAM / MERGE','RESCUE / VALIDATE'][index]}</span></div>`));
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){entry.target.classList.add('revealed');observer.unobserve(entry.target);}
}),{threshold:.08});
document.querySelectorAll('.mission-card,.method-grid article,.project-card,.metric-card,.about-grid,.contact-grid').forEach(element=>{element.classList.add('reveal');observer.observe(element);});
document.querySelector('#year').textContent=new Date().getFullYear();

const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const themeButton = document.querySelector('#theme-toggle');
const calmButton = document.querySelector('#calm-toggle');
const scene = document.querySelector('#scene');
const stages = document.querySelector('#stages');
const connections = document.querySelector('#connections');
const projectMetrics = document.querySelector('#project-metrics');
const projectMetricsSummary = document.querySelector('#project-metrics-summary');
const pathRail = document.querySelector('#path-rail');
const stagePrev = document.querySelector('#stage-prev');
const stageNext = document.querySelector('#stage-next');
const stageIndex = document.querySelector('#stage-index');
const selectionStatus = document.querySelector('#selection-status');
const commandDialog = document.querySelector('#command-palette');
const commandInput = document.querySelector('#command-input');
const commandList = document.querySelector('#command-list');
const models = window.portfolioModels;
let selected = 'gcp';
let selectedStage;
let announced = '';
let renderedPath = '';
const saved = key => { try { return localStorage.getItem(key); } catch { return null; } };
const save = (key, value) => { try { localStorage.setItem(key, value); } catch { /* Storage is optional. */ } };
const motion = () => root.classList.contains('quiet') ? 'instant' : 'smooth';
function announce(text) {
  if (announced === text) return;
  announced = text;
  selectionStatus.textContent = text;
}
function setTheme(theme) {
  root.dataset.theme = theme;
  const next = theme === 'dark' ? 'Light mode' : 'Dark mode';
  document.querySelector('#theme-label').textContent = next;
  themeButton.setAttribute('aria-label', `Switch to ${next.toLowerCase()}`);
  document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#101629' : '#f3f6fc';
  save('portfolio-theme', theme);
}
function syncMotion() {
  const quiet = reduced.matches || calmButton.getAttribute('aria-pressed') === 'true';
  root.classList.toggle('quiet', quiet);
}
setTheme(saved('portfolio-theme') === 'light' ? 'light' : 'dark');
themeButton.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
calmButton.removeAttribute('aria-label');
calmButton.setAttribute('aria-pressed', String(saved('portfolio-calm') === 'true'));
calmButton.addEventListener('click', () => {
  const calm = calmButton.getAttribute('aria-pressed') !== 'true';
  calmButton.setAttribute('aria-pressed', String(calm));
  save('portfolio-calm', String(calm));
  syncMotion();
});
reduced.addEventListener('change', syncMotion);
syncMotion();
const sculpture = kind => `<span class="sculpture ${kind}" aria-hidden="true"><i></i><i></i><i></i><b>${kind === 'quality' ? '✓' : kind === 'compute' ? '⌘' : kind === 'analytics' ? '▥' : ''}</b></span>`;
function relatedNodes(model, id) {
  const incoming = new Map();
  const outgoing = new Map();
  for (const [from, to] of model.edges) {
    outgoing.set(from, [...(outgoing.get(from) || []), to]);
    incoming.set(to, [...(incoming.get(to) || []), from]);
  }
  const keep = new Set([id]);
  const walk = (node, next) => {
    for (const neighbor of next.get(node) || []) {
      if (keep.has(neighbor)) continue;
      keep.add(neighbor);
      walk(neighbor, next);
    }
  };
  walk(id, incoming);
  walk(id, outgoing);
  return model.nodes.filter(node => keep.has(node.id));
}
function renderPath(model, id) {
  const key = `${selected}:${id}`;
  stageIndex.textContent = `${model.nodes.findIndex(node => node.id === id) + 1} / ${model.nodes.length}`;
  if (renderedPath === key) return;
  renderedPath = key;
  const nodes = relatedNodes(model, id);
  pathRail.replaceChildren();
  const list = document.createElement('ol');
  list.className = 'path-line';
  for (const node of nodes) {
    const item = document.createElement('li');
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'path-chip';
    chip.dataset.stageJump = node.id;
    chip.textContent = node.title;
    if (node.id === id) {
      chip.classList.add('is-current');
      chip.setAttribute('aria-current', 'step');
    }
    item.append(chip);
    list.append(item);
  }
  pathRail.append(list);
}
function showStage(id) {
  const model = models[selected];
  const node = model.nodes.find(item => item.id === id);
  if (!node) return;
  selectedStage = id;
  const index = model.nodes.findIndex(item => item.id === id);
  stages.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.stage === id)));
  document.querySelector('#stage-title').textContent = node.title;
  document.querySelector('#stage-description').textContent = node.detail;
  document.querySelector('#stage-category').textContent = 'ENGINEERING NOTE / ' + node.kind.toUpperCase();
  stagePrev.disabled = index === 0;
  stageNext.disabled = index === model.nodes.length - 1;
  connections.querySelectorAll('[data-from]').forEach(edge => edge.classList.toggle('highlight', edge.dataset.from === id || edge.dataset.to === id));
  renderPath(model, id);
  announce(`${model.name}. Stage ${index + 1} of ${model.nodes.length}: ${node.title}. ${node.detail}`);
}
function moveStage(delta) {
  const model = models[selected];
  const index = model.nodes.findIndex(node => node.id === selectedStage);
  const node = model.nodes[index + delta];
  if (!node) return;
  showStage(node.id);
}
function drawConnections() {
  const base = scene.getBoundingClientRect();
  if (!base.width) return;
  connections.setAttribute('viewBox', `0 0 ${base.width} ${base.height}`);
  const vertical = matchMedia('(max-width: 700px)').matches;
  connections.innerHTML = '<defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="currentColor"/></marker></defs>';
  for (const [from, to] of models[selected].edges) {
    const a = stages.querySelector(`[data-stage="${from}"]`).getBoundingClientRect();
    const b = stages.querySelector(`[data-stage="${to}"]`).getBoundingClientRect();
    const x1 = vertical ? a.right - base.left : a.right - base.left - 10;
    const y1 = vertical ? a.top + a.height / 2 - base.top : a.top + a.height * .40 - base.top;
    const x2 = vertical ? b.right - base.left : b.left - base.left + 10;
    const y2 = vertical ? b.top + b.height / 2 - base.top : b.top + b.height * .40 - base.top;
    const d = vertical ? `M${x1},${y1} H${base.width - 4} V${y2} H${x2}` : `M${x1},${y1} C${(x1 + x2) / 2},${y1} ${(x1 + x2) / 2},${y2} ${x2},${y2}`;
    connections.insertAdjacentHTML('beforeend', `<g data-from="${from}" data-to="${to}"><path class="wire" d="${d}" marker-end="url(#arrow)"/><path class="flow" d="${d}"/></g>`);
  }
  showStage(selectedStage);
}
function renderProjectMetrics(model) {
  projectMetricsSummary.textContent = `${model.name} project metrics are selected.`;
  projectMetrics.innerHTML = model.metrics.map(item => `<article class="metric-card"><strong>${item.value}</strong><span>${item.label}</span><p>${item.context}</p></article>`).join('');
  projectMetrics.classList.remove('is-refreshing');
  void projectMetrics.offsetWidth;
  projectMetrics.classList.add('is-refreshing');
}
function selectProject(key, fromCard = false, stageId) {
  if (!models[key]) return;
  selected = key;
  renderedPath = '';
  const model = models[key];
  scene.dataset.project = key;
  document.querySelectorAll('[data-select]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.select === key)));
  document.querySelectorAll('[data-project]').forEach(card => card.classList.toggle('is-selected', card.dataset.project === key));
  stages.innerHTML = model.nodes.map((node, index) => `<button class="stage" data-stage="${node.id}" style="--x:${node.x}%;--y:${node.y}%;--delay:${index * 65}ms" aria-pressed="false">${sculpture(node.kind)}<span class="stage-title">${node.title}</span><span class="stage-caption">${node.caption}</span></button>`).join('');
  stages.querySelectorAll('button').forEach(button => button.addEventListener('click', () => showStage(button.dataset.stage)));
  document.querySelector('#deployment-note').textContent = model.evidence;
  document.querySelector('#architecture-source').href = `https://github.com/jayanthpjh/data-engineering-projects/tree/main/${model.slug}`;
  renderProjectMetrics(model);
  const initial = model.nodes.some(node => node.id === stageId) ? stageId : model.nodes[0].id;
  showStage(initial);
  drawConnections();
  if (fromCard) {
    document.querySelector(`.project-switch [data-select="${key}"]`).focus({ preventScroll: true });
    document.querySelector('#architecture').scrollIntoView({ behavior: motion(), block: 'start' });
  }
}
document.querySelectorAll('[data-select]').forEach(button => button.addEventListener('click', () => selectProject(button.dataset.select, button.classList.contains('architecture-action'))));
stagePrev.addEventListener('click', () => moveStage(-1));
stageNext.addEventListener('click', () => moveStage(1));
function moveFromKeys(event) {
  const forward = event.key === 'ArrowRight' || event.key === 'ArrowDown';
  const backward = event.key === 'ArrowLeft' || event.key === 'ArrowUp';
  if (!forward && !backward && event.key !== 'Home' && event.key !== 'End') return;
  const buttons = [...stages.querySelectorAll('button')];
  const index = buttons.findIndex(button => button.dataset.stage === selectedStage);
  let nextIndex = index;
  if (event.key === 'Home') nextIndex = 0;
  else if (event.key === 'End') nextIndex = buttons.length - 1;
  else nextIndex = index + (forward ? 1 : -1);
  const next = buttons[nextIndex];
  if (!next) return;
  event.preventDefault();
  showStage(next.dataset.stage);
  const chip = pathRail.querySelector(`[data-stage-jump="${CSS.escape(next.dataset.stage)}"]`);
  if (event.currentTarget === pathRail && chip) chip.focus();
  else next.focus({ preventScroll: true });
}
stages.addEventListener('keydown', moveFromKeys);
pathRail.addEventListener('keydown', moveFromKeys);
pathRail.addEventListener('click', event => {
  const chip = event.target.closest('[data-stage-jump]');
  if (!chip) return;
  const id = chip.dataset.stageJump;
  showStage(id);
  pathRail.querySelector(`[data-stage-jump="${CSS.escape(id)}"]`)?.focus();
});
new ResizeObserver(drawConnections).observe(scene);
selectProject('gcp');
document.fonts.ready.then(drawConnections);
document.querySelectorAll('.project-card').forEach((card, index) => card.insertAdjacentHTML('afterbegin', `<div class="project-art" aria-hidden="true">${sculpture(['storage', 'compute', 'lake'][index])}<span>${['BATCH / ORCHESTRATE', 'STREAM / MERGE', 'RESCUE / VALIDATE'][index]}</span></div>`));
const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('revealed'); observer.unobserve(entry.target); }
}), { threshold: .08 });
document.querySelectorAll('.mission-card,.method-grid article,.project-card,.metric-card,.about-grid,.contact-grid').forEach(element => { element.classList.add('reveal'); observer.observe(element); });
document.querySelector('#year').textContent = new Date().getFullYear();

const progress = document.querySelector('#scroll-progress');
const syncProgress = () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
};
addEventListener('scroll', syncProgress, { passive: true });
addEventListener('resize', syncProgress);
syncProgress();

const navLinks = [...document.querySelectorAll('.nav a')];
const sectionSpy = new IntersectionObserver(entries => {
  const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  for (const link of navLinks) {
    if (link.getAttribute('href') === `#${visible.target.id}`) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  }
}, { rootMargin: '-20% 0px -55% 0px', threshold: [0.15, 0.4, 0.6] });
navLinks.forEach(link => {
  const section = document.querySelector(link.getAttribute('href'));
  if (section) sectionSpy.observe(section);
});

const roleSwitch = document.querySelector('.role-switch');
const experienceGrid = document.querySelector('.experience-grid');
roleSwitch.addEventListener('click', event => {
  const button = event.target.closest('[data-focus-role]');
  if (!button) return;
  const role = button.dataset.focusRole;
  roleSwitch.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  experienceGrid.classList.toggle('is-filtered', role !== 'all');
  experienceGrid.querySelectorAll('.mission-card').forEach(card => card.classList.toggle('is-focused', role !== 'all' && card.dataset.role === role));
  if (role === 'all') return;
  experienceGrid.querySelector(`[data-role="${role}"]`)?.scrollIntoView({ behavior: motion(), block: 'nearest' });
});

function commandItems() {
  const items = [
    ['Sections', 'Architecture explorer', 'Top of the page', () => document.querySelector('#architecture').scrollIntoView({ behavior: motion(), block: 'start' })],
    ['Sections', 'Project builds', 'Three clouds', () => document.querySelector('#projects').scrollIntoView({ behavior: motion(), block: 'start' })],
    ['Sections', 'Experience', 'Career evidence', () => document.querySelector('#experience').scrollIntoView({ behavior: motion(), block: 'start' })],
    ['Sections', 'Delivery method', 'Four steps', () => document.querySelector('#method').scrollIntoView({ behavior: motion(), block: 'start' })],
    ['Sections', 'About', 'Columbus, Ohio', () => document.querySelector('#about').scrollIntoView({ behavior: motion(), block: 'start' })],
    ['Sections', 'Contact', 'Email and résumé', () => document.querySelector('#contact').scrollIntoView({ behavior: motion(), block: 'start' })]
  ];
  for (const key of ['gcp', 'aws', 'azure']) {
    const model = models[key];
    items.push(['Projects', model.name, 'Open this architecture', () => selectProject(key, true)]);
    for (const node of model.nodes) {
      items.push(['Stages', node.title, model.name, () => {
        selectProject(key, false, node.id);
        document.querySelector('#architecture').scrollIntoView({ behavior: motion(), block: 'start' });
        stages.querySelector(`[data-stage="${node.id}"]`)?.focus({ preventScroll: true });
      }]);
    }
  }
  return items.map(([group, label, hint, run]) => ({ group, label, hint, run }));
}
function setActiveCommand(index) {
  const options = [...commandList.querySelectorAll('[role="option"]')];
  if (!options.length) {
    commandInput.removeAttribute('aria-activedescendant');
    return;
  }
  const next = options[(index + options.length) % options.length];
  options.forEach(option => {
    const on = option === next;
    option.classList.toggle('is-active', on);
    option.setAttribute('aria-selected', String(on));
  });
  commandInput.setAttribute('aria-activedescendant', next.id);
  next.scrollIntoView({ block: 'nearest' });
}
function renderCommands(query) {
  const needle = query.trim().toLowerCase();
  const items = commandItems().filter(item => `${item.group} ${item.label} ${item.hint}`.toLowerCase().includes(needle));
  commandList.replaceChildren();
  if (!items.length) {
    const empty = document.createElement('p');
    empty.className = 'command-empty';
    empty.textContent = 'No matches. Try a project, stage, or section name.';
    commandList.append(empty);
    commandInput.removeAttribute('aria-activedescendant');
    return;
  }
  let group = '';
  items.forEach((item, index) => {
    if (item.group !== group) {
      group = item.group;
      const label = document.createElement('p');
      label.className = 'command-group';
      label.textContent = group;
      commandList.append(label);
    }
    const option = document.createElement('button');
    option.type = 'button';
    option.className = 'command-option';
    option.id = `command-option-${index}`;
    option.setAttribute('role', 'option');
    const name = document.createElement('span');
    name.textContent = item.label;
    const hint = document.createElement('small');
    hint.textContent = item.hint;
    option.append(name, hint);
    option.addEventListener('click', () => {
      commandDialog.close();
      item.run();
    });
    commandList.append(option);
  });
  setActiveCommand(0);
}
function openPalette() {
  commandInput.value = '';
  renderCommands('');
  commandInput.setAttribute('aria-expanded', 'true');
  if (!commandDialog.open) commandDialog.showModal();
  commandInput.focus();
}
document.querySelector('#command-open').addEventListener('click', openPalette);
commandInput.addEventListener('input', () => renderCommands(commandInput.value));
commandDialog.addEventListener('close', () => commandInput.setAttribute('aria-expanded', 'false'));
commandDialog.addEventListener('click', event => {
  if (event.target === commandDialog) commandDialog.close();
});
commandDialog.addEventListener('keydown', event => {
  const options = [...commandList.querySelectorAll('[role="option"]')];
  const index = options.findIndex(option => option.classList.contains('is-active'));
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    setActiveCommand(index + (event.key === 'ArrowDown' ? 1 : -1));
  }
  if (event.key === 'Enter' && event.target === commandInput) {
    event.preventDefault();
    options[index]?.click();
  }
});
addEventListener('keydown', event => {
  const toggle = (event.key === 'k' || event.key === 'K') && (event.metaKey || event.ctrlKey);
  if (toggle) {
    event.preventDefault();
    if (commandDialog.open) commandDialog.close();
    else openPalette();
    return;
  }
  if (commandDialog.open || event.target.closest('input, textarea') || event.metaKey || event.ctrlKey || event.altKey) return;
  if (event.key === 'k' || event.key === '/') {
    event.preventDefault();
    openPalette();
  }
});

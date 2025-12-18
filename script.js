// =========================
// Luxury Data Portfolio JS
// =========================

const EMAIL = "pasupuletij398@gmail.com"; // <-- change here if needed
const RESUME_LINK = "assets/Jayanth_Pasupuleti_Resume.pdf"; // <-- drop your PDF into /assets

// Optional: add repo/demo links to projects here (will convert titles into clickable links).
// Keys must match the project title text exactly.
const PROJECT_LINKS = {
  // "Real‑Time Insurance Analytics on GCP": "https://github.com/yourname/yourrepo",
};

const qs = (sel, el=document) => el.querySelector(sel);
const qsa = (sel, el=document) => [...el.querySelectorAll(sel)];

/* ---------- Theme (system + toggle) ---------- */
const THEME_KEY = "jp_theme"; // localStorage key
const root = document.documentElement;
const mql = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

function getStoredTheme(){
  const t = localStorage.getItem(THEME_KEY);
  if(t === "light" || t === "dark" || t === "system") return t;
  return null;
}

function resolvedSystemTheme(){
  return (mql && mql.matches) ? "dark" : "light";
}

function applyTheme(mode){
  // mode: 'light' | 'dark' | 'system'
  if(mode === "system" || !mode){
    root.removeAttribute("data-theme");
  }else{
    root.setAttribute("data-theme", mode);
  }
  updateThemeUI();
}

function setTheme(mode){
  if(mode === "system"){
    localStorage.setItem(THEME_KEY, "system");
  }else{
    localStorage.setItem(THEME_KEY, mode);
  }
  applyTheme(mode);
}

function currentResolvedTheme(){
  const explicit = root.getAttribute("data-theme");
  return explicit ? explicit : resolvedSystemTheme();
}

function updateThemeUI(){
  const btn1 = qs("#themeToggle");
  const btn2 = qs("#themeToggle2");
  const theme = currentResolvedTheme();
  const iconHtml = theme === "dark"
    ? '<i class="fa-regular fa-sun" aria-hidden="true"></i>'
    : '<i class="fa-regular fa-moon" aria-hidden="true"></i>';

  if(btn1) btn1.innerHTML = iconHtml;
  if(btn2) btn2.innerHTML = iconHtml + " Theme";

  // Update address bar theme-color on supported browsers
  const metaLight = document.querySelector('meta[name="theme-color"][media="(prefers-color-scheme: light)"]');
  const metaDark = document.querySelector('meta[name="theme-color"][media="(prefers-color-scheme: dark)"]');
  if(metaLight) metaLight.content = "#f6f8ff";
  if(metaDark) metaDark.content = "#0b0d12";
}

(function initTheme(){
  const stored = getStoredTheme();
  if(stored){
    applyTheme(stored);
  }else{
    // default: follow system
    applyTheme("system");
  }
  if(mql){
    // live update when using system mode
    mql.addEventListener?.("change", () => {
      const storedNow = getStoredTheme();
      if(!storedNow || storedNow === "system"){
        updateThemeUI();
      }
    });
  }

  const toggle = () => {
    const storedNow = getStoredTheme();
    const resolved = currentResolvedTheme();
    // If user was in system mode, first toggle sets explicit opposite of current
    const next = resolved === "dark" ? "light" : "dark";
    setTheme(next);
  };

  qs("#themeToggle")?.addEventListener("click", toggle);
  qs("#themeToggle2")?.addEventListener("click", toggle);

  // Optional: Alt-click switches back to system
  const setSystem = (e) => {
    if(e.altKey){
      setTheme("system");
      showToast("Theme: system");
    }
  };
  qs("#themeToggle")?.addEventListener("click", setSystem);
  qs("#themeToggle2")?.addEventListener("click", setSystem);
})();

/* ---------- Mobile menu ---------- */
const drawer = qs("#drawer");
const burger = qs("#burger");
const closeDrawer = qs("#closeDrawer");
const backdrop = qs("#backdrop");

function openDrawer(){
  drawer.hidden = false;
  drawer.classList.add("is-open");
  burger.setAttribute("aria-expanded","true");
  document.body.style.overflow = "hidden";
}
function closeDrawerFn(){
  drawer.hidden = true;
  drawer.classList.remove("is-open");
  burger.setAttribute("aria-expanded","false");
  document.body.style.overflow = "";
}

burger?.addEventListener("click", openDrawer);
closeDrawer?.addEventListener("click", closeDrawerFn);
backdrop?.addEventListener("click", closeDrawerFn);
qsa(".drawer__link").forEach(a => a.addEventListener("click", closeDrawerFn));

/* ---------- Smooth scroll for in-page anchors ---------- */
function smoothScrollTo(hash){
  const id = (hash || "").replace("#","");
  if(!id) return;
  const el = qs("#"+CSS.escape(id));
  if(!el) return;
  el.scrollIntoView({behavior:"smooth", block:"start"});
}

qsa('a[href^="#"]').forEach(a => {
  a.addEventListener("click", (e) => {
    const href = a.getAttribute("href");
    if(!href || href === "#") return;
    const target = qs(href);
    if(!target) return;
    e.preventDefault();
    closeDrawerFn?.(); // close mobile menu if open
    history.pushState(null, "", href);
    smoothScrollTo(href);
  });
});


/* Drawer styles via JS (so we keep HTML clean) */
if(drawer){
  const style = document.createElement("style");
  style.textContent = `
    .drawer{ position:fixed; inset:0; z-index:1200; display:grid; place-items:end; }
    .drawer__backdrop{ position:absolute; inset:0; background: rgba(0,0,0,.55); border:0; cursor:pointer; }
    .drawer__panel{
      position:relative;
      width:min(420px, 92vw);
      height:100%;
      background: rgba(7,8,18,.92);
      border-left: 1px solid rgba(255,255,255,.10);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      padding: 18px;
      box-shadow: 0 18px 60px rgba(0,0,0,.65);
      transform: translateX(110%);
      transition: transform .28s ease;
    }
    .drawer.is-open .drawer__panel{ transform: translateX(0); }
    .drawer__head{ display:flex; align-items:center; justify-content:space-between; }
    .drawer__title{ font-weight:900; letter-spacing:.2px; }
    .drawer__links{ display:grid; gap:10px; margin:18px 0; }
    .drawer__link{
      color: rgba(255,255,255,.86);
      text-decoration:none;
      padding: 12px 12px;
      border-radius: 16px;
      border:1px solid rgba(255,255,255,.10);
      background: rgba(255,255,255,.04);
      font-weight:800;
    }
    .drawer__link:hover{ border-color: rgba(247,216,138,.22); }
    .drawer__actions{ display:flex; gap:10px; flex-wrap:wrap; margin-top: 10px; }
  `;
  document.head.appendChild(style);
}

/* ---------- Smooth active nav highlight ---------- */
const sections = ["about","skills","experience","projects","contact"].map(id => qs("#"+id)).filter(Boolean);
const navLinks = qsa(".nav__link");

const spy = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if(!e.isIntersecting) return;
    const id = e.target.id;
    navLinks.forEach(a => a.classList.toggle("is-active", a.getAttribute("href") === "#"+id));
  });
}, { root: null, threshold: 0.35 });

sections.forEach(s => spy.observe(s));

/* ---------- Reveal on scroll ---------- */
const revealEls = qsa(".reveal");
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if(e.isIntersecting){
      e.target.classList.add("is-visible");
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObs.observe(el));

/* ---------- Counters ---------- */
function pretty(n){
  const num = Number(n);
  if(num >= 1_000_000) return (num/1_000_000).toFixed(0) + "M";
  if(num >= 1_000) return (num/1_000).toFixed(0) + "K";
  return String(num);
}
function animateCount(el){
  const target = Number(el.dataset.count || "0");
  const duration = 1100;
  const start = performance.now();
  const from = 0;
  function tick(t){
    const p = Math.min(1, (t - start) / duration);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = Math.floor(from + (target - from) * eased);
    el.textContent = pretty(val);
    if(p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const countEls = qsa("[data-count]");
const countObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if(e.isIntersecting){
      animateCount(e.target);
      countObs.unobserve(e.target);
    }
  });
},{ threshold: 0.6 });
countEls.forEach(el => countObs.observe(el));

/* ---------- Copy email + toast ---------- */
const toast = qs("#toast");
const toastText = qs("#toastText");

async function copyEmail(){
  try{
    await navigator.clipboard.writeText(EMAIL);
    showToast("Email copied");
  }catch(err){
    // fallback
    const ta = document.createElement("textarea");
    ta.value = EMAIL;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
    showToast("Email copied");
  }
}
function showToast(msg){
  if(!toast) return;
  toastText.textContent = msg;
  toast.hidden = false;
  toast.style.opacity = "0";
  toast.style.transform = "translateX(-50%) translateY(10px)";
  requestAnimationFrame(() => {
    toast.style.transition = "opacity .22s ease, transform .22s ease";
    toast.style.opacity = "1";
    toast.style.transform = "translateX(-50%) translateY(0)";
  });
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(10px)";
    setTimeout(()=> toast.hidden = true, 230);
  }, 1400);
}
qs("#copyEmail")?.addEventListener("click", copyEmail);
qs("#copyEmail2")?.addEventListener("click", copyEmail);

/* ---------- Contact form (mailto) ---------- */
qs("#contactForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const name = (fd.get("name") || "").toString().trim();
  const email = (fd.get("email") || "").toString().trim();
  const message = (fd.get("message") || "").toString().trim();

  const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
  const body = encodeURIComponent(
    `Hi Jayanth,\n\n${message}\n\n— ${name}\n${email}`
  );

  window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
});

/* ---------- Progress bar ---------- */
const progressBar = qs("#progressBar");
function updateProgress(){
  if(!progressBar) return;
  const doc = document.documentElement;
  const scrollTop = doc.scrollTop || document.body.scrollTop;
  const scrollHeight = doc.scrollHeight - doc.clientHeight;
  const pct = scrollHeight ? (scrollTop / scrollHeight) * 100 : 0;
  progressBar.style.width = pct.toFixed(2) + "%";
}
window.addEventListener("scroll", updateProgress, {passive:true});
updateProgress();

/* ---------- Footer year ---------- */
qs("#year").textContent = new Date().getFullYear();

/* ---------- Convert project titles to links (optional) ---------- */
qsa(".project").forEach(card => {
  const titleEl = card.querySelector(".project__title");
  if(!titleEl) return;
  const title = titleEl.textContent.trim();
  const link = PROJECT_LINKS[title];
  if(!link) return;

  const a = document.createElement("a");
  a.href = link;
  a.target = "_blank";
  a.rel = "noopener";
  a.className = "project__title";
  a.textContent = title;
  titleEl.replaceWith(a);
});

/* ---------- Stars canvas (lightweight) ---------- */
const canvas = qs("#stars");
if(canvas){
  const ctx = canvas.getContext("2d");
  let w=0,h=0,stars=[];
  const DPR = Math.min(2, window.devicePixelRatio || 1);

  function resize(){
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = Math.floor(w * DPR);
    canvas.height = Math.floor(h * DPR);
    ctx.setTransform(DPR,0,0,DPR,0,0);
    stars = Array.from({length: Math.floor((w*h)/18000)}, () => ({
      x: Math.random()*w,
      y: Math.random()*h,
      r: Math.random()*1.2 + 0.2,
      s: Math.random()*0.45 + 0.10,
      a: Math.random()*0.35 + 0.12
    }));
  }

  function draw(){
    ctx.clearRect(0,0,w,h);
    for(const st of stars){
      st.y += st.s;
      if(st.y > h) { st.y = -5; st.x = Math.random()*w; }
      ctx.beginPath();
      ctx.arc(st.x, st.y, st.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(247,216,138,${st.a})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener("resize", resize);
  draw();
}

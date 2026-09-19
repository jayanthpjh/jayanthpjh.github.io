const root = document.documentElement;
const themeButton = document.querySelector('#theme');
function applyTheme(theme) {
  root.dataset.theme = theme;
  themeButton.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
  document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#101c29' : '#edf1f5';
}
let savedTheme;
try { savedTheme = localStorage.getItem('jp_theme'); } catch { /* Storage is optional. */ }
applyTheme(savedTheme === 'dark' ? 'dark' : 'light');
themeButton.addEventListener('click', () => {
  const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(theme);
  try { localStorage.setItem('jp_theme', theme); } catch { /* Keep the current session usable. */ }
});
const email = 'pasupuletij398@gmail.com';
document.querySelector('#copy-email').addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  try {
    await navigator.clipboard.writeText(email);
    status.textContent = 'Email copied.';
  } catch {
    status.textContent = 'Please select the email address above to copy it.';
  }
});
document.querySelector('#contact-form').addEventListener('submit', event => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const subject = encodeURIComponent(`Portfolio inquiry from ${String(form.get('name')).trim()}`);
  const body = encodeURIComponent(`Hi Jayanth,\n\n${String(form.get('message')).trim()}\n\n${String(form.get('name')).trim()}\n${String(form.get('email')).trim()}`);
  window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
});
document.querySelector('#year').textContent = new Date().getFullYear();

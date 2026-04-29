export function initTheme() {
  const saved = localStorage.getItem('rabiprev_theme');
  const body = document.body;
  const toggleBtn = document.getElementById('themeToggle');
  if (saved === 'light') {
    body.classList.add('light-theme');
    toggleBtn.innerHTML = '☀️ Light';
  } else {
    body.classList.remove('light-theme');
    toggleBtn.innerHTML = '🌙 Dark';
  }
}

export function toggleTheme() {
  const body = document.body;
  const toggleBtn = document.getElementById('themeToggle');
  body.classList.toggle('light-theme');
  const isLight = body.classList.contains('light-theme');
  toggleBtn.innerHTML = isLight ? '☀️ Light' : '🌙 Dark';
  localStorage.setItem('rabiprev_theme', isLight ? 'light' : 'dark');
}
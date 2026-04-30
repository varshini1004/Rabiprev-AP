import { AP_CONTACTS } from './data/contacts.js';
import { CITY_TO_DISTRICT, EMERGENCY_GUIDE } from './data/guides.js';
import { renderContacts } from './components/cards.js';
import { renderGuide } from './components/guide.js';
import { initTheme, toggleTheme } from './components/theme.js';
import { calcProgress } from './utils/progress.js';

let currentCity = "Visakhapatnam";
let chipState = { ngo: true, vet: true, govt: true };
const allCities = Object.keys(CITY_TO_DISTRICT).sort();

const searchInput = document.getElementById('citySearch');
const citySelect = document.getElementById('citySelect');

function refreshUI() {
  renderContacts(currentCity, chipState);
  calcProgress();
  // Update select and input without triggering events
  citySelect.value = currentCity;
  searchInput.value = currentCity;
}

function setCity(city) {
  if (city && allCities.includes(city) && city !== currentCity) {
    currentCity = city;
    refreshUI();
  }
}

// Populate dropdown with all cities initially
citySelect.innerHTML = '';
allCities.forEach(city => {
  const opt = document.createElement('option');
  opt.value = city;
  opt.textContent = `${city} · ${CITY_TO_DISTRICT[city]}`;
  citySelect.appendChild(opt);
});
citySelect.value = currentCity;

// Search input: filter dropdown options based on typed text
searchInput.addEventListener('input', (e) => {
  const term = e.target.value.trim().toLowerCase();
  // Clear and rebuild dropdown options
  citySelect.innerHTML = '';
  const filtered = term === '' ? allCities : allCities.filter(city => city.toLowerCase().includes(term));
  filtered.forEach(city => {
    const opt = document.createElement('option');
    opt.value = city;
    opt.textContent = `${city} · ${CITY_TO_DISTRICT[city]}`;
    citySelect.appendChild(opt);
  });
  if (filtered.length === 1) {
    // If only one match, auto-select it
    setCity(filtered[0]);
  }
});

// When dropdown changes (user selects from filtered list)
citySelect.addEventListener('change', (e) => {
  setCity(e.target.value);
});

// On blur of search input, if current value doesn't match any city exactly, revert to current city
searchInput.addEventListener('blur', () => {
  const exactMatch = allCities.find(c => c.toLowerCase() === searchInput.value.trim().toLowerCase());
  if (!exactMatch) {
    searchInput.value = currentCity;
  } else if (exactMatch !== currentCity) {
    setCity(exactMatch);
  }
});

// Enter key on search input: act like blur
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    searchInput.blur();
  }
});

// Situation selector
document.getElementById('situationSelect').addEventListener('change', (e) => {
  renderGuide(e.target.value);
});

// Theme toggle
document.getElementById('themeToggle').addEventListener('click', toggleTheme);

// Chip toggles
document.getElementById('f-ngo').addEventListener('click', () => {
  chipState.ngo = !chipState.ngo;
  document.getElementById('f-ngo').classList.toggle('on', chipState.ngo);
  refreshUI();
});
document.getElementById('f-vet').addEventListener('click', () => {
  chipState.vet = !chipState.vet;
  document.getElementById('f-vet').classList.toggle('on', chipState.vet);
  refreshUI();
});
document.getElementById('f-govt').addEventListener('click', () => {
  chipState.govt = !chipState.govt;
  document.getElementById('f-govt').classList.toggle('on', chipState.govt);
  refreshUI();
});

initTheme();
refreshUI();
renderGuide('🩸 Injured Stray');

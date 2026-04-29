import { AP_CONTACTS } from './data/contacts.js';
import { CITY_TO_DISTRICT, EMERGENCY_GUIDE } from './data/guides.js';
import { renderContacts } from './components/cards.js';   // removed toggleCard
import { renderGuide } from './components/guide.js';
import { initTheme, toggleTheme } from './components/theme.js';
import { populateCityDropdown } from './utils/filters.js';
import { calcProgress } from './utils/progress.js';

let currentCity = "Visakhapatnam";
let chipState = { ngo: true, vet: true, govt: true };

function refreshUI() {
  renderContacts(currentCity, chipState);
  calcProgress();
}

// Populate city dropdown
const allCities = Object.keys(CITY_TO_DISTRICT);
const citySelect = document.getElementById('citySelect');
allCities.forEach(city => {
  const option = document.createElement('option');
  option.value = city;
  option.textContent = city;
  if (city === currentCity) option.selected = true;
  citySelect.appendChild(option);
});

citySelect.addEventListener('change', (e) => {
  currentCity = e.target.value;
  refreshUI();
});

document.getElementById('situationSelect').addEventListener('change', (e) => {
  renderGuide(e.target.value);
});

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

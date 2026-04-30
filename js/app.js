import { AP_CONTACTS } from './data/contacts.js';
import { CITY_TO_DISTRICT, EMERGENCY_GUIDE } from './data/guides.js';
import { renderContacts } from './components/cards.js';
import { renderGuide } from './components/guide.js';
import { initTheme, toggleTheme } from './components/theme.js';
import { calcProgress } from './utils/progress.js';

let currentCity = "Visakhapatnam";
let chipState = { ngo: true, vet: true, govt: true };
const allCities = Object.keys(CITY_TO_DISTRICT).sort();

const citySelect = document.getElementById('citySelect');

function refreshUI() {
  renderContacts(currentCity, chipState);
  calcProgress();
  // Update dropdown selection
  if (citySelect) {
    for (let i = 0; i < citySelect.options.length; i++) {
      if (citySelect.options[i].value === currentCity) {
        citySelect.selectedIndex = i;
        break;
      }
    }
  }
}

function setCity(city) {
  if (city && allCities.includes(city) && city !== currentCity) {
    currentCity = city;
    refreshUI();
  }
}

// Populate dropdown with all cities
citySelect.innerHTML = '';
allCities.forEach(city => {
  const opt = document.createElement('option');
  opt.value = city;
  opt.textContent = `${city} · ${CITY_TO_DISTRICT[city]}`;
  citySelect.appendChild(opt);
});
citySelect.value = currentCity;

// Dropdown change event
citySelect.addEventListener('change', (e) => {
  setCity(e.target.value);
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

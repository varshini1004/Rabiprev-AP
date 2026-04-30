import { AP_CONTACTS } from './data/contacts.js';
import { CITY_TO_DISTRICT, EMERGENCY_GUIDE } from './data/guides.js';
import { renderContacts } from './components/cards.js';
import { renderGuide } from './components/guide.js';
import { initTheme, toggleTheme } from './components/theme.js';
import { populateCityDropdown } from './utils/filters.js';
import { calcProgress } from './utils/progress.js';

let currentCity = "Visakhapatnam";
let chipState = { ngo: true, vet: true, govt: true };
const allCities = Object.keys(CITY_TO_DISTRICT).sort();

function refreshUI() {
  renderContacts(currentCity, chipState);
  calcProgress();
}

function handleCityChange(city) {
  currentCity = city;
  refreshUI();
  // Sync dropdown
  const select = document.getElementById('citySelect');
  if (select) {
    Array.from(select.options).forEach(opt => {
      if (opt.value === city) opt.selected = true;
    });
  }
  // Sync search input
  const searchInput = document.getElementById('citySearch');
  if (searchInput) searchInput.value = city;
}

// Populate initial dropdown
const citySelect = document.getElementById('citySelect');
populateCityDropdown(citySelect, allCities, currentCity);

// Dropdown change
citySelect.addEventListener('change', (e) => {
  handleCityChange(e.target.value);
});

// Search input: filter dropdown and auto‑select if one match
const searchInput = document.getElementById('citySearch');
searchInput.addEventListener('input', (e) => {
  const term = e.target.value.trim().toLowerCase();
  if (term === '') {
    // Reset to full list, keep current city selected
    populateCityDropdown(citySelect, allCities, currentCity);
    return;
  }
  const filtered = allCities.filter(c => c.toLowerCase().includes(term));
  populateCityDropdown(citySelect, filtered, currentCity);
  if (filtered.length === 1) {
    handleCityChange(filtered[0]);
  }
});
// On blur, if the field doesn't match a city, revert to current city
searchInput.addEventListener('blur', () => {
  const term = searchInput.value.trim();
  const match = allCities.find(c => c.toLowerCase() === term.toLowerCase());
  if (!match && term !== '') {
    searchInput.value = currentCity;
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

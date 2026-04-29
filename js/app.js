import { AP_CONTACTS } from './data/contacts.js';
import { CITY_TO_DISTRICT, EMERGENCY_GUIDE } from './data/guides.js';
import { renderContacts, toggleCard } from './components/cards.js';
import { renderGuide } from './components/guide.js';
import { initTheme, toggleTheme } from './components/theme.js';
import { populateCityDropdown, filterCities, onCityChange } from './utils/filters.js';
import { calcProgress } from './utils/progress.js';

// State
let allCities = Object.keys(CITY_TO_DISTRICT).sort();
let currentCity = "Visakhapatnam";
let chipState = { ngo: true, vet: true, govt: true };

// DOM elements
const citySelect = document.getElementById('citySelect');
const citySearch = document.getElementById('citySearch');
const situationSelect = document.getElementById('situationSelect');
const themeToggleBtn = document.getElementById('themeToggle');
const chipNgo = document.getElementById('f-ngo');
const chipVet = document.getElementById('f-vet');
const chipGovt = document.getElementById('f-govt');

// Helper to re-render everything that depends on state
function refreshUI() {
  renderContacts(currentCity, chipState);
  calcProgress();
}

// City change handler
function handleCityChange(city) {
  currentCity = city;
  refreshUI();
}

// Chip toggle handler
function handleChipToggle(key, element) {
  chipState[key] = !chipState[key];
  element.classList.toggle('on', chipState[key]);
  refreshUI();
}

// Event listeners
citySelect.addEventListener('change', (e) => handleCityChange(e.target.value));
citySearch.addEventListener('input', (e) => {
  const filtered = allCities.filter(c => c.toLowerCase().includes(e.target.value.trim().toLowerCase()));
  populateCityDropdown(citySelect, filtered, currentCity);
  if (filtered.length) handleCityChange(filtered[0]);
});
situationSelect.addEventListener('change', (e) => renderGuide(e.target.value));
themeToggleBtn.addEventListener('click', toggleTheme);
chipNgo.addEventListener('click', () => handleChipToggle('ngo', chipNgo));
chipVet.addEventListener('click', () => handleChipToggle('vet', chipVet));
chipGovt.addEventListener('click', () => handleChipToggle('govt', chipGovt));

// Initialization
function init() {
  initTheme();
  populateCityDropdown(citySelect, allCities, currentCity);
  refreshUI();
  renderGuide('🩸 Injured Stray');
}
init();
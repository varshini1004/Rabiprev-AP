import { AP_CONTACTS } from './data/contacts.js';
import { CITY_TO_DISTRICT, EMERGENCY_GUIDE } from './data/guides.js';
import { renderContacts } from './components/cards.js';
import { renderGuide } from './components/guide.js';
import { initTheme, toggleTheme } from './components/theme.js';
import { calcProgress } from './utils/progress.js';

let currentCity = "Visakhapatnam";
let chipState = { ngo: true, vet: true, govt: true };
const allCities = Object.keys(CITY_TO_DISTRICT).sort();

// DOM elements
const searchInput = document.getElementById('citySearch');
const citySelect = document.getElementById('citySelect');

// Flags to avoid recursion
let updatingFromSearch = false;
let updatingFromDropdown = false;

function refreshUI() {
  renderContacts(currentCity, chipState);
  calcProgress();
  
  // Update dropdown without triggering change event
  if (citySelect && !updatingFromDropdown) {
    updatingFromDropdown = true;
    Array.from(citySelect.options).forEach(opt => {
      if (opt.value === currentCity) opt.selected = true;
    });
    updatingFromDropdown = false;
  }
  
  // Update search input WITHOUT TRIGGERING INPUT EVENT
  if (searchInput && !updatingFromSearch) {
    updatingFromSearch = true;
    if (searchInput.value !== currentCity) {
      searchInput.value = currentCity;
    }
    updatingFromSearch = false;
  }
}

function setCity(city) {
  if (city && allCities.includes(city) && city !== currentCity) {
    currentCity = city;
    refreshUI();
  }
}

function populateDropdown(filteredCities, selectedCity) {
  if (!citySelect) return;
  const oldValue = citySelect.value;
  citySelect.innerHTML = '';
  filteredCities.forEach(city => {
    const option = document.createElement('option');
    option.value = city;
    option.textContent = `${city} · ${CITY_TO_DISTRICT[city]}`;
    if (city === selectedCity) option.selected = true;
    citySelect.appendChild(option);
  });
}

// Initial population
populateDropdown(allCities, currentCity);
refreshUI();

// Dropdown change
citySelect.addEventListener('change', (e) => {
  if (updatingFromDropdown) return;
  setCity(e.target.value);
});

// Search input: user types -> filter dropdown, but do NOT change city automatically
searchInput.addEventListener('input', (e) => {
  if (updatingFromSearch) return;
  const term = e.target.value.trim().toLowerCase();
  if (term === '') {
    populateDropdown(allCities, currentCity);
    return;
  }
  const filtered = allCities.filter(city => city.toLowerCase().includes(term));
  populateDropdown(filtered, currentCity);
});

// Blur: if exact match found, change city, otherwise revert
searchInput.addEventListener('blur', () => {
  const term = searchInput.value.trim();
  const exactMatch = allCities.find(c => c.toLowerCase() === term.toLowerCase());
  if (exactMatch) {
    setCity(exactMatch);
  } else if (term !== '') {
    searchInput.value = currentCity;
  }
});

// Enter key: same as blur
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    const term = searchInput.value.trim();
    const exactMatch = allCities.find(c => c.toLowerCase() === term.toLowerCase());
    if (exactMatch) {
      setCity(exactMatch);
    } else {
      searchInput.value = currentCity;
    }
  }
});

// Situation dropdown
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

import { AP_CONTACTS } from './data/contacts.js';
import { CITY_TO_DISTRICT, EMERGENCY_GUIDE } from './data/guides.js';
import { renderContacts } from './components/cards.js';
import { renderGuide } from './components/guide.js';
import { initTheme, toggleTheme } from './components/theme.js';
import { calcProgress } from './utils/progress.js';

let currentCity = "Visakhapatnam";
let chipState = { ngo: true, vet: true, govt: true };
const allCities = Object.keys(CITY_TO_DISTRICT).sort();

// Helper to refresh everything
function refreshUI() {
  renderContacts(currentCity, chipState);
  calcProgress();
  // Also update search input value to current city
  const searchInput = document.getElementById('citySearch');
  if (searchInput) searchInput.value = currentCity;
  // Update dropdown selection
  const citySelect = document.getElementById('citySelect');
  if (citySelect) {
    Array.from(citySelect.options).forEach(opt => {
      if (opt.value === currentCity) opt.selected = true;
    });
  }
  console.log('Current city set to:', currentCity);
}

// Change city
function setCity(city) {
  if (city && allCities.includes(city)) {
    currentCity = city;
    refreshUI();
  } else {
    console.warn('Invalid city:', city);
  }
}

// Populate dropdown with filtered list
function populateDropdown(filteredCities, selectedCity) {
  const select = document.getElementById('citySelect');
  if (!select) return;
  select.innerHTML = '';
  filteredCities.forEach(city => {
    const option = document.createElement('option');
    option.value = city;
    option.textContent = `${city} · ${CITY_TO_DISTRICT[city]}`;
    if (city === selectedCity) option.selected = true;
    select.appendChild(option);
  });
}

// Initial dropdown (all cities)
populateDropdown(allCities, currentCity);

// Dropdown change event
const citySelect = document.getElementById('citySelect');
citySelect.addEventListener('change', (e) => {
  setCity(e.target.value);
});

// Search input: filter dropdown as user types
const searchInput = document.getElementById('citySearch');
searchInput.addEventListener('input', (e) => {
  const term = e.target.value.trim().toLowerCase();
  if (term === '') {
    populateDropdown(allCities, currentCity);
    return;
  }
  const filtered = allCities.filter(city => city.toLowerCase().includes(term));
  populateDropdown(filtered, currentCity);
  
  // If exactly one match remains, auto-select it
  if (filtered.length === 1) {
    setCity(filtered[0]);
  }
});

// If user leaves search field with text that doesn't match any city, revert to current city
searchInput.addEventListener('blur', () => {
  const term = searchInput.value.trim();
  const exactMatch = allCities.find(c => c.toLowerCase() === term.toLowerCase());
  if (!exactMatch && term !== '') {
    searchInput.value = currentCity;
  } else if (exactMatch && exactMatch !== currentCity) {
    setCity(exactMatch);
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

// Initialize theme and first render
initTheme();
refreshUI();
renderGuide('🩸 Injured Stray');

// Also ensure search input starts with current city
searchInput.value = currentCity;

import { CITY_TO_DISTRICT } from '../data/guides.js';

export function populateCityDropdown(selectElement, cities, currentCity) {
  selectElement.innerHTML = '';
  cities.forEach(city => {
    const opt = document.createElement('option');
    opt.value = city;
    opt.textContent = `${city} · ${CITY_TO_DISTRICT[city]}`;
    if (city === currentCity) opt.selected = true;
    selectElement.appendChild(opt);
  });
}

export function filterCities(searchTerm, allCities, onCityChangeCallback) {
  const filtered = allCities.filter(c => c.toLowerCase().includes(searchTerm.trim().toLowerCase()));
  const select = document.getElementById('citySelect');
  populateCityDropdown(select, filtered, filtered[0] || '');
  if (filtered.length) onCityChangeCallback(filtered[0]);
}

export function onCityChange(city, updateCallback) {
  updateCallback(city);
}
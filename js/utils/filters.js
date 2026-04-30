import { CITY_TO_DISTRICT } from '../data/guides.js';

export function populateCityDropdown(selectElement, cities, currentCity) {
  selectElement.innerHTML = '';
  cities.forEach(city => {
    const option = document.createElement('option');
    option.value = city;
    option.textContent = `${city} · ${CITY_TO_DISTRICT[city]}`;
    if (city === currentCity) option.selected = true;
    selectElement.appendChild(option);
  });
}

export function filterCities(searchTerm, allCities, onCityChangeCallback, currentCity) {
  const filtered = allCities.filter(c => c.toLowerCase().includes(searchTerm.trim().toLowerCase()));
  const select = document.getElementById('citySelect');
  populateCityDropdown(select, filtered, currentCity);
  if (filtered.length === 1) {
    onCityChangeCallback(filtered[0]);
  }
}

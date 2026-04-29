import { AP_CONTACTS } from '../data/contacts.js';
import { CITY_TO_DISTRICT } from '../data/guides.js';

// Improved toggle card with JavaScript fallback for smooth expansion
function handleCardClick(event) {
  const card = event.currentTarget;
  const details = card.querySelector('.cdet');
  if (card.classList.contains('open')) {
    card.classList.remove('open');
    if (details) details.style.maxHeight = null;
  } else {
    card.classList.add('open');
    if (details) details.style.maxHeight = details.scrollHeight + 'px';
  }
}

export function renderContacts(currentCity, chipState) {
  const dist = CITY_TO_DISTRICT[currentCity];
  const data = AP_CONTACTS[dist];
  const container = document.getElementById('contactsCol');
  
  if (!data) {
    container.innerHTML = '<div style="padding:2rem;text-align:center;">⚠️ No data for this city.</div>';
    return;
  }

  // Filter based on chip state
  const typeMap = { 
    ngo: chipState.ngo, 
    vet: chipState.vet, 
    hospital: chipState.vet, 
    clinic: chipState.vet, 
    municipal: chipState.govt, 
    government: chipState.govt 
  };
  
  let contacts = data.contacts.filter(c => typeMap[(c.type || '').toLowerCase()] !== false);
  contacts.sort((a, b) => (b.emergency - a.emergency) || (b.verified - a.verified));

  // Build HTML
  let html = `
    <div class="ch">
      <div class="cnb">${currentCity}</div>
      <div class="cd">📍 ${dist}</div>
      <div class="chq">HQ: ${data.hq}</div>
    </div>
    <div class="sh">
      <div class="sn">📞 1962</div>
      <div class="st">
        <h3>AP Govt Vet Ambulance — CALL FIRST</h3>
        <p>24h · FREE · 340 ambulances statewide</p>
      </div>
    </div>
    <div class="notice">💡 ${data.emergency_note || data.note}</div>
    <div class="sl">CONTACTS — TAP TO EXPAND + MAP</div>
    <div class="cl">
  `;

  contacts.forEach(c => {
    const typeClass = 't-' + (c.type || '').toLowerCase().replace(/\s/g, '-');
    const primaryPhone = Array.isArray(c.phone) ? c.phone[0] : c.phone;
    const phoneHtml = primaryPhone ? `<a class="cph" href="tel:${primaryPhone.replace(/\s/g, '')}" onclick="event.stopPropagation()">${primaryPhone}</a>` : '';
    const servicesHtml = (c.services || []).map(s => `<span class="stag">${s}</span>`).join('');
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.address)}`;
    const addressLine = `
      <div class="dr">
        <div class="di">📍</div>
        <div style="flex:1;">${c.address}</div>
        <a href="${mapUrl}" target="_blank" class="map-action" onclick="event.stopPropagation()">
          <i class="fas fa-map-marked-alt"></i> Map
        </a>
      </div>
    `;
    
    html += `
      <div class="cc ${typeClass}">
        <div class="cr">
          <div class="td"></div>
          <div class="cm">
            <div class="cname">${c.name}</div>
            <div class="ctype">${c.type} · ${c.hours || ''}</div>
          </div>
          ${phoneHtml}
          <div class="chev">▾</div>
        </div>
        <div class="cdet">
          <div class="cdeti">
            ${addressLine}
            <div class="sm">${servicesHtml}</div>
          </div>
        </div>
      </div>
    `;
  });

  html += `</div>`;
  container.innerHTML = html;

  // Attach click events using the improved handler
  document.querySelectorAll('.cc').forEach(card => {
    card.removeEventListener('click', handleCardClick);
    card.addEventListener('click', handleCardClick);
  });

  // Prevent map link from toggling the card
  document.querySelectorAll('.map-action').forEach(btn => {
    btn.removeEventListener('click', (e) => e.stopPropagation());
    btn.addEventListener('click', (e) => e.stopPropagation());
  });
}

import { AP_CONTACTS } from '../data/contacts.js';
import { CITY_TO_DISTRICT } from '../data/guides.js';

let activeCard = null;

function handleCardInteraction(event) {
  // Prevent bubbling if clicked on interactive elements inside card
  if (event.target.closest('.cph, .map-action, .share-btn')) return;
  
  const card = event.currentTarget;
  if (card === activeCard) {
    card.classList.toggle('open');
  } else {
    if (activeCard) activeCard.classList.remove('open');
    card.classList.add('open');
    activeCard = card;
  }
}

async function handleShare(contact, event) {
  event.stopPropagation();
  const phoneNumbers = Array.isArray(contact.phone) ? contact.phone : [contact.phone];
  const phoneList = phoneNumbers.map(p => `📞 ${p}`).join('\n');
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`;
  const shareMessage = `🐾 *${contact.name}*\n${phoneList}\n📍 ${contact.address}\n🗺️ Map: ${mapUrl}\n🏷️ Type: ${contact.type}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: `🐾 ${contact.name}`,
        text: `${contact.name}\n${phoneNumbers.join(', ')}\n📍 ${contact.address}\n🗺️ ${mapUrl}`,
        url: mapUrl,
      });
    } catch (err) {
      if (err.name !== 'AbortError') console.warn('Share failed:', err);
    }
    return;
  }

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
  window.open(whatsappUrl, '_blank');
}

export function renderContacts(currentCity, chipState) {
  const dist = CITY_TO_DISTRICT[currentCity];
  const data = AP_CONTACTS[dist];
  const container = document.getElementById('contactsCol');

  if (!data) {
    container.innerHTML = '<div style="padding:2rem;">No data for this city.</div>';
    return;
  }

  const typeMap = {
    ngo: chipState.ngo,
    vet: chipState.vet,
    hospital: chipState.vet,
    clinic: chipState.vet,
    municipal: chipState.govt,
    government: chipState.govt,
  };

  let contacts = data.contacts.filter(c => typeMap[(c.type || '').toLowerCase()] !== false);
  contacts.sort((a, b) => (b.emergency ? 1 : 0) - (a.emergency ? 1 : 0));

  let html = `
    <div class="ch">
      <div class="cnb">${currentCity}</div>
      <div class="cd">📍 ${dist}</div>
      <div class="chq">HQ: ${data.hq}</div>
    </div>
    <div class="sh">
      <div class="sn">📞 1962</div>
      <div>
        <h3>AP Govt Vet Ambulance — CALL FIRST</h3>
        <p>24h · FREE · 340 ambulances statewide</p>
      </div>
    </div>
    <div class="notice">💡 ${data.emergency_note || data.note}</div>
    <div class="sl">CONTACTS — TAP TO EXPAND & SHARE</div>
    <div class="cl">
  `;

  contacts.forEach(c => {
    const typeClass = 't-' + (c.type || '').toLowerCase().replace(/\s/g, '-');
    const phoneNumbers = Array.isArray(c.phone) ? c.phone : [c.phone];
    
    const phoneHtml = phoneNumbers.map(phone => 
      `<a class="cph" href="tel:${phone.replace(/\s/g, '')}" onclick="event.stopPropagation()">${phone}</a>`
    ).join(' ');

    const servicesHtml = (c.services || []).map(s => `<span class="stag">${s}</span>`).join('');
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.address)}`;
    const contactJson = JSON.stringify(c).replace(/\\/g, '\\\\').replace(/"/g, '&quot;');

    const addressLine = `
      <div class="dr">
        <span class="di">📍</span>
        <span>${c.address}</span>
        <a href="${mapUrl}" target="_blank" class="map-action" onclick="event.stopPropagation()">
          🗺️ Map
        </a>
        <button class="share-btn" data-contact='${contactJson}' onclick="event.stopPropagation()">
          📤 Share
        </button>
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
          <div class="phone-group">${phoneHtml}</div>
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

  // Attach touch/click events to all cards
  document.querySelectorAll('.cc').forEach(card => {
    card.removeEventListener('click', handleCardInteraction);
    card.removeEventListener('touchstart', handleCardInteraction);
    card.addEventListener('click', handleCardInteraction);
    card.addEventListener('touchstart', handleCardInteraction);
  });

  document.querySelectorAll('.share-btn').forEach(btn => {
    btn.removeEventListener('click', shareHandler);
    btn.addEventListener('click', shareHandler);
  });

  document.querySelectorAll('.map-action').forEach(btn => {
    btn.addEventListener('click', e => e.stopPropagation());
  });
}

function shareHandler(event) {
  const btn = event.currentTarget;
  let contact;
  try {
    contact = JSON.parse(btn.getAttribute('data-contact').replace(/&quot;/g, '"'));
  } catch (e) {
    console.warn('Invalid contact data', e);
    alert('Unable to share this contact. Please try again.');
    return;
  }
  handleShare(contact, event);
}

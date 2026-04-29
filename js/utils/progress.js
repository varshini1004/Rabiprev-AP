import { AP_CONTACTS } from '../data/contacts.js';

export function calcProgress() {
  let total = 0, verified = 0;
  Object.values(AP_CONTACTS).forEach(district => {
    district.contacts.forEach(contact => {
      total++;
      if (contact.verified) verified++;
    });
  });
  const percent = Math.round((verified / total) * 100);
  const progressBar = document.getElementById('progressBar');
  const progressPct = document.getElementById('progressPct');
  if (progressBar) progressBar.style.width = percent + '%';
  if (progressPct) progressPct.textContent = percent + '%';
  return percent;
}
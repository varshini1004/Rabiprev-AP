import { EMERGENCY_GUIDE } from '../data/guides.js';
export function renderGuide(situation) {
  const steps = EMERGENCY_GUIDE[situation] || [];
  document.getElementById('guideTitle').textContent = situation;
  const stepsContainer = document.getElementById('guideSteps');
  stepsContainer.innerHTML = steps.map((s, i) => `
    <div class="si ${i === 0 ? 'first' : ''}">
      <div class="snc">${i+1}</div>
      <div class="stx">${s}</div>
    </div>
  `).join(''); 
} 

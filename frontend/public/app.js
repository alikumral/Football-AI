/**
 * app.js — Football AI Coach Data Entry Platform
 * Handles: login, player list, form rendering, auto-save / draft resume, API calls.
 */

// ============================================================
// State
// ============================================================
const state = {
  coach:          null,   // { name, team }
  meta:           null,   // { positions, skillsByPosition, universalSkills }
  players:        [],     // submitted players
  drafts:         [],     // draft entries
  activeView:     'home',
  activeTab:      'submitted',
  activePlayerId: null,   // currently open player/draft id
  activeDraft:    false,  // is the open item a draft?
  dirty:          false,
  saveTimer:      null,
  saveTimeout:    null,
  positionSkillCache: { values: {}, ne: {} },
};

// ============================================================
// Helpers: API
// ============================================================
async function apiFetch(method, path, body) {
  try {
    return await window.supabaseApi.apiFetch(method, path, body);
  } catch (err) {
    toast(err.message || 'The data request failed.', 'error');
    throw err;
  }
}

// ============================================================
// Helpers: UI utilities
// ============================================================
function toast(msg, type = 'info', duration = 3000) {
  const wrap = document.getElementById('toast-wrap');
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.setAttribute('role', type === 'error' ? 'alert' : 'status');
  el.textContent = msg;
  wrap.appendChild(el);
  setTimeout(() => el.remove(), duration);
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function showAppView(view) {
  state.activeView = view;
  document.querySelectorAll('.page-view').forEach(section => {
    section.classList.toggle('active', section.id === `view-${view}`);
  });
  document.querySelectorAll('.nav-link').forEach(button => {
    button.classList.toggle('active', button.dataset.view === view);
    button.setAttribute('aria-current', button.dataset.view === view ? 'page' : 'false');
  });
}

function updateDashboard() {
  if (!state.coach) return;
  document.getElementById('home-coach-name').textContent = state.coach.name || 'Coach';
  document.getElementById('home-team-name').textContent = `${state.coach.team} roster workspace is ready.`;
  document.getElementById('home-player-count').textContent = state.players.length;
  document.getElementById('home-draft-count').textContent = state.drafts.length;
}

function setSaveDot(status) {
  const dot = document.getElementById('save-dot');
  const label = document.getElementById('save-status');
  dot.className = 'save-dot ' + status;
  if (status === 'saving') label.textContent = 'Saving…';
  else if (status === 'saved') label.textContent = 'Draft saved';
  else label.textContent = 'Ready';
}

// ============================================================
// Login
// ============================================================
document.getElementById('btn-login').addEventListener('click', async () => {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  if (!email || !password) { toast('Enter your email and password.', 'error'); return; }

  const button = document.getElementById('btn-login');
  button.disabled = true;
  try {
    await window.supabaseApi.signIn(email, password);
    state.coach = await window.supabaseApi.getCoachProfile();
    await initApp();
    document.getElementById('login-password').value = '';
  } catch (error) {
    await window.supabaseApi.signOut().catch(() => {});
    toast(error.message || 'Sign in failed.', 'error');
  } finally {
    button.disabled = false;
  }
});

['login-email', 'login-password'].forEach(id => {
  document.getElementById(id).addEventListener('keydown', event => {
    if (event.key === 'Enter') document.getElementById('btn-login').click();
  });
});

document.getElementById('btn-logout').addEventListener('click', async () => {
  await window.supabaseApi.signOut().catch(() => {});
  state.coach = null;
  resetMainPanel();
  showScreen('screen-login');
});

// ============================================================
// Init App
// ============================================================
async function initApp() {
  // Load metadata (position/skill taxonomy)
  state.meta = await apiFetch('GET', '/meta');

  // Populate position dropdowns
  populatePositionDropdowns();

  // Populate universal skill sliders
  buildUniversalSkills();

  // Load players & drafts
  await refreshLists();

  // Set coach display
  document.getElementById('topbar-coach-name').textContent =
    `${state.coach.name} — ${state.coach.team}`;

  updateDashboard();
  showAppView('home');
  showScreen('screen-app');
}

document.querySelectorAll('.nav-link').forEach(button => {
  button.addEventListener('click', () => showAppView(button.dataset.view));
});

document.getElementById('btn-home-players').addEventListener('click', () => {
  switchTab('submitted');
  showAppView('players');
});

document.getElementById('home-players-card').addEventListener('click', () => {
  switchTab('submitted');
  showAppView('players');
});

document.getElementById('home-drafts-card').addEventListener('click', () => {
  switchTab('drafts');
  showAppView('players');
});

['btn-home-add-player', 'btn-page-new-player'].forEach(id => {
  document.getElementById(id).addEventListener('click', () => {
    showAppView('players');
    document.getElementById('btn-new-player').click();
  });
});

// ============================================================
// Position dropdowns
// ============================================================
function populatePositionDropdowns() {
  const positions = state.meta.positions;
  const primary = document.getElementById('f-primaryPos');
  const secondary = document.getElementById('f-secondaryPos');
  primary.innerHTML = '<option value="">— Select —</option>';
  secondary.innerHTML = '';

  let currentGroup = '';
  positions.forEach(position => {
    if (position.group !== currentGroup) {
      const group = document.createElement('optgroup');
      group.label = position.group;
      primary.appendChild(group);
      currentGroup = position.group;
    }
    const option = document.createElement('option');
    option.value = position.code;
    option.textContent = `${position.code} — ${position.label}`;
    primary.lastElementChild.appendChild(option);

    const label = document.createElement('label');
    label.className = 'position-option';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = position.code;
    checkbox.setAttribute('aria-label', position.label);
    const text = document.createElement('span');
    text.textContent = `${position.code} · ${position.label}`;
    text.title = position.label;
    label.append(checkbox, text);
    secondary.appendChild(label);
  });

  primary.onchange = () => {
    cacheCurrentPositionSkills();
    updateSecondaryPositionAvailability();
    rebuildSelectedPositionSkills();
    scheduleSave();
  };
  secondary.onchange = event => {
    if (!event.target.matches('input[type="checkbox"]')) return;
    cacheCurrentPositionSkills();
    rebuildSelectedPositionSkills();
    scheduleSave();
  };
  document.getElementById('btn-clear-secondary').onclick = () => {
    cacheCurrentPositionSkills();
    secondary.querySelectorAll('input[type="checkbox"]').forEach(checkbox => { checkbox.checked = false; });
    rebuildSelectedPositionSkills();
    scheduleSave();
  };
}

function getSecondaryPositions() {
  return Array.from(document.querySelectorAll('#f-secondaryPos input[type="checkbox"]:checked')).map(input => input.value);
}

function setSecondaryPositions(values) {
  const selected = new Set(Array.isArray(values) ? values : (values ? [values] : []));
  document.querySelectorAll('#f-secondaryPos input[type="checkbox"]').forEach(input => {
    input.checked = selected.has(input.value);
  });
  updateSecondaryPositionAvailability();
}

function updateSecondaryPositionAvailability() {
  const primary = document.getElementById('f-primaryPos').value;
  document.querySelectorAll('#f-secondaryPos input[type="checkbox"]').forEach(input => {
    const isPrimary = input.value === primary;
    if (isPrimary) input.checked = false;
    input.disabled = isPrimary;
    input.closest('.position-option').classList.toggle('is-disabled', isPrimary);
  });
}

function selectedPositionCodes() {
  const primary = document.getElementById('f-primaryPos').value;
  return [primary, ...getSecondaryPositions()].filter((code, index, all) => code && all.indexOf(code) === index);
}

// ============================================================
// Skill sliders
// ============================================================
function buildSkillSlider(skillName, value, isNE, prefix) {
  const key = skillKey(skillName);
  const wrapper = document.createElement('div');
  wrapper.className = 'skill-item';

  const v = (value !== null && value !== undefined) ? value : 50;
  const band = getBand(isNE ? null : v);

  wrapper.innerHTML = `
    <div class="skill-label-row">
      <span class="skill-name">${skillName}</span>
      <span class="skill-value-badge" id="badge-${prefix}-${key}" style="${isNE ? 'opacity:0.4' : ''}">
        ${isNE ? 'N/E' : `${v} — ${band.label}`}
      </span>
    </div>
    <input type="range" class="skill-slider" id="slider-${prefix}-${key}"
      min="0" max="100" value="${v}"
      style="--pct:${v}%; ${isNE ? 'opacity:0.3;pointer-events:none' : ''}"
      data-skill="${skillName}" ${isNE ? 'disabled' : ''} />
    <label class="skill-ne">
      <input type="checkbox" id="ne-${prefix}-${key}" ${isNE ? 'checked' : ''} data-skill="${skillName}" />
      Not Evaluated
    </label>
  `;

  // Slider events
  const slider = wrapper.querySelector('.skill-slider');
  const badge  = wrapper.querySelector('.skill-value-badge');
  slider.addEventListener('input', () => {
    const val = parseInt(slider.value);
    const b = getBand(val);
    slider.style.setProperty('--pct', val + '%');
    badge.textContent = `${val} — ${b.label}`;
    badge.style.color = b.color;
    scheduleSave();
  });

  // N/E checkbox
  const neChk = wrapper.querySelector('input[type="checkbox"]');
  neChk.addEventListener('change', () => {
    const checked = neChk.checked;
    slider.disabled = checked;
    slider.style.opacity = checked ? '0.3' : '1';
    slider.style.pointerEvents = checked ? 'none' : '';
    badge.style.opacity = checked ? '0.4' : '1';
    badge.style.color = checked ? '' : getBand(parseInt(slider.value)).color;
    badge.textContent = checked ? 'N/E' : `${slider.value} — ${getBand(parseInt(slider.value)).label}`;
    scheduleSave();
  });

  return wrapper;
}

function buildPositionSkills(positionCodes, valuesByPosition = {}, neByPosition = {}) {
  const container = document.getElementById('skill-grid');
  const empty = document.getElementById('skills-empty');
  const label = document.getElementById('skills-pos-label');
  const codes = Array.isArray(positionCodes) ? positionCodes : (positionCodes ? [positionCodes] : []);
  container.innerHTML = '';

  if (!codes.length) {
    empty.style.display = '';
    label.textContent = '';
    return;
  }
  empty.style.display = 'none';
  label.textContent = codes.join(' + ');

  codes.forEach(code => {
    const position = state.meta.positions.find(item => item.code === code);
    const group = document.createElement('div');
    group.className = 'position-skill-group';
    group.dataset.position = code;
    const heading = document.createElement('div');
    heading.className = 'position-skill-heading';
    heading.innerHTML = `<span class="position-code-badge">${code}</span><strong>${position?.label || code}</strong><span>${(state.meta.skillsByPosition[code] || []).length} skills</span>`;
    const grid = document.createElement('div');
    grid.className = 'skill-grid';
    const neSet = new Set(neByPosition[code] || []);
    (state.meta.skillsByPosition[code] || []).forEach(skill => {
      const key = skillKey(skill);
      const value = valuesByPosition[code]?.[key];
      const hasValue = value !== null && value !== undefined;
      grid.appendChild(buildSkillSlider(skill, hasValue ? value : 50, neSet.has(key) || !hasValue, `position-${code}`));
    });
    group.append(heading, grid);
    container.appendChild(group);
  });
}

function readPositionSkills() {
  const values = {};
  const ne = {};
  document.querySelectorAll('#skill-grid .position-skill-group').forEach(group => {
    const code = group.dataset.position;
    const result = readSkillsFromElement(group);
    values[code] = result.values;
    ne[code] = result.ne;
  });
  return { values, ne };
}

function cacheCurrentPositionSkills() {
  const current = readPositionSkills();
  Object.assign(state.positionSkillCache.values, current.values);
  Object.assign(state.positionSkillCache.ne, current.ne);
}

function rebuildSelectedPositionSkills() {
  buildPositionSkills(selectedPositionCodes(), state.positionSkillCache.values, state.positionSkillCache.ne);
}

function buildUniversalSkills(values, neSet) {
  const grid = document.getElementById('universal-skill-grid');
  grid.innerHTML = '';
  state.meta.universalSkills.forEach(skill => {
    const key = skillKey(skill);
    const hasValue = values && values[key] !== null && values[key] !== undefined;
    const v  = hasValue ? values[key] : 50;
    const ne = neSet?.has(key) || !hasValue;
    grid.appendChild(buildSkillSlider(skill, v, ne, 'universal'));
  });
}

function getBand(val) {
  if (val === null || val === undefined) return { label: 'N/E', color: '#94a3b8' };
  if (val <= 19) return { label: 'Very Limited', color: '#ef4444' };
  if (val <= 39) return { label: 'Developing',   color: '#f97316' };
  if (val <= 59) return { label: 'Functional',   color: '#eab308' };
  if (val <= 74) return { label: 'Above Average',color: '#84cc16' };
  if (val <= 89) return { label: 'Advanced',     color: '#22c55e' };
  return              { label: 'Elite',          color: '#06b6d4' };
}

function skillKey(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
}

// ============================================================
// Read form values
// ============================================================
function getFieldVal(id) {
  const el = document.getElementById(id);
  if (!el) return '';
  return el.type === 'number' ? (el.value !== '' ? parseFloat(el.value) : null) : el.value.trim();
}

function readSkillsFromElement(grid) {
  const values = {};
  const ne = [];
  grid.querySelectorAll('.skill-slider').forEach(slider => {
    const name = slider.dataset.skill;
    const key  = skillKey(name);
    const neChk = slider.closest('.skill-item').querySelector('.skill-ne input');
    if (neChk?.checked) { ne.push(key); values[key] = null; }
    else values[key] = parseInt(slider.value);
  });
  return { values, ne };
}

function readSkillsFromGrid(gridId) {
  return readSkillsFromElement(document.getElementById(gridId));
}

function readForm() {
  const positional = readPositionSkills();
  const { values: uniVals,   ne: uniNE   } = readSkillsFromGrid('universal-skill-grid');
  const primaryPos = getFieldVal('f-primaryPos');

  return {
    id: state.activePlayerId,
    coachName: state.coach.name,
    teamName:  state.coach.team,
    profile: {
      firstName:    getFieldVal('f-firstName'),
      lastName:     getFieldVal('f-lastName'),
      dateOfBirth:  getFieldVal('f-dob'),
      nationality:  getFieldVal('f-nationality'),
      height:       getFieldVal('f-height'),
      weight:       getFieldVal('f-weight'),
      jerseyNumber: getFieldVal('f-jersey'),
      primaryPos,
      secondaryPos: getSecondaryPositions(),
      archetype:    getFieldVal('f-archetype'),
      domHand:      getFieldVal('f-domHand'),
      domFoot:      getFieldVal('f-domFoot'),
      experience:   getFieldVal('f-experience'),
      rosterRole:   getFieldVal('f-rosterRole'),
      availability: getFieldVal('f-availability'),
    },
    measurements: {
      wingspan:      getFieldVal('m-wingspan'),
      armLength:     getFieldVal('m-armLength'),
      handLength:    getFieldVal('m-handLength'),
      handSpan:      getFieldVal('m-handSpan'),
      standingReach: getFieldVal('m-standingReach'),
      forty:         getFieldVal('m-forty'),
      tenSplit:      getFieldVal('m-tenSplit'),
      twentySplit:   getFieldVal('m-twentySplit'),
      shuttle:       getFieldVal('m-shuttle'),
      threeCone:     getFieldVal('m-threeCone'),
      vertJump:      getFieldVal('m-vertJump'),
      broadJump:     getFieldVal('m-broadJump'),
      bench:         getFieldVal('m-bench'),
      bench1rm:      getFieldVal('m-bench1rm'),
    },
    skills:         positional.values[primaryPos] || {},
    skillsNE:       positional.ne[primaryPos] || [],
    positionSkills: positional.values,
    positionSkillsNE: positional.ne,
    universalSkills: uniVals,
    universalSkillsNE: uniNE,
    customAttributes: readCustomAttributes(),
    notes: getFieldVal('f-notes'),
  };
}

// ============================================================
// Populate form from data
// ============================================================
function setFieldVal(id, val) {
  const el = document.getElementById(id);
  if (el && val !== null && val !== undefined) el.value = val;
}

function addCustomAttribute(attribute = {}) {
  const row = document.createElement('div');
  row.className = 'custom-attribute-row';
  const name = document.createElement('input');
  name.type = 'text';
  name.maxLength = 80;
  name.placeholder = 'Field name';
  name.value = attribute.name || '';
  name.className = 'custom-attribute-name';
  const value = document.createElement('input');
  value.type = 'text';
  value.maxLength = 250;
  value.placeholder = 'Value';
  value.value = attribute.value || '';
  value.className = 'custom-attribute-value';
  const remove = document.createElement('button');
  remove.type = 'button';
  remove.className = 'btn btn-icon';
  remove.setAttribute('aria-label', 'Remove custom field');
  remove.textContent = '×';
  remove.addEventListener('click', () => { row.remove(); scheduleSave(); });
  row.append(name, value, remove);
  document.getElementById('custom-attributes').appendChild(row);
}

function readCustomAttributes() {
  return Array.from(document.querySelectorAll('.custom-attribute-row')).map(row => ({
    name: row.querySelector('.custom-attribute-name').value.trim(),
    value: row.querySelector('.custom-attribute-value').value.trim(),
  })).filter(attribute => attribute.name || attribute.value);
}

document.getElementById('btn-add-attribute').addEventListener('click', () => addCustomAttribute());

function updateAge() {
  const value = document.getElementById('f-dob').value;
  const ageLabel = document.getElementById('f-age');
  if (!value) { ageLabel.textContent = ''; return; }
  const birthDate = new Date(`${value}T00:00:00`);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const beforeBirthday = today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate());
  if (beforeBirthday) age -= 1;
  ageLabel.textContent = age >= 0 ? `(${age} yrs)` : '';
}

document.getElementById('f-dob').addEventListener('input', updateAge);

function populateForm(data) {
  const p = data.profile || {};
  setFieldVal('f-firstName',   p.firstName);
  setFieldVal('f-lastName',    p.lastName);
  setFieldVal('f-dob',         p.dateOfBirth);
  updateAge();
  setFieldVal('f-nationality', p.nationality);
  setFieldVal('f-height',      p.height);
  setFieldVal('f-weight',      p.weight);
  setFieldVal('f-jersey',      p.jerseyNumber);
  setFieldVal('f-primaryPos',  p.primaryPos);
  setSecondaryPositions(p.secondaryPos);
  setFieldVal('f-archetype',   p.archetype);
  setFieldVal('f-domHand',     p.domHand);
  setFieldVal('f-domFoot',     p.domFoot);
  setFieldVal('f-experience',  p.experience);
  setFieldVal('f-rosterRole',  p.rosterRole);
  setFieldVal('f-availability',p.availability);
  setFieldVal('f-notes', data.notes);
  document.getElementById('custom-attributes').innerHTML = '';
  (data.customAttributes || []).forEach(addCustomAttribute);

  const m = data.measurements || {};
  setFieldVal('m-wingspan',      m.wingspan);
  setFieldVal('m-armLength',     m.armLength);
  setFieldVal('m-handLength',    m.handLength);
  setFieldVal('m-handSpan',      m.handSpan);
  setFieldVal('m-standingReach', m.standingReach);
  setFieldVal('m-forty',         m.forty);
  setFieldVal('m-tenSplit',      m.tenSplit);
  setFieldVal('m-twentySplit',   m.twentySplit);
  setFieldVal('m-shuttle',       m.shuttle);
  setFieldVal('m-threeCone',     m.threeCone);
  setFieldVal('m-vertJump',      m.vertJump);
  setFieldVal('m-broadJump',     m.broadJump);
  setFieldVal('m-bench',         m.bench);
  setFieldVal('m-bench1rm',      m.bench1rm);

  // New records store a skill set per position. Legacy records are mapped to
  // the primary position so existing ratings remain editable.
  const primary = p.primaryPos || '';
  const positionValues = { ...(data.positionSkills || {}) };
  const positionNE = { ...(data.positionSkillsNE || {}) };
  if (primary && !positionValues[primary] && data.skills) positionValues[primary] = data.skills;
  if (primary && !positionNE[primary] && data.skillsNE) positionNE[primary] = data.skillsNE;
  state.positionSkillCache = {
    values: structuredClone(positionValues),
    ne: structuredClone(positionNE),
  };
  buildPositionSkills(selectedPositionCodes(), state.positionSkillCache.values, state.positionSkillCache.ne);

  // Universal skills
  const uneSet = new Set(data.universalSkillsNE || []);
  buildUniversalSkills(data.universalSkills, uneSet);
}

function clearForm() {
  ['f-firstName','f-lastName','f-dob','f-nationality','f-height','f-weight',
   'f-jersey','f-primaryPos','f-archetype','f-domHand','f-domFoot',
   'f-experience','f-rosterRole','f-availability','f-notes',
   'm-wingspan','m-armLength','m-handLength','m-handSpan','m-standingReach',
   'm-forty','m-tenSplit','m-twentySplit','m-shuttle','m-threeCone',
   'm-vertJump','m-broadJump','m-bench','m-bench1rm'
  ].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });

  setSecondaryPositions([]);
  state.positionSkillCache = { values: {}, ne: {} };
  document.getElementById('skill-grid').innerHTML = '';
  document.getElementById('skills-empty').style.display = '';
  document.getElementById('skills-pos-label').textContent = '';
  document.getElementById('f-age').textContent = '';
  document.getElementById('custom-attributes').innerHTML = '';
  buildUniversalSkills();
}

// ============================================================
// Auto-save (draft)
// ============================================================
function scheduleSave() {
  if (!state.activePlayerId) return;
  state.dirty = true;
  setSaveDot('saving');
  clearTimeout(state.saveTimeout);
  state.saveTimeout = setTimeout(commitSave, 1800); // 1.8s debounce
}

async function commitSave() {
  if (!state.activePlayerId || !state.activeDraft) return;
  const data = readForm();
  try {
    await apiFetch('PUT', `/drafts/${state.activePlayerId}`, data);
    setSaveDot('saved');
    state.dirty = false;
    refreshDraftCount();
  } catch {
    setSaveDot('');
  }
}

// Also save on any input change in the form
document.getElementById('player-form-wrap').addEventListener('input', () => {
  if (state.activeDraft) scheduleSave();
});

// ============================================================
// Open a player or draft
// ============================================================
async function openPlayer(id, isDraft) {
  showAppView('players');
  state.activePlayerId = id;
  state.activeDraft    = isDraft;

  let data;
  if (isDraft) {
    data = await apiFetch('GET', `/drafts/${id}`);
  } else {
    data = await apiFetch('GET', `/players/${id}`);
  }

  clearForm();
  populateForm(data);

  const name = (data.profile?.firstName || '') + ' ' + (data.profile?.lastName || '');
  document.getElementById('form-title').textContent = name.trim() || (isDraft ? 'Draft Player' : 'Player');

  // Draft banner
  document.getElementById('draft-banner').style.display = isDraft ? '' : 'none';

  // Buttons
  document.getElementById('btn-delete-player').style.display = isDraft ? 'none' : '';
  document.getElementById('btn-discard-draft').style.display = isDraft ? ''     : 'none';
  document.getElementById('submit-label').textContent = isDraft ? 'Submit Player' : 'Save Changes';
  document.getElementById('autosave-bar').style.display = isDraft ? '' : 'none';
  setSaveDot('saved');

  document.getElementById('welcome-state').style.display = 'none';
  document.getElementById('player-form-wrap').style.display = '';

  // Highlight sidebar
  document.querySelectorAll('.player-card').forEach(c => c.classList.remove('active'));
  const card = document.querySelector(`.player-card[data-id="${id}"]`);
  if (card) card.classList.add('active');
}

// ============================================================
// New player
// ============================================================
document.getElementById('btn-new-player').addEventListener('click', async () => {
  showAppView('players');
  const { id } = await apiFetch('POST', '/drafts/new');
  // Create minimal draft entry so it's reachable
  await apiFetch('PUT', `/drafts/${id}`, { id, profile: {}, coachName: state.coach.name, teamName: state.coach.team });
  await refreshLists();
  openPlayer(id, true);
  switchTab('drafts');
});

// ============================================================
// Submit player
// ============================================================
document.getElementById('btn-submit-player').addEventListener('click', async () => {
  const data = readForm();
  if (!data.profile.firstName || !data.profile.lastName || !data.profile.primaryPos) {
    toast('First name, last name, and primary position are required.', 'error');
    return;
  }
  clearTimeout(state.saveTimeout);
  try {
    await apiFetch('POST', '/players', data);
    toast(state.activeDraft ? 'Player submitted successfully!' : 'Player changes saved.', 'success');
    await refreshLists();
    // Now open as submitted
    state.activeDraft = false;
    document.getElementById('draft-banner').style.display = 'none';
    document.getElementById('btn-delete-player').style.display = '';
    document.getElementById('btn-discard-draft').style.display = 'none';
    document.getElementById('autosave-bar').style.display = 'none';
    document.getElementById('form-title').textContent =
      (data.profile.firstName + ' ' + data.profile.lastName).trim();
    switchTab('submitted');
  } catch { /* toast already shown */ }
});

// ============================================================
// Delete player
// ============================================================
document.getElementById('btn-delete-player').addEventListener('click', async () => {
  if (!confirm('Delete this player? This cannot be undone.')) return;
  await apiFetch('DELETE', `/players/${state.activePlayerId}`);
  toast('Player deleted.', 'info');
  resetMainPanel();
  refreshLists();
});

// ============================================================
// Discard draft
// ============================================================
document.getElementById('btn-discard-draft').addEventListener('click', async () => {
  if (!confirm('Discard this draft?')) return;
  clearTimeout(state.saveTimeout);
  await apiFetch('DELETE', `/drafts/${state.activePlayerId}`);
  toast('Draft discarded.', 'info');
  resetMainPanel();
  refreshLists();
});

// ============================================================
// Sidebar player list
// ============================================================
async function refreshLists() {
  state.players = await apiFetch('GET', '/players');
  state.drafts  = await apiFetch('GET', '/drafts');
  renderPlayerList();
  refreshDraftCount();
  updateDashboard();
}

function refreshDraftCount() {
  const dc = document.getElementById('draft-count');
  if (state.drafts.length > 0) dc.textContent = `(${state.drafts.length})`;
  else dc.textContent = '';
}

function renderPlayerList() {
  const list = document.getElementById('player-list');
  list.innerHTML = '';

  const items = state.activeTab === 'submitted' ? state.players : state.drafts;

  if (items.length === 0) {
    list.innerHTML = `<div class="empty-list">${state.activeTab === 'submitted' ? 'No submitted players yet.' : 'No drafts.'}</div>`;
    return;
  }

  items.forEach(item => {
    const isDraft = state.activeTab === 'drafts';
    const p = item.profile || {};
    const name = ((p.firstName || '') + ' ' + (p.lastName || '')).trim() || '(Unnamed)';
    const pos  = p.primaryPos || '—';
    const jersey = p.jerseyNumber ? `#${p.jerseyNumber}` : '';

    const card = document.createElement('div');
    card.className = 'player-card' + (state.activePlayerId === item.id ? ' active' : '');
    card.dataset.id = item.id;
    const nameEl = document.createElement('div');
    nameEl.className = 'player-card-name';
    nameEl.textContent = name;
    const metaEl = document.createElement('div');
    metaEl.className = 'player-card-meta';
    metaEl.textContent = `${pos}${jersey ? ' · ' + jersey : ''}${isDraft ? ' · draft' : ''}`;
    const statusEl = document.createElement('div');
    statusEl.className = `player-card-status ${isDraft ? 'draft' : ''}`;
    card.append(nameEl, metaEl, statusEl);
    card.addEventListener('click', () => openPlayer(item.id, isDraft));
    list.appendChild(card);
  });
}

function resetMainPanel() {
  state.activePlayerId = null;
  state.activeDraft = false;
  document.getElementById('welcome-state').style.display = '';
  document.getElementById('player-form-wrap').style.display = 'none';
  document.getElementById('autosave-bar').style.display = 'none';
  clearForm();
}

// ============================================================
// Tabs
// ============================================================
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

function switchTab(tab) {
  state.activeTab = tab;
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === tab);
  });
  renderPlayerList();
}

// ============================================================
// Boot
// ============================================================
(async function boot() {
  try {
    window.supabaseApi.configuration();
    const activeSession = await window.supabaseApi.getSession();
    if (!activeSession) return;
    state.coach = await window.supabaseApi.getCoachProfile();
    await initApp();
  } catch (error) {
    await window.supabaseApi.signOut().catch(() => {});
    document.getElementById('login-subtitle').textContent = error.message;
    toast(error.message, 'error', 6000);
  }
})();

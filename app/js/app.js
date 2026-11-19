// Leonida Platinum — trophy tracker. Plain ES module, no dependencies and
// no network: it reads data/trophies.json next to this file and keeps
// progress in the browser's own localStorage.

const DATA_URL = 'data/trophies.json';
const STORE_KEY = 'leonida-platinum-r4-earned';

const cardList = document.getElementById('cardList');
const gradeLine = document.getElementById('gradeLine');
const meterFill = document.getElementById('meterFill');
const showingLine = document.getElementById('showingLine');
const searchBox = document.getElementById('searchBox');
const spoilerSwitch = document.getElementById('spoilerSwitch');
const earnedSwitch = document.getElementById('earnedSwitch');
const nextBtn = document.getElementById('nextBtn');
const nextPick = document.getElementById('nextPick');
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const importPicker = document.getElementById('importPicker');
const clearBtn = document.getElementById('clearBtn');

let trophies = [];
const filter = { grade: 'all', kind: 'all' };

function readEarned() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORE_KEY) || '[]');
    const ids = Array.isArray(raw) ? raw.filter((n) => Number.isInteger(n)) : [];
    return new Set(ids);
  } catch {
    return new Set();
  }
}

let earned = readEarned();

function writeEarned() {
  localStorage.setItem(STORE_KEY, JSON.stringify([...earned].sort((a, b) => a - b)));
}

function isStoryTrophy(t) {
  return t.category === 'story' || t.category === 'mission';
}

function gradeWord(g) {
  return g.charAt(0).toUpperCase() + g.slice(1);
}

function visible(t) {
  const q = searchBox.value.trim().toLowerCase();
  if (q) {
    const hay = (t.name + ' ' + t.description + ' ' + t.guide).toLowerCase();
    if (!hay.includes(q)) return false;
  }
  if (filter.grade !== 'all' && t.grade !== filter.grade) return false;
  if (filter.kind === 'unearned' && earned.has(t.id)) return false;
  if (filter.kind === 'missable' && !t.missable) return false;
  if (filter.kind === 'collectible' && t.category !== 'collectible') return false;
  if (filter.kind === 'activity' && t.category !== 'activity') return false;
  if (filter.kind === 'story' && !isStoryTrophy(t)) return false;
  if (filter.kind === 'online' && t.category !== 'online') return false;
  if (earnedSwitch.checked && !earned.has(t.id)) return false;
  if (spoilerSwitch.checked && t.hidden && !earned.has(t.id)) return false;
  return true;
}

function buildCard(t) {
  const li = document.createElement('li');
  li.className = 'card' + (earned.has(t.id) ? ' earned' : '');
  li.dataset.id = String(t.id);

  const head = document.createElement('div');
  head.className = 'card-head';
  const name = document.createElement('h3');
  name.className = 'card-name';
  name.textContent = t.name;
  const badge = document.createElement('span');
  badge.className = 'badge badge-' + t.grade;
  badge.textContent = gradeWord(t.grade);
  head.append(name, badge);

  const desc = document.createElement('p');
  desc.className = 'card-desc';
  desc.textContent = t.description;

  const guide = document.createElement('p');
  guide.className = 'card-guide';
  guide.append(document.createElement('strong'));
  guide.firstChild.textContent = 'How: ';
  guide.append(document.createTextNode(t.guide));

  const tags = document.createElement('div');
  tags.className = 'card-tags';
  const kindTag = document.createElement('span');
  kindTag.className = 'tag';
  kindTag.textContent = t.category;
  tags.append(kindTag);
  if (t.missable) {
    const m = document.createElement('span');
    m.className = 'tag alert';
    m.textContent = 'MISSABLE — do before the story ends';
    tags.append(m);
  }
  if (t.hidden) {
    const h = document.createElement('span');
    h.className = 'tag spoiler';
    h.textContent = 'story spoiler';
    tags.append(h);
  }

  const source = document.createElement('p');
  source.className = 'card-source';
  source.textContent = 'Source: ';
  const link = document.createElement('a');
  link.href = t.source_url;
  link.textContent = t.source;
  link.target = '_blank';
  link.rel = 'noopener';
  source.append(link);

  const foot = document.createElement('div');
  foot.className = 'card-foot';
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'earn-btn' + (earned.has(t.id) ? ' done' : '');
  btn.textContent = earned.has(t.id) ? 'Earned ✓' : 'Mark earned';
  btn.addEventListener('click', () => {
    if (earned.has(t.id)) earned.delete(t.id);
    else earned.add(t.id);
    writeEarned();
    render();
  });
  foot.append(btn);

  li.append(head, desc, source, guide, tags, foot);
  return li;
}

function render() {
  const shown = trophies.filter(visible);
  const earnedCount = trophies.filter((t) => earned.has(t.id)).length;
  const total = trophies.length || 55;
  const pct = total ? Math.round((earnedCount / total) * 100) : 0;

  gradeLine.textContent =
    earnedCount + ' / ' + total + ' earned · 1 platinum · 2 gold · 6 silver · 46 bronze — ' +
    pct + '% to the platinum' + (earnedCount === total ? ' — Leonida Legend!' : '');
  meterFill.style.width = pct + '%';

  showingLine.textContent =
    shown.length === total
      ? 'Showing all ' + total + ' trophies.'
      : 'Showing ' + shown.length + ' of ' + total + ' trophies.';

  cardList.innerHTML = '';
  if (!shown.length) {
    const li = document.createElement('li');
    li.className = 'empty';
    li.textContent = 'Nothing matches those filters. Clear the search or pick another filter.';
    cardList.append(li);
    return;
  }
  for (const t of shown) cardList.append(buildCard(t));
}

function wireChips(rowId, key) {
  document.getElementById(rowId).addEventListener('click', (ev) => {
    const btn = ev.target.closest('button');
    if (!btn) return;
    for (const b of ev.currentTarget.querySelectorAll('button')) b.classList.remove('on');
    btn.classList.add('on');
    filter[key] = btn.dataset[key];
    render();
  });
}

wireChips('gradeChips', 'grade');
wireChips('kindChips', 'kind');

searchBox.addEventListener('input', render);
spoilerSwitch.addEventListener('change', render);
earnedSwitch.addEventListener('change', render);

// Next-trophy picker: the earliest un-earned story trophy first (the road
// to the platinum runs through the story), then the cheapest remaining
// activity or collectible, so the pick is always something playable next.
nextBtn.addEventListener('click', () => {
  const remaining = trophies.filter((t) => !earned.has(t.id));
  nextPick.hidden = false;
  if (!remaining.length) {
    nextPick.textContent = 'Platinum earned. Every trophy is ticked — Leonida Legend!';
    return;
  }
  const pool = remaining.filter((t) => t.grade !== 'platinum');
  const pick =
    pool.find((t) => isStoryTrophy(t)) ||
    pool.find((t) => t.category === 'activity') ||
    pool.find((t) => t.category === 'collectible') ||
    pool[0];
  nextPick.innerHTML = '';
  const strong = document.createElement('strong');
  strong.textContent = 'Next up: ' + pick.name + ' (' + gradeWord(pick.grade) + '). ';
  nextPick.append(strong, document.createTextNode(pick.guide));
});

exportBtn.addEventListener('click', () => {
  const blob = new Blob(
    [JSON.stringify({ earned: [...earned].sort((a, b) => a - b) }, null, 2)],
    { type: 'application/json' },
  );
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'leonida-platinum-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});

importBtn.addEventListener('click', () => importPicker.click());
importPicker.addEventListener('change', async () => {
  const file = importPicker.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const ids = Array.isArray(data.earned) ? data.earned : data;
    earned = new Set(ids.filter((n) => Number.isInteger(n) && n >= 1 && n <= 55));
    writeEarned();
    render();
  } catch {
    alert('That file is not a Leonida Platinum progress export.');
  }
  importPicker.value = '';
});

clearBtn.addEventListener('click', () => {
  if (confirm('Clear all earned trophies?')) {
    earned = new Set();
    writeEarned();
    render();
  }
});

// Deep links: #grade=silver, #kind=missable, #q=meditate open the guide
// pre-filtered, and #roadmap scrolls to the roadmap.
function applyHash() {
  const params = new URLSearchParams(location.hash.slice(1));
  const grade = params.get('grade');
  const kind = params.get('kind');
  const q = params.get('q');
  if (grade && ['platinum', 'gold', 'silver', 'bronze'].includes(grade)) {
    filter.grade = grade;
    for (const b of document.querySelectorAll('#gradeChips button')) {
      b.classList.toggle('on', b.dataset.grade === grade);
    }
  }
  if (kind && ['story', 'missable', 'collectible', 'activity', 'online', 'unearned'].includes(kind)) {
    filter.kind = kind;
    for (const b of document.querySelectorAll('#kindChips button')) {
      b.classList.toggle('on', b.dataset.kind === kind);
    }
  }
  if (q) searchBox.value = q;
}

function scrollToRoadmap() {
  if (location.hash !== '#roadmap') return;
  // Instant, not smooth: a smooth scroll may still be animating when a
  // headless screenshot is taken, so the capture would show the top.
  // Runs after render(), so the roadmap is at its final position.
  document.getElementById('roadmap').scrollIntoView({ behavior: 'instant' });
}

fetch(DATA_URL)
  .then((r) => {
    if (!r.ok) throw new Error('could not load ' + DATA_URL);
    return r.json();
  })
  .then((data) => {
    trophies = Array.isArray(data) ? data : data.trophies;
    applyHash();
    render();
    scrollToRoadmap();
  })
  .catch((err) => {
    const li = document.createElement('li');
    li.className = 'empty';
    li.textContent = 'Could not load the trophy list: ' + err.message;
    cardList.append(li);
  });

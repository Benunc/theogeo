/* Visual quiz + Sort & match — loaded by index.html */
(function () {
  const AGE_LABELS = ['0-4','5-9','10-14','15-19','20-24','25-29','30-34','35-39','40-44','45-49','50-54','55-59','60-64','65-69','70-74','75-79','80+'];
  const PYRAMID_PRESETS = {
    expanding: { label: 'Country A', male: [11,10,9,8,7,6,5,4,4,3,3,2,2,1,1,1,0.5], female: [10,10,9,8,7,6,5,4,4,3,3,2,2,1,1,1,0.5] },
    contracting: { label: 'Country B', male: [4,4,5,5,6,7,7,8,8,7,6,5,4,3,2,1,0.5], female: [4,4,5,5,6,7,7,8,8,7,6,5,4,3,2,1,0.5] },
    stationary: { label: 'Country C', male: [6,6,6,6,6,6,6,6,5,5,5,4,4,3,2,1,0.5], female: [6,6,6,6,6,6,6,6,5,5,5,4,4,3,2,1,0.5] },
    boom: { label: 'Country D', male: [5,5,6,6,7,8,9,10,10,9,7,5,4,3,2,1,0.5], female: [5,5,6,6,7,8,9,10,10,9,7,5,4,3,2,1,0.5] }
  };

  function hi(stroke, w) { return stroke ? ` stroke="${stroke}" stroke-width="${w||2}"` : ''; }

  function renderPyramid(variant) {
    const p = PYRAMID_PRESETS[variant];
    const n = p.male.length, barH = 14, gap = 2, maxVal = Math.max(...p.male, ...p.female);
    const centerX = 200, topPad = 28, h = topPad + n * (barH + gap) + 24, w = 400;
    let bars = '';
    for (let i = 0; i < n; i++) {
      const y = topPad + i * (barH + gap), row = n - 1 - i;
      const mW = (p.male[row] / maxVal) * 84, fW = (p.female[row] / maxVal) * 84;
      bars += `<rect x="${centerX - mW}" y="${y}" width="${mW}" height="${barH}" fill="#5b9bd5" rx="1"/>`;
      bars += `<rect x="${centerX}" y="${y}" width="${fW}" height="${barH}" fill="#e07aac" rx="1"/>`;
      if (row % 3 === 0 || row === 0 || row === n - 1)
        bars += `<text x="8" y="${y + barH - 3}" fill="#8b9cb3" font-size="10">${AGE_LABELS[row]}</text>`;
    }
    return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><text x="${centerX}" y="16" text-anchor="middle" fill="#e8eef7" font-size="13" font-weight="600">${p.label}</text><line x1="${centerX}" y1="${topPad}" x2="${centerX}" y2="${h-16}" stroke="#2d3d52"/>${bars}<text x="${centerX}" y="${h-4}" text-anchor="middle" fill="#8b9cb3" font-size="10">↑ older · younger ↓</text></svg>`;
  }

  function renderMapParts(highlight) {
    const hl = (id, col) => highlight === id ? col : '#3d5575';
    return `<svg viewBox="0 0 420 280" width="420" height="280">
      <rect x="20" y="20" width="380" height="240" fill="#1e2a3a" stroke="#3d5575" rx="4"/>
      <text x="210" y="42" text-anchor="middle" fill="${hl('title','#6bcf7f')}" font-size="12" font-weight="600">A — Title</text>
      <line x1="30" y1="230" x2="130" y2="230" stroke="#8b9cb3" stroke-width="2"/>
      <text x="80" y="248" text-anchor="middle" fill="${hl('scale','#6bcf7f')}" font-size="10">B — Scale</text>
      <rect x="300" y="200" width="90" height="55" fill="#243044" stroke="${hl('legend','#6bcf7f')}" rx="3"/>
      <text x="345" y="218" text-anchor="middle" fill="${hl('legend','#6bcf7f')}" font-size="10">C — Legend</text>
      <polygon points="360,55 375,85 345,85" fill="#243044" stroke="${hl('compass','#6bcf7f')}"/>
      <text x="360" y="100" text-anchor="middle" fill="${hl('compass','#6bcf7f')}" font-size="10">D — Compass</text>
      <line x1="50" y1="60" x2="50" y2="180" stroke="#4a5568" stroke-dasharray="4"/>
      <line x1="80" y1="60" x2="80" y2="180" stroke="#4a5568" stroke-dasharray="4"/>
      <line x1="110" y1="60" x2="110" y2="180" stroke="#4a5568" stroke-dasharray="4"/>
      <line x1="50" y1="90" x2="200" y2="90" stroke="#4a5568" stroke-dasharray="4"/>
      <text x="130" y="78" text-anchor="middle" fill="${hl('grid','#6bcf7f')}" font-size="10">E — Lat/Long grid</text>
      <path d="M160,120 L220,100 L260,140 L200,170 Z" fill="#2d4a3d" stroke="#6bcf7f" opacity="0.8"/>
    </svg>`;
  }

  function renderWorldMap(highlight) {
    const eq = highlight === 'equator' ? '#ff6b6b' : '#4a5568';
    const pm = highlight === 'prime' ? '#6bcf7f' : '#4a5568';
    // Line names only after the answer is revealed — not while identifying the line.
    const eqLabel = highlight === 'equator'
      ? `<text x="400" y="105" fill="${eq}" font-size="10">Equator</text>` : '';
    const pmLabel = highlight === 'prime'
      ? `<text x="285" y="18" fill="${pm}" font-size="10">Prime Meridian</text>` : '';
    return `<svg viewBox="0 0 420 220" width="420" height="220">
      <rect width="420" height="220" fill="#1a2838"/>
      <ellipse cx="120" cy="100" rx="55" ry="40" fill="#2d4a3d" stroke="#6bcf7f" opacity="0.7"/>
      <text x="120" y="105" text-anchor="middle" fill="#e8eef7" font-size="9">Americas</text>
      <ellipse cx="260" cy="90" rx="70" ry="45" fill="#2d4a3d" stroke="#6bcf7f" opacity="0.7"/>
      <text x="260" y="95" text-anchor="middle" fill="#e8eef7" font-size="9">Europe/Africa/Asia</text>
      <ellipse cx="330" cy="150" rx="35" ry="25" fill="#2d4a3d" stroke="#6bcf7f" opacity="0.7"/>
      <text x="330" y="155" text-anchor="middle" fill="#e8eef7" font-size="8">Australia</text>
      <line x1="0" y1="110" x2="420" y2="110" stroke="${eq}" stroke-width="2" stroke-dasharray="6"/>
      ${eqLabel}
      <line x1="280" y1="0" x2="280" y2="220" stroke="${pm}" stroke-width="2" stroke-dasharray="6"/>
      ${pmLabel}
      <text x="60" y="30" fill="#5b9bd5" font-size="9">Arctic Ocean</text>
      <text x="60" y="205" fill="#5b9bd5" font-size="9">Southern Ocean</text>
      <text x="10" y="120" fill="#5b9bd5" font-size="9">Pacific</text>
      <text x="370" y="120" fill="#5b9bd5" font-size="9">Atlantic</text>
    </svg>`;
  }

  function renderSCMap(highlight) {
    const regions = [
      { id: 'blue', label: 'Blue Ridge', color: '#4a6741', trait: 'Mountains' },
      { id: 'pied', label: 'Piedmont', color: '#6b5344', trait: 'Rolling hills' },
      { id: 'sand', label: 'Sand Hills', color: '#c4a574', trait: 'Sandy soils' },
      { id: 'inner', label: 'Inner Coastal Plain', color: '#5a7a5a', trait: 'Hilly forests' },
      { id: 'outer', label: 'Outer Coastal Plain', color: '#4a6a4a', trait: 'Flat' },
      { id: 'coast', label: 'Coastal Zone', color: '#3a6a8a', trait: 'Beaches/marshes' }
    ];
    const w = 380, h = 200, band = w / 6;
    let s = `<svg viewBox="0 0 ${w + 40} ${h + 50}" width="${w + 40}" height="${h + 50}"><text x="${(w+40)/2}" y="16" text-anchor="middle" fill="#e8eef7" font-size="12">South Carolina — west → east</text>`;
    regions.forEach((r, i) => {
      const stroke = highlight === r.id ? '#6bcf7f' : '#2d3d52';
      const sw = highlight === r.id ? 3 : 1;
      s += `<rect x="${20 + i * band}" y="30" width="${band - 2}" height="${h}" fill="${r.color}" stroke="${stroke}" stroke-width="${sw}"/>`;
      s += `<text x="${20 + i * band + band/2}" y="${h/2 + 30}" text-anchor="middle" fill="#fff" font-size="8" transform="rotate(-90 ${20 + i * band + band/2} ${h/2 + 30})">${r.label}</text>`;
    });
    s += `<text x="${(w+40)/2}" y="${h + 42}" text-anchor="middle" fill="#8b9cb3" font-size="10">← Upstate · Lowcountry →</text></svg>`;
    return s;
  }

  function renderUrban(highlight) {
    const zones = [
      { id: 'cbd', r: 25, label: 'CBD', sub: 'offices/shops' },
      { id: 'comm', r: 50, label: 'Commercial', sub: 'stores' },
      { id: 'res', r: 75, label: 'Residential', sub: 'homes' },
      { id: 'ind', r: 95, label: 'Industrial', sub: 'factories' },
      { id: 'sub', r: 120, label: 'Suburbs', sub: 'outside city' },
      { id: 'ex', r: 145, label: 'Exurbs', sub: 'rural fringe', dash: true }
    ];
    let s = `<svg viewBox="0 0 320 320" width="320" height="320"><text x="160" y="18" text-anchor="middle" fill="#e8eef7" font-size="12">Urban land use model</text>`;
    zones.slice().reverse().forEach(z => {
      const stroke = highlight === z.id ? '#6bcf7f' : '#3d5575';
      const sw = highlight === z.id ? 3 : 1;
      const dash = z.dash ? ' stroke-dasharray="6"' : '';
      s += `<circle cx="160" cy="170" r="${z.r}" fill="none" stroke="${stroke}" stroke-width="${sw}"${dash}/>`;
    });
    zones.forEach(z => {
      const y = 170 - z.r + 12;
      if (highlight === z.id)
        s += `<text x="160" y="${y}" text-anchor="middle" fill="#6bcf7f" font-size="9" font-weight="600">${z.label}</text>`;
    });
    s += `<text x="160" y="305" text-anchor="middle" fill="#8b9cb3" font-size="9">Metro area = city + suburbs together</text></svg>`;
    return s;
  }

  function renderGov(highlight) {
    const branches = [
      { id: 'leg', x: 30, label: 'Legislative', sub: 'Congress', color: '#4a6741' },
      { id: 'exec', x: 155, label: 'Executive', sub: 'President', color: '#4a5568' },
      { id: 'jud', x: 280, label: 'Judicial', sub: 'Courts', color: '#5a4a6a' }
    ];
    let s = `<svg viewBox="0 0 420 160" width="420" height="160"><text x="210" y="18" text-anchor="middle" fill="#e8eef7" font-size="12">Three branches of U.S. government</text>`;
    branches.forEach(b => {
      const stroke = highlight === b.id ? '#6bcf7f' : '#3d5575';
      const sw = highlight === b.id ? 3 : 1;
      s += `<rect x="${b.x - 55}" y="35" width="110" height="90" fill="${b.color}" stroke="${stroke}" stroke-width="${sw}" rx="6"/>`;
      s += `<text x="${b.x}" y="65" text-anchor="middle" fill="#fff" font-size="11" font-weight="600">${b.label}</text>`;
      s += `<text x="${b.x}" y="85" text-anchor="middle" fill="#ccc" font-size="9">${b.sub}</text>`;
    });
    return s + '</svg>';
  }

  function renderBoundaries(variant) {
    if (variant === 'natural') {
      return `<svg viewBox="0 0 400 180" width="400" height="180">
        <text x="200" y="18" text-anchor="middle" fill="#e8eef7" font-size="12">Natural boundary — river</text>
        <rect x="20" y="40" width="160" height="120" fill="#3d5a3d" stroke="#6bcf7f"/><text x="100" y="105" text-anchor="middle" fill="#fff" font-size="11">Country A</text>
        <path d="M200,40 Q210,100 200,160" fill="none" stroke="#5b9bd5" stroke-width="8"/>
        <text x="210" y="105" fill="#5b9bd5" font-size="10">River</text>
        <rect x="220" y="40" width="160" height="120" fill="#5a4a3d" stroke="#6bcf7f"/><text x="300" y="105" text-anchor="middle" fill="#fff" font-size="11">Country B</text>
      </svg>`;
    }
    return `<svg viewBox="0 0 400 180" width="400" height="180">
      <text x="200" y="18" text-anchor="middle" fill="#e8eef7" font-size="12">Artificial boundary — survey line</text>
      <rect x="20" y="40" width="175" height="120" fill="#3d5a3d" stroke="#6bcf7f"/><text x="108" y="105" text-anchor="middle" fill="#fff" font-size="11">U.S.</text>
      <line x1="195" y1="40" x2="195" y2="160" stroke="#ff6b6b" stroke-width="3" stroke-dasharray="8"/>
      <text x="200" y="175" fill="#ff6b6b" font-size="9">49th parallel</text>
      <rect x="205" y="40" width="175" height="120" fill="#4a5a6a" stroke="#6bcf7f"/><text x="292" y="105" text-anchor="middle" fill="#fff" font-size="11">Canada</text>
    </svg>`;
  }

  function renderGreatLakes(highlight) {
    const lakes = [
      { id: 'sup', label: 'A', name: 'Superior', d: 'M40,30 L90,25 L95,70 L45,75 Z' },
      { id: 'mich', label: 'B', name: 'Michigan', d: 'M100,50 L130,45 L132,120 L102,125 Z' },
      { id: 'huron', label: 'C', name: 'Huron', d: 'M95,20 L145,18 L148,55 L98,58 Z' },
      { id: 'erie', label: 'D', name: 'Erie', d: 'M150,55 L195,52 L198,78 L153,82 Z' },
      { id: 'ont', label: 'E', name: 'Ontario', d: 'M155,85 L210,82 L215,115 L160,118 Z' }
    ];
    let s = `<svg viewBox="0 0 260 150" width="260" height="150"><text x="130" y="14" text-anchor="middle" fill="#e8eef7" font-size="11">Great Lakes — letter labels</text>`;
    lakes.forEach(lk => {
      const stroke = highlight === lk.id ? '#6bcf7f' : '#5b9bd5';
      const sw = highlight === lk.id ? 2.5 : 1;
      s += `<path d="${lk.d}" fill="#2a4a6a" stroke="${stroke}" stroke-width="${sw}"/>`;
      const cx = { sup: 65, mich: 115, huron: 120, erie: 175, ont: 185 }[lk.id];
      const cy = { sup: 50, mich: 85, huron: 38, erie: 68, ont: 100 }[lk.id];
      s += `<text x="${cx}" y="${cy}" fill="#fff" font-size="14" font-weight="600">${lk.label}</text>`;
    });
  s += `<text x="130" y="145" text-anchor="middle" fill="#8b9cb3" font-size="8">HOMES = Huron, Ontario, Michigan, Erie, Superior</text></svg>`;
    return s;
  }

  function renderLanguage() {
    return `<svg viewBox="0 0 400 200" width="400" height="200">
      <text x="200" y="18" text-anchor="middle" fill="#e8eef7" font-size="12">Language family tree</text>
      <rect x="170" y="35" width="60" height="28" fill="#5a4a3d" stroke="#6bcf7f" rx="4"/><text x="200" y="53" text-anchor="middle" fill="#fff" font-size="10">Latin</text>
      <line x1="200" y1="63" x2="200" y2="80" stroke="#6bcf7f"/>
      <line x1="80" y1="80" x2="320" y2="80" stroke="#6bcf7f"/>
      <rect x="40" y="90" width="70" height="24" fill="#4a5568" rx="3"/><text x="75" y="106" text-anchor="middle" fill="#fff" font-size="9">Spanish</text>
      <rect x="120" y="90" width="70" height="24" fill="#4a5568" rx="3"/><text x="155" y="106" text-anchor="middle" fill="#fff" font-size="9">French</text>
      <rect x="200" y="90" width="70" height="24" fill="#4a5568" rx="3"/><text x="235" y="106" text-anchor="middle" fill="#fff" font-size="9">Italian</text>
      <rect x="280" y="90" width="80" height="24" fill="#4a5568" rx="3"/><text x="320" y="106" text-anchor="middle" fill="#fff" font-size="9">Portuguese</text>
      <line x1="200" y1="130" x2="200" y2="145" stroke="#6bcf7f"/>
      <rect x="130" y="150" width="140" height="28" fill="#3d5a4a" stroke="#6bcf7f" rx="4"/><text x="200" y="168" text-anchor="middle" fill="#fff" font-size="10">English ← Germanic roots</text>
      <text x="200" y="195" text-anchor="middle" fill="#8b9cb3" font-size="9">Romance languages come from Latin</text>
    </svg>`;
  }

  function renderLandWater() {
    return `<svg viewBox="0 0 400 160" width="400" height="160">
      <text x="200" y="18" text-anchor="middle" fill="#e8eef7" font-size="12">Coastal vs. landlocked</text>
      <rect x="30" y="40" width="150" height="100" fill="#3d5a3d" stroke="#6bcf7f"/><text x="105" y="80" text-anchor="middle" fill="#fff" font-size="10">Brazil</text>
      <rect x="30" y="125" width="150" height="15" fill="#2a4a6a"/><text x="105" y="137" text-anchor="middle" fill="#5b9bd5" font-size="8">Atlantic Ocean — ports & trade</text>
      <rect x="220" y="40" width="150" height="100" fill="#5a4a3d" stroke="#ff6b6b"/><text x="295" y="80" text-anchor="middle" fill="#fff" font-size="10">Paraguay</text>
      <text x="295" y="100" text-anchor="middle" fill="#ffb4b4" font-size="9">No coastline</text>
      <text x="295" y="115" text-anchor="middle" fill="#8b9cb3" font-size="8">Must trade through neighbors</text>
    </svg>`;
  }

  const RENDER = {
    pyramid: (v) => renderPyramid(v),
    'map-parts': (v) => renderMapParts(v),
    world: (v) => renderWorldMap(v),
    sc: (v) => renderSCMap(v),
    urban: (v) => renderUrban(v),
    gov: (v) => renderGov(v),
    boundary: (v) => renderBoundaries(v),
    lakes: (v) => renderGreatLakes(v),
    language: () => renderLanguage(),
    landwater: () => renderLandWater()
  };

  /** Draw diagram without answer highlighted (highlight only after user answers). */
  function diagramFor(item, highlight) {
    switch (item.type) {
      case 'pyramid': return renderPyramid(item.variant);
      case 'boundary': return renderBoundaries(item.variant);
      case 'language': return renderLanguage();
      case 'landwater': return renderLandWater();
      case 'map-parts': return renderMapParts(highlight);
      case 'world': return renderWorldMap(highlight);
      case 'sc': return renderSCMap(highlight);
      case 'urban': return renderUrban(highlight);
      case 'gov': return renderGov(highlight);
      case 'lakes': return renderGreatLakes(highlight);
      default: return '';
    }
  }

  function revealKeyFor(item) {
    if (item.type === 'pyramid' || item.type === 'boundary' || item.type === 'language' || item.type === 'landwater') return null;
    return item.reveal || item.variant || null;
  }

  const VISUAL_ITEMS = [
    // Pyramids (8)
    { type: 'pyramid', variant: 'expanding', topic: 'Population', hint: 'Bottom = youngest. Wide base = high birth rate.',
      question: 'Country A: Which best describes this population?',
      answer: 'Young and growing — high birth rate (wide base)',
      choices: ['Young and growing — high birth rate (wide base)', 'Aging and shrinking — narrow base', 'Stable — equal cohorts', 'Most people over 65'] },
    { type: 'pyramid', variant: 'expanding', topic: 'Population', hint: 'Look at the bottom of the pyramid.',
      question: 'Country A: Largest age group?',
      answer: '0–4 (young children at the bottom)',
      choices: ['0–4 (young children at the bottom)', '40–44', '65–69', '80+'] },
    { type: 'pyramid', variant: 'contracting', topic: 'Population', hint: 'A narrow base means few children.',
      question: 'Country B’s narrow base means —',
      answer: 'Few children born; population may shrink',
      choices: ['Few children born; population may shrink', 'Birth rates are very high', 'No elderly people', 'Just had a baby boom'] },
    { type: 'pyramid', variant: 'boom', topic: 'Population', hint: 'Look for a bulge in the middle.',
      question: 'Country D’s middle bulge suggests —',
      answer: 'A baby-boom generation is now middle-aged',
      choices: ['A baby-boom generation is now middle-aged', 'Birth rates highest now', 'Everyone is a teenager', 'No young children'] },
  // Map parts (3)
    { type: 'map-parts', variant: 'legend', topic: 'Maps', hint: 'Every map has 5 parts: title, scale, legend, compass, grid.',
      question: 'Letter C on this sample map is the —',
      answer: 'Legend (key) — explains symbols',
      choices: ['Legend (key) — explains symbols', 'Title', 'Compass rose', 'Scale bar'] },
    { type: 'map-parts', variant: 'scale', topic: 'Maps', hint: 'Scale shows map distance vs. real distance.',
      question: 'Which part shows the relationship between map distance and real distance?',
      answer: 'B — Scale',
      choices: ['B — Scale', 'A — Title', 'D — Compass rose', 'E — Grid'] },
    { type: 'map-parts', variant: 'compass', topic: 'Maps', hint: 'Compass rose shows direction.',
      question: 'Which letter marks the compass rose?',
      answer: 'D',
      choices: ['D', 'A', 'B', 'E'] },
  // World map (3)
    { type: 'world', variant: 'equator', topic: 'Maps', hint: 'Equator = 0° latitude. Prime Meridian = 0° longitude.',
      question: 'The dashed line running east-west is the —',
      answer: 'Equator (0° latitude)',
      choices: ['Equator (0° latitude)', 'Prime Meridian (0° longitude)', 'International Date Line', 'Tropic of Cancer'] },
    { type: 'world', variant: 'prime', topic: 'Maps', hint: 'Prime Meridian runs through Greenwich, England.',
      question: 'The vertical line is the —',
      answer: 'Prime Meridian (0° longitude)',
      choices: ['Prime Meridian (0° longitude)', 'Equator', 'Ural Mountains', 'Panama Canal'] },
    { type: 'world', variant: 'equator', topic: 'Maps', hint: 'Equator divides hemispheres north/south.',
      question: 'The Equator divides Earth into —',
      answer: 'Northern and Southern Hemispheres',
      choices: ['Northern and Southern Hemispheres', 'Eastern and Western Hemispheres', 'Atlantic and Pacific', 'Core and mantle'] },
  // SC regions (4)
    { type: 'sc', variant: 'blue', topic: 'SC Regions', hint: 'West to east: Blue Ridge → Piedmont → Sand Hills → Coastal Plains → Coastal Zone.',
      question: 'The westernmost region with mountains is —',
      answer: 'Blue Ridge',
      choices: ['Blue Ridge', 'Piedmont', 'Sand Hills', 'Coastal Zone'] },
    { type: 'sc', variant: 'pied', topic: 'SC Regions', hint: 'Piedmont = rolling hills, Fall Line, red clay.',
      question: 'Which region has rolling hills and the Fall Line?',
      answer: 'Piedmont',
      choices: ['Piedmont', 'Blue Ridge', 'Outer Coastal Plain', 'Coastal Zone'] },
    { type: 'sc', variant: 'coast', topic: 'SC Regions', hint: 'Coastal Zone = beaches, barrier islands.',
      question: 'Beaches and barrier islands belong to —',
      answer: 'Coastal Zone',
      choices: ['Coastal Zone', 'Sand Hills', 'Inner Coastal Plain', 'Piedmont'] },
    { type: 'sc', variant: 'sand', topic: 'SC Regions', hint: 'Sand Hills = sandy soils at ancient coastline.',
      question: 'Sandy soils from an ancient coastline describe —',
      answer: 'Sand Hills',
      choices: ['Sand Hills', 'Blue Ridge', 'Piedmont', 'Outer Coastal Plain'] },
  // Urban (4)
    { type: 'urban', variant: 'cbd', topic: 'Urban', hint: 'CBD = downtown core. Rings outward: commercial, residential, industrial, suburbs, exurbs.',
      question: 'The center circle (CBD) is mainly for —',
      answer: 'Offices, banks, and major shops',
      choices: ['Offices, banks, and major shops', 'Factories and warehouses', 'Single-family homes only', 'Farms'] },
    { type: 'urban', variant: 'ind', topic: 'Urban', hint: 'Industrial districts are usually on the outer ring.',
      question: 'Factories and warehouses are typically in the —',
      answer: 'Industrial district (outer ring)',
      choices: ['Industrial district (outer ring)', 'CBD (center)', 'Exurbs only', 'Coastal Zone'] },
    { type: 'urban', variant: 'sub', topic: 'Urban', hint: 'Suburbs = just outside the city; exurbs = beyond suburbs.',
      question: 'Residential communities just outside the city are —',
      answer: 'Suburbs',
      choices: ['Suburbs', 'CBD', 'Exurbs', 'Commercial district only'] },
    { type: 'urban', variant: 'ex', topic: 'Urban', hint: 'Metro area = central city + suburbs.',
      question: 'The dashed outer ring represents —',
      answer: 'Exurbs (rural fringe linked to the city)',
      choices: ['Exurbs (rural fringe linked to the city)', 'CBD', 'Industrial core', 'Blue Ridge'] },
  // Government (3)
    { type: 'gov', variant: 'leg', topic: 'Government', hint: 'Legislative = makes laws. Executive = enforces. Judicial = interprets.',
      question: 'Which branch MAKES laws?',
      answer: 'Legislative (Congress)',
      choices: ['Legislative (Congress)', 'Executive (President)', 'Judicial (Courts)', 'State governors only'] },
    { type: 'gov', variant: 'exec', topic: 'Government', hint: 'President = Executive branch.',
      question: 'The President belongs to which branch?',
      answer: 'Executive — enforces laws',
      choices: ['Executive — enforces laws', 'Legislative — makes laws', 'Judicial — interprets laws', 'Electoral College'] },
    { type: 'gov', variant: 'jud', topic: 'Government', hint: 'Courts decide what laws mean.',
      question: 'The Supreme Court’s job is to —',
      answer: 'Interpret laws (Judicial branch)',
      choices: ['Interpret laws (Judicial branch)', 'Make new laws', 'Enforce laws with police', 'Collect taxes'] },
  // Boundaries (2)
    { type: 'boundary', variant: 'natural', topic: 'Boundaries', hint: 'Natural = rivers, mountains. Artificial = straight survey lines.',
      question: 'A river between two countries is a —',
      answer: 'Natural boundary',
      choices: ['Natural boundary', 'Artificial boundary', 'Cultural hearth', 'Command economy'] },
    { type: 'boundary', variant: 'artificial', topic: 'Boundaries', hint: '49th parallel = straight line drawn by treaty.',
      question: 'The dashed line between U.S. and Canada is an —',
      answer: 'Artificial boundary (survey line)',
      choices: ['Artificial boundary (survey line)', 'Natural boundary (river)', 'Mountain range', 'Coastline'] },
  // Great Lakes (3)
    { type: 'lakes', variant: 'sup', topic: 'Great Lakes', hint: 'HOMES = Huron, Ontario, Michigan, Erie, Superior.',
      question: 'Lake A is the largest Great Lake —',
      answer: 'Superior',
      choices: ['Superior', 'Michigan', 'Erie', 'Ontario'] },
    { type: 'lakes', variant: 'mich', topic: 'Great Lakes', hint: 'Michigan is the only Great Lake entirely in the U.S.',
      question: 'Lake B is —',
      answer: 'Michigan',
      choices: ['Michigan', 'Huron', 'Superior', 'Erie'] },
    { type: 'lakes', variant: 'ont', topic: 'Great Lakes', hint: 'HOMES mnemonic for the five lakes.',
      question: 'Which letter is Lake Ontario?',
      answer: 'E',
      choices: ['E', 'A', 'C', 'D'] },
  // Language (2)
    { type: 'language', variant: null, topic: 'Language', hint: 'Romance languages branch from Latin. English has Germanic roots.',
      question: 'Spanish, French, Italian, and Portuguese come from —',
      answer: 'Latin (Romance languages)',
      choices: ['Latin (Romance languages)', 'Germanic roots', 'Greek', 'Arabic'] },
    { type: 'language', variant: null, topic: 'Language', hint: 'See the bottom of the tree.',
      question: 'English has roots in —',
      answer: 'Germanic (Anglo-Saxon), with Latin/French influence',
      choices: ['Germanic (Anglo-Saxon), with Latin/French influence', 'Latin only', 'Chinese', 'Swahili'] },
  // Land/water (1)
    { type: 'landwater', variant: null, topic: 'Resources', hint: 'Coastal countries have ports; landlocked countries depend on neighbors.',
      question: 'Compared to Brazil, Paraguay’s main disadvantage is —',
      answer: 'Landlocked — no direct seaports for trade',
      choices: ['Landlocked — no direct seaports for trade', 'Too much coastline', 'Located on the Equator', 'Has too many mountains'] }
  ];

  const SORT_GAMES = [
    {
      id: 'resources', title: 'Resources',
      buckets: ['Renewable', 'Nonrenewable', 'Inexhaustible'],
      items: [
        { label: 'Coal', bucket: 'Nonrenewable' },
        { label: 'Solar energy', bucket: 'Inexhaustible' },
        { label: 'Oil', bucket: 'Nonrenewable' },
        { label: 'Trees (replanted)', bucket: 'Renewable' },
        { label: 'Wind', bucket: 'Inexhaustible' },
        { label: 'Natural gas', bucket: 'Nonrenewable' },
        { label: 'Fish', bucket: 'Renewable' },
        { label: 'Iron ore', bucket: 'Nonrenewable' },
        { label: 'Sunlight', bucket: 'Inexhaustible' },
        { label: 'Water', bucket: 'Renewable' }
      ]
    },
    {
      id: 'religion', title: 'Religions',
      buckets: ['Monotheistic', 'Polytheistic', 'Animistic'],
      items: [
        { label: 'Christianity', bucket: 'Monotheistic' },
        { label: 'Islam', bucket: 'Monotheistic' },
        { label: 'Judaism', bucket: 'Monotheistic' },
        { label: 'Hinduism', bucket: 'Polytheistic' },
        { label: 'Ancient Greek religion', bucket: 'Polytheistic' },
        { label: 'Indigenous nature spirits', bucket: 'Animistic' },
        { label: 'Shinto (nature kami)', bucket: 'Animistic' }
      ]
    }
  ];

  const MATCH_GAMES = [
    {
      id: 'urban-match', title: 'Urban zones',
      prompts: ['Downtown offices & tallest buildings', 'Stores and restaurants', 'Homes and neighborhoods', 'Factories and warehouses'],
      options: ['CBD', 'Commercial district', 'Residential district', 'Industrial district'],
      answers: ['CBD', 'Commercial district', 'Residential district', 'Industrial district']
    },
    {
      id: 'gov-match', title: 'Government duties',
      prompts: ['Makes laws', 'Enforces laws', 'Interprets laws'],
      options: ['Legislative (Congress)', 'Executive (President)', 'Judicial (Courts)'],
      answers: ['Legislative (Congress)', 'Executive (President)', 'Judicial (Courts)']
    }
  ];

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // --- Visual quiz ---
  let visualOrder = [], visualIdx = 0, visualCorrect = 0, visualAnswered = false;
  let visualTransitionLock = false;

  function resetVisualRevealState() {
    visualAnswered = false;
    const opts = document.getElementById('visual-options');
    if (!opts) return;
    opts.classList.remove('revealed');
    opts.querySelectorAll('label').forEach((l) => {
      l.classList.remove('correct', 'wrong');
      l.style.pointerEvents = '';
    });
    const fb = document.getElementById('visual-feedback');
    if (fb) {
      fb.classList.add('hidden');
      fb.classList.remove('ok', 'no');
      fb.textContent = '';
    }
    const nextBtn = document.getElementById('visual-next');
    if (nextBtn) nextBtn.classList.add('hidden');
  }

  function startVisualQuiz() {
    visualOrder = shuffle(VISUAL_ITEMS.map((_, i) => i));
    visualIdx = 0; visualCorrect = 0;
    document.getElementById('visual-done').classList.add('hidden');
    document.getElementById('visual-card').classList.remove('hidden');
    showVisualQuestion();
  }

  function showVisualQuestion() {
    resetVisualRevealState();
    visualTransitionLock = true;
    const item = VISUAL_ITEMS[visualOrder[visualIdx]];
    const total = visualOrder.length;

    document.getElementById('visual-hint').innerHTML = `<strong>${item.topic}</strong> — ${item.hint}`;
    document.getElementById('visual-topic').textContent = item.topic;
    document.getElementById('quiz-visual-container').innerHTML = diagramFor(item, null);
    document.getElementById('visual-question').textContent = item.question;
    document.getElementById('visual-num').textContent = `Question ${visualIdx + 1} of ${total}`;
    document.getElementById('visual-score').textContent = `Score: ${visualCorrect} / ${visualIdx}`;
    document.getElementById('visual-bar').style.width = `${(visualIdx / total) * 100}%`;

    const opts = document.getElementById('visual-options');
    opts.innerHTML = '';
    // Unique group per question — reusing name="visual" makes the browser restore a prior pick.
    const radioName = `visual-q${visualOrder[visualIdx]}`;
    shuffle([...item.choices]).forEach(text => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = radioName;
      input.value = text;
      input.autocomplete = 'off';
      label.appendChild(input);
      label.appendChild(document.createTextNode(text));
      label.addEventListener('click', (e) => {
        if (visualAnswered || visualTransitionLock) return;
        e.stopPropagation();
        if (e.target.tagName !== 'INPUT') input.checked = true;
        pickVisual(input.value, item.answer, label, item);
      });
      opts.appendChild(label);
    });
    opts.querySelectorAll('input[type="radio"]').forEach((inp) => {
      inp.checked = false;
      inp.defaultChecked = false;
    });
    const form = document.getElementById('visual-card');
    if (form && typeof form.reset === 'function') form.reset();
    requestAnimationFrame(() => {
      visualTransitionLock = false;
    });
  }

  function pickVisual(selected, correct, labelEl, item) {
    if (visualAnswered || visualTransitionLock) return;
    visualAnswered = true;
    const opts = document.getElementById('visual-options');
    opts.classList.add('revealed');
    opts.querySelectorAll('label').forEach(l => {
      const v = l.querySelector('input').value;
      l.classList.remove('correct', 'wrong');
      if (v === correct) l.classList.add('correct');
      else if (l === labelEl && selected !== correct) l.classList.add('wrong');
      l.style.pointerEvents = 'none';
    });
    const ok = selected === correct;
    if (ok) visualCorrect++;

    const rk = revealKeyFor(item);
    if (rk) {
      document.getElementById('quiz-visual-container').innerHTML = diagramFor(item, rk);
    }

    const fb = document.getElementById('visual-feedback');
    fb.classList.remove('hidden', 'ok', 'no');
    fb.classList.add(ok ? 'ok' : 'no');
    fb.textContent = ok ? 'Correct!' : 'Not quite. The correct choice is highlighted in green.';
    document.getElementById('visual-score').textContent = `Score: ${visualCorrect} / ${visualIdx + 1}`;
    // Defer so the same click that picked an answer cannot hit "Next question".
    requestAnimationFrame(() => {
      document.getElementById('visual-next').classList.remove('hidden');
    });
  }

  document.getElementById('visual-next').onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    resetVisualRevealState();
    visualIdx++;
    if (visualIdx >= visualOrder.length) {
      document.getElementById('visual-card').classList.add('hidden');
      const done = document.getElementById('visual-done');
      const pct = Math.round((visualCorrect / visualOrder.length) * 100);
      done.classList.remove('hidden');
      done.innerHTML = `Done!<br><strong>${visualCorrect} / ${visualOrder.length}</strong> (${pct}%)<br><span style="font-size:0.95rem;color:var(--muted)">${pct >= 80 ? 'Great charts practice!' : 'Review diagrams and try again.'}</span>`;
      document.getElementById('visual-bar').style.width = '100%';
      return;
    }
    showVisualQuestion();
  };
  document.getElementById('visual-restart').onclick = startVisualQuiz;

  // --- Sort & match ---
  let activeSortGame = SORT_GAMES[0].id;
  let selectedChip = null;
  let placements = {};

  function sortMissFeedback(ok, total, misses, perfectMsg) {
    if (ok === total) return perfectMsg;
    const head = `${ok} / ${total} correct.`;
    if (!misses.length) return head;
    return head + '\n\n' + misses.map((m) => `• ${m}`).join('\n');
  }

  function renderSortGame(game) {
    placements = {};
    selectedChip = null;
    const area = document.getElementById('sort-game-area');
    if (game.prompts) {
      area.innerHTML = `<h3 style="margin:0 0 0.75rem;color:var(--accent)">${game.title}</h3>
        <div class="match-pairs" id="match-rows"></div>
        <button type="button" class="btn primary" id="match-check" style="margin-top:1rem">Check answers</button>
        <div class="feedback hidden" id="match-feedback"></div>`;
      const rows = document.getElementById('match-rows');
      game.prompts.forEach((prompt, i) => {
        const row = document.createElement('div');
        row.className = 'match-row';
        row.innerHTML = `<span>${prompt}</span>`;
        const sel = document.createElement('select');
        sel.dataset.idx = i;
        sel.innerHTML = '<option value="">— choose —</option>' +
          shuffle([...game.options]).map(o => `<option value="${o}">${o}</option>`).join('');
        row.appendChild(sel);
        rows.appendChild(row);
      });
      document.getElementById('match-check').onclick = () => {
        let ok = 0;
        const misses = [];
        rows.querySelectorAll('select').forEach((sel, i) => {
          const good = sel.value === game.answers[i];
          if (good) ok++;
          else {
            const prompt = game.prompts[i];
            const answer = game.answers[i];
            if (sel.value) misses.push(`${prompt} → ${answer} (you chose: ${sel.value})`);
            else misses.push(`${prompt} → ${answer}`);
          }
          sel.classList.toggle('correct', good && sel.value);
          sel.classList.toggle('wrong', !good && sel.value);
        });
        const fb = document.getElementById('match-feedback');
        fb.classList.remove('hidden', 'ok', 'no');
        fb.classList.add(ok === game.answers.length ? 'ok' : 'no');
        fb.textContent = sortMissFeedback(ok, game.answers.length, misses, 'All correct!');
      };
      return;
    }

    area.innerHTML = `<h3 style="margin:0 0 0.75rem;color:var(--accent)">${game.title}</h3>
      <p class="sort-pool-label">Click a term, then click its category:</p>
      <div class="sort-pool" id="sort-pool"></div>
      <div class="sort-buckets" id="sort-buckets"></div>
      <button type="button" class="btn primary" id="sort-check">Check sorting</button>
      <button type="button" class="btn" id="sort-reset" style="margin-left:0.5rem">Reset</button>
      <div class="feedback hidden" id="sort-feedback"></div>`;

    const pool = document.getElementById('sort-pool');
    shuffle(game.items.map((_, i) => i)).forEach(i => {
      const chip = document.createElement('span');
      chip.className = 'sort-chip';
      chip.textContent = game.items[i].label;
      chip.dataset.idx = i;
      chip.onclick = () => {
        document.querySelectorAll('.sort-chip').forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
        selectedChip = chip;
      };
      pool.appendChild(chip);
    });

    const bucketsEl = document.getElementById('sort-buckets');
    game.buckets.forEach(b => {
      const div = document.createElement('div');
      div.className = 'sort-bucket';
      div.dataset.bucket = b;
      div.innerHTML = `<h3>${b}</h3><div class="bucket-items"></div>`;
      div.onclick = () => {
        if (!selectedChip || selectedChip.classList.contains('placed')) return;
        div.querySelector('.bucket-items').appendChild(selectedChip);
        selectedChip.classList.add('placed');
        selectedChip.classList.remove('selected');
        placements[selectedChip.dataset.idx] = b;
        selectedChip = null;
      };
      bucketsEl.appendChild(div);
    });

    document.getElementById('sort-reset').onclick = () => renderSortGame(game);
    document.getElementById('sort-check').onclick = () => {
      let ok = 0;
      const misses = [];
      game.items.forEach((item, i) => {
        const chips = document.querySelectorAll('.sort-chip');
        const chip = [...chips].find(c => c.dataset.idx === String(i));
        if (!chip) return;
        const placed = placements[i];
        const good = placed === item.bucket;
        if (good) ok++;
        else {
          if (placed) misses.push(`${item.label} → ${item.bucket} (you put: ${placed})`);
          else misses.push(`${item.label} → ${item.bucket} (not placed)`);
        }
        chip.classList.toggle('right-place', good);
        chip.classList.toggle('wrong-place', placed && !good);
      });
      const fb = document.getElementById('sort-feedback');
      fb.classList.remove('hidden', 'ok', 'no');
      fb.classList.add(ok === game.items.length ? 'ok' : 'no');
      fb.textContent = sortMissFeedback(ok, game.items.length, misses, 'Perfect sort!');
    };
  }

  const tabsEl = document.getElementById('sort-game-tabs');
  [...SORT_GAMES, ...MATCH_GAMES].forEach(g => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn';
    btn.textContent = g.title;
    btn.dataset.id = g.id;
    btn.onclick = () => {
      activeSortGame = g.id;
      tabsEl.querySelectorAll('button').forEach(b => b.classList.toggle('primary', b.dataset.id === g.id));
      const game = [...SORT_GAMES, ...MATCH_GAMES].find(x => x.id === g.id);
      renderSortGame(game);
    };
    tabsEl.appendChild(btn);
  });
  tabsEl.querySelector('button').classList.add('primary');
  renderSortGame(SORT_GAMES[0]);

  let visualQuizStarted = false;
  document.querySelector('nav button[data-panel="visual"]').addEventListener('click', () => {
    if (!visualQuizStarted) {
      visualQuizStarted = true;
      startVisualQuiz();
    }
  });
})();

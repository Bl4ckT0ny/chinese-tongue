import type { AppData, Point, SoundGroup } from './types.js';
import { tongueD, velumD } from './geometry.js';

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
function ease(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function required<T extends Element>(el: T | null, what: string): T {
  if (!el) throw new Error(`mount(): expected element not found: ${what}`);
  return el;
}

export function mount(data: AppData): void {
  document.title = data.meta.htmlTitle;
  document.documentElement.lang = data.lang;

  const root = required(document.getElementById('app'), '#app');
  root.innerHTML = `
    <div class="wrap">
      <div class="lang-switch">
        <a href="ru.html" class="${data.lang === 'ru' ? 'active' : ''}">RU</a>
        <a href="en.html" class="${data.lang === 'en' ? 'active' : ''}">EN</a>
        <a href="zh-CN.html" class="${data.lang === 'zh-CN' ? 'active' : ''}">中文</a>
      </div>
      <header>
        <div class="eyebrow">${data.ui.eyebrow}</div>
        <h1>${data.ui.h1}</h1>
        <p class="sub">${data.ui.sub}</p>
      </header>

      <div class="tabs">
        <button class="tab active" data-tab="initials">${data.ui.tabInitials}</button>
        <button class="tab" data-tab="finals">${data.ui.tabFinals}</button>
      </div>

      <div class="layout">
        <div class="diagram-card">
          <div class="diagram-head">
            <span class="diagram-title">${data.ui.diagramTitle}</span>
            <span class="diagram-current" id="currentLabel"></span>
          </div>

          <svg viewBox="0 0 640 440" xmlns="http://www.w3.org/2000/svg">
            <path class="contour" d="M 92 96 Q 130 76 185 80 Q 250 84 300 98" opacity="0.55"/>
            <path class="nasal-air" id="nasalAir" d="M 300 108 Q 260 96 200 92 Q 150 90 115 100"/>

            <path id="tongue" class="tongue-shape" d=""/>

            <path class="contour" d="
              M 56 150
              Q 76 140 96 142
              L 122 142
              Q 128 126 140 138
              Q 165 100 232 92
              Q 280 88 300 98
            "/>
            <g class="teeth">
              <rect x="94" y="142" width="9" height="17" rx="1.5"/>
              <rect x="104" y="140" width="9" height="19" rx="1.5"/>
              <rect x="114" y="139" width="9" height="20" rx="1.5"/>
            </g>

            <path id="velum" class="velum" d=""/>

            <path class="contour" d="M 300 98 Q 380 130 392 220 Q 398 300 388 370 Q 384 400 362 415"/>

            <path class="contour" d="M 56 224 Q 74 234 96 230 L 122 230"/>
            <g class="teeth">
              <rect x="94" y="214" width="9" height="17" rx="1.5"/>
              <rect x="104" y="213" width="9" height="18" rx="1.5"/>
              <rect x="114" y="212" width="9" height="19" rx="1.5"/>
            </g>

            <g id="marker">
              <circle class="marker-ring" r="9"/>
              <circle class="marker-dot" r="3.2"/>
            </g>

            <!-- anatomy labels are centered on the endpoints of their callouts -->
            <line class="anat-line" x1="150" y1="82" x2="162" y2="34"/>
            <text class="anat-label" x="162" y="28" text-anchor="middle">${data.ui.labels.nasalCavity}</text>

            <line class="anat-line" x1="312" y1="103" x2="430" y2="60"/>
            <text class="anat-label" x="430" y="30" text-anchor="middle">
              <tspan x="430" dy="0">${data.ui.labels.softPalate}</tspan>
              <tspan x="430" dy="17" style="font-size:11px;opacity:.75">${data.ui.labels.velumSub}</tspan>
            </text>

            <line class="anat-line" x1="122" y1="116" x2="66" y2="62"/>
            <text class="anat-label" x="66" y="56" text-anchor="middle">${data.ui.labels.alveolarRidge}</text>

            <line class="anat-line" x1="222" y1="90" x2="222" y2="66"/>
            <text class="anat-label" x="222" y="62" text-anchor="middle">${data.ui.labels.hardPalate}</text>

            <line class="anat-line" data-anatomy-leader="teeth" x1="108" y1="150" x2="76" y2="132"/>
            <text class="anat-label" data-anatomy-label="teeth" x="66" y="126" text-anchor="middle">${data.ui.labels.teeth}</text>

            <line class="anat-line" data-anatomy-leader="lips" x1="66" y1="228" x2="42" y2="286"/>
            <text class="anat-label" data-anatomy-label="lips" x="42" y="304" text-anchor="middle">${data.ui.labels.lips}</text>

            <line class="anat-line" data-anatomy-leader="pharynx" x1="392" y1="286" x2="470" y2="304"/>
            <text class="anat-label" data-anatomy-label="pharynx" x="470" y="328" text-anchor="middle">${data.ui.labels.pharynx}</text>
          </svg>

          <div class="legend">
            <span><i style="background:var(--tongue)"></i>${data.ui.legend.tongue}</span>
            <span><i style="background:var(--amber)"></i>${data.ui.legend.contactPoint}</span>
            <span><i style="background:var(--line-dim)"></i>${data.ui.legend.anatomy}</span>
          </div>
        </div>

        <div>
          <div class="groups" id="groups"></div>
          <div class="info-card" id="infoCard"></div>
          <p class="hint" id="hintText"></p>
        </div>
      </div>
    </div>
  `;

  const tongueEl = required(document.getElementById('tongue'), '#tongue') as unknown as SVGPathElement;
  const velumEl = required(document.getElementById('velum'), '#velum') as unknown as SVGPathElement;
  const nasalAirEl = required(document.getElementById('nasalAir'), '#nasalAir');
  const markerEl = required(document.getElementById('marker'), '#marker');
  const currentLabel = required(document.getElementById('currentLabel'), '#currentLabel');
  const groupsEl = required(document.getElementById('groups'), '#groups');
  const infoCard = required(document.getElementById('infoCard'), '#infoCard');
  const hintText = required(document.getElementById('hintText'), '#hintText');
  const tabs = document.querySelectorAll<HTMLButtonElement>('.tab');

  let current: SoundGroup | null = null;
  let animFrame = 0;
  let velumOpen = false;

  function animateTo(g: SoundGroup): void {
    if (animFrame) cancelAnimationFrame(animFrame);
    const startTop: Point[] = (current ? current.top : g.top).map((p) => ({ ...p }));
    const startMarker: Point = { ...(current ? current.marker : g.marker) };
    const startVelumOpen = velumOpen;
    const targetVelumOpen = g.velum;
    const startTime = performance.now();
    const duration = 400;

    function step(now: number): void {
      const t = Math.min(1, (now - startTime) / duration);
      const e = ease(t);
      const interpTop = g.top.map((p, i) => ({
        x: lerp(startTop[i].x, p.x, e),
        y: lerp(startTop[i].y, p.y, e)
      })) as [Point, Point, Point, Point, Point, Point];
      tongueEl.setAttribute('d', tongueD(interpTop));

      const mx = lerp(startMarker.x, g.marker.x, e);
      const my = lerp(startMarker.y, g.marker.y, e);
      markerEl.setAttribute('transform', `translate(${mx},${my})`);
      markerEl.classList.toggle('marker-nocontact', g.noContact);

      const velT = startVelumOpen === targetVelumOpen ? (targetVelumOpen ? 1 : 0) : e;
      const velState = lerp(startVelumOpen ? 1 : 0, targetVelumOpen ? 1 : 0, e);
      velumEl.setAttribute('d', velumD(velState > 0.5));
      nasalAirEl.classList.toggle('on', velT > 0.6 && targetVelumOpen);

      if (t < 1) {
        animFrame = requestAnimationFrame(step);
      } else {
        velumOpen = targetVelumOpen;
      }
    }
    animFrame = requestAnimationFrame(step);
  }

  function renderInfo(g: SoundGroup): void {
    currentLabel.textContent = g.pinyin;
    infoCard.innerHTML = `
      <div class="info-kicker">${g.pinyin}</div>
      <h3 class="info-title">${g.title}</h3>
      <p class="info-body">${g.body}</p>
      <div class="example">${g.example}</div>
    `;
  }

  function buildGroupButtons(list: SoundGroup[]): void {
    groupsEl.innerHTML = '';
    list.forEach((g) => {
      const btn = document.createElement('button');
      btn.className = 'group-btn';
      btn.dataset.id = g.id;
      btn.innerHTML = `<div class="group-pinyin">${g.pinyin}</div><div class="group-name">${g.name}</div>`;
      btn.addEventListener('click', () => select(g));
      groupsEl.appendChild(btn);
    });
  }

  function select(g: SoundGroup): void {
    current = g;
    animateTo(g);
    renderInfo(g);
    [...groupsEl.children].forEach((b) => b.classList.toggle('active', (b as HTMLElement).dataset.id === g.id));
  }

  function activateTab(tabName: string): void {
    tabs.forEach((t) => t.classList.toggle('active', t.dataset.tab === tabName));
    const list = tabName === 'initials' ? data.initials : data.finals;
    buildGroupButtons(list);
    hintText.textContent = tabName === 'initials' ? data.ui.hintInitials : data.ui.hintFinals;
    select(list[0]);
  }

  tabs.forEach((t) => t.addEventListener('click', () => activateTab(t.dataset.tab ?? 'initials')));

  let pulseT = 0;
  function pulse(): void {
    pulseT += 0.045;
    const ring = required(markerEl.querySelector('.marker-ring'), '.marker-ring');
    const scale = 1 + Math.sin(pulseT) * 0.28;
    ring.setAttribute('r', String(9 * scale));
    ring.setAttribute('opacity', String(0.55 + Math.sin(pulseT) * 0.35));
    requestAnimationFrame(pulse);
  }
  pulse();

  activateTab('initials');
}

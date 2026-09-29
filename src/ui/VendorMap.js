// Mapa 2D dos vendors a partir das coordenadas X,Y (sem depender da planta).
// Andares: T térreo, S superior, 3 terceiro nível.

import { normalizedVendors } from '../data/mp.schema.js';

const SVG = 'http://www.w3.org/2000/svg';
const FLOORS = [['T', 'Térreo'], ['S', 'Superior'], ['3', '3º nível']];
const AREAS = {
  S: 'Salão', F: 'Fundos', H: 'Hall Sete de Setembro', A: 'Anexo', O: 'Orgânicos',
  G: 'Galeria superior', K: 'Praça Karan', D: 'Praças Déa/7 de Setembro', R: 'Restaurantes G. Carneiro', N: '3º nível',
};
const AREA_KEYS = Object.keys(AREAS);

const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export class VendorMap {
  constructor(root) {
    this.vendors = normalizedVendors;
    this.floor = 'T';
    this.selectedId = null;
    this.box = null;

    this.el = document.createElement('section');
    this.el.className = 'vmap';
    this.el.hidden = true;
    this.el.innerHTML = `
      <div class="vmap-side">
        <div class="vmap-head"><h2>Mapa dos vendors</h2><button class="vmap-close" aria-label="Fechar">×</button></div>
        <input class="vmap-search" type="search" placeholder="Buscar nome, categoria, telefone…" />
        <div class="vmap-tabs"></div>
        <select class="vmap-cat"></select>
        <p class="vmap-count"></p>
        <div class="vmap-detail" hidden></div>
        <ul class="vmap-list"></ul>
      </div>
      <svg class="vmap-svg" role="img" aria-label="Mapa dos vendors"></svg>`;
    root.appendChild(this.el);

    this.svg = this.el.querySelector('.vmap-svg');
    this.search = this.el.querySelector('.vmap-search');
    this.catSelect = this.el.querySelector('.vmap-cat');
    this.tabs = this.el.querySelector('.vmap-tabs');
    this.count = this.el.querySelector('.vmap-count');
    this.detail = this.el.querySelector('.vmap-detail');
    this.list = this.el.querySelector('.vmap-list');

    this.el.querySelector('.vmap-close').addEventListener('click', () => this.hide());
    this.search.addEventListener('input', () => this.render());
    this.catSelect.addEventListener('change', () => this.render());
    this.buildTabs();
    this.buildCategories();
    this.bindPanZoom();
  }

  show() { this.el.hidden = false; this.render(); this.search.focus({ preventScroll: true }); }
  hide() { this.el.hidden = true; }
  toggle() { this.el.hidden ? this.show() : this.hide(); }

  buildTabs() {
    for (const [key, label] of FLOORS) {
      const b = document.createElement('button');
      b.textContent = label;
      b.dataset.floor = key;
      b.addEventListener('click', () => { this.floor = key; this.selectedId = null; this.render(); });
      this.tabs.append(b);
    }
  }

  buildCategories() {
    const cats = [...new Set(this.vendors.map((v) => v.category))].sort((a, b) => a.localeCompare(b, 'pt-BR'));
    this.catSelect.append(new Option('Todas as categorias', ''));
    for (const c of cats) this.catSelect.append(new Option(c, c));
  }

  filtered() {
    const q = norm(this.search.value.trim());
    const cat = this.catSelect.value;
    return this.vendors.filter((v) => {
      if (v.floor !== this.floor) return false;
      if (cat && v.category !== cat) return false;
      if (!q) return true;
      return norm(`${v.nome} ${v.box_number ?? ''} ${v.category} ${v.contact_raw ?? ''}`).includes(q);
    });
  }

  render() {
    for (const b of this.tabs.children) b.classList.toggle('on', b.dataset.floor === this.floor);
    const floorVendors = this.vendors.filter((v) => v.floor === this.floor);
    const shown = this.filtered();
    const shownIds = new Set(shown.map((v) => v.id));
    this.count.textContent = `${shown.length} de ${floorVendors.length} neste andar`;

    this.list.replaceChildren(...shown.slice(0, 60).map((v) => {
      const li = document.createElement('li');
      const b = document.createElement('button');
      b.textContent = v.nome;
      b.title = v.category;
      b.addEventListener('click', () => this.select(v.id));
      li.append(b);
      return li;
    }));

    this.drawMap(floorVendors, shownIds);
    this.renderDetail();
  }

  drawMap(floorVendors, shownIds) {
    const xs = floorVendors.map((v) => v.coordinates.x);
    const ys = floorVendors.map((v) => v.coordinates.y);
    const pad = 4;
    const base = {
      x: Math.min(...xs) - pad, y: -(Math.max(...ys) + pad),
      w: Math.max(...xs) - Math.min(...xs) + pad * 2, h: Math.max(...ys) - Math.min(...ys) + pad * 2,
    };
    if (!this.box || this.box.floor !== this.floor) this.box = { ...base, floor: this.floor, base };
    this.applyBox();

    this.svg.replaceChildren();
    const r = Math.max(base.w, base.h) / 110;
    for (const v of floorVendors) {
      const dim = !shownIds.has(v.id);
      const c = document.createElementNS(SVG, 'circle');
      c.setAttribute('cx', v.coordinates.x);
      c.setAttribute('cy', -v.coordinates.y);
      c.setAttribute('r', v.id === this.selectedId ? r * 2 : r);
      c.setAttribute('class', `vmap-dot${dim ? ' dim' : ''}${v.id === this.selectedId ? ' sel' : ''}`);
      c.style.fill = `hsl(${(AREA_KEYS.indexOf(v.area) * 36) % 360} 70% 60%)`;
      const t = document.createElementNS(SVG, 'title');
      t.textContent = `${v.nome} · ${v.category}`;
      c.append(t);
      c.addEventListener('click', (e) => { e.stopPropagation(); this.select(v.id); });
      this.svg.append(c);
    }
  }

  applyBox() {
    const { x, y, w, h } = this.box;
    this.svg.setAttribute('viewBox', `${x} ${y} ${w} ${h}`);
  }

  select(id) {
    this.selectedId = id;
    this.render();
  }

  renderDetail() {
    const v = this.vendors.find((o) => o.id === this.selectedId && o.floor === this.floor);
    this.detail.hidden = !v;
    if (!v) return;
    this.detail.replaceChildren();
    const h = document.createElement('h3');
    h.textContent = v.nome;
    const meta = document.createElement('p');
    meta.className = 'vmap-meta';
    meta.textContent = [v.box_number, v.category, AREAS[v.area]].filter(Boolean).join(' · ');
    this.detail.append(h, meta);
    const links = [
      ...(v.phone ?? []).map((p) => [p, `tel:${p.replace(/\D/g, '')}`]),
      ...(v.instagram ?? []).map((ig) => [ig, `https://instagram.com/${ig.slice(1)}`]),
      ...(v.website ?? []).map((w) => [w, `https://${w}`]),
    ];
    if (!links.length) {
      const p = document.createElement('p');
      p.className = 'vmap-meta';
      p.textContent = 'Sem contato cadastrado.';
      this.detail.append(p);
    }
    for (const [text, href] of links) {
      const a = document.createElement('a');
      a.textContent = text;
      a.href = href;
      if (href.startsWith('http')) { a.target = '_blank'; a.rel = 'noopener'; }
      this.detail.append(a);
    }
  }

  bindPanZoom() {
    let drag = null;
    this.svg.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (!this.box) return;
      const k = e.deltaY > 0 ? 1.15 : 1 / 1.15;
      const rect = this.svg.getBoundingClientRect();
      const px = this.box.x + ((e.clientX - rect.left) / rect.width) * this.box.w;
      const py = this.box.y + ((e.clientY - rect.top) / rect.height) * this.box.h;
      this.box.x = px - (px - this.box.x) * k;
      this.box.y = py - (py - this.box.y) * k;
      this.box.w *= k;
      this.box.h *= k;
      this.applyBox();
    }, { passive: false });
    this.svg.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, y: e.clientY }; this.svg.setPointerCapture(e.pointerId); });
    this.svg.addEventListener('pointermove', (e) => {
      if (!drag || !this.box) return;
      const rect = this.svg.getBoundingClientRect();
      this.box.x -= ((e.clientX - drag.x) / rect.width) * this.box.w;
      this.box.y -= ((e.clientY - drag.y) / rect.height) * this.box.h;
      drag = { x: e.clientX, y: e.clientY };
      this.applyBox();
    });
    this.svg.addEventListener('pointerup', () => { drag = null; });
  }
}

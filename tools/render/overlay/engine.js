// Frame-Sliced Design overlay engine
// Reads window.TIMELINE and window.BRAND, builds the overlay DOM and exposes
// window.setTime(t) which draws the overlay for time t (seconds).
(function () {
  const TL = window.TIMELINE || {};
  const BRAND = window.BRAND || {};
  const A = TL.assets || {};
  const root = document.documentElement.style;
  const C = BRAND.color || {};
  if (C.primary) root.setProperty('--primary', C.primary);
  if (C.ink) root.setProperty('--ink', C.ink);
  if (C.paper) root.setProperty('--paper', C.paper);
  if (C.error) root.setProperty('--error', C.error);
  if (C.muted) root.setProperty('--muted', C.muted);
  if (BRAND.font && BRAND.font.family) root.setProperty('--font', BRAND.font.family + ',system-ui,sans-serif');

  // ---------- base layer (footage) ----------
  // Used when rendering final frames: the footage frame sits under the overlay,
  // zoomed around the face anchor and color-matched with an SVG transfer filter.
  if (window.BASE) {
    const W = 1080, H = 1920, fy = (TL.zoom && TL.zoom.anchorY) || 0.34;
    document.body.insertAdjacentHTML('afterbegin',
      `<svg width="0" height="0" style="position:absolute"><filter id="grade" color-interpolation-filters="sRGB">` +
      `<feComponentTransfer><feFuncR id="gR" type="linear" slope="1" intercept="0"/><feFuncG id="gG" type="linear" slope="1" intercept="0"/>` +
      `<feFuncB id="gB" type="linear" slope="1" intercept="0"/></feComponentTransfer></filter></svg>` +
      `<img id="base" style="position:absolute;left:0;top:0;width:${W}px;height:${H}px;transform-origin:${W / 2}px ${H * fy}px;filter:url(#grade)">`);
    document.body.style.background = '#000';
    const img = document.getElementById('base');
    window.setBase = (src, zoom, grade) => new Promise(res => {
      img.style.transform = `scale(${zoom})`;
      const g = grade || { slope: [1, 1, 1], intercept: [0, 0, 0] };
      ['gR', 'gG', 'gB'].forEach((id, i) => { const f = document.getElementById(id); f.setAttribute('slope', g.slope[i]); f.setAttribute('intercept', g.intercept[i]); });
      if (img.getAttribute('src') === src) return res();
      img.onload = () => res(); img.onerror = () => res(); img.src = src;
    });
  }

  // ---------- helpers ----------
  const clamp = x => Math.max(0, Math.min(1, x));
  const ease = x => (x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
  const outBack = (x, c1 = 1.15) => { const c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
  function env(t, s, e, inD = 0.3, outD = 0.22) {
    if (t < s || t > e) return null;
    const a = clamp((t - s) / inD), b = clamp((e - t) / outD);
    if (a < 1) { const k = outBack(a); return { o: clamp(a * 1.8), sc: 0.82 + 0.18 * k, ty: 70 * (1 - k), a }; }
    if (b < 1) { const k = (1 - b) * (1 - b); return { o: 1 - k, sc: 1 - 0.08 * k, ty: 30 * k, a: 1 }; }
    return { o: 1, sc: 1, ty: 0, a: 1 };
  }
  function apply(el, v, extra = '') {
    if (!v) { el.style.opacity = 0; return; }
    el.style.opacity = v.o; el.style.transform = `translateY(${v.ty}px) scale(${v.sc}) ${extra}`;
  }
  function el(cls, html, style) {
    const d = document.createElement('div'); d.className = 'abs ' + cls;
    if (html != null) d.innerHTML = html; if (style) d.setAttribute('style', style);
    document.body.appendChild(d); return d;
  }
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const tone = n => ({ primary: 'var(--primary)', ink: 'var(--ink)', error: 'var(--error)' }[n] || n || 'var(--primary)');
  const draws = [];   // functions (t) => void, drawn in order
  const hideRanges = (TL.captions && TL.captions.hide) ? TL.captions.hide.slice() : [];

  // ---------- screen-moment (phone) ----------
  const POS = {
    'left': { L: 40, T: 640, S: 0.9 },
    'top-right': { L: 684, T: 235, S: 0.8 },
    'top-left': { L: 40, T: 235, S: 0.8 },
    'right': { L: 600, T: 640, S: 0.9 },
  };
  const BIG = Object.assign({ L: 226, T: 90, S: 1.4 }, TL.phoneBig || {});
  const phones = TL.screenMoments || [];
  const state = { phoneOn: false, big: 0, anchor: null };
  if (phones.length) {
    const ph = el('phone', '<div class="scr"></div>'); const scr = ph.firstChild;
    const imgs = {};
    const names = new Set(); phones.forEach(p => p.screens.forEach(s => names.add(s[0])));
    names.forEach(n => { const i = document.createElement('img'); i.src = A[n]; scr.appendChild(i); imgs[n] = i; });
    const taps = phones.filter(p => p.tap).map(p => { const d = document.createElement('div'); d.className = 'tap'; d.style.left = p.tap.x + 'px'; d.style.top = p.tap.y + 'px'; scr.appendChild(d); return [p.tap.at, d]; });
    draws.push(t => {
      let on = null;
      for (const p of phones) { const v = env(t, p.from, p.to); if (v) { on = [p, v]; break; } }
      for (const n in imgs) imgs[n].style.opacity = 0;
      state.phoneOn = !!on; state.big = 0; state.anchor = on ? (on[0].anchor || 'left') : null;
      if (on) {
        const [p, v] = on; const P0 = POS[p.anchor || 'left'];
        const BK = p.grow != null ? ease(clamp((t - p.grow) / 0.55)) : 0; state.big = BK;
        let s = P0.S + (BIG.S - P0.S) * BK, x = P0.L + (BIG.L - P0.L) * BK, y = P0.T + (BIG.T - P0.T) * BK;
        x += 448 * s * (1 - v.sc) / 2; y += 974 * s * (1 - v.sc) / 2 + v.ty; s *= v.sc;
        ph.style.opacity = v.o; ph.style.transform = `translate(${x}px,${y}px) scale(${s})`;
        const L = p.screens; let cur = 0; for (let i = 0; i < L.length; i++) if (t >= L[i][1]) cur = i;
        imgs[L[cur][0]].style.opacity = 1;
        if (cur > 0) { const k = clamp((t - L[cur][1]) / 0.12); if (k < 1) { imgs[L[cur - 1][0]].style.opacity = 1; imgs[L[cur][0]].style.opacity = k; } }
      } else ph.style.opacity = 0;
      for (const [at, d] of taps) {
        if (t >= at - 0.25 && t <= at + 0.3) { const x = t - at; d.style.opacity = x < 0 ? clamp((x + 0.25) / 0.1) : clamp(1 - x / 0.3); d.style.transform = `scale(${x < 0 ? 1 : 1 + x * 2.2})`; }
        else d.style.opacity = 0;
      }
    });
  }

  // ---------- hook ----------
  const hook = TL.hook;
  if (hook && hook.type === 'kinetic-labels') {
    const tops = [200, 305, 410, 515], rots = [-2, 1.5, -1.5, 1];
    hook.lines.forEach((ln, i) => {
      const d = el('hookline', `<span class="hl ${ln.style || 'ink'}">${esc(ln.text)}</span>`, `top:${ln.top || tops[i % 4]}px`);
      const rot = ln.rotate != null ? ln.rotate : rots[i % 4];
      draws.push(t => apply(d, env(t, ln.at, hook.until, i === 0 ? 0.18 : 0.25, 0.2), `rotate(${rot}deg)`));
    });
    hideRanges.push([0, hook.until + 0.1]);
  }

  // ---------- emphasis ----------
  for (const e of (TL.emphasis || [])) {
    if (e.type === 'stamp') {
      const d = el('stamp', `<div class="a">${esc(e.top || '')}</div><div class="b">${esc(e.big || '')}</div>`, `left:${e.x != null ? e.x : 620}px;top:${e.y != null ? e.y : 1080}px`);
      draws.push(t => {
        const v = env(t, e.from, e.to, 0.22, 0.2);
        if (!v) { d.style.opacity = 0; return; }
        const k = v.a < 1 ? (2.2 - 1.2 * outBack(v.a, 2.2)) : v.sc;
        d.style.opacity = v.o; d.style.transform = `scale(${k}) rotate(${-12 + 8 * (1 - clamp(v.a))}deg)`;
      });
    } else if (e.type === 'big-kinetic') {
      const html = e.lines.map((l, i) => `<span class="t${i === e.accent ? ' accent' : ''}">${esc(l)}</span>`).join('<br>');
      const d = el('big', html, `top:${e.top || 1020}px`);
      draws.push(t => {
        const v = env(t, e.from, e.to, 0.25, 0.2);
        if (!v) { d.style.opacity = 0; return; }
        const wob = Math.sin((t - e.from) * 18) * 2 * (1 - clamp((t - e.from) / 0.8));
        d.style.opacity = v.o; d.style.transform = `scale(${v.sc}) rotate(${wob}deg)`;
      });
      hideRanges.push([e.from - 0.1, e.to + 0.05]);
    } else if (e.type === 'stacked-chips') {
      const top0 = e.top || 980, gap = e.gap || 150;
      e.items.forEach((it, i) => {
        const d = el('chip', `<div class="ic" style="background:${tone(it.tone)}">${esc(it.icon)}</div><div class="tx">${esc(it.text)}</div>`, `top:${top0 + i * gap}px`);
        draws.push(t => {
          const v = env(t, it.at, e.to, 0.3, 0.25);
          if (!v) { d.style.opacity = 0; return; }
          d.style.opacity = v.o; d.style.transform = `translateX(${-120 * (1 - outBack(clamp(v.a)))}px) scale(${v.sc})`;
        });
      });
      hideRanges.push([e.items[0].at - 0.12, e.to + 0.05]);
    } else if (e.type === 'sticker') {
      const d = el('sticker', `${esc(e.text)}${e.sub ? `<small>${esc(e.sub)}</small>` : ''}`, `left:${e.x != null ? e.x : 40}px;top:${e.y != null ? e.y : 430}px`);
      draws.push(t => {
        const v = env(t, e.from, e.to, 0.28, 0.22);
        if (!v) { d.style.opacity = 0; return; }
        const k = v.a < 1 ? outBack(v.a, 2.4) : 1;
        d.style.opacity = v.o; d.style.transform = `scale(${v.a < 1 ? 0.3 + 0.7 * k : v.sc}) rotate(${-8 + Math.sin(t * 2.2) * 1.5}deg)`;
      });
    } else if (e.type === 'page-flip') {
      const d = el('cal', `<div class="h">${esc(e.header)}</div><div class="d">${esc(e.mark || '✓')}</div><div class="s">${esc(e.sub || '')}</div>`, e.top ? `top:${e.top}px` : null);
      draws.push(t => {
        const v = env(t, e.from, e.to, 0.3, 0.25);
        if (!v) { d.style.opacity = 0; return; }
        d.style.opacity = v.o; d.style.transform = `perspective(1200px) rotateX(${(1 - clamp(v.a)) * -70}deg) scale(${v.sc})`;
      });
      hideRanges.push([e.from - 0.1, e.to + 0.05]);
    }
  }

  // ---------- badge ----------
  if (TL.badge) {
    const b = TL.badge;
    const d = el('badge', `${b.icon ? `<img src="${A[b.icon]}">` : ''}<div><div class="a">${esc(b.title)}</div><div class="b">${esc(b.sub || '')}</div></div>`, `top:${b.top || 330}px`);
    draws.push(t => apply(d, env(t, b.from, b.to, 0.35, 0.2)));
  }

  // ---------- series tag ----------
  if (TL.seriesTag) {
    const s = TL.seriesTag; const d = el('tag', esc(s.text));
    draws.push(t => apply(d, env(t, s.from, s.to, 0.3, 0.15)));
  }

  // ---------- captions ----------
  const words = TL.words || [];
  const capCfg = TL.captions || {};
  const maxW = capCfg.maxWords || 3, maxC = capCfg.maxChars || 16;
  const chunks = []; { let cur = []; for (const w of words) { cur.push(w); const txt = cur.map(x => x.w).join(' '); if (/[.,]$/.test(w.w) || cur.length >= maxW || txt.length > maxC) { chunks.push(cur); cur = []; } } if (cur.length) chunks.push(cur); }
  const cap = el('cap', '');
  draws.push(t => {
    cap.innerHTML = '';
    if (hideRanges.some(([a, b]) => t >= a && t <= b)) return;
    let ch = null;
    for (let i = 0; i < chunks.length; i++) {
      const c = chunks[i]; const s = c[0].s;
      const e = i + 1 < chunks.length ? Math.min(chunks[i + 1][0].s, c[c.length - 1].e + 0.35) : c[c.length - 1].e + 0.5;
      if (t >= s - 0.02 && t < e) { ch = c; break; }
    }
    if (!ch) return;
    const big = state.big > 0.5; const side = state.phoneOn && !big && state.anchor === 'left';
    cap.style.top = big ? '1478px' : (capCfg.y || 1360) + 'px';
    cap.style.left = side ? '470px' : '60px'; cap.style.width = side ? '450px' : '960px'; cap.style.textAlign = side ? 'left' : 'center';
    cap.innerHTML = ch.map(w => `<span class="${t >= w.s ? 'on' : ''}">${esc(w.w.replace(/[.,]$/, ''))}</span>`).join(' ');
    const k = ease(clamp((t - ch[0].s) / 0.14));
    cap.style.transform = `translateY(${16 * (1 - k)}px)`; cap.style.opacity = 0.2 + 0.8 * k;
  });

  // ---------- transitions ----------
  for (const tr of (TL.transitions || [])) {
    if (tr.type === 'stripe-wipe') {
      const cols = tr.colors || ['var(--ink)', 'var(--primary)', 'var(--paper)'];
      const w = el('wipe', cols.map(c => `<div class="bar" style="background:${c}"></div>`).join(''));
      const bars = [...w.children]; const c = tr.at, d = tr.duration || 0.32;
      draws.push(t => {
        if (t > c - d - 0.1 && t < c + d + 0.1) {
          const p = (t - (c - d)) / (2 * d);
          bars.forEach((b, i) => { const pp = p - 0.06 * (bars.length - 1 - i); b.style.left = (-700 + 2000 * ease(clamp(pp))) + 'px'; b.style.width = (1500 - i * 250) + 'px'; });
          w.style.opacity = 1;
        } else w.style.opacity = 0;
      });
    } else if (tr.type === 'iris') {
      const ir = el('iris', ''); const c = tr.at, d = tr.duration || 0.26;
      draws.push(t => {
        if (t > c - d && t < c + d) {
          const r = 1300 * ease(clamp(t <= c ? (t - (c - d)) / d : (t - c) / d));
          ir.style.opacity = 1;
          ir.style.webkitMaskImage = t <= c ? `radial-gradient(circle at 50% 40%, #000 ${r}px, transparent ${r + 2}px)` : `radial-gradient(circle at 50% 40%, transparent ${r}px, #000 ${r + 2}px)`;
        } else ir.style.opacity = 0;
      });
    }
  }

  // ---------- outro ----------
  if (TL.outro) {
    const o = TL.outro;
    const parts = o.lines.map(l => `<div class="l">${esc(l)}</div>`);
    if (o.pill) parts.push(`<div class="pill">${esc(o.pill)}</div>`);
    if (o.footer) parts.push(`<div class="foot">${o.icon ? `<img src="${A[o.icon]}">` : ''}${esc(o.footer)}</div>`);
    const d = el('outro', parts.join('')); const kids = [...d.children];
    draws.push(t => {
      if (t < o.at) { d.style.opacity = 0; return; }
      const r = 1400 * ease(clamp((t - o.at) / 0.35));
      d.style.opacity = 1; d.style.webkitMaskImage = `radial-gradient(circle at 50% 45%, #000 ${r}px, transparent ${r + 2}px)`;
      kids.forEach((k, i) => apply(k, env(t, o.at + 0.18 + i * 0.13, 1e9, 0.3, 0.2)));
    });
  }

  window.setTime = function (t) { for (const f of draws) f(t); return true; };
})();

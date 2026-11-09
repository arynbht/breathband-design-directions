/*
 * Shared helpers for every direction: page/solo mode, iOS chrome, icons, and the
 * geometry behind the charts. Directions own all styling; this file only returns
 * markup strings and coordinates. Plain script; exposes window.BB.
 *
 * Wave convention (from the client deck): IN at the top, OUT at the bottom,
 * dashed zero midline. Values are % of calibrated max amplitude, + = inhale side.
 * Colour rule: the part of a trace above the midline is inhale (red), below is
 * exhale (blue). waveSVG() does this with two clip paths.
 */
(function () {
  'use strict';
  var D = window.BB_DATA;
  var uid = 0;
  function id(prefix) { uid += 1; return (prefix || 'bb') + uid; }
  function r(n) { return Math.round(n * 10) / 10; }

  // ------------------------------------------------------------------ page
  function param(name) { return new URLSearchParams(location.search).get(name); }

  /** Call once after the frames are in the DOM. ?screen=<id> isolates one frame. */
  function initPage() {
    var screen = param('screen');
    if (!screen) return;
    document.documentElement.classList.add('solo');
    var shots = document.querySelectorAll('.bb-shot');
    for (var i = 0; i < shots.length; i++) {
      if (shots[i].getAttribute('data-screen') === screen) shots[i].classList.add('is-solo');
    }
  }

  // ------------------------------------------------------------------ iOS chrome
  function statusBar(opts) {
    opts = opts || {};
    var island = opts.ipad ? '' : '<span class="bb-island" aria-hidden="true"></span>';
    return '<div class="bb-status" aria-hidden="true">' +
      '<span>9:41</span>' + island +
      '<span class="bb-status-icons">' +
        '<svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg>' +
        '<svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor"><path d="M8 2.4c2.3 0 4.4.9 6 2.4l1.1-1.1A10 10 0 0 0 8 .8 10 10 0 0 0 .9 3.7L2 4.8a8.5 8.5 0 0 1 6-2.4Zm0 3.2c1.4 0 2.7.5 3.7 1.4l1.1-1.1A7 7 0 0 0 8 4a7 7 0 0 0-4.8 1.9l1.1 1.1c1-.9 2.3-1.4 3.7-1.4Zm0 3.2c.6 0 1.1.2 1.5.6L8 11 6.5 9.4c.4-.4.9-.6 1.5-.6Z"/></svg>' +
        '<svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x=".5" y=".5" width="23" height="12" rx="3.5" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="20" height="9" rx="2" fill="currentColor"/><path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fill="currentColor" opacity=".45"/></svg>' +
      '</span></div>';
  }
  function homeIndicator() { return '<span class="bb-home-indicator" aria-hidden="true"></span>'; }

  // ------------------------------------------------------------------ icons
  // 24px grid, stroke = currentColor. Directions set --icon-stroke / --icon-cap.
  var ICONS = {
    home: '<path d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-4.5v-5.5h-5V21H5a1 1 0 0 1-1-1v-8.5Z"/>',
    today: '<circle cx="12" cy="12" r="8"/><path d="M12 7.5V12l3 2"/>',
    breathe: '<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="6.5" opacity=".6"/><circle cx="12" cy="12" r="9.5" opacity=".3"/>',
    history: '<path d="M4 18h3l3-9 4 12 3-9h3"/>',
    chart: '<path d="M4 20V4M4 20h16M8 16l4-5 3 3 5-6"/>',
    profile: '<circle cx="12" cy="8.5" r="3.5"/><path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5"/>',
    play: '<path d="M8 5.5v13l10.5-6.5L8 5.5Z"/>',
    pause: '<path d="M8.5 5.5v13M15.5 5.5v13"/>',
    stop: '<rect x="6.5" y="6.5" width="11" height="11" rx="2"/>',
    soundOn: '<path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4v-5Z"/><path d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a7.8 7.8 0 0 1 0 11"/>',
    soundOff: '<path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4v-5Z"/><path d="m16 9.5 5 5M21 9.5l-5 5"/>',
    note: '<path d="M9 17.5V6l10-2v11.5"/><circle cx="6.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="15.5" r="2.5"/>',
    bluetooth: '<path d="m7 7.5 10 9-5 4.5V3l5 4.5-10 9"/>',
    battery: '<rect x="3" y="7.5" width="16" height="9" rx="2"/><path d="M21.5 10.5v3"/><path d="M6 10.5h7v3H6z" fill="currentColor"/>',
    cloud: '<path d="M7 18.5h10.5a4 4 0 0 0 .6-8 6 6 0 0 0-11.5 1.5A3.3 3.3 0 0 0 7 18.5Z"/>',
    cloudCheck: '<path d="M7 18.5h10.5a4 4 0 0 0 .6-8 6 6 0 0 0-11.5 1.5A3.3 3.3 0 0 0 7 18.5Z"/><path d="m9.5 13.5 2 2 3.5-3.5"/>',
    share: '<path d="M12 3.5v11M8 7.5l4-4 4 4"/><path d="M6 11v8.5h12V11"/>',
    pdf: '<path d="M6 3.5h8l4 4v13H6v-17Z"/><path d="M14 3.5v4h4"/><path d="M9 13h6M9 16.5h4"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.8v.4"/>',
    help: '<circle cx="12" cy="12" r="8.5"/><path d="M9.6 9.6a2.5 2.5 0 1 1 3.4 2.3c-.6.3-1 .8-1 1.5v.6M12 16.8v.4"/>',
    chevronRight: '<path d="m9.5 6 6 6-6 6"/>',
    chevronLeft: '<path d="m14.5 6-6 6 6 6"/>',
    chevronDown: '<path d="m6 9.5 6 6 6-6"/>',
    close: '<path d="m6.5 6.5 11 11M17.5 6.5l-11 11"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    marker: '<path d="M6 21V4M6 4h11l-2.5 4L17 12H6"/>',
    pencil: '<path d="M4.5 19.5 5.5 15 15.5 5a2.1 2.1 0 0 1 3 3l-10 10-4 1.5Z"/>',
    strap: '<rect x="3" y="9" width="18" height="6" rx="3"/><path d="M10 9v6M14 9v6"/>',
    balloon: '<path d="M12 3.5c3.6 0 6 2.8 6 6.3 0 3.9-3 6.7-6 6.7s-6-2.8-6-6.7c0-3.5 2.4-6.3 6-6.3Z"/><path d="m12 16.5-1 2h2l-1-2ZM12 18.5c0 1.3-1 1.5-1 3"/>',
    flame: '<path d="M12 21c3.6 0 6-2.4 6-5.8 0-3.5-2.7-5.2-3.4-8.7-1.9 1.2-2.8 3-2.8 4.6-1-.6-1.6-1.6-1.8-2.8C8 9.9 6 12.2 6 15.2 6 18.6 8.4 21 12 21Z"/>',
    trophy: '<path d="M8 4.5h8v5a4 4 0 0 1-8 0v-5Z"/><path d="M8 6.5H5v1.5a3 3 0 0 0 3 3M16 6.5h3v1.5a3 3 0 0 1-3 3M12 13.5v3.5M8.5 20h7M10 17h4v3h-4z"/>',
    calendar: '<rect x="4" y="5.5" width="16" height="15" rx="2"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    users: '<circle cx="9" cy="8.5" r="3.2"/><path d="M3.5 19c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5"/><circle cx="16.5" cy="9" r="2.6"/><path d="M15.5 14.2c2.6-.3 4.6 1.3 5 4.3"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6 6l1.6 1.6M16.4 16.4 18 18M6 18l1.6-1.6M16.4 7.6 18 6"/>',
    filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    sparkle: '<path d="M12 3.5 13.8 10 20.5 12l-6.7 2L12 20.5 10.2 14 3.5 12l6.7-2L12 3.5Z"/>',
    lungs: '<path d="M12 4v8M12 10c-1.5 1-3 1.2-4 1M12 10c1.5 1 3 1.2 4 1"/><path d="M8.5 7C6 7 4 11 4 16c0 2.5 1.6 3.6 3.5 3.2 1.8-.3 2.5-1.5 2.5-3.5V9c0-1.1-.6-2-1.5-2ZM15.5 7C18 7 20 11 20 16c0 2.5-1.6 3.6-3.5 3.2-1.8-.3-2.5-1.5-2.5-3.5V9c0-1.1.6-2 1.5-2Z"/>'
  };
  /** icon(name, size=24, extraAttrs='') -> inline SVG string */
  function icon(name, size, attrs) {
    size = size || 24;
    return '<svg class="bb-icon bb-icon-' + name + '" width="' + size + '" height="' + size +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
      ' style="stroke-width:var(--icon-stroke,1.75);stroke-linecap:var(--icon-cap,round);stroke-linejoin:var(--icon-join,round)"' +
      ' aria-hidden="true" ' + (attrs || '') + '>' + (ICONS[name] || '') + '</svg>';
  }

  /** Placeholder BB monogram: two mirrored bowls. style: 'line' | 'solid' */
  function mark(size, style) {
    size = size || 28;
    var solid = style === 'solid';
    var p = 'M5 4h5.5a3.5 3.5 0 0 1 0 7H5V4Zm0 7h6.2a3.8 3.8 0 0 1 0 7.6H5V11Z';
    var q = 'M13.5 4H19V11h-4.3M13.5 11h5.7a3.8 3.8 0 0 1 0 7.6H13.5';
    return '<svg class="bb-mark" width="' + size + '" height="' + size + '" viewBox="0 0 26 22" aria-label="BreathBand" role="img">' +
      (solid
        ? '<path d="' + p + '" fill="currentColor"/><path d="M13 4h5.5a3.5 3.5 0 0 1 0 7H13V4Zm0 7h6.2a3.8 3.8 0 0 1 0 7.6H13V11Z" fill="currentColor" opacity=".55"/>'
        : '<path d="' + p + '" fill="none" stroke="currentColor" stroke-width="2"/><path d="M13 4h5.5a3.5 3.5 0 0 1 0 7H13V4Zm0 7h6.2a3.8 3.8 0 0 1 0 7.6H13V11Z" fill="none" stroke="currentColor" stroke-width="2"/>') +
      '</svg>';
  }

  // ------------------------------------------------------------------ formatting
  function fmtClock(sec) {
    sec = Math.max(0, Math.floor(sec + 1e-6));
    return Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0');
  }
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  function fmtDate(iso, withDay) {
    var d = new Date(iso + 'T12:00:00');
    return (withDay ? DAYS[d.getDay()] + ' ' : '') + d.getDate() + ' ' + MONTHS[d.getMonth()];
  }
  function scoreText(score) {
    return D.helpers.formatScore(score) + ' · ' + D.helpers.scoreWord(score).word;
  }

  // ------------------------------------------------------------------ geometry
  /** Samples between t0 and t1 (seconds), thinned to at most maxPts. -> [{t, v}] */
  function slice(samples, hz, t0, t1, maxPts) {
    var i0 = Math.max(0, Math.floor(t0 * hz)), i1 = Math.min(samples.length - 1, Math.ceil(t1 * hz));
    var count = i1 - i0 + 1, step = Math.max(1, Math.floor(count / (maxPts || 600)));
    var out = [];
    for (var i = i0; i <= i1; i += step) out.push({ t: i / hz, v: samples[i] });
    return out;
  }
  /** Map {t,v} points into a box. range = max |v| shown (default 4%), IN (+) at top. */
  function toXY(pts, box, t0, t1, range) {
    range = range || 4;
    return pts.map(function (p) {
      return [r(box.x + ((p.t - t0) / (t1 - t0)) * box.w), r(box.y + box.h / 2 - (p.v / range) * (box.h / 2))];
    });
  }
  function linePath(xy) {
    return xy.map(function (p, i) { return (i ? 'L' : 'M') + p[0] + ' ' + p[1]; }).join('');
  }
  /** Catmull-Rom smoothed path through points. */
  function smoothPath(xy, tension) {
    if (xy.length < 3) return linePath(xy);
    var k = (tension == null ? 1 : tension) / 6, d = 'M' + xy[0][0] + ' ' + xy[0][1];
    for (var i = 0; i < xy.length - 1; i++) {
      var p0 = xy[i - 1] || xy[i], p1 = xy[i], p2 = xy[i + 1], p3 = xy[i + 2] || p2;
      d += 'C' + r(p1[0] + (p2[0] - p0[0]) * k) + ' ' + r(p1[1] + (p2[1] - p0[1]) * k) + ' ' +
        r(p2[0] - (p3[0] - p1[0]) * k) + ' ' + r(p2[1] - (p3[1] - p1[1]) * k) + ' ' + p2[0] + ' ' + p2[1];
    }
    return d;
  }
  /** Closed area between a path's points and a horizontal baseline y. */
  function areaPath(xy, baseY, smooth) {
    var top = smooth ? smoothPath(xy) : linePath(xy);
    return top + 'L' + xy[xy.length - 1][0] + ' ' + baseY + 'L' + xy[0][0] + ' ' + baseY + 'Z';
  }
  /** Sparkline / trend points for a list of values. -> [[x,y]] */
  function spark(values, w, h, pad, min, max) {
    pad = pad == null ? 4 : pad;
    min = min == null ? Math.min.apply(null, values) : min;
    max = max == null ? Math.max.apply(null, values) : max;
    var span = max - min || 1;
    return values.map(function (v, i) {
      return [r(pad + (i / Math.max(1, values.length - 1)) * (w - pad * 2)), r(h - pad - ((v - min) / span) * (h - pad * 2))];
    });
  }

  /**
   * Breaths found in a trace: one entry per upward midline crossing.
   * -> [{start, peakT, peak, troughT, trough, end, inDur, outDur}]
   */
  function breaths(samples, hz) {
    var ups = [];
    for (var i = 1; i < samples.length; i++) if (samples[i - 1] < 0 && samples[i] >= 0) ups.push(i);
    var out = [];
    for (var b = 0; b < ups.length - 1; b++) {
      var a = ups[b], z = ups[b + 1], pi = a, ti = a;
      for (var j = a; j < z; j++) {
        if (samples[j] > samples[pi]) pi = j;
        if (samples[j] < samples[ti]) ti = j;
      }
      // inhale = previous trough to this peak; exhale = this peak to this trough
      var prevTrough = out.length ? out[out.length - 1].troughT : a / hz;
      out.push({
        start: a / hz, end: z / hz, peakT: pi / hz, peak: samples[pi], troughT: ti / hz, trough: samples[ti],
        inDur: r(pi / hz - prevTrough), outDur: r((ti - pi) / hz)
      });
    }
    return out;
  }

  /**
   * Standard wave figure. Returns an <svg> string; style it with CSS classes:
   *  .bb-w-grid  .bb-w-mid  .bb-w-pacer  .bb-w-in  .bb-w-out  .bb-w-area-in  .bb-w-area-out
   *  .bb-w-label  .bb-w-marker  .bb-w-tick
   * opts: { samples, pacer?, hz, t0, t1, width, height, range=4, pad={l,r,t,b},
   *         area=false, smooth=true, labels=true, gridSeconds=0, markers=[], ticks=false,
   *         stroke=2, pacerStroke=1.5, title }
   */
  function waveSVG(o) {
    var W = o.width, H = o.height, pad = o.pad || { l: 30, r: 8, t: 10, b: o.ticks ? 22 : 10 };
    var box = { x: pad.l, y: pad.t, w: W - pad.l - pad.r, h: H - pad.t - pad.b };
    var range = o.range || 4, hz = o.hz || 10, t0 = o.t0 || 0, t1 = o.t1;
    var midY = r(box.y + box.h / 2), smooth = o.smooth !== false;
    var cin = id('cin'), cout = id('cout');
    var userXY = toXY(slice(o.samples, hz, t0, t1, o.maxPts || 700), box, t0, t1, range);
    var userD = smooth ? smoothPath(userXY) : linePath(userXY);
    var s = '<svg class="bb-wave" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' +
      (o.title || 'Breathing waveform, inhale above the midline, exhale below') + '">';
    s += '<defs><clipPath id="' + cin + '"><rect x="0" y="0" width="' + W + '" height="' + midY + '"/></clipPath>' +
      '<clipPath id="' + cout + '"><rect x="0" y="' + midY + '" width="' + W + '" height="' + (H - midY) + '"/></clipPath></defs>';
    if (o.gridSeconds) {
      for (var g = Math.ceil(t0 / o.gridSeconds) * o.gridSeconds; g <= t1; g += o.gridSeconds) {
        var gx = r(box.x + ((g - t0) / (t1 - t0)) * box.w);
        s += '<line class="bb-w-grid" x1="' + gx + '" x2="' + gx + '" y1="' + box.y + '" y2="' + (box.y + box.h) + '"/>';
      }
    }
    if (o.area) {
      var a = areaPath(userXY, midY, smooth);
      s += '<path class="bb-w-area-in" d="' + a + '" clip-path="url(#' + cin + ')"/>';
      s += '<path class="bb-w-area-out" d="' + a + '" clip-path="url(#' + cout + ')"/>';
    }
    s += '<line class="bb-w-mid" x1="' + box.x + '" x2="' + (box.x + box.w) + '" y1="' + midY + '" y2="' + midY + '" stroke-dasharray="4 4"/>';
    if (o.pacer) {
      var pXY = toXY(slice(o.pacer, hz, t0, t1, o.maxPts || 700), box, t0, t1, range);
      s += '<path class="bb-w-pacer" d="' + smoothPath(pXY) + '" fill="none" stroke-width="' + (o.pacerStroke || 1.5) + '"/>';
    }
    s += '<path class="bb-w-in" d="' + userD + '" fill="none" stroke-width="' + (o.stroke || 2) + '" clip-path="url(#' + cin + ')"/>';
    s += '<path class="bb-w-out" d="' + userD + '" fill="none" stroke-width="' + (o.stroke || 2) + '" clip-path="url(#' + cout + ')"/>';
    (o.markers || []).forEach(function (m) {
      if (m.t < t0 || m.t > t1) return;
      var mx = r(box.x + ((m.t - t0) / (t1 - t0)) * box.w);
      s += '<line class="bb-w-marker" x1="' + mx + '" x2="' + mx + '" y1="' + box.y + '" y2="' + (box.y + box.h) + '"/>';
    });
    if (o.labels !== false) {
      s += '<text class="bb-w-label" x="' + (pad.l - 6) + '" y="' + (box.y + 12) + '" text-anchor="end">IN</text>';
      s += '<text class="bb-w-label" x="' + (pad.l - 6) + '" y="' + (box.y + box.h - 3) + '" text-anchor="end">OUT</text>';
    }
    if (o.ticks) {
      var span = t1 - t0, step = span <= 12 ? 2 : span <= 35 ? 5 : span <= 70 ? 10 : 60;
      for (var tt = Math.ceil(t0 / step) * step; tt <= t1 + 0.001; tt += step) {
        var tx = r(box.x + ((tt - t0) / span) * box.w);
        s += '<text class="bb-w-tick" x="' + tx + '" y="' + (H - 5) + '" text-anchor="middle">' + fmtClock(tt) + '</text>';
      }
    }
    return s + '</svg>';
  }

  /** Value of a trace at time t (linear interpolation). */
  function at(samples, hz, t) {
    var x = t * hz, i = Math.floor(x), f = x - i;
    return samples[i] + ((samples[i + 1] == null ? samples[i] : samples[i + 1]) - samples[i]) * f;
  }

  /** Live-frame state for screen 3: frozen mid-inhale. */
  // 2:33 elapsed, 2:27 left (just past halfway); 3.5 s into the 5 s inhale of breath 16.
  // Chosen so the user is above the midline and slightly behind the pacer.
  var LIVE_T = 153.5;
  function liveState() {
    var p = D.latestPaced, hz = p.sampleHz;
    return {
      t: LIVE_T,
      elapsed: fmtClock(LIVE_T),
      remaining: fmtClock(Math.ceil(p.duration - LIVE_T)),
      progress: LIVE_T / p.duration,
      phase: 'inhale',
      phaseProgress: (LIVE_T % 10) / 5,       // 0.7 of the way through the inhale
      pacer: at(p.pacerWave, hz, LIVE_T),     // % (0 = midline, +3 = full inhale)
      user: at(p.userWave, hz, LIVE_T),
      // 0..1 "size" for circle pacers: 0 = fully out (-3%), 1 = fully in (+3%)
      pacerSize: (at(p.pacerWave, hz, LIVE_T) + 3) / 6,
      userSize: (at(p.userWave, hz, LIVE_T) + 3) / 6,
      breathNumber: Math.floor(LIVE_T / 10) + 1,
      breathsTotal: p.duration / 10
    };
  }

  window.BB = {
    data: D,
    param: param,
    initPage: initPage,
    statusBar: statusBar,
    homeIndicator: homeIndicator,
    icon: icon,
    icons: ICONS,
    mark: mark,
    fmtClock: fmtClock,
    fmtDate: fmtDate,
    scoreText: scoreText,
    slice: slice,
    toXY: toXY,
    linePath: linePath,
    smoothPath: smoothPath,
    areaPath: areaPath,
    spark: spark,
    breaths: breaths,
    waveSVG: waveSVG,
    at: at,
    liveState: liveState
  };
})();

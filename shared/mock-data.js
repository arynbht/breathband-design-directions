/*
 * BreathBand® UI directions: shared mock data.
 * Every direction reads this one dataset so the client compares style, not content.
 * Plain script (no modules) so pages open from file://. Exposes window.BB_DATA.
 *
 * Units
 *   depth / wave values: % of the user's calibrated maximum amplitude, relative to the
 *   zero midline. Positive = IN (inhale, drawn at the top), negative = OUT (exhale, bottom).
 *   Normal breathing reference = 6% peak-to-peak (3% inhale + 3% exhale).
 *   time: seconds.
 */
(function () {
  'use strict';

  // ---- deterministic noise so every page draws the identical waveform ----
  function mulberry32(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  // smooth random walk, sampled once per breath and interpolated
  function drift(rand, n, step, limit) {
    var out = [0];
    for (var i = 1; i < n; i++) {
      var v = out[i - 1] + (rand() - 0.5) * step;
      out.push(Math.max(-limit, Math.min(limit, v)));
    }
    return out;
  }

  var SAMPLE_HZ = 10;

  // ---- score words (proposal; client to confirm) ----
  var SCORE_BANDS = [
    { min: 9, max: 10, word: 'Excellent', band: 'high' },
    { min: 7, max: 8.9, word: 'Good', band: 'good' },
    { min: 5, max: 6.9, word: 'Fair', band: 'mid' },
    { min: 3, max: 4.9, word: 'Building', band: 'low' },
    { min: 1, max: 2.9, word: 'Starting out', band: 'low' }
  ];
  function scoreWord(score) {
    for (var i = 0; i < SCORE_BANDS.length; i++) {
      if (score >= SCORE_BANDS[i].min) return SCORE_BANDS[i];
    }
    return SCORE_BANDS[SCORE_BANDS.length - 1];
  }
  // whole numbers by default, one decimal only when needed (7.5 stays 7.5, 6.0 shows 6)
  function formatScore(score) {
    return Math.round(score * 10) % 10 === 0 ? String(Math.round(score)) : score.toFixed(1);
  }

  // deviation-to-score conversion table
  var CONVERSION = [
    { from: 0, to: 10, score: 10 }, { from: 10, to: 20, score: 9 },
    { from: 20, to: 30, score: 8 }, { from: 30, to: 40, score: 7 },
    { from: 40, to: 50, score: 6 }, { from: 50, to: 60, score: 5 },
    { from: 60, to: 70, score: 4 }, { from: 70, to: 80, score: 3 },
    { from: 80, to: 90, score: 2 }, { from: 90, to: null, score: 1 }
  ];

  // ---- paced 5-5 session: pacer + user trace, 300 s ----
  function buildPaced() {
    var rand = mulberry32(5505);
    var duration = 300, period = 10, n = duration * SAMPLE_HZ;
    var breaths = Math.ceil(duration / period) + 1;
    var lag = drift(rand, breaths, 0.35, 0.9);      // seconds behind / ahead of pacer
    var ampIn = drift(rand, breaths, 0.45, 0.8);    // inhale depth wobble around 2.75%
    var ampOut = drift(rand, breaths, 0.45, 0.8);   // exhale depth wobble around 2.9%
    var pacer = [], user = [];
    for (var i = 0; i < n; i++) {
      var t = i / SAMPLE_HZ;
      // pacer: inhale 0-5 s rises to +3, exhale 5-10 s falls to -3 (6% peak-to-peak)
      pacer.push(+(-3 * Math.cos((2 * Math.PI * t) / period)).toFixed(3));
      var b = Math.min(breaths - 1, Math.floor(t / period));
      var frac = (t % period) / period;
      var l = lag[b] + (lag[Math.min(breaths - 1, b + 1)] - lag[b]) * frac + 0.35;
      var phase = (2 * Math.PI * (t - l)) / period;
      var c = -Math.cos(phase);
      var amp = c >= 0 ? 2.75 + ampIn[b] : 2.9 + ampOut[b];
      // slight flattening near the peak: users hold the top a touch longer than the pacer
      var shaped = Math.sign(c) * Math.pow(Math.abs(c), 0.85);
      var noise = (rand() - 0.5) * 0.14;
      user.push(+(shaped * amp + noise).toFixed(3));
    }
    return { pacer: pacer, user: user };
  }

  // ---- open session: free breathing, 380 s, ~14 br/min, I:E ~1:1.8 ----
  function buildOpen() {
    var rand = mulberry32(1406);
    var duration = 380, n = duration * SAMPLE_HZ;
    var wave = new Array(n);
    var t = 0, i = 0;
    while (i < n) {
      var period = 60 / (14 + (rand() - 0.5) * 3.2);   // 12.4-15.6 br/min
      var ratio = 1.8 + (rand() - 0.5) * 0.5;          // exhale / inhale
      var tin = period / (1 + ratio), tout = period - tin;
      var dIn = 2.9 + (rand() - 0.5) * 1.1;
      var dOut = 2.5 + (rand() - 0.5) * 1.0;
      // distracted stretch after the 03:40 marker: shallower and quicker for ~40 s
      if (t > 220 && t < 262) { dIn *= 0.65; dOut *= 0.65; tin *= 0.85; tout *= 0.8; }
      var start = t;
      while (i < n && i / SAMPLE_HZ < start + tin) {
        var p = (i / SAMPLE_HZ - start) / tin;
        // rise from trough (-dOutPrev) to peak (+dIn) using a half cosine
        var from = i === 0 ? -2.5 : wave[Math.floor(start * SAMPLE_HZ) - 1] || -2.5;
        wave[i] = from + (dIn - from) * (1 - Math.cos(Math.PI * p)) / 2;
        i++;
      }
      var peakStart = start + tin;
      while (i < n && i / SAMPLE_HZ < peakStart + tout) {
        var q = (i / SAMPLE_HZ - peakStart) / tout;
        wave[i] = dIn + (-dOut - dIn) * (1 - Math.cos(Math.PI * q)) / 2;
        i++;
      }
      t = start + period;
    }
    for (var k = 0; k < n; k++) wave[k] = +(wave[k] + (rand() - 0.5) * 0.12).toFixed(3);
    return wave;
  }

  var paced = buildPaced();

  window.BB_DATA = {
    brand: { product: 'BreathBand®', cloud: 'BreathCloud', mark: 'BB' },

    user: {
      name: 'Alex Morgan',
      firstName: 'Alex',
      initials: 'AM',
      skillLevel: 'Beginner',          // Beginner | Trained (tightens paced tolerance)
      coach: 'Coach: Dr. Lena Vos'
    },

    device: {
      strap: 'connected',
      bluetooth: 'connected',
      battery: 82,
      firmware: '1.4.2'
    },

    cloud: { status: 'synced', lastSync: '2 min ago', pending: 0 },

    today: { date: '2026-11-09', label: 'Monday 9 November' },

    // 20 Oct - 8 Nov 2026, oldest first. Paced totals = mean of the four Timing/Depth sub-scores.
    sessions: [
      { id: 's01', date: '2026-10-20', time: '07:42', type: 'Open', duration: 300,
        open: { rate: 17, ie: '1:1.3', depth: 4.1, inRange: 48 } },
      { id: 's02', date: '2026-10-22', time: '21:10', type: 'Paced', pacer: '2-2', duration: 180,
        scores: { timing: { inhale: 6, exhale: 5 }, depth: { inhale: 6, exhale: 5 }, total: 5.5 } },
      { id: 's03', date: '2026-10-24', time: '07:55', type: 'Paced', pacer: '5-5', duration: 300,
        scores: { timing: { inhale: 6, exhale: 6 }, depth: { inhale: 6, exhale: 6 }, total: 6.0 } },
      { id: 's04', date: '2026-10-27', time: '18:30', type: 'Open', duration: 340,
        open: { rate: 16, ie: '1:1.5', depth: 4.6, inRange: 58 } },
      { id: 's05', date: '2026-10-29', time: '07:48', type: 'Paced', pacer: '2-2', duration: 300,
        scores: { timing: { inhale: 6, exhale: 6 }, depth: { inhale: 7, exhale: 5 }, total: 6.0 } },
      { id: 's06', date: '2026-10-31', time: '08:05', type: 'Paced', pacer: '5-5', duration: 300,
        scores: { timing: { inhale: 7, exhale: 6 }, depth: { inhale: 7, exhale: 6 }, total: 6.5 } },
      { id: 's07', date: '2026-11-03', time: '19:12', type: 'Open', duration: 360,
        open: { rate: 15, ie: '1:1.6', depth: 5.0, inRange: 65 } },
      { id: 's08', date: '2026-11-05', time: '07:40', type: 'Paced', pacer: '5-5', duration: 600,
        scores: { timing: { inhale: 7, exhale: 7 }, depth: { inhale: 7, exhale: 7 }, total: 7.0 } },
      { id: 's09', date: '2026-11-07', time: '18:55', type: 'Open', duration: 380,
        open: { rate: 14, ie: '1:1.8', depth: 5.4, inRange: 72 } },
      { id: 's10', date: '2026-11-08', time: '07:36', type: 'Paced', pacer: '5-5', duration: 300,
        scores: { timing: { inhale: 8, exhale: 7 }, depth: { inhale: 7, exhale: 8 }, total: 7.5 } }
    ],

    latestPaced: {
      id: 's10',
      date: '2026-11-08', dateLabel: 'Sun 8 Nov 2026', time: '07:36',
      type: 'Paced', pacer: '5-5', pacerLabel: 'Paced 5-5', duration: 300, durationLabel: '5:00',
      mode: 'Timed', skillLevel: 'Beginner', sound: 'Musical notes',
      scores: {
        timing: { inhale: 8, exhale: 7 },
        depth: { inhale: 7, exhale: 8 },
        smoothness: { inhale: 7, exhale: 6 },   // secondary metric, not in the total
        total: 7.5
      },
      previousTotal: 7.0,
      note: 'Calm start. Lost the rhythm on a few exhales around minute 3 when the neighbour\'s dog barked, then found it again. No discomfort.',
      sampleHz: SAMPLE_HZ,
      pacerWave: paced.pacer,   // 3000 samples
      userWave: paced.user      // 3000 samples
    },

    latestOpen: {
      id: 's09',
      date: '2026-11-07', dateLabel: 'Sat 7 Nov 2026', time: '18:55',
      type: 'Open', duration: 380, durationLabel: '6:20', mode: 'Manual',
      metrics: {
        rate: { value: 14, unit: 'br/min', normal: '12–16', status: 'Normal' },
        ie: { value: '1:1.8', normal: '1:2', status: 'Slightly short exhale' },
        depth: { value: 5.4, unit: '%', target: 6, status: 'Slightly shallow' },
        inhaleDepth: { value: 2.9, unit: '%', target: 3 },
        exhaleDepth: { value: 2.5, unit: '%', target: 3 },
        inhaleDuration: { value: 1.5, unit: 's' },
        exhaleDuration: { value: 2.8, unit: 's' },
        inRange: { value: 72, unit: '%' }
      },
      markers: [
        { t: 72, label: 'Started music' },
        { t: 220, label: 'Felt distracted' }
      ],
      note: 'Evening session on the sofa. Music helped me settle. Phone buzzed at about 3:40 and I lost focus for a while.',
      sampleHz: SAMPLE_HZ,
      wave: buildOpen()          // 3800 samples
    },

    calibration: {
      tension: { value: 0.64, rangeLow: 0.55, rangeHigh: 0.75, state: 'in range' },
      precal: {
        breaths: 3,
        maxAmplitude: 100,       // % by definition
        midline: 0,
        referenceDepth: 6,       // % of max, 3 in + 3 out
        pacerAmplitude: 6
      },
      steps: ['Strap tension', 'Balloon breaths', 'Ready']
    },

    timeAxis: ['10 s', '30 s', '60 s', '5 min', 'Full'],
    timeAxisAll: ['5 s', '10 s', '30 s', '60 s', '5 min', '1 h', 'Full'],

    scoring: {
      bands: SCORE_BANDS,
      conversion: CONVERSION,
      sdRule: 'A deviation beyond one standard deviation scores a flat 1.',
      explainer: 'Each score compares your breathing with the pacer. The closer you stay, the higher the score: within 10% of the pacer scores 10, every further 10% off takes one point away, down to 1.'
    },

    helpers: { scoreWord: scoreWord, formatScore: formatScore }
  };
})();

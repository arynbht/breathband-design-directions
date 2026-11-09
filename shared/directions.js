/*
 * Direction metadata and pitch copy, shared by the gallery and each direction page.
 * Plain script; exposes window.BB_DIRECTIONS.
 */
window.BB_DIRECTIONS = [
  {
    id: '01-clinical-precision',
    name: 'Clinical Precision',
    positioning: 'A calibrated instrument for breathing, precise enough for the clinic.',
    bestFor: 'Coaches & clinicians',
    why: 'Breath training rests on measurement: a personal full-breath range, a 6% reference depth, a tolerance around the pacer. This direction makes that rigour visible. Every reading sits on a measured grid like a lab report, so a clinician can explain a score and a user can trust it.',
    highlights: [
      'A dial pacer with fine graduations, read like a precision instrument',
      'Waveforms on chart paper with a percentage scale, so depth reads at a glance',
      'Serif headlines over tabular figures: medical-grade without feeling sterile'
    ],
    fonts: ['Instrument Serif', 'Instrument Sans'],
    swatches: [
      { name: 'Paper', hex: '#F7F8F6' }, { name: 'Ink', hex: '#141A1F' },
      { name: 'In range', hex: '#1F7A55' }, { name: 'Inhale', hex: '#C2362B' },
      { name: 'Exhale', hex: '#2A58A6' }, { name: 'Low score', hex: '#B7791F' }
    ],
    preview: { ground: '#F7F8F6', ink: '#141A1F', accent: '#1F7A55' }
  },
  {
    id: '02-night-performance',
    name: 'Night Performance',
    positioning: 'Train your breath like you train your body.',
    bestFor: 'Athletes & high performers',
    why: 'Breath work often happens before a match, after a run or last thing at night. A dark, high-contrast interface keeps the light low and the signal loud, and oversized numerals read from arm’s length mid-session. It positions BreathBand® as performance equipment rather than a wellness accessory.',
    highlights: [
      'Glow is reserved for live data, so the breath is the brightest thing on screen',
      'Wide, heavy numerals that stay legible at arm’s length',
      'An oscilloscope-style trace with an accuracy mark under every pacer peak'
    ],
    fonts: ['Unbounded', 'Archivo'],
    swatches: [
      { name: 'Night', hex: '#0C0E11' }, { name: 'Surface', hex: '#161A1F' },
      { name: 'Ink', hex: '#F1F3F5' }, { name: 'In range', hex: '#4ED69B' },
      { name: 'Inhale', hex: '#F2554B' }, { name: 'Exhale', hex: '#2F96F0' }
    ],
    preview: { ground: '#0C0E11', ink: '#F1F3F5', accent: '#4ED69B' }
  },
  {
    id: '03-soft-organic',
    name: 'Soft Organic',
    positioning: 'Your belly is a balloon.',
    bestFor: 'Newcomers & stress relief',
    why: 'Calibration starts with one simple instruction: imagine your belly is a balloon. This direction turns that image into the whole interface. The pacer is a balloon that fills and empties, words lead and numbers follow, and nothing on screen demands a hard look. It suits people new to breath training and anyone using it to unwind.',
    highlights: [
      'A balloon pacer: a soft shape that inflates with every inhale',
      'Time shown as a filling ring and plain words, with no countdown digits',
      'Scores lead with the word (“Good 7.5”), never a bare number'
    ],
    fonts: ['Fraunces', 'Figtree'],
    swatches: [
      { name: 'Linen', hex: '#F2F0EB' }, { name: 'Ink', hex: '#2C2B30' },
      { name: 'Sage', hex: '#4F7D5E' }, { name: 'Inhale', hex: '#C9505A' },
      { name: 'Exhale', hex: '#4B7DBF' }, { name: 'Low score', hex: '#B9822E' }
    ],
    preview: { ground: '#F2F0EB', ink: '#2C2B30', accent: '#4F7D5E' }
  },
  {
    id: '04-coach-console',
    name: 'Coach Console',
    positioning: 'Every breath, every client, side by side.',
    bestFor: 'Coaches reviewing many sessions',
    why: 'BreathCloud lets a coach or clinician review sessions remotely. This direction is designed for that desk: dense tables, a line pacer that shows timing errors precisely, and a review screen that unfolds on iPad into a full console, with the session list, breath-by-breath deviations and a coach comment that syncs back to the user.',
    highlights: [
      'An iPad console with sessions, waveform, breath-by-breath table and coach comment on one screen',
      'The line pacer comes first, with a target band and a “now” cursor',
      'A timing and depth deviation strip under every waveform'
    ],
    fonts: ['IBM Plex Sans', 'IBM Plex Sans Condensed'],
    swatches: [
      { name: 'Graphite', hex: '#1D2228' }, { name: 'Ground', hex: '#EEF0F2' },
      { name: 'Teal', hex: '#0F6E78' }, { name: 'Inhale', hex: '#D0283E' },
      { name: 'Exhale', hex: '#1E63D0' }, { name: 'Low score', hex: '#B7701A' }
    ],
    preview: { ground: '#EEF0F2', ink: '#16191D', accent: '#0F6E78' }
  },
  {
    id: '05-playful-progress',
    name: 'Playful Progress',
    positioning: 'Show up, breathe, level up.',
    bestFor: 'Building a daily habit',
    why: 'Breath training only works when people come back tomorrow. This direction gives them reasons to: a big hero score, streaks, personal bests and small wins, all calculated from the user’s real sessions. It is bright and encouraging while staying grown-up enough for an adult on a lunch break.',
    highlights: [
      'Breath beads around the pacer: progress you can feel without a countdown',
      'Streaks and personal bests calculated from real session history',
      'Drawn illustrations that explain the strap and the calibration steps'
    ],
    fonts: ['Bricolage Grotesque', 'DM Sans'],
    swatches: [
      { name: 'Sun', hex: '#FFD84D' }, { name: 'Mint', hex: '#CDEEDB' },
      { name: 'Ink', hex: '#1B1D2A' }, { name: 'Inhale', hex: '#EE4B45' },
      { name: 'Exhale', hex: '#2F7FEA' }, { name: 'Low score', hex: '#C98A12' }
    ],
    preview: { ground: '#FBFAF6', ink: '#1B1D2A', accent: '#FFD84D' }
  }
];

window.BB_SCREENS = [
  { id: 'home', name: 'Home dashboard' },
  { id: 'locked', name: 'First run: strap tension' },
  { id: 'live', name: 'Live paced session' },
  { id: 'review', name: 'Session review' }
];

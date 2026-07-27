import type { AppData } from './types.js';

const data: AppData = {
  lang: 'en',
  meta: {
    htmlTitle: 'Articulation: Where to Place Your Tongue'
  },
  ui: {
    eyebrow: 'Tongue Placement · Mandarin',
    h1: 'Where to place your tongue when speaking Mandarin',
    sub: 'A labeled side cross-section of the mouth. Switch between initials and finals — the tongue on the diagram moves into position, and the soft palate opens for nasal sounds.',
    tabInitials: 'Initials (consonants)',
    tabFinals: 'Finals (endings)',
    diagramTitle: 'Sagittal section',
    legend: { tongue: 'tongue', contactPoint: 'contact point', anatomy: 'mouth anatomy' },
    labels: {
      nasalCavity: 'nasal cavity',
      softPalate: 'soft palate',
      velumSub: '(velum)',
      alveolarRidge: 'alveolar ridge',
      hardPalate: 'hard palate',
      lips: 'lips',
      teeth: 'teeth',
      pharynx: 'pharynx'
    },
    hintInitials: "Tip: say the pairs z/c/s ↔ zh/ch/sh/r and j/q/x out loud in front of a mirror, watching the tip of your tongue — the difference often gets lost by ear more than you'd expect.",
    hintFinals: "The finals -n and -ng sound almost the same by ear, but the contact point is different: -n is up front (alveolar ridge), -ng is deep in the back (soft palate). Check yourself by placing a finger under your chin — for -ng you should feel a lift deep at the root of the tongue."
  },

  initials: [
    { id: 'labial', pinyin: 'b · p · m · f', name: 'Labial', marker: { x: 56, y: 187 }, noContact: false,
      top: [{ x: 112, y: 288 }, { x: 158, y: 279 }, { x: 203, y: 276 }, { x: 248, y: 280 }, { x: 293, y: 289 }, { x: 338, y: 298 }],
      title: 'Bilabial and labiodental', velum: false,
      body: "The lips do the work, not the tongue: for <b>b, p, m</b> the lips close together, same as English b/p/m. For <b>f</b> the lower lip touches the upper teeth. The tongue stays relaxed, resting freely on the floor of the mouth.",
      example: 'māma → 妈妈 "mom"' },
    { id: 'alveolar', pinyin: 'd · t · n · l', name: 'Alveolar', marker: { x: 133, y: 138 }, noContact: false,
      top: [{ x: 131, y: 143 }, { x: 172, y: 203 }, { x: 210, y: 249 }, { x: 252, y: 272 }, { x: 296, y: 287 }, { x: 338, y: 298 }],
      title: 'Tongue tip on the alveolar ridge', velum: false,
      body: "The tip of the tongue rises to touch the <b>alveolar ridge</b> — the little bump right behind the upper teeth (same spot as English d/t/n/l). For d/t it's a short, released contact; for n/l the tongue stays there longer.",
      example: 'nǐ hǎo → 你好 "hello"' },
    { id: 'dental', pinyin: 'z · c · s', name: 'Dental sibilants', marker: { x: 110, y: 149 }, noContact: false,
      top: [{ x: 112, y: 154 }, { x: 158, y: 221 }, { x: 205, y: 257 }, { x: 249, y: 274 }, { x: 294, y: 288 }, { x: 338, y: 298 }],
      title: 'Flat tongue at the back of the teeth', velum: false,
      body: "The tip of the tongue reaches toward the back of the <b>upper teeth</b>, and the body of the tongue stays flat — it does not rise. A narrow gap between tip and teeth creates the hissing sound. Don't lift the tongue high like for d/t.",
      example: 'sìshí → 四十 "forty"' },
    { id: 'retroflex', pinyin: 'zh · ch · sh · r', name: 'Retroflex', marker: { x: 158, y: 120 }, noContact: false,
      top: [{ x: 160, y: 118 }, { x: 132, y: 198 }, { x: 202, y: 251 }, { x: 249, y: 273 }, { x: 294, y: 287 }, { x: 338, y: 298 }],
      title: 'Tongue tip curled back', velum: false,
      body: "The tip of the tongue curls up and <b>back</b>, toward the border of the alveolar ridge and the hard palate — almost like a small hook. There's no full closure, just a narrow gap. Unlike z/c/s, where the tongue is flat and points forward, here it's curled backward.",
      example: 'zhōngguó → 中国 "China"' },
    { id: 'palatal', pinyin: 'j · q · x', name: 'Palatal', marker: { x: 226, y: 96 }, noContact: false,
      top: [{ x: 108, y: 226 }, { x: 163, y: 148 }, { x: 204, y: 98 }, { x: 248, y: 96 }, { x: 291, y: 150 }, { x: 334, y: 250 }],
      title: 'Tongue blade on the hard palate, tip stays low', velum: false,
      body: 'It\'s not the tip that works here but the <b>blade (front surface)</b> of the tongue — it presses broadly against the hard palate. The tip stays down, behind the lower teeth. A common mistake is pulling the tip up, as if making "j/ch/sh".',
      example: 'xièxiè → 谢谢 "thank you"' },
    { id: 'velar', pinyin: 'g · k · h', name: 'Velar', marker: { x: 302, y: 114 }, noContact: false,
      top: [{ x: 110, y: 290 }, { x: 152, y: 286 }, { x: 196, y: 274 }, { x: 238, y: 238 }, { x: 285, y: 146 }, { x: 328, y: 200 }],
      title: 'Back of the tongue on the soft palate', velum: false,
      body: 'The tip is inactive, resting behind the lower teeth. The <b>back of the tongue</b> does the work — it rises to meet the soft palate, deep in the mouth. Same place as English g/k.',
      example: 'gōngzuò → 工作 "work"' }
  ],

  finals: [
    { id: 'n', pinyin: '-n', name: 'Alveolar nasal', marker: { x: 133, y: 138 }, noContact: false,
      top: [{ x: 131, y: 143 }, { x: 172, y: 203 }, { x: 210, y: 249 }, { x: 252, y: 272 }, { x: 296, y: 287 }, { x: 338, y: 298 }], // same as alveolar
      velum: true,
      title: 'Same as d/t/n, but the velum opens',
      body: "The tip of the tongue goes to the same place as <b>n/l</b> — the alveolar ridge. But now the soft palate (velum) <b>drops</b>, opening a passage into the nose — air escapes through the nose instead of the mouth. This is the final in an, en, in, uan...",
      example: 'chī <b>fàn</b> → 吃饭 "eat [a meal]", the syllable fàn' },
    { id: 'ng', pinyin: '-ng', name: 'Velar nasal', marker: { x: 302, y: 114 }, noContact: false,
      top: [{ x: 110, y: 290 }, { x: 152, y: 286 }, { x: 196, y: 274 }, { x: 238, y: 238 }, { x: 285, y: 146 }, { x: 328, y: 200 }], // same as velar
      velum: true,
      title: 'Same as g/k, but the velum opens',
      body: "The back of the tongue rises to the soft palate — same as for <b>g/k</b>. The difference is the same as with -n: the velum drops, air goes through the nose. Don't try to add an English \"ng\" with the tip of the tongue — the contact is entirely at the back.",
      example: 'Zhōng<b>guó</b> → 中国, the -ong final' },
    { id: 'r', pinyin: '-r (儿化)', name: 'Rhotacization (érhuà)', marker: { x: 150, y: 190 }, noContact: true,
      top: [{ x: 150, y: 185 }, { x: 138, y: 218 }, { x: 198, y: 256 }, { x: 246, y: 272 }, { x: 292, y: 286 }, { x: 338, y: 298 }],
      velum: false,
      title: 'A light curl back, no closure',
      body: 'The tip of the tongue curls up and back like for zh/ch/sh, but <b>weaker and without approaching</b> the palate — there\'s no contact at all; this isn\'t a consonant, it\'s a coloring of the vowel. The mouth stays "open," air flows freely through it.',
      example: 'yīdiǎnr → 一点儿 "a little bit"' }
  ]
};

export default data;

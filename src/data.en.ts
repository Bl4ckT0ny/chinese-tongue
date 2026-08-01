import type { AppData } from './types.js';

const data: AppData = {
  lang: 'en',
  meta: {
    htmlTitle: 'Mandarin Pronunciation: Tongue Placement'
  },
  ui: {
    eyebrow: 'Tongue Placement · Mandarin',
    h1: 'Where to place your tongue when speaking Mandarin',
    sub: 'A labeled midsagittal view of the vocal tract. Switch between initials, nasal codas, and erhua to see how the tongue and soft palate change position.',
    tabInitials: 'Initials (consonants)',
    tabFinals: 'Codas and erhua',
    diagramTitle: 'Midsagittal view',
    legend: { tongue: 'tongue', contactPoint: 'place of articulation', anatomy: 'vocal tract' },
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
    hintInitials: 'Tip: alternate between z/c/s, zh/ch/sh/r, and j/q/x in front of a mirror. Watch whether the tongue tip stays forward, curls back, or remains low behind the lower teeth.',
    hintFinals: 'The final nasals -n and -ng may sound similar, but they are formed in different places. For -n, the tongue tip reaches the alveolar ridge; for -ng, the back of the tongue rises toward the soft palate. Place a finger under your chin to feel the deeper lift for -ng.'
  },

  initials: [
    { id: 'labial', pinyin: 'b · p · m · f', name: 'Labial', marker: { x: 56, y: 187 }, noContact: false,
      top: [{ x: 112, y: 288 }, { x: 158, y: 279 }, { x: 203, y: 276 }, { x: 248, y: 280 }, { x: 293, y: 289 }, { x: 338, y: 298 }],
      title: 'Bilabial and labiodental sounds', velum: false,
      body: 'These sounds are formed mainly with the lips. For <b>b, p, m</b>, the lips close; for <b>f</b>, the lower lip meets the upper teeth. The tongue remains relaxed on the floor of the mouth.',
      example: 'māma → 妈妈 “mom”' },
    { id: 'alveolar', pinyin: 'd · t · n · l', name: 'Alveolar', marker: { x: 133, y: 138 }, noContact: false,
      top: [{ x: 131, y: 143 }, { x: 172, y: 203 }, { x: 210, y: 249 }, { x: 252, y: 272 }, { x: 296, y: 287 }, { x: 338, y: 298 }],
      title: 'Tongue tip at the alveolar ridge', velum: false,
      body: 'The tongue tip rises to the <b>alveolar ridge</b>, just behind the upper front teeth. For d and t, the closure is brief and released quickly; for n and l, the tongue remains there longer.',
      example: 'nǐ hǎo → 你好 “hello”' },
    { id: 'dental', pinyin: 'z · c · s', name: 'Dental sibilants', marker: { x: 110, y: 149 }, noContact: false,
      top: [{ x: 112, y: 154 }, { x: 158, y: 221 }, { x: 205, y: 257 }, { x: 249, y: 274 }, { x: 294, y: 288 }, { x: 338, y: 298 }],
      title: 'Tongue tip near the upper teeth', velum: false,
      body: 'The tongue tip points toward the back of the <b>upper teeth</b> while the tongue body stays relatively flat. A narrow channel produces the sibilant airflow. Do not raise the tip as high as you would for d or t.',
      example: 'sìshí → 四十 “forty”' },
    { id: 'retroflex', pinyin: 'zh · ch · sh · r', name: 'Retroflex', marker: { x: 158, y: 120 }, noContact: false,
      top: [{ x: 160, y: 118 }, { x: 132, y: 198 }, { x: 202, y: 251 }, { x: 249, y: 273 }, { x: 294, y: 287 }, { x: 338, y: 298 }],
      title: 'Tongue tip raised and curled back', velum: false,
      body: 'The tongue tip lifts and curls slightly back toward the area behind the alveolar ridge. The tongue forms a narrow passage rather than a complete closure. This backward-curled posture contrasts with the forward, flatter tongue position used for z, c, and s.',
      example: 'zhōngguó → 中国 “China”' },
    { id: 'palatal', pinyin: 'j · q · x', name: 'Alveolo-palatal', marker: { x: 226, y: 96 }, noContact: false,
      top: [{ x: 108, y: 226 }, { x: 163, y: 148 }, { x: 204, y: 98 }, { x: 248, y: 96 }, { x: 291, y: 150 }, { x: 334, y: 250 }],
      title: 'Front of the tongue raised, tip kept low', velum: false,
      body: 'The <b>front of the tongue</b> rises toward the hard palate while the tip stays low, against or just behind the lower teeth. Do not curl the tip upward: that shifts the sound toward zh, ch, or sh.',
      example: 'xièxie → 谢谢 “thank you”' },
    { id: 'velar', pinyin: 'g · k · h', name: 'Velar', marker: { x: 302, y: 114 }, noContact: false,
      top: [{ x: 110, y: 290 }, { x: 152, y: 286 }, { x: 196, y: 274 }, { x: 238, y: 238 }, { x: 285, y: 146 }, { x: 328, y: 200 }],
      title: 'Back of the tongue raised toward the soft palate', velum: false,
      body: 'The tongue tip remains relaxed behind the lower teeth. The <b>back of the tongue</b> rises toward the soft palate, forming the constriction deep in the mouth.',
      example: 'gōngzuò → 工作 “work”' }
  ],

  finals: [
    { id: 'n', pinyin: '-n', name: 'Alveolar nasal coda', marker: { x: 133, y: 138 }, noContact: false,
      top: [{ x: 131, y: 143 }, { x: 172, y: 203 }, { x: 210, y: 249 }, { x: 252, y: 272 }, { x: 296, y: 287 }, { x: 338, y: 298 }],
      velum: true,
      title: 'Tongue tip at the alveolar ridge; velum lowered',
      body: 'The tongue tip reaches the <b>alveolar ridge</b>, as it does for n. At the same time, the soft palate lowers, opening the nasal passage so that air flows through the nose. This is the final -n heard in syllables such as an, en, in, and uan.',
      example: 'chī <b>fàn</b> → 吃饭; fàn ends in -n' },
    { id: 'ng', pinyin: '-ng', name: 'Velar nasal coda', marker: { x: 302, y: 114 }, noContact: false,
      top: [{ x: 110, y: 290 }, { x: 152, y: 286 }, { x: 196, y: 274 }, { x: 238, y: 238 }, { x: 285, y: 146 }, { x: 328, y: 200 }],
      velum: true,
      title: 'Back of the tongue raised; velum lowered',
      body: 'The back of the tongue rises toward the soft palate, as it does for g and k. The soft palate lowers so that air can pass through the nose. Keep the tongue tip relaxed: the closure for -ng is made entirely at the back of the mouth.',
      example: 'Zhōngguó → 中国; Zhōng ends in -ng' },
    { id: 'r', pinyin: '-r (儿化)', name: 'Erhua (rhotacization)', marker: { x: 150, y: 190 }, noContact: true,
      top: [{ x: 150, y: 185 }, { x: 138, y: 218 }, { x: 198, y: 256 }, { x: 246, y: 272 }, { x: 292, y: 286 }, { x: 338, y: 298 }],
      velum: false,
      title: 'A slight backward curl with no contact',
      body: 'The tongue tip curls slightly upward and back without touching the palate. Erhua is not an added consonant; it changes the quality of the preceding final. The oral passage remains open throughout.',
      example: 'yīdiǎnr → 一点儿 “a little”' }
  ]
};

export default data;

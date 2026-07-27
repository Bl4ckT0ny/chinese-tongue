// Shared types for the tongue-placement diagram.
// data.ru.ts / data.en.ts must satisfy AppData exactly — if you add a field
// to one language file, TypeScript will force you to add it to the other too.

export interface Point {
  x: number;
  y: number;
}

/** The 6 tongue-surface control points, from front to back. */
export type TongueTop = [
  tip: Point,
  blade: Point,
  frontDorsum: Point,
  midDorsum: Point,
  backDorsum: Point,
  root: Point
];

export interface SoundGroup {
  id: string;
  /** Pinyin spelling shown on the button, e.g. "d · t · n · l". */
  pinyin: string;
  /** Short category name shown under the pinyin on the button. */
  name: string;
  /** Where the amber contact-point dot sits in the 640×440 viewBox. */
  marker: Point;
  /** True hides the filled dot and shows a dashed ring instead (e.g. -r, no closure). */
  noContact: boolean;
  /** True opens the soft palate flap and shows the dashed nasal-airflow line (-n, -ng). */
  velum: boolean;
  top: TongueTop;
  title: string;
  /** Explanation. May contain <b> tags — inserted as innerHTML. */
  body: string;
  /** Example word/phrase shown in the small callout box. May contain <b> tags. */
  example: string;
}

export interface AnatomyLabels {
  nasalCavity: string;
  softPalate: string;
  velumSub: string;
  alveolarRidge: string;
  hardPalate: string;
  lips: string;
  teeth: string;
  pharynx: string;
}

export interface UiText {
  eyebrow: string;
  h1: string;
  sub: string;
  tabInitials: string;
  tabFinals: string;
  diagramTitle: string;
  legend: { tongue: string; contactPoint: string; anatomy: string };
  labels: AnatomyLabels;
  hintInitials: string;
  hintFinals: string;
}

export interface AppData {
  lang: 'ru' | 'en';
  meta: { htmlTitle: string };
  ui: UiText;
  initials: SoundGroup[];
  finals: SoundGroup[];
}

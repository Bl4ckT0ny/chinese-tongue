import type { Point, TongueTop } from './types.js';

const FLOOR_Y = 335; // jaw floor ceiling for the tongue's underside

export function smoothPath(pts: Point[]): string {
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const mx = (pts[i].x + pts[i + 1].x) / 2;
    const my = (pts[i].y + pts[i + 1].y) / 2;
    d += ` Q ${pts[i].x} ${pts[i].y} ${mx} ${my}`;
  }
  const last = pts[pts.length - 1];
  d += ` L ${last.x} ${last.y}`;
  return d;
}

export interface TongueBottom {
  bottomTip: Point;
  bottomBelly: Point;
  bottomRoot: Point;
}

/**
 * Underside points computed relative to the top points so thickness can
 * never invert into a self-crossing loop, no matter how extreme a state's
 * top points are (this was a real bug — see README / tests/unit/geometry.test.mjs).
 */
export function tongueBottom(top: TongueTop): TongueBottom {
  const [tip, , frontD, midD, , root] = top;
  return {
    bottomTip: { x: tip.x - 4, y: Math.min(tip.y + 36, FLOOR_Y) },
    bottomBelly: {
      x: (frontD.x + midD.x) / 2,
      y: Math.min(Math.max(frontD.y, midD.y) + 52, FLOOR_Y)
    },
    bottomRoot: { x: root.x + 8, y: Math.min(root.y + 32, FLOOR_Y) }
  };
}

/**
 * Builds the closed tongue path from its 6 top-surface control points.
 */
export function tongueD(top: TongueTop): string {
  const [tip, blade, frontD, midD, backD, root] = top;
  const { bottomTip, bottomBelly, bottomRoot } = tongueBottom(top);

  const pts = [tip, blade, frontD, midD, backD, root, bottomRoot, bottomBelly, bottomTip, tip];
  return smoothPath(pts) + ' Z';
}

export const VELUM_HINGE: Point = { x: 300, y: 98 };

/** Soft palate (velum) flap: closed seals the nasal port, open drops down to vent it. */
export function velumD(open: boolean): string {
  if (!open) {
    return `M ${VELUM_HINGE.x} ${VELUM_HINGE.y}
      Q 335 108 355 138
      Q 362 150 356 158
      Q 335 140 305 122
      Q 296 112 ${VELUM_HINGE.x} ${VELUM_HINGE.y} Z`;
  }
  return `M ${VELUM_HINGE.x} ${VELUM_HINGE.y}
    Q 320 130 328 168
    Q 331 182 322 186
    Q 300 165 285 132
    Q 288 115 ${VELUM_HINGE.x} ${VELUM_HINGE.y} Z`;
}

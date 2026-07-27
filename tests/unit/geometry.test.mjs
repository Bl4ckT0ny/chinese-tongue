// Unit tests for src/geometry.ts, run against the compiled dist/geometry.js.
// Requires `npm run build` first. No browser needed — run with:
//   node --test tests/unit/
import test from 'node:test';
import assert from 'node:assert/strict';
import { smoothPath, tongueD, tongueBottom, velumD, VELUM_HINGE } from '../../dist/geometry.js';

test('smoothPath starts exactly at the first point', () => {
  const pts = [{ x: 10, y: 20 }, { x: 30, y: 40 }, { x: 50, y: 60 }];
  const d = smoothPath(pts);
  assert.equal(d.startsWith('M 10 20'), true);
});

test('smoothPath ends exactly at the last point', () => {
  const pts = [{ x: 10, y: 20 }, { x: 30, y: 40 }, { x: 50, y: 60 }];
  const d = smoothPath(pts);
  assert.equal(d.trim().endsWith('L 50 60'), true);
});

test('tongueD returns a closed path (starts with M, ends with Z)', () => {
  const top = [
    { x: 112, y: 288 }, { x: 158, y: 279 }, { x: 203, y: 276 },
    { x: 248, y: 280 }, { x: 293, y: 289 }, { x: 338, y: 298 }
  ];
  const d = tongueD(top);
  assert.equal(d.startsWith('M'), true);
  assert.equal(d.trim().endsWith('Z'), true);
});

// Regression test: the tongue's underside must always sit strictly below
// (larger y than) the corresponding top point, for every top configuration
// actually used by the app — otherwise the shape self-intersects into a
// loop, which is a real bug we hit and fixed (see README).
test('tongueBottom never produces an inverted (self-crossing) thickness', () => {
  const sampleTops = [
    // labial: everything low/flat
    [{ x: 112, y: 288 }, { x: 158, y: 279 }, { x: 203, y: 276 }, { x: 248, y: 280 }, { x: 293, y: 289 }, { x: 338, y: 298 }],
    // alveolar: tip raised high
    [{ x: 131, y: 143 }, { x: 172, y: 203 }, { x: 210, y: 249 }, { x: 252, y: 272 }, { x: 296, y: 287 }, { x: 338, y: 298 }],
    // palatal: front dorsum raised very high (y=96, near palate apex)
    [{ x: 108, y: 226 }, { x: 163, y: 148 }, { x: 204, y: 98 }, { x: 248, y: 96 }, { x: 291, y: 150 }, { x: 334, y: 250 }],
    // velar: back dorsum raised very high (y=146)
    [{ x: 110, y: 290 }, { x: 152, y: 286 }, { x: 196, y: 274 }, { x: 238, y: 238 }, { x: 285, y: 146 }, { x: 328, y: 200 }]
  ];

  for (const top of sampleTops) {
    const [tip, , frontD, midD, , root] = top;
    const { bottomTip, bottomBelly, bottomRoot } = tongueBottom(top);

    assert.ok(bottomTip.y > tip.y, `bottomTip.y (${bottomTip.y}) must be > tip.y (${tip.y})`);
    assert.ok(bottomRoot.y > root.y, `bottomRoot.y (${bottomRoot.y}) must be > root.y (${root.y})`);
    assert.ok(
      bottomBelly.y > Math.max(frontD.y, midD.y),
      `bottomBelly.y (${bottomBelly.y}) must be below the higher of frontDorsum/midDorsum`
    );
  }
});

test('velumD(open) and velumD(closed) both start at the same hinge point', () => {
  const closed = velumD(false);
  const open = velumD(true);
  assert.equal(closed.trim().startsWith(`M ${VELUM_HINGE.x} ${VELUM_HINGE.y}`), true);
  assert.equal(open.trim().startsWith(`M ${VELUM_HINGE.x} ${VELUM_HINGE.y}`), true);
});

test('velumD(open) and velumD(closed) produce different shapes', () => {
  assert.notEqual(velumD(true), velumD(false));
});

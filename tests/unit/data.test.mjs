// Structural + domain-consistency tests for the language data files.
// Run against compiled output — `npm run build` first.
import test from 'node:test';
import assert from 'node:assert/strict';
import ru from '../../dist/data.ru.js';
import en from '../../dist/data.en.js';

const VIEWBOX = { width: 640, height: 440 };

function ids(list) {
  return list.map((g) => g.id).sort();
}

function assertPointInBounds(p, label) {
  assert.equal(Number.isFinite(p.x), true, `${label}.x must be a finite number`);
  assert.equal(Number.isFinite(p.y), true, `${label}.y must be a finite number`);
  assert.ok(p.x >= 0 && p.x <= VIEWBOX.width, `${label}.x (${p.x}) out of viewBox 0..${VIEWBOX.width}`);
  assert.ok(p.y >= 0 && p.y <= VIEWBOX.height, `${label}.y (${p.y}) out of viewBox 0..${VIEWBOX.height}`);
}

test('ru and en expose the same set of initials ids', () => {
  assert.deepEqual(ids(ru.initials), ids(en.initials));
});

test('ru and en expose the same set of finals ids', () => {
  assert.deepEqual(ids(ru.finals), ids(en.finals));
});

for (const [langName, data] of [['ru', ru], ['en', en]]) {
  test(`${langName}: every sound has exactly 6 tongue-top points, in bounds`, () => {
    for (const group of [...data.initials, ...data.finals]) {
      assert.equal(group.top.length, 6, `${group.id}.top must have exactly 6 points`);
      group.top.forEach((p, i) => assertPointInBounds(p, `${group.id}.top[${i}]`));
      assertPointInBounds(group.marker, `${group.id}.marker`);
    }
  });

  test(`${langName}: no duplicate ids within initials or within finals`, () => {
    assert.equal(new Set(ids(data.initials)).size, data.initials.length);
    assert.equal(new Set(ids(data.finals)).size, data.finals.length);
  });

  test(`${langName}: -r has no contact and no velum opening`, () => {
    const r = data.finals.find((g) => g.id === 'r');
    assert.ok(r, 'finals must include an "r" entry');
    assert.equal(r.noContact, true);
    assert.equal(r.velum, false);
  });

  test(`${langName}: -n opens the velum and shares tongue placement with alveolar d/t/n/l`, () => {
    const n = data.finals.find((g) => g.id === 'n');
    const alveolar = data.initials.find((g) => g.id === 'alveolar');
    assert.ok(n && alveolar);
    assert.equal(n.velum, true);
    assert.deepEqual(n.top, alveolar.top);
  });

  test(`${langName}: -ng opens the velum and shares tongue placement with velar g/k/h`, () => {
    const ng = data.finals.find((g) => g.id === 'ng');
    const velar = data.initials.find((g) => g.id === 'velar');
    assert.ok(ng && velar);
    assert.equal(ng.velum, true);
    assert.deepEqual(ng.top, velar.top);
  });

  test(`${langName}: no initial opens the velum (only -n/-ng finals are nasal)`, () => {
    for (const group of data.initials) {
      assert.equal(group.velum, false, `initial "${group.id}" should not have velum:true`);
    }
  });
}

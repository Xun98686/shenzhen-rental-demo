import assert from 'node:assert/strict';
import test from 'node:test';
import { candidateAreas, places } from '../data/shenzhenData.js';
import { DemoMapAdapter } from './mapAdapter.js';

test('searchPlace returns Shenzhen place matches by keyword', () => {
  const adapter = new DemoMapAdapter({ places, candidateAreas });
  const results = adapter.searchPlace('腾讯');
  assert.equal(results[0].id, 'tencent-binhai');
});

test('getCommute returns deterministic commute data and a route', async () => {
  const adapter = new DemoMapAdapter({ places, candidateAreas, delayMs: 0 });
  const commute = await adapter.getCommute('chegongmiao', 'tencent-binhai');
  assert.equal(commute.minutes, 32);
  assert.equal(commute.distanceKm, 12.4);
  assert.ok(commute.route.length >= 2);
});

test('getCommuteMatrix returns all area to destination pairs', async () => {
  const adapter = new DemoMapAdapter({ places, candidateAreas, delayMs: 0 });
  const matrix = await adapter.getCommuteMatrix(['chegongmiao', 'keyuan'], ['tencent-binhai', 'futian-cbd']);
  assert.equal(matrix.chegongmiao['tencent-binhai'].minutes, 32);
  assert.equal(matrix.keyuan['futian-cbd'].minutes, 55);
});

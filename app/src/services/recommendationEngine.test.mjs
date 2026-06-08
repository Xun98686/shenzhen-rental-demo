import assert from 'node:assert/strict';
import test from 'node:test';
import { candidateAreas, defaultMembers, defaultWeights } from '../data/shenzhenData.js';
import { rankAreas, validateMembers, normalizeWeights } from './recommendationEngine.js';

test('validateMembers requires at least two complete members', () => {
  assert.deepEqual(validateMembers(defaultMembers).errors, []);
  assert.match(validateMembers(defaultMembers.slice(0, 1)).errors[0], /至少需要 2 个/);
  assert.match(validateMembers([{ id: 'm1', name: 'A', placeId: '', maxMinutes: 40 }]).errors[0], /请选择地点/);
});

test('normalizeWeights keeps proportions and totals 100', () => {
  const normalized = normalizeWeights({ fairness: 7, averageCommute: 3 });
  assert.equal(Math.round(Object.values(normalized).reduce((sum, value) => sum + value, 0)), 100);
  assert.equal(normalized.fairness, 70);
  assert.equal(normalized.averageCommute, 30);
});

test('rankAreas rewards commute fairness over one-person proximity', () => {
  const selectedMembers = defaultMembers;
  const commuteMatrix = {
    chegongmiao: {
      'tencent-binhai': { minutes: 32, distanceKm: 12.4 },
      'shenzhen-university': { minutes: 38, distanceKm: 13.6 },
      'futian-cbd': { minutes: 22, distanceKm: 5.2 }
    },
    keyuan: {
      'tencent-binhai': { minutes: 14, distanceKm: 3.2 },
      'shenzhen-university': { minutes: 18, distanceKm: 4.8 },
      'futian-cbd': { minutes: 55, distanceKm: 19.4 }
    }
  };
  const areas = candidateAreas.filter((area) => ['chegongmiao', 'keyuan'].includes(area.id));
  const results = rankAreas({ members: selectedMembers, candidateAreas: areas, commuteMatrix, weights: defaultWeights });
  assert.equal(results[0].area.id, 'chegongmiao');
  assert.ok(results[0].explanation.includes('通勤差距'));
});

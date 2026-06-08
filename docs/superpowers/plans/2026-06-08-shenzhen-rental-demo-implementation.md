# Shenzhen Rental Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a zero-dependency front-end demo that recommends Shenzhen co-rental areas for 2-4 people using simulated map/API commute data and an explainable scoring model.

**Architecture:** The app is a static ESM single-page interface under `app/`. Data, simulated map API behavior, recommendation scoring, UI rendering, and static serving are split into focused files so the fake API can later be replaced by a real AMap adapter without rewriting the UI or scoring engine.

**Tech Stack:** Vanilla HTML/CSS/JavaScript, browser SVG for the map, Node.js built-in `node:test` for unit tests, and a small Node static server for local demo hosting.

---

## File Structure

- Create `package.json`: declares ESM mode and scripts for tests and local serving.
- Create `app/index.html`: page shell and module entry.
- Create `app/src/styles.css`: responsive visual design for the workbench, form, map, recommendation cards, and tables.
- Create `app/src/data/shenzhenData.js`: built-in Shenzhen places, candidate areas, default members, and deterministic commute matrix.
- Create `app/src/services/mapAdapter.js`: `DemoMapAdapter` with search, single commute, and commute matrix methods.
- Create `app/src/services/recommendationEngine.js`: normalization, scoring, ranking, validation, and explanation generation.
- Create `app/src/main.js`: app state, event handlers, rendering, simulated loading, map drawing, and result selection.
- Create `app/src/services/recommendationEngine.test.mjs`: unit tests for ranking, validation, fairness, and weight normalization.
- Create `app/src/services/mapAdapter.test.mjs`: unit tests for search and simulated commute calls.
- Create `scripts/serve-static.mjs`: local server for `app/` with safe path handling and SPA-friendly static file serving.

## Task 1: Project Scripts and Static Server

**Files:**
- Create: `package.json`
- Create: `scripts/serve-static.mjs`

- [ ] **Step 1: Create project scripts**

Create `package.json`:

```json
{
  "type": "module",
  "scripts": {
    "test": "node --test app/src/**/*.test.mjs",
    "dev": "node scripts/serve-static.mjs"
  }
}
```

- [ ] **Step 2: Create the local static server**

Create `scripts/serve-static.mjs`:

```js
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'app');
const port = Number(process.env.PORT || 4173);

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml; charset=utf-8'
};

function resolveRequest(url) {
  const parsed = new URL(url, `http://localhost:${port}`);
  const pathname = decodeURIComponent(parsed.pathname);
  const relativePath = pathname === '/' ? 'index.html' : pathname.slice(1);
  const absolutePath = path.resolve(root, relativePath);
  if (!absolutePath.startsWith(root)) {
    return null;
  }
  return absolutePath;
}

const server = http.createServer(async (req, res) => {
  const filePath = resolveRequest(req.url || '/');
  if (!filePath) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  try {
    const body = await fs.readFile(filePath);
    const type = mimeTypes[path.extname(filePath)] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
});

server.listen(port, () => {
  console.log(`Shenzhen rental demo running at http://localhost:${port}`);
});
```

- [ ] **Step 3: Verify script metadata**

Run: `node -e "const pkg=require('./package.json'); console.log(pkg.scripts.test, pkg.scripts.dev)"`

Expected: prints `node --test app/src/**/*.test.mjs node scripts/serve-static.mjs`.

## Task 2: Data Model and Demo Map Adapter

**Files:**
- Create: `app/src/data/shenzhenData.js`
- Create: `app/src/services/mapAdapter.js`
- Create: `app/src/services/mapAdapter.test.mjs`

- [ ] **Step 1: Write failing map adapter tests**

Create `app/src/services/mapAdapter.test.mjs`:

```js
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
  const adapter = new DemoMapAdapter({ places, candidateAreas });
  const commute = await adapter.getCommute('chegongmiao', 'tencent-binhai');
  assert.equal(commute.minutes, 32);
  assert.equal(commute.distanceKm, 12.4);
  assert.ok(commute.route.length >= 2);
});

test('getCommuteMatrix returns all area to destination pairs', async () => {
  const adapter = new DemoMapAdapter({ places, candidateAreas });
  const matrix = await adapter.getCommuteMatrix(['chegongmiao', 'keyuan'], ['tencent-binhai', 'futian-cbd']);
  assert.equal(matrix.chegongmiao['tencent-binhai'].minutes, 32);
  assert.equal(matrix.keyuan['futian-cbd'].minutes, 55);
});
```

- [ ] **Step 2: Run map adapter tests and verify failure**

Run: `node --test app/src/services/mapAdapter.test.mjs`

Expected: FAIL because `shenzhenData.js` and `mapAdapter.js` do not exist yet.

- [ ] **Step 3: Implement Shenzhen demo data**

Create `app/src/data/shenzhenData.js`:

```js
export const places = [
  { id: 'tencent-binhai', name: '腾讯滨海大厦', district: '南山', x: 26, y: 36 },
  { id: 'shenzhen-university', name: '深圳大学', district: '南山', x: 24, y: 44 },
  { id: 'futian-cbd', name: '福田 CBD', district: '福田', x: 55, y: 48 },
  { id: 'convention-center', name: '会展中心', district: '福田', x: 58, y: 54 },
  { id: 'huaqiangbei', name: '华强北', district: '福田', x: 64, y: 42 },
  { id: 'qianhai', name: '前海', district: '南山', x: 17, y: 54 },
  { id: 'tech-park', name: '南山科技园', district: '南山', x: 29, y: 40 },
  { id: 'shenzhen-north', name: '深圳北站', district: '龙华', x: 58, y: 18 }
];

export const candidateAreas = [
  { id: 'chegongmiao', name: '车公庙 / 香蜜湖', district: '福田', x: 48, y: 48, rentScore: 72, lifestyleScore: 90, metroScore: 94, rentLabel: '中高' },
  { id: 'keyuan', name: '科技园', district: '南山', x: 28, y: 39, rentScore: 60, lifestyleScore: 86, metroScore: 88, rentLabel: '高' },
  { id: 'houhai', name: '后海', district: '南山', x: 31, y: 52, rentScore: 58, lifestyleScore: 92, metroScore: 90, rentLabel: '高' },
  { id: 'nanshan-center', name: '南山中心', district: '南山', x: 25, y: 50, rentScore: 70, lifestyleScore: 84, metroScore: 82, rentLabel: '中高' },
  { id: 'gangxia', name: '岗厦 / 会展中心', district: '福田', x: 58, y: 52, rentScore: 62, lifestyleScore: 91, metroScore: 93, rentLabel: '高' },
  { id: 'baoan-center', name: '宝安中心', district: '宝安', x: 13, y: 45, rentScore: 84, lifestyleScore: 80, metroScore: 82, rentLabel: '中' },
  { id: 'minzhi', name: '民治 / 深圳北', district: '龙华', x: 56, y: 22, rentScore: 88, lifestyleScore: 76, metroScore: 78, rentLabel: '中' },
  { id: 'huaqiangbei-area', name: '华强北', district: '福田', x: 64, y: 42, rentScore: 74, lifestyleScore: 88, metroScore: 86, rentLabel: '中高' },
  { id: 'qianhai-area', name: '前海', district: '南山', x: 18, y: 55, rentScore: 66, lifestyleScore: 82, metroScore: 80, rentLabel: '中高' }
];

export const defaultMembers = [
  { id: 'm1', name: 'Alice', placeId: 'tencent-binhai', maxMinutes: 45, priority: 1 },
  { id: 'm2', name: 'Ben', placeId: 'shenzhen-university', maxMinutes: 40, priority: 1 },
  { id: 'm3', name: 'Chloe', placeId: 'futian-cbd', maxMinutes: 50, priority: 1 }
];

export const defaultWeights = {
  fairness: 35,
  averageCommute: 25,
  maxCommute: 15,
  rentFit: 10,
  lifestyle: 10,
  metro: 5
};

export const commuteMatrix = {
  chegongmiao: {
    'tencent-binhai': { minutes: 32, distanceKm: 12.4 },
    'shenzhen-university': { minutes: 38, distanceKm: 13.6 },
    'futian-cbd': { minutes: 22, distanceKm: 5.2 },
    'convention-center': { minutes: 20, distanceKm: 5.7 },
    huaqiangbei: { minutes: 31, distanceKm: 8.1 },
    qianhai: { minutes: 42, distanceKm: 18.2 },
    'tech-park': { minutes: 35, distanceKm: 13.1 },
    'shenzhen-north': { minutes: 39, distanceKm: 16.4 }
  },
  keyuan: {
    'tencent-binhai': { minutes: 14, distanceKm: 3.2 },
    'shenzhen-university': { minutes: 18, distanceKm: 4.8 },
    'futian-cbd': { minutes: 55, distanceKm: 19.4 },
    'convention-center': { minutes: 58, distanceKm: 20.2 },
    huaqiangbei: { minutes: 60, distanceKm: 23.1 },
    qianhai: { minutes: 34, distanceKm: 11.8 },
    'tech-park': { minutes: 10, distanceKm: 2.1 },
    'shenzhen-north': { minutes: 62, distanceKm: 25.5 }
  },
  houhai: {
    'tencent-binhai': { minutes: 21, distanceKm: 5.9 },
    'shenzhen-university': { minutes: 26, distanceKm: 7.4 },
    'futian-cbd': { minutes: 48, distanceKm: 17.1 },
    'convention-center': { minutes: 46, distanceKm: 16.7 },
    huaqiangbei: { minutes: 54, distanceKm: 21.4 },
    qianhai: { minutes: 28, distanceKm: 8.2 },
    'tech-park': { minutes: 24, distanceKm: 6.2 },
    'shenzhen-north': { minutes: 61, distanceKm: 25.8 }
  },
  'nanshan-center': {
    'tencent-binhai': { minutes: 24, distanceKm: 7.2 },
    'shenzhen-university': { minutes: 16, distanceKm: 3.9 },
    'futian-cbd': { minutes: 52, distanceKm: 18.2 },
    'convention-center': { minutes: 50, distanceKm: 18.1 },
    huaqiangbei: { minutes: 57, distanceKm: 22.3 },
    qianhai: { minutes: 26, distanceKm: 8.7 },
    'tech-park': { minutes: 22, distanceKm: 5.6 },
    'shenzhen-north': { minutes: 60, distanceKm: 24.9 }
  },
  gangxia: {
    'tencent-binhai': { minutes: 44, distanceKm: 16.8 },
    'shenzhen-university': { minutes: 52, distanceKm: 18.6 },
    'futian-cbd': { minutes: 12, distanceKm: 2.1 },
    'convention-center': { minutes: 8, distanceKm: 1.4 },
    huaqiangbei: { minutes: 24, distanceKm: 5.6 },
    qianhai: { minutes: 57, distanceKm: 23.2 },
    'tech-park': { minutes: 46, distanceKm: 17.4 },
    'shenzhen-north': { minutes: 36, distanceKm: 14.2 }
  },
  'baoan-center': {
    'tencent-binhai': { minutes: 39, distanceKm: 15.4 },
    'shenzhen-university': { minutes: 42, distanceKm: 13.8 },
    'futian-cbd': { minutes: 62, distanceKm: 26.5 },
    'convention-center': { minutes: 64, distanceKm: 27.1 },
    huaqiangbei: { minutes: 69, distanceKm: 30.4 },
    qianhai: { minutes: 28, distanceKm: 10.4 },
    'tech-park': { minutes: 45, distanceKm: 15.9 },
    'shenzhen-north': { minutes: 72, distanceKm: 32.6 }
  },
  minzhi: {
    'tencent-binhai': { minutes: 65, distanceKm: 27.8 },
    'shenzhen-university': { minutes: 68, distanceKm: 29.2 },
    'futian-cbd': { minutes: 38, distanceKm: 15.1 },
    'convention-center': { minutes: 42, distanceKm: 16.3 },
    huaqiangbei: { minutes: 36, distanceKm: 14.7 },
    qianhai: { minutes: 76, distanceKm: 35.1 },
    'tech-park': { minutes: 67, distanceKm: 28.6 },
    'shenzhen-north': { minutes: 12, distanceKm: 2.9 }
  },
  'huaqiangbei-area': {
    'tencent-binhai': { minutes: 50, distanceKm: 20.5 },
    'shenzhen-university': { minutes: 56, distanceKm: 21.2 },
    'futian-cbd': { minutes: 24, distanceKm: 6.2 },
    'convention-center': { minutes: 28, distanceKm: 7.4 },
    huaqiangbei: { minutes: 8, distanceKm: 1.1 },
    qianhai: { minutes: 66, distanceKm: 28.3 },
    'tech-park': { minutes: 52, distanceKm: 20.1 },
    'shenzhen-north': { minutes: 34, distanceKm: 13.9 }
  },
  'qianhai-area': {
    'tencent-binhai': { minutes: 30, distanceKm: 10.8 },
    'shenzhen-university': { minutes: 28, distanceKm: 8.9 },
    'futian-cbd': { minutes: 58, distanceKm: 24.2 },
    'convention-center': { minutes: 60, distanceKm: 24.8 },
    huaqiangbei: { minutes: 68, distanceKm: 29.5 },
    qianhai: { minutes: 12, distanceKm: 2.5 },
    'tech-park': { minutes: 32, distanceKm: 11.2 },
    'shenzhen-north': { minutes: 74, distanceKm: 34.8 }
  }
};
```

- [ ] **Step 4: Implement DemoMapAdapter**

Create `app/src/services/mapAdapter.js`:

```js
import { commuteMatrix } from '../data/shenzhenData.js';

function buildRoute(origin, destination) {
  return [
    { x: origin.x, y: origin.y },
    { x: (origin.x + destination.x) / 2, y: Math.min(origin.y, destination.y) - 7 },
    { x: destination.x, y: destination.y }
  ];
}

export class DemoMapAdapter {
  constructor({ places, candidateAreas, delayMs = 260 }) {
    this.places = places;
    this.candidateAreas = candidateAreas;
    this.delayMs = delayMs;
  }

  searchPlace(keyword) {
    const normalized = keyword.trim().toLowerCase();
    if (!normalized) {
      return this.places;
    }
    return this.places.filter((place) => {
      return `${place.name}${place.district}${place.id}`.toLowerCase().includes(normalized);
    });
  }

  async getCommute(originAreaId, destinationPlaceId) {
    await this.#delay();
    const origin = this.candidateAreas.find((area) => area.id === originAreaId);
    const destination = this.places.find((place) => place.id === destinationPlaceId);
    const commute = commuteMatrix[originAreaId]?.[destinationPlaceId];
    if (!origin || !destination || !commute) {
      throw new Error(`Missing demo commute data for ${originAreaId} -> ${destinationPlaceId}`);
    }
    return {
      ...commute,
      originId: originAreaId,
      destinationId: destinationPlaceId,
      mode: 'public-transit',
      route: buildRoute(origin, destination)
    };
  }

  async getCommuteMatrix(originAreaIds, destinationPlaceIds) {
    await this.#delay();
    return Object.fromEntries(originAreaIds.map((originAreaId) => {
      const destinations = Object.fromEntries(destinationPlaceIds.map((destinationPlaceId) => {
        const origin = this.candidateAreas.find((area) => area.id === originAreaId);
        const destination = this.places.find((place) => place.id === destinationPlaceId);
        const commute = commuteMatrix[originAreaId]?.[destinationPlaceId];
        if (!origin || !destination || !commute) {
          throw new Error(`Missing demo commute data for ${originAreaId} -> ${destinationPlaceId}`);
        }
        return [destinationPlaceId, {
          ...commute,
          originId: originAreaId,
          destinationId: destinationPlaceId,
          mode: 'public-transit',
          route: buildRoute(origin, destination)
        }];
      }));
      return [originAreaId, destinations];
    }));
  }

  async #delay() {
    await new Promise((resolve) => setTimeout(resolve, this.delayMs));
  }
}
```

- [ ] **Step 5: Run map adapter tests**

Run: `node --test app/src/services/mapAdapter.test.mjs`

Expected: PASS.

## Task 3: Recommendation Engine

**Files:**
- Create: `app/src/services/recommendationEngine.js`
- Create: `app/src/services/recommendationEngine.test.mjs`

- [ ] **Step 1: Write failing recommendation tests**

Create `app/src/services/recommendationEngine.test.mjs`:

```js
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
```

- [ ] **Step 2: Run recommendation tests and verify failure**

Run: `node --test app/src/services/recommendationEngine.test.mjs`

Expected: FAIL because `recommendationEngine.js` does not exist yet.

- [ ] **Step 3: Implement recommendation engine**

Create `app/src/services/recommendationEngine.js`:

```js
const SCORE_CAP_MINUTES = 75;

export function validateMembers(members) {
  const errors = [];
  if (members.length < 2) {
    errors.push('至少需要 2 个合租成员才能做公平推荐。');
  }
  members.forEach((member) => {
    if (!member.placeId) {
      errors.push(`${member.name || '成员'} 请选择地点。`);
    }
    if (!Number.isFinite(Number(member.maxMinutes)) || Number(member.maxMinutes) <= 0) {
      errors.push(`${member.name || '成员'} 的最大通勤时间需要大于 0。`);
    }
  });
  return { valid: errors.length === 0, errors };
}

export function normalizeWeights(weights) {
  const entries = Object.entries(weights).filter(([, value]) => Number(value) > 0);
  const total = entries.reduce((sum, [, value]) => sum + Number(value), 0);
  if (total <= 0) {
    return { fairness: 35, averageCommute: 25, maxCommute: 15, rentFit: 10, lifestyle: 10, metro: 5 };
  }
  return Object.fromEntries(entries.map(([key, value]) => [key, Math.round((Number(value) / total) * 100)]));
}

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function average(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function buildExplanation({ area, commuteRows, averageMinutes, maxMinutes, spreadMinutes, overLimitCount }) {
  const longest = commuteRows.reduce((current, row) => row.minutes > current.minutes ? row : current, commuteRows[0]);
  if (overLimitCount > 0) {
    return `${area.name} 租金和配套有优势，但 ${longest.memberName} 预计 ${longest.minutes} 分钟，超过部分成员上限，因此不是最稳妥首选。`;
  }
  if (spreadMinutes <= 18) {
    return `推荐 ${area.name}，因为它在成员目的地之间折中，通勤差距约 ${spreadMinutes} 分钟，平均通勤 ${Math.round(averageMinutes)} 分钟，比较容易达成共识。`;
  }
  return `${area.name} 的平均通勤约 ${Math.round(averageMinutes)} 分钟，但最长通勤达到 ${maxMinutes} 分钟，适合作为备选区域比较。`;
}

export function rankAreas({ members, candidateAreas, commuteMatrix, weights }) {
  const normalizedWeights = normalizeWeights(weights);

  return candidateAreas.map((area) => {
    const commuteRows = members.map((member) => {
      const commute = commuteMatrix[area.id]?.[member.placeId];
      if (!commute) {
        throw new Error(`Missing commute data for ${area.id} -> ${member.placeId}`);
      }
      return {
        memberId: member.id,
        memberName: member.name,
        placeId: member.placeId,
        maxMinutes: Number(member.maxMinutes),
        minutes: commute.minutes,
        distanceKm: commute.distanceKm,
        route: commute.route || []
      };
    });

    const minutes = commuteRows.map((row) => row.minutes);
    const averageMinutes = average(minutes);
    const maxMinutes = Math.max(...minutes);
    const minMinutes = Math.min(...minutes);
    const spreadMinutes = maxMinutes - minMinutes;
    const overLimitCount = commuteRows.filter((row) => row.minutes > row.maxMinutes).length;
    const averageScore = clamp(100 - (averageMinutes / SCORE_CAP_MINUTES) * 100);
    const fairnessScore = clamp(100 - spreadMinutes * 2.6);
    const maxCommuteScore = clamp(100 - maxMinutes * 1.15 - overLimitCount * 18);

    const scoreParts = {
      fairness: fairnessScore,
      averageCommute: averageScore,
      maxCommute: maxCommuteScore,
      rentFit: area.rentScore,
      lifestyle: area.lifestyleScore,
      metro: area.metroScore
    };

    const totalScore = Object.entries(normalizedWeights).reduce((sum, [key, weight]) => {
      return sum + (scoreParts[key] || 0) * (weight / 100);
    }, 0);

    return {
      area,
      score: Math.round(totalScore),
      scoreParts,
      commuteRows,
      averageMinutes: Math.round(averageMinutes),
      maxMinutes,
      spreadMinutes,
      overLimitCount,
      explanation: buildExplanation({ area, commuteRows, averageMinutes, maxMinutes, spreadMinutes, overLimitCount })
    };
  }).sort((a, b) => b.score - a.score);
}
```

- [ ] **Step 4: Run recommendation tests**

Run: `node --test app/src/services/recommendationEngine.test.mjs`

Expected: PASS.

## Task 4: App Shell and UI Rendering

**Files:**
- Create: `app/index.html`
- Create: `app/src/main.js`
- Create: `app/src/styles.css`

- [ ] **Step 1: Create the HTML entry**

Create `app/index.html`:

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>深圳合租点推荐器</title>
  <link rel="stylesheet" href="./src/styles.css">
</head>
<body>
  <div id="app"></div>
  <script type="module" src="./src/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Implement the app UI and interactions**

Create `app/src/main.js` with these responsibilities:

```js
import { candidateAreas, defaultMembers, defaultWeights, places } from './data/shenzhenData.js';
import { DemoMapAdapter } from './services/mapAdapter.js';
import { rankAreas, validateMembers } from './services/recommendationEngine.js';

const adapter = new DemoMapAdapter({ places, candidateAreas });
const state = {
  members: structuredClone(defaultMembers),
  weights: { ...defaultWeights },
  results: [],
  selectedAreaId: null,
  loading: false,
  errors: []
};

const app = document.querySelector('#app');

function placeOptions(selected) {
  return places.map((place) => `<option value="${place.id}" ${place.id === selected ? 'selected' : ''}>${place.name}</option>`).join('');
}

function render() {
  const selectedResult = state.results.find((result) => result.area.id === state.selectedAreaId) || state.results[0];
  app.innerHTML = `
    <header class="topbar">
      <div>
        <p class="eyebrow">Demo API mode · Simulated AMap commute matrix</p>
        <h1>深圳合租点推荐器</h1>
        <p>为多个在不同地点上班/上学的人，推荐最公平、最容易达成共识的合租区域。</p>
      </div>
      <button class="ghost" data-action="calculate">${state.loading ? '模拟测算中...' : '计算推荐'}</button>
    </header>
    <main class="layout">
      <aside class="panel input-panel">
        <div class="section-title">
          <span>01</span>
          <h2>合租成员</h2>
        </div>
        <div class="members">${state.members.map(renderMember).join('')}</div>
        <button class="secondary" data-action="add-member" ${state.members.length >= 4 ? 'disabled' : ''}>添加成员</button>
        ${renderWeights()}
        ${renderErrors()}
      </aside>
      <section class="workspace">
        ${renderMap(selectedResult)}
        ${renderResults(selectedResult)}
      </section>
    </main>
  `;
  bindEvents();
}

function renderMember(member, index) {
  return `
    <article class="member-card">
      <div class="member-head">
        <input aria-label="成员姓名" data-member="${member.id}" data-field="name" value="${member.name}">
        <button class="icon-button" data-action="remove-member" data-member="${member.id}" ${state.members.length <= 2 ? 'disabled' : ''}>×</button>
      </div>
      <label>上班/上学地点
        <select data-member="${member.id}" data-field="placeId">${placeOptions(member.placeId)}</select>
      </label>
      <label>最大可接受通勤
        <input type="number" min="15" max="120" data-member="${member.id}" data-field="maxMinutes" value="${member.maxMinutes}">
      </label>
      <p class="member-note">成员 ${index + 1} · 用于公平性评分</p>
    </article>
  `;
}

function renderWeights() {
  const labels = {
    fairness: '通勤公平',
    averageCommute: '平均通勤',
    maxCommute: '最差通勤',
    rentFit: '租金适配',
    lifestyle: '生活便利',
    metro: '地铁可达'
  };
  return `
    <div class="section-title weights-title">
      <span>02</span>
      <h2>推荐偏好</h2>
    </div>
    <div class="weights">
      ${Object.entries(state.weights).map(([key, value]) => `
        <label class="weight-row">${labels[key]} <strong>${value}%</strong>
          <input type="range" min="0" max="60" value="${value}" data-weight="${key}">
        </label>
      `).join('')}
    </div>
  `;
}

function renderErrors() {
  if (!state.errors.length) return '';
  return `<div class="errors">${state.errors.map((error) => `<p>${error}</p>`).join('')}</div>`;
}

function renderMap(selectedResult) {
  const area = selectedResult?.area;
  const routes = selectedResult?.commuteRows || [];
  return `
    <section class="panel map-panel">
      <div class="map-head">
        <div>
          <p class="eyebrow">03 · Simulated map</p>
          <h2>深圳通勤示意图</h2>
        </div>
        <span class="status">${state.loading ? 'Calling DemoMapAdapter...' : 'API ready'}</span>
      </div>
      <svg viewBox="0 0 100 70" class="map">
        <path d="M8 48 C18 28, 35 20, 51 25 C68 30, 80 22, 91 35 C87 49, 73 60, 51 61 C32 62, 17 57, 8 48Z" class="district-shape"></path>
        <text x="18" y="61">宝安</text><text x="28" y="29">南山</text><text x="54" y="43">福田</text><text x="59" y="17">龙华</text>
        ${routes.map((row) => row.route.length ? `<polyline points="${row.route.map((point) => `${point.x},${point.y}`).join(' ')}" class="route-line"></polyline>` : '').join('')}
        ${candidateAreas.map((candidate) => `<circle class="area-dot ${candidate.id === area?.id ? 'active' : ''}" cx="${candidate.x}" cy="${candidate.y}" r="${candidate.id === area?.id ? 2.6 : 1.7}" data-action="select-area" data-area="${candidate.id}"><title>${candidate.name}</title></circle>`).join('')}
        ${state.members.map((member) => {
          const place = places.find((item) => item.id === member.placeId);
          return `<g><rect class="place-dot" x="${place.x - 1.6}" y="${place.y - 1.6}" width="3.2" height="3.2" rx="0.8"></rect><text class="place-label" x="${place.x + 2.2}" y="${place.y - 1.8}">${member.name}</text></g>`;
        }).join('')}
      </svg>
    </section>
  `;
}

function renderResults(selectedResult) {
  if (!state.results.length) {
    return `<section class="panel empty"><h2>等待测算</h2><p>点击“计算推荐”后，系统会模拟调用地图通勤矩阵并生成推荐。</p></section>`;
  }

  return `
    <section class="result-grid">
      <article class="panel top-result">
        <p class="eyebrow">Top recommendation</p>
        <div class="result-head">
          <div><h2>${selectedResult.area.name}</h2><p>${selectedResult.explanation}</p></div>
          <strong>${selectedResult.score}</strong>
        </div>
        <div class="metrics">
          <span>平均 ${selectedResult.averageMinutes} min</span>
          <span>最差 ${selectedResult.maxMinutes} min</span>
          <span>差距 ${selectedResult.spreadMinutes} min</span>
          <span>租金 ${selectedResult.area.rentLabel}</span>
        </div>
      </article>
      <article class="panel commute-panel">
        <h2>成员通勤</h2>
        ${selectedResult.commuteRows.map((row) => `<div class="commute-row"><span>${row.memberName}</span><strong>${row.minutes} min</strong><em>${row.distanceKm} km</em></div>`).join('')}
      </article>
      <article class="panel table-panel">
        <h2>候选区域对比</h2>
        <table>
          <thead><tr><th>区域</th><th>总分</th><th>平均</th><th>最差</th><th>租金</th></tr></thead>
          <tbody>
            ${state.results.map((result) => `<tr class="${result.area.id === selectedResult.area.id ? 'selected' : ''}" data-action="select-area" data-area="${result.area.id}"><td>${result.area.name}</td><td>${result.score}</td><td>${result.averageMinutes} min</td><td>${result.maxMinutes} min</td><td>${result.area.rentLabel}</td></tr>`).join('')}
          </tbody>
        </table>
      </article>
      <article class="panel algorithm-panel">
        <h2>推荐规则</h2>
        <p>总分 = 通勤公平 + 平均通勤 + 最差通勤惩罚 + 租金适配 + 生活便利 + 地铁可达。</p>
        <p>面试讲述重点：这里先用 DemoMapAdapter 模拟高德通勤矩阵，未来替换真实 AMapAdapter 即可。</p>
      </article>
    </section>
  `;
}

function bindEvents() {
  document.querySelectorAll('[data-field]').forEach((input) => {
    input.addEventListener('input', (event) => {
      const member = state.members.find((item) => item.id === event.target.dataset.member);
      const field = event.target.dataset.field;
      member[field] = field === 'maxMinutes' ? Number(event.target.value) : event.target.value;
      render();
    });
  });

  document.querySelectorAll('[data-weight]').forEach((input) => {
    input.addEventListener('input', (event) => {
      state.weights[event.target.dataset.weight] = Number(event.target.value);
      render();
    });
  });

  document.querySelectorAll('[data-action]').forEach((element) => {
    element.addEventListener('click', async (event) => {
      const action = event.currentTarget.dataset.action;
      if (action === 'calculate') await calculate();
      if (action === 'add-member') addMember();
      if (action === 'remove-member') removeMember(event.currentTarget.dataset.member);
      if (action === 'select-area') selectArea(event.currentTarget.dataset.area);
    });
  });
}

function addMember() {
  if (state.members.length >= 4) return;
  state.members.push({ id: crypto.randomUUID(), name: `Member ${state.members.length + 1}`, placeId: places[state.members.length % places.length].id, maxMinutes: 50, priority: 1 });
  render();
}

function removeMember(memberId) {
  if (state.members.length <= 2) return;
  state.members = state.members.filter((member) => member.id !== memberId);
  render();
}

function selectArea(areaId) {
  state.selectedAreaId = areaId;
  render();
}

async function calculate() {
  const validation = validateMembers(state.members);
  state.errors = validation.errors;
  if (!validation.valid) {
    render();
    return;
  }

  state.loading = true;
  render();
  const matrix = await adapter.getCommuteMatrix(candidateAreas.map((area) => area.id), state.members.map((member) => member.placeId));
  state.results = rankAreas({ members: state.members, candidateAreas, commuteMatrix: matrix, weights: state.weights });
  state.selectedAreaId = state.results[0]?.area.id || null;
  state.loading = false;
  render();
}

render();
calculate();
```

- [ ] **Step 3: Implement responsive CSS**

Create `app/src/styles.css`:

```css
:root {
  --bg: #f6f7f9;
  --panel: #ffffff;
  --ink: #111827;
  --muted: #6b7280;
  --line: #e5e7eb;
  --blue: #2563eb;
  --blue-soft: #eff6ff;
  --green: #059669;
  --amber: #d97706;
  --danger: #b91c1c;
  --shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--ink);
  font-family: Inter, Arial, "Microsoft YaHei", sans-serif;
}

button,
input,
select {
  font: inherit;
}

button {
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.topbar {
  min-height: 104px;
  padding: 20px 28px;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: center;
  background: var(--panel);
  border-bottom: 1px solid var(--line);
}

.topbar h1 {
  margin: 4px 0 6px;
  font-size: 26px;
  line-height: 1.15;
}

.topbar p {
  margin: 0;
  color: var(--muted);
  line-height: 1.5;
}

.eyebrow {
  margin: 0;
  color: var(--blue);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.layout {
  max-width: 1280px;
  margin: 0 auto;
  padding: 22px;
  display: grid;
  grid-template-columns: minmax(300px, 360px) minmax(0, 1fr);
  gap: 18px;
  align-items: start;
}

.panel {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 8px;
  box-shadow: var(--shadow);
}

.input-panel {
  padding: 16px;
  position: sticky;
  top: 16px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.section-title span {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: var(--blue-soft);
  color: var(--blue);
  font-size: 12px;
  font-weight: 800;
}

.section-title h2,
.panel h2 {
  margin: 0;
  font-size: 17px;
  line-height: 1.3;
}

.members {
  display: grid;
  gap: 10px;
}

.member-card {
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 12px;
  background: #fbfdff;
}

.member-head {
  display: grid;
  grid-template-columns: 1fr 32px;
  gap: 8px;
  align-items: center;
}

label {
  display: grid;
  gap: 6px;
  margin-top: 10px;
  color: #374151;
  font-size: 13px;
  font-weight: 700;
}

input,
select {
  width: 100%;
  min-height: 38px;
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 8px 10px;
  background: #ffffff;
  color: var(--ink);
}

input:focus,
select:focus,
button:focus {
  outline: 3px solid rgba(37, 99, 235, 0.18);
  outline-offset: 1px;
}

.member-note {
  margin: 8px 0 0;
  color: var(--muted);
  font-size: 12px;
}

.icon-button {
  width: 32px;
  height: 32px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #ffffff;
  color: var(--muted);
  font-size: 18px;
}

.secondary,
.ghost {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #ffffff;
  color: var(--ink);
  font-weight: 800;
}

.secondary {
  width: 100%;
  min-height: 40px;
  margin-top: 12px;
}

.ghost {
  min-width: 144px;
  min-height: 42px;
  padding: 0 16px;
  background: var(--blue);
  border-color: var(--blue);
  color: #ffffff;
}

.weights-title {
  margin-top: 20px;
}

.weights {
  display: grid;
  gap: 8px;
}

.weight-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px 10px;
  align-items: center;
  margin-top: 0;
}

.weight-row input {
  grid-column: 1 / -1;
  padding: 0;
  min-height: 24px;
}

.errors {
  margin-top: 14px;
  padding: 10px 12px;
  border-radius: 8px;
  background: #fef2f2;
  color: var(--danger);
  font-size: 13px;
}

.errors p {
  margin: 4px 0;
}

.workspace {
  display: grid;
  gap: 16px;
}

.map-panel {
  padding: 16px;
}

.map-head {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: start;
}

.status {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  background: #ecfdf5;
  color: var(--green);
  font-size: 12px;
  font-weight: 800;
  white-space: nowrap;
}

.map {
  width: 100%;
  aspect-ratio: 16 / 8;
  margin-top: 12px;
  display: block;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: linear-gradient(180deg, #f8fbff 0%, #eef6ff 100%);
}

.district-shape {
  fill: #dbeafe;
  stroke: #93c5fd;
  stroke-width: 0.8;
}

.map text {
  fill: #64748b;
  font-size: 3px;
  font-weight: 700;
}

.route-line {
  fill: none;
  stroke: rgba(37, 99, 235, 0.52);
  stroke-width: 0.9;
  stroke-dasharray: 2 1.6;
}

.area-dot {
  fill: #ffffff;
  stroke: #2563eb;
  stroke-width: 0.8;
}

.area-dot.active {
  fill: #2563eb;
  stroke: #1d4ed8;
}

.place-dot {
  fill: #f97316;
  stroke: #ffffff;
  stroke-width: 0.5;
}

.place-label {
  fill: #111827;
  font-size: 2.6px;
  font-weight: 800;
}

.result-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 16px;
}

.top-result,
.commute-panel,
.table-panel,
.algorithm-panel,
.empty {
  padding: 16px;
}

.top-result {
  grid-column: 1 / -1;
  background: var(--blue-soft);
  border-color: #bfdbfe;
}

.result-head {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: start;
}

.result-head h2 {
  margin-bottom: 8px;
  font-size: 22px;
}

.result-head p,
.algorithm-panel p,
.empty p {
  margin: 0;
  color: var(--muted);
  line-height: 1.55;
}

.result-head strong {
  font-size: 42px;
  line-height: 1;
  color: var(--blue);
}

.metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.metrics span {
  padding: 6px 9px;
  border-radius: 999px;
  background: #ffffff;
  color: #374151;
  font-size: 12px;
  font-weight: 800;
}

.commute-panel {
  display: grid;
  gap: 10px;
}

.commute-row {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 10px;
  align-items: center;
  border-bottom: 1px solid var(--line);
  padding-bottom: 10px;
}

.commute-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.commute-row strong {
  color: var(--blue);
}

.commute-row em {
  color: var(--muted);
  font-style: normal;
  font-size: 12px;
}

.table-panel {
  grid-column: 1 / -1;
  overflow-x: auto;
}

table {
  width: 100%;
  min-width: 640px;
  border-collapse: collapse;
  font-size: 13px;
}

th,
td {
  border-bottom: 1px solid var(--line);
  padding: 10px 8px;
  text-align: left;
}

th {
  color: #374151;
  font-weight: 900;
}

tr[data-action] {
  cursor: pointer;
}

tr.selected td {
  background: #f8fbff;
  font-weight: 800;
}

.algorithm-panel {
  grid-column: 1 / -1;
  display: grid;
  gap: 8px;
}

@media (max-width: 980px) {
  .layout {
    grid-template-columns: 1fr;
    padding: 14px;
  }

  .input-panel {
    position: static;
  }

  .result-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .topbar {
    display: grid;
    padding: 16px;
  }

  .topbar h1 {
    font-size: 22px;
  }

  .ghost {
    width: 100%;
  }

  .map-head,
  .result-head {
    display: grid;
  }

  .map {
    aspect-ratio: 4 / 3;
  }

  .commute-row {
    grid-template-columns: 1fr auto;
  }

  .commute-row em {
    grid-column: 1 / -1;
  }
}
```

- [ ] **Step 4: Smoke test app shell**

Run: `node scripts/serve-static.mjs`

Expected: prints `Shenzhen rental demo running at http://localhost:4173`.

Open: `http://localhost:4173`

Expected: page renders input panel, simulated map, and recommendation results.

## Task 5: Verification and Polish

**Files:**
- Modify: `app/src/styles.css`
- Modify: `app/src/main.js` only if verification finds UI defects.

- [ ] **Step 1: Run all unit tests**

Run: `npm test`

Expected: all Node tests pass.

- [ ] **Step 2: Start local server**

Run: `npm run dev`

Expected: local app serves at `http://localhost:4173`.

- [ ] **Step 3: Verify desktop UI**

Open `http://localhost:4173` at desktop width.

Expected:
- Input panel is visible.
- Map is nonblank.
- Candidate area dots and member markers are visible.
- Recommendation list has at least 5 areas.
- Clicking a candidate row updates the top recommendation and highlighted dot.

- [ ] **Step 4: Verify mobile UI**

Resize to mobile width.

Expected:
- Layout becomes one column.
- No button or table text overlaps.
- Map remains visible.
- Form fields are usable.

- [ ] **Step 5: Commit implementation**

Run:

```bash
git add package.json app scripts/serve-static.mjs
git commit -m "Build Shenzhen rental recommendation demo"
```

Expected: commit succeeds with the front-end demo files.

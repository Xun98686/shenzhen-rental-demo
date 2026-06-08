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
        <span class="status">${state.loading ? '模拟通勤 API 测算中...' : 'API ready'}</span>
      </div>
      <svg viewBox="0 0 100 70" class="map" role="img" aria-label="深圳合租候选区域和成员目的地通勤示意图">
        <path d="M8 48 C18 28, 35 20, 51 25 C68 30, 80 22, 91 35 C87 49, 73 60, 51 61 C32 62, 17 57, 8 48Z" class="district-shape"></path>
        <text x="18" y="61">宝安</text><text x="28" y="29">南山</text><text x="54" y="43">福田</text><text x="59" y="17">龙华</text>
        ${routes.map((row) => row.route.length ? `<polyline points="${row.route.map((point) => `${point.x},${point.y}`).join(' ')}" class="route-line"></polyline>` : '').join('')}
        ${candidateAreas.map((candidate) => `<circle tabindex="0" class="area-dot ${candidate.id === area?.id ? 'active' : ''}" cx="${candidate.x}" cy="${candidate.y}" r="${candidate.id === area?.id ? 2.6 : 1.7}" data-action="select-area" data-area="${candidate.id}"><title>${candidate.name}</title></circle>`).join('')}
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
      </article>
    </section>
  `;
}

function bindEvents() {
  document.querySelectorAll('[data-field]').forEach((input) => {
    input.addEventListener('change', (event) => {
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
    element.addEventListener('keydown', (event) => {
      if ((event.key === 'Enter' || event.key === ' ') && event.currentTarget.dataset.action === 'select-area') {
        event.preventDefault();
        selectArea(event.currentTarget.dataset.area);
      }
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

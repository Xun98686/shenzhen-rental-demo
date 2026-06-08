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

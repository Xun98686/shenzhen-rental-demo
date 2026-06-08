const SCORE_CAP_MINUTES = 75;

export function validateMembers(members) {
  const errors = [];
  members.forEach((member) => {
    if (!member.placeId) {
      errors.push(`${member.name || '成员'} 请选择地点。`);
    }
    if (!Number.isFinite(Number(member.maxMinutes)) || Number(member.maxMinutes) <= 0) {
      errors.push(`${member.name || '成员'} 的最大通勤时间需要大于 0。`);
    }
  });
  if (members.length < 2) {
    errors.push('至少需要 2 个合租成员才能做公平推荐。');
  }
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

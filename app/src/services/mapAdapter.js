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

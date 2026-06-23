import { WILAYA_COORDINATES } from "../data/mockData";

export interface UserLocation {
  lat: number;
  lng: number;
}

/** Haversine formula — retourne la distance en km entre deux points GPS */
export function getDistanceKm(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Retourne la distance en km depuis la position utilisateur vers une wilaya */
export function distanceToWilaya(userLoc: UserLocation, wilaya: string): number {
  const coords = WILAYA_COORDINATES[wilaya];
  if (!coords) return Infinity;
  return getDistanceKm(userLoc.lat, userLoc.lng, coords.lat, coords.lng);
}

/** Trouve la wilaya la plus proche de la position utilisateur */
export function nearestWilaya(userLoc: UserLocation): string {
  let minDist = Infinity;
  let nearest = "Alger";
  for (const [wilaya, coords] of Object.entries(WILAYA_COORDINATES)) {
    const d = getDistanceKm(userLoc.lat, userLoc.lng, coords.lat, coords.lng);
    if (d < minDist) {
      minDist = d;
      nearest = wilaya;
    }
  }
  return nearest;
}

/** Trie un tableau de listings par distance croissante depuis la position utilisateur */
export function sortByDistance<T extends { wilaya: string }>(
  listings: T[],
  userLoc: UserLocation
): T[] {
  return [...listings].sort(
    (a, b) => distanceToWilaya(userLoc, a.wilaya) - distanceToWilaya(userLoc, b.wilaya)
  );
}

/** Demande la géolocalisation au navigateur — retourne une promesse */
export function requestGeolocation(): Promise<UserLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Géolocalisation non supportée par ce navigateur."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      { timeout: 10000, maximumAge: 300000 }
    );
  });
}

/** Formate la distance en texte lisible */
export function formatDistance(km: number): string {
  if (km < 1) return "< 1 km";
  if (km < 10) return `~${Math.round(km)} km`;
  if (km < 100) return `~${Math.round(km / 5) * 5} km`;
  return `~${Math.round(km / 10) * 10} km`;
}

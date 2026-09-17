// Google Maps needs finite coordinates; until the saved location loads, centre on Amman.
const AMMAN = { lat: 31.9539, lng: 35.9106 };

export const mapPoint = (location) => {
  const lat = parseFloat(location?.latitude);
  const lng = parseFloat(location?.longitude);
  return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : AMMAN;
};

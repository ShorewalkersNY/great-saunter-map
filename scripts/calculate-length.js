// calculate-length.js
// Calculates the length of the route in src/assets/data/route.json using turf.js

const fs = require('fs');
const path = require('path');
const turfLength = require('@turf/length').default;


const routePath = path.join(__dirname, '../src/assets/data/route.json');

fs.readFile(routePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading route.json:', err);
    process.exit(1);
  }
  let geojson;
  try {
    geojson = JSON.parse(data);
  } catch (e) {
    console.error('Invalid JSON:', e);
    process.exit(1);
  }

  // Calculate total length in kilometers and miles
  const lengthKm = turfLength(geojson, { units: 'kilometers' });
  const lengthMiles = turfLength(geojson, { units: 'miles' });
  console.log(`Route length: ${lengthKm.toFixed(2)} km (${lengthMiles.toFixed(2)} miles)`);
});

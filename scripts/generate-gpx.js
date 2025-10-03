const fs = require('fs');
const path = require('path');

// Read JSON files
const pointsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/assets/data/points.json'), 'utf8'));
const routeData = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/assets/data/route.json'), 'utf8'));

// GPX template functions
function createGPXHeader() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Great Saunter Map" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>Great Saunter NYC</name>
    <desc>32-mile walk around Manhattan</desc>
  </metadata>`;
}

function createGPXFooter() {
  return '</gpx>';
}

function createWaypoint(feature) {
  const [lon, lat] = feature.geometry.coordinates;
  const name = feature.properties.name || 'Waypoint';
  const desc = feature.properties.description || '';
  const type = feature.properties.type || '';
  
  return `  <wpt lat="${lat}" lon="${lon}">
    <name><![CDATA[${name}]]></name>
    <desc><![CDATA[${desc}]]></desc>
    <type>${type}</type>
  </wpt>`;
}

function createTrackPoint(coordinates) {
  const [lon, lat] = coordinates;
  return `      <trkpt lat="${lat}" lon="${lon}"></trkpt>`;
}

// Generate points GPX
function generatePointsGPX() {
  let gpx = createGPXHeader();
  
  pointsData.features.forEach(feature => {
    gpx += '\n' + createWaypoint(feature);
  });
  
  gpx += '\n' + createGPXFooter();
  return gpx;
}

// Generate route GPX
function generateRouteGPX() {
  let gpx = createGPXHeader();
  
  if (routeData.features && routeData.features.length > 0) {
    gpx += '\n  <trk>';
    gpx += '\n    <name>Great Saunter Route</name>';
    gpx += '\n    <trkseg>';
    
    routeData.features.forEach(feature => {
      if (feature.geometry.type === 'LineString') {
        feature.geometry.coordinates.forEach(coord => {
          gpx += '\n' + createTrackPoint(coord);
        });
      } else if (feature.geometry.type === 'Point') {
        gpx += '\n' + createTrackPoint(feature.geometry.coordinates);
      }
    });
    
    gpx += '\n    </trkseg>';
    gpx += '\n  </trk>';
  }
  
  gpx += '\n' + createGPXFooter();
  return gpx;
}

// Ensure public directory exists
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write GPX files
fs.writeFileSync(path.join(publicDir, 'great-saunter-points.gpx'), generatePointsGPX());
fs.writeFileSync(path.join(publicDir, 'great-saunter-route.gpx'), generateRouteGPX());

console.log('GPX files generated successfully!');
console.log('- great-saunter-points.gpx');
console.log('- great-saunter-route.gpx');

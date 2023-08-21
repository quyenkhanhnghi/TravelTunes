// var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
import mapboxgl from 'mapbox-gl';

export function initializeMap() {
  mapboxgl.accessToken =
    'pk.eyJ1IjoibmdoaXF1eWVuIiwiYSI6ImNsam5jajNtYzFmNGMzcWsyemt0b3IwZ2IifQ.z-hUZWwJgXWRE8mpszCjbQ';
  let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
  });
}
console.log('Hello from mapBox');
const locations = JSON.parse(document.getElementById('map').dataset.locations);

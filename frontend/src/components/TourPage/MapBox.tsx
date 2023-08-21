import mapboxgl from 'mapbox-gl';
import React, { useEffect, useRef } from 'react';
import { LocationType } from './TourDetail';

interface mapBoxProps {
  data: {
    locations: LocationType[];
  };
}

export const MapBox: React.FC<mapBoxProps> = ({ data }) => {
  const { locations } = data;
  mapboxgl.accessToken =
    'pk.eyJ1IjoibmdoaXF1eWVuIiwiYSI6ImNsam5hMGpjajBzbW8zZ24zempjZTMyeG4ifQ.5Va3f5ZRbHLqz-gq-aF6QQ';

  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/nghiquyen/cljorc30d00p301r5em444bmo',
      // scrollZoom: false,
    });

    map.current.on('load', () => {
      const bounds = new mapboxgl.LngLatBounds();

      locations.forEach((loc) => {
        // Create marker
        const el = document.createElement('div');
        el.className = 'marker';

        // Add popup
        const popup = new mapboxgl.Popup({
          offset: 30,
          anchor: 'top',
          closeOnClick: false,
        })
          .setLngLat(loc.coordinates)
          .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`);
        // .addTo(map.current!);

        // Add marker
        new mapboxgl.Marker({
          element: el,
          anchor: 'bottom',
        })
          .setLngLat(loc.coordinates)
          .setPopup(popup)
          .addTo(map.current!);

        // Open the popup initially
        popup.addTo(map.current!);
        // Extend map bounds to include current position
        bounds.extend(loc.coordinates);
      });

      map.current!.fitBounds(bounds, {
        padding: {
          top: 250,
          bottom: 200,
          left: 200,
          right: 200,
        },
      });
    });
  });

  return <div ref={mapContainer} id='map'></div>;
};

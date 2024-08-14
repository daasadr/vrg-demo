import React from 'react';
import 'ol/ol.css';

interface MapComponentProps {
  mapRef: React.RefObject<HTMLDivElement>;
}

const MapComponent: React.FC<MapComponentProps> = ({ mapRef }) => {
  return (
    <div ref={mapRef} style={{ width: '100%', height: '400px', overflow: 'hidden' }}></div>
  );
};

export default MapComponent;
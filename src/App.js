import React from 'react';
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';

function App() {
  React.useEffect(() => {
    const map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: fromLonLat([14.4378, 50.0755]), // Praha
        zoom: 7
      })
    });
  }, []);

  return (
    <div className="App">
      <h1>VRG Demo</h1>
      <div id="map" style={{ width: '100%', height: '550px', overflow: 'hidden' }}></div>
    </div>
  );
}

export default App;

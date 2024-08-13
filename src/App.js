import React, { useState, useEffect, useRef } from 'react';
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Draw } from 'ol/interaction';
import { LineString } from 'ol/geom';
import { getLength } from 'ol/sphere';
import { unByKey } from 'ol/Observable';
import { Button, Typography, Box, Paper } from '@mui/material';

function App() {
  const [map, setMap] = useState(null);
  const [measureTool, setMeasureTool] = useState(null);
  const [distance, setDistance] = useState(null);
  const [azimuth, setAzimuth] = useState(null);
  
  const mapElement = useRef(null);
  const measureLayerRef = useRef(null);

  useEffect(() => {
    const initialMap = new Map({
      target: mapElement.current,
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

    setMap(initialMap);

    const measureSource = new VectorSource();
    const measureLayer = new VectorLayer({
      source: measureSource,
      style: {
        'stroke-color': 'rgba(255, 0, 0, 0.8)',
        'stroke-width': 2
      }
    });
    initialMap.addLayer(measureLayer);
    measureLayerRef.current = measureLayer;

    return () => initialMap.setTarget(undefined);
  }, []);

  const startMeasure = () => {
    if (measureTool) {
      map.removeInteraction(measureTool);
    }

    const source = measureLayerRef.current.getSource();
    source.clear();

    const draw = new Draw({
      source: source,
      type: 'LineString',
      style: {
        'stroke-color': 'rgba(255, 0, 0, 0.8)',
        'stroke-width': 2
      },
      maxPoints: Infinity, // Povolí neomezený počet bodů
      snapTolerance: 20, // Zvýší toleranci pro kliknutí na stejný bod
      finishCondition: (event) => {
        // Ukončí měření, pokud je kliknuto na poslední bod
        const feature = draw.getOverlay().getSource().getFeatures()[0];
        if (feature) {
          const geometry = feature.getGeometry();
          const coordinates = geometry.getCoordinates();
          if (coordinates.length > 1) {
            const lastCoord = coordinates[coordinates.length - 1];
            const clickCoord = event.coordinate;
            const tolerance = map.getView().getResolution() * draw.snapTolerance_;
            return Math.abs(lastCoord[0] - clickCoord[0]) <= tolerance &&
                   Math.abs(lastCoord[1] - clickCoord[1]) <= tolerance;
          }
        }
        return false;
      }
    });

    let listener;
    draw.on('drawstart', (evt) => {
      const feature = evt.feature;

      listener = feature.getGeometry().on('change', (e) => {
        const line = e.target;
        const coordinates = line.getCoordinates();
        
        if (coordinates.length >= 2) {
          const length = getLength(line);
          setDistance(Math.round(length * 100) / 100);
          
          const start = coordinates[0];
          const end = coordinates[coordinates.length - 1];
          const dx = end[0] - start[0];
          const dy = end[1] - start[1];
          const rotation = Math.atan2(dy, dx);
          setAzimuth(Math.round((rotation * 180 / Math.PI + 360) % 360 * 100) / 100);
        }
      });
    });

    draw.on('drawend', () => {
      unByKey(listener);
    });

    map.addInteraction(draw);
    setMeasureTool(draw);
  };

  return (
    <div className="App">
      <h1>VRG Demo</h1>
      <div ref={mapElement} style={{ width: '100%', height: '400px', overflow: 'hidden' }}></div>
      <Box mt={2} display="flex" justifyContent="space-between">
        <Box>
          <Button variant="contained" onClick={startMeasure}>Měřit vzdálenost</Button>
          {distance && (
            <Typography variant="body1" mt={1}>
              Vzdálenost: {distance} m ({(distance / 1000).toFixed(3)} km)
            </Typography>
          )}
          {azimuth && (
            <Typography variant="body1">
              Azimut: {azimuth}°
            </Typography>
          )}
        </Box>
        <Paper elevation={3} style={{ padding: '10px', maxWidth: '300px' }}>
          <Typography variant="h6">Nápověda k měření</Typography>
          <Typography variant="body2">
            1. Klikněte na "Měřit vzdálenost"<br/>
            2. Klikněte na mapu pro začátek měření<br/>
            3. Klikejte pro přidání bodů<br/>
            4. Pro ukončení měření klikněte znovu na poslední bod
          </Typography>
        </Paper>
      </Box>
    </div>
  );
}

export default App;
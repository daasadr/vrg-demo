import { useState, useEffect, useRef } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Draw, Modify } from 'ol/interaction';
import { getLength } from 'ol/sphere';
import LineString from 'ol/geom/LineString';
import { Feature } from 'ol';
import { Style, Stroke } from 'ol/style';
import { Geometry } from 'ol/geom';

const useMapLogic = () => {
  const [map, setMap] = useState<Map | null>(null);
  const [measureTool, setMeasureTool] = useState<Draw | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [angle, setAngle] = useState<number | null>(null);
  const [azimuth, setAzimuth] = useState<number | null>(null);
  const [distanceUnit, setDistanceUnit] = useState<string>('meters');
  const [angleUnit, setAngleUnit] = useState<string>('degrees');
  const [isPolyline, setIsPolyline] = useState<boolean>(false);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const measureSourceRef = useRef<VectorSource<Feature<Geometry>> | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const measureSource = new VectorSource<Feature<Geometry>>();
    measureSourceRef.current = measureSource;

    const measureLayer = new VectorLayer({
      source: measureSource,
      style: new Style({
        stroke: new Stroke({
          color: 'rgba(255, 0, 0, 0.8)',
          width: 2
        })
      })
    });

    const initialMap = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        measureLayer
      ],
      view: new View({
        center: fromLonLat([14.4378, 50.0755]), // Praha
        zoom: 7
      })
    });

    setMap(initialMap);

    return () => initialMap.setTarget(undefined);
  }, []);

  const startMeasure = (polyline: boolean = false) => {
    if (!map || !measureSourceRef.current) return;

    if (measureTool) {
      map.removeInteraction(measureTool);
    }

    measureSourceRef.current.clear();
    setAngle(null);
    setDistance(null);
    setAzimuth(null);
    setIsPolyline(polyline);

    const draw = new Draw({
      source: measureSourceRef.current,
      type: 'LineString',
      maxPoints: polyline ? Infinity : 2,
      style: new Style({
        stroke: new Stroke({
          color: 'rgba(255, 0, 0, 0.8)',
          width: 2
        })
      })
    });
        const updateMeasurement = (feature: Feature<LineString>) => {
      const geometry = feature.getGeometry();
      if (geometry) {
        const length = getLength(geometry);
        setDistance(Math.round(length * 100) / 100);
        
        const coordinates = geometry.getCoordinates();
        if (coordinates.length >= 2 && !polyline) {
          const start = coordinates[0];
          const end = coordinates[coordinates.length - 1];
          const dx = end[0] - start[0];
          const dy = end[1] - start[1];
          let angle = Math.atan2(dy, dx) * 180 / Math.PI;
          if (angle < 0) {
            angle += 360;
          }
          setAzimuth(Math.round(angle * 100) / 100);
        } else {
          setAzimuth(null);
        }
      }
    };

draw.on('drawend', (event) => {
      const feature = event.feature as Feature<LineString>;
      updateMeasurement(feature);
    });

    map.addInteraction(draw);
    setMeasureTool(draw);

    if (polyline) {
      const modify = new Modify({ source: measureSourceRef.current });
      modify.on('modifyend', (event) => {
        const features = event.features.getArray();
        if (features.length > 0) {
          const feature = features[0] as Feature<LineString>;
          updateMeasurement(feature);
        }
      });
      map.addInteraction(modify);
    }
  };

  const measureAngle = () => {
    if (!map || !measureSourceRef.current) return;

    if (measureTool) {
      map.removeInteraction(measureTool);
    }

    measureSourceRef.current.clear();
    setDistance(null);
    setAzimuth(null);
    setAngle(null);
    setIsPolyline(false);

    const draw = new Draw({
      source: measureSourceRef.current,
      type: 'LineString',
      maxPoints: 3,
      style: new Style({
        stroke: new Stroke({
          color: 'rgba(0, 0, 255, 0.8)',
          width: 2
        })
      })
    });

    draw.on('drawend', (event) => {
      const feature = event.feature as Feature<LineString>;
      const geometry = feature.getGeometry();
      if (geometry) {
        const coordinates = geometry.getCoordinates();
        if (coordinates.length === 3) {
          const [p1, p2, p3] = coordinates;
          const angle = getAngle(p1, p2, p3);
          setAngle(angle);
        }
      }
    });

    map.addInteraction(draw);
    setMeasureTool(draw);
  };

  const getAngle = (p1: number[], p2: number[], p3: number[]): number => {
    const [x1, y1] = p1;
    const [x2, y2] = p2;
    const [x3, y3] = p3;

    const angle1 = Math.atan2(y1 - y2, x1 - x2);
    const angle2 = Math.atan2(y3 - y2, x3 - x2);
    let angle = (angle2 - angle1) * 180 / Math.PI;

    if (angle < 0) {
      angle += 360;
    }

    return Math.round(angle * 100) / 100;
  };

  const handleDistanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setDistance(distanceUnit === 'meters' ? value : value * 1000);
    }
  };

  const handleAngleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setAngle(angleUnit === 'degrees' ? value : value * 180 / Math.PI);
    }
  };

  return {
    mapRef,
    map,
    startMeasure,
    measureAngle,
    distance,
    angle,
    azimuth,
    distanceUnit,
    angleUnit,
    isPolyline,
    setDistanceUnit,
    setAngleUnit,
    handleDistanceChange,
    handleAngleChange,
  };
};

export default useMapLogic;
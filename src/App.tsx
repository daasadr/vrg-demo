import React from 'react';
import { Box } from '@mui/material';
import MapComponent from './components/MapComponent';
import ToolbarComponent from './components/ToolbarComponent';
import MeasurementInputs from './components/MeasurementInputs';
import HelpComponent from './components/HelpComponent';
import useMapLogic from './hooks/useMapLogic';

const App: React.FC = () => {
  const {
    mapRef,
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
  } = useMapLogic();

  return (
    <Box sx={{ padding: 2 }}>
      <h1>VRG Demo</h1>
      <MapComponent mapRef={mapRef} />
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <ToolbarComponent
            startMeasure={() => startMeasure(false)}
            startPolyline={() => startMeasure(true)}
            measureAngle={measureAngle}
          />
          <MeasurementInputs
            distance={distance}
            angle={angle}
            azimuth={azimuth}
            distanceUnit={distanceUnit}
            angleUnit={angleUnit}
            isPolyline={isPolyline}
            setDistanceUnit={setDistanceUnit}
            setAngleUnit={setAngleUnit}
            handleDistanceChange={handleDistanceChange}
            handleAngleChange={handleAngleChange}
          />
        </Box>
        <HelpComponent />
      </Box>
    </Box>
  );
};

export default App;
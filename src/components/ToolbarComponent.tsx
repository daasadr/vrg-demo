import React from 'react';
import { Button, Box } from '@mui/material';

interface ToolbarComponentProps {
  startMeasure: () => void;
   measureAngle: () => void;
  startPolyline: () => void;
}

const ToolbarComponent: React.FC<ToolbarComponentProps> = ({ startMeasure, measureAngle, startPolyline }) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Button variant="contained" onClick={startMeasure} sx={{ mr: 1 }}>Měřit vzdálenost</Button>
      <Button variant="contained" onClick={measureAngle} sx={{ mr: 1 }}>Měřit úhel</Button>
      <Button variant="contained" onClick={startPolyline}>Kreslit polyčáru</Button>
    </Box>
  );
};

export default ToolbarComponent;
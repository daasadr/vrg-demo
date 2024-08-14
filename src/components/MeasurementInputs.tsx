import React from 'react';
import { Box, TextField, Select, MenuItem, Typography, SelectChangeEvent } from '@mui/material';

interface MeasurementInputsProps {
  distance: number | null;
  angle: number | null;
  azimuth: number | null;
  distanceUnit: string;
  angleUnit: string;
  isPolyline: boolean;
  setDistanceUnit: (unit: string) => void;
  setAngleUnit: (unit: string) => void;
  handleDistanceChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleAngleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const MeasurementInputs: React.FC<MeasurementInputsProps> = ({
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
}) => {
  return (
    <Box>
      {distance !== null && (
        <Box sx={{ mb: 2 }}>
          <TextField
            label={isPolyline ? "Celková délka" : "Vzdálenost"}
            type="number"
            value={distanceUnit === 'meters' ? distance : distance / 1000}
            onChange={handleDistanceChange}
            sx={{ mr: 1 }}
          />
          <Select
            value={distanceUnit}
            onChange={(e: SelectChangeEvent) => setDistanceUnit(e.target.value)}
          >
            <MenuItem value="meters">metry</MenuItem>
            <MenuItem value="kilometers">kilometry</MenuItem>
          </Select>
        </Box>
      )}
      {angle !== null && (
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Úhel"
            type="number"
            value={angleUnit === 'degrees' ? angle : angle * Math.PI / 180}
            onChange={handleAngleChange}
            sx={{ mr: 1 }}
          />
          <Select
            value={angleUnit}
            onChange={(e: SelectChangeEvent) => setAngleUnit(e.target.value)}
          >
            <MenuItem value="degrees">stupně</MenuItem>
            <MenuItem value="radians">radiány</MenuItem>
          </Select>
        </Box>
      )}
      {angle !== null && (
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Úhel"
            type="number"
            value={angleUnit === 'degrees' ? angle : angle * Math.PI / 180}
            onChange={handleAngleChange}
            sx={{ mr: 1 }}
          />
          <Select
            value={angleUnit}
            onChange={(e: SelectChangeEvent) => setAngleUnit(e.target.value)}
          >
            <MenuItem value="degrees">stupně</MenuItem>
            <MenuItem value="radians">radiány</MenuItem>
          </Select>
        </Box>
      )}
      {azimuth !== null && !isPolyline && (
        <Typography variant="body1">
          Azimut: {azimuth}°
        </Typography>
      )}
    </Box>
  );
};

export default MeasurementInputs;
import React from 'react';
import { Paper, Typography, Grid } from '@mui/material';

const HelpComponent: React.FC = () => {
  const helpItems = [
    '1. Vyberte nástroj (měření vzdálenosti, úhlu nebo kreslení polyčáry)',
    '2. Klikejte na mapu pro přidání bodů',
    '3. Pro ukončení měření vzdálenosti klikněte znovu na poslední bod',
    '4. Pro měření úhlu zadejte přesně 3 body',
    '5. Pro ukončení kreslení polyčáry použijte dvojklik',
    '6. Můžete upravovat hodnoty pomocí vstupních polí a měnit jednotky'
  ];

  return (
    <Paper elevation={3} sx={{ padding: 2, maxWidth: 600 }}>
      <Typography variant="h6" gutterBottom>Nápověda k použití</Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          {helpItems.slice(0, 3).map((item, index) => (
            <Typography key={index} variant="body2" paragraph>
              {item}
            </Typography>
          ))}
        </Grid>
        <Grid item xs={6}>
          {helpItems.slice(3).map((item, index) => (
            <Typography key={index + 3} variant="body2" paragraph>
              {item}
            </Typography>
          ))}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default HelpComponent;
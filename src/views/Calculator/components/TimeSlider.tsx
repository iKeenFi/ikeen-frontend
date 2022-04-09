import { Card, Grid, Slider, Typography } from '@material-ui/core';
import React from 'react';

interface TimeProps {
  handleChange: (event: React.ChangeEvent<{}>, value: number | number[]) => void;
  value: number;
}
export default function Timeslider({ handleChange, value }: TimeProps) {
  return (
    <>
      <Typography variant="h6">{value} days</Typography>

      <Slider onChange={handleChange} valueLabelDisplay="auto" defaultValue={30} color="secondary" aria-label="Time" />
    </>
  );
}

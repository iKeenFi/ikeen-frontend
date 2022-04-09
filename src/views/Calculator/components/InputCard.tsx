import { Card, CardContent, FormControl, Grid, InputLabel, Slider, Typography } from '@material-ui/core';
import { value } from 'numeral';
import React, { ChangeEvent, useState } from 'react';

import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TimeSlider from './TimeSlider';

type TokenType = 'KEEN' | 'iSKEEN' | 'KEEN-AVAX LP' | 'iSKEEN-AVAX LP' | 'KEEN-iSKEEN LP';
type Strategy = 'Sell all Rewards' | 'Compound' | 'No Compounding';

interface InputCardProps {
  handleChange: (event: React.ChangeEvent<{}>, value: number | number[]) => void;
  values: {
    strategy: string;
    depositToken: TokenType;
    rewardToken: TokenType;
  };
}
export default function InputCard({ handleChange, values }: InputCardProps) {
  let [time, setTime] = useState(30);
  function handleTimeChange() {}

  return (
    <>
      <Card>
        <CardContent>
          <h2>Calculator</h2>
          <Typography>Calculate your future rewards</Typography>
          <Typography variant="h6">{value} eee</Typography>

          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Age</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={age}
              label="Age"
              onChange={handleChange}
            >
              <MenuItem value={'NOOB'}>Sell all rewards</MenuItem>
              <MenuItem value={30}>No compounding</MenuItem>
              <MenuItem value={20}>Compounding</MenuItem>
            </Select>
            <TimeSlider handleChange={handleTimeChange} value={time} />
          </FormControl>
        </CardContent>
      </Card>
    </>
  );
}

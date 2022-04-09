import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Card, CardActions, CardContent, Typography, Grid } from '@material-ui/core';

import TokenSymbol from '../../components/TokenSymbol';

import useStatsForPool from '../../hooks/useStatsForPool';
import { useWallet } from 'use-wallet';

let loadMessages = [
  'Milking the goose',
  'Going to space',
  'Picking up lost ducks',
  'Nuking Antarctica',
  'Making dumb NFTs',
  'Cranking out random numbers',
  'Loading, I think',
];
const FarmCard = ({ bank }) => {
  const { account } = useWallet();
  const statsOnPool = useStatsForPool(bank);

  // random hilarious loading message
  const [loadingMessage, setLoadingMessage] = useState('Loading, I think');

  useEffect(() => {
    // set to something random
    let randomMsg = loadMessages[Math.floor(Math.random() * loadMessages.length)];
    let dots = '..';
    setLoadingMessage(randomMsg);

    // dot dot dot
    let timer = setInterval(() => {
      if (dots == '...') {
        dots = '.';
      }
      setLoadingMessage(randomMsg + dots);
      dots = dots + '.';
    }, 500);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Grid item xs={12} md={4} lg={4}>
      <Card variant="outlined">
        <CardContent>
          <Box style={{ position: 'relative' }}>
            <Box
              style={{
                position: 'absolute',
                right: '0px',
                top: '-5px',
                height: '72px',
                width: '72px',
                borderRadius: '72px',
                backgroundColor: '#363746',
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <TokenSymbol size={48} symbol={bank.depositTokenName} />
            </Box>
            <Typography variant="h5" component="h2">
              {bank.depositTokenName}
            </Typography>
            <Typography color="textSecondary">
              {/* {bank.name} */}
              Deposit <b>{bank.depositTokenName}</b> and Earn <b>{bank.earnTokenName}</b>
            </Typography>

            {statsOnPool == undefined && <Typography color="secondary">{loadingMessage}</Typography>}
            {statsOnPool && (
              <>
                <Typography color="secondary">Daily: {statsOnPool && <b>{statsOnPool?.dailyAPR}%</b>}</Typography>
                <Typography color="secondary">APR: {statsOnPool && <b>{statsOnPool?.yearlyAPR}%</b>}</Typography>
              </>
            )}
          </Box>
        </CardContent>
        <CardActions style={{ justifyContent: 'flex-end' }}>
          <Button className="shinyButtonSecondary" component={Link} to={`/farm/${bank.contract}`}>
            View
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default FarmCard;

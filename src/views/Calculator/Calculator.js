import React, { useMemo } from 'react';
import Page from '../../components/Page';
import { createGlobalStyle } from 'styled-components';
import CountUp from 'react-countup';
import CardIcon from '../../components/CardIcon';
import TokenSymbol from '../../components/TokenSymbol';
import useKeenStats from '../../hooks/useKeenStats';
import useLpStats from '../../hooks/useLpStats';
import useLpStatsAVAX from '../../hooks/useLpStatsAVAX';
import useModal from '../../hooks/useModal';
//import useZap from '../../hooks/useZap';
import useBondStats from '../../hooks/useBondStats';
import useiSkeenStats from '../../hooks/useiSkeenStats';
import useTotalValueLocked from '../../hooks/useTotalValueLocked';
import { Keen as keenTesting } from '../../keen-finance/deployments/deployments.testing.ts';
import { Keen as keenProd } from '../../keen-finance/deployments/deployments.mainnet.ts';
import { roundAndFormatNumber } from '../../0x';
import MetamaskFox from '../../assets/img/metamask-fox.svg';
import { Box, Button, Card, CardContent, Grid, Paper, Typography } from '@material-ui/core';
//import ZapModal from '../Bank/components/ZapModal.tsx.DISABLED';
import { Alert } from '@material-ui/lab';

import { makeStyles } from '@material-ui/core/styles';
import useKeenFinance from '../../hooks/useKeenFinance';
import { ReactComponent as IconTelegram } from '../../assets/img/telegram.svg';
import { Helmet } from 'react-helmet';
import KeenImage from '../../assets/img/keen.png';

import HomeImage from '../../assets/img/background.jpg';
import TimeSlider from './components/TimeSlider';
import InputCard from './components/InputCard';
const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) repeat !important;
    background-size: cover !important;
    background-color: #171923;
  }
`;
const TITLE = 'iKeen | AVAX pegged algocoin';

// const BackgroundImage = createGlobalStyle`
//   body {
//     background-color: grey;
//     background-size: cover !important;
//   }
// `;

const useStyles = makeStyles((theme) => ({
  button: {
    [theme.breakpoints.down('415')]: {
      // marginTop: '10px'
    },
  },
}));

const Home = () => {
  const classes = useStyles();
  const TVL = useTotalValueLocked();
  const keenFtmLpStats = useLpStats('KEEN-AVAX-LP');
  const iSkeenFtmLpStats = useLpStats('iSKEEN-AVAX-LP');
  const iSkeenKeenLpStats = useLpStats('iSKEEN-KEEN-LP');

  const keenStats = useKeenStats();
  const iSkeenStats = useiSkeenStats();
  const keenFinance = useKeenFinance();

  let keen;
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    keen = keenTesting;
  } else {
    keen = keenProd;
  }

  const buyKeenAddress =
    //  'https://traderjoe.finance/swap?inputCurrency=0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c&outputCurrency=' +
    'https://traderjoexyz.com/trade?inputCurrency=0x130966628846bfd36ff31a822705796e8cb8c18d&outputCurrency=0x7254000925E19d9bEF3B156E9b0ADC24C9761E0E#/';
  //https://traderjoe.finance/swap?outputCurrency=0x531780FAcE85306877D7e1F05d713D1B50a37F7A';
  const buyiSkeenAddress =
    'https://traderjoexyz.com/trade?inputCurrency=0x130966628846bfd36ff31a822705796e8cb8c18d&outputCurrency=0xAC53b3dFB93CCcEaE015E7B5C1Cef4681a2D3d9e#/';
  const keenLPStats = useMemo(() => (keenFtmLpStats ? keenFtmLpStats : null), [keenFtmLpStats]);
  const iskeenLPStats = useMemo(() => (iSkeenFtmLpStats ? iSkeenFtmLpStats : null), [iSkeenFtmLpStats]);
  const iskeenKeenLPStats = useMemo(() => (iSkeenKeenLpStats ? iSkeenKeenLpStats : null), [iSkeenKeenLpStats]);

  const keenPriceInDollars = useMemo(
    () => (keenStats ? Number(keenStats.priceInDollars).toFixed(2) : null),
    [keenStats],
  );
  const keenPriceInAVAX = useMemo(
    () => (keenStats ? (Number(keenStats.tokenInFtm) * 10).toFixed(4) : null),
    [keenStats],
  );
  const iSkeenPriceInDollars = useMemo(
    () => (iSkeenStats ? Number(iSkeenStats.priceInDollars).toFixed(2) : null),
    [iSkeenStats],
  );
  const iSkeenPriceInAVAX = useMemo(
    () => (iSkeenStats ? Number(iSkeenStats.tokenInFtm).toFixed(4) : null),
    [iSkeenStats],
  );
  return (
    <Page>
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      <BackgroundImage />
      <Grid container spacing={3}>
        {/* Explanation text */}
        <Grid item xs={12} sm={12}>
          <Paper>
            <Box p={4} style={{ textAlign: 'center' }}>
              <h2>Welcome to iKeen</h2>
              <p>
                KEEN is an algocoin which is designed to follow the price of AVAX at a 10:1 ratio (10 KEEN = 1 AVAX).
              </p>
              <p>
                Stake your KEEN-AVAX LP in the Farm to earn iSKEEN rewards. Then stake your earned iSKEEN in the
                Boardroom to earn more KEEN!
              </p>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={8}>
          <InputCard />
        </Grid>
      </Grid>
    </Page>
  );
};

export default Home;

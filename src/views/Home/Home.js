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
import { Keen as keenTesting } from '../../keen-finance/deployments/deployments.testing.json';
import { Keen as keenProd } from '../../keen-finance/deployments/deployments.mainnet.json';
import { roundAndFormatNumber } from '../../0x';
import MetamaskFox from '../../assets/img/metamask-fox.svg';
import { Box, Button, Card, CardContent, Grid, Paper } from '@material-ui/core';
//import ZapModal from '../Bank/components/ZapModal.tsx.DISABLED';
import { Alert } from '@material-ui/lab';

import { makeStyles } from '@material-ui/core/styles';
import useKeenFinance from '../../hooks/useKeenFinance';
import { ReactComponent as IconTelegram } from '../../assets/img/telegram.svg';
import { Helmet } from 'react-helmet';
import KeenImage from '../../assets/img/keen.png';

import HomeImage from '../../assets/img/background.jpg';
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
  const keenStats = useKeenStats();
  const iSkeenStats = useiSkeenStats();
  const tBondStats = useBondStats();
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
  const keenPriceInDollars = useMemo(
    () => (keenStats ? Number(keenStats.priceInDollars).toFixed(2) : null),
    [keenStats],
  );
  const keenPriceInAVAX = useMemo(() => (keenStats ? Number(keenStats.tokenInFtm).toFixed(4) : null), [keenStats]);
  const keenCirculatingSupply = useMemo(() => (keenStats ? String(keenStats.circulatingSupply) : null), [keenStats]);
  const keenTotalSupply = useMemo(() => (keenStats ? String(keenStats.totalSupply) : null), [keenStats]);

  const iSkeenPriceInDollars = useMemo(
    () => (iSkeenStats ? Number(iSkeenStats.priceInDollars).toFixed(2) : null),
    [iSkeenStats],
  );
  const iSkeenPriceInAVAX = useMemo(
    () => (iSkeenStats ? Number(iSkeenStats.tokenInFtm).toFixed(4) : null),
    [iSkeenStats],
  );
  const iSkeenCirculatingSupply = useMemo(
    () => (iSkeenStats ? String(iSkeenStats.circulatingSupply) : null),
    [iSkeenStats],
  );
  const iSkeenTotalSupply = useMemo(() => (iSkeenStats ? String(iSkeenStats.totalSupply) : null), [iSkeenStats]);

  const tBondPriceInDollars = useMemo(
    () => (tBondStats ? Number(tBondStats.priceInDollars).toFixed(2) : null),
    [tBondStats],
  );
  const tBondPriceInAVAX = useMemo(() => (tBondStats ? Number(tBondStats.tokenInFtm).toFixed(4) : null), [tBondStats]);
  const tBondCirculatingSupply = useMemo(
    () => (tBondStats ? String(tBondStats.circulatingSupply) : null),
    [tBondStats],
  );
  const tBondTotalSupply = useMemo(() => (tBondStats ? String(tBondStats.totalSupply) : null), [tBondStats]);

  /*const keenLpZap = useZap({ depositTokenName: 'KEEN-AVAX-LP' });
  const iskeenLpZap = useZap({ depositTokenName: 'iSKEEN-AVAX-LP' });

  const [onPresentKeenZap, onDissmissKeenZap] = useModal(
    <ZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        keenLpZap.onZap(zappingToken, tokenName, amount);
        onDissmissKeenZap();
      }}
      tokenName={'KEEN-AVAX-LP'}
    />,
  );

  const [onPresentBshareZap, onDissmissBshareZap] = useModal(
    <ZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        iskeenLpZap.onZap(zappingToken, tokenName, amount);
        onDissmissBshareZap();
      }}
      tokenName={'iSKEEN-AVAX-LP'}
    />,
  );*/

  return (
    <Page>
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      <BackgroundImage />
      <Grid container spacing={3}>
        {/* Logo */}
        <Grid
          item
          xs={12}
          sm={4}
          style={{ display: 'flex', justifyContent: 'center', verticalAlign: 'middle', overflow: 'hidden' }}
        >
          <img src={KeenImage} alt="Keen Finance" style={{ maxHeight: '240px' }} />
        </Grid>
        {/* Explanation text */}
        <Grid item xs={12} sm={8}>
          <Paper>
            <Box p={4} style={{ textAlign: 'center' }}>
              <h2>Welcome to iKeen</h2>
              <p>KEEN is an algocoin which is designed to follow the price of AVAX.</p>
              <p>
                Stake your KEEN-AVAX LP in the Farm to earn iSKEEN rewards. Then stake your earned iSKEEN in the
                Boardroom to earn more KEEN!
              </p>
            </Box>
          </Paper>
        </Grid>

        {/* TVL */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent align="center">
              <h2>Total Value Locked</h2>
              <CountUp style={{ fontSize: '25px' }} end={TVL} separator="," prefix="$" />
            </CardContent>
          </Card>
        </Grid>

        {/* Wallet */}
        <Grid item xs={12} sm={8}>
          <Card style={{ height: '100%' }}>
            <CardContent align="center" style={{ marginTop: '2.5%' }}>
              <Button href={buyKeenAddress} style={{ margin: '5px' }} className={'shinyButton ' + classes.button}>
                Buy KEEN
              </Button>
              <Button href={buyiSkeenAddress} className={'shinyButton ' + classes.button} style={{ margin: '5px' }}>
                Buy iSKEEN
              </Button>
              <Button
                target="_blank"
                href="https://dexscreener.com/avalanche/0x7254000925E19d9bEF3B156E9b0ADC24C9761E0E"
                className="shinyButton"
                style={{ margin: '5px' }}
              >
                KEEN Chart
              </Button>
              <Button
                target="_blank"
                href="https://dexscreener.com/avalanche/0xAC53b3dFB93CCcEaE015E7B5C1Cef4681a2D3d9e"
                className="shinyButton"
                style={{ margin: '5px' }}
              >
                iSKEEN Chart
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* KEEN */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent align="center" style={{ position: 'relative' }}>
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="KEEN" />
                </CardIcon>
              </Box>
              <Button
                onClick={() => {
                  keenFinance.watchAssetInMetamask('KEEN');
                }}
                style={{ position: 'absolute', top: '10px', right: '10px', border: '1px grey solid' }}
              >
                {' '}
                <b>+</b>&nbsp;&nbsp;
                <img alt="metamask fox" style={{ width: '20px', filter: 'grayscale(100%)' }} src={MetamaskFox} />
              </Button>
              <h2 style={{ marginBottom: '10px' }}>KEEN</h2>1 KEEN (1.0 Peg) =
              <Box>
                <span style={{ fontSize: '30px', color: 'white' }}>
                  {keenPriceInAVAX ? keenPriceInAVAX : '-.----'} AVAX
                </span>
              </Box>
              <Box>
                <span style={{ fontSize: '16px', alignContent: 'flex-start' }}>
                  ${keenPriceInDollars ? roundAndFormatNumber(keenPriceInDollars, 2) : '-.--'} / KEEN
                </span>
              </Box>
              <span style={{ fontSize: '12px' }}>
                Market Cap: ${roundAndFormatNumber(keenCirculatingSupply * keenPriceInDollars, 2)} <br />
                Circulating Supply: {roundAndFormatNumber(keenCirculatingSupply, 2)} <br />
                Total Supply: {roundAndFormatNumber(keenTotalSupply, 2)}
              </span>
            </CardContent>
          </Card>
        </Grid>

        {/* iSKEEN */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent align="center" style={{ position: 'relative' }}>
              <Button
                onClick={() => {
                  keenFinance.watchAssetInMetamask('iSKEEN');
                }}
                style={{ position: 'absolute', top: '10px', right: '10px', border: '1px grey solid' }}
              >
                {' '}
                <b>+</b>&nbsp;&nbsp;
                <img alt="metamask fox" style={{ width: '20px', filter: 'grayscale(100%)' }} src={MetamaskFox} />
              </Button>
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="iSKEEN" />
                </CardIcon>
              </Box>
              <h2 style={{ marginBottom: '10px' }}>iSKEEN</h2>
              Current Price
              <Box>
                <span style={{ fontSize: '30px', color: 'white' }}>
                  {iSkeenPriceInAVAX ? iSkeenPriceInAVAX : '-.----'} AVAX
                </span>
              </Box>
              <Box>
                <span style={{ fontSize: '16px' }}>
                  ${iSkeenPriceInDollars ? iSkeenPriceInDollars : '-.--'} / iSKEEN
                </span>
              </Box>
              <span style={{ fontSize: '12px' }}>
                Market Cap: ${roundAndFormatNumber((iSkeenCirculatingSupply * iSkeenPriceInDollars).toFixed(2), 2)}{' '}
                <br />
                Circulating Supply: {roundAndFormatNumber(iSkeenCirculatingSupply, 2)} <br />
                Total Supply: {roundAndFormatNumber(iSkeenTotalSupply, 2)}
              </span>
            </CardContent>
          </Card>
        </Grid>

        {/* iBKEEN */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent align="center" style={{ position: 'relative' }}>
              <Button
                onClick={() => {
                  keenFinance.watchAssetInMetamask('iBKEEN');
                }}
                style={{ position: 'absolute', top: '10px', right: '10px', border: '1px grey solid' }}
              >
                {' '}
                <b>+</b>&nbsp;&nbsp;
                <img alt="metamask fox" style={{ width: '20px', filter: 'grayscale(100%)' }} src={MetamaskFox} />
              </Button>
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="iBKEEN" />
                </CardIcon>
              </Box>
              <h2 style={{ marginBottom: '10px' }}>iBKEEN</h2>
              10,000 iBKEEN
              <Box>
                <span style={{ fontSize: '30px', color: 'white' }}>
                  {tBondPriceInAVAX ? tBondPriceInAVAX : '-.----'} AVAX
                </span>
              </Box>
              <Box>
                <span style={{ fontSize: '16px' }}>${tBondPriceInDollars ? tBondPriceInDollars : '-.--'} / iBKEEN</span>
              </Box>
              <span style={{ fontSize: '12px' }}>
                Market Cap: ${roundAndFormatNumber((tBondCirculatingSupply * tBondPriceInDollars).toFixed(2), 2)} <br />
                Circulating Supply: {roundAndFormatNumber(tBondCirculatingSupply, 2)} <br />
                Total Supply: {roundAndFormatNumber(tBondTotalSupply, 2)}
              </span>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent align="center">
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="KEEN-AVAX-LP" />
                </CardIcon>
              </Box>
              <h2>KEEN-AVAX TraderJoe LP</h2>
              <Box mt={2}>
                {/* <Button disabled onClick={onPresentKeenZap} className="shinyButtonDisabledSecondary">
                  Zap In
                </Button> */}
              </Box>
              <Box mt={2}>
                <span style={{ fontSize: '26px' }}>
                  {keenLPStats?.tokenAmount ? keenLPStats?.tokenAmount : '-.--'} KEEN /{' '}
                  {keenLPStats?.ftmAmount ? keenLPStats?.ftmAmount : '-.--'} AVAX
                </span>
              </Box>
              <Box>${keenLPStats?.priceOfOne ? keenLPStats.priceOfOne : '-.--'}</Box>
              <span style={{ fontSize: '12px' }}>
                Liquidity: ${keenLPStats?.totalLiquidity ? roundAndFormatNumber(keenLPStats.totalLiquidity, 2) : '-.--'}{' '}
                <br />
                Total Supply: {keenLPStats?.totalSupply ? roundAndFormatNumber(keenLPStats.totalSupply, 2) : '-.--'}
              </span>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent align="center">
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="iSKEEN-AVAX-LP" />
                </CardIcon>
              </Box>
              <h2>iSKEEN-AVAX TraderJoe LP</h2>
              <Box mt={2}>
                {/* <Button disabled onClick={onPresentBshareZap} className="shinyButtonDisabledSecondary">
                  Zap In
                </Button> */}
              </Box>
              <Box mt={2}>
                <span style={{ fontSize: '26px' }}>
                  {iskeenLPStats?.tokenAmount ? iskeenLPStats?.tokenAmount : '-.--'} iSKEEN /{' '}
                  {iskeenLPStats?.ftmAmount ? iskeenLPStats?.ftmAmount : '-.--'} AVAX
                </span>
              </Box>
              <Box>${iskeenLPStats?.priceOfOne ? iskeenLPStats.priceOfOne : '-.--'}</Box>
              <span style={{ fontSize: '12px' }}>
                Liquidity: $
                {iskeenLPStats?.totalLiquidity ? roundAndFormatNumber(iskeenLPStats.totalLiquidity, 2) : '-.--'}
                <br />
                Total Supply: {iskeenLPStats?.totalSupply ? roundAndFormatNumber(iskeenLPStats.totalSupply, 2) : '-.--'}
              </span>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Page>
  );
};

export default Home;

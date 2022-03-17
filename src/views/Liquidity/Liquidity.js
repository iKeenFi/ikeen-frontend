import React, { useMemo, useState } from 'react';
import Page from '../../components/Page';
import { createGlobalStyle } from 'styled-components';
import HomeImage from '../../assets/img/background.jpg';
import useLpStats from '../../hooks/useLpStats';
import { Box, Button, Grid, Paper, Typography } from '@material-ui/core';
import useKeenStats from '../../hooks/useKeenStats';
import TokenInput from '../../components/TokenInput';
import useKeenFinance from '../../hooks/useKeenFinance';
import { useWallet } from 'use-wallet';
import useTokenBalance from '../../hooks/useTokenBalance';
import { getDisplayBalance } from '../../utils/formatBalance';
import useApproveTaxOffice from '../../hooks/useApproveTaxOffice';
import { ApprovalState } from '../../hooks/useApprove';
import useProvideKeenFtmLP from '../../hooks/useProvideKeenFtmLP';
import { Alert } from '@material-ui/lab';
import { Helmet } from 'react-helmet';

const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) no-repeat !important;
    background-size: cover !important;
    background-color: #171923;
  }
`;
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
const TITLE = 'keen.money |';

const ProvideLiquidity = () => {
  const [keenAmount, setKeenAmount] = useState(0);
  const [ftmAmount, setFtmAmount] = useState(0);
  const [lpTokensAmount, setLpTokensAmount] = useState(0);
  const { balance } = useWallet();
  const keenStats = useKeenStats();
  const keenFinance = useKeenFinance();
  const [approveTaxOfficeStatus, approveTaxOffice] = useApproveTaxOffice();
  const keenBalance = useTokenBalance(keenFinance.KEEN);
  const avaxBalance = useTokenBalance(keenFinance.AVAX);

  const ftmBalance = (avaxBalance / 1e18).toFixed(4);
  const { onProvideKeenFtmLP } = useProvideKeenFtmLP();
  const keenFtmLpStats = useLpStats('KEEN-AVAX-LP');

  const keenLPStats = useMemo(() => (keenFtmLpStats ? keenFtmLpStats : null), [keenFtmLpStats]);
  const keenPriceInBNB = useMemo(() => (keenStats ? Number(keenStats.tokenInFtm).toFixed(2) : null), [keenStats]);
  const ftmPriceInKEEN = useMemo(() => (keenStats ? Number(1 / keenStats.tokenInFtm).toFixed(2) : null), [keenStats]);
  // const classes = useStyles();

  const handleKeenChange = async (e) => {
    if (e.currentTarget.value === '' || e.currentTarget.value === 0) {
      setKeenAmount(e.currentTarget.value);
    }
    if (!isNumeric(e.currentTarget.value)) return;
    setKeenAmount(e.currentTarget.value);
    const quoteFromSpooky = await keenFinance.quoteFromSpooky(e.currentTarget.value, 'KEEN');
    setFtmAmount(quoteFromSpooky);
    setLpTokensAmount(quoteFromSpooky / keenLPStats.ftmAmount);
  };

  const handleFtmChange = async (e) => {
    if (e.currentTarget.value === '' || e.currentTarget.value === 0) {
      setFtmAmount(e.currentTarget.value);
    }
    if (!isNumeric(e.currentTarget.value)) return;
    setFtmAmount(e.currentTarget.value);
    const quoteFromSpooky = await keenFinance.quoteFromSpooky(e.currentTarget.value, 'AVAX');
    setKeenAmount(quoteFromSpooky);

    setLpTokensAmount(quoteFromSpooky / keenLPStats.tokenAmount);
  };
  const handleKeenSelectMax = async () => {
    const quoteFromSpooky = await keenFinance.quoteFromSpooky(getDisplayBalance(keenBalance), 'KEEN');
    setKeenAmount(getDisplayBalance(keenBalance));
    setFtmAmount(quoteFromSpooky);
    setLpTokensAmount(quoteFromSpooky / keenLPStats.ftmAmount);
  };
  const handleFtmSelectMax = async () => {
    const quoteFromSpooky = await keenFinance.quoteFromSpooky(ftmBalance, 'BNB');
    setFtmAmount(ftmBalance);
    setKeenAmount(quoteFromSpooky);
    setLpTokensAmount(ftmBalance / keenLPStats.ftmAmount);
  };
  return (
    <Page>
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      <BackgroundImage />
      <Typography color="textPrimary" align="center" variant="h3" gutterBottom>
        Provide Liquidity
      </Typography>

      <Grid container justify="center">
        <Box style={{ width: '600px' }}>
          <Alert variant="filled" severity="warning" style={{ marginBottom: '10px' }}>
            <b>
              This and{' '}
              <a href="https://pancakeswap.finance/" rel="noopener noreferrer" target="_blank">
                Pancakeswap
              </a>{' '}
              are the only ways to provide Liquidity on KEEN-AVAX pair without paying tax.
            </b>
          </Alert>
          <Grid item xs={12} sm={12}>
            <Paper>
              <Box mt={4}>
                <Grid item xs={12} sm={12} style={{ borderRadius: 15 }}>
                  <Box p={4}>
                    <Grid container>
                      <Grid item xs={12}>
                        <TokenInput
                          onSelectMax={handleKeenSelectMax}
                          onChange={handleKeenChange}
                          value={keenAmount}
                          max={getDisplayBalance(keenBalance)}
                          symbol={'KEEN'}
                        ></TokenInput>
                      </Grid>
                      <Grid item xs={12}>
                        <TokenInput
                          onSelectMax={handleFtmSelectMax}
                          onChange={handleFtmChange}
                          value={ftmAmount}
                          max={ftmBalance}
                          symbol={'AVAX'}
                        ></TokenInput>
                      </Grid>
                      <Grid item xs={12}>
                        <p>1 KEEN = {keenPriceInBNB} BNB</p>
                        <p>1 BNB = {ftmPriceInKEEN} KEEN</p>
                        <p>LP tokens ≈ {lpTokensAmount.toFixed(2)}</p>
                      </Grid>
                      <Grid xs={12} justifyContent="center" style={{ textAlign: 'center' }}>
                        {approveTaxOfficeStatus === ApprovalState.APPROVED ? (
                          <Button
                            variant="contained"
                            onClick={() => onProvideKeenFtmLP(ftmAmount.toString(), keenAmount.toString())}
                            color="primary"
                            style={{ margin: '0 10px', color: '#fff' }}
                          >
                            Supply
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            onClick={() => approveTaxOffice()}
                            color="secondary"
                            style={{ margin: '0 10px' }}
                          >
                            Approve
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Box>
      </Grid>
    </Page>
  );
};

export default ProvideLiquidity;

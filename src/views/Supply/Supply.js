import React from 'react';
import { useWallet } from 'use-wallet';
import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';

import { Box, Typography, Grid, Card, CardContent } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import Spacer from '../../components/Spacer';
import UnlockWallet from '../../components/UnlockWallet';
import Page from '../../components/Page';
// import keenFinance, { KEEN, AVAX } from '../../keen-finance';
// import useXkeenBalance from '../../hooks/useXkeenBalance';
// import useXkeenAPR from '../../hooks/useXkeenAPR';
import useSuppliedAvaxBalance from '../../hooks/useTotalSuppliedAvaxBalance';
import useSuppliedKeenBalance from '../../hooks/useTotalSuppliedKeenBalance';

import { createGlobalStyle } from 'styled-components';
import { Helmet } from 'react-helmet';
import SupplyKeen from './components/SupplyKeen';

import HomeImage from '../../assets/img/background.jpg';
import SupplyAvax from './components/SupplyAvax';
const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) repeat !important;
    background-size: cover !important;
    background-color: #171923;
  }
`;
const TITLE = 'keen.money | Supply Assets';

const useStyles = makeStyles((theme) => ({
  gridItem: {
    height: '100%',
    [theme.breakpoints.up('md')]: {
      height: '90px',
    },
  },
}));

const Supply = () => {
  const classes = useStyles();
  const { account } = useWallet();
  // const { onRedeem } = useRedeemOnBoardroom();
  const stakedKeenBalance = Number(useSuppliedKeenBalance() / 1000000000000000000).toFixed(2);
  const stakedAvaxBalance = Number(useSuppliedAvaxBalance() / 1000000000000000000).toFixed(5);
  // const xkeenBalance = useXkeenBalance();
  // const xkeenRate = Number(xkeenBalance / 1000000000000000000).toFixed(4);
  // const xkeenAPR = useXkeenAPR();

  //const xkeenTVL = xkeenAPR.TVL;

  // const stakedTotalKeenBalance = useSuppliedTotalKeenBalance();
  // console.log("stakedTotalKeenBalance", Number(stakedTotalKeenBalance / 1000000000000000000).toFixed(2));
  // const keenTotalStaked = Number(stakedTotalKeenBalance / 1000000000000000000).toFixed(0);
  // const xkeenTVL = useMemo(() => (xkeenAPR ? Number(xkeenAPR.TVL).toFixed(0) : null), [xkeenAPR]);
  // const xkeenDailyAPR = useMemo(() => (xkeenAPR ? Number(xkeenAPR.dailyAPR).toFixed(2) : null), [xkeenAPR]);
  // const xkeenYearlyAPR = useMemo(() => (xkeenAPR ? Number(xkeenAPR.yearlyAPR).toFixed(2) : null), [xkeenAPR]);

  // console.log('xkeenAPR', xkeenYearlyAPR);

  // const cashStat = useCashPriceInEstimatedTWAP();

  return (
    <Page>
      <BackgroundImage />
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      {!!account ? (
        <>
          <Typography color="textPrimary" align="center" variant="h3" gutterBottom>
            Supply Assets
          </Typography>
          <Grid container justify="center">
            <Box mt={3} style={{ width: '600px' }}>
              <Alert variant="filled" severity="error">
                <h2>All features are not available yet!</h2>
                <p>
                  <b>Test our single asset staking features while we finish building our new web UI!</b>
                </p>
              </Alert>
            </Box>
          </Grid>

          <Box mt={5}>
            <Grid container justify="center" spacing={3}>
              <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
                <Card className={classes.gridItem}>
                  <CardContent align="center">
                    <Typography style={{ textTransform: 'uppercase', color: '#f9d749' }}>AVAX AVAILABLE</Typography>
                    <Typography>{Number(stakedAvaxBalance)} AVAX</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
                <Card className={classes.gridItem}>
                  <CardContent align="center">
                    <Typography style={{ textTransform: 'uppercase', color: '#f9d749' }}>KEEN AVAILABLE</Typography>
                    <Typography>{Number(stakedKeenBalance)} KEEN</Typography>
                  </CardContent>
                </Card>
              </Grid>
              {/* <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
                <Card className={classes.gridItem}>
                  <CardContent align="center">
                    <Typography style={{ textTransform: 'uppercase', color: '#f9d749' }}>
                      KEEN PEG <small>(TWAP)</small>
                    </Typography>
                    <Typography> AVAX</Typography>
                    <Typography>
                      <small>per 10,000 KEEN</small>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid> */}
              {/* <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
                <Card className={classes.gridItem}>
                  <CardContent align="center">
                    <Typography style={{ textTransform: 'uppercase', color: '#f9d749' }}>APR</Typography>
                    <Typography>{xkeenYearlyAPR}%</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
                <Card className={classes.gridItem}>
                  <CardContent align="center">
                    <Typography style={{ textTransform: 'uppercase', color: '#f9d749' }}>Daily APR</Typography>
                    <Typography>{xkeenDailyAPR}%</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={2} lg={2}>
                <Card className={classes.gridItem}>
                  <CardContent align="center">
                    <Typography style={{ textTransform: 'uppercase', color: '#f9d749' }}>KEEN Staked</Typography>
                    <Typography>{roundAndFormatNumber(keenTotalStaked)}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
                <Card className={classes.gridItem}>
                  <CardContent align="center">
                    <Typography style={{ textTransform: 'uppercase', color: '#f9d749' }}>KEEN Staked USD</Typography>
                    <Typography>${roundAndFormatNumber(xkeenTVL, 2)}</Typography>
                  </CardContent>
                </Card>
              </Grid> */}
            </Grid>

            <Box mt={4}>
              <StyledBoardroom>
                <StyledCardsWrapper>
                  {/* <StyledCardWrapper>
                    <Harvest />
                  </StyledCardWrapper> */}
                  {/* <Spacer /> */}
                  <StyledCardWrapper>
                    <SupplyAvax />
                  </StyledCardWrapper>
                  <Spacer />
                  <StyledCardWrapper>
                    <SupplyKeen />
                  </StyledCardWrapper>
                </StyledCardsWrapper>
              </StyledBoardroom>
            </Box>
            <Box mt={4}>
              <StyledBoardroom>
                <StyledCardsWrapper>
                  {/* <StyledCardWrapper>
                    <Harvest />
                  </StyledCardWrapper> */}
                  {/* <Spacer /> */}
                  <StyledCardWrapper>
                    {/* <Box>
                      <Card>
                        <CardContent>
                          <h2>About xKEEN & Rewards</h2>
                          <p><strong>We are currently depositing 10,000 KEEN per week into the staking pool until our AVAX Single Staking service is launched.</strong></p>
                          <p>xKEEN will be the governance token required to cast votes on protocol decisions.</p>
                          <p>20% of all KEEN minted will be deposited into the xKEEN smart contract, increasing the amount of KEEN that can be redeemed for each xKEEN. Rewards will be deposited at random times to prevent abuse.</p>
                          <p>Functionality will be developed around xKEEN including using it as collateral to borrow other assets.</p>
                          <p>Reward structure subject to change based on community voting.</p>
                        </CardContent>
                      </Card>
                    </Box> */}
                  </StyledCardWrapper>
                </StyledCardsWrapper>
              </StyledBoardroom>
            </Box>
            {/* <Grid container justify="center" spacing={3}>
            <Grid item xs={4}>
              <Card>
                <CardContent align="center">
                  <Typography>Rewards</Typography>

                </CardContent>
                <CardActions style={{justifyContent: 'center'}}>
                  <Button color="primary" variant="outlined">Claim Reward</Button>
                </CardActions>
                <CardContent align="center">
                  <Typography>Claim Countdown</Typography>
                  <Typography>00:00:00</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card>
                <CardContent align="center">
                  <Typography>Stakings</Typography>
                  <Typography>{getDisplayBalance(stakedBalance)}</Typography>
                </CardContent>
                <CardActions style={{justifyContent: 'center'}}>
                  <Button>+</Button>
                  <Button>-</Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid> */}
          </Box>
          {/* 
          <Box mt={5}>
            <Grid container justify="center" spacing={3} mt={10}>
              <Button
                disabled={stakedKeenBalance.eq(0) || (!canWithdraw && !canClaimReward)}
                onClick={onRedeem}
                className={
                  stakedKeenBalance.eq(0) || (!canWithdraw && !canClaimReward)
                    ? 'shinyButtonDisabledSecondary'
                    : 'shinyButtonSecondary'
                }
              >
                Claim &amp; Withdraw
              </Button>
            </Grid>
          </Box> */}
        </>
      ) : (
        <UnlockWallet />
      )}
    </Page>
  );
};

const StyledBoardroom = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledCardsWrapper = styled.div`
  display: flex;
  width: 600px;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`;

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 80%;
  }
`;

export default Supply;

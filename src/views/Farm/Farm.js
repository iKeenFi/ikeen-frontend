import React, { useEffect } from 'react';
import { useWallet } from 'use-wallet';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Bank from '../Bank';

import { Box, Container, Typography, Grid } from '@material-ui/core';

import { Alert } from '@material-ui/lab';

import UnlockWallet from '../../components/UnlockWallet';
import Page from '../../components/Page';
import FarmCard from './FarmCard';

import { createGlobalStyle } from 'styled-components';

import useBanks from '../../hooks/useBanks';
import { Helmet } from 'react-helmet';

import spiralimage from '../../assets/img/theSPIRAL.jpg';
const BackgroundImage = createGlobalStyle`
  body {
   background: url(${spiralimage}) repeat !important;
   background-size: cover !important;
   background-color: #171923;
   }
`;

const TITLE = 'iKeen.Finance | Farms';

const Farm = () => {
  const [banks] = useBanks();
  const { path } = useRouteMatch();
  const { account } = useWallet();
  const activeBanks = banks.filter((bank) => !bank.finished);

  useEffect(() => {
    console.log(activeBanks);
  });
  return (
    <Switch>
      <Page>
        <Route exact path={path}>
          <BackgroundImage />
          <Helmet>
            <title>{TITLE}</title>
          </Helmet>
          {!!account ? (
            <Container maxWidth="lg">
              <Typography color="textYellow" align="center" variant="h3" gutterBottom>
                iSKEEN Reward Farms
              </Typography>

              <Box mt={5}>
                {/* 
                <div hidden={activeBanks.filter((bank) => bank.sectionInUI === 2).length === 0}>
                  <Typography color="textYellow" align="center" variant="h4" gutterBottom>
                    Earn iSKEEN by staking LP
                  </Typography>
                   <Alert variant="filled" severity="info">
                    <h4>
                      Farms started November 25th 2021 and will continue running for 1 full year.</h4>



                  </Alert> 
                  <Grid container spacing={3} style={{ marginTop: '20px' }}>
                    {activeBanks
                      .filter((bank) => bank.sectionInUI === 2)
                      .map((bank) => (
                        <React.Fragment key={bank.name}>
                          <FarmCard bank={bank} />
                        </React.Fragment>
                      ))}
                  </Grid>
                </div>*/}

                {/* <div hidden={activeBanks.filter((bank) => bank.sectionInUI === 1).length === 0}> */}
                {/* <Typography color="textPrimary" variant="h4" gutterBottom style={{ marginTop: '20px' }}>
                    Inactive ApeSwap Farms
                  </Typography> */}
                {/* <Typography color="textYellow" align="center" variant="h4" gutterBottom style={{ marginTop: '40px' }}>
                    Earn iSKEEN by staking KEEN
                  </Typography>
                  <Grid container spacing={3} style={{ marginTop: '20px', display: 'flex', alignItems: 'center' }}>
                    {activeBanks
                      .filter((bank) => bank.sectionInUI === 1)
                      .map((bank) => (
                        <React.Fragment key={bank.name}>
                          <FarmCard bank={bank} />
                        </React.Fragment>
                      ))}
                  </Grid>
                </div>
              */}

                <div hidden={activeBanks.filter((bank) => bank.sectionInUI === 0).length === 0}>
                  <Typography color="textPrimary" variant="h4" gutterBottom style={{ marginTop: '20px' }}>
                    Genesis Pools
                  </Typography>
                  <Grid container spacing={3} style={{ marginTop: '20px' }}>
                    {activeBanks
                      .filter((bank) => bank.sectionInUI === 0)
                      .map((bank) => (
                        <React.Fragment key={bank.name}>
                          <FarmCard bank={bank} />
                        </React.Fragment>
                      ))}
                  </Grid>
                </div>
              </Box>
            </Container>
          ) : (
            <UnlockWallet />
          )}
        </Route>
        <Route path={`${path}/:bankId`}>
          <BackgroundImage />
          <Bank />
        </Route>
      </Page>
    </Switch>
  );
};

export default Farm;

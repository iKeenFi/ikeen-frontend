import React, { useEffect } from 'react';
import { useWallet } from 'use-wallet';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Bank from '../Bank';

import useCountDown from 'react-countdown-hook';

import { Box, Container, Typography, Grid } from '@material-ui/core';

import { Alert } from '@material-ui/lab';

import UnlockWallet from '../../components/UnlockWallet';
import Page from '../../components/Page';
import FarmCard from './FarmCard';

import { createGlobalStyle } from 'styled-components';

import useBanks from '../../hooks/useBanks';
import { Helmet } from 'react-helmet';

import spiralimage from '../../assets/img/theSPIRAL.jpg';
import useWhitelistStatus from '~src/hooks/useWhitelist';
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
  const whitelisted = useWhitelistStatus(account);
  const activeBanks = banks.filter((bank) => !bank.finished);

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
              {/*<Typography color="textYellow" align="center" variant="h3" gutterBottom>
                iSKEEN Reward Farms
          </Typography>*/}

              <Box mt={5}>
                <div hidden={activeBanks.filter((bank) => bank.sectionInUI === 1).length === 0}>
                  <Typography color="textYellow" align="center" variant="h4" gutterBottom style={{ marginTop: '40px' }}>
                    Earn iSKEEN by staking
                  </Typography>

                  <Alert variant="filled" severity="info">
                    <h4>Farms were started on March 24th 2022, 10:00 PM and will continue running for 1 full year.</h4>
                  </Alert>

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
                <Typography color="textYellow" align="center" variant="h4" gutterBottom style={{ marginTop: '40px' }}>
                  Genesis Pools
                </Typography>
                <div hidden={activeBanks.filter((bank) => bank.sectionInUI === 0).length === 0}>
                  <Alert variant="filled" severity="info">
                    Genesis Pools end on March 24th, 10:00 PM (22:00 UTC). Please unstake your tokens after it ends, as
                    they will not receive rewards afterwards.
                  </Alert>
                  {whitelisted == true && (
                    <Grid container spacing={3} style={{ marginTop: '20px' }}>
                      {activeBanks
                        .filter((bank) => bank.sectionInUI === 0)
                        .map((bank) => (
                          <React.Fragment key={bank.name}>
                            <FarmCard bank={bank} />
                          </React.Fragment>
                        ))}
                    </Grid>
                  )}
                  {whitelisted == false && (
                    <Typography color="textSecondary" variant="p">
                      You need to have a whitelist spot to enter the genesis pools.
                    </Typography>
                  )}
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

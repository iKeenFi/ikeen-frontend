import React, { useCallback, useEffect, useMemo } from 'react';
import Page from '../../components/Page';
import { createGlobalStyle } from 'styled-components';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { useWallet } from 'use-wallet';
import UnlockWallet from '../../components/UnlockWallet';
import PageHeader from '../../components/PageHeader';
import ExchangeCard from './components/ExchangeCard';
import styled from 'styled-components';
import Spacer from '../../components/Spacer';
import useBondStats from '../../hooks/useBondStats';
//import useKeenStats from '../../hooks/useKeenStats';
import useKeenFinance from '../../hooks/useKeenFinance';
import useCashPriceInLastTWAP from '../../hooks/useCashPriceInLastTWAP';
import { useTransactionAdder } from '../../state/transactions/hooks';
import ExchangeStat from './components/ExchangeStat';
import useTokenBalance from '../../hooks/useTokenBalance';
import useBondsPurchasable from '../../hooks/useBondsPurchasable';
import { getDisplayBalance } from '../../utils/formatBalance';
import { BOND_REDEEM_PRICE, BOND_REDEEM_PRICE_BN } from '../../keen-finance/constants';
import { Alert } from '@material-ui/lab';

import northimage from '~src/assets/img/north.jpg';
import { Grid, Box } from '@material-ui/core';
import { Helmet } from 'react-helmet';
import useAvaxStats from '~src/hooks/useAvaxStats';

const BackgroundImage = createGlobalStyle`
  body {
    background: url(${northimage}) repeat !important;
    background-size: cover !important;
    background-color: #171923;
  }
`;
const TITLE = 'iKeen.Finance | Bonds';

const Bond: React.FC = () => {
  const { path } = useRouteMatch();
  const { account } = useWallet();
  const keenFinance = useKeenFinance();
  const addTransaction = useTransactionAdder();
  const bondStat = useBondStats();
  //const keenStat = useKeenStats();
  const cashPrice = useCashPriceInLastTWAP();
  const avaxPrice = useAvaxStats();

  const bondsPurchasable = useBondsPurchasable();

  const bondBalance = useTokenBalance(keenFinance?.iBKEEN);
  //const scalingFactor = useMemo(() => (cashPrice ? Number(cashPrice) : null), [cashPrice]);

  const handleBuyBonds = useCallback(
    async (amount: string) => {
      const tx = await keenFinance.buyBonds(amount);
      addTransaction(tx, {
        summary: `Buy ${Number(amount).toFixed(2)} iBKEEN with ${amount} KEEN`,
      });
    },
    [keenFinance, addTransaction],
  );

  const handleRedeemBonds = useCallback(
    async (amount: string) => {
      const tx = await keenFinance.redeemBonds(amount);
      addTransaction(tx, { summary: `Redeem ${amount} iBKEEN` });
    },
    [keenFinance, addTransaction],
  );
  const isBondRedeemable = useMemo(() => cashPrice.gt(BOND_REDEEM_PRICE_BN), [cashPrice]);
  const isBondPurchasable = useMemo(() => Number(bondStat?.tokenInFtm) < 0.101, [bondStat]);
  const isBondPayingPremium = useMemo(() => Number(bondStat?.tokenInFtm) >= 0.11, [bondStat]);
  // console.log("bondstat", Number(bondStat?.tokenInFtm))

  const bondScale = (Number(cashPrice) / 1_000_000_000_000_000_000).toFixed(4);

  return (
    <Switch>
      <Page>
        <BackgroundImage />
        <Helmet>
          <title>{TITLE}</title>
        </Helmet>
        {!!account ? (
          <>
            <Route exact path={path}>
              <PageHeader icon={''} title="Buy &amp; Redeem Bonds" subtitle="Earn premiums upon redemption" />
            </Route>
            {isBondPayingPremium === false ? (
              <Box mt={5}>
                <Grid item xs={12} sm={12} justify="center" style={{ margin: '18px', display: 'flex' }}>
                  <Alert variant="filled" severity="error">
                    <b>
                      Claiming below 0.11 peg (10 KEEN &gt; 1.1 AVAX) will not receive a redemption bonus, claim wisely!
                    </b>
                  </Alert>
                </Grid>
              </Box>
            ) : (
              <></>
            )}

            <StyledBond>
              <StyledCardWrapper>
                <ExchangeCard
                  action="Purchase"
                  fromToken={keenFinance.KEEN}
                  fromTokenName="KEEN"
                  toToken={keenFinance.iBKEEN}
                  toTokenName="iBKEEN"
                  priceDesc={
                    !isBondPurchasable
                      ? 'KEEN is over peg'
                      : getDisplayBalance(bondsPurchasable, 18, 4) + ' iBKEEN available for purchase'
                  }
                  onExchange={handleBuyBonds}
                  disabled={!bondStat || isBondRedeemable}
                />
              </StyledCardWrapper>
              <StyledStatsWrapper>
                <ExchangeStat
                  tokenName="1 KEEN"
                  description="Last-Hour TWAP Price"
                  //price={Number(keenStat?.tokenInFtm).toFixed(4) || '-'}
                  price={bondScale || '-'}
                />
                <Spacer size="md" />
                <ExchangeStat
                  tokenName="1 iBKEEN"
                  description="Current Price: (KEEN)^2"
                  price={Number(bondStat?.tokenInFtm).toFixed(4) || '-'}
                />
              </StyledStatsWrapper>
              <StyledCardWrapper>
                <ExchangeCard
                  action="Redeem"
                  fromToken={keenFinance.iBKEEN}
                  fromTokenName="iBKEEN"
                  toToken={keenFinance.KEEN}
                  toTokenName="KEEN"
                  priceDesc={`${getDisplayBalance(bondBalance)} iBKEEN Available in wallet`}
                  onExchange={handleRedeemBonds}
                  disabled={!bondStat || bondBalance.eq(0) || !isBondRedeemable}
                  disabledDescription={!isBondRedeemable ? `Cannot redeem under 0.1 AVAX TWAP` : null}
                />
              </StyledCardWrapper>
            </StyledBond>
          </>
        ) : (
          <UnlockWallet />
        )}
      </Page>
    </Switch>
  );
};

const StyledBond = styled.div`
  display: flex;
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

const StyledStatsWrapper = styled.div`
  display: flex;
  flex: 0.8;
  margin: 0 20px;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 80%;
    margin: 16px 0;
  }
`;

export default Bond;

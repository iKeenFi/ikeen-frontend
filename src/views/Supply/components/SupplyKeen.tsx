import React, { useMemo } from 'react';
import styled from 'styled-components';

import { Box, Button, Card, CardContent, Typography } from '@material-ui/core';

// import Button from '../../../components/Button';
// import Card from '../../../components/Card';
// import CardContent from '../../../components/CardContent';
import CardIcon from '../../../components/CardIcon';
import { AddIcon, RemoveIcon } from '../../../components/icons';
import IconButton from '../../../components/IconButton';
import Label from '../../../components/Label';
import Value from '../../../components/Value';
//import useXkeenBalance from '../../../hooks/useXkeenBalance';
import useKeenStats from '../../../hooks/useKeenStats';
import useApprove, { ApprovalState } from '../../../hooks/useApprove';
//import useApproveW, {ApprovalState as ApprovalStateW} from '../../../hooks/useApprove';
import useModal from '../../../hooks/useModal';
import useTokenBalance from '../../../hooks/useTokenBalance';
import MetamaskFox from '../../../assets/img/metamask-fox.svg';
import { getDisplayBalance } from '../../../utils/formatBalance';

import DepositModal from './DepositModal';
import WithdrawModal from './WithdrawModal';
import useKeenFinance from '../../../hooks/useKeenFinance';
//import useStakedTokenPriceInDollars from '../../../hooks/useStakedTokenPriceInDollars';   //May not be needed anymore.
import TokenSymbol from '../../../components/TokenSymbol';
import useSupplyToKeen from '../../../hooks/useSupplyToKeen';
import useRedeemFromKeen from '../../../hooks/useRedeemFromKeen';

const SupplyKeen: React.FC = () => {
  const keenFinance = useKeenFinance();
  const keenStats = useKeenStats();

  const [approveStatus, approve] = useApprove(keenFinance.KEEN, keenFinance.contracts.KeenRouter.address);
  const [approveStatusW, approveW] = useApprove(keenFinance.BKEENKEEN, keenFinance.contracts.KeenRouter.address);

  const tokenBalance = useTokenBalance(keenFinance.KEEN);
  //const stakedBalance = useStakedKeen();
  const stakedBalance = useTokenBalance(keenFinance.BKEEN_KEEN);

  // const xkeenBalance = useXkeenBalance();
  // const xkeenRate = Number(xkeenBalance) / 1000000000000000000;
  // const xkeenToKeenEquivalent = Number(getDisplayBalance(stakedBalance)) * xkeenRate;

  const keenPriceInDollars = useMemo(
    () => (keenStats ? Number(keenStats.priceInDollars).toFixed(2) : null),
    [keenStats],
  );

  const stakedTokenPriceInDollars = Number(keenPriceInDollars);

  const tokenPriceInDollars = useMemo(() => {
    return stakedTokenPriceInDollars
      ? (Number(stakedTokenPriceInDollars) * Number(getDisplayBalance(stakedBalance))).toFixed(2).toString()
      : null;
  }, [stakedTokenPriceInDollars, stakedBalance]);
  // const isOldBoardroomMember = boardroomVersion !== 'latest';

  const { onStake } = useSupplyToKeen();
  const { onWithdraw } = useRedeemFromKeen();

  const [onPresentDeposit, onDismissDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      onConfirm={(value) => {
        onStake(value);
        onDismissDeposit();
      }}
      tokenName={'KEEN'}
    />,
  );

  const [onPresentWithdraw, onDismissWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      onConfirm={(value) => {
        onWithdraw(value);
        onDismissWithdraw();
      }}
      tokenName={'KEEN'}
    />,
  );

  return (
    <Box>
      <Card>
        <CardContent>
          <StyledCardContentInner>
            <StyledCardHeader>
              <Typography variant="h5" component="h2">
                Supply KEEN
              </Typography>
              <CardIcon>
                <TokenSymbol symbol="KEEN" />
              </CardIcon>

              <Button
                className={'shinyButton'}
                onClick={() => {
                  keenFinance.watchAssetInMetamask('KEEN');
                }}
                style={{
                  position: 'static',
                  top: '10px',
                  right: '10px',
                  border: '1px grey solid',
                  paddingBottom: '5px',
                  marginBottom: '20px',
                }}
              >
                {' '}
                <b>+</b>&nbsp;&nbsp;
                <img alt="metamask fox" style={{ width: '20px', filter: 'grayscale(100%)' }} src={MetamaskFox} />
              </Button>
              <Value value={getDisplayBalance(stakedBalance)} />
              <Label text={'bKEEN (KEEN)'} variant="yellow" />
              <Label text={`≈ $${tokenPriceInDollars}`} variant="yellow" />
            </StyledCardHeader>
            <StyledCardActions>
              {approveStatus !== ApprovalState.APPROVED ? (
                <Button
                  disabled={approveStatus !== ApprovalState.NOT_APPROVED}
                  className={approveStatus === ApprovalState.NOT_APPROVED ? 'shinyButton' : 'shinyButtonDisabled'}
                  style={{ marginTop: '20px' }}
                  onClick={approve}
                >
                  Approve KEEN
                </Button>
              ) : (
                <>
                  {approveStatusW !== ApprovalState.APPROVED ? (
                    <IconButton onClick={approveW}>A</IconButton>
                  ) : (
                    <IconButton onClick={onPresentWithdraw}>
                      <RemoveIcon color={'yellow'} />
                    </IconButton>
                  )}

                  <StyledActionSpacer />
                  <IconButton onClick={onPresentDeposit}>
                    <AddIcon color={'yellow'} />
                  </IconButton>
                </>
              )}
            </StyledCardActions>
          </StyledCardContentInner>
        </CardContent>
      </Card>
      {/* <Box mt={2} style={{color: '#FFF'}}>
        {canWithdrawFromBoardroom ? (
          ''
        ) : (
          <Card>
            <CardContent>
              <Typography style={{textAlign: 'center'}}>Withdraw possible in</Typography>
              <ProgressCountdown hideBar={true} base={from} deadline={to} description="Withdraw available in" />
            </CardContent>
          </Card>
        )}
      </Box> */}
    </Box>
  );
};

const StyledCardHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;
const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 28px;
  width: 100%;
`;

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`;

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

export default SupplyKeen;

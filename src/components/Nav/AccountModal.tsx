import React, { useMemo } from 'react';
import styled from 'styled-components';
import useTokenBalance from '../../hooks/useTokenBalance';
import { getDisplayBalance } from '../../utils/formatBalance';

import Label from '../Label';
import Modal, { ModalProps } from '../Modal';
import ModalTitle from '../ModalTitle';
import useKeenFinance from '../../hooks/useKeenFinance';
import TokenSymbol from '../TokenSymbol';
import { useMediaQuery } from '@material-ui/core';

const AccountModal: React.FC<ModalProps> = ({ onDismiss }) => {
  const keenFinance = useKeenFinance();

  const keenBalance = useTokenBalance(keenFinance.KEEN);
  const displayKeenBalance = useMemo(() => getDisplayBalance(keenBalance, 18, 2), [keenBalance]);

  const iskeenBalance = useTokenBalance(keenFinance.iSKEEN);
  const displayBshareBalance = useMemo(() => getDisplayBalance(iskeenBalance, 18, 2), [iskeenBalance]);

  const bbondBalance = useTokenBalance(keenFinance.iBKEEN);
  const displayBbondBalance = useMemo(() => getDisplayBalance(bbondBalance, 18, 2), [bbondBalance]);

  const xkeenBalance = useTokenBalance(keenFinance.XKEEN);
  const displayXkeenBalance = useMemo(() => getDisplayBalance(xkeenBalance, 18, 2), [xkeenBalance]);

  const matches = useMediaQuery('(min-width:900px)');

  return (
    <Modal>
      <ModalTitle text="My Wallet" />

      <Balances style={{ display: 'flex', flexDirection: matches ? 'row' : 'column' }}>
        <StyledBalanceWrapper style={{ paddingBottom: '15px' }}>
          <TokenSymbol symbol="KEEN" />
          <StyledBalance>
            <StyledValue>{displayKeenBalance}</StyledValue>
            <Label text="KEEN Available" />
          </StyledBalance>
        </StyledBalanceWrapper>

        <StyledBalanceWrapper style={{ paddingBottom: '15px' }}>
          <TokenSymbol symbol="iSKEEN" />
          <StyledBalance>
            <StyledValue>{displayBshareBalance}</StyledValue>
            <Label text="iSKEEN Available" />
          </StyledBalance>
        </StyledBalanceWrapper>
        <StyledBalanceWrapper style={{ paddingBottom: '15px' }}>
          <TokenSymbol symbol="XKEEN" />
          <StyledBalance>
            <StyledValue>{displayXkeenBalance}</StyledValue>
            <Label text="XKEEN Available" />
          </StyledBalance>
        </StyledBalanceWrapper>
        <StyledBalanceWrapper style={{ paddingBottom: '15px' }}>
          <TokenSymbol symbol="iBKEEN" />
          <StyledBalance>
            <StyledValue>{displayBbondBalance}</StyledValue>
            <Label text="iBKEEN Available" />
          </StyledBalance>
        </StyledBalanceWrapper>
      </Balances>
    </Modal>
  );
};

const StyledValue = styled.div`
  //color: ${(props) => props.theme.color.grey[300]};
  font-size: 30px;
  font-weight: 700;
`;

const StyledBalance = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const Balances = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: ${(props) => props.theme.spacing[4]}px;
`;

const StyledBalanceWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: 0 ${(props) => props.theme.spacing[3]}px;
`;

export default AccountModal;

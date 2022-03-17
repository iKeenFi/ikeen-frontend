import { BigNumber, ethers } from 'ethers';
import { useCallback, useMemo } from 'react';
import { useHasPendingApproval, useTransactionAdder } from '../state/transactions/hooks';
import useAllowance from './useAllowance';
import ERC20 from '../keen-finance/ERC20';
import { TAX_OFFICE_ADDR } from '../utils/constants';
import useKeenFinance from './useKeenFinance';

const APPROVE_AMOUNT = ethers.constants.MaxUint256;
const APPROVE_BASE_AMOUNT = BigNumber.from('1000000000000000000000000');

export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED,
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
function useApproveTaxOffice(): [ApprovalState, () => Promise<void>] {
  const keenFinance = useKeenFinance();
  let token: ERC20 = keenFinance.KEEN;
  // if (zappingToken === BNB_TICKER) token = keenFinance.BNB;
  // else if (zappingToken === KEEN_TICKER) token = keenFinance.KEEN;
  // else if (zappingToken === iSKEEN_TICKER) token = keenFinance.iSKEEN;
  const pendingApproval = useHasPendingApproval(token.address, TAX_OFFICE_ADDR);
  const currentAllowance = useAllowance(token, TAX_OFFICE_ADDR, pendingApproval);

  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    // we might not have enough data to know whether or not we need to approve
    if (token === keenFinance.BNB) return ApprovalState.APPROVED;
    if (!currentAllowance) return ApprovalState.UNKNOWN;

    // amountToApprove will be defined if currentAllowance is
    return currentAllowance.lt(APPROVE_BASE_AMOUNT)
      ? pendingApproval
        ? ApprovalState.PENDING
        : ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED;
  }, [currentAllowance, pendingApproval, token, keenFinance]);

  const addTransaction = useTransactionAdder();

  const approve = useCallback(async (): Promise<void> => {
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily');
      return;
    }

    const response = await token.approve(TAX_OFFICE_ADDR, APPROVE_AMOUNT);
    addTransaction(response, {
      summary: `Approve ${token.symbol}`,
      approval: {
        tokenAddress: token.address,
        spender: TAX_OFFICE_ADDR,
      },
    });
  }, [approvalState, token, addTransaction]);

  return [approvalState, approve];
}

export default useApproveTaxOffice;

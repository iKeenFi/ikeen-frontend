import { useCallback } from 'react';
import useKeenFinance from './useKeenFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useWithdrawFromBoardroom = () => {
  const keenFinance = useKeenFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleWithdraw = useCallback(
    (amount: string) => {
      handleTransactionReceipt(
        keenFinance.withdrawShareFromBoardroom(amount),
        `Withdraw ${amount} iSKEEN from the boardroom`,
      );
    },
    [keenFinance, handleTransactionReceipt],
  );
  return { onWithdraw: handleWithdraw };
};

export default useWithdrawFromBoardroom;

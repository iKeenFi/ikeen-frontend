import { useCallback } from 'react';
import useKeenFinance from './useKeenFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useRedeemFromAvax = () => {
  const keenFinance = useKeenFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleWithdraw = useCallback(
    (amount: string) => {
      handleTransactionReceipt(keenFinance.redeemFromAvax(amount), `Redeem ${amount} AVAX from Supply`);
    },
    [keenFinance, handleTransactionReceipt],
  );
  return { onWithdraw: handleWithdraw };
};

export default useRedeemFromAvax;

import { useCallback } from 'react';
import useKeenFinance from './useKeenFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useRedeemFromKeen = () => {
  const keenFinance = useKeenFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleWithdraw = useCallback(
    (amount: string) => {
      handleTransactionReceipt(keenFinance.redeemFromKeen(amount), `Redeem ${amount} KEEN from Supply`);
    },
    [keenFinance, handleTransactionReceipt],
  );
  return { onWithdraw: handleWithdraw };
};

export default useRedeemFromKeen;

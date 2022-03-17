import { useCallback } from 'react';
import useKeenFinance from './useKeenFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useSupplyToKeen = () => {
  const keenFinance = useKeenFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleStake = useCallback(
    (amount: string) => {
      handleTransactionReceipt(keenFinance.supplyToKeen(amount), `Supply  ${amount} KEEN`);
    },
    [keenFinance, handleTransactionReceipt],
  );
  return { onStake: handleStake };
};

export default useSupplyToKeen;

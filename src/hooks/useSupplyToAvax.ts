import { useCallback } from 'react';
import useKeenFinance from './useKeenFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useSupplyToAvax = () => {
  const keenFinance = useKeenFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleStake = useCallback(
    (amount: string) => {
      handleTransactionReceipt(keenFinance.supplyToAvax(amount), `Supply  ${amount} AVAX`);
    },
    [keenFinance, handleTransactionReceipt],
  );
  return { onStake: handleStake };
};

export default useSupplyToAvax;

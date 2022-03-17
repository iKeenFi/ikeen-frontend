import { useCallback } from 'react';
import useKeenFinance from './useKeenFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useStakeToKeen = () => {
  const keenFinance = useKeenFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleStake = useCallback(
    (amount: string) => {
      handleTransactionReceipt(keenFinance.stakeToKeen(amount), `Stake ${amount} KEEN for xKEEN`);
    },
    [keenFinance, handleTransactionReceipt],
  );
  return { onStake: handleStake };
};

export default useStakeToKeen;

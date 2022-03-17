import { useCallback } from 'react';
import useKeenFinance from './useKeenFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useStakeToBoardroom = () => {
  const keenFinance = useKeenFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleStake = useCallback(
    (amount: string) => {
      handleTransactionReceipt(keenFinance.stakeShareToBoardroom(amount), `Stake ${amount} iSKEEN to the boardroom`);
    },
    [keenFinance, handleTransactionReceipt],
  );
  return { onStake: handleStake };
};

export default useStakeToBoardroom;

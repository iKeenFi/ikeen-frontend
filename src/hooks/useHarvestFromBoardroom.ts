import { useCallback } from 'react';
import useKeenFinance from './useKeenFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useHarvestFromBoardroom = () => {
  const keenFinance = useKeenFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleReward = useCallback(() => {
    handleTransactionReceipt(keenFinance.harvestCashFromBoardroom(), 'Claim KEEN from Boardroom');
  }, [keenFinance, handleTransactionReceipt]);

  return { onReward: handleReward };
};

export default useHarvestFromBoardroom;

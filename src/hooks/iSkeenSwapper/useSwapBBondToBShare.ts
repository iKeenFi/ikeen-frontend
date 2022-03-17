import { useCallback } from 'react';
import useKeenFinance from '../useKeenFinance';
import useHandleTransactionReceipt from '../useHandleTransactionReceipt';
// import { BigNumber } from "ethers";
import { parseUnits } from 'ethers/lib/utils';

const useSwapBBondToiSkeen = () => {
  const keenFinance = useKeenFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleSwapiSkeen = useCallback(
    (bbondAmount: string) => {
      const bbondAmountBn = parseUnits(bbondAmount, 18);
      handleTransactionReceipt(keenFinance.swapBBondToiSkeen(bbondAmountBn), `Swap ${bbondAmount} BBond to iSkeen`);
    },
    [keenFinance, handleTransactionReceipt],
  );
  return { onSwapiSkeen: handleSwapiSkeen };
};

export default useSwapBBondToiSkeen;

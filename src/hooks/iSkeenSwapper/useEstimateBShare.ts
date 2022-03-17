import { useCallback, useEffect, useState } from 'react';
import useKeenFinance from '../useKeenFinance';
import { useWallet } from 'use-wallet';
import { BigNumber } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';

const useEstimateiSkeen = (bbondAmount: string) => {
  const [estimateAmount, setEstimateAmount] = useState<string>('');
  const { account } = useWallet();
  const keenFinance = useKeenFinance();

  const estimateAmountOfiSkeen = useCallback(async () => {
    const bbondAmountBn = parseUnits(bbondAmount);
    const amount = await keenFinance.estimateAmountOfiSkeen(bbondAmountBn.toString());
    setEstimateAmount(amount);
  }, [account]);

  useEffect(() => {
    if (account) {
      estimateAmountOfiSkeen().catch((err) => console.error(`Failed to get estimateAmountOfiSkeen: ${err.stack}`));
    }
  }, [account, estimateAmountOfiSkeen]);

  return estimateAmount;
};

export default useEstimateiSkeen;

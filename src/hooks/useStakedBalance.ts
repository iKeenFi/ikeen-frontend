import { useCallback, useEffect, useState } from 'react';

import { BigNumber } from 'ethers';
import useKeenFinance from './useKeenFinance';
import { ContractName } from '../keen-finance';
import config from '../config';

const useStakedBalance = (poolName: ContractName, poolId: Number) => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const keenFinance = useKeenFinance();
  const isUnlocked = keenFinance?.isUnlocked;

  const fetchBalance = useCallback(async () => {
    const balance = await keenFinance.stakedBalanceOnBank(poolName, poolId, keenFinance.myAccount);
    setBalance(balance);
  }, [poolName, poolId, keenFinance]);

  useEffect(() => {
    if (isUnlocked) {
      fetchBalance().catch((err) => console.error(err.stack));

      const refreshBalance = setInterval(fetchBalance, config.refreshInterval);
      return () => clearInterval(refreshBalance);
    }
  }, [isUnlocked, poolName, setBalance, keenFinance, fetchBalance]);

  return balance;
};

export default useStakedBalance;

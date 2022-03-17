import { useCallback, useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import useKeenFinance from './useKeenFinance';
import { ContractName } from '../keen-finance';
import config from '../config';

const useEarnings = (poolName: ContractName, earnTokenName: String, poolId: Number) => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const keenFinance = useKeenFinance();
  const isUnlocked = keenFinance?.isUnlocked;

  const fetchBalance = useCallback(async () => {
    const balance = await keenFinance.earnedFromBank(poolName, earnTokenName, poolId, keenFinance.myAccount);
    setBalance(balance);
  }, [poolName, earnTokenName, poolId, keenFinance]);

  useEffect(() => {
    if (isUnlocked) {
      fetchBalance().catch((err) => console.error(err.stack));

      const refreshBalance = setInterval(fetchBalance, config.refreshInterval);
      return () => clearInterval(refreshBalance);
    }
  }, [isUnlocked, poolName, keenFinance, fetchBalance]);

  return balance;
};

export default useEarnings;

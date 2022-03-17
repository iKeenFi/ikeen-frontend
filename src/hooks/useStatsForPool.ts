import { useCallback, useState, useEffect } from 'react';
import useKeenFinance from './useKeenFinance';
import { Bank } from '../keen-finance';
import { PoolStats } from '../keen-finance/types';
import config from '../config';

const useStatsForPool = (bank: Bank) => {
  const keenFinance = useKeenFinance();

  const [poolAPRs, setPoolAPRs] = useState<PoolStats>();

  const fetchAPRsForPool = useCallback(async () => {
    setPoolAPRs(await keenFinance.getPoolAPRs(bank));
  }, [keenFinance, bank]);

  useEffect(() => {
    fetchAPRsForPool().catch((err) => console.error(`Failed to fetch APR info: ${err.stack}`));
    const refreshInterval = setInterval(fetchAPRsForPool, config.refreshInterval);
    return () => clearInterval(refreshInterval);
  }, [setPoolAPRs, keenFinance, fetchAPRsForPool]);

  return poolAPRs;
};

export default useStatsForPool;

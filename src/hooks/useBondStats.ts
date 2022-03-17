import { useEffect, useState } from 'react';
import useKeenFinance from './useKeenFinance';
import { TokenStat } from '../keen-finance/types';
import useRefresh from './useRefresh';

const useBondStats = () => {
  const [stat, setStat] = useState<TokenStat>();
  const { slowRefresh } = useRefresh();
  const keenFinance = useKeenFinance();

  useEffect(() => {
    async function fetchBondPrice() {
      try {
        setStat(await keenFinance.getBondStat());
      } catch (err) {
        console.error(err);
      }
    }
    fetchBondPrice();
  }, [setStat, keenFinance, slowRefresh]);

  return stat;
};

export default useBondStats;

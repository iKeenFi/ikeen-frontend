import { useEffect, useState } from 'react';
import useKeenFinance from './useKeenFinance';
import { TokenStat } from '../keen-finance/types';
import useRefresh from './useRefresh';

const useKeenStats = () => {
  const [stat, setStat] = useState<TokenStat>();
  const { fastRefresh } = useRefresh();
  const keenFinance = useKeenFinance();

  useEffect(() => {
    async function fetchKeenPrice() {
      try {
        setStat(await keenFinance.getKeenStat());
      } catch (err) {
        console.error(err);
      }
    }
    fetchKeenPrice();
  }, [setStat, keenFinance, fastRefresh]);

  return stat;
};

export default useKeenStats;

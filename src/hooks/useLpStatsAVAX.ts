import { useEffect, useState } from 'react';
import useKeenFinance from './useKeenFinance';
import { LPStat } from '../keen-finance/types';
import useRefresh from './useRefresh';

const useLpStatsAVAX = (lpTicker: string) => {
  const [stat, setStat] = useState<LPStat>();
  const { slowRefresh } = useRefresh();
  const keenFinance = useKeenFinance();

  useEffect(() => {
    async function fetchLpPrice() {
      try {
        setStat(await keenFinance.getLPStatAVAX(lpTicker));
      } catch (err) {
        console.error(err);
      }
    }
    fetchLpPrice();
  }, [setStat, keenFinance, slowRefresh, lpTicker]);

  return stat;
};

export default useLpStatsAVAX;

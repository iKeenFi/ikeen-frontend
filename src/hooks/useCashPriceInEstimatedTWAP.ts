import { useEffect, useState } from 'react';
import useKeenFinance from './useKeenFinance';
import { TokenStat } from '../keen-finance/types';
import useRefresh from './useRefresh';

const useCashPriceInEstimatedTWAP = () => {
  const [stat, setStat] = useState<TokenStat>();
  const keenFinance = useKeenFinance();
  const { slowRefresh } = useRefresh();

  useEffect(() => {
    async function fetchCashPrice() {
      try {
        setStat(await keenFinance.getKeenStatInEstimatedTWAP());
      } catch (err) {
        console.error(err);
      }
    }
    fetchCashPrice();
  }, [setStat, keenFinance, slowRefresh]);

  return stat;
};

export default useCashPriceInEstimatedTWAP;

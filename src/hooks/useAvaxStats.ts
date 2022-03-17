import { useEffect, useState } from 'react';
import useKeenFinance from './useKeenFinance';
//import {TokenStat} from '../keen-finance/types';
import useRefresh from './useRefresh';

const useAvaxStats = () => {
  const [stat, setStat] = useState<Number>();
  const { slowRefresh } = useRefresh();
  const keenFinance = useKeenFinance();

  useEffect(() => {
    async function fetchSharePrice() {
      try {
        setStat(await keenFinance.getAVAXPriceUSD());
      } catch (err) {
        console.error(err);
      }
    }
    fetchSharePrice();
  }, [setStat, keenFinance, slowRefresh]);

  return stat;
};

export default useAvaxStats;

import { useEffect, useState } from 'react';
import useKeenFinance from './useKeenFinance';
import useRefresh from './useRefresh';

const useTotalValueLocked = () => {
  const [totalValueLocked, setTotalValueLocked] = useState<Number>(0);
  const { slowRefresh } = useRefresh();
  const keenFinance = useKeenFinance();

  useEffect(() => {
    async function fetchTVL() {
      try {
        setTotalValueLocked(await keenFinance.getTotalValueLocked());
      } catch (err) {
        console.error(err);
      }
    }
    fetchTVL();
  }, [setTotalValueLocked, keenFinance, slowRefresh]);

  return totalValueLocked;
};

export default useTotalValueLocked;

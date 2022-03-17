import { useEffect, useState } from 'react';
import useKeenFinance from '../useKeenFinance';
import { iSkeenSwapperStat } from '../../keen-finance/types';
import useRefresh from '../useRefresh';

const useiSkeenSwapperStats = (account: string) => {
  const [stat, setStat] = useState<iSkeenSwapperStat>();
  const { fastRefresh /*, slowRefresh*/ } = useRefresh();
  const keenFinance = useKeenFinance();

  useEffect(() => {
    async function fetchiSkeenSwapperStat() {
      try {
        if (keenFinance.myAccount) {
          setStat(await keenFinance.getiSkeenSwapperStat(account));
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchiSkeenSwapperStat();
  }, [setStat, keenFinance, fastRefresh, account]);

  return stat;
};

export default useiSkeenSwapperStats;

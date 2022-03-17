import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import useKeenFinance from './useKeenFinance';
import useRefresh from './useRefresh';

const useTotalStakedOnBoardroom = () => {
  const [totalStaked, setTotalStaked] = useState(BigNumber.from(0));
  const keenFinance = useKeenFinance();
  const { slowRefresh } = useRefresh();
  const isUnlocked = keenFinance?.isUnlocked;

  useEffect(() => {
    async function fetchTotalStaked() {
      try {
        setTotalStaked(await keenFinance.getTotalStakedInBoardroom());
      } catch (err) {
        console.error(err);
      }
    }
    if (isUnlocked) {
      fetchTotalStaked();
    }
  }, [isUnlocked, slowRefresh, keenFinance]);

  return totalStaked;
};

export default useTotalStakedOnBoardroom;

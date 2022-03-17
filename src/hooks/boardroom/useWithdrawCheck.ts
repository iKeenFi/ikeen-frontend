import { useEffect, useState } from 'react';
import useKeenFinance from '../useKeenFinance';
import useRefresh from '../useRefresh';

const useWithdrawCheck = () => {
  const [canWithdraw, setCanWithdraw] = useState(false);
  const keenFinance = useKeenFinance();
  const { slowRefresh } = useRefresh();
  const isUnlocked = keenFinance?.isUnlocked;

  useEffect(() => {
    async function canUserWithdraw() {
      try {
        setCanWithdraw(await keenFinance.canUserUnstakeFromBoardroom());
      } catch (err) {
        console.error(err);
      }
    }
    if (isUnlocked) {
      canUserWithdraw();
    }
  }, [isUnlocked, keenFinance, slowRefresh]);

  return canWithdraw;
};

export default useWithdrawCheck;

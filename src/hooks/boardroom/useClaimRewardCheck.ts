import { useEffect, useState } from 'react';
import useRefresh from '../useRefresh';
import useKeenFinance from '../useKeenFinance';

const useClaimRewardCheck = () => {
  const { slowRefresh } = useRefresh();
  const [canClaimReward, setCanClaimReward] = useState(false);
  const keenFinance = useKeenFinance();
  const isUnlocked = keenFinance?.isUnlocked;

  useEffect(() => {
    async function canUserClaimReward() {
      try {
        setCanClaimReward(await keenFinance.canUserClaimRewardFromBoardroom());
      } catch (err) {
        console.error(err);
      }
    }
    if (isUnlocked) {
      canUserClaimReward();
    }
  }, [isUnlocked, slowRefresh, keenFinance]);

  return canClaimReward;
};

export default useClaimRewardCheck;

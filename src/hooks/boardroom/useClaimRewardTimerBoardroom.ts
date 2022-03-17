import { useEffect, useState } from 'react';
import useKeenFinance from '../useKeenFinance';
import { AllocationTime } from '../../keen-finance/types';

const useClaimRewardTimerBoardroom = () => {
  const [time, setTime] = useState<AllocationTime>({
    from: new Date(),
    to: new Date(),
  });
  const keenFinance = useKeenFinance();

  useEffect(() => {
    if (keenFinance) {
      keenFinance.getUserClaimRewardTime().then(setTime);
    }
  }, [keenFinance]);
  return time;
};

export default useClaimRewardTimerBoardroom;

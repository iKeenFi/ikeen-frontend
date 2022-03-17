import { useEffect, useState } from 'react';
import useKeenFinance from './useKeenFinance';
import { AllocationTime } from '../keen-finance/types';
import useRefresh from './useRefresh';

const useTreasuryAllocationTimes = () => {
  const { slowRefresh } = useRefresh();
  const [time, setTime] = useState<AllocationTime>({
    from: new Date(),
    to: new Date(),
  });
  const keenFinance = useKeenFinance();
  useEffect(() => {
    if (keenFinance) {
      keenFinance.getTreasuryNextAllocationTime().then(setTime);
    }
  }, [keenFinance, slowRefresh]);
  return time;
};

export default useTreasuryAllocationTimes;

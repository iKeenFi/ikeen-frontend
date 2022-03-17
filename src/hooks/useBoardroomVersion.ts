import { useCallback, useEffect, useState } from 'react';
import useKeenFinance from './useKeenFinance';
import useStakedBalanceOnBoardroom from './useStakedBalanceOnBoardroom';

const useBoardroomVersion = () => {
  const [boardroomVersion, setBoardroomVersion] = useState('latest');
  const keenFinance = useKeenFinance();
  const stakedBalance = useStakedBalanceOnBoardroom();

  const updateState = useCallback(async () => {
    setBoardroomVersion(await keenFinance.fetchBoardroomVersionOfUser());
  }, [keenFinance?.isUnlocked, stakedBalance]);

  useEffect(() => {
    if (keenFinance?.isUnlocked) {
      updateState().catch((err) => console.error(err.stack));
    }
  }, [keenFinance?.isUnlocked, stakedBalance]);

  return boardroomVersion;
};

export default useBoardroomVersion;

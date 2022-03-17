import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import useKeenFinance from './useKeenFinance';
import useRefresh from './useRefresh';

const useStakedBalanceOnBoardroom = () => {
  const { slowRefresh } = useRefresh();
  const [balance, setBalance] = useState(BigNumber.from(0));
  const keenFinance = useKeenFinance();
  const isUnlocked = keenFinance?.isUnlocked;
  useEffect(() => {
    async function fetchBalance() {
      try {
        setBalance(await keenFinance.getStakedSharesOnBoardroom());
      } catch (e) {
        console.error(e);
      }
    }
    if (isUnlocked) {
      fetchBalance();
    }
  }, [slowRefresh, isUnlocked, keenFinance]);
  return balance;
};

export default useStakedBalanceOnBoardroom;

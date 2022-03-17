import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import useKeenFinance from './useKeenFinance';
import useRefresh from './useRefresh';

const useSuppliedAvaxBalance = () => {
  const { slowRefresh } = useRefresh();
  const [balance, setBalance] = useState(BigNumber.from(0));
  const keenFinance = useKeenFinance();
  useEffect(() => {
    async function fetchBalance() {
      try {
        setBalance(await keenFinance.getTotalSuppliedAvax());
      } catch (e) {
        console.error(e);
      }
    }
    fetchBalance();
  }, [slowRefresh, keenFinance]);
  return balance;
};

export default useSuppliedAvaxBalance;

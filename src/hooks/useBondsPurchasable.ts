import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
//import ERC20 from '../keen-finance/ERC20';
import useKeenFinance from './useKeenFinance';
//import config from '../config';

const useBondsPurchasable = () => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const keenFinance = useKeenFinance();

  useEffect(() => {
    async function fetchBondsPurchasable() {
      try {
        setBalance(await keenFinance.getBondsPurchasable());
      } catch (err) {
        console.error(err);
      }
    }
    fetchBondsPurchasable();
  }, [setBalance, keenFinance]);

  return balance;
};

export default useBondsPurchasable;

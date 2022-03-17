import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import useKeenFinance from './useKeenFinance';

const useTreasuryAmount = () => {
  const [amount, setAmount] = useState(BigNumber.from(0));
  const keenFinance = useKeenFinance();

  useEffect(() => {
    if (keenFinance) {
      const { Treasury } = keenFinance.contracts;
      keenFinance.KEEN.balanceOf(Treasury.address).then(setAmount);
    }
  }, [keenFinance]);
  return amount;
};

export default useTreasuryAmount;

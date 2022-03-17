import { useCallback } from 'react';
import useKeenFinance from './useKeenFinance';
import { Bank } from '../keen-finance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useRedeem = (bank: Bank) => {
  const keenFinance = useKeenFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleRedeem = useCallback(() => {
    handleTransactionReceipt(keenFinance.exit(bank.contract, bank.poolId), `Redeem ${bank.contract}`);
  }, [bank, keenFinance, handleTransactionReceipt]);

  return { onRedeem: handleRedeem };
};

export default useRedeem;

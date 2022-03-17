import { useCallback } from 'react';
import useKeenFinance from './useKeenFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import { parseUnits } from 'ethers/lib/utils';
import { TAX_OFFICE_ADDR } from '../utils/constants';

const useProvideKeenFtmLP = () => {
  const keenFinance = useKeenFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleProvideKeenFtmLP = useCallback(
    (ftmAmount: string, keenAmount: string) => {
      const keenAmountBn = parseUnits(keenAmount);
      handleTransactionReceipt(
        keenFinance.provideKeenFtmLP(ftmAmount, keenAmountBn),
        `Provide KEEN-AVAX LP ${keenAmount} ${ftmAmount} using ${TAX_OFFICE_ADDR}`,
      );
    },
    [keenFinance, handleTransactionReceipt],
  );
  return { onProvideKeenFtmLP: handleProvideKeenFtmLP };
};

export default useProvideKeenFtmLP;

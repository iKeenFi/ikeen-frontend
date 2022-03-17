import { useCallback, useEffect, useState } from 'react';
import useKeenFinance from './useKeenFinance';
import config from '../config';
import { BigNumber } from 'ethers';

const useCashPriceInLastTWAP = () => {
  const [price, setPrice] = useState<BigNumber>(BigNumber.from(0));
  const keenFinance = useKeenFinance();

  const fetchCashPrice = useCallback(async () => {
    setPrice(await keenFinance.getKeenPriceInLastTWAP());
  }, [keenFinance]);

  useEffect(() => {
    fetchCashPrice().catch((err) => console.error(`Failed to fetch KEEN price: ${err.stack}`));
    const refreshInterval = setInterval(fetchCashPrice, config.refreshInterval);
    return () => clearInterval(refreshInterval);
  }, [setPrice, keenFinance, fetchCashPrice]);

  return price;
};

export default useCashPriceInLastTWAP;

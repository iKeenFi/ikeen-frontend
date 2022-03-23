import { KeenFinance } from './../keen-finance/KeenFinance';
import { useCallback, useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import { BigNumber } from 'ethers';
import ERC20 from '../keen-finance/ERC20';
import useKeenFinance from './useKeenFinance';

const useWhitelistStatus = (address: string) => {
  const [whitelistStatus, setWhitelistStatus] = useState<boolean>(true);
  const { account } = useWallet();

  const keenFinance = useKeenFinance();

  const fetchWhitelistStatus = useCallback(async () => {
    const whitelist = await keenFinance.getWhitelistedStatus(account);
  }, [account]);

  useEffect(() => {
    if (account) {
      fetchWhitelistStatus().catch((err) => console.error(`Failed to fetch whitelist status: ${err.stack}`));
    }
  }, [account]);

  return whitelistStatus;
};

export default useWhitelistStatus;

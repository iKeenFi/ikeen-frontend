import React, { useCallback, useEffect, useState } from 'react';
import Context from './context';
import useKeenFinance from '../../hooks/useKeenFinance';
import { Bank } from '../../keen-finance';
import config, { bankDefinitions } from '../../config';

const Banks: React.FC = ({ children }) => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const keenFinance = useKeenFinance();
  const isUnlocked = keenFinance?.isUnlocked;

  const fetchPools = useCallback(async () => {
    const banks: Bank[] = [];

    for (const bankInfo of Object.values(bankDefinitions)) {
      if (bankInfo.finished) {
        if (!keenFinance.isUnlocked) continue;

        // only show pools staked by user
        const balance = await keenFinance.stakedBalanceOnBank(
          bankInfo.contract,
          bankInfo.poolId,
          keenFinance.myAccount,
        );
        if (balance.lte(0)) {
          continue;
        }
      }
      banks.push({
        ...bankInfo,
        address: config.deployments[bankInfo.contract].address,
        depositToken: keenFinance.externalTokens[bankInfo.depositTokenName],
        earnToken: bankInfo.earnTokenName === 'KEEN' ? keenFinance.KEEN : keenFinance.iSKEEN,
      });
    }
    banks.sort((a, b) => (a.sort > b.sort ? 1 : -1));
    setBanks(banks);
  }, [keenFinance, setBanks]);

  useEffect(() => {
    if (keenFinance) {
      fetchPools().catch((err) => console.error(`Failed to fetch pools: ${err.stack}`));
    }
  }, [isUnlocked, keenFinance, fetchPools]);

  return <Context.Provider value={{ banks }}>{children}</Context.Provider>;
};

export default Banks;

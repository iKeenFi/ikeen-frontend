import React, { createContext, useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import KeenFinance from '../../keen-finance';
import config from '../../config';

export interface KeenFinanceContext {
  keenFinance?: KeenFinance;
}

export const Context = createContext<KeenFinanceContext>({ keenFinance: null });

export const KeenFinanceProvider: React.FC = ({ children }) => {
  const { ethereum, account } = useWallet();
  const [keenFinance, setKeenFinance] = useState<KeenFinance>();

  useEffect(() => {
    if (!keenFinance) {
      const keen = new KeenFinance(config);
      if (account) {
        // wallet was unlocked at initialization
        keen.unlockWallet(ethereum, account);
      }
      setKeenFinance(keen);
    } else if (account) {
      keenFinance.unlockWallet(ethereum, account);
    }
  }, [account, ethereum, keenFinance]);

  return <Context.Provider value={{ keenFinance }}>{children}</Context.Provider>;
};

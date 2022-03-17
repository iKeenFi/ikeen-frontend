import { useContext } from 'react';
import { Context } from '../contexts/KeenFinanceProvider';

const useKeenFinance = () => {
  const { keenFinance } = useContext(Context);
  return keenFinance;
};

export default useKeenFinance;

import { useEffect, useState } from 'react';
import useKeenFinance from './useKeenFinance';
import useRefresh from './useRefresh';

const useFetchBoardroomAPR = () => {
  const [apr, setApr] = useState<number>(0);
  const keenFinance = useKeenFinance();
  const { slowRefresh } = useRefresh();

  useEffect(() => {
    async function fetchBoardroomAPR() {
      try {
        setApr(await keenFinance.getBoardroomAPR());
      } catch (err) {
        console.error(err);
      }
    }
    fetchBoardroomAPR();
  }, [setApr, keenFinance, slowRefresh]);

  return apr;
};

export default useFetchBoardroomAPR;

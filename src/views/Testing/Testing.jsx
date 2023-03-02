import React from 'react';
import useRedeem from '../../hooks/useRedeem';
import useBank from '../../hooks/useBank';
import {useWallet} from 'use-wallet';
import UnlockWallet from '../../components/UnlockWallet';

const Testing = () => {
    const bank = useBank("BombBtcbLPBShareRewardPool");
    const { onRedeem } = useRedeem(bank);
    const {account} = useWallet();
  return account && bank ?(
    <>
    <button onClick={onRedeem}>Click me</button>
    </>
   ) : !bank ? (
    <BankNotFound />
  ) : (
    <UnlockWallet />
  );
};
const BankNotFound = () => {
    return (
      <>
      bank not found
      </>
    );
  };

export default Testing
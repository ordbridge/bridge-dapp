import React from 'react';
import MetamaskIconIcon from '../../assets/metamask.png';
import '../../styles/connect-wallet.css';
import { Button } from '..';

const ConnectMetaMaskWallet = ({ onConnectClick, address, text }) => {
  if (address) {
    const firstHalf = address && address.substring(0, 5);
    const lastHalf = address && address.substring(address.length - 5, address.length - 1);
    const truncatedAddress = firstHalf + '...' + lastHalf;
    return (
      <button className="flex gap-1 justify-center max-w-[190px] landing-page-hero-content--button--alt font-semibold">
        <img src={MetamaskIconIcon} style={{ width: '30px' }} alt="" /> {truncatedAddress}
      </button>
    );
  }

  if (!address) {
    return (
      <button className=" landing-page-hero-content--button--alt" onClick={onConnectClick}>
        Connect Metamask
      </button>
    );
  }
};

export default ConnectMetaMaskWallet;

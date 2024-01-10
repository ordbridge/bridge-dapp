// Import your Phantom wallet icon here
import PhantomIcon from '../../assets/phantom.png'; // Update the path as necessary
import '../../styles/connect-wallet.css';

import React from 'react';
import { Button } from '..'; // Adjust the import according to your project structure

const ConnectPhantomWallet = ({ onConnectClick, address, text }) => {
  if (address) {
    // Truncate the address
    const firstHalf = address.substring(0, 5);
    const lastHalf = address.substring(address.length - 4);
    const truncatedAddress = firstHalf + '...' + lastHalf;

    return (
      <button className="flex gap-2 justify-center max-w-[190px] landing-page-hero-content--button--alt font-semibold">
        <img src={PhantomIcon} style={{ width: '20px' }} alt="" /> {truncatedAddress}
      </button>
    );
  }

  return (
    <button className=" landing-page-hero-content--button--alt" onClick={onConnectClick}>
      {text ? text : 'Connect Phantom'}
    </button>
  );
};

export default ConnectPhantomWallet;

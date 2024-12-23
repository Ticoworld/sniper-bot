import React, { useState } from 'react';
import { showConnect, UserSession, AppConfig } from '@stacks/connect';

const ConnectWallet = ({ userId }) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);

  const handleConnect = async () => {
    const appConfig = new AppConfig(['store_write', 'publish_data']);
    const userSession = new UserSession({ appConfig });

    showConnect({
      userSession,
      appDetails: {
        name: 'My Telegram Bot',
        icon: 'https://www.crypticorn.com/wp-content/uploads/2024/06/Crypto-Sniper-Bots.webp',
      },
      onFinish: async () => {
        try {
          // Request addresses from the Leather wallet
          const response = await window.LeatherProvider.request('getAddresses');
          console.log('Addresses:', response.result.addresses); // Log the addresses returned

          if (!response.result.addresses || response.result.addresses.length === 0) {
            throw new Error('No addresses found. Please ensure your wallet is set up correctly.');
          }

          const selectedAddress = response.result.addresses[0].address; // Select the first address
          setWalletConnected(true);
          setWalletAddress(selectedAddress);

          // Log the values being sent to the server
          console.log('Sending to server:', { userId, wallet: selectedAddress });

          const serverResponse = await fetch(`https://sniper-an93.onrender.com/update-wallet`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, wallet: selectedAddress }),
          });

          if (!serverResponse.ok) {
            throw new Error('Failed to update wallet on the server');
          }

          alert('Wallet connected successfully!');
        } catch (error) {
          console.error('Error connecting wallet:', error);
          alert('Failed to connect wallet. Please try again.');
        }
      },
      onCancel: () => {
        console.log('User  canceled the connection');
      },
    });
  };

  return (
    <div>
      {walletConnected ? (
        <p>Wallet Address: {walletAddress}</p>
      ) : (
        <button onClick={handleConnect}>Connect Wallet</button>
      )}
    </div>
  );
};

export default ConnectWallet;
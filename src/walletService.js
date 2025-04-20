// CORRECT IMPORT (use this exact line)
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import { ethers } from 'ethers';

const APP_NAME = 'FriendSplit';
const APP_LOGO_URL = 'https://example.com/logo.png';
const DEFAULT_ETH_JSONRPC_URL = `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_PROJECT_ID}`;
const DEFAULT_CHAIN_ID = 1; // Mainnet

// Initialize Wallet
export function initializeCoinbaseWallet() {
  return new CoinbaseWalletSDK({
    appName: APP_NAME,
    appLogoUrl: APP_LOGO_URL,
    darkMode: false
  });
}

// Connect to Wallet
export async function connectCoinbaseWallet() {
  try {
    const coinbaseWallet = initializeCoinbaseWallet();
    const ethereum = coinbaseWallet.makeWeb3Provider(
      DEFAULT_ETH_JSONRPC_URL,
      DEFAULT_CHAIN_ID
    );
    
    // Request account access
    await ethereum.request({ method: 'eth_requestAccounts' });
    
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    
    return {
      provider,
      signer,
      address
    };
  } catch (error) {
    console.error('Connection error:', error);
    throw error;
  }
}

// Create Payment
export async function createPaymentRequest(amount, recipientAddress) {
  try {
    const { signer } = await connectCoinbaseWallet();
    const tx = await signer.sendTransaction({
      to: recipientAddress,
      value: ethers.parseEther(amount.toString())
    });
    return tx;
  } catch (error) {
    console.error('Payment error:', error);
    throw error;
  }
}
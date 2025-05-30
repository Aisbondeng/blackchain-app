
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";

export function useWalletConnection() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState("");

  const connectMetamask = async () => {
    if (!window.ethereum) {
      alert("Metamask tidak tersedia.");
      return;
    }
    const metamaskProvider = new ethers.providers.Web3Provider(window.ethereum);
    await metamaskProvider.send("eth_requestAccounts", []);
    const signer = metamaskProvider.getSigner();
    setProvider(metamaskProvider);
    setSigner(signer);
    setAddress(await signer.getAddress());
  };

  const connectWalletConnect = async () => {
    const walletConnect = new WalletConnectProvider({
      rpc: {
        1: "https://mainnet.infura.io/v3/",
        11155111: "https://rpc.sepolia.org" // Sepolia
      }
    });
    await walletConnect.enable();
    const web3Provider = new ethers.providers.Web3Provider(walletConnect);
    const signer = web3Provider.getSigner();
    setProvider(web3Provider);
    setSigner(signer);
    setAddress(await signer.getAddress());
  };

  return {
    provider,
    signer,
    address,
    connectMetamask,
    connectWalletConnect
  };
}

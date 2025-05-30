
import { ethers } from "ethers";

export function getProvider(network = "sepolia") {
  return ethers.getDefaultProvider(network);
}

export function getWallet(privateKey, network = "sepolia") {
  const provider = getProvider(network);
  return new ethers.Wallet(privateKey, provider);
}

export async function getRealBalance(address, network = "sepolia") {
  const provider = getProvider(network);
  const balance = await provider.getBalance(address);
  return ethers.utils.formatEther(balance);
}

export async function sendEther(privateKey, to, amountInEther, network = "sepolia") {
  const wallet = getWallet(privateKey, network);
  const tx = await wallet.sendTransaction({
    to,
    value: ethers.utils.parseEther(amountInEther)
  });
  return tx.hash;
}


import { ethers } from "ethers";

// Contoh ABI: kontrak harus diisi ABI Anda sendiri jika berbeda
const ABI = [
  {
    "constant": true,
    "inputs": [],
    "name": "getValue",
    "outputs": [{ "name": "", "type": "string" }],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{ "name": "newValue", "type": "string" }],
    "name": "setValue",
    "outputs": [],
    "type": "function"
  }
];

// Alamat kontrak dummy (ganti dengan alamat Anda)
const CONTRACT_ADDRESS = "0x000000000000000000000000000000000000dead";

export function getContractInstance(signerOrProvider) {
  return new ethers.Contract(CONTRACT_ADDRESS, ABI, signerOrProvider);
}

// Kontrak khusus Blackchain
const BLACKCHAIN_ABI = [
  {
    "inputs": [],
    "name": "activate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "user", "type": "address" }
    ],
    "name": "isActive",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  }
];

const BLACKCHAIN_ADDRESS = "0x000000000000000000000000000000000000beef"; // Ganti saat deploy

export function getBlackchainContract(signerOrProvider) {
  return new ethers.Contract(BLACKCHAIN_ADDRESS, BLACKCHAIN_ABI, signerOrProvider);
}

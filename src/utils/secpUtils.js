import { encryptPrivateKey, decryptPrivateKey } from "./cryptoUtils";
import * as secp from "@noble/secp256k1";

// Optional: Gunakan kecepatan ekstra dengan WebAssembly jika tersedia
secp.utils.sha256Sync = (...args) =>
  crypto.subtle.digest("SHA-256", new TextEncoder().encode(args[0]));

export async function generateKeyPair() {
  const privateKey = secp.utils.randomPrivateKey();
  const publicKey = secp.getPublicKey(privateKey);
  return {
    privateKey: Buffer.from(privateKey).toString("hex"),
    publicKey: Buffer.from(publicKey).toString("hex"),
  };
}

export async function signMessage(message, privateKeyHex) {
  const messageBytes = new TextEncoder().encode(message);
  const privateKey = Uint8Array.from(Buffer.from(privateKeyHex, "hex"));
  const signature = await secp.sign(messageBytes, privateKey);
  return Buffer.from(signature).toString("hex");
}

export async function verifySignature(message, signatureHex, publicKeyHex) {
  const messageBytes = new TextEncoder().encode(message);
  const signature = Uint8Array.from(Buffer.from(signatureHex, "hex"));
  const publicKey = Uint8Array.from(Buffer.from(publicKeyHex, "hex"));
  return await secp.verify(signature, messageBytes, publicKey);
}


import { keccak_256 } from "@noble/hashes/sha3";

export function getEthereumAddressFromPublicKey(publicKeyHex) {
  const publicKeyBytes = Uint8Array.from(Buffer.from(publicKeyHex, "hex"));
  // Hilangkan byte pertama (0x04) dari uncompressed public key
  const publicKey = publicKeyBytes.slice(1);
  const hash = keccak_256(publicKey);
  return "0x" + Buffer.from(hash.slice(-20)).toString("hex");
}

const ENCRYPTED_KEY = "wallet_encrypted_key";

export function saveEncryptedKey(privateKeyHex, password) {
  const encrypted = encryptPrivateKey(privateKeyHex, password);
  localStorage.setItem(ENCRYPTED_KEY, encrypted);
}

export function loadDecryptedKey(password) {
  const encrypted = localStorage.getItem(ENCRYPTED_KEY);
  if (!encrypted) return null;
  return decryptPrivateKey(encrypted, password);
}

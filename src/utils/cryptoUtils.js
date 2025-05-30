
import CryptoJS from "crypto-js";

export function encryptPrivateKey(privateKeyHex, password) {
  return CryptoJS.AES.encrypt(privateKeyHex, password).toString();
}

export function decryptPrivateKey(cipherText, password) {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, password);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    return null;
  }
}

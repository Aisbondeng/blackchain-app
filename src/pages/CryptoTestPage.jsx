import React, { useEffect, useState } from "react";
import {
  generateKeyPair,
  signMessage,
  verifySignature,
} from "@/utils/secpUtils";

const CryptoTestPage = () => {
  const [keys, setKeys] = useState({});
  const [signature, setSignature] = useState("");
  const [verified, setVerified] = useState(null);

  useEffect(() => {
    const runCrypto = async () => {
      const { privateKey, publicKey } = await generateKeyPair();
      setKeys({ privateKey, publicKey });

      const msg = "Hello blockchain!";
      const sig = await signMessage(msg, privateKey);
      setSignature(sig);

      const isValid = await verifySignature(msg, sig, publicKey);
      setVerified(isValid);
    };

    runCrypto();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Test Kriptografi (secp256k1)</h1>
      <p><strong>Private Key:</strong> {keys.privateKey}</p>
      <p><strong>Public Key:</strong> {keys.publicKey}</p>
      <p><strong>Signature:</strong> {signature}</p>
      <p>
        <strong>Signature Valid:</strong>{" "}
        {verified === null ? "Checking..." : verified ? "✅ Yes" : "❌ No"}
      </p>
    </div>
  );
};

export default CryptoTestPage;

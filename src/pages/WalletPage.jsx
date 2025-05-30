import { QrReader } from 'react-qr-reader';
import QRCode from "qrcode.react";
import React, { useState, useEffect } from "react";
import {
  getWallet,
  saveWallet,
  getBalance,
  addBalance,
  sendBalance,
  getTransactionLogs,
} from "@/utils/walletStore";
import { generateKeyPair, signMessage, getEthereumAddressFromPublicKey } from "@/utils/secpUtils";

const WalletPage = () => {
  const [wallet, setWallet] = useState(null);
  const [ethAddress, setEthAddress] = useState("");
  const [balance, setBalance] = useState(0);
  const [signature, setSignature] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [logs, setLogs] = useState([]);
  const [scanResult, setScanResult] = useState(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const load = async () => {
      const existing = getWallet();
      setWallet(existing);
      if (existing) setEthAddress(getEthereumAddressFromPublicKey(existing.publicKey));
      setBalance(getBalance());
    setLogs(getTransactionLogs());
    setLogs(getTransactionLogs());
    };
    load();
  }, []);

  const handleGenerate = async () => {
    const keys = await generateKeyPair();
    saveWallet(keys.privateKey, keys.publicKey);
    setWallet(keys);
    setEthAddress(getEthereumAddressFromPublicKey(keys.publicKey));
    setBalance(getBalance());
    setLogs(getTransactionLogs());
    setLogs(getTransactionLogs());
  };

  const handleAddBalance = () => {
    addBalance(1000); // Simulasi top-up 1000 unit
    setBalance(getBalance());
    setLogs(getTransactionLogs());
    setLogs(getTransactionLogs());
  };

  const handleSign = async () => {
    if (!wallet) return;
    const sig = await signMessage("Verifikasi dompet", wallet.privateKey);
    setSignature(sig);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Dompet Kripto Lokal</h1>
      {wallet ? (
        <>
          <p><strong>Public Key:</strong> {wallet.publicKey}</p>
          <p><strong>Ethereum Address:</strong> {ethAddress}</p>
{ethAddress && <QRCode value={ethAddress} size={128} className="mt-2" />}

          <p><strong>Saldo:</strong> {balance}</p>
          <div className="space-x-2 mt-4">
            <button onClick={handleAddBalance} className="bg-blue-500 text-white px-4 py-1 rounded">Tambah Saldo</button>
            <button onClick={handleSign} className="bg-green-500 text-white px-4 py-1 rounded">Tanda Tangan</button>
          
          <div className="mt-4 space-y-2">
            <h2 className="font-semibold">Kirim Saldo</h2>
            <input value={toAddress} onChange={(e) => setToAddress(e.target.value)} placeholder="Alamat Tujuan" className="border p-1 rounded w-full" />
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Jumlah" className="border p-1 rounded w-full" />
            <button onClick={() => {
              try {
                sendBalance(toAddress, parseInt(amount));
                setBalance(getBalance());
                setLogs(getTransactionLogs());
              } catch (e) {
                alert(e.message);
              }
            }} className="bg-red-500 text-white px-4 py-1 rounded">Kirim</button>
          </div>

          
          <div className="mt-4">
            <h2 className="font-semibold">Scan QR untuk Kirim</h2>
            <button onClick={() => setScanning(!scanning)} className="bg-purple-500 text-white px-4 py-1 rounded">
              {scanning ? "Tutup Scanner" : "Buka Scanner"}
            </button>
            {scanning && (
              <div className="mt-2">
                <QrReader
                  constraints={{ facingMode: 'environment' }}
                  onResult={(result, error) => {
                    if (!!result) {
                      try {
                        const data = JSON.parse(result?.text);
                        if (data.to) setToAddress(data.to);
                        if (data.amount) setAmount(data.amount);
                        setScanResult(result?.text);
                        setScanning(false);
                      } catch (e) {
                        if (result?.text?.startsWith("0x") && result?.text.length === 42) {
                          setToAddress(result?.text);
                          setScanResult(result?.text);
                          setScanning(false);
                        }
                      }
                    }
                  }}
                  style={{ width: '100%' }}
                />
              </div>
            )}
          </div>
        

        <div className="mt-4">
            <h2 className="font-semibold">Riwayat Transaksi</h2>
            <ul className="list-disc pl-4">
              {logs.map((tx, i) => (
                <li key={i}>{tx.amount} → {tx.to} ({new Date(tx.time).toLocaleString()})</li>
              ))}
            </ul>
          </div>
        </div>
          {signature && (
            <p className="mt-4 break-all">
              <strong>Signature:</strong> {signature}
            </p>
          )}
        </>
      ) : (
        <button onClick={handleGenerate} className="bg-purple-600 text-white px-4 py-2 rounded">
          Buat Dompet Baru
        </button>
      )}
    
          <div className="mt-4 space-y-2">
            <h2 className="font-semibold">Kirim Saldo</h2>
            <input value={toAddress} onChange={(e) => setToAddress(e.target.value)} placeholder="Alamat Tujuan" className="border p-1 rounded w-full" />
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Jumlah" className="border p-1 rounded w-full" />
            <button onClick={() => {
              try {
                sendBalance(toAddress, parseInt(amount));
                setBalance(getBalance());
                setLogs(getTransactionLogs());
              } catch (e) {
                alert(e.message);
              }
            }} className="bg-red-500 text-white px-4 py-1 rounded">Kirim</button>
          </div>

          
          <div className="mt-4">
            <h2 className="font-semibold">Scan QR untuk Kirim</h2>
            <button onClick={() => setScanning(!scanning)} className="bg-purple-500 text-white px-4 py-1 rounded">
              {scanning ? "Tutup Scanner" : "Buka Scanner"}
            </button>
            {scanning && (
              <div className="mt-2">
                <QrReader
                  constraints={{ facingMode: 'environment' }}
                  onResult={(result, error) => {
                    if (!!result) {
                      try {
                        const data = JSON.parse(result?.text);
                        if (data.to) setToAddress(data.to);
                        if (data.amount) setAmount(data.amount);
                        setScanResult(result?.text);
                        setScanning(false);
                      } catch (e) {
                        if (result?.text?.startsWith("0x") && result?.text.length === 42) {
                          setToAddress(result?.text);
                          setScanResult(result?.text);
                          setScanning(false);
                        }
                      }
                    }
                  }}
                  style={{ width: '100%' }}
                />
              </div>
            )}
          </div>
        

        <div className="mt-4">
            <h2 className="font-semibold">Riwayat Transaksi</h2>
            <ul className="list-disc pl-4">
              {logs.map((tx, i) => (
                <li key={i}>{tx.amount} → {tx.to} ({new Date(tx.time).toLocaleString()})</li>
              ))}
            </ul>
          </div>
        </div>
  );
};

export default WalletPage;

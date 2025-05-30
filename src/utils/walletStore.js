const WALLET_KEY = "my_wallet";
const BALANCE_KEY = "wallet_balance";

export function saveWallet(privateKey, publicKey) {
  localStorage.setItem(WALLET_KEY, JSON.stringify({ privateKey, publicKey }));
}

export function getWallet() {
  const data = localStorage.getItem(WALLET_KEY);
  return data ? JSON.parse(data) : null;
}

export function getBalance() {
  return parseInt(localStorage.getItem(BALANCE_KEY)) || 0;
}

export function addBalance(amount) {
  const current = getBalance();
  localStorage.setItem(BALANCE_KEY, current + amount);
}


const TX_LOG_KEY = "wallet_tx_log";

export function sendBalance(toAddress, amount) {
  const current = getBalance();
  if (amount > current) throw new Error("Saldo tidak mencukupi");
  const newBalance = current - amount;
  localStorage.setItem(BALANCE_KEY, newBalance);
  logTransaction(toAddress, amount);
}

function logTransaction(to, amount) {
  const logs = JSON.parse(localStorage.getItem(TX_LOG_KEY) || "[]");
  logs.push({ to, amount, time: new Date().toISOString() });
  localStorage.setItem(TX_LOG_KEY, JSON.stringify(logs));
}

export function getTransactionLogs() {
  return JSON.parse(localStorage.getItem(TX_LOG_KEY) || "[]");
}


const BTC_BALANCE_KEY = "btc_balance";
const BLACKCHAIN_KEY = "blackchain_active";

export function getBTCBalance() {
  return parseFloat(localStorage.getItem(BTC_BALANCE_KEY) || "0");
}

export function addBTC(amount) {
  const current = getBTCBalance();
  const newAmount = current + amount;
  localStorage.setItem(BTC_BALANCE_KEY, newAmount);
}

export function isBlackchainActive() {
  return localStorage.getItem(BLACKCHAIN_KEY) === "true";
}

export function activateBlackchain() {
  localStorage.setItem(BLACKCHAIN_KEY, "true");
}

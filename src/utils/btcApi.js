
const BLOCKSTREAM_BASE = {
  mainnet: "https://blockstream.info/api",
  testnet: "https://blockstream.info/testnet/api"
};

let network = "testnet"; // Default: testnet

export function setBTCNetwork(net) {
  network = net;
}

export function getBTCNetwork() {
  return network;
}

export async function getBTCBalance(address) {
  try {
    const url = `${BLOCKSTREAM_BASE[network]}/address/${address}`;
    const res = await fetch(url);
    const data = await res.json();
    const confirmed = data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum;
    const mempool = data.mempool_stats.funded_txo_sum - data.mempool_stats.spent_txo_sum;
    return (confirmed + mempool) / 100000000; // Satoshi to BTC
  } catch (err) {
    console.error("Gagal ambil saldo BTC:", err);
    return 0;
  }
}

export async function getNewBTCAddress() {
  // Simulasi: untuk alamat asli, gunakan backend yang mengelola wallet Anda
  return "MOCK_BTC_ADDRESS_FOR_UI_TESTNET_MAINNET";
}


export function exportBTCSaldo(address, balance) {
  const data = {
    address,
    balance,
    network: "mainnet" // disamakan agar interoperabel meskipun dari testnet
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "btc_saldo_mainnet.json";
  a.click();
}

export function importBTCSaldo(file, callback) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (data && data.address && typeof data.balance === "number") {
        callback(data);
      } else {
        console.error("Format tidak valid.");
      }
    } catch (err) {
      console.error("Gagal membaca file:", err);
    }
  };
  reader.readAsText(file);
}

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ChevronLeft, Send as SendIconLucide, ScanLine, ArrowRight, AlertTriangle, Info } from 'lucide-react'; // Renamed SendIcon to avoid conflict
import { useToast } from '@/components/ui/use-toast';

const SendPage = ({ assets, setAssets }) => { // Accept assets and setAssets as props
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryParams = new URLSearchParams(location.search);
  const assetSymbolFromQuery = queryParams.get('asset') || 'BTC'; 

  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [networkFee, setNetworkFee] = useState([1]); 
  const [assetDetails, setAssetDetails] = useState(null);
  const [step, setStep] = useState(1); 
  const [selectedAssetSymbol, setSelectedAssetSymbol] = useState(assetSymbolFromQuery);


  const feeLevels = ['Rendah', 'Sedang', 'Cepat'];
  const feeValues = { // Mock fee values per asset (placeholder)
    'BTC': [0.00001, 0.00005, 0.0001],
    'ETH': [0.0001, 0.0005, 0.001],
    'BNB': [0.00005, 0.0001, 0.0002],
    'SOL': [0.000005, 0.00001, 0.00002],
    // Add other assets if needed
  };

  useEffect(() => {
    if (assets && assets.length > 0) {
      const foundAsset = assets.find(a => a.symbol.toUpperCase() === selectedAssetSymbol.toUpperCase());
      setAssetDetails(foundAsset);
    }
  }, [selectedAssetSymbol, assets]);

  const handleNextStep = () => {
    if (!recipientAddress || !amount || parseFloat(amount) <= 0) {
      toast({
        title: 'Input Tidak Lengkap',
        description: 'Harap isi alamat tujuan dan jumlah yang valid.',
        variant: 'destructive',
      });
      return;
    }
    if (assetDetails && parseFloat(amount) > assetDetails.balanceCrypto) {
        toast({
            title: 'Saldo Tidak Cukup',
            description: `Saldo ${selectedAssetSymbol} Anda tidak mencukupi.`,
            variant: 'destructive',
        });
        return;
    }
    if (selectedAssetSymbol === 'BTC' && (recipientAddress.startsWith('bc1') || recipientAddress.startsWith('1') || recipientAddress.startsWith('3'))) {
        if (!recipientAddress.startsWith('tb1') && !recipientAddress.startsWith('bcrt1')) {
            toast({
                title: 'Alamat Mainnet Terdeteksi',
                description: 'Anda mencoba mengirim ke alamat Bitcoin mainnet. Di lingkungan simulasi ini, hanya alamat testnet yang didukung (misal: diawali "tb1").',
                variant: 'destructive',
                duration: 7000,
            });
            return;
        }
    }
    setStep(2);
  };

  const handleSend = () => {
    toast({
      title: 'Transaksi Terkirim (Simulasi)',
      description: `Pengiriman ${amount} ${selectedAssetSymbol} ke ${recipientAddress} telah berhasil disimulasikan.`,
      className: "bg-green-600 text-white"
    });

    if (assetDetails) {
        const currentAssetFeeValues = feeValues[selectedAssetSymbol] || [0,0,0];
        const feeToDeduct = currentAssetFeeValues[networkFee[0]];
        const newBalanceCrypto = assetDetails.balanceCrypto - parseFloat(amount) - feeToDeduct;
        const newBalanceFiat = newBalanceCrypto * assetDetails.price;
        
        const updatedAsset = { ...assetDetails, balanceCrypto: newBalanceCrypto, balanceFiat: newBalanceFiat };
        
        const updatedAssetsList = assets.map(a => a.id === assetDetails.id ? updatedAsset : a);
        setAssets(updatedAssetsList); // Update state in App.jsx via prop
    }
    navigate('/');
  };

  const currentAssetFeeValues = feeValues[selectedAssetSymbol] || [0,0,0];
  const currentFee = currentAssetFeeValues[networkFee[0]];
  const totalAmount = parseFloat(amount || 0) + currentFee;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-4 flex flex-col h-full"
    >
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="icon" onClick={() => step === 1 ? navigate(-1) : setStep(1)} className="mr-2">
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-semibold">Kirim {selectedAssetSymbol}</h1>
      </div>

      {step === 1 && assetDetails && (
        <Card className="flex-grow bg-card">
          <CardHeader>
            <CardTitle>Detail Pengiriman</CardTitle>
            <CardDescription>Masukkan detail untuk mengirim {selectedAssetSymbol}.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="asset-select">Aset</Label>
                <select 
                    id="asset-select"
                    value={selectedAssetSymbol} 
                    onChange={(e) => setSelectedAssetSymbol(e.target.value)}
                    className="w-full mt-1 p-2 border border-input rounded-md bg-background text-foreground"
                >
                    {assets.filter(a => a.balanceCrypto > 0).map(asset => (
                        <option key={asset.id} value={asset.symbol}>{asset.name} ({asset.symbol})</option>
                    ))}
                </select>
            </div>

            <div>
              <Label htmlFor="recipient-address">Alamat Tujuan</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Input
                  id="recipient-address"
                  placeholder={`Masukkan alamat ${selectedAssetSymbol}`}
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  className="flex-grow"
                />
                <Button variant="outline" size="icon">
                  <ScanLine className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="amount">Jumlah</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Saldo tersedia: {assetDetails.balanceCrypto.toLocaleString('en-US', { maximumFractionDigits: 6 })} {selectedAssetSymbol}
              </p>
            </div>
            
            {selectedAssetSymbol === 'BTC' && (
                <Alert variant="default" className="bg-blue-500/10 border-blue-500/30 text-blue-200">
                    <Info className="h-5 w-5 text-blue-400" />
                    <AlertTitle className="font-semibold text-blue-300">Info Jaringan Bitcoin (Simulasi)</AlertTitle>
                    <AlertDescription className="text-blue-300/90">
                        Anda sedang dalam mode simulasi testnet. Pastikan alamat tujuan adalah alamat testnet (misalnya, diawali dengan "tb1"). Mengirim ke alamat mainnet asli (bc1, 1, atau 3) akan dicegah.
                    </AlertDescription>
                </Alert>
            )}


            <div>
              <Label htmlFor="network-fee">Biaya Jaringan ({feeLevels[networkFee[0]]})</Label>
              <Slider
                id="network-fee"
                min={0}
                max={2}
                step={1}
                value={networkFee}
                onValueChange={setNetworkFee}
                className="my-3"
              />
              <p className="text-xs text-muted-foreground">Estimasi biaya: {currentFee.toFixed(6)} {selectedAssetSymbol}</p>
            </div>

            <Button onClick={handleNextStep} className="w-full bg-primary hover:bg-primary/90">
              Lanjut <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && assetDetails && (
        <Card className="flex-grow bg-card">
          <CardHeader>
            <CardTitle>Tinjau Transaksi</CardTitle>
            <CardDescription>Harap periksa kembali detail transaksi Anda.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <p><strong>Mengirim:</strong> {parseFloat(amount).toLocaleString('en-US', { maximumFractionDigits: 6 })} {selectedAssetSymbol}</p>
              <p className="break-all"><strong>Ke Alamat:</strong> {recipientAddress}</p>
              <p><strong>Biaya Jaringan:</strong> {currentFee.toLocaleString('en-US', { maximumFractionDigits: 6 })} {selectedAssetSymbol} ({feeLevels[networkFee[0]]})</p>
              <hr className="my-2 border-border" />
              <p className="font-semibold text-base"><strong>Total:</strong> {totalAmount.toLocaleString('en-US', { maximumFractionDigits: 6 })} {selectedAssetSymbol}</p>
            </div>

            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Peringatan</AlertTitle>
              <AlertDescription>
                Pastikan alamat tujuan sudah benar. Transaksi yang sudah dikirim tidak dapat dibatalkan.
              </AlertDescription>
            </Alert>

            <Button onClick={handleSend} className="w-full bg-primary hover:bg-primary/90">
              <SendIconLucide className="mr-2 h-4 w-4" /> Kirim Sekarang
            </Button>
          </CardContent>
        </Card>
      )}
      
      {!assetDetails && step === 1 && (
          <div className="flex justify-center items-center h-full">
              <p className="text-muted-foreground">Memuat detail aset atau tidak ada aset yang dipilih...</p>
          </div>
      )}
    </motion.div>
  );
};

export default SendPage;
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ArrowRightLeft, Repeat } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const SwapPage = ({ assets: allAssets, setAssets: setAllAssets }) => { // Renamed props
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryParams = new URLSearchParams(location.search);
  
  const [availableFromAssets, setAvailableFromAssets] = useState([]);
  const [availableToAssets, setAvailableToAssets] = useState([]);

  const [fromAssetSymbol, setFromAssetSymbol] = useState(queryParams.get('from') || (allAssets.length > 0 ? allAssets[0].symbol : ''));
  const [toAssetSymbol, setToAssetSymbol] = useState(allAssets.length > 1 ? allAssets[1].symbol : (allAssets.length > 0 ? allAssets[0].symbol : ''));

  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  
  const [fromAsset, setFromAsset] = useState(null);
  const [toAsset, setToAsset] = useState(null);
  
  const [estimatedExchangeRate, setEstimatedExchangeRate] = useState(0);
  const [slippage, setSlippage] = useState(0.5);

  useEffect(() => {
    setAvailableFromAssets(allAssets.filter(a => a.balanceCrypto > 0));
    setAvailableToAssets(allAssets); // Can swap to any asset

    const initialFrom = allAssets.find(a => a.symbol === fromAssetSymbol && a.balanceCrypto > 0);
    let initialTo = allAssets.find(a => a.symbol === toAssetSymbol);

    if (!initialFrom && allAssets.filter(a => a.balanceCrypto > 0).length > 0) {
        const firstAvailableFrom = allAssets.filter(a => a.balanceCrypto > 0)[0];
        setFromAssetSymbol(firstAvailableFrom.symbol);
        setFromAsset(firstAvailableFrom);
    } else {
        setFromAsset(initialFrom);
    }
    
    if (!initialTo && allAssets.length > 0) {
        const firstAvailableTo = allAssets.find(a => a.symbol !== (initialFrom ? initialFrom.symbol : ''));
        if (firstAvailableTo) {
            setToAssetSymbol(firstAvailableTo.symbol);
            setToAsset(firstAvailableTo);
        } else if (allAssets.length > 0) { // fallback if only one asset exists
             setToAssetSymbol(allAssets[0].symbol);
             setToAsset(allAssets[0]);
        }
    } else {
        setToAsset(initialTo);
    }

  }, [allAssets, fromAssetSymbol, toAssetSymbol]);


  useEffect(() => {
    if (fromAsset && toAsset && fromAsset.price > 0 && toAsset.price > 0) {
      setEstimatedExchangeRate(fromAsset.price / toAsset.price);
      if (fromAmount) {
        setToAmount((parseFloat(fromAmount) * (fromAsset.price / toAsset.price)).toFixed(8));
      } else {
        setToAmount('');
      }
    } else {
      setEstimatedExchangeRate(0);
    }
  }, [fromAsset, toAsset, fromAmount]);


  const handleFromAmountChange = (e) => {
    const amount = e.target.value;
    setFromAmount(amount);
    if (amount && estimatedExchangeRate > 0) {
      setToAmount((parseFloat(amount) * estimatedExchangeRate).toFixed(8));
    } else {
      setToAmount('');
    }
  };
  
  const handleToAmountChange = (e) => {
    const amount = e.target.value;
    setToAmount(amount);
    if (amount && estimatedExchangeRate > 0) {
      setFromAmount((parseFloat(amount) / estimatedExchangeRate).toFixed(8));
    } else {
      setFromAmount('');
    }
  };

  const handleSwapAssets = () => {
    const tempSymbol = fromAssetSymbol;
    setFromAssetSymbol(toAssetSymbol);
    setToAssetSymbol(tempSymbol);

    const tempAsset = fromAsset;
    setFromAsset(toAsset);
    setToAsset(tempAsset);
    
    const tempAmount = fromAmount;
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };
  
  const handleMaxAmount = () => {
    if (fromAsset) {
      setFromAmount(fromAsset.balanceCrypto.toString());
      if (estimatedExchangeRate > 0) {
        setToAmount((fromAsset.balanceCrypto * estimatedExchangeRate).toFixed(8));
      }
    }
  };

  const executeSwap = () => {
    if (!fromAsset || !toAsset || !fromAmount || !toAmount || parseFloat(fromAmount) <= 0) {
      toast({ title: "Input Tidak Valid", description: "Harap isi semua kolom dengan benar.", variant: "destructive" });
      return;
    }
    if (parseFloat(fromAmount) > fromAsset.balanceCrypto) {
      toast({ title: "Saldo Tidak Cukup", description: `Saldo ${fromAsset.symbol} Anda tidak mencukupi.`, variant: "destructive" });
      return;
    }
    if (fromAsset.symbol === toAsset.symbol) {
        toast({ title: "Aset Sama", description: "Tidak dapat menukar aset dengan dirinya sendiri.", variant: "destructive" });
        return;
    }

    let updatedAssetsList = allAssets.map(asset => {
      if (asset.id === fromAsset.id) {
        return {
          ...asset,
          balanceCrypto: asset.balanceCrypto - parseFloat(fromAmount),
          balanceFiat: (asset.balanceCrypto - parseFloat(fromAmount)) * asset.price,
        };
      }
      if (asset.id === toAsset.id) {
        return {
          ...asset,
          balanceCrypto: (asset.balanceCrypto || 0) + parseFloat(toAmount),
          balanceFiat: ((asset.balanceCrypto || 0) + parseFloat(toAmount)) * asset.price,
        };
      }
      return asset;
    });
    
    setAllAssets(updatedAssetsList);

    toast({
      title: 'Swap Berhasil (Simulasi)!',
      description: `Anda menukar ${fromAmount} ${fromAsset.symbol} dengan ${toAmount} ${toAsset.symbol}.`,
      className: "bg-green-600 text-white"
    });
    navigate('/');
  };


  if (availableFromAssets.length === 0 && allAssets.length > 0) {
     return (
        <div className="p-4 flex flex-col h-full">
            <div className="flex items-center mb-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-2">
                <ChevronLeft className="h-6 w-6" />
                </Button>
                <h1 className="text-xl font-semibold">Tukar Aset (Pasangan)</h1>
            </div>
            <div className="flex justify-center items-center flex-grow">
                <p className="text-muted-foreground text-center">Tidak ada aset dengan saldo yang cukup untuk ditukar. <br/> Silakan tambah saldo atau terima aset terlebih dahulu.</p>
            </div>
        </div>
    );
  }
  
  if (!fromAsset || !toAsset) {
     return (
        <div className="p-4 flex flex-col h-full">
            <div className="flex items-center mb-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-2">
                <ChevronLeft className="h-6 w-6" />
                </Button>
                <h1 className="text-xl font-semibold">Tukar Aset (Pasangan)</h1>
            </div>
            <div className="flex justify-center items-center flex-grow">
                <p className="text-muted-foreground">Memuat aset... Harap pastikan Anda memiliki minimal dua jenis aset.</p>
            </div>
        </div>
    );
  }


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-4 flex flex-col h-full"
    >
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-2">
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-semibold">Tukar Aset (Pasangan)</h1>
      </div>

      <Card className="flex-grow bg-card">
        <CardHeader>
          <CardTitle>Pilih Aset</CardTitle>
          <CardDescription>Tukar aset kripto Anda dengan mudah.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="from-amount">Dari</Label>
            <div className="flex items-center space-x-2 mt-1">
              <Input
                id="from-amount"
                type="number"
                placeholder="0.00"
                value={fromAmount}
                onChange={handleFromAmountChange}
                className="flex-grow"
              />
              <Select value={fromAssetSymbol} onValueChange={(value) => {
                  setFromAssetSymbol(value);
                  setFromAsset(allAssets.find(a => a.symbol === value));
              }}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Pilih" />
                </SelectTrigger>
                <SelectContent>
                  {availableFromAssets.map(asset => (
                    <SelectItem key={asset.id} value={asset.symbol} disabled={asset.symbol === toAssetSymbol}>
                      {asset.symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {fromAsset && (
              <div className="text-xs text-muted-foreground mt-1 flex justify-between">
                <span>Saldo: {fromAsset.balanceCrypto.toLocaleString('en-US', { maximumFractionDigits: 8 })} {fromAsset.symbol}</span>
                <Button variant="link" size="sm" className="p-0 h-auto text-primary" onClick={handleMaxAmount}>MAKS</Button>
              </div>
            )}
          </div>

          <div className="flex justify-center my-[-0.5rem]">
            <Button variant="outline" size="icon" onClick={handleSwapAssets} className="rounded-full border-primary text-primary hover:bg-primary/10">
              <Repeat className="h-5 w-5" />
            </Button>
          </div>

          <div>
            <Label htmlFor="to-amount">Ke</Label>
            <div className="flex items-center space-x-2 mt-1">
              <Input
                id="to-amount"
                type="number"
                placeholder="0.00"
                value={toAmount}
                onChange={handleToAmountChange}
                className="flex-grow"
              />
              <Select value={toAssetSymbol} onValueChange={(value) => {
                  setToAssetSymbol(value);
                  setToAsset(allAssets.find(a => a.symbol === value));
              }}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Pilih" />
                </SelectTrigger>
                <SelectContent>
                  {availableToAssets.map(asset => (
                    <SelectItem key={asset.id} value={asset.symbol} disabled={asset.symbol === fromAssetSymbol}>
                      {asset.symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
             {toAsset && (
                <p className="text-xs text-muted-foreground mt-1">
                    Saldo tersedia: {(allAssets.find(a=>a.symbol === toAsset.symbol)?.balanceCrypto || 0).toLocaleString('en-US', {maximumFractionDigits: 8})} {toAsset.symbol}
                </p>
            )}
          </div>
          
          {fromAsset && toAsset && fromAsset.price > 0 && toAsset.price > 0 && (
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Estimasi Kurs: 1 {fromAsset.symbol} ≈ {estimatedExchangeRate.toFixed(8)} {toAsset.symbol}</p>
              <p>Biaya (Simulasi): 0.00 {fromAsset.symbol}</p>
              <p>Slippage Toleransi: {slippage}%</p>
            </div>
          )}

          <Button onClick={executeSwap} className="w-full bg-primary hover:bg-primary/90" disabled={!fromAsset || !toAsset || fromAsset.symbol === toAsset.symbol || fromAmount <= 0}>
            <ArrowRightLeft className="mr-2 h-4 w-4" /> Tukar Sekarang
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SwapPage;
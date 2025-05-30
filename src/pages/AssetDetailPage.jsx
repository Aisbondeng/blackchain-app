import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpCircle, ArrowDownCircle, Repeat, ShoppingCart, ChevronLeft, TrendingUp, TrendingDown, BarChartHorizontalBig } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ComingSoonPage from '@/pages/ComingSoonPage';


const AssetDetailPage = () => {
  const { assetId } = useParams();
  const navigate = useNavigate();
  const [asset, setAsset] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedAssets = JSON.parse(localStorage.getItem('cryvault_assets'));
    if (storedAssets) {
      const foundAsset = storedAssets.find(a => a.id === assetId);
      if (foundAsset) {
        setAsset(foundAsset);
      }
    }
    setIsLoading(false);
  }, [assetId]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-full"><p>Memuat detail aset...</p></div>;
  }

  if (!asset) {
    return <ComingSoonPage featureName={`Detail untuk aset ${assetId}`} />;
  }

  const PriceChangeIndicator = asset.changePercent >= 0 ? TrendingUp : TrendingDown;
  const priceChangeColor = asset.changePercent >= 0 ? 'text-green-500' : 'text-red-500';

  const actions = [
    { label: 'Kirim', icon: ArrowUpCircle, path: `/send?asset=${asset.symbol}` },
    { label: 'Terima', icon: ArrowDownCircle, path: `/receive?asset=${asset.symbol}` },
    { label: 'Tukar', icon: Repeat, path: `/tukar?from=${asset.symbol}` },
    { label: 'Beli/Jual', icon: ShoppingCart, path: `/buy-sell?asset=${asset.symbol}` },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-4 flex flex-col h-full space-y-4"
    >
      <div className="flex items-center mb-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-2">
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={asset.iconUrl} alt={asset.name} />
            <AvatarFallback>{asset.symbol.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <h1 className="text-xl font-semibold">{asset.name} ({asset.symbol})</h1>
      </div>

      <Card className="bg-card shadow-lg">
        <CardHeader>
          <CardDescription>Saldo Saat Ini</CardDescription>
          <CardTitle className="text-3xl">
            {asset.balanceCrypto.toLocaleString('en-US', { maximumFractionDigits: 6 })} {asset.symbol}
          </CardTitle>
          <p className="text-lg text-muted-foreground">
            ≈ ${asset.balanceFiat.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-sm">
            <span>Harga: ${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <PriceChangeIndicator className={`ml-2 h-4 w-4 ${priceChangeColor}`} />
            <span className={`ml-1 ${priceChangeColor}`}>{asset.changePercent.toFixed(2)}% (24j)</span>
          </div>
        </CardContent>
      </Card>

      <div className="h-48 bg-muted rounded-lg flex items-center justify-center my-4">
        <BarChartHorizontalBig className="h-16 w-16 text-muted-foreground opacity-50" />
        <p className="ml-2 text-muted-foreground">Grafik harga segera hadir</p>
      </div>
      

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actions.map((action) => (
          <Button key={action.label} variant="outline" className="flex flex-col h-auto py-3 items-center justify-center bg-card hover:bg-muted" onClick={() => navigate(action.path)}>
            <action.icon className="h-6 w-6 mb-1 text-primary" />
            <span className="text-xs">{action.label}</span>
          </Button>
        ))}
      </div>

      <Separator className="my-4" />

      <div>
        <h2 className="text-lg font-semibold mb-2">Informasi Aset</h2>
        <div className="space-y-1 text-sm text-muted-foreground">
          <p>Nama: {asset.name}</p>
          <p>Simbol: {asset.symbol}</p>
          <p>Peringkat Pasar: # {asset.marketCapRank || 'N/A'}</p>
          <p>Volume (24j): ${asset.volume24h?.toLocaleString() || 'N/A'}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default AssetDetailPage;
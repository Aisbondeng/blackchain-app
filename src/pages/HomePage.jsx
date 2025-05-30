import React, { useState, useEffect } from 'react'; import { useWalletConnection } from '../hooks/useWalletConnection'; import { Link } from 'react-router-dom'; import { Input } from '@/components/ui/input'; import { Button } from '@/components/ui/button'; import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'; import AssetItem from '@/components/AssetItem'; import { ArrowUpCircle, ArrowDownCircle, ShoppingCart, BarChart3, MoreHorizontal, Search, Eye, EyeOff, Filter, } from 'lucide-react'; import { motion } from 'framer-motion';

const HomePage = ({ assets, setAssets }) => { const [searchTerm, setSearchTerm] = useState(''); const [totalBalance, setTotalBalance] = useState(0); const [isBalanceVisible, setIsBalanceVisible] = useState(true);

useEffect(() => { if (assets && assets.length > 0) { const currentTotalBalance = assets.reduce((sum, asset) => sum + asset.balanceFiat, 0); setTotalBalance(currentTotalBalance); } }, [assets]);

const filteredAssets = assets.filter( (asset) => asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) );

const quickActions = [ { label: 'Kirim', icon: ArrowUpCircle, path: '/send' }, { label: 'Terima', icon: ArrowDownCircle, path: '/receive' }, { label: 'Beli', icon: ShoppingCart, path: '/buy' }, { label: 'Index', icon: BarChart3, path: '/index' }, { label: 'Lebih', icon: MoreHorizontal, path: '/more-actions' }, ];

return ( <div className="p-4 pb-0 flex flex-col h-full"> <Tabs defaultValue="coin" className="w-full flex flex-col flex-grow"> <TabsList className="grid w-full grid-cols-4 mb-4"> <TabsTrigger value="coin">Coin</TabsTrigger> <TabsTrigger value="bank" disabled>Bank</TabsTrigger> <TabsTrigger value="defi" disabled>DeFi</TabsTrigger> <TabsTrigger value="nft" disabled>NFT</TabsTrigger> </TabsList> <TabsContent value="coin" className="flex flex-col flex-grow overflow-hidden"> <motion.div className="text-center mb-4" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} > <div className="flex items-center justify-center"> <p className="text-sm text-muted-foreground">Total Saldo</p> <Button variant="ghost" size="icon" className="ml-2 h-6 w-6" onClick={(e) => { e.stopPropagation(); setIsBalanceVisible(!isBalanceVisible); }} > {isBalanceVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />} </Button> </div> <h2 className="text-4xl font-bold"> {isBalanceVisible ? ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2, })} : ''} </h2> <p className="text-xs text-muted-foreground"> {isBalanceVisible && assets.find((a) => a.symbol === 'BTC') ? ≈ ${assets.find((a) => a.symbol === 'BTC').balanceCrypto.toFixed(4)} BTC : ''} </p> </motion.div>

<motion.div
        className="grid grid-cols-5 gap-2 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {quickActions.map((action) => (
          <Link to={action.path} key={action.label} className="flex flex-col items-center">
            <Button
              variant="outline"
              size="icon"
              className="w-12 h-12 rounded-full bg-card hover:bg-muted"
            >
              <action.icon className="h-5 w-5" />
            </Button>
            <span className="text-xs mt-1 text-muted-foreground">{action.label}</span>
          </Link>
        ))}
      </motion.div>

      <div className="flex items-center mb-4 space-x-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Cari aset..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-grow overflow-y-auto -mx-4">
        {filteredAssets.length > 0 ? (
          filteredAssets.map((asset, index) => (
            <AssetItem key={asset.id} asset={asset} index={index} />
          ))
        ) : (
          <p className="text-center text-muted-foreground py-8">
            Tidak ada aset yang cocok.
          </p>
        )}
      </div>
    </TabsContent>
  </Tabs>
</div>

); };

export default HomePage;


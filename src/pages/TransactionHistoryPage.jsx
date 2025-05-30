import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowUpRight, ArrowDownLeft, Repeat, ChevronLeft, Filter, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';

const mockTransactions = [
  { id: 'tx1', type: 'Kirim', asset: 'BTC', amount: -0.05, fiatValue: -3426.40, date: '2025-05-27 10:30', address: 'tb1q...yz9a', status: 'Selesai' },
  { id: 'tx2', type: 'Terima', asset: 'ETH', amount: 1.2, fiatValue: 4354.13, date: '2025-05-26 15:45', address: '0x71...B3A2', status: 'Selesai' },
  { id: 'tx3', type: 'Swap', assetFrom: 'BTC', amountFrom: -0.02, assetTo: 'SOL', amountTo: 2.5, fiatValue: -1370.56, date: '2025-05-25 09:12', status: 'Selesai' },
  { id: 'tx4', type: 'Kirim', asset: 'BNB', amount: -0.5, fiatValue: -342.10, date: '2025-05-24 18:00', address: 'bnb1...k7f3', status: 'Tertunda' },
  { id: 'tx5', type: 'Terima', asset: 'BTC', amount: 0.1, fiatValue: 6852.80, date: '2025-05-23 11:20', address: 'tb1q...xckp', status: 'Selesai' },
];


const TransactionHistoryPage = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState(mockTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const getStatusColor = (status) => {
    if (status === 'Selesai') return 'text-green-500';
    if (status === 'Tertunda') return 'text-yellow-500';
    return 'text-red-500'; // Gagal
  };

  const getTxIcon = (type) => {
    if (type === 'Kirim') return <ArrowUpRight className="h-5 w-5 text-red-500" />;
    if (type === 'Terima') return <ArrowDownLeft className="h-5 w-5 text-green-500" />;
    if (type === 'Swap') return <Repeat className="h-5 w-5 text-blue-500" />;
    return null;
  };

  const filteredTransactions = transactions
    .filter(tx => {
      if (filterType === 'all') return true;
      return tx.type.toLowerCase() === filterType;
    })
    .filter(tx => {
      const search = searchTerm.toLowerCase();
      return (
        tx.asset?.toLowerCase().includes(search) ||
        tx.assetFrom?.toLowerCase().includes(search) ||
        tx.assetTo?.toLowerCase().includes(search) ||
        tx.address?.toLowerCase().includes(search) ||
        tx.id.toLowerCase().includes(search)
      );
    });

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
        <h1 className="text-xl font-semibold">Riwayat Transaksi</h1>
      </div>

      <div className="flex items-center mb-4 space-x-2">
        <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
            type="text"
            placeholder="Cari transaksi..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <Button variant="outline" size="icon" onClick={() => alert("Filter segera hadir!")}>
            <Filter className="h-4 w-4" />
        </Button>
      </div>
       <div className="flex space-x-2 mb-4">
        {['all', 'kirim', 'terima', 'swap'].map(type => (
          <Button
            key={type}
            variant={filterType === type ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType(type)}
            className="capitalize"
          >
            {type === 'all' ? 'Semua' : type}
          </Button>
        ))}
      </div>


      <Card className="flex-grow bg-card shadow-lg overflow-hidden">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-lg">Semua Aktivitas</CardTitle>
          {/* <CardDescription>Lihat semua transaksi Anda.</CardDescription> */}
        </CardHeader>
        <CardContent className="p-0 overflow-y-auto h-[calc(100%-4rem)]"> {/* Adjust height calculation as needed */}
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((tx, index) => (
              <React.Fragment key={tx.id}>
                <div className="flex items-center justify-between p-3 hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => alert(`Detail untuk transaksi ${tx.id} segera hadir.`)}>
                  <div className="flex items-center space-x-3">
                    {getTxIcon(tx.type)}
                    <div>
                      <p className="font-semibold">
                        {tx.type} {tx.type === 'Swap' ? `${tx.assetFrom} ke ${tx.assetTo}` : tx.asset}
                      </p>
                      <p className="text-xs text-muted-foreground">{new Date(tx.date).toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                     <p className={`font-medium ${tx.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                       {tx.type === 'Swap' ? `${tx.amountTo.toLocaleString(undefined, {maximumFractionDigits: 4})} ${tx.assetTo}` : `${tx.amount.toLocaleString(undefined, {maximumFractionDigits: 4})} ${tx.asset}`}
                    </p>
                    <p className={`text-xs ${getStatusColor(tx.status)}`}>{tx.status}</p>
                  </div>
                </div>
                {index < filteredTransactions.length - 1 && <Separator />}
              </React.Fragment>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">Tidak ada transaksi yang cocok.</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TransactionHistoryPage;
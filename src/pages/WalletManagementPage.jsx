import React, { useState, useEffect } from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
    import { Separator } from '@/components/ui/separator';
    import { PlusCircle, UploadCloud, HardDrive, ChevronLeft, LogOut, Download, Eye, EyeOff, AlertTriangle, KeyRound, FileText } from 'lucide-react';
    import { useNavigate } from 'react-router-dom';
    import { useToast } from '@/components/ui/use-toast';
    import { generateMnemonic, getBitcoinAddressFromMnemonic } from '@/lib/walletUtils'; 

    const WALLETS_STORAGE_KEY = 'cryvault_wallets_simplified_v2'; 
    const ACTIVE_WALLET_ID_KEY = 'cryvault_active_wallet_id_simplified_v2';

    const WalletManagementPage = () => {
      const navigate = useNavigate();
      const { toast } = useToast();
      const [wallets, setWallets] = useState([]);
      const [activeWalletId, setActiveWalletId] = useState(null);
      const [showDetailsWalletId, setShowDetailsWalletId] = useState(null);
      const cryptoDisabled = true; 

      useEffect(() => {
        const storedWallets = JSON.parse(localStorage.getItem(WALLETS_STORAGE_KEY)) || [];
        setWallets(storedWallets);
        const storedActiveWalletId = localStorage.getItem(ACTIVE_WALLET_ID_KEY);
        if (storedActiveWalletId && storedWallets.find(w => w.id === storedActiveWalletId)) {
          setActiveWalletId(storedActiveWalletId);
        } else if (storedWallets.length > 0) {
          setActiveWalletId(storedWallets[0].id);
          localStorage.setItem(ACTIVE_WALLET_ID_KEY, storedWallets[0].id);
        }
      }, []);

      const updateWalletsStorage = (newWallets, newActiveId = null) => {
        setWallets(newWallets);
        localStorage.setItem(WALLETS_STORAGE_KEY, JSON.stringify(newWallets));
        if (newActiveId) {
          setActiveWalletId(newActiveId);
          localStorage.setItem(ACTIVE_WALLET_ID_KEY, newActiveId);
        } else if (newWallets.length === 0) {
          localStorage.removeItem(ACTIVE_WALLET_ID_KEY);
          setActiveWalletId(null);
        } else if (newWallets.length > 0 && (!activeWalletId || !newWallets.find(w => w.id === activeWalletId))) {
          const newActive = newWallets[0].id;
          setActiveWalletId(newActive);
          localStorage.setItem(ACTIVE_WALLET_ID_KEY, newActive);
        }
      };
      
      const handleCreateWallet = () => {
        if (cryptoDisabled) {
            toast({ title: "Mode Placeholder", description: "Pembuatan dompet kripto nyata dinonaktifkan sementara. Dompet placeholder akan dibuat.", variant: "default" });
        }
        try {
          const newMnemonic = generateMnemonic(); 
          const isTestnet = true; 
          const { address, privateKey } = getBitcoinAddressFromMnemonic(newMnemonic, isTestnet); 
          
          const newWallet = {
            id: `wallet-placeholder-${Date.now()}`,
            name: `Dompet ${wallets.length + 1} (Placeholder)`,
            type: 'Software (BTC - Placeholder)',
            mnemonic: newMnemonic,
            privateKey: privateKey, 
            addressInfo: address,
            network: isTestnet ? 'Testnet (Simulasi)' : 'Mainnet (Simulasi)',
            balance: '$0.00', 
            importMethod: 'mnemonic',
          };

          const updatedWallets = [...wallets, newWallet];
          updateWalletsStorage(updatedWallets, activeWalletId || newWallet.id);
          toast({ title: "Dompet Placeholder Dibuat!", description: `Dompet "${newWallet.name}" berhasil dibuat.` });
        } catch (error) {
          console.error("Error creating placeholder wallet:", error);
          toast({ title: "Gagal Membuat Dompet Placeholder", description: error.message, variant: "destructive" });
        }
      };

      const handleSelectWallet = (walletId) => {
        setActiveWalletId(walletId);
        localStorage.setItem(ACTIVE_WALLET_ID_KEY, walletId);
        const selectedWallet = wallets.find(w => w.id === walletId);
        if (selectedWallet) {
          toast({ title: "Dompet Aktif Diubah", description: `Dompet "${selectedWallet.name}" sekarang aktif.` });
        }
      };

      const handleDeleteWallet = (walletIdToDelete) => {
        const walletToDelete = wallets.find(w => w.id === walletIdToDelete);
        if (!walletToDelete) return;

        if (window.confirm(`Apakah Anda yakin ingin menghapus dompet "${walletToDelete.name}"?`)) {
          const updatedWallets = wallets.filter(wallet => wallet.id !== walletIdToDelete);
          updateWalletsStorage(updatedWallets);
          toast({ title: "Dompet Dihapus", description: `Dompet "${walletToDelete.name}" telah dihapus.`, variant: "default" });
        }
      };

      const handleToggleShowDetails = (walletId) => {
        setShowDetailsWalletId(prev => prev === walletId ? null : walletId);
      };

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
            <h1 className="text-xl font-semibold">Manajemen Dompet</h1>
          </div>

          {cryptoDisabled && (
            <div className="mb-4 p-3 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 rounded-md text-sm flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
              Fitur kriptografi dinonaktifkan. Fungsi dompet berjalan dalam mode placeholder.
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button variant="outline" className="flex-col h-auto py-3 bg-card" onClick={handleCreateWallet}>
              <PlusCircle className="h-6 w-6 mb-1 text-primary" />
              <span className="text-xs">Buat Dompet</span>
            </Button>
            <Button variant="outline" className="flex-col h-auto py-3 bg-card" onClick={() => navigate('/wallet/import')}>
              <UploadCloud className="h-6 w-6 mb-1 text-primary" />
              <span className="text-xs">Impor Phrase</span>
            </Button>
          </div>
           <div className="grid grid-cols-1 gap-3 mb-6">
             <Button variant="outline" className="flex-col h-auto py-3 bg-card" onClick={() => navigate('/wallet/import-private-key')}>
              <KeyRound className="h-6 w-6 mb-1 text-primary" />
              <span className="text-xs">Impor Private Key</span>
            </Button>
          </div>


          <Card className="flex-grow bg-card shadow-lg">
            <CardHeader>
              <CardTitle>Daftar Dompet</CardTitle>
              <CardDescription>Kelola semua dompet Anda di sini.</CardDescription>
            </CardHeader>
            <CardContent>
              {wallets.map((wallet, index) => (
                <React.Fragment key={wallet.id}>
                  <div className={`flex items-center justify-between py-3 px-2 rounded-md ${wallet.id === activeWalletId ? 'bg-primary/10 ring-1 ring-primary' : ''}`}>
                    <div onClick={() => handleSelectWallet(wallet.id)} className="cursor-pointer flex-grow">
                      <p className="font-semibold">{wallet.name} {wallet.id === activeWalletId && <span className="text-xs text-primary ml-1">(Aktif)</span>}</p>
                      <p className="text-sm text-muted-foreground">{wallet.type} - {wallet.network}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-xs">{wallet.addressInfo}</p>
                      {showDetailsWalletId === wallet.id && (
                        <div className="text-xs text-amber-600 dark:text-amber-400 mt-1 break-all p-1 bg-amber-50 dark:bg-amber-900 rounded">
                          {wallet.importMethod === 'mnemonic' && wallet.mnemonic && <p><strong>Phrase:</strong> {wallet.mnemonic}</p>}
                          {wallet.importMethod === 'privateKey' && wallet.privateKey && <p><strong>Private Key:</strong> {wallet.privateKey}</p>}
                          {!wallet.mnemonic && !wallet.privateKey && <p>Detail tidak tersedia.</p>}
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => handleToggleShowDetails(wallet.id)} title={showDetailsWalletId === wallet.id ? "Sembunyikan Detail" : "Tampilkan Detail"}>
                            {showDetailsWalletId === wallet.id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        {wallet.importMethod === 'mnemonic' && wallet.mnemonic && (
                            <Button variant="ghost" size="icon" onClick={() => navigate(`/wallet/export/${wallet.id}`)} title="Ekspor Phrase">
                                <FileText className="h-4 w-4" />
                            </Button>
                        )}
                        {wallet.privateKey && (
                             <Button variant="ghost" size="icon" onClick={() => navigate(`/wallet/export-private-key/${wallet.id}`)} title="Ekspor Private Key">
                                <KeyRound className="h-4 w-4" />
                            </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteWallet(wallet.id)} title="Hapus Dompet">
                            <LogOut className="h-4 w-4 text-red-500" />
                        </Button>
                    </div>
                  </div>
                  {index < wallets.length - 1 && <Separator />}
                </React.Fragment>
              ))}
              {wallets.length === 0 && (
                <p className="text-center text-muted-foreground py-4">Belum ada dompet. Buat atau impor dompet baru.</p>
              )}
            </CardContent>
          </Card>

          <Button variant="outline" className="mt-6 w-full bg-card" onClick={() => toast({title: "Segera Hadir", description: "Fitur hubungkan hardware wallet sedang dikembangkan."})}>
            <HardDrive className="mr-2 h-5 w-5 text-primary" />
            Hubungkan CryVault S1 / Hardware Wallet Lainnya
          </Button>
        </motion.div>
      );
    };

    export default WalletManagementPage;
import React, { useState, useEffect } from 'react';
    import { motion } from 'framer-motion';
    import { useNavigate, useParams } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
    import { ChevronLeft, ShieldAlert, Copy, CheckCircle, AlertTriangle } from 'lucide-react';
    import { useToast } from '@/components/ui/use-toast';

    const WALLETS_STORAGE_KEY = 'cryvault_wallets_simplified_v2';

    const ExportWalletPage = () => {
      const navigate = useNavigate();
      const { walletId } = useParams();
      const { toast } = useToast();
      const [wallet, setWallet] = useState(null);
      const [copied, setCopied] = useState(false);
      const cryptoDisabled = true;

      useEffect(() => {
        const storedWallets = JSON.parse(localStorage.getItem(WALLETS_STORAGE_KEY)) || [];
        const foundWallet = storedWallets.find(w => w.id === walletId);
        if (foundWallet) {
          setWallet(foundWallet);
        } else {
          toast({
            title: "Dompet Tidak Ditemukan",
            description: "Tidak dapat menemukan detail dompet untuk diekspor.",
            variant: "destructive",
          });
          navigate('/wallet-management');
        }
      }, [walletId, navigate, toast]);

      const handleCopyToClipboard = () => {
        if (wallet && wallet.mnemonic) {
          navigator.clipboard.writeText(wallet.mnemonic)
            .then(() => {
              setCopied(true);
              toast({ title: "Disalin!", description: "Mnemonic phrase telah disalin ke clipboard." });
              setTimeout(() => setCopied(false), 2000);
            })
            .catch(err => {
              console.error('Gagal menyalin: ', err);
              toast({ title: "Gagal Menyalin", description: "Tidak dapat menyalin phrase. Coba salin manual.", variant: "destructive" });
            });
        }
      };

      if (!wallet) {
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 flex flex-col h-full items-center justify-center">
            <p>Memuat detail dompet...</p>
          </motion.div>
        );
      }

      return (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="p-4 flex flex-col h-full items-center justify-center"
        >
          <div className="absolute top-4 left-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-2">
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </div>

          <Card className="w-full max-w-lg bg-card shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Ekspor Mnemonic Phrase</CardTitle>
              <CardDescription className="text-center">
                Ini adalah mnemonic phrase untuk dompet "{wallet.name}".
                {cryptoDisabled && " (Mode Placeholder)"} Jaga kerahasiaannya!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cryptoDisabled && (
                <div className="p-3 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 rounded-md text-sm flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
                  Fitur kriptografi dinonaktifkan. Phrase ini adalah placeholder.
                </div>
              )}
              <div className="p-4 border border-dashed border-primary rounded-md bg-primary/5">
                <p className="text-lg font-mono text-center break-all select-all text-primary tracking-wider">
                  {wallet.mnemonic || "Tidak ada mnemonic untuk dompet ini."}
                </p>
              </div>
              
              <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                <ShieldAlert className="h-5 w-5 mr-2 inline-block" />
                <strong>PERINGATAN KEAMANAN:</strong>
                <ul className="list-disc list-inside mt-1">
                  <li>Jangan pernah membagikan mnemonic phrase ini kepada siapapun.</li>
                  <li>Siapapun yang memiliki phrase ini dapat mengakses aset Anda (jika ini phrase asli).</li>
                  <li>Simpan di tempat yang aman, sebaiknya offline.</li>
                  <li>CryVault tidak akan pernah meminta phrase Anda.</li>
                </ul>
              </div>
              
              <Button onClick={handleCopyToClipboard} className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground" disabled={!wallet.mnemonic}>
                {copied ? <CheckCircle className="mr-2 h-5 w-5" /> : <Copy className="mr-2 h-5 w-5" />}
                {copied ? 'Disalin ke Clipboard' : 'Salin Mnemonic Phrase'}
              </Button>

            </CardContent>
            <CardFooter>
              <Button onClick={() => navigate('/wallet-management')} className="w-full bg-primary hover:bg-primary/90">
                Selesai & Kembali ke Manajemen Dompet
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      );
    };

    export default ExportWalletPage;
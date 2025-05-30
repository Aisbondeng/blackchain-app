import React, { useState, useEffect } from 'react';
    import { motion } from 'framer-motion';
    import { useNavigate, useParams } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
    import { ChevronLeft, ShieldAlert, Copy, CheckCircle, AlertTriangle, KeyRound } from 'lucide-react';
    import { useToast } from '@/components/ui/use-toast';

    const WALLETS_STORAGE_KEY = 'cryvault_wallets_simplified_v2';

    const ExportPrivateKeyPage = () => {
      const navigate = useNavigate();
      const { walletId } = useParams();
      const { toast } = useToast();
      const [wallet, setWallet] = useState(null);
      const [copied, setCopied] = useState(false);
      const cryptoDisabled = true;
      const [qrCodeUrl, setQrCodeUrl] = useState('');


      useEffect(() => {
        const storedWallets = JSON.parse(localStorage.getItem(WALLETS_STORAGE_KEY)) || [];
        const foundWallet = storedWallets.find(w => w.id === walletId);
        if (foundWallet && foundWallet.privateKey) {
          setWallet(foundWallet);
          // Generate QR code for the private key (placeholder, actual private key not used for QR for security in real app)
          // For this simulation, we'll use the disguised address for QR to maintain consistency with ReceivePage
          const disguisedAddress = foundWallet.addressInfo ? foundWallet.addressInfo.replace(/^tb1/, "bc1") : "NO_ADDRESS_FOR_QR";
          setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(disguisedAddress)}&bgcolor=1f2937&color=ffffff&qzone=1`);

        } else {
          toast({
            title: "Private Key Tidak Ditemukan",
            description: "Tidak dapat menemukan private key untuk dompet ini atau dompet tidak diimpor via private key.",
            variant: "destructive",
          });
          navigate('/wallet-management');
        }
      }, [walletId, navigate, toast]);

      const handleCopyToClipboard = () => {
        if (wallet && wallet.privateKey) {
          navigator.clipboard.writeText(wallet.privateKey)
            .then(() => {
              setCopied(true);
              toast({ title: "Disalin!", description: "Private key telah disalin ke clipboard." });
              setTimeout(() => setCopied(false), 2000);
            })
            .catch(err => {
              console.error('Gagal menyalin: ', err);
              toast({ title: "Gagal Menyalin", description: "Tidak dapat menyalin private key. Coba salin manual.", variant: "destructive" });
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
              <CardTitle className="text-2xl text-center flex items-center justify-center">
                <KeyRound className="mr-2 h-7 w-7 text-primary" /> Ekspor Private Key
              </CardTitle>
              <CardDescription className="text-center">
                Ini adalah private key untuk dompet "{wallet.name}".
                {cryptoDisabled && " (Mode Placeholder)"} Jaga kerahasiaannya!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cryptoDisabled && (
                <div className="p-3 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 rounded-md text-sm flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
                  Fitur kriptografi dinonaktifkan. Private key ini adalah placeholder.
                </div>
              )}
              <div className="p-4 border border-dashed border-primary rounded-md bg-primary/5">
                <p className="text-lg font-mono text-center break-all select-all text-primary tracking-wider">
                  {wallet.privateKey || "Tidak ada private key untuk dompet ini."}
                </p>
              </div>

              {qrCodeUrl && (
                <div className="flex justify-center p-2 bg-background rounded-lg border border-input">
                  <img 
                    className="rounded-md"
                    alt="QR Code (Alamat Dompet)"
                    style={{ width: '180px', height: '180px' }}
                    src={qrCodeUrl} />
                </div>
              )}
              <p className="text-xs text-muted-foreground text-center">
                QR Code di atas adalah untuk alamat dompet yang terkait (disamarkan sebagai mainnet), BUKAN private key. Jangan pernah membuat QR code untuk private key Anda.
              </p>
              
              <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                <ShieldAlert className="h-5 w-5 mr-2 inline-block" />
                <strong>PERINGATAN KEAMANAN SANGAT PENTING:</strong>
                <ul className="list-disc list-inside mt-1">
                  <li>JANGAN PERNAH membagikan private key ini kepada siapapun.</li>
                  <li>Siapapun yang memiliki private key ini dapat MENGONTROL PENUH aset Anda.</li>
                  <li>Simpan di tempat yang SANGAT aman, sebaiknya offline dan terenkripsi.</li>
                  <li>CryVault tidak akan pernah meminta private key Anda.</li>
                </ul>
              </div>
              
              <Button onClick={handleCopyToClipboard} className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground" disabled={!wallet.privateKey}>
                {copied ? <CheckCircle className="mr-2 h-5 w-5" /> : <Copy className="mr-2 h-5 w-5" />}
                {copied ? 'Disalin ke Clipboard' : 'Salin Private Key'}
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

    export default ExportPrivateKeyPage;
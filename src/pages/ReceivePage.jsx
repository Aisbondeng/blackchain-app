import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Copy, Share2, AlertTriangle, Bitcoin } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ReceivePage = () => {
  const { toast } = useToast();
  const testnetAddress = "tb1qxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"; // Full testnet address
  const disguisedMainnetAddress = testnetAddress.replace(/^tb1/, "bc1"); // Disguise as mainnet

  const [qrCodeUrl, setQrCodeUrl] = useState(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${disguisedMainnetAddress}&bgcolor=1f2937&color=ffffff&qzone=1`);


  const handleCopyAddress = () => {
    navigator.clipboard.writeText(disguisedMainnetAddress);
    toast({
      title: "Alamat Disalin!",
      description: "Alamat dompet BTC telah disalin ke clipboard.",
      className: "bg-primary text-primary-foreground"
    });
  };

  const handleShareAddress = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Alamat Dompet BTC Saya',
          text: `Ini alamat dompet BTC saya: ${disguisedMainnetAddress}`,
        });
        toast({
          title: "Alamat Dibagikan!",
          description: "Alamat dompet berhasil dibagikan.",
        });
      } catch (error) {
        toast({
          title: "Gagal Membagikan",
          description: "Tidak dapat membagikan alamat saat ini.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Fitur Tidak Didukung",
        description: "Browser Anda tidak mendukung fitur berbagi.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-4 flex flex-col items-center space-y-6 h-full overflow-y-auto"
    >
      <Card className="w-full max-w-md bg-card border-border shadow-xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Bitcoin className="h-8 w-8 text-primary mr-2" />
            <CardTitle className="text-2xl font-bold">Terima Bitcoin (BTC)</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Gunakan alamat di bawah ini untuk menerima Bitcoin ke dompet Anda.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <div className="p-3 bg-background rounded-lg border border-input">
            <img 
              className="rounded-md"
              alt="QR Code Alamat Bitcoin"
              style={{ width: '200px', height: '200px' }}
             src="https://images.unsplash.com/photo-1595079676339-1534801ad6cf" />
          </div>
          
          <div className="w-full p-3 bg-muted/50 rounded-md border border-input text-center break-all">
            <p className="text-sm font-mono text-foreground">{disguisedMainnetAddress}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full">
            <Button onClick={handleCopyAddress} variant="outline" className="w-full">
              <Copy className="mr-2 h-4 w-4" /> Salin Alamat
            </Button>
            <Button onClick={handleShareAddress} variant="outline" className="w-full">
              <Share2 className="mr-2 h-4 w-4" /> Bagikan
            </Button>
          </div>
        </CardContent>
      </Card>

      <Alert variant="default" className="w-full max-w-md bg-yellow-500/10 border-yellow-500/30 text-yellow-200">
        <AlertTriangle className="h-5 w-5 text-yellow-400" />
        <AlertTitle className="font-semibold text-yellow-300">Perhatian Penting!</AlertTitle>
        <AlertDescription className="text-yellow-300/90">
          Hanya kirim <strong className="font-semibold">Bitcoin (BTC)</strong> ke alamat ini. Mengirim koin atau token lain dapat mengakibatkan kehilangan permanen.
        </AlertDescription>
      </Alert>
      
      <p className="text-xs text-muted-foreground text-center max-w-md">
        Semua transaksi di lingkungan ini menggunakan jaringan simulasi untuk tujuan demonstrasi dan pengujian. Tidak ada aset nyata yang terlibat.
      </p>
    </motion.div>
  );
};

export default ReceivePage;
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, Network, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SecretBalanceModal from '@/components/SecretBalanceModal';
import { useToast } from '@/components/ui/use-toast';


const SpecialNetworkPage = ({ onAddSecretBalance }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSecretModalOpen, setIsSecretModalOpen] = useState(false);
  const longPressTimeoutRef = useRef(null);
  const [longPressProgress, setLongPressProgress] = useState(0);
  const [isLongPressing, setIsLongPressing] = useState(false);

  const handleLongPressStart = () => {
    setIsLongPressing(true);
    setLongPressProgress(0); 
    longPressTimeoutRef.current = setInterval(() => {
      setLongPressProgress(prev => {
        if (prev >= 100) {
          clearInterval(longPressTimeoutRef.current);
          setIsSecretModalOpen(true);
          setIsLongPressing(false);
          return 100;
        }
        return prev + (100 / (3000 / 50)); 
      });
    }, 50); 
  };

  const handleLongPressEnd = () => {
    clearInterval(longPressTimeoutRef.current);
    if (longPressProgress < 100) {
        toast({
            title: "Aktivasi Dibatalkan",
            description: "Tahan lebih lama untuk mengaktifkan.",
            variant: "default"
        });
    }
    setLongPressProgress(0);
    setIsLongPressing(false);
  };

  useEffect(() => {
    return () => clearInterval(longPressTimeoutRef.current); 
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-4 flex flex-col h-full items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-slate-50"
    >
      <div className="absolute top-4 left-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-2 text-slate-300 hover:text-slate-50 hover:bg-slate-700">
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>
      
      <Card className="w-full max-w-md bg-slate-800/70 backdrop-blur-md border-slate-700 shadow-2xl">
        <CardHeader className="text-center">
          <Network className="mx-auto h-16 w-16 text-primary mb-4 animate-pulse" />
          <CardTitle className="text-3xl font-bold tracking-tight">Jaringan Khusus</CardTitle>
          <CardDescription className="text-slate-400">
            Mode ini menyediakan akses ke fitur eksperimental dan konfigurasi jaringan tingkat lanjut.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
            <p className="text-sm text-slate-400 text-center">
                Tahan tombol di bawah ini selama 3 detik untuk membuka panel konfigurasi rahasia.
            </p>
            <div className="relative w-full max-w-xs">
                <Button 
                    variant="default" 
                    size="lg"
                    className="w-full py-6 text-lg bg-primary hover:bg-primary/90 shadow-lg transform transition-all duration-150 active:scale-95"
                    onMouseDown={handleLongPressStart}
                    onMouseUp={handleLongPressEnd}
                    onTouchStart={handleLongPressStart}
                    onTouchEnd={handleLongPressEnd}
                >
                    <Gift className="mr-2 h-5 w-5" />
                    {isLongPressing ? `Mengaktifkan... (${Math.round(longPressProgress)}%)` : "Aktifkan Fitur Rahasia"}
                </Button>
                {isLongPressing && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/50 rounded-full overflow-hidden">
                        <motion.div 
                            className="h-full bg-green-400"
                            initial={{ width: "0%"}}
                            animate={{ width: `${longPressProgress}%`}}
                            transition={{ duration: 0.05, ease: "linear" }}
                        />
                    </div>
                )}
            </div>
             <p className="text-xs text-slate-500 text-center px-4">
                Peringatan: Fitur dalam mode ini mungkin tidak stabil. Gunakan dengan hati-hati.
            </p>
        </CardContent>
      </Card>

      <SecretBalanceModal
        isOpen={isSecretModalOpen}
        onClose={() => setIsSecretModalOpen(false)}
        onCodeSubmit={() => {
          if(onAddSecretBalance) onAddSecretBalance();
          toast({
            title: "Fitur Rahasia Diaktifkan!",
            description: "Saldo BTC telah ditambahkan.",
            className: "bg-green-500 text-white"
          })
        }}
        expectedCode="301018"
        title="Konfigurasi Jaringan Khusus"
        description="Masukkan password untuk mengakses fitur rahasia."
      />
    </motion.div>
  );
};

export default SpecialNetworkPage;
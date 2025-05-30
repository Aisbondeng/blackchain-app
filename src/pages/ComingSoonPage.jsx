import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { HardHat, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ComingSoonPage = ({ featureName, showBackButton = false }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center h-full p-8 text-center bg-gradient-to-br from-background to-muted"
    >
      {showBackButton && (
         <div className="absolute top-4 left-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ChevronLeft className="h-6 w-6" />
            </Button>
        </div>
      )}
      <HardHat className="h-24 w-24 text-primary mb-6" />
      <h1 className="text-3xl font-bold mb-2 text-foreground">Segera Hadir!</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Fitur <span className="font-semibold text-primary">{featureName || "ini"}</span> sedang dalam tahap pengembangan.
      </p>
      <p className="text-sm text-muted-foreground">
        Kami bekerja keras untuk menghadirkannya untuk Anda. Terima kasih atas kesabaran Anda!
      </p>
      {!showBackButton && (
        <Button onClick={() => navigate('/')} className="mt-8 bg-primary hover:bg-primary/90">
            Kembali ke Beranda
        </Button>
      )}
    </motion.div>
  );
};

export default ComingSoonPage;
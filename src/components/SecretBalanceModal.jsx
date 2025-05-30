import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Gift, Network } from 'lucide-react';

const SecretBalanceModal = ({ isOpen, onClose, onCodeSubmit, expectedCode = "30102018", title = "Fitur Rahasia", description = "Masukkan kode rahasia untuk mengaktifkan fitur spesial." }) => {
  const [code, setCode] = useState('');
  const { toast } = useToast();

  const handleSubmit = () => {
    if (code === expectedCode) {
      onCodeSubmit();
      toast({
        title: 'Kode Diterima!',
        description: 'Fitur spesial telah diaktifkan.',
        variant: 'default',
        className: 'bg-green-600 text-white',
      });
      onClose();
    } else {
      toast({
        title: 'Kode Salah',
        description: 'Kode yang Anda masukkan tidak valid. Coba lagi!',
        variant: 'destructive',
      });
    }
    setCode('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {title === "Jaringan Khusus" ? <Network className="mr-2 h-5 w-5 text-primary" /> : <Gift className="mr-2 h-5 w-5 text-primary" />}
            {title}
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            id="secret-code"
            type="password"
            placeholder="Masukkan kode..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="col-span-3"
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
          <Button type="submit" onClick={handleSubmit} className="bg-primary hover:bg-primary/90">Aktifkan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SecretBalanceModal;
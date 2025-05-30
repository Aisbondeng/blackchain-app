import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ShieldAlert, KeyRound } from 'lucide-react';

const PinLoginPage = ({ userPin, onPinSuccess }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pinDigits, setPinDigits] = useState(['', '', '', '', '', '']);
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 5;
  const inputRefs = useRef([]);

  const hashData = async (data) => {
    if (!data) return null;
    try {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex;
    } catch (error) {
      console.error("Error hashing data:", error);
      toast({ title: 'Kesalahan Sistem', description: 'Gagal memproses data keamanan.', variant: 'destructive' });
      return null;
    }
  };

  const handlePinChange = (e, index) => {
    const { value } = e.target;
    const newPinDigits = [...pinDigits];

    if (/^\d*$/.test(value)) { 
      if (value.length > 1) { 
        newPinDigits[index] = value.slice(-1);
      } else {
        newPinDigits[index] = value;
      }
      setPinDigits(newPinDigits);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !pinDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    const enteredPin = pinDigits.join('');
    if (enteredPin.length !== 6) {
      toast({ title: 'PIN Tidak Valid', description: 'PIN harus 6 digit.', variant: 'destructive' });
      return;
    }

    const hashedPinInput = await hashData(enteredPin);

    if (hashedPinInput && userPin && hashedPinInput === userPin) {
      toast({ title: 'PIN Benar!', description: 'Akses diberikan.', className: 'bg-green-600 text-white' });
      onPinSuccess();
      navigate('/', { state: { from: 'pin-login' } });
    } else {
      setAttempts(prev => prev + 1);
      if (attempts + 1 >= maxAttempts) {
        toast({ title: 'Terlalu Banyak Percobaan', description: 'Akun terkunci sementara. Silakan login ulang.', variant: 'destructive', duration: 7000 });
        localStorage.removeItem('cryvault_user'); 
        localStorage.removeItem('cryvault_pin');
        navigate('/auth', { replace: true });
      } else {
        toast({ title: 'PIN Salah', description: `Sisa percobaan: ${maxAttempts - (attempts + 1)}`, variant: 'destructive' });
      }
      setPinDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  useEffect(() => {
    const cryvaultUserJSON = localStorage.getItem('cryvault_user');
    if (!cryvaultUserJSON) {
        navigate('/auth', { replace: true });
        return;
    }
    const cryvaultUser = JSON.parse(cryvaultUserJSON);

    if (!cryvaultUser.pin) { // User exists but no PIN was set during registration
        onPinSuccess(); // Effectively bypasses PIN login
        navigate('/', { replace: true, state: { from: 'pin_check_no_pin_set' } });
        return;
    }

    if (!userPin) { // This means userPin prop wasn't passed correctly from App.jsx or user directly navigated here
      navigate('/auth', { replace: true });
      toast({ title: 'Sesi Tidak Valid', description: 'Silakan login ulang.', variant: 'destructive' });
    } else {
        inputRefs.current[0]?.focus();
    }
  }, [userPin, navigate, toast, onPinSuccess]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-background to-muted"
    >
      <Card className="w-full max-w-sm shadow-2xl bg-card">
        <CardHeader className="text-center pt-8 pb-4">
          <div className="inline-block p-3 mb-4 bg-primary/10 rounded-full mx-auto">
            <ShieldAlert className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Masukkan PIN</CardTitle>
          <CardDescription>Untuk keamanan, masukkan PIN 6 digit Anda.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePinSubmit} className="space-y-6">
            <div className="flex justify-center space-x-2" dir="ltr">
              {pinDigits.map((digit, index) => (
                <Input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="password" 
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => handlePinChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  maxLength={1}
                  className="w-10 h-12 text-center text-2xl bg-input border-border focus:border-primary focus:ring-primary"
                  autoComplete="one-time-code"
                />
              ))}
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-lg py-3">
              <KeyRound className="mr-2 h-5 w-5" /> Buka
            </Button>
          </form>
          <p className="text-xs text-muted-foreground text-center mt-4">
            Sisa percobaan: {Math.max(0, maxAttempts - attempts)}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PinLoginPage;
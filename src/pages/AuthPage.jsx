import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { KeyRound, UserPlus, ShieldCheck, Eye, EyeOff } from 'lucide-react';

const AuthPage = ({ onLoginSuccess, isAuthenticated }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('login');

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);
  const [registerPin, setRegisterPin] = useState('');
  const [showRegisterPin, setShowRegisterPin] = useState(false);
  const [registerConfirmPin, setRegisterConfirmPin] = useState('');
  const [showRegisterConfirmPin, setShowRegisterConfirmPin] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const user = JSON.parse(localStorage.getItem('cryvault_user'));
      if (user && user.pin) {
        navigate('/pin-login', { replace: true, state: { from: 'auth_already_logged_in_with_pin' } });
      } else if (user) {
        navigate('/', { replace: true, state: { from: 'auth_already_logged_in_no_pin' } });
      }
    }
  }, [isAuthenticated, navigate]);


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

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginUsername || !loginPassword) {
      toast({ title: 'Login Gagal', description: 'Username dan password harus diisi.', variant: 'destructive' });
      return;
    }
    const storedUserJSON = localStorage.getItem('cryvault_user');
    if (!storedUserJSON) {
        toast({ title: 'Login Gagal', description: 'Pengguna tidak ditemukan. Silakan registrasi.', variant: 'destructive' });
        return;
    }
    const storedUser = JSON.parse(storedUserJSON);

    if (storedUser && storedUser.username === loginUsername) {
      const hashedPassword = await hashData(loginPassword);
      if (hashedPassword && storedUser.password === hashedPassword) {
        toast({ title: 'Login Berhasil!', description: 'Selamat datang kembali!', className: 'bg-green-600 text-white' });
        onLoginSuccess(!!storedUser.pin);
        if (storedUser.pin) {
          navigate('/pin-login', { state: { from: 'login' } });
        } else {
          navigate('/', { state: { from: 'login' } });
        }
      } else {
        toast({ title: 'Login Gagal', description: 'Username atau password salah.', variant: 'destructive' });
      }
    } else {
      toast({ title: 'Login Gagal', description: 'Pengguna tidak ditemukan.', variant: 'destructive' });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!registerUsername || !registerPassword || !registerConfirmPassword || !registerPin || !registerConfirmPin) {
      toast({ title: 'Registrasi Gagal', description: 'Semua kolom harus diisi.', variant: 'destructive' });
      return;
    }
    if (registerPassword.length < 6) {
      toast({ title: 'Registrasi Gagal', description: 'Password minimal 6 karakter.', variant: 'destructive' });
      return;
    }
    if (registerPassword !== registerConfirmPassword) {
      toast({ title: 'Registrasi Gagal', description: 'Password tidak cocok.', variant: 'destructive' });
      return;
    }
    if (registerPin.length !== 6 || !/^\d{6}$/.test(registerPin)) {
      toast({ title: 'Registrasi Gagal', description: 'PIN harus 6 digit angka.', variant: 'destructive' });
      return;
    }
    if (registerPin !== registerConfirmPin) {
      toast({ title: 'Registrasi Gagal', description: 'PIN tidak cocok.', variant: 'destructive' });
      return;
    }

    const existingUserJSON = localStorage.getItem('cryvault_user');
    if (existingUserJSON) {
        const existingUser = JSON.parse(existingUserJSON);
        if (existingUser && existingUser.username === registerUsername) {
          toast({ title: 'Registrasi Gagal', description: 'Username sudah digunakan.', variant: 'destructive' });
          return;
        }
    }
    

    const hashedPassword = await hashData(registerPassword);
    const hashedPin = await hashData(registerPin);

    if (!hashedPassword || !hashedPin) {
      toast({ title: 'Registrasi Gagal', description: 'Gagal memproses data keamanan. Coba lagi.', variant: 'destructive' });
      return;
    }

    const newUser = {
      username: registerUsername,
      password: hashedPassword,
      pin: hashedPin,
    };
    localStorage.setItem('cryvault_user', JSON.stringify(newUser));
    localStorage.setItem('cryvault_pin', hashedPin); 
    toast({ title: 'Registrasi Berhasil!', description: 'Akun Anda telah dibuat. Silakan login.', className: 'bg-green-600 text-white' });
    setActiveTab('login');
    setLoginUsername(registerUsername); 
    setLoginPassword(''); 
    setRegisterUsername('');
    setRegisterPassword('');
    setRegisterConfirmPassword('');
    setRegisterPin('');
    setRegisterConfirmPin('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-background to-muted"
    >
      <Card className="w-full max-w-md shadow-2xl bg-card overflow-hidden">
        <CardHeader className="text-center pt-8 pb-4">
          <div className="inline-block p-3 mb-4 bg-primary/10 rounded-full mx-auto">
            <ShieldCheck className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">CryVault</CardTitle>
          <CardDescription>Dompet kripto aman dan terpercaya Anda.</CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Registrasi</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="login-username">Username</Label>
                  <Input id="login-username" type="text" placeholder="Masukkan username" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} required className="bg-input" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Input id="login-password" type={showLoginPassword ? "text" : "password"} placeholder="Masukkan password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required className="bg-input pr-10" />
                    <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setShowLoginPassword(!showLoginPassword)}>
                      {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-lg py-3">
                  <KeyRound className="mr-2 h-5 w-5" /> Login
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="register-username">Username</Label>
                  <Input id="register-username" type="text" placeholder="Pilih username" value={registerUsername} onChange={(e) => setRegisterUsername(e.target.value)} required className="bg-input" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="register-password">Password (min. 6 karakter)</Label>
                  <div className="relative">
                    <Input id="register-password" type={showRegisterPassword ? "text" : "password"} placeholder="Buat password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} required className="bg-input pr-10" />
                    <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setShowRegisterPassword(!showRegisterPassword)}>
                      {showRegisterPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="register-confirm-password">Konfirmasi Password</Label>
                  <div className="relative">
                    <Input id="register-confirm-password" type={showRegisterConfirmPassword ? "text" : "password"} placeholder="Ulangi password" value={registerConfirmPassword} onChange={(e) => setRegisterConfirmPassword(e.target.value)} required className="bg-input pr-10" />
                    <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setShowRegisterConfirmPassword(!showRegisterConfirmPassword)}>
                      {showRegisterConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="register-pin">PIN (6 digit angka)</Label>
                  <div className="relative">
                    <Input id="register-pin" type={showRegisterPin ? "text" : "password"} placeholder="Buat PIN 6 digit" value={registerPin} onChange={(e) => setRegisterPin(e.target.value.replace(/\D/g, '').slice(0, 6))} maxLength={6} pattern="\d{6}" required className="bg-input pr-10" />
                     <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setShowRegisterPin(!showRegisterPin)}>
                      {showRegisterPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="register-confirm-pin">Konfirmasi PIN</Label>
                  <div className="relative">
                    <Input id="register-confirm-pin" type={showRegisterConfirmPin ? "text" : "password"} placeholder="Ulangi PIN" value={registerConfirmPin} onChange={(e) => setRegisterConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 6))} maxLength={6} pattern="\d{6}" required className="bg-input pr-10" />
                    <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setShowRegisterConfirmPin(!showRegisterConfirmPin)}>
                      {showRegisterConfirmPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-lg py-3">
                  <UserPlus className="mr-2 h-5 w-5" /> Registrasi
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AuthPage;
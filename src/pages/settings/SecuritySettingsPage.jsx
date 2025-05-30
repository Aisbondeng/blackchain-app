import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, Lock, Fingerprint, ShieldCheck, FileText, AlertTriangle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const SettingsItem = ({ icon: Icon, label, value, path, action }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleClick = () => {
    if (action) action();
    else if (path) navigate(path);
    else toast({ title: "Segera Hadir", description: `Fitur "${label}" sedang dikembangkan.`});
  };

  return (
    <Button
      variant="ghost"
      className="w-full justify-between items-center px-3 py-4 text-left h-auto"
      onClick={handleClick}
    >
      <div className="flex items-center">
        <Icon className="mr-3 h-5 w-5 text-primary" />
        <span className="text-foreground">{label}</span>
      </div>
      <div className="flex items-center">
        {value && <span className="text-muted-foreground mr-2">{value}</span>}
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </div>
    </Button>
  );
};

const SecuritySettingsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleComingSoon = (feature) => {
    toast({
      title: "Segera Hadir!",
      description: `Fitur "${feature}" sedang dalam pengembangan.`,
    });
  };

  const securityItems = [
    { label: "Ganti PIN Aplikasi", icon: Lock, action: () => handleComingSoon("Ganti PIN Aplikasi") },
    { label: "Autentikasi Sidik Jari/Wajah", icon: Fingerprint, value: "Aktif", action: () => handleComingSoon("Autentikasi Biometrik") },
    { label: "Cadangkan Mnemonic Phrase", icon: ShieldCheck, action: () => handleComingSoon("Cadangkan Mnemonic") },
    { label: "Periksa Keamanan Mnemonic", icon: FileText, action: () => handleComingSoon("Periksa Keamanan Mnemonic") },
    { label: "Peringatan Keamanan", icon: AlertTriangle, action: () => handleComingSoon("Peringatan Keamanan") },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-0 flex flex-col h-full overflow-y-auto bg-muted"
    >
      <div className="flex items-center p-4 bg-background border-b border-border sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-2">
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-semibold">Keamanan</h1>
      </div>

      <div className="p-4">
        <Card className="bg-card shadow-sm">
          <CardContent className="p-0">
            {securityItems.map((item, index) => (
              <React.Fragment key={index}>
                <SettingsItem {...item} />
                {index < securityItems.length - 1 && <Separator />}
              </React.Fragment>
            ))}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default SecuritySettingsPage;
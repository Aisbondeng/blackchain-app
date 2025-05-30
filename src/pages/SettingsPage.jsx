import React
import { useEffect, useState } from "react";
import { setBTCNetwork, getBTCNetwork, getBTCBalance, getNewBTCAddress } from "../utils/btcApi";, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import SecretBalanceModal from '@/components/SecretBalanceModal';
import { 
  ChevronLeft, Shield, BookUser, Server, Network, Trash2, Palette, Settings2 as SettingsIcon, 
  DollarSign, Languages, BarChart2, HelpCircle, LogOut, ChevronRight 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const SettingsItem = ({ icon: Icon, label, value, path, action, isNav = true, onLongPress, onLongPressRelease }) => {
  const navigate = useNavigate();
  const longPressTimeoutRef = useRef(null);
  const [isPressing, setIsPressing] = useState(false);

  const handlePressStart = (e) => {
    if (onLongPress) {
      e.preventDefault(); 
      setIsPressing(true);
      longPressTimeoutRef.current = setTimeout(() => {
        if(isPressing) { 
          onLongPress();
        }
      }, 3000); 
    }
  };

  const handlePressEnd = () => {
    setIsPressing(false);
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
    if (onLongPressRelease) {
      onLongPressRelease();
    }
  };

  const handleClick = () => {
    if (isPressing) { 
      setIsPressing(false); 
      if (longPressTimeoutRef.current) {
          clearTimeout(longPressTimeoutRef.current);
          longPressTimeoutRef.current = null;
      }
      return; 
    }
    if (action) action();
    else if (path) navigate(path);
  };

  return (
    <Button
      variant="ghost"
      className="w-full justify-between items-center px-3 py-4 text-left h-auto"
      onClick={handleClick}
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onTouchStart={handlePressStart} 
      onTouchEnd={handlePressEnd}
      onContextMenu={(e) => e.preventDefault()} // Prevent context menu on long press
    >
      <div className="flex items-center">
        <Icon className="mr-3 h-5 w-5 text-primary" />
        <span className="text-foreground">{label}</span>
      </div>
      <div className="flex items-center">
        {value && <span className="text-muted-foreground mr-2">{value}</span>}
        {isNav && <ChevronRight className="h-5 w-5 text-muted-foreground" />}
      </div>
    </Button>
  );
};


const SettingsPage = ({ onLogout, onAddSecretBalance }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSecretModalOpen, setIsSecretModalOpen] = useState(false);
  const [isLongPressTriggered, setIsLongPressTriggered] = useState(false);

  const handleSpecialNetworkLongPress = () => {
    setIsLongPressTriggered(true); // Mark that long press was intended
    toast({
      title: "Jaringan Khusus",
      description: "Membuka opsi lanjutan...",
      duration: 1500,
    });
    setIsSecretModalOpen(true); // Open modal directly on successful long press
  };
  
  const handleSpecialNetworkLongPressRelease = () => {
    // If modal was opened by long press, it will handle itself.
    // If long press was too short, nothing happens here.
    setIsLongPressTriggered(false); // Reset flag
  };

  const handleSpecialNetworkClick = () => {
    // This function is called if it's a short click (not a long press)
    if (!isLongPressTriggered) { // Only show toast if it wasn't a long press that opened the modal
        toast({ title: "Jaringan Khusus", description: "Tahan item ini selama 3 detik untuk opsi lanjutan.", variant: "default" });
    }
    setIsLongPressTriggered(false); // Reset flag regardless
  };


  const settingsSections = [
    {
      items: [
        { label: "Keamanan", icon: Shield, path: "/settings/security" },
      ],
    },
    {
      items: [
        { label: "Buku alamat", icon: BookUser, path: "/settings/address-book" },
        { label: "Pengaturan Node", icon: Server, path: "/settings/node" },
        { 
          label: "Jaringan Khusus", 
          icon: Network, 
          action: handleSpecialNetworkClick, // For short click
          onLongPress: handleSpecialNetworkLongPress, // For long press
          onLongPressRelease: handleSpecialNetworkLongPressRelease, // Cleanup
          isNav: true,
          path: "/settings/custom-network" // Navigate here for the page if needed, or use action.
        },
        { label: "Bersihkan cache", icon: Trash2, path: "/settings/clear-cache", action: () => toast({title: "Cache Dibersihkan", description:"Cache aplikasi telah dibersihkan (simulasi)."}) },
      ],
    },
    {
      items: [
        { label: "Tampilan", icon: Palette, value: "Mode Gelap", path: "/settings/display" },
        { label: "Biaya transaksi", icon: SettingsIcon, value: "Sedang", path: "/settings/transaction-fee" },
        { label: "Fiat Currency", icon: DollarSign, value: "$ USD", path: "/settings/fiat-currency" },
        { label: "Bahasa", icon: Languages, value: "Bahasa Indonesia", path: "/settings/language" },
        { label: "Warna K-Line", icon: BarChart2, path: "/settings/kline-color" },
      ],
    },
    {
      items: [
        { label: "Pusat Bantuan", icon: HelpCircle, path: "/settings/help-center" },
      ],
    },
  ];

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    }
    // Navigation to /auth will be handled by ProtectedRoute in App.jsx after isAuthenticated becomes false
  };

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
        <h1 className="text-xl font-semibold">Pengaturan</h1>
      </div>

      <div className="p-4 space-y-4">
        {settingsSections.map((section, sectionIndex) => (
          <Card key={sectionIndex} className="bg-card shadow-sm">
            <CardContent className="p-0">
              {section.items.map((item, itemIndex) => (
                <React.Fragment key={itemIndex}>
                  <SettingsItem {...item} />
                  {itemIndex < section.items.length - 1 && <Separator />}
                </React.Fragment>
              ))}
            </CardContent>
          </Card>
        ))}
        
        <Card className="bg-card shadow-sm">
          <CardContent className="p-0">
            <SettingsItem label="Logout" icon={LogOut} action={handleLogoutClick} isNav={false} />
          </CardContent>
        </Card>
      </div>
      <SecretBalanceModal
        isOpen={isSecretModalOpen}
        onClose={() => setIsSecretModalOpen(false)}
        onCodeSubmit={() => {
            if(onAddSecretBalance) onAddSecretBalance();
        }}
        expectedCode="301018"
        title="Jaringan Khusus"
        description="Masukkan password untuk mengaktifkan fitur Jaringan Khusus."
      />
    </motion.div>
  );
};

export default SettingsPage;
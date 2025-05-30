import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Settings, Bell, QrCode, ChevronDown, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


const TopBar = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleWalletManagement = () => {
    navigate('/wallet-management');
  };
  
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-background/80 backdrop-blur-md border-b border-border h-16">
      <Link to="/settings" state={{ from: 'back' }}>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center space-x-1 px-2">
            <span className="font-semibold text-sm">Dompet Utama</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-56">
          <DropdownMenuItem onClick={handleWalletManagement}>
            Manajemen Dompet
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <div className="flex items-center space-x-2">
        <Link to="/notifications" state={{ from: 'forward' }}>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
        </Link>
        <Button variant="ghost" size="icon" onClick={() => navigate('/receive', { state: { fromQrScan: true } })}>
          <QrCode className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default TopBar;
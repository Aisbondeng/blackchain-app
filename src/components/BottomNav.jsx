
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Wallet, Repeat2, Compass, ArrowRightLeft, PiggyBank } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', label: 'Dompet', icon: Wallet },
  { path: '/pasangan', label: 'Pasangan', icon: Repeat2 },
  { path: '/explore', label: 'Explore', icon: Compass },
  { path: '/tukar', label: 'Tukar', icon: ArrowRightLeft },
  { path: '/earn', label: 'Earn', icon: PiggyBank },
];

const BottomNav = () => {
  return (
    <nav className="sticky bottom-0 mt-auto flex justify-around items-center bg-background border-t border-border h-16 z-50">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center text-xs p-2 rounded-md transition-colors',
              isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            )
          }
        >
          <item.icon className="h-5 w-5 mb-0.5" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
  
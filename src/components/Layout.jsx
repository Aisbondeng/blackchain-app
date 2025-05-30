import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import { Toaster } from '@/components/ui/toaster';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = ({ onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/auth');
  };

  const pageVariants = {
    initial: (direction) => ({
      opacity: 0,
      x: direction === 'forward' ? '20%' : direction === 'back' ? '-20%' : '0%',
    }),
    animate: {
      opacity: 1,
      x: '0%',
      transition: { type: 'tween', ease: 'anticipate', duration: 0.3 }
    },
    exit: (direction) => ({
      opacity: 0,
      x: direction === 'forward' ? '-20%' : direction === 'back' ? '20%' : '0%',
      transition: { type: 'tween', ease: 'anticipate', duration: 0.3 }
    }),
  };
  
  const getDirection = () => {
    if (location.state && location.state.from) {
      return location.state.from;
    }
    return 'none'; 
  };


  return (
    <div className="flex flex-col h-full w-full bg-background">
      <TopBar onLogout={handleLogoutClick} />
      <main className="main-content-area"> {/* Apply the scrollable class here */}
        <AnimatePresence mode="wait" custom={getDirection()}>
          <motion.div
            key={location.pathname}
            custom={getDirection()}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="h-full w-full" 
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <BottomNav />
      <Toaster />
    </div>
  );
};

export default Layout;
import CryptoTestPage from '@/pages/CryptoTestPage';
import React, { useState, useEffect } from 'react';
    import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
    import Layout from '@/components/Layout';
    import HomePage from '@/pages/HomePage';
    import AssetDetailPage from '@/pages/AssetDetailPage';
    import ReceivePage from '@/pages/ReceivePage';
    import SendPage from '@/pages/SendPage';
    import SwapPage from '@/pages/SwapPage';
    import ExplorePage from '@/pages/ExplorePage';
    import EarnPage from '@/pages/EarnPage';
    import SettingsPage from '@/pages/SettingsPage';
    import NotificationsPage from '@/pages/NotificationsPage';
    import Web3BrowserPage from '@/pages/Web3BrowserPage';
    import WalletManagementPage from '@/pages/WalletManagementPage';
    import ImportWalletPage from '@/pages/ImportWalletPage';
    import ExportWalletPage from '@/pages/ExportWalletPage';
    import ImportPrivateKeyPage from '@/pages/ImportPrivateKeyPage';
    import ExportPrivateKeyPage from '@/pages/ExportPrivateKeyPage';
    import TransactionHistoryPage from '@/pages/TransactionHistoryPage';
    import ComingSoonPage from '@/pages/ComingSoonPage';
    import AuthPage from '@/pages/AuthPage';
    import PinLoginPage from '@/pages/PinLoginPage';
    import SecuritySettingsPage from '@/pages/settings/SecuritySettingsPage';
    import AddressBookPage from '@/pages/settings/AddressBookPage';
    import NodeSettingsPage from '@/pages/settings/NodeSettingsPage';
    import SpecialNetworkPage from '@/pages/settings/SpecialNetworkPage';
    import ClearCachePage from '@/pages/settings/ClearCachePage';
    import DisplaySettingsPage from '@/pages/settings/DisplaySettingsPage';
    import TransactionFeePage from '@/pages/settings/TransactionFeePage';
    import FiatCurrencyPage from '@/pages/settings/FiatCurrencyPage';
    import LanguagePage from '@/pages/settings/LanguagePage';
    import KLineColorPage from '@/pages/settings/KLineColorPage';
    import HelpCenterPage from '@/pages/settings/HelpCenterPage';

    const ProtectedRoute = ({ isAuthenticated, pinRequired, userPin }) => {
      if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
      }
      if (pinRequired && userPin) { 
        return <Navigate to="/pin-login" replace />;
      }
      return <Outlet />;
    };

    function App() {
      const [isAuthenticated, setIsAuthenticated] = useState(false);
      const [pinRequired, setPinRequired] = useState(false);
      const [userPin, setUserPin] = useState(null);
      const [assets, setAssets] = useState([]);

      const initialMockAssets = [
        { id: 'btc', name: 'Bitcoin', symbol: 'BTC', price: 68527.98, changePercent: -1.11, balanceFiat: 12500.00, balanceCrypto: 0.182391, iconUrl: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25651/svg/color/btc.svg' },
        { id: 'eth', name: 'Ethereum', symbol: 'ETH', price: 3628.44, changePercent: -0.24, balanceFiat: 8750.50, balanceCrypto: 2.4115, iconUrl: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25651/svg/color/eth.svg' },
        { id: 'bnb', name: 'BNB', symbol: 'BNB', price: 684.19, changePercent: 0.48, balanceFiat: 3200.75, balanceCrypto: 4.678, iconUrl: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25651/svg/color/bnb.svg' },
        { id: 'sol', name: 'Solana', symbol: 'SOL', price: 165.30, changePercent: 2.55, balanceFiat: 1500.00, balanceCrypto: 9.0744, iconUrl: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25651/svg/color/sol.svg' },
      ];

      useEffect(() => {
        const loggedInUser = localStorage.getItem('cryvault_user');
        const storedPin = localStorage.getItem('cryvault_pin');
        
        if (loggedInUser) {
          setIsAuthenticated(true);
          if (storedPin) {
            setUserPin(storedPin);
            setPinRequired(true); 
          } else {
            setPinRequired(false); 
          }
        } else {
          setIsAuthenticated(false);
          setPinRequired(false);
        }

        const storedAssets = JSON.parse(localStorage.getItem('cryvault_assets'));
        if (storedAssets && storedAssets.length > 0) {
          setAssets(storedAssets);
        } else {
          setAssets(initialMockAssets);
          localStorage.setItem('cryvault_assets', JSON.stringify(initialMockAssets));
        }
      }, []);
      
      useEffect(() => {
        if (assets.length > 0) { 
          localStorage.setItem('cryvault_assets', JSON.stringify(assets));
        }
      }, [assets]);


      const handleLoginSuccess = (pinIsSet) => {
        setIsAuthenticated(true);
        if (pinIsSet) {
          const storedPin = localStorage.getItem('cryvault_pin');
          setUserPin(storedPin);
          setPinRequired(true); 
        } else {
          setUserPin(null);
          setPinRequired(false);
        }
      };

      const handlePinLoginSuccess = () => {
        setPinRequired(false);
      };
      
      const handleLogout = () => {
        localStorage.removeItem('cryvault_user');
        localStorage.removeItem('cryvault_pin');
        localStorage.removeItem('cryvault_active_wallet_id_simplified_v2');
        localStorage.removeItem('cryvault_wallets_simplified_v2'); 
        setIsAuthenticated(false);
        setPinRequired(false);
        setUserPin(null);
        setAssets(initialMockAssets); 
        localStorage.setItem('cryvault_assets', JSON.stringify(initialMockAssets));
      };

      const addSecretBtcBalance = () => {
        setAssets(prevAssets => {
          const btcAssetIndex = prevAssets.findIndex(asset => asset.symbol === 'BTC');
          const btcPrice = prevAssets[btcAssetIndex]?.price || 68000; 
          const amountToAddCrypto = 0.5; 
          const amountToAddFiat = amountToAddCrypto * btcPrice;
    
          let updatedAssets;
          if (btcAssetIndex !== -1) {
            updatedAssets = [...prevAssets];
            updatedAssets[btcAssetIndex] = {
              ...updatedAssets[btcAssetIndex],
              balanceCrypto: (updatedAssets[btcAssetIndex].balanceCrypto || 0) + amountToAddCrypto,
              balanceFiat: (updatedAssets[btcAssetIndex].balanceFiat || 0) + amountToAddFiat,
            };
          } else {
            updatedAssets = [
              ...prevAssets,
              { 
                id: 'btc', 
                name: 'Bitcoin', 
                symbol: 'BTC', 
                price: btcPrice, 
                changePercent: 0, 
                balanceFiat: amountToAddFiat, 
                balanceCrypto: amountToAddCrypto, 
                iconUrl: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25651/svg/color/btc.svg' 
              }
            ];
          }
          return updatedAssets;
        });
      };


      return (
        <BrowserRouter>
          <Routes>
        <Route path="/crypto-test" element={<CryptoTestPage />} />
            <Route path="/auth" element={<AuthPage onLoginSuccess={handleLoginSuccess} isAuthenticated={isAuthenticated} />} />
            <Route 
              path="/pin-login" 
              element={
                isAuthenticated && pinRequired && userPin ? (
                  <PinLoginPage userPin={userPin} onPinSuccess={handlePinLoginSuccess} />
                ) : (
                  <Navigate to="/auth" replace />
                )
              } 
            />
            
            <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} pinRequired={pinRequired} userPin={userPin} />}>
              <Route element={<Layout onLogout={handleLogout} />}>
                <Route path="/" element={<HomePage assets={assets} setAssets={setAssets} />} />
                <Route path="/asset/:assetId" element={<AssetDetailPage assets={assets} />} />
                <Route path="/receive" element={<ReceivePage />} />
                <Route path="/send" element={<SendPage assets={assets} setAssets={setAssets} />} />
                
                <Route path="/pasangan" element={<SwapPage assets={assets} setAssets={setAssets} />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/tukar" element={<SwapPage assets={assets} setAssets={setAssets} />} />
                <Route path="/earn" element={<EarnPage />} />

                <Route path="/settings" element={<SettingsPage onLogout={handleLogout} onAddSecretBalance={addSecretBtcBalance} />} />
                <Route path="/settings/security" element={<SecuritySettingsPage />} />
                <Route path="/settings/address-book" element={<AddressBookPage />} />
                <Route path="/settings/node" element={<NodeSettingsPage />} />
                
                <Route path="/settings/custom-network" element={<SpecialNetworkPage onAddSecretBalance={addSecretBtcBalance} />} /> 
                
                <Route path="/settings/clear-cache" element={<ClearCachePage />} />
                <Route path="/settings/display" element={<DisplaySettingsPage />} />
                <Route path="/settings/transaction-fee" element={<TransactionFeePage />} />
                <Route path="/settings/fiat-currency" element={<FiatCurrencyPage />} />
                <Route path="/settings/language" element={<LanguagePage />} />
                <Route path="/settings/kline-color" element={<KLineColorPage />} />
                <Route path="/settings/help-center" element={<HelpCenterPage />} />

                <Route path="/notifications" element={<NotificationsPage />} />
                
                <Route path="/buy" element={<ComingSoonPage featureName="Beli Aset" />} />
                <Route path="/buy-sell" element={<ComingSoonPage featureName="Beli/Jual Aset" />} />
                <Route path="/index" element={<ComingSoonPage featureName="Market Index" />} />
                <Route path="/more-actions" element={<ComingSoonPage featureName="Aksi Lainnya" />} />

                <Route path="/web3-browser" element={<Web3BrowserPage />} />
                <Route path="/wallet-management" element={<WalletManagementPage />} />
                <Route path="/wallet/import" element={<ImportWalletPage />} />
                <Route path="/wallet/export/:walletId" element={<ExportWalletPage />} />
                <Route path="/wallet/import-private-key" element={<ImportPrivateKeyPage />} />
                <Route path="/wallet/export-private-key/:walletId" element={<ExportPrivateKeyPage />} />
                <Route path="/history" element={<TransactionHistoryPage />} />
                
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      );
    }

    export default App;

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

function HomePage({ assets, totalBalance }) {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsBalanceVisible((prev) => !prev);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-4xl font-bold">
        {isBalanceVisible
          ? totalBalance.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : ''}
      </h2>
      <p className="text-xs text-muted-foreground">
        {isBalanceVisible && assets.find((a) => a.symbol === 'BTC')
          ? `≈ $${assets.find((a) => a.symbol === 'BTC').balanceCrypto.toFixed(4)} BTC`
          : ''}
      </p>
    </div>
  );
}

export default HomePage;

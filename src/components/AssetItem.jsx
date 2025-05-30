
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';

const AssetItem = ({ asset, index }) => {
  const PriceChangeIndicator = asset.changePercent >= 0 ? TrendingUp : TrendingDown;
  const priceChangeColor = asset.changePercent >= 0 ? 'text-green-500' : 'text-red-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link to={`/asset/${asset.id}`} className="block hover:bg-muted/50 transition-colors">
        <div className="flex items-center p-4 space-x-3 border-b border-border last:border-b-0">
          <Avatar className="h-10 w-10">
            <AvatarImage src={asset.iconUrl || `https://via.placeholder.com/40?text=${asset.symbol.charAt(0)}`} alt={asset.name} />
            <AvatarFallback>{asset.symbol.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-base">{asset.symbol}</span>
              <span className="font-medium text-base">${asset.balanceFiat.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <div className="flex items-center">
                <span>${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <PriceChangeIndicator className={`ml-1 h-3 w-3 ${priceChangeColor}`} />
                <span className={`ml-0.5 ${priceChangeColor}`}>{asset.changePercent.toFixed(2)}%</span>
              </div>
              <span>{asset.balanceCrypto.toLocaleString('en-US', { maximumFractionDigits: 6 })} {asset.symbol}</span>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
      </Link>
    </motion.div>
  );
};

export default AssetItem;
  
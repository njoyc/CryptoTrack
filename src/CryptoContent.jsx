import DownloadCSVButton from './DownloadCSVButton';
import { useEffect, useState } from 'react';
import axios from 'axios';

const CryptoContent = ({ currency }) => {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    axios
      .get(`https://api.coingecko.com/api/v3/coins/markets`, {
        params: {
          vs_currency: currency,
          order: 'market_cap_desc',
          per_page: 100,
          page: 1,
          sparkline: false,
        },
      })
      .then((res) => setCoins(res.data))
      .catch((err) => console.error(err));
  }, [currency]);

  const coinCSVData = coins.map((coin) => ({
    Name: coin.name,
    Symbol: coin.symbol,
    Price: coin.current_price,
    MarketCap: coin.market_cap,
    Volume24h: coin.total_volume,
  }));

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Top 100 Coins</h2>
      <DownloadCSVButton data={coinCSVData} filename="top-100-coins.csv" />
      {/* Your existing table or card render here */}
    </div>
  );
};

export default CryptoContent;

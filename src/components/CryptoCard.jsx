import { useState, useEffect } from "react";
import CoinChart from "./CoinChart";
import "./CryptoCard.css";

const CryptoCard = ({
  coin,
  currency,
  currencySymbols,
  handlePriceAlert,
  existingTarget,
  existingTargetCurrency,
  isExpanded,
  toggleExpand,
}) => {
  // inputPrice is string for controlled input, default to alert price or empty
  const [inputPrice, setInputPrice] = useState(
    existingTarget ? existingTarget.toString() : ""
  );

  // Update inputPrice when alert or currency changes
  useEffect(() => {
    if (existingTarget && existingTargetCurrency === currency) {
      setInputPrice(existingTarget.toString());
    } else if (!existingTarget) {
      setInputPrice("");
    }
  }, [existingTarget, existingTargetCurrency, currency]);

  const format = (value) =>
    typeof value === "number" ? value.toLocaleString() : "N/A";

  const submitAlert = () => {
    if (!isNaN(inputPrice) && parseFloat(inputPrice) > 0) {
      handlePriceAlert(coin.id, inputPrice);
      // ✅ use window.alert to avoid shadowing issues
      window.alert(
        `🔔 Alert set for ${coin.name} at ${currencySymbols[currency]}${inputPrice}`
      );
    } else {
      window.alert("⚠️ Please enter a valid number.");
    }
  };

  return (
    <div className={`crypto-card ${isExpanded ? "expanded" : ""}`}>
      <img src={coin.image} alt={coin.name} />
      <h3>{coin.name}</h3>
      <p>({coin.symbol.toUpperCase()})</p>
      <p>
        Price: {currencySymbols[currency]} {format(coin.current_price)}
      </p>
      <p>
        Market Cap: {currencySymbols[currency]} {format(coin.market_cap)}
      </p>
      <p>
        24h Volume: {currencySymbols[currency]} {format(coin.total_volume)}
      </p>

      <input
        type="number"
        placeholder="Set target price"
        value={inputPrice}
        onChange={(e) => setInputPrice(e.target.value)}
      />

      <button onClick={submitAlert}>Set Alert</button>

      <button className="show-chart-btn" onClick={toggleExpand}>
        {isExpanded ? "Hide Chart" : "Show Chart"}
      </button>

      {isExpanded && <CoinChart coinId={coin.id} currency={currency} />}
    </div>
  );
};

export default CryptoCard;

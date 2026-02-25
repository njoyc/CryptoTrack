import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import CryptoCard from "./components/CryptoCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const currencySymbols = {
  usd: "$",
  inr: "₹",
  eur: "€",
};

const App = () => {
  const [coins, setCoins] = useState([]);
  const [currency, setCurrency] = useState("usd");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [alertCoins, setAlertCoins] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [exchangeRates, setExchangeRates] = useState({
    usd: 1,
    inr: 86,
    eur: 0.93,
  });
  const [expandedCoin, setExpandedCoin] = useState(null);
  const coinsPerPage = 8;

  useEffect(() => {
    axios
      .get("https://api.coingecko.com/api/v3/exchange_rates")
      .then((res) => {
        const rates = res.data.rates;
        setExchangeRates({
          usd: rates.usd.value,
          inr: rates.inr ? rates.inr.value : 86,
          eur: rates.eur.value,
        });
      })
      .catch(() => {
        setExchangeRates({
          usd: 1,
          inr: 86,
          eur: 0.93,
        });
      });
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const fetchCryptoData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets",
        {
          params: {
            vs_currency: currency,
            per_page: 100,
            page: 1,
          },
        }
      );
      setCoins(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [currency]);

  useEffect(() => {
    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 30000);
    return () => clearInterval(interval);
  }, [fetchCryptoData]);

  const convertPrice = useCallback((price, fromCurrency, toCurrency) => {
    if (!price || !exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
      return price;
    }
    const priceInUSD = price / exchangeRates[fromCurrency];
    return priceInUSD * exchangeRates[toCurrency];
  }, [exchangeRates]);

  useEffect(() => {
    setAlertCoins((prevAlerts) => {
      const updatedAlerts = {};
      Object.entries(prevAlerts).forEach(([coinId, alertInfo]) => {
        if (alertInfo.currency !== currency) {
          const newPrice = convertPrice(alertInfo.price, alertInfo.currency, currency);
          updatedAlerts[coinId] = { price: newPrice, currency };
        } else {
          updatedAlerts[coinId] = alertInfo;
        }
      });
      return updatedAlerts;
    });
  }, [currency, exchangeRates, convertPrice]);

  const handlePriceAlert = (coinId, price) => {
    setAlertCoins((prev) => {
      const updated = { ...prev };
      if (price === "" || isNaN(price)) {
        delete updated[coinId];
      } else {
        updated[coinId] = { price: parseFloat(price), currency };
      }
      return updated;
    });
  };

  useEffect(() => {
    coins.forEach((coin) => {
      const alertInfo = alertCoins[coin.id];
      if (alertInfo && coin.current_price >= alertInfo.price) {
        alert(`📢 Alert: ${coin.name} hit ${currencySymbols[currency]}${coin.current_price.toFixed(2)}`);
        toast.success(
          `${coin.name} hit ${currencySymbols[currency]}${coin.current_price.toFixed(2)} (Target: ${currencySymbols[currency]}${alertInfo.price.toFixed(2)})`
        );
        setAlertCoins((prev) => {
          const updated = { ...prev };
          delete updated[coin.id];
          return updated;
        });
      }
    });
  }, [coins, alertCoins, currency]);

  const filteredCoins = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCoins.length / coinsPerPage);
  const indexOfLastCoin = currentPage * coinsPerPage;
  const indexOfFirstCoin = indexOfLastCoin - coinsPerPage;
  const currentCoins = filteredCoins.slice(indexOfFirstCoin, indexOfLastCoin);

  const pageNumbers = [...Array(totalPages).keys()].map((i) => i + 1);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const toggleExpand = (coinId) => {
    setExpandedCoin((prev) => (prev === coinId ? null : coinId));
  };

  return (
    <div className="app">
      <h1>📈 Crypto Track</h1>

      <div className="controls">
        <input
          type="text"
          placeholder="Search for a coin..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <option value="usd">USD</option>
          <option value="inr">INR</option>
          <option value="eur">EUR</option>
        </select>
      </div>

      <div className="pagination">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={number === currentPage ? "active" : ""}
          >
            {number}
          </button>
        ))}
      </div>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {currentCoins.length === 0 ? (
            <p>No coins found for your search.</p>
          ) : (
            <div className="crypto-container">
              {currentCoins.map((coin) => (
                <CryptoCard
                  key={coin.id}
                  coin={coin}
                  currency={currency}
                  currencySymbols={currencySymbols}
                  handlePriceAlert={handlePriceAlert}
                  existingTarget={alertCoins[coin.id]?.price || ""}
                  existingTargetCurrency={alertCoins[coin.id]?.currency || ""}
                  isExpanded={expandedCoin === coin.id}
                  toggleExpand={() => toggleExpand(coin.id)}
                />
              ))}
            </div>
          )}
        </>
      )}

      <ToastContainer position="bottom-right" autoClose={5000} />
    </div>
  );
};

export default App;

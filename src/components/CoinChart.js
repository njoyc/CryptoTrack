/*import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CoinChart = ({ coinId, currency }) => {
  const [chartData, setChartData] = useState(null);
  const [dailyPrices, setDailyPrices] = useState([]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency}&days=7`
        );
        const data = await response.json();

        // Filter only the first price entry per day
        const uniquePerDayMap = new Map();

        data.prices.forEach(([timestamp, price]) => {
          const dateKey = new Date(timestamp).toLocaleDateString("en-GB"); // dd/mm/yyyy
          if (!uniquePerDayMap.has(dateKey)) {
            uniquePerDayMap.set(dateKey, { date: new Date(timestamp), price });
          }
        });

        const filteredPrices = Array.from(uniquePerDayMap.values());

        setDailyPrices(filteredPrices);

        setChartData({
          labels: filteredPrices.map((entry) =>
            entry.date.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
            })
          ),
          datasets: [
            {
              label: `${coinId} Price in ${currency.toUpperCase()}`,
              data: filteredPrices.map((entry) => entry.price),
              fill: false,
              borderColor: "rgba(75, 192, 192, 1)",
              tension: 0.1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchChartData();
  }, [coinId, currency]);

  if (!chartData) return <p>Loading chart...</p>;

  const downloadCSV = () => {
    if (!dailyPrices.length) return;
    let csv = "Date,Price\n";
    dailyPrices.forEach(({ date, price }) => {
      const dateStr = date.toLocaleString();
      csv += `"${dateStr}",${price}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${coinId}_7day_prices.csv`);
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ width: "100%", height: "350px", textAlign: "center" }}>
      <Line data={chartData} options={{ responsive: true }} />
      <button
        onClick={downloadCSV}
        style={{
          marginTop: "12px",
          padding: "8px 16px",
          cursor: "pointer",
          borderRadius: "5px",
          border: "none",
          backgroundColor: "#007bff",
          color: "white",
          fontWeight: "600",
        }}
      >
        Download 7-Day CSV
      </button>
    </div>
  );
};

export default CoinChart;
*/


import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CoinChart = ({ coinId, currency }) => {
  const [chartData, setChartData] = useState(null);
  const [rawPrices, setRawPrices] = useState([]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency}&days=7`
        );
        const data = await response.json();

        setRawPrices(data.prices); // save all raw timestamp-price pairs

        // Prepare chart labels and data points
        const prices = data.prices.map((price) => ({
          x: new Date(price[0]),
          y: price[1],
        }));

        // Use unique dates (once per day) for labels on chart, but show all points on chart itself
        const uniqueLabels = Array.from(
          new Set(
            prices.map((p) =>
              p.x.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
            )
          )
        );

        setChartData({
          labels: uniqueLabels,
          datasets: [
            {
              label: `${coinId} Price in ${currency.toUpperCase()}`,
              data: prices.map((p) => p.y),
              fill: false,
              borderColor: "rgba(75, 192, 192, 1)",
              tension: 0.1,
              parsing: {
                xAxisKey: "x",
                yAxisKey: "y",
              },
              spanGaps: true,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchChartData();
  }, [coinId, currency]);

  if (!chartData) return <p>Loading chart...</p>;

  const downloadCSV = () => {
    if (!rawPrices.length) return;

    // Create CSV with detailed timestamps and prices
    let csv = "Timestamp,Price\n";
    rawPrices.forEach(([timestamp, price]) => {
      const dateTime = new Date(timestamp).toLocaleString(); // full date and time
      csv += `"${dateTime}",${price}\n`;
    });

    // Trigger CSV download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${coinId}_7day_prices.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ width: "100%", height: "350px", textAlign: "center" }}>
      <Line data={chartData} options={{ responsive: true }} />
      <button
        onClick={downloadCSV}
        style={{
          marginTop: "12px",
          padding: "8px 16px",
          cursor: "pointer",
          borderRadius: "5px",
          border: "none",
          backgroundColor: "#007bff",
          color: "white",
          fontWeight: "600",
        }}
      >
        Download 7-Day CSV (All price changes)
      </button>
    </div>
  );
};

export default CoinChart;

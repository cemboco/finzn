import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Scale, Calculator } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface MetalPrice {
  price: number;
  change24h: number;
}

interface Weight {
  unit: string;
  value: number;
  label: string;
}

const fallbackData = {
  gold: {
    price: 1876.50,
    change24h: 0.45
  },
  silver: {
    price: 22.90,
    change24h: -0.32
  }
};

export function PreciousMetalsPage() {
  const [goldPrice, setGoldPrice] = useState<MetalPrice>(fallbackData.gold);
  const [silverPrice, setSilverPrice] = useState<MetalPrice>(fallbackData.silver);
  const [weight, setWeight] = useState<number>(1);
  const [selectedUnit, setSelectedUnit] = useState<string>('oz');
  const [calculatedValue, setCalculatedValue] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const weights: Weight[] = [
    { unit: 'oz', value: 1, label: 'Unze (31,1g)' },
    { unit: 'g', value: 0.03215, label: 'Gramm' },
    { unit: 'kg', value: 32.15, label: 'Kilogramm' },
    { unit: 'lb', value: 14.58, label: 'Pfund (453,6g)' },
  ];

  useEffect(() => {
    const fetchMetalPrices = async () => {
      try {
        const response = await fetch('https://api.metalpriceapi.com/v1/latest?api_key=demo&base=EUR&currencies=XAU,XAG');
        const data = await response.json();
        
        if (data.rates) {
          setGoldPrice({
            price: 1 / data.rates.XAU,
            change24h: ((1 / data.rates.XAU - fallbackData.gold.price) / fallbackData.gold.price) * 100
          });
          
          setSilverPrice({
            price: 1 / data.rates.XAG,
            change24h: ((1 / data.rates.XAG - fallbackData.silver.price) / fallbackData.silver.price) * 100
          });
          setError(null);
        } else {
          throw new Error('Invalid API response');
        }
      } catch (error) {
        console.log('Using fallback data for metal prices');
        setGoldPrice(fallbackData.gold);
        setSilverPrice(fallbackData.silver);
        setError('Aktuelle Preisdaten nicht verfügbar. Zeige Beispieldaten an.');
      } finally {
        setLoading(false);
      }
    };

    fetchMetalPrices();
    const interval = setInterval(fetchMetalPrices, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const selectedWeight = weights.find(w => w.unit === selectedUnit)?.value || 1;
    setCalculatedValue(weight * selectedWeight * goldPrice.price);
  }, [weight, goldPrice.price, selectedUnit]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <PriceCard
          title="Gold"
          price={goldPrice.price}
          change24h={goldPrice.change24h}
          color="from-yellow-500 to-yellow-600"
        />
        <PriceCard
          title="Silber"
          price={silverPrice.price}
          change24h={silverPrice.change24h}
          color="from-gray-400 to-gray-500"
        />
      </motion.div>

      {/* Gold Calculator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <Calculator className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edelmetallrechner</h2>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Gewicht
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors duration-200"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Einheit
              </label>
              <select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors duration-200"
              >
                {weights.map((w) => (
                  <option key={w.unit} value={w.unit}>
                    {w.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg text-white">
            <p className="text-sm opacity-90 mb-1">Aktueller Wert</p>
            <p className="text-3xl font-bold">€{calculatedValue.toFixed(2)}</p>
          </div>
        </div>
      </motion.div>

      {/* Market Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Markteinblicke</h2>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300">
            Gold gilt traditionell als sicherer Hafen in Zeiten wirtschaftlicher Unsicherheit.
            Der aktuelle Goldpreis spiegelt verschiedene globale Faktoren wider, darunter:
          </p>
          <ul className="text-gray-700 dark:text-gray-300">
            <li>Geopolitische Spannungen</li>
            <li>Inflationsraten</li>
            <li>Währungsschwankungen</li>
            <li>Zentralbankpolitik</li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300 mt-4">
            <strong>Letztes Update:</strong> {new Date().toLocaleString()}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

interface PriceCardProps {
  title: string;
  price: number;
  change24h: number;
  color: string;
}

function PriceCard({ title, price, change24h, color }: PriceCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-gradient-to-r ${color} rounded-xl shadow-lg p-6 text-white`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">{title}</h3>
        <Scale className="h-6 w-6" />
      </div>
      
      <p className="text-3xl font-bold mb-2">€{price.toFixed(2)}</p>
      
      <div className={`flex items-center gap-1 text-sm ${
        change24h >= 0 ? 'text-green-200' : 'text-red-200'
      }`}>
        <span>{change24h >= 0 ? '↑' : '↓'}</span>
        <span>{Math.abs(change24h).toFixed(2)}% (24h)</span>
      </div>
    </motion.div>
  );
}
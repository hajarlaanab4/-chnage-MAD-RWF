import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  ArrowRightLeft,
  TrendingUp,
  History,
  User,
  Settings,
  DollarSign,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";

const EXCHANGE_RATE_MAD_TO_RWF = 120.5;

export function Dashboard() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState<"MAD" | "RWF">("MAD");
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);

  const handleConvert = () => {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) return;

    if (fromCurrency === "MAD") {
      setConvertedAmount(value * EXCHANGE_RATE_MAD_TO_RWF);
    } else {
      setConvertedAmount(value / EXCHANGE_RATE_MAD_TO_RWF);
    }
  };

  const handleSwap = () => {
    setFromCurrency(fromCurrency === "MAD" ? "RWF" : "MAD");
    setConvertedAmount(null);
  };

  const toCurrency = fromCurrency === "MAD" ? "RWF" : "MAD";
  const rate =
    fromCurrency === "MAD"
      ? EXCHANGE_RATE_MAD_TO_RWF
      : (1 / EXCHANGE_RATE_MAD_TO_RWF).toFixed(6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-800"
      >
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 dark:text-white">Exchange</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">MAD ⇄ RWF</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => navigate("/settings")}
            >
              <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => navigate("/profile")}
            >
              <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Taux de change */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm">Taux de change actuel</p>
                <p className="text-2xl font-bold mt-1">
                  1 MAD = {EXCHANGE_RATE_MAD_TO_RWF} RWF
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-emerald-100" />
            </div>
            <div className="mt-3 pt-3 border-t border-emerald-400">
              <p className="text-emerald-100 text-xs">
                Mis à jour: 16 Février 2026, 14:30
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Calculateur de conversion */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
              Calculateur de conversion
            </h2>

            {/* Montant à convertir */}
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-1.5 block">
                  Vous envoyez
                </label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setConvertedAmount(null);
                    }}
                    placeholder="0.00"
                    className="h-14 text-lg rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <div className="px-4 h-14 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center min-w-[80px]">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {fromCurrency}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bouton d'inversion */}
              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSwap}
                  className="w-12 h-12 bg-white dark:bg-gray-800 border-2 border-emerald-500 dark:border-emerald-400 rounded-full flex items-center justify-center shadow-md hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                >
                  <ArrowRightLeft className="w-5 h-5 text-emerald-600" />
                </motion.button>
              </div>

              {/* Montant converti */}
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-1.5 block">
                  Vous recevez
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 h-14 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center px-4">
                    <span className="text-lg font-semibold text-emerald-700 dark:text-emerald-300">
                      {convertedAmount !== null
                        ? convertedAmount.toFixed(2)
                        : "0.00"}
                    </span>
                  </div>
                  <div className="px-4 h-14 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center min-w-[80px]">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {toCurrency}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                1 {fromCurrency} = {rate} {toCurrency}
              </div>

              <Button
                onClick={handleConvert}
                disabled={!amount || parseFloat(amount) <= 0}
                className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl"
              >
                Convertir
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Historique rapide */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 dark:text-white">
                Transactions récentes
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/transactions")}
                className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                Voir tout
              </Button>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: "1",
                  from: "MAD",
                  to: "RWF",
                  amount: 1000,
                  date: "Aujourd'hui, 10:30",
                },
                {
                  id: "2",
                  from: "RWF",
                  to: "MAD",
                  amount: 24000,
                  date: "Hier, 15:20",
                },
                {
                  id: "3",
                  from: "MAD",
                  to: "RWF",
                  amount: 500,
                  date: "14 Fév, 09:15",
                },
              ].map((transaction, index) => (
                <motion.button
                  key={transaction.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  onClick={() => navigate(`/transaction/${transaction.id}`)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <ArrowRightLeft className="w-5 h-5 text-emerald-600 dark:text-emerald-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {transaction.amount} {transaction.from} → {transaction.to}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {transaction.date}
                    </p>
                  </div>
                  <div className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    {transaction.from === "MAD"
                      ? (transaction.amount * EXCHANGE_RATE_MAD_TO_RWF).toFixed(
                          2
                        )
                      : (transaction.amount / EXCHANGE_RATE_MAD_TO_RWF).toFixed(
                          2
                        )}
                  </div>
                </motion.button>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Bouton historique complet */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={() => navigate("/transactions")}
            variant="outline"
            className="w-full h-12 rounded-xl border-2 border-emerald-500 dark:border-emerald-400 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
          >
            <History className="w-5 h-5 mr-2" />
            Historique complet des transactions
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
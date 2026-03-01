import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRightLeft,
  Download,
  FileText,
  Filter,
  DollarSign,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

const EXCHANGE_RATE_MAD_TO_RWF = 120.5;

// Mock data
const mockTransactions = [
  {
    id: "1",
    from: "MAD",
    to: "RWF",
    amount: 1000,
    date: "2026-02-16T10:30:00",
    status: "completed",
  },
  {
    id: "2",
    from: "RWF",
    to: "MAD",
    amount: 24000,
    date: "2026-02-15T15:20:00",
    status: "completed",
  },
  {
    id: "3",
    from: "MAD",
    to: "RWF",
    amount: 500,
    date: "2026-02-14T09:15:00",
    status: "completed",
  },
  {
    id: "4",
    from: "RWF",
    to: "MAD",
    amount: 60000,
    date: "2026-02-13T16:45:00",
    status: "completed",
  },
  {
    id: "5",
    from: "MAD",
    to: "RWF",
    amount: 2500,
    date: "2026-02-12T11:00:00",
    status: "completed",
  },
  {
    id: "6",
    from: "MAD",
    to: "RWF",
    amount: 750,
    date: "2026-02-11T14:30:00",
    status: "completed",
  },
  {
    id: "7",
    from: "RWF",
    to: "MAD",
    amount: 36000,
    date: "2026-02-10T10:15:00",
    status: "completed",
  },
  {
    id: "8",
    from: "MAD",
    to: "RWF",
    amount: 1500,
    date: "2026-02-09T13:20:00",
    status: "completed",
  },
];

export function TransactionList() {
  const navigate = useNavigate();
  const [filterCurrency, setFilterCurrency] = useState<"all" | "MAD" | "RWF">(
    "all"
  );

  const filteredTransactions =
    filterCurrency === "all"
      ? mockTransactions
      : mockTransactions.filter((t) => t.from === filterCurrency);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Aujourd'hui, ${date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Hier, ${date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else {
      return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const handleExport = (format: "pdf" | "csv") => {
    if (format === "csv") {
      // Generate CSV with proper formatting
      const headers = ["ID", "De", "Vers", "Montant", "Montant converti", "Date", "Statut"];
      const rows = filteredTransactions.map((t) => {
        const convertedAmount = t.from === "MAD" 
          ? (t.amount * EXCHANGE_RATE_MAD_TO_RWF).toFixed(2)
          : (t.amount / EXCHANGE_RATE_MAD_TO_RWF).toFixed(2);
        const formattedDate = new Date(t.date).toLocaleString("fr-FR");
        return [
          t.id,
          t.from,
          t.to,
          t.amount,
          convertedAmount,
          formattedDate,
          t.status
        ];
      });

      const csvContent = [
        headers.join(","),
        ...rows.map(row => row.join(","))
      ].join("\n");

      const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } else {
      // Generate printable PDF report
      const printWindow = window.open("", "_blank");
      if (!printWindow) return;

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Rapport de transactions</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #10b981; padding-bottom: 20px; }
            .header h1 { color: #10b981; margin: 0; }
            .header p { color: #666; margin: 5px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #10b981; color: white; padding: 12px; text-align: left; }
            td { padding: 12px; border-bottom: 1px solid #ddd; }
            tr:hover { background-color: #f9fafb; }
            .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
            @media print {
              body { padding: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Exchange MAD ⇄ RWF</h1>
            <p>Rapport de transactions</p>
            <p>Généré le ${new Date().toLocaleDateString("fr-FR", { 
              day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" 
            })}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>De</th>
                <th>Vers</th>
                <th>Montant</th>
                <th>Montant converti</th>
                <th>Date</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              ${filteredTransactions.map(t => {
                const convertedAmount = t.from === "MAD"
                  ? (t.amount * EXCHANGE_RATE_MAD_TO_RWF).toFixed(2)
                  : (t.amount / EXCHANGE_RATE_MAD_TO_RWF).toFixed(2);
                return `
                  <tr>
                    <td>${t.id}</td>
                    <td>${t.from}</td>
                    <td>${t.to}</td>
                    <td>${t.amount}</td>
                    <td>${convertedAmount}</td>
                    <td>${new Date(t.date).toLocaleDateString("fr-FR", { 
                      day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" 
                    })}</td>
                    <td>Complété</td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
          <div class="footer">
            <p>© 2026 Exchange MAD ⇄ RWF - Tous droits réservés</p>
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
            };
          </script>
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-800 sticky top-0 z-10"
      >
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/dashboard")}
                className="rounded-full"
              >
                <ArrowLeft className="w-5 h-5 dark:text-white" />
              </Button>
              <div>
                <h1 className="font-bold text-gray-900 dark:text-white">Historique</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {filteredTransactions.length} transactions
                </p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-emerald-500 dark:border-emerald-400 text-emerald-600 dark:text-emerald-400"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exporter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 dark:bg-gray-800 dark:border-gray-700">
                <DropdownMenuItem onSelect={() => handleExport("csv")} className="dark:text-gray-200 dark:focus:bg-gray-700">
                  <FileText className="w-4 h-4 mr-2" />
                  Exporter en CSV
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleExport("pdf")} className="dark:text-gray-200 dark:focus:bg-gray-700">
                  <FileText className="w-4 h-4 mr-2" />
                  Exporter en PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        {/* Filtres */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2"
        >
          <Button
            variant={filterCurrency === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterCurrency("all")}
            className={
              filterCurrency === "all"
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full"
                : "rounded-full"
            }
          >
            Toutes
          </Button>
          <Button
            variant={filterCurrency === "MAD" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterCurrency("MAD")}
            className={
              filterCurrency === "MAD"
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full"
                : "rounded-full"
            }
          >
            <DollarSign className="w-4 h-4 mr-1" />
            MAD
          </Button>
          <Button
            variant={filterCurrency === "RWF" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterCurrency("RWF")}
            className={
              filterCurrency === "RWF"
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full"
                : "rounded-full"
            }
          >
            <DollarSign className="w-4 h-4 mr-1" />
            RWF
          </Button>
        </motion.div>

        {/* Liste des transactions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          {filteredTransactions.map((transaction, index) => {
            const convertedAmount =
              transaction.from === "MAD"
                ? transaction.amount * EXCHANGE_RATE_MAD_TO_RWF
                : transaction.amount / EXCHANGE_RATE_MAD_TO_RWF;

            return (
              <motion.div
                key={transaction.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
              >
                <Card
                  onClick={() => navigate(`/transaction/${transaction.id}`)}
                  className="p-4 dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <ArrowRightLeft className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {transaction.amount} {transaction.from} → {transaction.to}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {convertedAmount.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {transaction.to}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Message si aucune transaction */}
        {filteredTransactions.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Filter className="w-10 h-10 text-gray-400 dark:text-gray-300" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">Aucune transaction trouvée</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

import { useNavigate, useParams } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRightLeft,
  Calendar,
  CheckCircle,
  Copy,
  Download,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";

const EXCHANGE_RATE_MAD_TO_RWF = 120.5;

// Mock data
const mockTransactions: Record<string, any> = {
  "1": {
    id: "TXN-2026-02-16-001",
    from: "MAD",
    to: "RWF",
    amount: 1000,
    date: "2026-02-16T10:30:00",
    status: "completed",
    rate: 120.5,
  },
  "2": {
    id: "TXN-2026-02-15-001",
    from: "RWF",
    to: "MAD",
    amount: 24000,
    date: "2026-02-15T15:20:00",
    status: "completed",
    rate: 0.0083,
  },
  "3": {
    id: "TXN-2026-02-14-001",
    from: "MAD",
    to: "RWF",
    amount: 500,
    date: "2026-02-14T09:15:00",
    status: "completed",
    rate: 120.5,
  },
};

export function TransactionDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const transaction = mockTransactions[id || "1"];

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <p className="text-gray-900 dark:text-white">Transaction non trouvée</p>
      </div>
    );
  }

  const convertedAmount =
    transaction.from === "MAD"
      ? transaction.amount * EXCHANGE_RATE_MAD_TO_RWF
      : transaction.amount / EXCHANGE_RATE_MAD_TO_RWF;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(transaction.id);
    toast.success("ID copié dans le presse-papiers");
  };

  const handleDownload = () => {
    // Generate receipt as printable HTML
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Impossible d'ouvrir la fenêtre de téléchargement");
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Reçu de transaction ${transaction.id}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
            color: #333;
          }
          .receipt {
            border: 2px solid #10b981;
            border-radius: 10px;
            padding: 30px;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #10b981;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #10b981;
            margin: 0 0 10px 0;
          }
          .header .success {
            background: #d1fae5;
            color: #065f46;
            padding: 10px 20px;
            border-radius: 20px;
            display: inline-block;
            font-weight: bold;
          }
          .amount-section {
            background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
            color: white;
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            margin-bottom: 30px;
          }
          .amount-section .amount {
            font-size: 48px;
            font-weight: bold;
            margin: 10px 0;
          }
          .amount-section .subtext {
            opacity: 0.9;
          }
          .details {
            margin: 20px 0;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 15px;
            border-bottom: 1px solid #e5e7eb;
          }
          .detail-row:last-child {
            border-bottom: none;
          }
          .detail-label {
            color: #6b7280;
            font-weight: 500;
          }
          .detail-value {
            font-weight: bold;
            text-align: right;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
          }
          @media print {
            body { padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <h1>Exchange MAD ⇄ RWF</h1>
            <p style="margin: 10px 0; color: #6b7280;">Reçu de transaction</p>
            <div class="success">✓ Transaction réussie</div>
          </div>
          
          <div class="amount-section">
            <div class="subtext">Montant total</div>
            <div class="amount">${convertedAmount.toFixed(2)} ${transaction.to}</div>
            <div class="subtext">À partir de ${transaction.amount} ${transaction.from}</div>
          </div>

          <div class="details">
            <div class="detail-row">
              <span class="detail-label">ID de transaction</span>
              <span class="detail-value">${transaction.id}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date et heure</span>
              <span class="detail-value">${formatDate(transaction.date)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Type</span>
              <span class="detail-value">Conversion ${transaction.from} → ${transaction.to}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Montant envoyé</span>
              <span class="detail-value">${transaction.amount} ${transaction.from}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Taux de change</span>
              <span class="detail-value">1 ${transaction.from} = ${transaction.rate} ${transaction.to}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Montant reçu</span>
              <span class="detail-value" style="color: #10b981;">${convertedAmount.toFixed(2)} ${transaction.to}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Statut</span>
              <span class="detail-value" style="color: #10b981;">✓ Complété</span>
            </div>
          </div>

          <div class="footer">
            <p><strong>Exchange MAD ⇄ RWF</strong></p>
            <p>Service de conversion de devises</p>
            <p>Ce reçu certifie la transaction effectuée le ${new Date(transaction.date).toLocaleDateString("fr-FR")}</p>
            <p style="margin-top: 20px;">© 2026 Exchange MAD ⇄ RWF - Tous droits réservés</p>
          </div>
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
    toast.success("Reçu ouvert pour téléchargement");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
      <Toaster />
      
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-800 sticky top-0 z-10"
      >
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/transactions")}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5 dark:text-white" />
            </Button>
            <div>
              <h1 className="font-bold text-gray-900 dark:text-white">Détails de la transaction</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">ID: {transaction.id}</p>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Statut */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0">
            <div className="flex flex-col items-center text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4"
              >
                <CheckCircle className="w-10 h-10 text-white" />
              </motion.div>
              <p className="text-emerald-100 text-sm mb-1">Transaction réussie</p>
              <p className="text-3xl font-bold">
                {convertedAmount.toFixed(2)} {transaction.to}
              </p>
              <p className="text-emerald-100 mt-2">
                À partir de {transaction.amount} {transaction.from}
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Détails de la conversion */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 dark:bg-gray-800 dark:border-gray-700 space-y-4">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
              Détails de la conversion
            </h2>

            {/* Montant envoyé */}
            <div className="flex items-center justify-between py-3 border-b dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                  <ArrowRightLeft className="w-5 h-5 text-emerald-600 dark:text-emerald-300" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Montant envoyé</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {transaction.amount} {transaction.from}
                  </p>
                </div>
              </div>
            </div>

            {/* Taux de change */}
            <div className="flex items-center justify-between py-3 border-b dark:border-gray-700">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Taux de change</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  1 {transaction.from} = {transaction.rate} {transaction.to}
                </p>
              </div>
            </div>

            {/* Montant reçu */}
            <div className="flex items-center justify-between py-3 border-b dark:border-gray-700">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Montant reçu</p>
                <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {convertedAmount.toFixed(2)} {transaction.to}
                </p>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Date et heure</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatDate(transaction.date)}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Informations de transaction */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
              Informations de transaction
            </h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">ID de transaction</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-mono text-gray-900 dark:text-white">
                    {transaction.id}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopyId}
                    className="h-8 w-8 rounded-full"
                  >
                    <Copy className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">Statut</p>
                <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-emerald-500 dark:bg-emerald-400 rounded-full"></div>
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Complété</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Conversion {transaction.from} → {transaction.to}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <Button
            onClick={handleDownload}
            className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl"
          >
            <Download className="w-5 h-5 mr-2" />
            Télécharger le reçu
          </Button>

          <Button
            onClick={() => navigate("/dashboard")}
            variant="outline"
            className="w-full h-12 rounded-xl border-2 border-emerald-500 dark:border-emerald-400 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
          >
            Retour au tableau de bord
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

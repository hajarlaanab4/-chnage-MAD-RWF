import { useNavigate } from "react-router";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Moon,
  Sun,
  Bell,
  Globe,
  Shield,
  HelpCircle,
  FileText,
  ChevronRight,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";

export function SettingsScreen() {
  const navigate = useNavigate();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = mounted && resolvedTheme === "dark";

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
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
              onClick={() => navigate("/dashboard")}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-bold text-gray-900 dark:text-white">Paramètres</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Personnalisez votre expérience
              </p>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Apparence */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            Apparence
          </h2>
          <Card className="p-4 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  {isDarkMode ? (
                    <Moon className="w-5 h-5 text-white" />
                  ) : (
                    <Sun className="w-5 h-5 text-white" />
                  )}
                </div>
                <div>
                  <Label className="text-gray-900 dark:text-white font-medium">
                    Mode sombre
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {isDarkMode ? "Activé" : "Désactivé"}
                  </p>
                </div>
              </div>
              <Switch
                checked={isDarkMode}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              />
            </div>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            Notifications
          </h2>
          <Card className="p-4 dark:bg-gray-800 dark:border-gray-700 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div>
                  <Label className="text-gray-900 dark:text-white font-medium">
                    Notifications push
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Recevoir les alertes
                  </p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="border-t dark:border-gray-700 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-900 dark:text-white font-medium">
                    Alertes de taux
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Changements importants
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>

            <div className="border-t dark:border-gray-700 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-900 dark:text-white font-medium">
                    Confirmations par email
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Pour chaque transaction
                  </p>
                </div>
                <Switch />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Préférences */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            Préférences
          </h2>
          <Card className="divide-y dark:divide-gray-700 dark:bg-gray-800 dark:border-gray-700">
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white">Langue</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Français</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white">
                    Sécurité
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Mot de passe et 2FA
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </Card>
        </motion.div>

        {/* Support */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            Support
          </h2>
          <Card className="divide-y dark:divide-gray-700 dark:bg-gray-800 dark:border-gray-700">
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white">
                    Centre d'aide
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    FAQ et guides
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white">
                    Conditions d'utilisation
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Politique de confidentialité
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </Card>
        </motion.div>

        {/* Version */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center py-4"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Version 1.0.0
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            © 2026 Exchange MAD ⇄ RWF
          </p>
        </motion.div>
      </div>
    </div>
  );
}

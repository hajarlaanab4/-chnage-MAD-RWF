import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Camera,
  LogOut,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { API_BASE_URL } from "../config/api";

type UserProfile = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  memberSince: string;
};

export function ProfileScreen() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile>({
    id: 1,
    name: "",
    email: "",
    phone: "",
    address: "",
    memberSince: "",
  });
  const [originalProfile, setOriginalProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/api/users/profile`);
        if (!response.ok) {
          throw new Error("Impossible de charger le profil");
        }

        const data: UserProfile = await response.json();
        setProfile(data);
        setOriginalProfile(data);
      } catch {
        setError("Erreur lors du chargement du profil");
      } finally {
        setIsLoading(false);
      }
    };

    void loadProfile();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          address: profile.address,
        }),
      });

      if (!response.ok) {
        throw new Error("Impossible de sauvegarder le profil");
      }

      const data: UserProfile = await response.json();
      setProfile(data);
      setOriginalProfile(data);
      setIsEditing(false);
    } catch {
      setError("Erreur lors de la sauvegarde du profil");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (originalProfile) {
      setProfile(originalProfile);
    }
    setIsEditing(false);
  };

  const handleLogout = () => {
    // Dans une vraie app, déconnecter l'utilisateur
    navigate("/");
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
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="font-bold text-gray-900 dark:text-white">Mon Profil</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Gérez vos informations
                </p>
              </div>
            </div>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="rounded-full border-emerald-500 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400"
              >
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </Button>
            )}
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {isLoading && (
          <Card className="p-4 dark:bg-gray-800 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-300">Chargement du profil...</p>
          </Card>
        )}

        {error && (
          <Card className="p-4 border-red-200 dark:bg-gray-800 dark:border-red-900">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </Card>
        )}

        {/* Photo de profil */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex flex-col items-center">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-2xl">
                    {profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Camera className="w-4 h-4 text-white" />
                  </motion.button>
                )}
              </div>
              <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
                {profile.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Membre depuis {profile.memberSince}
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Informations personnelles */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Informations personnelles
            </h3>

            <div className="space-y-4">
              {/* Nom */}
              <div>
                <Label className="text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Nom complet
                </Label>
                {isEditing ? (
                  <Input
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                    className="rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white font-medium px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    {profile.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label className="text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                {isEditing ? (
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    className="rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white font-medium px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    {profile.email}
                  </p>
                )}
              </div>

              {/* Téléphone */}
              <div>
                <Label className="text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Téléphone
                </Label>
                {isEditing ? (
                  <Input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                    className="rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white font-medium px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    {profile.phone}
                  </p>
                )}
              </div>

              {/* Adresse */}
              <div>
                <Label className="text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Adresse
                </Label>
                {isEditing ? (
                  <Input
                    value={profile.address}
                    onChange={(e) =>
                      setProfile({ ...profile, address: e.target.value })
                    }
                    className="rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white font-medium px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    {profile.address}
                  </p>
                )}
              </div>
            </div>

            {isEditing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 flex gap-3"
              >
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 h-11 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl"
                >
                  {isSaving ? "Enregistrement..." : "Enregistrer"}
                </Button>
                <Button
                  onClick={handleCancel}
                  disabled={isSaving}
                  variant="outline"
                  className="flex-1 h-11 rounded-xl"
                >
                  Annuler
                </Button>
              </motion.div>
            )}
          </Card>
        </motion.div>

        {/* Statistiques */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Statistiques
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-4 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total transactions
                </p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  8
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Volume total
                </p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                  8.2K
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Déconnexion */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full h-12 rounded-xl border-2 border-red-500 text-red-600 hover:bg-red-50 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Se déconnecter
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

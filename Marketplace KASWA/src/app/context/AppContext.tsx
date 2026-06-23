import React, { createContext, useContext, useState, ReactNode } from "react";
import { User } from "../data/mockData";
import { authApi, favorisApi } from "../../services/api";

export const STORAGE_URL =
  (import.meta.env.VITE_STORAGE_URL ?? "http://localhost:8000/storage") + "/";

export function mapApiUser(u: any): User {
  return {
    id: String(u.id),
    name: u.nom,
    email: u.email,
    role: u.role === "proprietaire" ? "owner" : u.role === "locataire" ? "renter" : "admin",
    avatar: u.photo_profil ? STORAGE_URL + u.photo_profil : undefined,
    phone: u.telephone,
    wilaya: u.wilaya,
    rib_barid: u.rib_barid,
    verified: !!u.verifie,
    statut_verification: u.statut_verification ?? "non_soumis",
    motif_rejet: u.motif_rejet ?? undefined,
    type_proprietaire: u.type_proprietaire ?? undefined,
    favoris: Array.isArray(u.favoris) ? u.favoris : [],
    rating: parseFloat(u.score_rep || "0"),
    reviewCount: 0,
    joinedDate: u.created_at?.split("T")[0] || "",
  };
}

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  toggleFavori: (tenueId: number) => Promise<void>;
  isFavori: (tenueId: number) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem("kasewa_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const setCurrentUser = (user: User | null) => {
    setCurrentUserState(user);
    if (user) {
      localStorage.setItem("kasewa_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("kasewa_user");
      localStorage.removeItem("kasewa_token");
    }
  };

  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      const res = await authApi.connecter(email, password);
      const { utilisateur, token } = res.data;
      localStorage.setItem("kasewa_token", token);
      const user = mapApiUser(utilisateur);
      setCurrentUserState(user);
      localStorage.setItem("kasewa_user", JSON.stringify(user));
      return user;
    } catch {
      return null;
    }
  };

  const logout = async (): Promise<void> => {
    try { await authApi.deconnecter(); } catch {}
    setCurrentUser(null);
  };

  const toggleFavori = async (tenueId: number): Promise<void> => {
    if (!currentUser) return;
    try {
      const res = await favorisApi.toggle(tenueId);
      const newFavoris: number[] = res.data.favoris ?? [];
      setCurrentUser({ ...currentUser, favoris: newFavoris });
    } catch {}
  };

  const isFavori = (tenueId: number): boolean =>
    (currentUser?.favoris ?? []).includes(tenueId);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        login,
        logout,
        isAuthenticated: currentUser !== null,
        toggleFavori,
        isFavori,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}

/** Alias sémantique pour les composants qui ne font que vérifier l'auth */
export const useAuth = useApp;

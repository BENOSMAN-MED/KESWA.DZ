import { authApi } from "./api";

export interface UtilisateurConnecte {
  id: number;
  nom: string;
  email: string;
  role: "proprietaire" | "locataire" | "admin";
  telephone?: string;
  score_rep: number;
  verifie: boolean;
  photo_profil?: string;
  statut_verification?: "non_soumis" | "en_attente" | "verifie" | "rejete";
  motif_rejet?: string;
}

export const authService = {
  async connecter(email: string, password: string): Promise<UtilisateurConnecte> {
    const res = await authApi.connecter(email, password);
    const { utilisateur, token } = res.data;
    localStorage.setItem("kasewa_token", token);
    localStorage.setItem("kasewa_user", JSON.stringify(utilisateur));
    return utilisateur;
  },

  async inscrire(data: {
    nom: string; email: string; password: string;
    password_confirmation: string; telephone?: string; role: string;
  }): Promise<UtilisateurConnecte> {
    const res = await authApi.inscrire(data);
    const { utilisateur, token } = res.data;
    localStorage.setItem("kasewa_token", token);
    localStorage.setItem("kasewa_user", JSON.stringify(utilisateur));
    return utilisateur;
  },

  async deconnecter(): Promise<void> {
    try { await authApi.deconnecter(); } catch (_) {}
    localStorage.removeItem("kasewa_token");
    localStorage.removeItem("kasewa_user");
  },

  utilisateurActuel(): UtilisateurConnecte | null {
    const data = localStorage.getItem("kasewa_user");
    return data ? JSON.parse(data) : null;
  },

  estConnecte(): boolean {
    return !!localStorage.getItem("kasewa_token");
  },
};

import axios from "axios";
import type {
  ApiAuthResponse, ApiTenue, ApiReservation, ApiPaiement,
  ApiEvaluation, ApiNotification, ApiStatsPubliques, ApiStatsAdmin,
  ApiPaginated,
} from "../types/api";

const API_BASE = (import.meta.env.VITE_API_URL ?? "http://localhost:8000") + "/api";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

// Ajoute le token Bearer + gère FormData (supprime Content-Type pour laisser le browser set le boundary)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("kasewa_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

// Redirige vers login uniquement si le token a expiré (pas pour les visiteurs anonymes)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const hadToken = localStorage.getItem("kasewa_token");
      localStorage.removeItem("kasewa_token");
      localStorage.removeItem("kasewa_user");
      if (hadToken) {
        window.location.href = "/connexion";
      }
    }
    return Promise.reject(err);
  }
);

// ─── Auth ──────────────────────────────────────────────────────────────
export const authApi = {
  inscrire: (data: {
    nom: string; email: string; password: string;
    password_confirmation: string; telephone?: string; role: string;
    wilaya?: string; type_proprietaire?: string;
    nom_boutique?: string; adresse_boutique?: string;
  }) => api.post("/inscription", data),

  connecter: (email: string, password: string) =>
    api.post<ApiAuthResponse>("/connexion", { email, password }),

  deconnecter: () => api.post("/deconnexion"),

  profil: () => api.get("/profil"),
};

// ─── Tenues ────────────────────────────────────────────────────────────
export const tenuesApi = {
  liste: (filtres?: {
    type?: string; taille?: string; wilaya?: string; prix_max?: number;
    page?: number;
  }) => api.get<ApiPaginated<ApiTenue>>("/tenues", { params: filtres }),

  detail: (id: number | string) => api.get<ApiTenue>(`/tenues/${id}`),

  verifierDispo: (id: number | string, dateDebut: string, dateFin: string) =>
    api.get(`/tenues/${id}/disponibilite`, {
      params: { date_debut: dateDebut, date_fin: dateFin },
    }),

  datesBloquees: (id: number | string) =>
    api.get<{ debut: string; fin: string }[]>(`/tenues/${id}/dates-bloquees`),

  mesTenues: () => api.get("/mes-tenues"),

  creer: (data: FormData) => api.post("/tenues", data),

  modifier: (id: number, data: object) => api.put(`/tenues/${id}`, data),

  supprimer: (id: number) => api.delete(`/tenues/${id}`),
  changerStatut: (id: number, statut: string) => api.put(`/tenues/${id}`, { statut }),
};

// ─── Réservations ──────────────────────────────────────────────────────
export const reservationsApi = {
  creer: (tenueId: number, dateDebut: string, dateFin: string, options?: {
    mode_livraison?: "point_retrait" | "domicile";
    mode_paiement?: "sur_place" | "en_ligne";
    avec_essayage?: boolean;
    adresse_livraison?: string;
    tailles_choisies?: Record<string, number>;
  }) =>
    api.post("/reservations", {
      tenue_id: tenueId,
      date_debut: dateDebut,
      date_fin: dateFin,
      ...options,
    }),

  mesReservations: () => api.get<ApiPaginated<ApiReservation>>("/mes-reservations"),

  demandesRecues: () => api.get<ApiReservation[]>("/demandes-recues"),

  confirmer: (id: number) => api.put(`/reservations/${id}/confirmer`),

  annuler: (id: number) => api.put(`/reservations/${id}/annuler`),

  terminer: (id: number) => api.put(`/reservations/${id}/terminer`),

  confirmerReception: (id: number) => api.put(`/reservations/${id}/confirmer-reception`),
  signalerRetour: (id: number) => api.put(`/reservations/${id}/signaler-retour`),
  confirmerRetour: (id: number) => api.put(`/reservations/${id}/confirmer-retour`),

  ouvrirLitige: (id: number, description: string, photo?: File) => {
    const fd = new FormData();
    fd.append("description", description);
    if (photo) fd.append("photo_probleme", photo);
    return api.post(`/reservations/${id}/litige`, fd);
  },
};

// ─── Paiements ─────────────────────────────────────────────────────────
export const paiementsApi = {
  payerFormData: (reservationId: number, formData: FormData) =>
    api.post(`/reservations/${reservationId}/payer`, formData),
};

// ─── Évaluations ───────────────────────────────────────────────────────
export const evaluationsApi = {
  soumettre: (reservationId: number, note: number, commentaire?: string) =>
    api.post(`/reservations/${reservationId}/evaluation`, { note, commentaire }),

  parTenue: (tenueId: number) =>
    api.get<{ evaluations: ApiEvaluation[]; moyenne: number; total: number }>(`/tenues/${tenueId}/evaluations`),
};

// ─── Messages ──────────────────────────────────────────────────────────
export const messagesApi = {
  liste: () => api.get("/messages"),
  conversation: (autreUserId: number) => api.get(`/messages/${autreUserId}`),
  utilisateurInfo: (userId: number) => api.get(`/utilisateurs/${userId}/info`),
  envoyer: (destinataireId: number, contenu: string, reservationId?: number) =>
    api.post("/messages", {
      destinataire_id: destinataireId,
      contenu,
      reservation_id: reservationId,
    }),
};

// ─── Admin ─────────────────────────────────────────────────────────────
export const adminApi = {
  stats: () => api.get<ApiStatsAdmin>("/admin/stats"),
  statsMensuelles: () => api.get("/admin/stats/mensuelles"),
  utilisateurs: () => api.get("/admin/utilisateurs"),
  suspendre: (id: number) => api.put(`/admin/utilisateurs/${id}/suspendre`),
  tenues: () => api.get("/admin/tenues"),
  tenuesEnAttente: () => api.get("/admin/tenues/en-attente"),
  validerTenue: (id: number) => api.put(`/admin/tenues/${id}/valider`),
  rejeterTenue: (id: number, motif: string) => api.put(`/admin/tenues/${id}/rejeter`, { motif }),
  supprimerTenue: (id: number) => api.delete(`/admin/tenues/${id}`),
  litiges: () => api.get("/admin/litiges"),
  resoudreLitige: (id: number, decision: string) =>
    api.put(`/admin/litiges/${id}/resoudre`, { decision_admin: decision }),
  verifications: () => api.get("/admin/verifications"),
  validerVerification: (id: number) => api.put(`/admin/utilisateurs/${id}/valider`),
  rejeterVerification: (id: number, motif: string) =>
    api.put(`/admin/utilisateurs/${id}/rejeter`, { motif }),
  paiements: () => api.get("/admin/paiements"),
  paiementsEnAttente: () => api.get("/admin/paiements/en-attente"),
  validerPaiement: (id: number) => api.put(`/admin/paiements/${id}/valider`),
  rejeterPaiement: (id: number, motif?: string) =>
    api.put(`/admin/paiements/${id}/rejeter`, { motif }),
  reservationsARegler: () => api.get("/admin/reservations/a-regler"),
  payerProprietaire: (id: number) => api.put(`/admin/reservations/${id}/payer-proprietaire`),
  contactMessages: () => api.get("/admin/contact-messages"),
  marquerMessageLu: (id: number) => api.put(`/admin/contact-messages/${id}/lire`),
  supprimerMessage: (id: number) => api.delete(`/admin/contact-messages/${id}`),
  envoyerMessage: (userId: number, contenu: string) =>
    api.post(`/admin/utilisateurs/${userId}/message`, { contenu }),
};

// ─── Notifications ─────────────────────────────────────────────────────
export const notificationsApi = {
  liste: (page = 1) => api.get<ApiPaginated<ApiNotification>>("/notifications", { params: { page } }),

  nonLues: () => api.get<ApiNotification[]>("/notifications/non-lues"),

  marquerLu: (id: number) => api.put(`/notifications/${id}/lire`),

  marquerToutLu: () => api.put("/notifications/lire-tout"),
};

// ─── Contrats ──────────────────────────────────────────────────────────
export const contratsApi = {
  parReservation: (reservationId: number) =>
    api.get(`/reservations/${reservationId}/contrat`),

  noterEtatRetour: (contratId: number, etat: string) =>
    api.put(`/contrats/${contratId}/etat-retour`, { etat_tenue_retour: etat }),
};

// ─── Paramètres site ───────────────────────────────────────────────────
export const parametresApi = {
  get: () => api.get("/parametres"),

  modifier: (data: Record<string, string | number | undefined>) => api.put("/parametres", data),
};

// ─── Stats publiques ───────────────────────────────────────────────────
export const statsApi = {
  publiques: () => api.get<ApiStatsPubliques>("/stats-publiques"),
};

// ─── Favoris ───────────────────────────────────────────────────────────
export const favorisApi = {
  mes: () => api.get("/mes-favoris"),
  toggle: (tenueId: number) => api.post(`/tenues/${tenueId}/favori`),
};

// ─── Contact ───────────────────────────────────────────────────────────
export const contactApi = {
  envoyer: (data: { nom: string; email: string; sujet: string; message: string }) =>
    api.post("/contact", data),
};

// ─── Vérification profil ───────────────────────────────────────────────
export const verificationApi = {
  soumettre: (data: FormData) => api.post("/profil/verification", data),
};

// ─── Profil ────────────────────────────────────────────────────────────
export const profilApi = {
  modifier: (data: { nom?: string; telephone?: string; wilaya?: string; rib_barid?: string }) =>
    api.put("/profil/modifier", data),

  uploadPhoto: (file: File) => {
    const fd = new FormData();
    fd.append("photo", file);
    return api.post("/profil/photo", fd);
  },

  soumettreVerification: (formData: FormData) =>
    api.post("/profil/verification", formData),

  changerMotDePasse: (data: { current_password: string; password: string; password_confirmation: string }) =>
    api.put("/profil/mot-de-passe", data),
};

export default api;

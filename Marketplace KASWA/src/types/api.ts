// Réponses API Laravel — types centralisés

export type StatutVerification = "non_soumis" | "en_attente" | "verifie" | "rejete";
export type RoleUtilisateur = "proprietaire" | "locataire" | "admin";
export type TypeProprietaire = "investisseur" | "boutique";

export type StatutTenue = "disponible" | "louee" | "inactif" | "en_attente" | "en_maintenance";
export type StatutReservation = "demande" | "confirme" | "en_cours" | "termine" | "annule";
export type ModeLivraison = "point_retrait" | "domicile";
export type ModePaiement = "sur_place" | "en_ligne";
export type ModePaiementTransaction = "barid_mobile" | "ccp" | "cib";
export type StatutPaiement = "en_attente" | "valide" | "echoue" | "rembourse";
export type StatutCaution = "bloquee" | "liberee" | "retenue";
export type StatutLitige = "ouvert" | "en_cours" | "clos";
export type StatutContrat = "actif" | "termine" | "annule";
export type TypeNotification = "reservation" | "paiement" | "evaluation" | "litige" | "message" | "contrat";

// ─── Utilisateur ────────────────────────────────────────────────────────────

export interface ApiUtilisateur {
  id: number;
  nom: string;
  email: string;
  telephone?: string;
  wilaya?: string;
  role: RoleUtilisateur;
  type_proprietaire?: TypeProprietaire;
  nom_boutique?: string;
  adresse_boutique?: string;
  statut_verification: StatutVerification;
  verifie: boolean;
  photo_profil?: string;
  score_rep: string;
  rib_barid?: string;
  favoris: number[];
  created_at: string;
  updated_at: string;
}

export interface ApiAuthResponse {
  utilisateur: ApiUtilisateur;
  token: string;
}

// ─── Tenue ──────────────────────────────────────────────────────────────────

export interface ApiPhotoTenue {
  id: number;
  tenue_id: number;
  chemin: string;
  principale: boolean;
}

export interface ApiTenue {
  id: number;
  utilisateur_id: number;
  titre: string;
  type: string;
  taille: string;
  tailles?: string[];
  couleurs?: string[];
  description?: string;
  prix_jour: number;
  caution: number;
  wilaya?: string;
  ville?: string;
  statut: StatutTenue;
  quantite: number;
  quantites_par_taille?: Record<string, number>;
  photos?: ApiPhotoTenue[];
  proprietaire?: Partial<ApiUtilisateur>;
  note_moyenne?: number;
  nombre_evaluations?: number;
  created_at: string;
}

// ─── Réservation ────────────────────────────────────────────────────────────

export interface ApiReservation {
  id: number;
  locataire_id: number;
  tenue_id: number;
  date_debut: string;
  date_fin: string;
  montant_total: number;
  frais_livraison: number;
  frais_service: number;
  statut: StatutReservation;
  mode_livraison: ModeLivraison;
  mode_paiement: ModePaiement;
  avec_livraison: boolean;
  adresse_livraison?: string;
  tailles_choisies?: Record<string, number>;
  quantite_demandee: number;
  reception_confirmee: boolean;
  retour_signale: boolean;
  paiement_proprietaire: "en_attente" | "paye";
  locataire?: Partial<ApiUtilisateur>;
  tenue?: ApiTenue;
  paiement?: ApiPaiement;
  caution?: ApiCaution;
  contrat?: ApiContrat;
  created_at: string;
}

// ─── Paiement ───────────────────────────────────────────────────────────────

export interface ApiPaiement {
  id: number;
  reservation_id: number;
  ref_transaction?: string;
  montant: number;
  mode: ModePaiementTransaction;
  statut: StatutPaiement;
  recu_photo?: string;
  numero_compte?: string;
  created_at: string;
}

// ─── Caution ────────────────────────────────────────────────────────────────

export interface ApiCaution {
  id: number;
  reservation_id: number;
  montant: number;
  statut: StatutCaution;
  date_liberation?: string;
  motif_retenue?: string;
}

// ─── Contrat ────────────────────────────────────────────────────────────────

export interface ApiContrat {
  id: number;
  reservation_id: number;
  proprietaire_id: number;
  locataire_id: number;
  date_signature: string;
  conditions: string;
  etat_tenue_depart?: string;
  etat_tenue_retour?: string;
  statut: StatutContrat;
}

// ─── Évaluation ─────────────────────────────────────────────────────────────

export interface ApiEvaluation {
  id: number;
  reservation_id: number;
  auteur_id: number;
  note: number;
  commentaire?: string;
  statut: string;
  auteur?: Partial<ApiUtilisateur>;
  created_at: string;
}

// ─── Message ────────────────────────────────────────────────────────────────

export interface ApiMessage {
  id: number;
  expediteur_id: number;
  destinataire_id: number;
  reservation_id?: number;
  contenu: string;
  lu: boolean;
  expediteur?: Partial<ApiUtilisateur>;
  destinataire?: Partial<ApiUtilisateur>;
  created_at: string;
}

// ─── Litige ─────────────────────────────────────────────────────────────────

export interface ApiLitige {
  id: number;
  reservation_id: number;
  ouvert_par_id: number;
  description: string;
  photo_probleme?: string;
  statut: StatutLitige;
  decision_admin?: string;
  created_at: string;
}

// ─── Notification ────────────────────────────────────────────────────────────

export interface ApiNotification {
  id: number;
  utilisateur_id: number;
  reservation_id?: number;
  type: TypeNotification;
  contenu: string;
  lu: boolean;
  created_at: string;
}

// ─── Pagination Laravel ──────────────────────────────────────────────────────

export interface ApiPaginated<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// ─── Stats ───────────────────────────────────────────────────────────────────

export interface ApiStatsPubliques {
  annonces: number;
  utilisateurs: number;
  locations: number;
  note_moyenne: number | null;
  categories: Record<string, number>;
}

export interface ApiStatsAdmin {
  utilisateurs: number;
  tenues: number;
  reservations: number;
  en_cours: number;
  litiges_ouverts: number;
  revenus_total: number;
  revenus_boutique: number;
  revenus_investisseur: number;
  commission_total: number;
}

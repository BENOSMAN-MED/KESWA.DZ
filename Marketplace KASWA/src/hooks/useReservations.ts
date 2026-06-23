import { useState, useEffect, useCallback } from "react";
import { reservationsApi } from "../services/api";

export interface ReservationFrontend {
  id: string;
  tenueId: string;
  tenueTitre: string;
  tenueImage: string;
  tenueType: string;
  proprietaireNom: string;
  locataireNom: string;
  locatairePhone: string;
  dateDebut: string;
  dateFin: string;
  nbJours: number;
  montantTotal: number;
  statut: string;
  caution?: { montant: number; statut: string };
}

function apiResaToFrontend(r: any): ReservationFrontend {
  const tenue = r.tenue ?? {};
  const photos = tenue.photos ?? [];
  const photoPrincipale = tenue.photo_principale;
  const image = photoPrincipale?.chemin
    ? `/storage/${photoPrincipale.chemin}`
    : photos[0]?.chemin
    ? `/storage/${photos[0].chemin}`
    : tenue.images?.[0] ?? "";

  return {
    id: String(r.id),
    tenueId: String(tenue.id ?? ""),
    tenueTitre: tenue.titre ?? tenue.title ?? "",
    tenueImage: image,
    tenueType: tenue.type ?? "",
    proprietaireNom: tenue.proprietaire?.nom ?? "",
    locataireNom: r.locataire?.nom ?? "",
    locatairePhone: r.locataire?.telephone ?? "",
    dateDebut: r.date_debut,
    dateFin: r.date_fin,
    nbJours: r.nb_jours ?? 1,
    montantTotal: Number(r.montant_total ?? 0),
    statut: r.statut,
    caution: r.caution,
  };
}

export function useReservationsLocataire() {
  const [reservations, setReservations] = useState<ReservationFrontend[]>([]);
  const [loading, setLoading] = useState(true);

  const charger = useCallback(() => {
    setLoading(true);
    reservationsApi.mesReservations()
      .then((res) => {
        const items = res.data?.data ?? res.data ?? [];
        setReservations(items.map(apiResaToFrontend));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { charger(); }, [charger]);

  return { reservations, loading, recharger: charger };
}

export function useDemandesProprietaire() {
  const [demandes, setDemandes] = useState<ReservationFrontend[]>([]);
  const [loading, setLoading] = useState(true);

  const charger = useCallback(() => {
    setLoading(true);
    reservationsApi.demandesRecues()
      .then((res) => {
        const items = res.data?.data ?? res.data ?? [];
        setDemandes(items.map(apiResaToFrontend));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { charger(); }, [charger]);

  return { demandes, loading, recharger: charger };
}

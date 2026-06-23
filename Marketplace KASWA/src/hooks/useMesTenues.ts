import { useState, useEffect, useCallback } from "react";
import { tenuesApi } from "../services/api";
import type { Listing } from "../app/data/mockData";

const FALLBACK_IMAGES: Record<string, string> = {
  "Chedda":   "https://images.unsplash.com/photo-1709979773967-80940faecb0f?w=600&q=80",
  "Caftan":   "https://images.unsplash.com/photo-1649109669258-84a962e88a32?w=600&q=80",
  "Karakou":  "https://images.unsplash.com/photo-1667179529444-1c8e8defa2a9?w=600&q=80",
  "Burnous":  "https://images.unsplash.com/photo-1629332792054-caf90e135c3b?w=600&q=80",
  "Gandoura": "https://images.unsplash.com/photo-1726208229202-0d54c1cf2ebc?w=600&q=80",
  "Autre":    "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80",
};

function apiTenueToListing(t: any): Listing {
  const type = t.type ?? "";
  const fallback = FALLBACK_IMAGES[type] ?? FALLBACK_IMAGES["Autre"];
  const apiPhotos = t.photos?.filter((p: any) => p.chemin)
    .map((p: any) => `${import.meta.env.VITE_STORAGE_URL ?? "http://localhost:8000/storage"}/${p.chemin}`) ?? [];
  const images = apiPhotos.length > 0 ? apiPhotos : [fallback];

  return {
    id: String(t.id),
    ownerId: String(t.utilisateur_id ?? ""),
    ownerName: t.proprietaire?.nom ?? "",
    ownerRating: Number(t.proprietaire?.score_rep ?? 0),
    title: t.titre ?? "",
    type,
    occasion: [],
    description: t.description ?? "",
    pricePerDay: Number(t.prix_jour ?? 0),
    caution: Number(t.caution ?? 0),
    images,
    sizes: [t.taille].filter(Boolean),
    colors: [],
    region: t.region ?? "",
    wilaya: t.wilaya ?? "",
    available: t.statut === "disponible",
    rating: Number(t.rating ?? 0),
    reviewCount: 0,
    featured: false,
    createdAt: t.created_at ?? "",
  };
}

export function useMesTenues() {
  const [tenues, setTenues] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const charger = useCallback(() => {
    setLoading(true);
    tenuesApi.mesTenues()
      .then((res) => {
        const items = res.data?.data ?? res.data ?? [];
        setTenues(items.map(apiTenueToListing));
      })
      .catch(() => setTenues([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { charger(); }, [charger]);

  return { tenues, loading, recharger: charger };
}

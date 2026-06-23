import { useState, useEffect } from "react";
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

// Convertit une tenue Laravel → format Listing frontend
function apiTenueToListing(t: any): Listing {
  const type = t.type ?? "";
  const fallback = FALLBACK_IMAGES[type] ?? FALLBACK_IMAGES["Autre"];

  const apiPhotos = t.photos?.filter((p: any) => p.chemin)
    .map((p: any) => `${import.meta.env.VITE_STORAGE_URL ?? "http://localhost:8000/storage"}/${p.chemin}`) ?? [];

  const images = apiPhotos.length > 0 ? apiPhotos
    : t.images?.length > 0 ? t.images
    : [fallback];

  return {
    id: String(t.id),
    ownerId: String(t.utilisateur_id ?? t.owner_id ?? ""),
    ownerName: t.proprietaire?.nom ?? t.owner?.name ?? "Propriétaire",
    ownerRating: Number(t.proprietaire?.score_rep ?? t.owner?.rating ?? 0),
    ownerAvatar: t.proprietaire?.photo_profil ?? t.owner?.avatar,
    title: t.titre ?? t.title ?? "",
    type,
    occasion: t.occasion ?? [],
    description: t.description ?? "",
    pricePerDay: Number(t.prix_jour ?? t.price_per_day ?? 0),
    caution: Number(t.caution ?? 0),
    images,
    sizes: Array.isArray(t.tailles) ? t.tailles : (t.taille ? [t.taille] : ["Unique"]),
    colors: Array.isArray(t.couleurs)
      ? t.couleurs
      : (t.couleurs ? String(t.couleurs).split(",").map((c: string) => c.trim()).filter(Boolean) : []),
    region: t.region ?? "",
    wilaya: t.wilaya ?? "",
    available: t.statut === "disponible" || t.disponible === true,
    quantite: Number(t.quantite ?? 1),
    availableDates: t.available_dates ?? [],
    rating: Number(t.rating ?? 0),
    reviewCount: Number(t.review_count ?? t.reviewCount ?? 0),
    featured: t.featured ?? false,
    createdAt: t.created_at ?? new Date().toISOString(),
  };
}

interface Filtres {
  type?: string;
  taille?: string;
  wilaya?: string;
  prix_max?: number;
  page?: number;
}

export function useTenues(filtres?: Filtres) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    tenuesApi.liste(filtres)
      .then((res) => {
        const data = res.data;
        // Supporte pagination Laravel (data.data) ou tableau direct
        const items = Array.isArray(data) ? data : (data.data ?? []);
        setListings(items.map(apiTenueToListing));
        setTotal(data.total ?? items.length);
        setLastPage(data.last_page ?? 1);
      })
      .catch(() => setError("Impossible de charger les tenues."))
      .finally(() => setLoading(false));
  }, [filtres?.type, filtres?.taille, filtres?.wilaya, filtres?.prix_max, filtres?.page]);

  return { listings, loading, error, total, lastPage };
}

export function useTenue(id: string | number) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    tenuesApi.detail(id)
      .then((res) => setListing(apiTenueToListing(res.data)))
      .catch(() => setError("Tenue introuvable."))
      .finally(() => setLoading(false));
  }, [id]);

  return { listing, loading, error };
}

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router";
import { Search, SlidersHorizontal, X, MapPin, Navigation, Loader2 } from "lucide-react";
import { ListingCard } from "../components/ListingCard";
import { Listing, WILAYA_COORDINATES } from "../data/mockData";
import { tenuesApi } from "../../services/api";
import { STORAGE_URL } from "../../services/storageUrl";
import {
  requestGeolocation, sortByDistance, nearestWilaya, distanceToWilaya,
  formatDistance, type UserLocation,
} from "../utils/locationUtils";
const FALLBACK_IMG = "https://images.unsplash.com/photo-1649109669258-84a962e88a32?w=400&h=300&fit=crop";

function mapTenue(t: any): Listing {
  const photos = t.photos ?? (t.photo_principale ? [t.photo_principale] : []);
  const images = photos.length > 0
    ? photos.map((p: any) => STORAGE_URL + (p.chemin ?? p))
    : [FALLBACK_IMG];

  return {
    id: String(t.id),
    ownerId: String(t.proprietaire?.id ?? t.utilisateur_id ?? ""),
    ownerName: t.proprietaire?.nom ?? "Propriétaire",
    ownerRating: parseFloat(t.proprietaire?.score_rep ?? "0"),
    title: t.titre,
    type: t.type,
    occasion: [],
    description: t.description ?? "",
    pricePerDay: parseFloat(t.prix_jour),
    caution: parseFloat(t.caution ?? "0"),
    images,
    sizes: t.tailles ?? (t.taille ? [t.taille] : ["Unique"]),
    colors: Array.isArray(t.couleurs) ? t.couleurs : [],
    region: t.wilaya ?? "",
    wilaya: t.wilaya ?? "",
    available: t.statut === "disponible",
    rating: parseFloat(t.note_moyenne ?? "0"),
    reviewCount: parseInt(t.nombre_evaluations ?? "0", 10),
    featured: false,
    createdAt: t.created_at ?? new Date().toISOString(),
    quantite: parseInt(t.quantite ?? "1", 10),
  };
}

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [tenues, setTenues] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [selectedType, setSelectedType] = useState(searchParams.get("type") || "");
  const [selectedWilaya, setSelectedWilaya] = useState(searchParams.get("wilaya") || "");
  const [maxPrice, setMaxPrice] = useState(0); // 0 = pas de limite jusqu'au chargement
  const [prixMax, setPrixMax] = useState(50000); // max calculé dynamiquement
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [geoStatus, setGeoStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [userLoc, setUserLoc] = useState<UserLocation | null>(null);

  // Charge TOUTES les pages
  useEffect(() => {
    const charger = async () => {
      setLoading(true);
      try {
        let all: Listing[] = [];
        let page = 1;
        let hasMore = true;
        while (hasMore) {
          const res = await tenuesApi.liste({ page });
          const data = res.data;
          const items: any[] = data.data ?? data ?? [];
          all = [...all, ...items.map(mapTenue)];
          hasMore = !!(data.next_page_url);
          page++;
          if (page > 20) break; // sécurité anti-boucle infinie
        }
        setTenues(all);
        // Calcule le prix max dynamiquement
        if (all.length > 0) {
          const top = Math.max(...all.map((t) => t.pricePerDay));
          const ceil = Math.ceil(top / 1000) * 1000 + 5000;
          setPrixMax(ceil);
          setMaxPrice(ceil);
        } else {
          setPrixMax(50000);
          setMaxPrice(50000);
        }
      } catch {
        setTenues([]);
      } finally {
        setLoading(false);
      }
    };
    charger();
  }, []);

  // Wilayas et types uniques extraits des données réelles
  const wilayasDisponibles = useMemo(() => {
    const set = new Set(tenues.map((t) => t.wilaya).filter(Boolean));
    return Array.from(set).sort();
  }, [tenues]);

  const EXCLUDED_TYPES = new Set(["Qamis", "Keswa El Kbira", "Gandoura", "Costume Chaâbi"]);
  const TYPE_RENAME: Record<string, string> = { "Robe Kabyle": "Robes Soirée", "Robe Chaouie": "Chaouie", "Burnous": "Chaouie" };

  const typesDisponibles = useMemo(() => {
    const set = new Set(
      tenues
        .map((t) => t.type)
        .filter((tp): tp is string => Boolean(tp) && !EXCLUDED_TYPES.has(tp))
        .map((tp) => TYPE_RENAME[tp] ?? tp)
    );
    return Array.from(set).sort();
  }, [tenues]);

  const handleDetectLocation = async () => {
    setGeoStatus("loading");
    try {
      const loc = await requestGeolocation();
      setUserLoc(loc);
      setGeoStatus("success");
      setSortBy("nearby");
      const nearest = nearestWilaya(loc);
      setSelectedWilaya(nearest);
    } catch {
      setGeoStatus("error");
    }
  };

  const filtered = useMemo(() => {
    let results = [...tenues];

    // Recherche texte
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.type.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          l.wilaya.toLowerCase().includes(q),
      );
    }

    // Filtre type (gère les renommages ex: "Robes Soirée" → "Robe Kabyle" en DB)
    if (selectedType) {
      const REVERSE_RENAME: Record<string, string> = { "Robes Soirée": "Robe Kabyle", "Chaouie": "Robe Chaouie" };
      const dbType = REVERSE_RENAME[selectedType] ?? selectedType;
      results = results.filter(
        (l) => l.type.toLowerCase() === dbType.toLowerCase(),
      );
    }

    // Filtre wilaya (insensible à la casse)
    if (selectedWilaya) {
      results = results.filter(
        (l) => l.wilaya.toLowerCase() === selectedWilaya.toLowerCase(),
      );
    }

    // Filtre disponibles uniquement
    if (availableOnly) results = results.filter((l) => l.available);

    // Filtre prix max
    if (maxPrice > 0) {
      results = results.filter((l) => l.pricePerDay <= maxPrice);
    }

    // Tri
    if (sortBy === "price-asc")  results.sort((a, b) => a.pricePerDay - b.pricePerDay);
    else if (sortBy === "price-desc") results.sort((a, b) => b.pricePerDay - a.pricePerDay);
    else if (sortBy === "newest") results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    else if (sortBy === "nearby" && userLoc) return sortByDistance(results, userLoc);

    return results;
  }, [search, selectedType, selectedWilaya, maxPrice, availableOnly, sortBy, userLoc, tenues]);

  const clearFilters = () => {
    setSearch(""); setSelectedType(""); setSelectedWilaya("");
    setMaxPrice(prixMax); setAvailableOnly(false); setSortBy("featured");
    setSearchParams({}); setUserLoc(null); setGeoStatus("idle");
  };

  const hasFilters = !!(search || selectedType || selectedWilaya || availableOnly || maxPrice < prixMax);

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Localisation */}
      <div>
        <h4 className="text-gray-800 text-sm mb-3 flex items-center gap-1.5" style={{ fontWeight: 600 }}>
          <MapPin size={14} className="text-[#C9924A]" />Localisation
        </h4>
        <button
          onClick={handleDetectLocation}
          disabled={geoStatus === "loading"}
          className="w-full flex items-center justify-center gap-2 bg-[#1B4D3E] hover:bg-[#2d6b55] disabled:opacity-60 text-white px-3 py-2.5 rounded-lg text-xs transition-colors mb-2"
          style={{ fontWeight: 600 }}>
          {geoStatus === "loading" ? <Loader2 size={12} className="animate-spin" /> : <Navigation size={12} />}
          {geoStatus === "loading" ? "Localisation…" : geoStatus === "success" ? "Position détectée ✓" : "Détecter ma position"}
        </button>
        {geoStatus === "error" && (
          <p className="text-xs text-red-500 mb-2">Géolocalisation refusée. Choisissez manuellement.</p>
        )}
        <select
          value={selectedWilaya}
          onChange={(e) => {
            setSelectedWilaya(e.target.value);
            if (sortBy === "nearby") setSortBy("featured");
          }}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 outline-none focus:border-[#1B4D3E]">
          <option value="">Toutes les wilayas</option>
          {wilayasDisponibles.map((w) => (
            <option key={w} value={w}>{w}</option>
          ))}
        </select>
        {wilayasDisponibles.length === 0 && !loading && (
          <p className="text-xs text-gray-400 mt-1 italic">Aucune wilaya disponible</p>
        )}
      </div>

      {/* Type de tenue */}
      <div>
        <h4 className="text-gray-800 text-sm mb-3" style={{ fontWeight: 600 }}>Type de tenue</h4>
        {typesDisponibles.length === 0 && !loading ? (
          <p className="text-xs text-gray-400 italic">Aucun type disponible</p>
        ) : (
          <div className="space-y-2">
            {typesDisponibles.map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="type"
                  checked={selectedType === type}
                  onChange={() => setSelectedType(selectedType === type ? "" : type)}
                  className="accent-[#1B4D3E]"
                />
                <span className="text-sm text-gray-600 group-hover:text-[#1B4D3E] transition-colors">{type}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Prix max */}
      <div>
        <h4 className="text-gray-800 text-sm mb-3" style={{ fontWeight: 600 }}>
          Prix max :{" "}
          <span className="text-[#1B4D3E]">{maxPrice.toLocaleString("fr-DZ")} DA/jour</span>
        </h4>
        <input
          type="range"
          min={500}
          max={prixMax}
          step={500}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-[#1B4D3E]"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>500 DA</span>
          <span>{prixMax.toLocaleString("fr-DZ")} DA</span>
        </div>
      </div>

      {/* Disponibles uniquement */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={(e) => setAvailableOnly(e.target.checked)}
            className="accent-[#1B4D3E]"
          />
          <span className="text-sm text-gray-600">Disponibles uniquement</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF6EF] pt-20">
      <div className="bg-[#1B4D3E] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-white text-3xl mb-2" style={{ fontWeight: 700 }}>Catalogue des tenues</h1>
          <p className="text-white/60">
            {loading ? "Chargement…" : `${tenues.length} tenues chargées · ${filtered.length} correspondent à votre recherche`}
          </p>
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={handleDetectLocation}
              disabled={geoStatus === "loading"}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-full text-sm transition-colors disabled:opacity-60"
              style={{ fontWeight: 500 }}>
              {geoStatus === "loading" ? <Loader2 size={14} className="animate-spin" /> : <Navigation size={14} />}
              {geoStatus === "success" ? `Près de ${selectedWilaya}` : geoStatus === "loading" ? "Localisation…" : "Tenues près de moi"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Barre de recherche + tri */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par titre, type, wilaya…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1B4D3E] text-gray-700"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 outline-none focus:border-[#1B4D3E] cursor-pointer">
            <option value="featured">Défaut</option>
            <option value="nearby" disabled={!userLoc}>
              {userLoc ? "Plus proche de moi 📍" : "Plus proche (activer GPS d'abord)"}
            </option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="newest">Les plus récentes</option>
          </select>
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 hover:border-[#1B4D3E] transition-colors sm:hidden">
            <SlidersHorizontal size={16} />Filtres
            {hasFilters && <span className="w-2 h-2 bg-[#C9924A] rounded-full" />}
          </button>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-colors">
              <X size={14} />Effacer les filtres
            </button>
          )}
        </div>

        <div className="flex gap-6">
          {/* Sidebar desktop */}
          <aside className="hidden sm:block w-56 shrink-0">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-gray-900" style={{ fontWeight: 600 }}>Filtres</h3>
                {hasFilters && (
                  <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-600">Réinitialiser</button>
                )}
              </div>
              <FilterPanel />
            </div>
          </aside>

          {/* Drawer mobile */}
          {filtersOpen && (
            <div className="fixed inset-0 z-50 sm:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setFiltersOpen(false)} />
              <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-5 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-gray-900" style={{ fontWeight: 600 }}>Filtres</h3>
                  <button onClick={() => setFiltersOpen(false)}>
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>
                <FilterPanel />
                <button
                  onClick={() => setFiltersOpen(false)}
                  className="w-full mt-6 bg-[#1B4D3E] text-white py-3 rounded-xl"
                  style={{ fontWeight: 600 }}>
                  Voir {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
                </button>
              </div>
            </div>
          )}

          {/* Grille résultats */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full animate-spin mx-auto mb-3"
                    style={{ border: "3px solid #e5e7eb", borderTopColor: "#1B4D3E" }} />
                  <p className="text-gray-400 text-sm">Chargement des tenues…</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-500 text-sm">
                    <span className="text-gray-900" style={{ fontWeight: 600 }}>{filtered.length}</span> tenue{filtered.length > 1 ? "s" : ""} trouvée{filtered.length > 1 ? "s" : ""}
                    {sortBy === "nearby" && userLoc && selectedWilaya && (
                      <span className="ml-2 inline-flex items-center gap-1 text-[#1B4D3E] text-xs bg-[#1B4D3E]/10 px-2 py-0.5 rounded-full">
                        <MapPin size={10} />Près de {selectedWilaya}
                      </span>
                    )}
                  </p>
                  {/* Filtres actifs */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {selectedWilaya && (
                      <span className="flex items-center gap-1 text-xs bg-[#1B4D3E]/10 text-[#1B4D3E] px-2 py-1 rounded-full" style={{ fontWeight: 500 }}>
                        <MapPin size={10} />{selectedWilaya}
                        <button onClick={() => setSelectedWilaya("")} className="ml-0.5 hover:text-red-500"><X size={10} /></button>
                      </span>
                    )}
                    {selectedType && (
                      <span className="flex items-center gap-1 text-xs bg-[#C9924A]/10 text-[#C9924A] px-2 py-1 rounded-full" style={{ fontWeight: 500 }}>
                        {selectedType}
                        <button onClick={() => setSelectedType("")} className="ml-0.5 hover:text-red-500"><X size={10} /></button>
                      </span>
                    )}
                  </div>
                </div>

                {filtered.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-5xl mb-4">🔍</p>
                    <h3 className="text-gray-700 mb-2" style={{ fontWeight: 600 }}>Aucune tenue trouvée</h3>
                    <p className="text-gray-400 text-sm mb-6">Essayez d'élargir vos critères de recherche</p>
                    <button onClick={clearFilters} className="bg-[#1B4D3E] text-white px-6 py-2.5 rounded-full text-sm" style={{ fontWeight: 500 }}>
                      Effacer les filtres
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filtered.map((listing, i) => (
                      <div key={listing.id} className="relative animate-card-in" style={{ animationDelay: `${i * 0.04}s` }}>
                        {sortBy === "nearby" && userLoc && (
                          <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-white/90 backdrop-blur-sm border border-[#1B4D3E]/20 text-[#1B4D3E] px-2 py-1 rounded-full text-xs shadow-sm pointer-events-none" style={{ fontWeight: 600 }}>
                            <MapPin size={10} />
                            {formatDistance(distanceToWilaya(userLoc, listing.wilaya))}
                          </div>
                        )}
                        <ListingCard listing={listing} />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

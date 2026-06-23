import { useState, useEffect } from "react";
import { Link } from "react-router";
import { MapPin, Navigation, ArrowRight, Loader2, AlertCircle, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ListingCard } from "./ListingCard";
import { Listing, WILAYA_COORDINATES } from "../data/mockData";
import { tenuesApi } from "../../services/api";
import { STORAGE_URL } from "../../services/storageUrl";
import {
  requestGeolocation,
  sortByDistance,
  nearestWilaya,
  distanceToWilaya,
  formatDistance,
  type UserLocation,
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
    title: t.titre, type: t.type, occasion: [],
    description: t.description ?? "",
    pricePerDay: parseFloat(t.prix_jour),
    caution: parseFloat(t.caution ?? "0"),
    images,
    sizes: t.tailles ?? (t.taille ? [t.taille] : ["Unique"]),
    colors: Array.isArray(t.couleurs) ? t.couleurs : [],
    region: t.wilaya ?? "", wilaya: t.wilaya ?? "",
    available: t.statut === "disponible",
    rating: 0, reviewCount: 0, featured: false,
    createdAt: t.created_at ?? new Date().toISOString(),
  };
}

type Status = "idle" | "loading" | "success" | "error";

const ALL_WILAYAS = Object.keys(WILAYA_COORDINATES).sort();

export function NearbyListings() {
  const [status, setStatus] = useState<Status>("idle");
  const [userLoc, setUserLoc] = useState<UserLocation | null>(null);
  const [closestWilaya, setClosestWilaya] = useState<string>("");
  const [manualWilaya, setManualWilaya] = useState<string>("");
  const [showManual, setShowManual] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [nearbyListings, setNearbyListings] = useState<Listing[]>([]);
  const [loadingListings, setLoadingListings] = useState(false);

  const activeWilaya = manualWilaya || closestWilaya;

  // Charge les tenues selon la wilaya active
  useEffect(() => {
    if (!activeWilaya && !userLoc) return;
    setLoadingListings(true);
    const params = activeWilaya ? { wilaya: activeWilaya } : {};
    tenuesApi.liste({ ...params, page: 1 })
      .then((res) => {
        const data: any[] = res.data?.data ?? res.data ?? [];
        const listings = data.map(mapTenue);
        if (userLoc && !manualWilaya) {
          setNearbyListings(sortByDistance(listings, userLoc).slice(0, 4));
        } else {
          setNearbyListings(listings.slice(0, 4));
        }
      })
      .catch(() => setNearbyListings([]))
      .finally(() => setLoadingListings(false));
  }, [activeWilaya, userLoc, manualWilaya]);

  const handleDetect = async () => {
    setStatus("loading");
    setErrorMsg("");
    setManualWilaya("");
    try {
      const loc = await requestGeolocation();
      setUserLoc(loc);
      setClosestWilaya(nearestWilaya(loc));
      setStatus("success");
      setShowManual(false);
    } catch {
      setStatus("error");
      setErrorMsg(
        "Impossible d'accéder à votre position. Activez la géolocalisation ou choisissez votre wilaya manuellement."
      );
      setShowManual(true);
    }
  };

  const handleManualSelect = (w: string) => {
    setManualWilaya(w);
    setStatus("success");
    setShowManual(false);
  };

  const distanceLabel = (wilaya: string) => {
    if (userLoc && !manualWilaya) {
      return formatDistance(distanceToWilaya(userLoc, wilaya));
    }
    return null;
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <span
              className="text-[#C9924A] text-sm"
              style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}
            >
              Près de vous
            </span>
            <h2 className="text-gray-900 mt-2" style={{ fontSize: "2rem", fontWeight: 700 }}>
              Tenues disponibles autour de vous
            </h2>
            <p className="text-gray-500 mt-2 max-w-xl">
              Trouvez la tenue parfaite dans votre région pour éviter les longs déplacements.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={handleDetect}
              disabled={status === "loading"}
              className="flex items-center gap-2 bg-[#1B4D3E] hover:bg-[#2d6b55] disabled:opacity-60 text-white px-5 py-3 rounded-xl text-sm transition-colors shadow-sm"
              style={{ fontWeight: 600 }}
            >
              {status === "loading" ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Navigation size={16} />
              )}
              {status === "loading" ? "Localisation…" : "Détecter ma position"}
            </button>
            <button
              onClick={() => setShowManual((v) => !v)}
              className="flex items-center gap-2 bg-white border border-gray-200 hover:border-[#1B4D3E] text-gray-700 px-5 py-3 rounded-xl text-sm transition-colors"
              style={{ fontWeight: 500 }}
            >
              <MapPin size={16} className="text-[#C9924A]" />
              Choisir ma wilaya
              <ChevronDown size={14} className={`transition-transform ${showManual ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>

        {/* Manual wilaya selector */}
        <AnimatePresence>
          {showManual && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="bg-[#FAF6EF] rounded-2xl p-5 border border-[#C9924A]/20">
                <p className="text-gray-700 text-sm mb-4" style={{ fontWeight: 600 }}>
                  Sélectionnez votre wilaya :
                </p>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                  {ALL_WILAYAS.map((w) => (
                    <button
                      key={w}
                      onClick={() => handleManualSelect(w)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                        activeWilaya === w
                          ? "bg-[#1B4D3E] text-white border-[#1B4D3E]"
                          : "bg-white border-gray-200 text-gray-600 hover:border-[#1B4D3E] hover:text-[#1B4D3E]"
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error message */}
        <AnimatePresence>
          {status === "error" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-3 bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6"
            >
              <AlertCircle size={18} className="text-orange-500 mt-0.5 shrink-0" />
              <p className="text-orange-700 text-sm">{errorMsg}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Location detected banner */}
        <AnimatePresence>
          {status === "success" && activeWilaya && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 bg-[#1B4D3E]/5 border border-[#1B4D3E]/20 rounded-xl px-4 py-3 mb-6"
            >
              <div className="w-8 h-8 bg-[#1B4D3E] rounded-full flex items-center justify-center shrink-0">
                <MapPin size={14} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-[#1B4D3E] text-sm" style={{ fontWeight: 600 }}>
                  {manualWilaya
                    ? `Wilaya sélectionnée : ${activeWilaya}`
                    : `Position détectée — Wilaya la plus proche : ${activeWilaya}`}
                </p>
                <p className="text-gray-500 text-xs mt-0.5">
                  Affichage des tenues les plus proches de vous
                </p>
              </div>
              <button
                onClick={() => {
                  setStatus("idle");
                  setUserLoc(null);
                  setClosestWilaya("");
                  setManualWilaya("");
                }}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                Réinitialiser
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Listings grid */}
        {status === "idle" && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-[#FAF6EF] rounded-full flex items-center justify-center mb-5 border-2 border-dashed border-[#C9924A]/30">
              <MapPin size={32} className="text-[#C9924A]" />
            </div>
            <h3 className="text-gray-800 mb-2" style={{ fontWeight: 600 }}>
              Activez votre localisation
            </h3>
            <p className="text-gray-400 text-sm max-w-sm">
              Cliquez sur "Détecter ma position" ou choisissez votre wilaya pour voir les tenues disponibles près de chez vous.
            </p>
          </div>
        )}

        {status === "loading" && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-[#1B4D3E]/10 rounded-full flex items-center justify-center mb-5">
              <Loader2 size={32} className="text-[#1B4D3E] animate-spin" />
            </div>
            <p className="text-gray-500 text-sm">Recherche de votre position…</p>
          </div>
        )}

        {status === "success" && loadingListings && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-[#1B4D3E]/10 rounded-full flex items-center justify-center mb-5">
              <Loader2 size={32} className="text-[#1B4D3E] animate-spin" />
            </div>
            <p className="text-gray-500 text-sm">Recherche des tenues disponibles…</p>
          </div>
        )}

        {status === "success" && !loadingListings && nearbyListings.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {nearbyListings.map((listing, i) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="relative"
                >
                  {/* Distance badge */}
                  {distanceLabel(listing.wilaya) && (
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-white/90 backdrop-blur-sm border border-[#1B4D3E]/20 text-[#1B4D3E] px-2 py-1 rounded-full text-xs shadow-sm"
                      style={{ fontWeight: 600 }}>
                      <MapPin size={10} />
                      {distanceLabel(listing.wilaya)}
                    </div>
                  )}
                  <ListingCard listing={listing} />
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                to={`/catalogue?wilaya=${encodeURIComponent(activeWilaya)}`}
                className="inline-flex items-center gap-2 border border-[#1B4D3E] text-[#1B4D3E] hover:bg-[#1B4D3E] hover:text-white px-7 py-3 rounded-full text-sm transition-colors"
                style={{ fontWeight: 600 }}
              >
                Voir toutes les tenues à {activeWilaya}
                <ArrowRight size={15} />
              </Link>
            </div>
          </>
        )}

        {status === "success" && !loadingListings && nearbyListings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-5xl mb-4">😔</p>
            <h3 className="text-gray-700 mb-2" style={{ fontWeight: 600 }}>
              Aucune tenue trouvée à {activeWilaya}
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              Essayez une wilaya voisine ou consultez tout le catalogue.
            </p>
            <Link
              to="/catalogue"
              className="inline-flex items-center gap-2 bg-[#1B4D3E] text-white px-6 py-2.5 rounded-full text-sm"
              style={{ fontWeight: 600 }}
            >
              Voir tout le catalogue
              <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import {
  Plus, TrendingUp, ShoppingBag, Star, Eye,
  CheckCircle, Clock, XCircle, DollarSign, MessageCircle, Loader2,
  BarChart3, ArrowRight, CalendarDays, Package, X, FileText, ScrollText, Printer, Trash2
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { tenuesApi, reservationsApi, evaluationsApi } from "../../services/api";
import { ContratLocation } from "../components/ContratLocation";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "motion/react";
import { STORAGE_URL } from "../../services/storageUrl";
const FALLBACK_IMG = "https://images.unsplash.com/photo-1649109669258-84a962e88a32?w=120&h=120&fit=crop";

interface Tenue {
  id: number;
  titre: string;
  type: string;
  wilaya: string;
  prix_jour: number;
  statut: string;
  photo_principale?: { chemin: string };
  photos?: { chemin: string }[];
}

interface Reservation {
  id: number;
  tenue?: { id: number; titre: string; type?: string; photo_principale?: { chemin: string }; photos?: { chemin: string }[]; caution?: number };
  locataire?: { id: number; nom: string; telephone?: string; email?: string };
  date_debut: string;
  date_fin: string;
  montant_total: number;
  statut: "demande" | "confirme" | "en_cours" | "termine" | "annule";
}

function getImg(item?: { photo_principale?: { chemin: string }; photos?: { chemin: string }[] } | null): string | null {
  const first = item?.photos?.[0] ?? item?.photo_principale;
  return first?.chemin ? STORAGE_URL + first.chemin : null;
}

const STATUT_MAP: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
  demande:  { label: "En attente",  cls: "bg-yellow-100 text-yellow-700", icon: <Clock size={11} /> },
  confirme: { label: "Confirmée",   cls: "bg-blue-100 text-blue-700",    icon: <CheckCircle size={11} /> },
  en_cours: { label: "En cours",    cls: "bg-[#1B4D3E]/10 text-[#1B4D3E]", icon: <CheckCircle size={11} /> },
  termine:  { label: "Terminée",    cls: "bg-gray-100 text-gray-600",    icon: <CheckCircle size={11} /> },
  annule:   { label: "Annulée",     cls: "bg-red-100 text-red-600",      icon: <XCircle size={11} /> },
};

function StatusBadge({ statut }: { statut: string }) {
  const s = STATUT_MAP[statut] ?? STATUT_MAP.demande;
  return (
    <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs ${s.cls}`} style={{ fontWeight: 500 }}>
      {s.icon} {s.label}
    </span>
  );
}

export function OwnerDashboard() {
  const { currentUser } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [tenues, setTenues] = useState<Tenue[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [evalModal, setEvalModal] = useState<{ open: boolean; reservationId: number; locataireNom: string } | null>(null);
  const [evalNote, setEvalNote] = useState(5);
  const [evalComment, setEvalComment] = useState("");
  const [evalLoading, setEvalLoading] = useState(false);
  const [evaluatedIds, setEvaluatedIds] = useState<number[]>([]);
  const [contratModal, setContratModal] = useState<Reservation | null>(null);
  const [contratPlatOpen, setContratPlatOpen] = useState(false);

  useEffect(() => {
    if (!currentUser) { navigate("/connexion"); return; }
    charger();
  }, [currentUser]);

  const charger = async () => {
    setLoading(true);
    try {
      const [tenuesRes, resaRes] = await Promise.all([
        tenuesApi.mesTenues(),
        reservationsApi.demandesRecues(),
      ]);
      setTenues(tenuesRes.data?.data ?? tenuesRes.data ?? []);
      setReservations(resaRes.data?.data ?? resaRes.data ?? []);
    } catch {
      setTenues([]); setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  const revenusBruts = reservations
    .filter(r => r.statut === "en_cours" || r.statut === "termine")
    .reduce((s, r) => s + parseFloat(r.montant_total?.toString() ?? "0"), 0);

  const supprimerTenue = async (id: number, titre: string) => {
    if (!window.confirm(`Supprimer l'annonce "${titre}" ? Cette action est irréversible.`)) return;
    try {
      await tenuesApi.supprimer(id);
      setTenues(prev => prev.filter(t => t.id !== id));
      toast.success("Annonce supprimée avec succès.");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Impossible de supprimer cette annonce.");
    }
  };

  const demandesEnAttente = reservations.filter(r => r.statut === "demande").length;
  const tenuesActives = tenues.filter(t => t.statut === "disponible");
  const locationsActives = reservations.filter(r => r.statut === "en_cours" || r.statut === "confirme");
  const soumettreEvalProprio = async () => {
    if (!evalModal) return;
    setEvalLoading(true);
    try {
      await evaluationsApi.soumettre(evalModal.reservationId, evalNote, evalComment || undefined);
      toast.success(`Avis soumis ! ${evalNote} étoiles pour ${evalModal.locataireNom}`);
      setEvaluatedIds((prev) => [...prev, evalModal.reservationId]);
      setEvalModal(null);
      setEvalNote(5); setEvalComment("");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Impossible de soumettre l'avis");
    } finally {
      setEvalLoading(false);
    }
  };

  const tabs = [
    { key: "overview",      label: "Vue d'ensemble" },
    { key: "listings",      label: "Mes annonces" },
    { key: "reservations",  label: "Réservations" },
    { key: "revenus",       label: "Revenus" },
  ];

  const resaToFrontend = (res: Reservation) => {
    const nbJours = Math.max(1, Math.round(
      (new Date(res.date_fin).getTime() - new Date(res.date_debut).getTime()) / (1000 * 60 * 60 * 24)
    ) + 1);
    return {
      id: String(res.id),
      tenueId: String(res.tenue?.id ?? ""),
      tenueTitre: res.tenue?.titre ?? "Tenue",
      tenueImage: "",
      tenueType: res.tenue?.type ?? "",
      proprietaireNom: currentUser?.name ?? "",
      locataireNom: res.locataire?.nom ?? "Locataire",
      locatairePhone: res.locataire?.telephone ?? "",
      dateDebut: res.date_debut,
      dateFin: res.date_fin,
      nbJours,
      montantTotal: parseFloat(res.montant_total?.toString() ?? "0"),
      statut: res.statut,
      caution: res.tenue?.caution ? { montant: parseFloat(res.tenue.caution.toString()), statut: "bloquee" as const } : undefined,
    };
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-[#FAF6EF] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-gray-900" style={{ fontSize: "1.6rem", fontWeight: 700 }}>
              Bonjour, {currentUser.name.split(" ")[0]} 👋
            </h1>
            <p className="text-gray-500 mt-1 text-sm">Voici un aperçu de votre activité</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Link to="/gestion"
              className="flex items-center gap-2 bg-[#C9924A] text-white px-5 py-2.5 rounded-xl text-sm hover:bg-[#b07d3a] transition-colors shadow-sm"
              style={{ fontWeight: 600 }}>
              <BarChart3 size={16} /> Gestion Complète
            </Link>
            <Link to="/ajouter-annonce"
              className="flex items-center gap-2 bg-[#1B4D3E] text-white px-5 py-2.5 rounded-xl text-sm hover:bg-[#2d6b55] transition-colors"
              style={{ fontWeight: 600 }}>
              <Plus size={16} /> Nouvelle annonce
            </Link>
          </div>
        </div>

        {/* Alerte demandes en attente */}
        {!loading && demandesEnAttente > 0 && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-yellow-100 rounded-xl flex items-center justify-center shrink-0">
                <Clock size={18} className="text-yellow-600" />
              </div>
              <p className="text-yellow-900 text-sm" style={{ fontWeight: 600 }}>
                {demandesEnAttente} demande{demandesEnAttente > 1 ? "s" : ""} en attente de réponse
              </p>
            </div>
            <Link to="/gestion"
              className="flex items-center gap-1.5 bg-yellow-600 text-white px-4 py-2 rounded-xl text-xs shrink-0 hover:bg-yellow-700 transition-colors"
              style={{ fontWeight: 600 }}>
              Traiter <ArrowRight size={13} />
            </Link>
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Revenus */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-700 mb-3">
              <DollarSign size={20} />
            </div>
            <p className="text-2xl text-gray-900" style={{ fontWeight: 700 }}>
              {loading ? "—" : `${revenusBruts.toLocaleString("fr-DZ")} DA`}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">Revenus totaux</p>
            {!loading && revenusBruts > 0 && (
              <p className="text-xs text-green-600 mt-1" style={{ fontWeight: 600 }}>
                {locationsActives.length} location{locationsActives.length > 1 ? "s" : ""} active{locationsActives.length > 1 ? "s" : ""}
              </p>
            )}
          </motion.div>

          {/* Annonces */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-700 mb-3">
              <ShoppingBag size={20} />
            </div>
            <p className="text-2xl text-gray-900" style={{ fontWeight: 700 }}>
              {loading ? "—" : tenuesActives.length}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">Annonces actives</p>
            {!loading && tenues.length > 0 && (
              <p className="text-xs text-blue-600 mt-1" style={{ fontWeight: 600 }}>
                {tenues.length} au total
              </p>
            )}
          </motion.div>

          {/* Locations */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="w-10 h-10 bg-[#1B4D3E]/10 rounded-xl flex items-center justify-center text-[#1B4D3E] mb-3">
              <TrendingUp size={20} />
            </div>
            <p className="text-2xl text-gray-900" style={{ fontWeight: 700 }}>
              {loading ? "—" : reservations.length}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">Total réservations</p>
            {!loading && (
              <p className="text-xs text-[#1B4D3E] mt-1" style={{ fontWeight: 600 }}>
                {reservations.filter(r => r.statut === "termine").length} terminée{reservations.filter(r => r.statut === "termine").length > 1 ? "s" : ""}
              </p>
            )}
          </motion.div>

          {/* Note */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-3">
              <Star size={20} />
            </div>
            <p className="text-2xl text-gray-900" style={{ fontWeight: 700 }}>
              {loading ? "—" : (currentUser?.rating ? currentUser.rating.toFixed(1) : "—")}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">Note moyenne</p>
            {currentUser?.rating && currentUser.rating > 0 ? (
              <p className="text-xs mt-1" style={{ fontWeight: 600, color: currentUser.rating >= 4.5 ? "#16a34a" : currentUser.rating >= 3.5 ? "#d97706" : "#dc2626" }}>
                ★ {currentUser.rating >= 4.5 ? "Excellente note" : currentUser.rating >= 3.5 ? "Bonne note" : "Note à améliorer"}
              </p>
            ) : (
              <p className="text-xs text-gray-400 mt-1">Aucune évaluation</p>
            )}
          </motion.div>
        </div>

        {/* Onglets */}
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-gray-100 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex-1 min-w-max px-4 py-2.5 rounded-lg text-sm transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? "bg-[#1B4D3E] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
              }`} style={{ fontWeight: 500 }}>
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* Vue d'ensemble */}
          {activeTab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Dernières réservations */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-gray-900" style={{ fontWeight: 700 }}>Dernières réservations</h3>
                  <Link to="/gestion" className="text-sm text-[#1B4D3E] hover:text-[#C9924A] flex items-center gap-1" style={{ fontWeight: 600 }}>
                    Gérer <ArrowRight size={13} />
                  </Link>
                </div>
                {loading ? (
                  <div className="flex justify-center py-8"><Loader2 size={24} className="animate-spin text-[#1B4D3E]" /></div>
                ) : reservations.length === 0 ? (
                  <div className="text-center py-8">
                    <CalendarDays size={36} className="mx-auto text-gray-200 mb-3" />
                    <p className="text-gray-400 text-sm">Aucune réservation reçue</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {reservations.slice(0, 5).map((res) => {
                      const img = getImg(res.tenue) ?? FALLBACK_IMG;
                      return (
                        <div key={res.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                          <img src={img} alt="" className="w-11 h-11 rounded-xl object-cover shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 truncate" style={{ fontWeight: 500 }}>{res.tenue?.titre ?? "Tenue"}</p>
                            <p className="text-xs text-gray-400">{res.locataire?.nom ?? "?"} · {res.date_debut}</p>
                          </div>
                          <div className="shrink-0">
                            <StatusBadge statut={res.statut} />
                          </div>
                        </div>
                      );
                    })}
                    {reservations.length > 5 && (
                      <Link to="/gestion" className="block text-center text-sm text-[#1B4D3E] hover:text-[#C9924A] py-2 border-t border-gray-50 mt-2" style={{ fontWeight: 600 }}>
                        Voir toutes les réservations ({reservations.length}) →
                      </Link>
                    )}
                  </div>
                )}
              </div>


              {/* Résumé financier */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-gray-900" style={{ fontWeight: 700 }}>Revenus des 6 derniers mois</h3>
                </div>
                {loading ? (
                  <div className="flex justify-center py-8"><Loader2 size={24} className="animate-spin text-[#1B4D3E]" /></div>
                ) : (
                  <div className="space-y-4">
                    {/* Résumé stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-green-50 rounded-xl p-4">
                        <p className="text-xs text-gray-500 mb-1">Revenus bruts</p>
                        <p className="text-lg text-gray-900" style={{ fontWeight: 700 }}>
                          {revenusBruts.toLocaleString("fr-DZ")} DA
                        </p>
                      </div>
                      <div className="bg-[#1B4D3E]/5 rounded-xl p-4">
                        <p className="text-xs text-gray-500 mb-1">Votre part (85%)</p>
                        <p className="text-lg text-[#1B4D3E]" style={{ fontWeight: 700 }}>
                          {Math.round(revenusBruts * 0.85).toLocaleString("fr-DZ")} DA
                        </p>
                      </div>
                    </div>

                    {/* Répartition par statut */}
                    <div className="space-y-2 pt-2">
                      {[
                        { label: "Locations terminées", count: reservations.filter(r => r.statut === "termine").length, cls: "bg-gray-200" },
                        { label: "En cours",            count: reservations.filter(r => r.statut === "en_cours").length, cls: "bg-[#1B4D3E]" },
                        { label: "Confirmées",          count: reservations.filter(r => r.statut === "confirme").length, cls: "bg-blue-400" },
                        { label: "En attente",          count: reservations.filter(r => r.statut === "demande").length,  cls: "bg-yellow-400" },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center gap-3">
                          <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.cls}`} />
                          <span className="text-sm text-gray-600 flex-1">{item.label}</span>
                          <span className="text-sm text-gray-900" style={{ fontWeight: 600 }}>{item.count}</span>
                        </div>
                      ))}
                    </div>

                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Mes annonces */}
          {activeTab === "listings" && (
            <motion.div key="listings" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-gray-900" style={{ fontWeight: 700 }}>
                  Toutes mes annonces ({tenues.length})
                </h3>
                <Link to="/ajouter-annonce" className="flex items-center gap-1.5 bg-[#1B4D3E] text-white px-4 py-2 rounded-xl text-sm" style={{ fontWeight: 600 }}>
                  <Plus size={14} /> Nouvelle
                </Link>
              </div>
              {loading ? (
                <div className="flex justify-center py-8"><Loader2 size={24} className="animate-spin text-[#1B4D3E]" /></div>
              ) : tenues.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag size={36} className="mx-auto text-gray-200 mb-3" />
                  <p className="text-gray-400 text-sm mb-4">Aucune annonce publiée</p>
                  <Link to="/ajouter-annonce" className="bg-[#1B4D3E] text-white px-6 py-2.5 rounded-full text-sm" style={{ fontWeight: 600 }}>
                    Créer ma première annonce
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {tenues.map((tenue) => {
                    const img = getImg(tenue) ?? FALLBACK_IMG;
                    return (
                      <div key={tenue.id} className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors">
                        <img src={img} alt={tenue.titre} className="w-14 h-14 rounded-xl object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-900 truncate" style={{ fontWeight: 600 }}>{tenue.titre}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{tenue.type} · {tenue.wilaya}</p>
                          <span className="text-sm text-[#1B4D3E]" style={{ fontWeight: 600 }}>
                            {parseFloat(tenue.prix_jour?.toString() ?? "0").toLocaleString("fr-DZ")} DA/j
                          </span>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`text-xs px-2.5 py-1 rounded-full ${tenue.statut === "disponible" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`} style={{ fontWeight: 500 }}>
                            {tenue.statut === "disponible" ? "Disponible" : "Indisponible"}
                          </span>
                          <div className="flex items-center gap-3">
                            <Link to={`/annonce/${tenue.id}`} className="text-xs text-gray-400 hover:text-[#1B4D3E] flex items-center gap-1">
                              <Eye size={12} /> Voir
                            </Link>
                            <button
                              onClick={() => supprimerTenue(tenue.id, tenue.titre)}
                              className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1 transition-colors"
                            >
                              <Trash2 size={12} /> Supprimer
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* Réservations (vue info) */}
          {activeTab === "reservations" && (
            <motion.div key="reservations" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="space-y-4">
              <div className="bg-[#1B4D3E] text-white rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-75 mb-1">Pour accepter, refuser ou terminer une réservation</p>
                  <p style={{ fontWeight: 700, fontSize: "1.1rem" }}>Accédez à la Gestion Complète</p>
                </div>
                <Link to="/gestion"
                  className="flex items-center gap-2 bg-white text-[#1B4D3E] px-5 py-2.5 rounded-xl text-sm shrink-0 hover:bg-gray-100 transition-colors"
                  style={{ fontWeight: 700 }}>
                  <BarChart3 size={16} /> Gérer →
                </Link>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                  <h3 className="text-gray-900" style={{ fontWeight: 700 }}>Toutes les réservations ({reservations.length})</h3>
                </div>
                {loading ? (
                  <div className="flex justify-center py-8"><Loader2 size={24} className="animate-spin text-[#1B4D3E]" /></div>
                ) : reservations.length === 0 ? (
                  <p className="text-center text-gray-400 text-sm py-8">Aucune réservation reçue</p>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {reservations.map((res) => {
                      const img = getImg(res.tenue) ?? FALLBACK_IMG;
                      return (
                        <div key={res.id} className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors">
                          <img src={img} alt="" className="w-13 h-13 rounded-xl object-cover shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-900" style={{ fontWeight: 600 }}>{res.tenue?.titre ?? "Tenue"}</p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {res.locataire?.nom ?? "?"} · {res.date_debut} → {res.date_fin}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1.5 shrink-0">
                            <StatusBadge statut={res.statut} />
                            <p className="text-sm text-gray-900" style={{ fontWeight: 600 }}>
                              {parseFloat(res.montant_total?.toString() ?? "0").toLocaleString("fr-DZ")} DA
                            </p>
                            {(res.statut === "confirme" || res.statut === "en_cours" || res.statut === "termine") && (
                              <button onClick={() => setContratModal(res)}
                                className="flex items-center gap-1 text-xs border border-[#1B4D3E]/40 text-[#1B4D3E] px-2.5 py-1 rounded-full hover:bg-[#1B4D3E]/5"
                                style={{ fontWeight: 500 }}>
                                <FileText size={10} />Contrat
                              </button>
                            )}
                            {res.statut === "termine" && !evaluatedIds.includes(res.id) && (
                              <button
                                onClick={() => setEvalModal({ open: true, reservationId: res.id, locataireNom: res.locataire?.nom ?? "Locataire" })}
                                className="flex items-center gap-1 text-xs bg-[#C9924A] text-white px-2.5 py-1 rounded-full hover:bg-[#b07d3a]"
                                style={{ fontWeight: 500 }}
                              >
                                <Star size={10} />Évaluer
                              </button>
                            )}
                            {res.statut === "termine" && evaluatedIds.includes(res.id) && (
                              <span className="text-xs text-green-600 flex items-center gap-1">
                                <CheckCircle size={11} />Avis envoyé
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Revenus */}
          {activeTab === "revenus" && (
            <motion.div key="revenus" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Revenus bruts",       value: revenusBruts, color: "text-gray-900" },
                { label: `Commission KASEWA (${currentUser?.type_proprietaire === "boutique" ? "15" : "19"}%)`, value: Math.round(revenusBruts * (currentUser?.type_proprietaire === "boutique" ? 0.15 : 0.19)), color: "text-red-500" },
                { label: `Votre part nette (${currentUser?.type_proprietaire === "boutique" ? "85" : "81"}%)`, value: Math.round(revenusBruts * (currentUser?.type_proprietaire === "boutique" ? 0.85 : 0.81)), color: "text-[#1B4D3E]" },
              ].map((item) => (
                <div key={item.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                  <p className="text-xs text-gray-400 mb-3">{item.label}</p>
                  <p className={`text-3xl ${item.color}`} style={{ fontWeight: 700 }}>
                    {loading ? "—" : `${item.value.toLocaleString("fr-DZ")} DA`}
                  </p>
                </div>
              ))}

              <div className="sm:col-span-3 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-gray-900 mb-4" style={{ fontWeight: 700 }}>Détail par location</h3>
                {loading ? (
                  <div className="flex justify-center py-6"><Loader2 size={24} className="animate-spin text-[#1B4D3E]" /></div>
                ) : reservations.filter(r => r.statut === "en_cours" || r.statut === "termine").length === 0 ? (
                  <p className="text-center text-gray-400 text-sm py-6">Aucun revenu enregistré</p>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {reservations
                      .filter(r => r.statut === "en_cours" || r.statut === "termine")
                      .map((res) => (
                        <div key={res.id} className="flex items-center justify-between py-3">
                          <div>
                            <p className="text-sm text-gray-900" style={{ fontWeight: 500 }}>{res.tenue?.titre ?? "Tenue"}</p>
                            <p className="text-xs text-gray-400">{res.locataire?.nom ?? "?"} · {res.date_debut}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-900" style={{ fontWeight: 700 }}>
                              +{Math.round(parseFloat(res.montant_total?.toString() ?? "0") * 0.85).toLocaleString("fr-DZ")} DA
                            </p>
                            <p className="text-xs text-gray-400">net</p>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Contrat de location */}
      {contratModal && currentUser && (
        <ContratLocation
          reservation={resaToFrontend(contratModal)}
          locataireNom={contratModal.locataire?.nom ?? "Locataire"}
          locataireEmail={contratModal.locataire?.email ?? ""}
          onClose={() => setContratModal(null)}
        />
      )}

      {/* Contrat Plateforme */}
      {contratPlatOpen && currentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 shrink-0">
              <h2 className="text-gray-900" style={{ fontWeight: 700 }}>Contrat d'adhésion — KASEWA.DZ</h2>
              <div className="flex items-center gap-2">
                <button onClick={() => {
                    const w = window.open("", "_blank", "width=900,height=700");
                    if (!w) return;
                    w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Contrat Plateforme</title>
                    <style>body{font-family:Arial,sans-serif;font-size:13px;color:#222;padding:40px;max-width:800px;margin:0 auto}
                    h1{color:#1B4D3E;font-size:20px;border-bottom:3px solid #C9924A;padding-bottom:12px;margin-bottom:20px}
                    h3{color:#1B4D3E;margin-top:20px;margin-bottom:8px}p{color:#555;margin-bottom:8px;line-height:1.6}
                    .box{background:#FAF6EF;border:2px solid #C9924A;border-radius:8px;padding:16px;margin:16px 0}
                    .parties{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:20px 0}
                    .partie{border:2px solid #1B4D3E;border-radius:8px;padding:14px}
                    .sign{display:grid;grid-template-columns:1fr 1fr;gap:30px;margin-top:30px}
                    .sign-box{border-top:2px solid #1B4D3E;padding-top:10px}
                    footer{text-align:center;margin-top:30px;padding-top:12px;border-top:1px solid #ddd;font-size:10px;color:#aaa}
                    @media print{@page{margin:15mm}}</style></head><body>
                    <h1>CONTRAT D'ADHÉSION À LA PLATEFORME KASEWA.DZ</h1>
                    <div class="box"><p><strong>N° :</strong> PLAT-${String(currentUser.id ?? "").padStart(6,"0")}</p>
                    <p><strong>Date :</strong> ${new Date().toLocaleDateString("fr-DZ",{day:"2-digit",month:"long",year:"numeric"})}</p></div>
                    <div class="parties">
                    <div class="partie"><h3>La Plateforme</h3><p><strong>KASEWA DZ SARL</strong></p><p>Tlemcen, Algérie</p><p>contact@kasewa.dz</p></div>
                    <div class="partie"><h3>Le Propriétaire</h3><p><strong>${currentUser.name}</strong></p><p>Type : ${currentUser.type_proprietaire === "boutique" ? "Boutique professionnelle" : "Investisseur particulier"}</p></div>
                    </div>
                    <h3>Article 1 — Objet</h3><p>Ce contrat régit les conditions dans lesquelles le propriétaire met à disposition des tenues traditionnelles algériennes en location via la plateforme numérique KASEWA.DZ.</p>
                    <h3>Article 2 — Obligations de la plateforme</h3><p>• Mettre à disposition un espace de publication d'annonces<br>• Assurer la mise en relation avec les locataires<br>• Gérer les litiges via un système de médiation neutre<br>• Verser les revenus nets dans les 5 jours ouvrés après confirmation de location</p>
                    <h3>Article 3 — Obligations du propriétaire</h3><p>• Fournir des informations exactes sur chaque tenue (photos, état, dimensions)<br>• Assurer la disponibilité des tenues aux dates annoncées<br>• Restituer la caution dans un délai de 48h après retour en bon état<br>• Respecter les prix annoncés sur la plateforme</p>
                    <h3>Article 4 — Commission plateforme</h3><p>La plateforme prélève une commission de <strong>${currentUser.type_proprietaire === "boutique" ? "15%" : "19%"}</strong> sur le montant de chaque location. La commission est prélevée automatiquement avant le versement des revenus nets.</p>
                    <h3>Article 5 — Médiation et litiges</h3><p>En cas de litige avec un locataire, les parties s'engagent à recourir au système de médiation KASEWA.DZ avant tout recours judiciaire.</p>
                    <h3>Article 6 — Durée et résiliation</h3><p>Ce contrat est conclu pour une durée indéterminée. Chaque partie peut y mettre fin avec un préavis de 30 jours par voie électronique.</p>
                    <div class="sign"><div class="sign-box"><p><strong>Signature KASEWA.DZ</strong></p><p style="font-size:11px;color:#888">Lu et approuvé</p><div style="height:60px;border-bottom:1px dashed #aaa;margin-top:8px"></div></div>
                    <div class="sign-box"><p><strong>Signature du Propriétaire</strong></p><p style="font-size:11px;color:#888">Lu et approuvé</p><div style="height:60px;border-bottom:1px dashed #aaa;margin-top:8px"></div></div></div>
                    <footer>KASEWA.DZ — Plateforme de location de tenues traditionnelles algériennes — Tlemcen, Algérie</footer>
                    <script>window.onload=function(){window.print()}<\/script></body></html>`);
                    w.document.close();
                  }}
                  className="flex items-center gap-2 bg-[#1B4D3E] text-white px-4 py-2 rounded-xl text-sm hover:bg-[#2d6b55]"
                  style={{ fontWeight: 600 }}>
                  <Printer size={16} />Télécharger PDF
                </button>
                <button onClick={() => setContratPlatOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400">
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto flex-1 p-6 bg-gray-50">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 max-w-2xl mx-auto" style={{ fontFamily: "'Segoe UI', Arial, sans-serif", fontSize: "13px" }}>
                {/* En-tête */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "3px solid #C9924A", paddingBottom: "20px", marginBottom: "20px" }}>
                  <div>
                    <h1 style={{ color: "#1B4D3E", fontSize: "18px", fontWeight: 700 }}>CONTRAT D'ADHÉSION</h1>
                    <p style={{ color: "#C9924A", fontSize: "14px", fontWeight: 600, marginTop: "4px" }}>Plateforme KASEWA.DZ</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ color: "#888", fontSize: "11px" }}>N° PLAT-{String(currentUser.id ?? "").padStart(6, "0")}</p>
                    <p style={{ color: "#888", fontSize: "11px", marginTop: "2px" }}>
                      {new Date().toLocaleDateString("fr-DZ", { day: "2-digit", month: "long", year: "numeric" })}
                    </p>
                  </div>
                </div>

                {/* Citation */}
                <div style={{ background: "#FAF6EF", borderLeft: "4px solid #C9924A", padding: "12px 16px", marginBottom: "20px", fontStyle: "italic", color: "#666", fontSize: "12px", borderRadius: "4px" }}>
                  "En rejoignant KASEWA.DZ, vous contribuez à la valorisation du patrimoine vestimentaire algérien."
                  <div style={{ textAlign: "right", marginTop: "6px", fontSize: "11px", fontWeight: 600, color: "#1B4D3E" }}>— L'équipe KASEWA.DZ —</div>
                </div>

                {/* Parties */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                  <div style={{ border: "2px solid #C9924A", borderRadius: "8px", padding: "14px", background: "#FAF6EF" }}>
                    <h3 style={{ color: "#1B4D3E", fontWeight: 700, fontSize: "12px", textTransform: "uppercase", borderBottom: "2px solid #C9924A", paddingBottom: "6px", marginBottom: "10px" }}>La Plateforme</h3>
                    <p style={{ fontWeight: 600, color: "#222", marginBottom: "4px" }}>KASEWA DZ SARL</p>
                    <p style={{ color: "#555", fontSize: "12px" }}>Tlemcen, Algérie</p>
                    <p style={{ color: "#555", fontSize: "12px" }}>contact@kasewa.dz</p>
                  </div>
                  <div style={{ border: "2px solid #1B4D3E", borderRadius: "8px", padding: "14px", background: "#fff" }}>
                    <h3 style={{ color: "#1B4D3E", fontWeight: 700, fontSize: "12px", textTransform: "uppercase", borderBottom: "2px solid #1B4D3E", paddingBottom: "6px", marginBottom: "10px" }}>Le Propriétaire</h3>
                    <p style={{ fontWeight: 600, color: "#222", marginBottom: "4px" }}>{currentUser.name}</p>
                    <p style={{ color: "#555", fontSize: "12px" }}>Type : {currentUser.type_proprietaire === "boutique" ? "Boutique professionnelle" : "Investisseur particulier"}</p>
                    <p style={{ color: "#555", fontSize: "12px" }}>Commission : {currentUser.type_proprietaire === "boutique" ? "15%" : "19%"}</p>
                  </div>
                </div>

                {/* Articles */}
                {[
                  { titre: "Article 1 — Objet", texte: "Ce contrat régit les conditions dans lesquelles le propriétaire met à disposition des tenues traditionnelles algériennes en location via la plateforme numérique KASEWA.DZ." },
                  { titre: "Article 2 — Obligations de la plateforme", texte: "• Mettre à disposition un espace de publication d'annonces\n• Assurer la mise en relation avec les locataires\n• Gérer les litiges via un système de médiation neutre\n• Verser les revenus nets dans les 5 jours ouvrés après confirmation" },
                  { titre: "Article 3 — Obligations du propriétaire", texte: "• Fournir des informations exactes sur chaque tenue (photos, état, dimensions)\n• Assurer la disponibilité des tenues aux dates annoncées\n• Restituer la caution dans un délai de 48h après retour en bon état\n• Respecter les prix annoncés sur la plateforme" },
                  { titre: "Article 4 — Commission plateforme", texte: `La plateforme prélève une commission de ${currentUser.type_proprietaire === "boutique" ? "15%" : "19%"} sur le montant de chaque location. La commission est prélevée automatiquement avant le versement des revenus nets.` },
                  { titre: "Article 5 — Médiation et litiges", texte: "En cas de litige avec un locataire, les parties s'engagent à recourir au système de médiation KASEWA.DZ avant tout recours judiciaire." },
                  { titre: "Article 6 — Durée et résiliation", texte: "Ce contrat est conclu pour une durée indéterminée. Chaque partie peut y mettre fin avec un préavis de 30 jours par voie électronique." },
                ].map((art) => (
                  <div key={art.titre} style={{ borderLeft: "3px solid #C9924A", paddingLeft: "14px", marginBottom: "16px" }}>
                    <h3 style={{ color: "#1B4D3E", fontWeight: 700, fontSize: "13px", marginBottom: "6px" }}>{art.titre}</h3>
                    <p style={{ color: "#555", fontSize: "12px", lineHeight: "1.7", whiteSpace: "pre-line" }}>{art.texte}</p>
                  </div>
                ))}

                {/* Signatures */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginTop: "24px", paddingTop: "20px", borderTop: "1px solid #eee" }}>
                  {["Signature KASEWA.DZ", "Signature du Propriétaire"].map((s) => (
                    <div key={s}>
                      <p style={{ fontSize: "12px", fontWeight: 600, color: "#444", marginBottom: "4px" }}>{s}</p>
                      <p style={{ fontSize: "11px", color: "#888", marginBottom: "8px" }}>Lu et approuvé</p>
                      <div style={{ height: "60px", borderBottom: "1px dashed #aaa" }} />
                    </div>
                  ))}
                </div>

                <div style={{ textAlign: "center", marginTop: "20px", fontSize: "10px", color: "#bbb", paddingTop: "12px", borderTop: "1px solid #eee" }}>
                  KASEWA.DZ — Plateforme de location de tenues traditionnelles algériennes — Tlemcen, Algérie
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal évaluation locataire */}
      {evalModal?.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900" style={{ fontWeight: 700 }}>Évaluer le locataire</h3>
              <button onClick={() => setEvalModal(null)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <p className="text-gray-500 text-sm mb-5">{evalModal.locataireNom}</p>
            <div className="flex gap-2 justify-center mb-5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => setEvalNote(n)}>
                  <Star size={28} className={n <= evalNote ? "fill-[#C9924A] text-[#C9924A]" : "text-gray-200"} />
                </button>
              ))}
            </div>
            <textarea
              value={evalComment}
              onChange={(e) => setEvalComment(e.target.value)}
              placeholder="Commentaire (optionnel)..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9924A] mb-4 resize-none"
            />
            <div className="flex gap-3">
              <button onClick={() => setEvalModal(null)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm">
                Annuler
              </button>
              <button onClick={soumettreEvalProprio} disabled={evalLoading}
                className="flex-1 bg-[#C9924A] text-white py-2.5 rounded-xl text-sm disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ fontWeight: 600 }}>
                {evalLoading ? <Loader2 size={16} className="animate-spin" /> : null}
                Publier l'avis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

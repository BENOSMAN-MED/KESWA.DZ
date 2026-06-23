import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Search, Clock, CheckCircle, XCircle, Star, Package, CreditCard, MessageCircle, Loader2, Heart, MapPin, Tag, FileText, AlertTriangle, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import { reservationsApi, evaluationsApi, favorisApi } from "../../services/api";
import { motion, AnimatePresence } from "motion/react";
import { PaiementModal } from "../components/PaiementModal";
import { ContratLocation } from "../components/ContratLocation";
import { toast } from "react-toastify";
import { STORAGE_URL } from "../../services/storageUrl";
const FALLBACK_IMG = "https://images.unsplash.com/photo-1649109669258-84a962e88a32?w=120&h=120&fit=crop";

interface TenueFavori {
  id: number;
  titre: string;
  type: string;
  wilaya?: string;
  prix_jour: number;
  note_moyenne?: string;
  photos?: { chemin: string }[];
}

interface Reservation {
  id: number;
  tenue_id: number;
  tenue?: {
    id: number;
    titre: string;
    caution: number;
    photo_principale?: { chemin: string };
    proprietaire?: { id: number; nom: string };
  };
  date_debut: string;
  date_fin: string;
  montant_total: number;
  statut: "demande" | "confirme" | "en_cours" | "termine" | "annule";
  reception_confirmee?: boolean;
  retour_signale?: boolean;
  paiements?: { mode: string; statut: string }[];
}

const STATUT_MAP: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
  demande:  { label: "En attente",  cls: "bg-yellow-100 text-yellow-700", icon: <Clock size={12} /> },
  confirme: { label: "Confirmée",   cls: "bg-blue-100 text-blue-700",    icon: <CheckCircle size={12} /> },
  en_cours: { label: "En cours",    cls: "bg-[#1B4D3E]/10 text-[#1B4D3E]", icon: <CheckCircle size={12} /> },
  termine:  { label: "Terminée",    cls: "bg-gray-100 text-gray-600",    icon: <CheckCircle size={12} /> },
  annule:   { label: "Annulée",     cls: "bg-red-100 text-red-600",      icon: <XCircle size={12} /> },
};

function StatusBadge({ statut }: { statut: string }) {
  const s = STATUT_MAP[statut] ?? STATUT_MAP.demande;
  return (
    <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs ${s.cls}`} style={{ fontWeight: 500 }}>
      {s.icon} {s.label}
    </span>
  );
}

interface EvalModal { open: boolean; reservationId: number; titre: string }

export function RenterDashboard() {
  const { currentUser, toggleFavori, isFavori } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("bookings");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [payModal, setPayModal] = useState<{ open: boolean; reservation: Reservation | null }>({ open: false, reservation: null });
  const [contratModal, setContratModal] = useState<Reservation | null>(null);
  const [evalModal, setEvalModal] = useState<EvalModal>({ open: false, reservationId: 0, titre: "" });
  const [evalNote, setEvalNote] = useState(5);
  const [evalComment, setEvalComment] = useState("");
  const [evalLoading, setEvalLoading] = useState(false);
  const [favoris, setFavoris] = useState<TenueFavori[]>([]);
  const [loadingFavoris, setLoadingFavoris] = useState(false);
  const [litigeModal, setLitigeModal] = useState<{ reservationId: number; titre: string } | null>(null);
  const [litigeDesc, setLitigeDesc] = useState("");
  const [litigeLoading, setLitigeLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) { navigate("/connexion"); return; }
    chargerReservations();
  }, [currentUser]);

  useEffect(() => {
    if (activeTab === "favoris" && currentUser) {
      setLoadingFavoris(true);
      favorisApi.mes()
        .then((res) => setFavoris(res.data ?? []))
        .catch(() => setFavoris([]))
        .finally(() => setLoadingFavoris(false));
    }
  }, [activeTab]);

  const chargerReservations = async () => {
    setLoading(true);
    try {
      const res = await reservationsApi.mesReservations();
      setReservations(res.data?.data ?? res.data ?? []);
    } catch {
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  const annuler = async (id: number) => {
    if (!confirm("Annuler cette réservation ?")) return;
    try {
      await reservationsApi.annuler(id);
      toast.success("Réservation annulée");
      chargerReservations();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Erreur lors de l'annulation");
    }
  };

  const confirmerReception = async (id: number) => {
    try {
      await reservationsApi.confirmerReception(id);
      toast.success("Réception confirmée ! Le propriétaire a été notifié.");
      chargerReservations();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Erreur");
    }
  };

  const signalerRetour = async (id: number) => {
    if (!confirm("Confirmer que vous avez retourné la tenue au propriétaire ?")) return;
    try {
      await reservationsApi.signalerRetour(id);
      toast.success("Retour signalé ! Le propriétaire a été notifié pour confirmer la réception.");
      chargerReservations();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Erreur");
    }
  };

  const soumettrelitige = async () => {
    if (!litigeModal) return;
    if (litigeDesc.trim().length < 20) {
      toast.error("Décrivez le problème en au moins 20 caractères.");
      return;
    }
    setLitigeLoading(true);
    try {
      await reservationsApi.ouvrirLitige(litigeModal.reservationId, litigeDesc);
      toast.success("Litige signalé. Le propriétaire a été notifié et un message lui a été envoyé.");
      setLitigeModal(null);
      setLitigeDesc("");
      chargerReservations();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Impossible d'ouvrir le litige");
    } finally {
      setLitigeLoading(false);
    }
  };

  const soumettreEval = async () => {
    setEvalLoading(true);
    try {
      await evaluationsApi.soumettre(evalModal.reservationId, evalNote, evalComment || undefined);
      toast.success(`Merci pour votre avis ! ${evalNote} étoiles — Avis publié.`);
      setEvalModal({ open: false, reservationId: 0, titre: "" });
      setEvalNote(5); setEvalComment("");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Impossible de soumettre l'avis");
    } finally {
      setEvalLoading(false);
    }
  };

  const stats = [
    { label: "Locations réalisées", value: reservations.filter(r => r.statut === "termine").length, icon: <Package size={18} />, bg: "bg-blue-50", color: "text-blue-700" },
    { label: "En cours", value: reservations.filter(r => ["en_cours", "confirme", "demande"].includes(r.statut)).length, icon: <Clock size={18} />, bg: "bg-amber-50", color: "text-amber-600" },
    { label: "Note reçue", value: currentUser?.rating ? currentUser.rating.toFixed(1) : "—", icon: <Star size={18} />, bg: "bg-[#1B4D3E]/10", color: "text-[#1B4D3E]" },
  ];

  const tabs = [
    { key: "bookings", label: "Mes réservations" },
    { key: "history", label: "Historique" },
    { key: "favoris",  label: "❤️ Favoris" },
    { key: "profile",  label: "Mon profil" },
  ];

  const resaToFrontend = (res: Reservation) => {
    const nbJours = Math.max(1, Math.round(
      (new Date(res.date_fin).getTime() - new Date(res.date_debut).getTime()) / (1000 * 60 * 60 * 24)
    ) + 1);
    return {
      id: String(res.id),
      tenueId: String(res.tenue_id),
      tenueTitre: res.tenue?.titre ?? "Tenue",
      tenueImage: "",
      tenueType: "",
      proprietaireNom: res.tenue?.proprietaire?.nom ?? "Propriétaire",
      locataireNom: currentUser?.name ?? "",
      locatairePhone: "",
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-gray-900" style={{ fontSize: "1.6rem", fontWeight: 700 }}>
              Bonjour, {currentUser.name.split(" ")[0]} 👋
            </h1>
            <p className="text-gray-500 mt-1">Gérez vos locations et découvrez de nouvelles tenues</p>
          </div>
          <div className="flex gap-2">
            <Link to="/messages"
              className="flex items-center gap-2 bg-white border border-[#1B4D3E]/30 text-[#1B4D3E] px-4 py-2.5 rounded-xl text-sm hover:bg-[#1B4D3E]/5 transition-colors"
              style={{ fontWeight: 600 }}>
              <MessageCircle size={16} />Messages
            </Link>
            <Link to="/catalogue"
              className="flex items-center gap-2 bg-[#C9924A] text-white px-5 py-2.5 rounded-xl text-sm hover:bg-[#b5803c] transition-colors"
              style={{ fontWeight: 600 }}>
              <Search size={16} />Explorer le catalogue
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
              <div className={`w-9 h-9 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>{stat.icon}</div>
              <p className="text-xl text-gray-900" style={{ fontWeight: 700 }}>{stat.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-gray-100 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex-1 min-w-max px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap ${
                activeTab === tab.key ? "bg-[#C9924A] text-white shadow-sm" : "text-gray-600 hover:text-gray-800"
              }`} style={{ fontWeight: 500 }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div className="space-y-4">
            <AnimatePresence>
              {reservations.filter(r => r.statut === "confirme").length > 0 && (
                <motion.div key="confirmed-alert" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                    <CreditCard size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-blue-900 text-sm mb-1" style={{ fontWeight: 700 }}>💳 Réservation confirmée — Procédez au paiement</h4>
                    <p className="text-blue-700 text-sm">Le propriétaire a accepté votre demande ! Cliquez sur "Payer maintenant" pour finaliser.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 size={32} className="animate-spin text-[#1B4D3E]" />
              </div>
            ) : reservations.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <p className="text-4xl mb-3">📦</p>
                <h3 className="text-gray-700 mb-2" style={{ fontWeight: 600 }}>Aucune réservation en cours</h3>
                <p className="text-gray-400 text-sm mb-6">Explorez notre catalogue pour trouver votre tenue idéale</p>
                <Link to="/catalogue" className="bg-[#C9924A] text-white px-6 py-2.5 rounded-full text-sm" style={{ fontWeight: 500 }}>
                  Explorer le catalogue
                </Link>
              </div>
            ) : (
              reservations.filter(r => r.statut !== "termine" && r.statut !== "annule").map((res) => {
                const img = res.tenue?.photo_principale ? STORAGE_URL + res.tenue.photo_principale.chemin : FALLBACK_IMG;
                return (
                  <div key={res.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex gap-4 p-5">
                      <img src={img} alt="" className="w-20 h-20 rounded-xl object-cover" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-gray-900" style={{ fontWeight: 600 }}>{res.tenue?.titre ?? "Tenue"}</p>
                            <p className="text-xs text-gray-400 mt-0.5">Par {res.tenue?.proprietaire?.nom ?? "Propriétaire"}</p>
                          </div>
                          <StatusBadge statut={res.statut} />
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
                          <p className="text-xs text-gray-500">📅 {res.date_debut} → {res.date_fin}</p>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                          <div>
                            <p className="text-sm text-gray-900" style={{ fontWeight: 700 }}>
                              {parseFloat(res.montant_total?.toString() ?? "0").toLocaleString("fr-DZ")} DA
                            </p>
                            <p className="text-xs text-gray-400">dont caution {parseFloat(res.tenue?.caution?.toString() ?? "0").toLocaleString("fr-DZ")} DA</p>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            {res.statut === "confirme" && (
                              <button onClick={() => setPayModal({ open: true, reservation: res })}
                                className="flex items-center gap-1 text-xs bg-[#C9924A] text-white px-3 py-1.5 rounded-full hover:bg-[#b5803c] animate-pulse"
                                style={{ fontWeight: 600 }}>
                                <CreditCard size={12} />💳 Payer maintenant
                              </button>
                            )}
                            {(res.statut === "confirme" || res.statut === "en_cours") && (
                              <button onClick={() => setContratModal(res)}
                                className="flex items-center gap-1 text-xs border border-[#1B4D3E]/40 text-[#1B4D3E] px-3 py-1.5 rounded-full hover:bg-[#1B4D3E]/5"
                                style={{ fontWeight: 600 }}>
                                <FileText size={12} />Contrat
                              </button>
                            )}
                            {res.statut === "en_cours" && !res.reception_confirmee && (
                              <button onClick={() => confirmerReception(res.id)}
                                className="flex items-center gap-1 text-xs bg-green-600 text-white px-3 py-1.5 rounded-full hover:bg-green-700"
                                style={{ fontWeight: 600 }}>
                                <CheckCircle size={12} />J'ai reçu la tenue
                              </button>
                            )}
                            {res.statut === "en_cours" && res.reception_confirmee && !res.retour_signale && (
                              <button onClick={() => signalerRetour(res.id)}
                                className="flex items-center gap-1 text-xs bg-blue-600 text-white px-3 py-1.5 rounded-full hover:bg-blue-700"
                                style={{ fontWeight: 600 }}>
                                <Package size={12} />J'ai retourné la tenue
                              </button>
                            )}
                            {res.statut === "en_cours" && res.retour_signale && (
                              <span className="flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full">
                                <Clock size={12} />En attente propriétaire
                              </span>
                            )}
                            {(res.statut === "confirme" || res.statut === "en_cours") && (
                              <button onClick={() => setLitigeModal({ reservationId: res.id, titre: res.tenue?.titre ?? "Tenue" })}
                                className="flex items-center gap-1 text-xs border border-orange-300 text-orange-600 px-3 py-1.5 rounded-full hover:bg-orange-50"
                                style={{ fontWeight: 600 }}>
                                <AlertTriangle size={12} />Signaler litige
                              </button>
                            )}
                            {res.statut === "demande" && (
                              <button onClick={() => annuler(res.id)}
                                className="text-xs bg-red-100 text-red-600 px-3 py-1.5 rounded-full hover:bg-red-200">
                                Annuler
                              </button>
                            )}
                            <Link to={`/annonce/${res.tenue_id}`}
                              className="text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full hover:border-[#1B4D3E]">
                              Voir l'annonce
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-gray-900" style={{ fontWeight: 700 }}>Historique complet</h3>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-8"><Loader2 size={24} className="animate-spin text-[#1B4D3E]" /></div>
            ) : (
              <div className="divide-y divide-gray-50">
                {reservations.map((res) => {
                  const img = res.tenue?.photo_principale ? STORAGE_URL + res.tenue.photo_principale.chemin : FALLBACK_IMG;
                  return (
                    <div key={res.id} className="flex items-center gap-4 p-5">
                      <img src={img} alt="" className="w-12 h-12 rounded-xl object-cover" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-900" style={{ fontWeight: 500 }}>{res.tenue?.titre ?? "Tenue"}</p>
                        <p className="text-xs text-gray-400">{res.date_debut} → {res.date_fin}</p>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <StatusBadge statut={res.statut} />
                        <p className="text-xs text-gray-500">{parseFloat(res.montant_total?.toString() ?? "0").toLocaleString("fr-DZ")} DA</p>
                        {res.statut === "termine" && (
                          <div className="flex gap-1.5">
                            <button onClick={() => setContratModal(res)}
                              className="text-xs border border-[#1B4D3E]/40 text-[#1B4D3E] px-2.5 py-1 rounded-full flex items-center gap-1 hover:bg-[#1B4D3E]/5"
                              style={{ fontWeight: 500 }}>
                              <FileText size={10} />Contrat
                            </button>
                            <button onClick={() => setEvalModal({ open: true, reservationId: res.id, titre: res.tenue?.titre ?? "" })}
                              className="text-xs bg-[#C9924A] text-white px-2.5 py-1 rounded-full flex items-center gap-1"
                              style={{ fontWeight: 500 }}>
                              <Star size={10} />Évaluer
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                {reservations.length === 0 && (
                  <p className="text-center text-gray-400 text-sm py-8">Aucune réservation dans l'historique</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Favoris Tab */}
        {activeTab === "favoris" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900" style={{ fontWeight: 700 }}>
                Mes tenues sauvegardées ({favoris.length})
              </h3>
            </div>
            {loadingFavoris ? (
              <div className="flex justify-center py-16">
                <Loader2 size={32} className="animate-spin text-[#1B4D3E]" />
              </div>
            ) : favoris.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <Heart size={40} className="mx-auto text-gray-200 mb-3" />
                <h3 className="text-gray-700 mb-2" style={{ fontWeight: 600 }}>Aucun favori enregistré</h3>
                <p className="text-gray-400 text-sm mb-6">Cliquez sur le cœur d'une tenue pour la sauvegarder ici</p>
                <Link to="/catalogue" className="bg-[#C9924A] text-white px-6 py-2.5 rounded-full text-sm" style={{ fontWeight: 500 }}>
                  Explorer le catalogue
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {favoris.map((t) => {
                  const img = t.photos?.[0]?.chemin ? STORAGE_URL + t.photos[0].chemin : FALLBACK_IMG;
                  const note = t.note_moyenne ? parseFloat(t.note_moyenne) : null;
                  return (
                    <div key={t.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Link to={`/annonce/${t.id}`}>
                          <img src={img} alt={t.titre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }} />
                        </Link>
                        <div className="absolute top-2 left-2">
                          <span className="bg-white/90 text-[#1B4D3E] text-xs px-2 py-0.5 rounded-full flex items-center gap-1" style={{ fontWeight: 500 }}>
                            <Tag size={10} />{t.type}
                          </span>
                        </div>
                        <button
                          onClick={async () => {
                            await toggleFavori(t.id);
                            setFavoris((prev) => prev.filter((f) => f.id !== t.id));
                          }}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white shadow"
                        >
                          <Heart size={14} className="fill-red-500 text-red-500" />
                        </button>
                      </div>
                      <div className="p-3">
                        <Link to={`/annonce/${t.id}`}>
                          <p className="text-gray-900 text-sm truncate" style={{ fontWeight: 600 }}>{t.titre}</p>
                        </Link>
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center gap-1 text-gray-400">
                            <MapPin size={11} />
                            <span className="text-xs">{t.wilaya || "—"}</span>
                          </div>
                          {note ? (
                            <div className="flex items-center gap-1">
                              <Star size={11} className="fill-[#C9924A] text-[#C9924A]" />
                              <span className="text-xs text-gray-600" style={{ fontWeight: 500 }}>{note.toFixed(1)}</span>
                            </div>
                          ) : null}
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                          <span className="text-[#1B4D3E] text-sm" style={{ fontWeight: 700 }}>
                            {Number(t.prix_jour).toLocaleString("fr-DZ")} DA/j
                          </span>
                          <Link to={`/annonce/${t.id}`} className="text-xs bg-[#1B4D3E] text-white px-3 py-1 rounded-full" style={{ fontWeight: 500 }}>
                            Réserver
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-5 mb-8 pb-6 border-b border-gray-100">
              <div className="w-20 h-20 bg-[#C9924A] rounded-full flex items-center justify-center text-white text-3xl" style={{ fontWeight: 700 }}>
                {currentUser.name[0]}
              </div>
              <div>
                <h2 className="text-gray-900 text-xl" style={{ fontWeight: 700 }}>{currentUser.name}</h2>
                <p className="text-gray-400 text-sm">{currentUser.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  {currentUser.verified ? (
                    <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
                      <CheckCircle size={11} />Vérifié
                    </span>
                  ) : (
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full">Non vérifié</span>
                  )}
                  <span className="text-xs bg-[#C9924A]/10 text-[#C9924A] px-2.5 py-1 rounded-full">Locataire</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Nom complet", value: currentUser.name },
                { label: "Email", value: currentUser.email },
                { label: "Téléphone", value: currentUser.phone || "—" },
                { label: "Wilaya", value: currentUser.wilaya || "—" },
                { label: "Membre depuis", value: currentUser.joinedDate || "—" },
                { label: "Locations effectuées", value: String(reservations.filter(r => r.statut === "termine").length) },
              ].map((field, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-400 mb-1" style={{ fontWeight: 500 }}>{field.label}</p>
                  <p className="text-sm text-gray-800" style={{ fontWeight: 500 }}>{field.value}</p>
                </div>
              ))}
            </div>
            <Link to="/profil" className="mt-6 inline-block bg-[#1B4D3E] text-white px-6 py-2.5 rounded-xl text-sm hover:bg-[#2d6b55]" style={{ fontWeight: 500 }}>
              Modifier mon profil
            </Link>
          </div>
        )}
      </div>

      {/* Paiement Modal */}
      {payModal.reservation && (
        <PaiementModal
          isOpen={payModal.open}
          onClose={() => setPayModal({ open: false, reservation: null })}
          reservationId={payModal.reservation.id}
          montantLocation={parseFloat(payModal.reservation.montant_total?.toString() ?? "0")}
          caution={parseFloat(payModal.reservation.tenue?.caution?.toString() ?? "0")}
          tenueTitre={payModal.reservation.tenue?.titre ?? "Tenue"}
          onVoirContrat={() => {
            setContratModal(payModal.reservation);
          }}
          onSuccess={() => {
            toast.success("Reçu envoyé ! L'admin vérifiera votre paiement sous 24h.");
            setPayModal({ open: false, reservation: null });
            chargerReservations();
          }}
        />
      )}

      {/* Contrat de location (après PayModal pour z-index DOM) */}
      {contratModal && (
        <ContratLocation
          reservation={resaToFrontend(contratModal)}
          locataireNom={currentUser.name}
          locataireEmail={currentUser.email}
          onClose={() => setContratModal(null)}
        />
      )}

      {/* Litige Modal */}
      {litigeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle size={20} className="text-orange-500" />
                <h3 className="text-gray-900" style={{ fontWeight: 700 }}>Signaler un litige</h3>
              </div>
              <button onClick={() => { setLitigeModal(null); setLitigeDesc(""); }}
                className="p-1 rounded-full hover:bg-gray-100">
                <X size={18} className="text-gray-400" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">Réservation : <span style={{ fontWeight: 600 }}>{litigeModal.titre}</span></p>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
              <p className="text-orange-800 text-sm" style={{ fontWeight: 600 }}>⚠️ Avant de signaler un litige</p>
              <p className="text-orange-700 text-xs mt-1">Contactez d'abord le propriétaire via la messagerie. Le litige est réservé aux situations non résolues.</p>
            </div>
            <textarea
              value={litigeDesc}
              onChange={(e) => setLitigeDesc(e.target.value)}
              placeholder="Décrivez le problème en détail (minimum 20 caractères)..."
              rows={5}
              maxLength={1000}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 resize-none mb-1"
            />
            <p className="text-xs text-gray-400 text-right mb-4">{litigeDesc.length}/1000</p>
            <div className="flex gap-3">
              <button onClick={() => { setLitigeModal(null); setLitigeDesc(""); }}
                className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm hover:bg-gray-50">
                Annuler
              </button>
              <button onClick={soumettrelitige} disabled={litigeLoading || litigeDesc.trim().length < 20}
                className="flex-1 bg-orange-500 text-white py-2.5 rounded-xl text-sm hover:bg-orange-600 disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ fontWeight: 600 }}>
                {litigeLoading ? <Loader2 size={14} className="animate-spin" /> : <><AlertTriangle size={14} />Soumettre le litige</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Évaluation Modal */}
      {evalModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-gray-900 mb-1" style={{ fontWeight: 700 }}>Laisser un avis</h3>
            <p className="text-gray-500 text-sm mb-5">{evalModal.titre}</p>
            <div className="flex gap-2 justify-center mb-4">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => setEvalNote(n)}
                  className={`text-3xl transition-transform hover:scale-110 ${n <= evalNote ? "opacity-100" : "opacity-30"}`}>⭐</button>
              ))}
            </div>
            <textarea value={evalComment} onChange={(e) => setEvalComment(e.target.value)}
              placeholder="Commentaire (optionnel)..." maxLength={200} rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1B4D3E] resize-none mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setEvalModal({ open: false, reservationId: 0, titre: "" })}
                className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm hover:bg-gray-50">
                Annuler
              </button>
              <button onClick={soumettreEval} disabled={evalLoading}
                className="flex-1 bg-[#C9924A] text-white py-2.5 rounded-xl text-sm hover:bg-[#b5803c] disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ fontWeight: 600 }}>
                {evalLoading ? <Loader2 size={14} className="animate-spin" /> : "Envoyer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

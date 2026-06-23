import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Calendar, Users, DollarSign, Package, AlertCircle, ChevronLeft, ChevronRight, TrendingUp, Clock, CheckCircle, X, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";
import { reservationsApi, tenuesApi } from "../../services/api";
import { useApp } from "../context/AppContext";

type TabKey = "dashboard" | "calendar" | "rentals" | "clients" | "finance";

interface ApiReservation {
  id: number;
  tenue_id: number;
  locataire_id: number;
  date_debut: string;
  date_fin: string;
  montant_total: number;
  statut: string;
  reception_confirmee?: boolean;
  retour_signale?: boolean;
  locataire?: { id: number; nom: string; telephone?: string; email?: string };
  tenue?: { id: number; titre: string; type: string };
}

const BADGE: Record<string, { label: string; cls: string }> = {
  demande:  { label: "En attente",  cls: "bg-yellow-100 text-yellow-700" },
  confirme: { label: "Confirmée",   cls: "bg-blue-100 text-blue-700" },
  en_cours: { label: "Active",      cls: "bg-green-100 text-green-700" },
  annule:   { label: "Annulée",     cls: "bg-red-100 text-red-600" },
  termine:  { label: "Terminée",    cls: "bg-gray-100 text-gray-600" },
};

const fmtDate = (d: string) => new Date(d).toLocaleDateString("fr-FR");

export function ManagementDashboard() {
  const { currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<TabKey>("dashboard");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [reservations, setReservations] = useState<ApiReservation[]>([]);
  const [tenues, setTenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<number | null>(null);
  const [litigeModal, setLitigeModal] = useState<{ reservationId: number; titre: string } | null>(null);
  const [litigeDesc, setLitigeDesc] = useState("");
  const [litigeLoading, setLitigeLoading] = useState(false);

  useEffect(() => {
    charger();
  }, []);

  const charger = async () => {
    setLoading(true);
    try {
      const [resResa, resTenues] = await Promise.all([
        reservationsApi.demandesRecues(),
        tenuesApi.mesTenues(),
      ]);
      const resas: ApiReservation[] = resResa.data?.data ?? resResa.data ?? [];
      const ten: any[] = resTenues.data?.data ?? resTenues.data ?? [];
      setReservations(resas);
      setTenues(ten);
    } catch {
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  const confirmer = async (id: number) => {
    setActionId(id);
    try {
      await reservationsApi.confirmer(id);
      toast.success("Réservation confirmée");
      setReservations((prev) => prev.map((r) => r.id === id ? { ...r, statut: "confirme" } : r));
    } catch (e: any) {
      toast.error(e.response?.data?.message ?? "Erreur");
    } finally { setActionId(null); }
  };

  const terminer = async (id: number) => {
    setActionId(id);
    try {
      await reservationsApi.terminer(id);
      toast.success("Location terminée, caution remboursée");
      setReservations((prev) => prev.map((r) => r.id === id ? { ...r, statut: "termine" } : r));
    } catch (e: any) {
      toast.error(e.response?.data?.message ?? "Erreur");
    } finally { setActionId(null); }
  };

  const annuler = async (id: number) => {
    if (!confirm("Annuler cette réservation ?")) return;
    setActionId(id);
    try {
      await reservationsApi.annuler(id);
      toast.success("Réservation annulée");
      setReservations((prev) => prev.map((r) => r.id === id ? { ...r, statut: "annule" } : r));
    } catch (e: any) {
      toast.error(e.response?.data?.message ?? "Erreur");
    } finally { setActionId(null); }
  };

  const confirmerRetour = async (id: number) => {
    if (!confirm("Confirmer que vous avez bien reçu la tenue en retour ? Cela clôturera la location.")) return;
    setActionId(id);
    try {
      await reservationsApi.confirmerRetour(id);
      toast.success("Retour confirmé ! La location est clôturée et la tenue est en maintenance.");
      charger();
    } catch (e: any) {
      toast.error(e.response?.data?.message ?? "Erreur");
    } finally { setActionId(null); }
  };

  const soumettrelitige = async () => {
    if (!litigeModal || litigeDesc.trim().length < 20) {
      toast.error("Décrivez le problème en au moins 20 caractères."); return;
    }
    setLitigeLoading(true);
    try {
      await reservationsApi.ouvrirLitige(litigeModal.reservationId, litigeDesc.trim());
      toast.success("Litige signalé. L'autre partie a été notifiée et un message a été envoyé.");
      setLitigeModal(null);
      setLitigeDesc("");
    } catch (e: any) {
      toast.error(e.response?.data?.message ?? "Erreur");
    } finally { setLitigeLoading(false); }
  };

  // Commission selon type proprietaire
  const commissionRate = currentUser?.type_proprietaire === "boutique" ? 0.15 : 0.19;
  const netRate = 1 - commissionRate;

  // Stats
  const activeRentals = reservations.filter((r) => r.statut === "en_cours").length;
  const rentedItems = reservations.filter((r) => r.statut === "confirme" || r.statut === "en_cours").length;
  const totalRevenue = Math.round(
    reservations.filter((r) => r.statut === "termine").reduce((s, r) => s + Number(r.montant_total), 0) * netRate
  );
  const pendingRevenue = Math.round(
    reservations.filter((r) => ["confirme", "en_cours"].includes(r.statut)).reduce((s, r) => s + Number(r.montant_total), 0) * netRate
  );
  const pendingRequests = reservations.filter((r) => r.statut === "demande");

  // Calendar
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startingDay = new Date(year, month, 1).getDay();

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "dashboard", label: "Tableau de bord", icon: <Package className="w-4 h-4" /> },
    { key: "calendar",  label: "Calendrier",       icon: <Calendar className="w-4 h-4" /> },
    { key: "rentals",   label: "Locations",         icon: <TrendingUp className="w-4 h-4" /> },
    { key: "clients",   label: "Clients",           icon: <Users className="w-4 h-4" /> },
    { key: "finance",   label: "Financier",         icon: <DollarSign className="w-4 h-4" /> },
  ];

  const uniqueClients = Array.from(
    new Map(reservations.filter((r) => r.locataire).map((r) => [r.locataire!.id, r.locataire!])).values()
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF6EF] pt-20 flex items-center justify-center">
        <Loader2 className="animate-spin text-[#1B4D3E]" size={32} />
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen bg-[#FAF6EF] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Locations</h1>
            <p className="text-gray-600 mt-1">Système de gestion — Keswa.dz</p>
          </div>
          <Link to="/inventaire" className="flex items-center gap-2 bg-[#1B4D3E] text-white px-5 py-2.5 rounded-xl text-sm hover:bg-[#2d6b55] transition-colors self-start" style={{ fontWeight: 600 }}>
            <Package className="w-4 h-4" />
            Gestion du stock
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-gray-100 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex flex-1 items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.key ? "bg-[#C9924A] text-white shadow-sm" : "text-gray-600 hover:bg-gray-50"
              }`}>
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>

        {/* ── Dashboard ── */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Tenues", value: tenues.length, icon: <Package className="w-5 h-5" />, color: "text-green-600", bg: "bg-green-50" },
                { label: "Locations Actives", value: activeRentals, icon: <Calendar className="w-5 h-5" />, color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Tenues Louées", value: rentedItems, icon: <TrendingUp className="w-5 h-5" />, color: "text-orange-600", bg: "bg-orange-50" },
                { label: `Revenu Net (${Math.round(netRate * 100)}%)`, value: `${totalRevenue.toLocaleString("fr-DZ")} DA`, icon: <DollarSign className="w-5 h-5" />, color: "text-purple-600", bg: "bg-purple-50" },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center ${s.color} mb-3`}>{s.icon}</div>
                  <p className="text-sm text-gray-600">{s.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Calendar preview */}
              <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Calendar className="w-5 h-5" />Calendrier</h3>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setCurrentMonth(new Date(year, month - 1))} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronLeft className="w-5 h-5" /></button>
                    <span className="font-semibold text-gray-900 min-w-[120px] text-center">{currentMonth.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}</span>
                    <button onClick={() => setCurrentMonth(new Date(year, month + 1))} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronRight className="w-5 h-5" /></button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"].map((d) => (
                    <div key={d} className="text-center text-xs font-semibold text-gray-500 py-2">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: startingDay }, (_, i) => <div key={`e${i}`} />)}
                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const day = i + 1;
                    const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;
                    return (
                      <div key={day} className={`aspect-square flex items-center justify-center text-sm rounded-lg border transition-colors ${
                        isToday ? "bg-blue-50 border-blue-300 text-blue-700 font-semibold" : "border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}>{day}</div>
                    );
                  })}
                </div>
              </div>

              {/* Demandes en attente */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-5">
                  <AlertCircle className="w-5 h-5" />Demandes ({pendingRequests.length})
                </h3>
                {pendingRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="mx-auto text-green-300 mb-2" size={32} />
                    <p className="text-sm text-gray-500">Aucune demande en attente</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingRequests.slice(0, 5).map((r) => (
                      <div key={r.id} className="p-3 rounded-lg border-l-4 border-yellow-500 bg-yellow-50">
                        <p className="text-sm font-semibold text-gray-900">{r.locataire?.nom ?? "Client"}</p>
                        <p className="text-xs text-gray-600">{r.tenue?.titre ?? "Tenue"}</p>
                        <p className="text-xs text-gray-500">{fmtDate(r.date_debut)} → {fmtDate(r.date_fin)}</p>
                        <button onClick={() => confirmer(r.id)} disabled={actionId === r.id}
                          className="mt-2 text-xs text-green-700 font-semibold hover:underline disabled:opacity-50">
                          {actionId === r.id ? "..." : "Confirmer →"}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Calendar ── */}
        {activeTab === "calendar" && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Calendar className="w-6 h-6" />Calendrier des locations</h3>
              <div className="flex items-center gap-3">
                <button onClick={() => setCurrentMonth(new Date(year, month - 1))} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronLeft className="w-5 h-5" /></button>
                <span className="font-bold text-gray-900 min-w-[150px] text-center text-lg">{currentMonth.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}</span>
                <button onClick={() => setCurrentMonth(new Date(year, month + 1))} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronRight className="w-5 h-5" /></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-3 mb-3">
              {["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"].map((d) => (
                <div key={d} className="text-center text-sm font-semibold text-gray-600 py-2">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-3">
              {Array.from({ length: startingDay }, (_, i) => <div key={`e${i}`} className="aspect-square" />)}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const thisDate = new Date(year, month, day);
                const isToday = new Date().toDateString() === thisDate.toDateString();
                const hasActive = reservations.some((r) => {
                  if (!["confirme", "en_cours"].includes(r.statut)) return false;
                  return thisDate >= new Date(r.date_debut) && thisDate <= new Date(r.date_fin);
                });
                return (
                  <div key={day} className={`aspect-square flex items-center justify-center text-base font-medium rounded-xl border-2 transition-all ${
                    isToday ? "bg-blue-100 border-blue-400 text-blue-800 font-bold" :
                    hasActive ? "bg-green-100 border-green-400 text-green-800" :
                    "border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}>{day}</div>
                );
              })}
            </div>
            <div className="flex items-center gap-6 mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-100 border-2 border-green-400 rounded" /><span className="text-sm text-gray-700">Location active</span></div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 bg-blue-100 border-2 border-blue-400 rounded" /><span className="text-sm text-gray-700">Aujourd'hui</span></div>
            </div>
          </div>
        )}

        {/* ── Rentals ── */}
        {activeTab === "rentals" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Gestion des Locations</h3>
            </div>
            {reservations.length === 0 ? (
              <div className="text-center py-16">
                <Package className="mx-auto text-gray-200 mb-3" size={48} />
                <p className="text-gray-500">Aucune réservation reçue</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Client</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Tenue</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Période</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Montant</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Statut</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {reservations.map((r) => {
                      const badge = BADGE[r.statut] ?? BADGE.demande;
                      return (
                        <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <p className="text-sm font-medium text-gray-900">{r.locataire?.nom ?? "—"}</p>
                            <p className="text-xs text-gray-500">{r.locataire?.telephone ?? ""}</p>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">{r.tenue?.titre ?? "—"}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{fmtDate(r.date_debut)} → {fmtDate(r.date_fin)}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-gray-900">{Number(r.montant_total).toLocaleString("fr-DZ")} DA</td>
                          <td className="px-4 py-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${badge.cls}`}>{badge.label}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              {r.statut === "demande" && (
                                <button onClick={() => confirmer(r.id)} disabled={actionId === r.id}
                                  className="px-3 py-1.5 text-xs font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded transition-colors disabled:opacity-50">
                                  {actionId === r.id ? "..." : "Confirmer"}
                                </button>
                              )}
                              {r.statut === "en_cours" && !r.retour_signale && (
                                <span className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-gray-500 bg-gray-100 rounded">
                                  <Clock className="w-3 h-3" />
                                  {r.reception_confirmee ? "Tenue reçue ✓" : "En attente réception"}
                                </span>
                              )}
                              {r.statut === "en_cours" && r.retour_signale && (
                                <button onClick={() => confirmerRetour(r.id)} disabled={actionId === r.id}
                                  className="px-3 py-1.5 text-xs font-semibold text-green-700 bg-green-100 hover:bg-green-200 rounded transition-colors disabled:opacity-50 flex items-center gap-1">
                                  {actionId === r.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                                  Confirmer retour reçu
                                </button>
                              )}
                              {r.statut === "confirme" && (
                                <button onClick={() => terminer(r.id)} disabled={actionId === r.id}
                                  className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded transition-colors disabled:opacity-50">
                                  {actionId === r.id ? "..." : "Terminer"}
                                </button>
                              )}
                              {(r.statut === "confirme" || r.statut === "en_cours") && (
                                <button onClick={() => { setLitigeModal({ reservationId: r.id, titre: r.tenue?.titre ?? "" }); setLitigeDesc(""); }}
                                  className="px-3 py-1.5 text-xs font-medium text-orange-700 bg-orange-100 hover:bg-orange-200 rounded transition-colors flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" />Litige
                                </button>
                              )}
                              {!["annule","termine"].includes(r.statut) && (
                                <button onClick={() => annuler(r.id)} disabled={actionId === r.id}
                                  className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded transition-colors disabled:opacity-50">
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Clients ── */}
        {activeTab === "clients" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Clients ({uniqueClients.length})</h3>
            </div>
            {uniqueClients.length === 0 ? (
              <div className="text-center py-16">
                <Users className="mx-auto text-gray-200 mb-3" size={48} />
                <p className="text-gray-500">Aucun client pour l'instant</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Nom</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Téléphone</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Locations</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Total dépensé</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {uniqueClients.map((client) => {
                      const clientResas = reservations.filter((r) => r.locataire_id === client.id);
                      const spent = clientResas.filter((r) => r.statut === "termine").reduce((s, r) => s + Number(r.montant_total), 0);
                      return (
                        <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{client.nom}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{client.telephone ?? "—"}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{clientResas.length}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-gray-900">{spent.toLocaleString("fr-DZ")} DA</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Finance ── */}
        {activeTab === "finance" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 text-green-600 mb-2"><DollarSign className="w-5 h-5" /><p className="text-sm font-medium">Revenus nets réalisés</p></div>
                <p className="text-2xl font-bold text-green-600">{totalRevenue.toLocaleString("fr-DZ")} DA</p>
                <p className="text-xs text-gray-400 mt-1">Locations terminées — après commission {Math.round(commissionRate * 100)}%</p>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 text-orange-600 mb-2"><Clock className="w-5 h-5" /><p className="text-sm font-medium">En attente (net)</p></div>
                <p className="text-2xl font-bold text-orange-600">{pendingRevenue.toLocaleString("fr-DZ")} DA</p>
                <p className="text-xs text-gray-400 mt-1">Confirmées / en cours — après commission</p>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 text-purple-600 mb-2"><TrendingUp className="w-5 h-5" /><p className="text-sm font-medium">Total réservations</p></div>
                <p className="text-2xl font-bold text-purple-600">{reservations.length}</p>
                <p className="text-xs text-gray-400 mt-1">Toutes périodes</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">Détails financiers</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Client</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Tenue</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Période</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Montant brut</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Net ({Math.round(netRate * 100)}%)</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {reservations.map((r) => {
                      const badge = BADGE[r.statut] ?? BADGE.demande;
                      return (
                        <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm text-gray-900">{r.locataire?.nom ?? "—"}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{r.tenue?.titre ?? "—"}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{fmtDate(r.date_debut)} → {fmtDate(r.date_fin)}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-gray-900">{Number(r.montant_total).toLocaleString("fr-DZ")} DA</td>
                          <td className="px-4 py-3 text-sm font-semibold text-green-700">{Math.round(Number(r.montant_total) * netRate).toLocaleString("fr-DZ")} DA</td>
                          <td className="px-4 py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${badge.cls}`}>{badge.label}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

    {/* ── Modal Litige ── */}
    {litigeModal && (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
          <div className="flex items-center gap-3 p-5 border-b border-gray-100">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <AlertTriangle size={20} className="text-orange-600" />
            </div>
            <div>
              <h3 className="text-gray-900 font-bold">Signaler un litige</h3>
              <p className="text-xs text-gray-500">{litigeModal.titre}</p>
            </div>
            <button onClick={() => setLitigeModal(null)} className="ml-auto p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"><X size={16} /></button>
          </div>
          <div className="p-5 space-y-4">
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl text-xs text-orange-800">
              <p className="font-semibold mb-1">⚠️ Un litige sera ouvert et :</p>
              <ul className="space-y-0.5 list-disc list-inside">
                <li>Un message sera envoyé automatiquement au locataire</li>
                <li>L'équipe KASEWA sera notifiée pour médiation</li>
                <li>La résolution sera communiquée aux deux parties</li>
              </ul>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description du problème *</label>
              <textarea
                value={litigeDesc}
                onChange={(e) => setLitigeDesc(e.target.value)}
                placeholder="Décrivez le problème en détail (tenue abîmée, retard de retour, etc.)..."
                rows={4}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">{litigeDesc.length}/1000 (minimum 20 caractères)</p>
            </div>
          </div>
          <div className="flex gap-3 p-5 border-t border-gray-100">
            <button onClick={() => setLitigeModal(null)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm hover:bg-gray-50">Annuler</button>
            <button onClick={soumettrelitige} disabled={litigeLoading || litigeDesc.trim().length < 20}
              className="flex-1 bg-orange-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center gap-2">
              {litigeLoading ? <Loader2 size={14} className="animate-spin" /> : <AlertTriangle size={14} />}
              Signaler le litige
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}

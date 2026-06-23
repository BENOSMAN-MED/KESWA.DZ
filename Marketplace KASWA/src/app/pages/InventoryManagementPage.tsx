import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Package, Search, Filter, Plus, Edit, Trash2, CheckCircle, Clock, Wrench, Archive, TrendingUp, Eye, ArrowLeft, Loader2, AlertTriangle } from "lucide-react";
import { tenuesApi } from "../../services/api";
import { toast } from "react-toastify";
import { STORAGE_URL } from "../../services/storageUrl";
const FALLBACK = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80";

interface Tenue {
  id: number;
  titre: string;
  type: string;
  tailles: string[] | string | null;
  quantite?: number;
  quantites_par_taille?: Record<string, number> | null;
  prix_jour: number;
  statut: string;
  score_moy?: number | null;
  photo_principale?: { chemin: string } | null;
}

const getTailles = (t: string[] | string | null): string[] => {
  if (!t) return [];
  if (Array.isArray(t)) return t;
  return t.split(",").map((s) => s.trim()).filter(Boolean);
};

export function InventoryManagementPage() {
  const [tenues, setTenues] = useState<Tenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("");

  useEffect(() => {
    charger();
  }, []);

  const charger = async () => {
    setLoading(true);
    try {
      const res = await tenuesApi.mesTenues();
      const data: Tenue[] = res.data?.data ?? res.data ?? [];
      setTenues(data);
    } catch {
      toast.error("Erreur lors du chargement du stock");
    } finally {
      setLoading(false);
    }
  };

  const supprimer = async (t: Tenue) => {
    if (!confirm(`Supprimer définitivement "${t.titre}" ?`)) return;
    try {
      await tenuesApi.supprimer(t.id);
      setTenues((prev) => prev.filter((x) => x.id !== t.id));
      toast.success(`"${t.titre}" supprimée`);
    } catch (e: any) {
      toast.error(e.response?.data?.message ?? "Erreur lors de la suppression");
    }
  };

  const filteredTenues = tenues.filter((t) => {
    const matchSearch =
      t.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(t.id).includes(searchQuery);
    const matchStatus =
      filterStatus === "all" ||
      (filterStatus === "disponible" && t.statut === "disponible") ||
      (filterStatus === "loue" && t.statut === "loue") ||
      (filterStatus === "maintenance" && t.statut === "en_maintenance");
    const matchType = !filterType || t.type === filterType;
    return matchSearch && matchStatus && matchType;
  });

  const typesDisponibles = Array.from(new Set(tenues.map((t) => t.type).filter(Boolean))).sort();

  const totalItems = tenues.length;
  const availableItems = tenues.filter((t) => t.statut === "disponible").length;
  const rentedItems = tenues.filter((t) => t.statut === "loue").length;
  const maintenanceItems = tenues.filter((t) => t.statut === "en_maintenance").length;

  const getStatusBadge = (statut: string) => {
    if (statut === "disponible")
      return <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs" style={{ fontWeight: 600 }}><CheckCircle size={12} />Disponible</span>;
    if (statut === "loue")
      return <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full text-xs" style={{ fontWeight: 600 }}><Clock size={12} />Louée</span>;
    return <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs" style={{ fontWeight: 600 }}><Wrench size={12} />Maintenance</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF6EF] pt-20 flex items-center justify-center">
        <Loader2 className="animate-spin text-[#1B4D3E]" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6EF] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Link to="/gestion" className="p-2 text-gray-400 hover:text-gray-600 bg-white rounded-xl shadow-sm"><ArrowLeft size={18} /></Link>
              <div>
                <h1 className="text-gray-900 mb-1" style={{ fontSize: "1.8rem", fontWeight: 700 }}>Gestion du Stock</h1>
                <p className="text-gray-500 text-sm">Inventaire de vos tenues traditionnelles</p>
              </div>
            </div>
            <Link to="/ajouter-annonce" className="flex items-center gap-2 bg-[#1B4D3E] text-white px-5 py-3 rounded-xl hover:bg-[#2d6b55] transition-colors" style={{ fontWeight: 600 }}>
              <Plus size={18} />Ajouter une tenue
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { icon: <Package className="text-[#1B4D3E]" size={20} />, value: totalItems, label: "Total tenues", extra: <TrendingUp className="text-green-500" size={16} /> },
              { icon: <CheckCircle className="text-green-600" size={20} />, value: availableItems, label: "Disponibles" },
              { icon: <Clock className="text-orange-600" size={20} />, value: rentedItems, label: "En location" },
              { icon: <AlertTriangle className="text-red-600" size={20} />, value: maintenanceItems, label: "Maintenance" },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">{s.icon}{s.extra ?? null}</div>
                <div className="text-2xl text-gray-900 mb-1" style={{ fontWeight: 700 }}>{s.value}</div>
                <div className="text-sm text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="text" placeholder="Rechercher par nom, type ou ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9924A] text-sm" />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9924A] text-sm appearance-none bg-white">
                  <option value="all">Tous les statuts</option>
                  <option value="disponible">Disponible</option>
                  <option value="loue">Louée</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9924A] text-sm appearance-none bg-white">
                  <option value="">Tous les types</option>
                  {typesDisponibles.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Tenue","Type","Tailles","Prix/jour","Statut","Note","Actions"].map((h) => (
                    <th key={h} className="px-6 py-4 text-left text-xs text-gray-600" style={{ fontWeight: 600, textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTenues.map((t) => {
                  const firstPhoto = (t as any).photos?.[0] ?? t.photo_principale;
                  const img = firstPhoto?.chemin ? STORAGE_URL + firstPhoto.chemin : FALLBACK;
                  const tailles = getTailles(t.tailles);
                  return (
                    <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={img} alt={t.titre} className="w-12 h-12 rounded-lg object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }} />
                          <div>
                            <div className="text-sm text-gray-900" style={{ fontWeight: 600 }}>{t.titre}</div>
                            <div className="text-xs text-gray-500">ID: {t.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{t.type}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {tailles.length > 0 ? tailles.map((s) => {
                            const qté = t.quantites_par_taille?.[s] ?? t.quantite ?? 1;
                            const couleur = qté === 0 ? "bg-red-100 text-red-600" : qté === 1 ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-700";
                            return (
                              <div key={s} className={`flex flex-col items-center px-2 py-0.5 rounded text-xs ${couleur}`}>
                                <span style={{ fontWeight: 700 }}>{s}</span>
                                <span className="text-[10px]">{qté} unité{qté > 1 ? "s" : ""}</span>
                              </div>
                            );
                          }) : <span className="text-xs text-gray-400">—</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{Number(t.prix_jour).toLocaleString()} DA</td>
                      <td className="px-6 py-4">{getStatusBadge(t.statut)}</td>
                      <td className="px-6 py-4">
                        {t.score_moy ? (
                          <span className="text-sm font-semibold text-gray-900">⭐ {Number(t.score_moy).toFixed(1)}</span>
                        ) : <span className="text-xs text-gray-400">—</span>}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <Link to={`/annonce/${t.id}`} className="p-1.5 text-gray-500 hover:text-[#1B4D3E] hover:bg-[#1B4D3E]/10 rounded-lg transition-colors" title="Voir l'annonce">
                            <Eye size={15} />
                          </Link>
                          <Link to={`/modifier-annonce/${t.id}`} className="p-1.5 text-gray-500 hover:text-[#C9924A] hover:bg-[#C9924A]/10 rounded-lg transition-colors" title="Modifier">
                            <Edit size={15} />
                          </Link>
                          <button onClick={async () => {
                              const nouveauStatut = t.statut === "en_maintenance" ? "disponible" : "en_maintenance";
                              try {
                                await tenuesApi.changerStatut(t.id, nouveauStatut);
                                setTenues(prev => prev.map(x => x.id === t.id ? { ...x, statut: nouveauStatut } : x));
                                toast.success(nouveauStatut === "en_maintenance" ? `"${t.titre}" mise en maintenance` : `"${t.titre}" remise en disponible`);
                              } catch (e: any) {
                                toast.error(e.response?.data?.message ?? "Erreur changement statut");
                              }
                            }}
                            className={`p-1.5 hover:bg-orange-50 rounded-lg transition-colors ${t.statut === "en_maintenance" ? "text-orange-600" : "text-gray-500 hover:text-orange-600"}`}
                            title={t.statut === "en_maintenance" ? "Remettre disponible" : "Mettre en maintenance"}>
                            <Wrench size={15} />
                          </button>
                          <button onClick={async () => {
                              try {
                                await tenuesApi.changerStatut(t.id, "inactif");
                                setTenues(prev => prev.filter(x => x.id !== t.id));
                                toast.success(`"${t.titre}" archivée`);
                              } catch (e: any) {
                                toast.error(e.response?.data?.message ?? "Erreur archivage");
                              }
                            }}
                            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" title="Archiver">
                            <Archive size={15} />
                          </button>
                          <button onClick={() => supprimer(t)}
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredTenues.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto text-gray-300 mb-3" size={48} />
              <p className="text-gray-500 mb-2">{tenues.length === 0 ? "Aucune tenue dans votre stock" : "Aucune tenue correspond aux filtres"}</p>
              {tenues.length === 0 && (
                <Link to="/ajouter-annonce" className="text-[#1B4D3E] text-sm hover:underline">+ Ajouter votre première tenue</Link>
              )}
            </div>
          )}
        </div>

        {filteredTenues.length > 0 && (
          <div className="mt-4 text-center text-sm text-gray-500">
            {filteredTenues.length} tenue{filteredTenues.length > 1 ? "s" : ""} sur {totalItems}
          </div>
        )}
      </div>
    </div>
  );
}

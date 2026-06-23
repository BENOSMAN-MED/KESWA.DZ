import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Bell, ArrowLeft, CheckCircle, Calendar, CreditCard, Star, MessageCircle, AlertCircle, Package, Loader2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import { notificationsApi } from "../../services/api";

interface ApiNotif {
  id: number;
  type: string;
  contenu: string;
  lu: boolean;
  created_at: string;
  reservation_id?: number | null;
}

const ICONES: Record<string, React.ReactNode> = {
  reservation: <Calendar size={18} className="text-blue-600" />,
  paiement:    <CreditCard size={18} className="text-green-600" />,
  evaluation:  <Star size={18} className="text-amber-500" />,
  message:     <MessageCircle size={18} className="text-[#1B4D3E]" />,
  litige:      <AlertCircle size={18} className="text-red-500" />,
  systeme:     <Package size={18} className="text-gray-500" />,
};

const BG: Record<string, string> = {
  reservation: "bg-blue-50",
  paiement:    "bg-green-50",
  evaluation:  "bg-amber-50",
  message:     "bg-[#1B4D3E]/10",
  litige:      "bg-red-50",
  systeme:     "bg-gray-50",
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  const diff = Math.floor((Date.now() - d.getTime()) / 60000);
  if (diff < 60) return `Il y a ${diff} min`;
  if (diff < 1440) return `Il y a ${Math.floor(diff / 60)}h`;
  return d.toLocaleDateString("fr-DZ", { day: "numeric", month: "long" });
};

export function NotificationsPage() {
  const { currentUser } = useApp();
  const navigate = useNavigate();
  const [notifs, setNotifs] = useState<ApiNotif[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!currentUser) { navigate("/connexion"); return; }
    charger(1);
  }, [currentUser]);

  const charger = async (p: number) => {
    setLoading(true);
    try {
      const res = await notificationsApi.liste(p);
      const data = res.data;
      const items: ApiNotif[] = data?.data ?? data ?? [];
      setNotifs(p === 1 ? items : (prev) => [...prev, ...items]);
      setTotal(data?.total ?? items.length);
      setHasMore(!!(data?.next_page_url));
      setPage(p);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const marquerLu = async (id: number) => {
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, lu: true } : n)));
    try { await notificationsApi.marquerLu(id); } catch {}
  };

  const marquerToutLu = async () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, lu: true })));
    try { await notificationsApi.marquerToutLu(); } catch {}
  };

  if (!currentUser) return null;

  const nonLues = notifs.filter((n) => !n.lu).length;
  const dashPath = currentUser.role === "owner" ? "/dashboard/owner" : currentUser.role === "admin" ? "/dashboard/admin" : "/dashboard/renter";

  const handleClick = async (notif: ApiNotif) => {
    if (!notif.lu) await marquerLu(notif.id);
    switch (notif.type) {
      case "message":    navigate("/messages"); break;
      case "reservation":
      case "paiement":
      case "evaluation":
      case "litige":     navigate(dashPath); break;
      default:           navigate(dashPath);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6EF] pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link to={dashPath} className="p-2 text-gray-400 hover:text-gray-600 bg-white rounded-xl shadow-sm">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-gray-900 text-xl" style={{ fontWeight: 700 }}>
                Notifications
                {nonLues > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center w-6 h-6 bg-red-500 text-white text-xs rounded-full" style={{ fontWeight: 700 }}>
                    {nonLues}
                  </span>
                )}
              </h1>
              <p className="text-gray-400 text-sm">{total} notification{total > 1 ? "s" : ""}</p>
            </div>
          </div>
          {nonLues > 0 && (
            <button onClick={marquerToutLu} className="flex items-center gap-1.5 text-sm text-[#1B4D3E] hover:text-[#C9924A] transition-colors" style={{ fontWeight: 500 }}>
              <CheckCircle size={15} />
              Tout marquer lu
            </button>
          )}
        </div>

        {/* List */}
        {loading && notifs.length === 0 ? (
          <div className="flex justify-center py-16"><Loader2 className="animate-spin text-gray-300" size={28} /></div>
        ) : notifs.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <Bell size={40} className="mx-auto text-gray-200 mb-4" />
            <h3 className="text-gray-600 mb-1" style={{ fontWeight: 600 }}>Aucune notification</h3>
            <p className="text-gray-400 text-sm">Vous êtes à jour !</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifs.map((notif, i) => (
              <div
                key={notif.id}
                onClick={() => handleClick(notif)}
                className={`bg-white rounded-2xl p-4 shadow-sm border cursor-pointer hover:shadow-md transition-all animate-card-in ${
                  !notif.lu ? "border-[#1B4D3E]/20 bg-[#1B4D3E]/[0.02]" : "border-gray-100"
                }`}
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 ${BG[notif.type] ?? "bg-gray-50"} rounded-xl flex items-center justify-center shrink-0`}>
                    {ICONES[notif.type] ?? <Bell size={18} className="text-gray-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-gray-900 text-sm leading-snug" style={{ fontWeight: notif.lu ? 500 : 700 }}>
                        {notif.contenu}
                      </p>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-gray-400 whitespace-nowrap">{formatDate(notif.created_at)}</span>
                        {!notif.lu && <span className="w-2 h-2 bg-[#1B4D3E] rounded-full" />}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {hasMore && (
              <div className="flex justify-center pt-4">
                <button onClick={() => charger(page + 1)} disabled={loading}
                  className="text-sm text-[#1B4D3E] border border-[#1B4D3E]/30 px-5 py-2.5 rounded-xl hover:bg-[#1B4D3E]/5 disabled:opacity-50 flex items-center gap-2"
                  style={{ fontWeight: 500 }}>
                  {loading ? <Loader2 size={14} className="animate-spin" /> : null}
                  Charger plus
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

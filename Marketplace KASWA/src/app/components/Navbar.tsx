import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { Menu, X, User, LogOut, Heart, LayoutDashboard, ChevronDown, ShoppingBag, Bell, MessageCircle } from "lucide-react";
import { useApp } from "../context/AppContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { notificationsApi, messagesApi } from "../../services/api";
import logoImage from "../../imports/designarena_image_56urdtwj.jpg";

type Notification = {
  id: number;
  type: string;
  contenu: string;
  lu: boolean;
  created_at: string;
};

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [nonLues, setNonLues] = useState(0);
  const [messagesNonLus, setMessagesNonLus] = useState(0);
  const notifRef = useRef<HTMLDivElement>(null);
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  // Charger les notifications réelles depuis l'API
  useEffect(() => {
    if (!currentUser) { setNotifications([]); setNonLues(0); return; }
    const charger = async () => {
      try {
        const res = await notificationsApi.nonLues();
        const data = res.data;
        setNotifications(data.notifications || data.data || []);
        setNonLues(data.count ?? (data.notifications || data.data || []).length);
      } catch {
        // Silencieux si non connecté
      }
    };
    charger();
    const interval = setInterval(charger, 30000);
    return () => clearInterval(interval);
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) { setMessagesNonLus(0); return; }
    const chargerMessages = async () => {
      try {
        const res = await messagesApi.liste();
        const msgs = res.data?.data ?? res.data ?? [];
        const myId = parseInt(currentUser.id);
        const count = msgs.filter((m: any) => !m.lu && m.destinataire_id === myId).length;
        setMessagesNonLus(count);
      } catch {}
    };
    chargerMessages();
    const interval = setInterval(chargerMessages, 30000);
    return () => clearInterval(interval);
  }, [currentUser]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const ouvrirNotifications = () => {
    setNotifOpen(!notifOpen);
    setUserMenuOpen(false);
  };

  const marquerToutLu = async () => {
    try {
      await notificationsApi.marquerToutLu();
      setNonLues(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, lu: true })));
    } catch {}
  };

  const marquerLu = async (id: number) => {
    try {
      await notificationsApi.marquerLu(id);
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, lu: true } : n));
      setNonLues((c) => Math.max(0, c - 1));
    } catch {}
  };

  const iconeType = (type: string) => {
    const map: Record<string, string> = {
      reservation: "📅", paiement: "💳", evaluation: "⭐",
      litige: "⚠️", message: "💬", contrat: "📄",
    };
    return map[type] ?? "🔔";
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setUserMenuOpen(false);
  };

  const getDashboardPath = () => {
    if (!currentUser) return "/connexion";
    if (currentUser.role === "admin") return "/dashboard/admin";
    if (currentUser.role === "owner") return "/dashboard/owner";
    return "/dashboard/renter";
  };

  const navLinks = [
    { label: "Accueil", path: "/" },
    { label: "Catalogue", path: "/catalogue" },
    { label: "Comment ça marche", path: "/#how-it-works" },
    { label: "À propos", path: "/#about" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#C9924A]/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <ImageWithFallback src={logoImage} alt="KASEWA.DZ" className="h-14 w-auto object-contain" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}
                onClick={(e) => {
                  if (link.path.includes("#")) {
                    e.preventDefault();
                    const [path, hash] = link.path.split("#");
                    if (path === "/" && location.pathname === "/") {
                      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
                    } else if (path === "/") {
                      navigate("/");
                      setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
                    }
                  }
                }}
                className={`text-sm transition-colors hover:text-[#C9924A] ${
                  location.pathname === link.path ? "text-[#1B4D3E]" : "text-gray-600"
                }`} style={{ fontWeight: 500 }}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <>
                {currentUser.role === "owner" && (
                  <Link to="/ajouter-annonce"
                    className="flex items-center gap-1.5 bg-[#1B4D3E] text-white px-4 py-2 rounded-full text-sm hover:bg-[#2d6b55] transition-colors"
                    style={{ fontWeight: 500 }}>
                    <ShoppingBag size={14} />
                    Publier une annonce
                  </Link>
                )}

                <Link to="/messages" className="relative p-2 text-gray-600 hover:text-[#1B4D3E] hover:bg-gray-50 rounded-full transition-colors" title="Messages">
                  <MessageCircle size={20} />
                  {messagesNonLus > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[#C9924A] text-white text-[10px] rounded-full flex items-center justify-center px-1" style={{ fontWeight: 700 }}>
                      {messagesNonLus > 9 ? "9+" : messagesNonLus}
                    </span>
                  )}
                </Link>

                {/* Cloche Notifications */}
                <div className="relative" ref={notifRef}>
                  <button onClick={ouvrirNotifications} onDoubleClick={() => navigate("/notifications")}
                    className="relative p-2 text-gray-600 hover:text-[#1B4D3E] hover:bg-gray-50 rounded-full transition-colors"
                    title="Notifications">
                    <Bell size={20} />
                    {nonLues > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center px-1" style={{ fontWeight: 700 }}>
                        {nonLues > 9 ? "9+" : nonLues}
                      </span>
                    )}
                  </button>

                  {notifOpen && (
                    <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                        <span className="text-sm text-gray-900" style={{ fontWeight: 600 }}>Notifications</span>
                        {nonLues > 0 && (
                          <button onClick={marquerToutLu} className="text-xs text-[#1B4D3E] hover:underline">
                            Tout marquer lu
                          </button>
                        )}
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="py-8 text-center text-sm text-gray-400">Aucune notification</div>
                        ) : (
                          notifications.map((notif) => (
                            <div key={notif.id} onClick={() => !notif.lu && marquerLu(notif.id)}
                              className={`flex gap-3 px-4 py-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${!notif.lu ? "bg-[#1B4D3E]/5" : ""}`}>
                              <span className="text-lg flex-shrink-0">{iconeType(notif.type)}</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-800 leading-snug">{notif.contenu}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {new Date(notif.created_at).toLocaleDateString("fr-DZ", {
                                    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                                  })}
                                </p>
                              </div>
                              {!notif.lu && <span className="w-2 h-2 bg-[#1B4D3E] rounded-full flex-shrink-0 mt-1" />}
                            </div>
                          ))
                        )}
                      </div>
                      <Link to="/notifications" onClick={() => setNotifOpen(false)}
                        className="block text-center text-xs text-[#1B4D3E] hover:text-[#C9924A] py-3 border-t border-gray-100 transition-colors"
                        style={{ fontWeight: 600 }}>
                        Voir toutes les notifications →
                      </Link>
                    </div>
                  )}
                </div>

                {/* Menu utilisateur */}
                <div className="relative">
                  <button onClick={() => { setUserMenuOpen(!userMenuOpen); setNotifOpen(false); }}
                    className="flex items-center gap-2 hover:bg-gray-50 px-3 py-2 rounded-full transition-colors">
                    <div className="w-8 h-8 bg-[#1B4D3E] rounded-full flex items-center justify-center text-white text-sm" style={{ fontWeight: 600 }}>
                      {currentUser.name[0].toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-700" style={{ fontWeight: 500 }}>{currentUser.name.split(" ")[0]}</span>
                    <ChevronDown size={14} className="text-gray-400" />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-12 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm text-gray-500">Connecté en tant que</p>
                        <p className="text-sm text-gray-900" style={{ fontWeight: 600 }}>{currentUser.name}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-[#1B4D3E]/10 text-[#1B4D3E] rounded-full text-xs" style={{ fontWeight: 500 }}>
                          {currentUser.role === "admin" ? "Administrateur" : currentUser.role === "owner" ? "Propriétaire" : "Locataire"}
                        </span>
                      </div>
                      <Link to={getDashboardPath()} onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <LayoutDashboard size={15} />Mon tableau de bord
                      </Link>
                      <Link to="/profil" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <User size={15} />Mon profil
                      </Link>
                      <Link to="/messages" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <MessageCircle size={15} />Messages
                      </Link>
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut size={15} />Se déconnecter
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/connexion" className="text-sm text-[#1B4D3E] hover:text-[#C9924A] transition-colors" style={{ fontWeight: 500 }}>
                  Se connecter
                </Link>
                <Link to="/inscription" className="bg-[#C9924A] text-white px-5 py-2 rounded-full text-sm hover:bg-[#b5803c] transition-colors shadow-sm" style={{ fontWeight: 500 }}>
                  S'inscrire
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-gray-600 hover:text-[#1B4D3E]">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} onClick={() => setMenuOpen(false)}
                className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-gray-100 space-y-2 px-4">
              {currentUser ? (
                <>
                  <Link to={getDashboardPath()} onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 py-2.5 text-sm text-[#1B4D3E]">
                    <LayoutDashboard size={15} />Mon tableau de bord
                  </Link>
                  <Link to="/messages" onClick={() => { setMenuOpen(false); setMessagesNonLus(0); }}
                    className="flex items-center gap-2 py-2.5 text-sm text-gray-700">
                    <MessageCircle size={15} />Messages
                    {messagesNonLus > 0 && (
                      <span className="min-w-[18px] h-[18px] bg-[#C9924A] text-white text-[10px] rounded-full flex items-center justify-center px-1" style={{ fontWeight: 700 }}>
                        {messagesNonLus > 9 ? "9+" : messagesNonLus}
                      </span>
                    )}
                  </Link>
                  <button onClick={handleLogout} className="flex items-center gap-2 py-2.5 text-sm text-red-600">
                    <LogOut size={15} />Se déconnecter
                  </button>
                </>
              ) : (
                <>
                  <Link to="/connexion" onClick={() => setMenuOpen(false)}
                    className="block w-full text-center py-2.5 text-sm border border-[#1B4D3E] text-[#1B4D3E] rounded-full">
                    Se connecter
                  </Link>
                  <Link to="/inscription" onClick={() => setMenuOpen(false)}
                    className="block w-full text-center py-2.5 text-sm bg-[#C9924A] text-white rounded-full">
                    S'inscrire
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

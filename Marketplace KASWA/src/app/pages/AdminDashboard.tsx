import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  Users, ShoppingBag, TrendingUp, AlertCircle, CheckCircle,
  XCircle, Eye, Ban, Search, BarChart2, DollarSign, Star, Clock, CreditCard, FileText,
  Settings, Save, Loader2, ShieldCheck, ShieldX, Camera, UserCheck, Mail, Trash2, MailOpen,
  MessageSquare, Send, Phone, X,
} from "lucide-react";
import { toast } from "react-toastify";
import { adminApi, parametresApi } from "../../services/api";
import { STORAGE_URL } from "../../services/storageUrl";
const FALLBACK_IMG = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80";

const STATUS_FR: Record<string, { label: string; cls: string }> = {
  en_attente: { label: "En attente", cls: "bg-yellow-100 text-yellow-700" },
  demande:    { label: "Demande",    cls: "bg-yellow-100 text-yellow-700" },
  confirme:   { label: "Confirmée",  cls: "bg-blue-100 text-blue-700" },
  en_cours:   { label: "En cours",   cls: "bg-[#1B4D3E]/10 text-[#1B4D3E]" },
  termine:    { label: "Terminée",   cls: "bg-gray-100 text-gray-600" },
  annule:     { label: "Annulée",    cls: "bg-red-100 text-red-600" },
  litige:     { label: "Litige",     cls: "bg-orange-100 text-orange-700" },
  valide:     { label: "Validé",     cls: "bg-green-100 text-green-700" },
  echoue:     { label: "Échoué",     cls: "bg-red-100 text-red-600" },
};

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [photoModal, setPhotoModal] = useState<string | null>(null);

  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsMensuelles, setStatsMensuelles] = useState<any[]>([]);

  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [searchUsers, setSearchUsers] = useState("");
  const [suspendingId, setSuspendingId] = useState<number | null>(null);

  const [listings, setListings] = useState<any[]>([]);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [searchListings, setSearchListings] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [tenuesEnAttente, setTenuesEnAttente] = useState<any[]>([]);
  const [validatingTenueId, setValidatingTenueId] = useState<number | null>(null);

  const [pendingPayments, setPendingPayments] = useState<any[]>([]);
  const [allPayments, setAllPayments] = useState<any[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [validatingPaymentId, setValidatingPaymentId] = useState<number | null>(null);

  const [virements, setVirements] = useState<any[]>([]);
  const [virementsLoading, setVirementsLoading] = useState(false);
  const [payingId, setPayingId] = useState<number | null>(null);

  const [disputes, setDisputes] = useState<any[]>([]);
  const [disputesLoading, setDisputesLoading] = useState(false);
  const [resolvingId, setResolvingId] = useState<number | null>(null);

  const [verifications, setVerifications] = useState<any[]>([]);
  const [verifLoading, setVerifLoading] = useState(false);
  const [verifActionId, setVerifActionId] = useState<number | null>(null);

  const [contactMsgs, setContactMsgs] = useState<any[]>([]);
  const [contactLoading, setContactLoading] = useState(false);
  const [expandedMsg, setExpandedMsg] = useState<number | null>(null);

  const [userDetailModal, setUserDetailModal] = useState<any | null>(null);
  const [msgModal, setMsgModal] = useState<any | null>(null);
  const [msgContenu, setMsgContenu] = useState("");
  const [msgLoading, setMsgLoading] = useState(false);

  const [params, setParams] = useState({
    site_nom: "KASEWA.DZ",
    site_slogan: "La première marketplace de tenues traditionnelles algériennes",
    contact_adresse: "Tlemcen, Algérie",
    contact_tel: "+213 555 000 000",
    contact_email: "contact@kasewa.dz",
    commission_pct: "15",
    facebook_url: "#",
    instagram_url: "#",
    // Contenu page d'accueil
    hero_titre: "Louez ou proposez vos tenues traditionnelles algériennes",
    hero_badge: "La 1ère marketplace de tenues traditionnelles en Algérie",
    prix_livraison: "250",
    // Sécurité
    sec1_titre: "Caution sécurisée",
    sec1_desc: "La caution est bloquée jusqu'au retour de la tenue en bon état. Votre investissement est protégé.",
    sec2_titre: "Système d'évaluations",
    sec2_desc: "Chaque location donne lieu à des avis bidirectionnels. La réputation est au cœur de notre système.",
    sec3_titre: "Vérification d'identité",
    sec3_desc: "Tous les utilisateurs sont vérifiés par numéro de téléphone et documents officiels pour réduire la fraude.",
    sec4_titre: "Paiements locaux sécurisés",
    sec4_desc: "Barid Mobile, CCP, et CIB — des solutions adaptées à la réalité algérienne et sécurisées HTTPS/SSL.",
    // Comment ça marche — Locataire
    loc1_titre: "Parcourez le catalogue",
    loc1_desc: "Explorez des centaines de tenues traditionnelles authentiques disponibles partout en Algérie.",
    loc2_titre: "Réservez votre tenue",
    loc2_desc: "Sélectionnez vos dates, vérifiez la disponibilité et contactez le propriétaire pour finaliser les détails.",
    loc3_titre: "Payez en toute sécurité",
    loc3_desc: "Effectuez le paiement via Barid Mobile, CCP ou CIB. Une caution est requise pour protéger la tenue.",
    loc4_titre: "Profitez de votre événement",
    loc4_desc: "Récupérez la tenue, profitez de votre événement, puis retournez-la au propriétaire dans les délais convenus.",
    // Comment ça marche — Propriétaire
    pro1_titre: "Créez votre compte",
    pro1_desc: "Inscrivez-vous gratuitement en tant que propriétaire. Vérifiez votre identité avec votre numéro de téléphone.",
    pro2_titre: "Publiez votre annonce",
    pro2_desc: "Photographiez votre tenue, ajoutez une description détaillée, les tailles disponibles et fixez votre tarif journalier.",
    pro3_titre: "Gérez les réservations",
    pro3_desc: "Recevez des demandes de location. Vous décidez qui peut louer votre tenue et pour quelles dates.",
    pro4_titre: "Recevez vos paiements",
    pro4_desc: "Après chaque location, vous recevez 85% du montant total sur votre compte. Commission plateforme : 15%.",
  });
  const [paramsLoading, setParamsLoading] = useState(false);
  const [paramsSaving, setParamsSaving] = useState(false);
  const [contentSection, setContentSection] = useState<string | null>(null);

  useEffect(() => {
    adminApi.stats()
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setStatsLoading(false));
    adminApi.statsMensuelles()
      .then((res) => setStatsMensuelles(res.data ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (activeTab === "users" && users.length === 0) {
      setUsersLoading(true);
      adminApi.utilisateurs()
        .then((res) => setUsers(res.data?.data ?? res.data ?? []))
        .catch(() => toast.error("Erreur chargement utilisateurs"))
        .finally(() => setUsersLoading(false));
    }
    if (activeTab === "listings" && listings.length === 0) {
      setListingsLoading(true);
      Promise.all([adminApi.tenues(), adminApi.tenuesEnAttente()])
        .then(([allRes, pendingRes]) => {
          setListings(allRes.data?.data ?? allRes.data ?? []);
          setTenuesEnAttente(pendingRes.data ?? []);
        })
        .catch(() => toast.error("Erreur chargement annonces"))
        .finally(() => setListingsLoading(false));
    }
    if (activeTab === "payments" && pendingPayments.length === 0) {
      setPaymentsLoading(true);
      adminApi.paiementsEnAttente()
        .then((res) => setPendingPayments(res.data?.data ?? res.data ?? []))
        .catch(() => {})
        .finally(() => setPaymentsLoading(false));
    }
    if (activeTab === "bookings" && allPayments.length === 0) {
      adminApi.paiements()
        .then((res) => setAllPayments(res.data?.data ?? res.data ?? []))
        .catch(() => {});
    }
    if (activeTab === "virements") {
      setVirementsLoading(true);
      adminApi.reservationsARegler()
        .then((res) => setVirements(res.data?.data ?? res.data ?? []))
        .catch(() => toast.error("Erreur chargement virements"))
        .finally(() => setVirementsLoading(false));
    }
    if (activeTab === "disputes" && disputes.length === 0) {
      setDisputesLoading(true);
      adminApi.litiges()
        .then((res) => setDisputes(res.data?.data ?? res.data ?? []))
        .catch(() => toast.error("Erreur chargement litiges"))
        .finally(() => setDisputesLoading(false));
    }
    if (activeTab === "verifications" && verifications.length === 0) {
      setVerifLoading(true);
      adminApi.verifications()
        .then((res) => setVerifications(res.data?.data ?? res.data ?? []))
        .catch(() => toast.error("Erreur chargement vérifications"))
        .finally(() => setVerifLoading(false));
    }
    if (activeTab === "messages" && contactMsgs.length === 0) {
      setContactLoading(true);
      adminApi.contactMessages()
        .then((res) => setContactMsgs(res.data?.data ?? res.data ?? []))
        .catch(() => toast.error("Erreur chargement messages"))
        .finally(() => setContactLoading(false));
    }
    if (activeTab === "parametres") {
      setParamsLoading(true);
      parametresApi.get()
        .then((res) => {
          const d = res.data;
          setParams((prev) => ({
            ...prev,
            site_nom: d.site_nom ?? prev.site_nom,
            site_slogan: d.site_slogan ?? prev.site_slogan,
            contact_adresse: d.contact_adresse ?? prev.contact_adresse,
            contact_tel: d.contact_tel ?? prev.contact_tel,
            contact_email: d.contact_email ?? prev.contact_email,
            commission_pct: String(d.commission_pct ?? prev.commission_pct),
            facebook_url: d.facebook_url ?? prev.facebook_url,
            instagram_url: d.instagram_url ?? prev.instagram_url,
            hero_titre: d.hero_titre ?? prev.hero_titre,
            hero_badge: d.hero_badge ?? prev.hero_badge,
            prix_livraison: String(d.prix_livraison ?? prev.prix_livraison),
            sec1_titre: d.sec1_titre ?? prev.sec1_titre, sec1_desc: d.sec1_desc ?? prev.sec1_desc,
            sec2_titre: d.sec2_titre ?? prev.sec2_titre, sec2_desc: d.sec2_desc ?? prev.sec2_desc,
            sec3_titre: d.sec3_titre ?? prev.sec3_titre, sec3_desc: d.sec3_desc ?? prev.sec3_desc,
            sec4_titre: d.sec4_titre ?? prev.sec4_titre, sec4_desc: d.sec4_desc ?? prev.sec4_desc,
            loc1_titre: d.loc1_titre ?? prev.loc1_titre, loc1_desc: d.loc1_desc ?? prev.loc1_desc,
            loc2_titre: d.loc2_titre ?? prev.loc2_titre, loc2_desc: d.loc2_desc ?? prev.loc2_desc,
            loc3_titre: d.loc3_titre ?? prev.loc3_titre, loc3_desc: d.loc3_desc ?? prev.loc3_desc,
            loc4_titre: d.loc4_titre ?? prev.loc4_titre, loc4_desc: d.loc4_desc ?? prev.loc4_desc,
            pro1_titre: d.pro1_titre ?? prev.pro1_titre, pro1_desc: d.pro1_desc ?? prev.pro1_desc,
            pro2_titre: d.pro2_titre ?? prev.pro2_titre, pro2_desc: d.pro2_desc ?? prev.pro2_desc,
            pro3_titre: d.pro3_titre ?? prev.pro3_titre, pro3_desc: d.pro3_desc ?? prev.pro3_desc,
            pro4_titre: d.pro4_titre ?? prev.pro4_titre, pro4_desc: d.pro4_desc ?? prev.pro4_desc,
          }));
        })
        .catch(() => {})
        .finally(() => setParamsLoading(false));
    }
  }, [activeTab]);

  const suspendreUser = async (user: any) => {
    setSuspendingId(user.id);
    try {
      const res = await adminApi.suspendre(user.id);
      const newVerifie = res.data?.verifie ?? !user.verifie;
      setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, verifie: newVerifie } : u));
      toast.success(!user.verifie ? `Compte de ${user.nom} réactivé` : `Compte de ${user.nom} suspendu`);
    } catch {
      toast.error("Erreur lors de la suspension");
    } finally {
      setSuspendingId(null);
    }
  };

  const supprimerTenue = async (listing: any) => {
    if (!confirm(`Supprimer l'annonce "${listing.titre}" ?`)) return;
    setDeletingId(listing.id);
    try {
      await adminApi.supprimerTenue(listing.id);
      setListings((prev) => prev.filter((l) => l.id !== listing.id));
      toast.success(`Annonce "${listing.titre}" supprimée`);
    } catch {
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeletingId(null);
    }
  };

  const validerTenue = async (tenue: any) => {
    setValidatingTenueId(tenue.id);
    try {
      await adminApi.validerTenue(tenue.id);
      setTenuesEnAttente((prev) => prev.filter((t) => t.id !== tenue.id));
      setListings((prev) => prev.map((t) => t.id === tenue.id ? { ...t, statut: "disponible" } : t));
      toast.success(`Annonce "${tenue.titre}" validée et publiée`);
    } catch {
      toast.error("Erreur lors de la validation");
    } finally {
      setValidatingTenueId(null);
    }
  };

  const rejeterTenue = async (tenue: any) => {
    const motif = window.prompt("Motif du rejet :");
    if (!motif) return;
    setValidatingTenueId(tenue.id);
    try {
      await adminApi.rejeterTenue(tenue.id, motif);
      setTenuesEnAttente((prev) => prev.filter((t) => t.id !== tenue.id));
      toast.success(`Annonce "${tenue.titre}" rejetée`);
    } catch {
      toast.error("Erreur lors du rejet");
    } finally {
      setValidatingTenueId(null);
    }
  };

  const validerPaiement = async (payment: any) => {
    if (!confirm(`Valider le paiement de ${payment.reservation?.locataire?.nom} pour "${payment.reservation?.tenue?.titre}" ?`)) return;
    setValidatingPaymentId(payment.id);
    try {
      await adminApi.validerPaiement(payment.id);
      setPendingPayments((prev) => prev.filter((p) => p.id !== payment.id));
      toast.success("Paiement validé ! La location est maintenant en cours.");
      adminApi.stats().then((res) => setStats(res.data)).catch(() => {});
    } catch {
      toast.error("Erreur lors de la validation");
    } finally {
      setValidatingPaymentId(null);
    }
  };

  const rejeterPaiement = async (payment: any) => {
    const motif = window.prompt("Motif du rejet (optionnel) :");
    setValidatingPaymentId(payment.id);
    try {
      await adminApi.rejeterPaiement(payment.id, motif ?? undefined);
      setPendingPayments((prev) => prev.filter((p) => p.id !== payment.id));
      toast.success("Paiement rejeté. La réservation a été annulée.");
    } catch {
      toast.error("Erreur lors du rejet");
    } finally {
      setValidatingPaymentId(null);
    }
  };

  const payerVirement = async (reservation: any) => {
    const proprietaire = reservation.tenue?.proprietaire;
    const net = Math.round(parseFloat(reservation.montant_total) * 0.85);
    if (!confirm(`Confirmer le virement de ${net.toLocaleString("fr-DZ")} DA à ${proprietaire?.nom ?? "le propriétaire"} ?`)) return;
    setPayingId(reservation.id);
    try {
      await adminApi.payerProprietaire(reservation.id);
      setVirements((prev) => prev.filter((r) => r.id !== reservation.id));
      toast.success(`Virement confirmé ! ${net.toLocaleString('fr-DZ')} DA envoyé à ${proprietaire?.nom ?? ''}`);
    } catch {
      toast.error("Erreur lors du virement");
    } finally {
      setPayingId(null);
    }
  };

  const resoudreLitige = async (litige: any) => {
    const decision = window.prompt("Décision admin :");
    if (!decision) return;
    setResolvingId(litige.id);
    try {
      await adminApi.resoudreLitige(litige.id, decision);
      setDisputes((prev) => prev.map((d) => d.id === litige.id ? { ...d, statut: "clos", decision_admin: decision } : d));
      toast.success(`Litige résolu — ${decision}`);
    } catch {
      toast.error("Erreur lors de la résolution");
    } finally {
      setResolvingId(null);
    }
  };

  const validerVerif = async (user: any) => {
    setVerifActionId(user.id);
    try {
      await adminApi.validerVerification(user.id);
      setVerifications((prev) => prev.map((u) => u.id === user.id ? { ...u, statut_verification: "verifie", verifie: true } : u));
      toast.success(`Identité de ${user.nom} vérifiée`);
    } catch {
      toast.error("Erreur lors de la vérification");
    } finally {
      setVerifActionId(null);
    }
  };

  const rejeterVerif = async (user: any) => {
    const motif = window.prompt("Motif du rejet :");
    if (!motif) return;
    setVerifActionId(user.id);
    try {
      await adminApi.rejeterVerification(user.id, motif);
      setVerifications((prev) => prev.map((u) => u.id === user.id ? { ...u, statut_verification: "rejete", verifie: false, motif_rejet: motif } : u));
      toast.success(`Vérification de ${user.nom} rejetée`);
    } catch {
      toast.error("Erreur lors du rejet");
    } finally {
      setVerifActionId(null);
    }
  };

  const sauvegarderParams = async () => {
    setParamsSaving(true);
    try {
      await parametresApi.modifier({ ...params, commission_pct: parseFloat(params.commission_pct) });
      toast.success("Paramètres sauvegardés ! Les modifications seront appliquées immédiatement.");
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setParamsSaving(false);
    }
  };

  const envoyerMessageAdmin = async () => {
    if (!msgModal || msgContenu.trim().length < 5) return;
    setMsgLoading(true);
    try {
      await adminApi.envoyerMessage(msgModal.id, msgContenu);
      toast.success(`Message envoyé à ${msgModal.nom}`);
      setMsgModal(null);
      setMsgContenu("");
    } catch {
      toast.error("Erreur lors de l'envoi du message");
    } finally {
      setMsgLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.nom?.toLowerCase().includes(searchUsers.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchUsers.toLowerCase()),
  );

  const filteredListings = listings.filter(
    (l) =>
      l.titre?.toLowerCase().includes(searchListings.toLowerCase()) ||
      l.type?.toLowerCase().includes(searchListings.toLowerCase()),
  );

  const getRoleBadge = (role: string) => {
    const map: Record<string, string> = {
      admin:        "bg-red-100 text-red-700",
      proprietaire: "bg-[#1B4D3E]/10 text-[#1B4D3E]",
      locataire:    "bg-[#C9924A]/10 text-[#C9924A]",
    };
    const labels: Record<string, string> = {
      admin: "Administrateur", proprietaire: "Propriétaire", locataire: "Locataire",
    };
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full ${map[role] ?? "bg-gray-100 text-gray-600"}`} style={{ fontWeight: 500 }}>
        {labels[role] || role}
      </span>
    );
  };

  const getVerifBadge = (statut: string) => {
    const map: Record<string, { cls: string; label: string }> = {
      verifie:    { cls: "bg-green-100 text-green-700",   label: "Vérifié" },
      en_attente: { cls: "bg-yellow-100 text-yellow-700", label: "En attente" },
      rejete:     { cls: "bg-red-100 text-red-600",       label: "Rejeté" },
      non_soumis: { cls: "bg-gray-100 text-gray-500",     label: "Non soumis" },
    };
    const s = map[statut] ?? map.non_soumis;
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full ${s.cls}`} style={{ fontWeight: 500 }}>{s.label}</span>
    );
  };

  const statsCards = [
    {
      icon: <Users size={20} />,
      label: "Utilisateurs inscrits",
      value: stats ? stats.utilisateurs.toLocaleString() : "—",
      change: stats ? `${stats.en_cours} locations en cours` : "",
      bg: "bg-blue-50", color: "text-blue-700",
    },
    {
      icon: <ShoppingBag size={20} />,
      label: "Annonces actives",
      value: stats ? stats.tenues.toString() : "—",
      change: "",
      bg: "bg-[#1B4D3E]/10", color: "text-[#1B4D3E]",
    },
    {
      icon: <TrendingUp size={20} />,
      label: "Locations totales",
      value: stats ? stats.reservations.toLocaleString() : "—",
      change: stats ? `${stats.litiges_ouverts} litige(s) ouvert(s)` : "",
      bg: "bg-purple-50", color: "text-purple-700",
    },
    {
      icon: <DollarSign size={20} />,
      label: "Revenus plateforme",
      value: stats ? `${Number(stats.commission_total).toLocaleString("fr-DZ")} DA` : "—",
      change: stats ? `Sur ${Number(stats.revenus_total).toLocaleString("fr-DZ")} DA` : "",
      bg: "bg-amber-50", color: "text-amber-700",
    },
  ];

  const tabs = [
    { key: "overview",      label: "Vue d'ensemble" },
    { key: "virements",     label: "💸 Virements" },
    { key: "users",         label: "Utilisateurs" },
    { key: "listings",      label: "Annonces" },
    { key: "payments",      label: "Paiements" },
    { key: "disputes",      label: "Litiges" },
    { key: "verifications", label: "Vérifications" },
    { key: "bookings",      label: "Transactions" },
    { key: "messages",      label: "✉️ Messages" },
    { key: "parametres",    label: "⚙️ Paramètres" },
  ];

  return (
    <div className="min-h-screen bg-[#FAF6EF] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#8B2635] rounded-xl flex items-center justify-center text-white">
            <BarChart2 size={20} />
          </div>
          <div>
            <h1 className="text-gray-900 text-2xl" style={{ fontWeight: 700 }}>Tableau de bord administrateur</h1>
            <p className="text-gray-500 text-sm">Gestion globale de la plateforme KASEWA.DZ</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsCards.map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-card-in" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                {stat.icon}
              </div>
              {statsLoading ? (
                <div className="h-7 bg-gray-100 rounded animate-pulse mb-1" />
              ) : (
                <p className="text-2xl text-gray-900" style={{ fontWeight: 700 }}>{stat.value}</p>
              )}
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
              {stat.change && <p className="text-xs mt-1 text-green-600" style={{ fontWeight: 500 }}>{stat.change}</p>}
            </div>
          ))}
        </div>

        {/* Commission Alert */}
        {stats && (
          <div className="bg-[#C9924A]/10 border border-[#C9924A]/30 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-[#C9924A] rounded-xl flex items-center justify-center text-white shrink-0">
              <DollarSign size={18} />
            </div>
            <div>
              <p className="text-[#C9924A] text-sm" style={{ fontWeight: 700 }}>
                Revenus de commission : {Number(stats.commission_total).toLocaleString("fr-DZ")} DA
              </p>
              <p className="text-gray-500 text-xs">
                Boutique 15% : {Math.round(Number(stats.revenus_boutique) * 0.15).toLocaleString("fr-DZ")} DA
                {" · "}
                Investisseur 19% : {Math.round(Number(stats.revenus_investisseur) * 0.19).toLocaleString("fr-DZ")} DA
              </p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-gray-100 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex-1 min-w-max px-3 py-2 rounded-lg text-xs sm:text-sm transition-colors whitespace-nowrap ${
                activeTab === tab.key ? "bg-[#8B2635] text-white shadow-sm" : "text-gray-600 hover:text-gray-800"
              }`}
              style={{ fontWeight: 500 }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Overview ───────────────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-gray-900" style={{ fontWeight: 700 }}>Activité mensuelle</h3>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#1B4D3E] inline-block" />Locations</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#C9924A] inline-block" />Revenus (×100 DA)</span>
                </div>
              </div>
              {(() => {
                const data = statsMensuelles.length > 0
                  ? statsMensuelles.map(d => ({ month: d.mois, locations: d.locations, revenus: d.revenus }))
                  : [];
                const maxL = Math.max(...data.map(d => d.locations), 1);
                const maxR = Math.max(...data.map(d => d.revenus), 1);
                const BAR_H = 150;

                if (data.length === 0) {
                  return <div className="flex items-center justify-center h-40 text-gray-300 text-sm"><Loader2 className="animate-spin mr-2" size={16} />Chargement...</div>;
                }

                return (
                  <div>
                    {/* Graphique barres groupées */}
                    <div className="flex items-end gap-3" style={{ height: `${BAR_H + 40}px` }}>
                      {/* Axe Y gauche (locations) */}
                      <div className="flex flex-col justify-between items-end shrink-0" style={{ height: `${BAR_H}px` }}>
                        {[maxL, Math.round(maxL * 0.5), 0].map((v) => (
                          <span key={v} className="text-xs text-[#1B4D3E]" style={{ fontWeight: 600 }}>{v}</span>
                        ))}
                      </div>

                      {/* Barres */}
                      <div className="flex-1 flex items-end gap-2 relative" style={{ height: `${BAR_H + 40}px` }}>
                        {/* Lignes de grille */}
                        <div className="absolute inset-x-0 top-0 pointer-events-none" style={{ height: `${BAR_H}px` }}>
                          {[0, 0.25, 0.5, 0.75, 1].map((p) => (
                            <div key={p} className="absolute w-full border-t border-dashed border-gray-100"
                              style={{ bottom: `${p * BAR_H}px` }} />
                          ))}
                        </div>
                        {data.map((d) => (
                          <div key={d.month} className="flex-1 flex flex-col items-center justify-end group" style={{ height: `${BAR_H + 30}px` }}>
                            <div className="w-full flex items-end gap-1 justify-center" style={{ height: `${BAR_H}px` }}>
                              {/* Barre locations */}
                              <div className="flex-1 flex flex-col items-center justify-end">
                                {d.locations > 0 && (
                                  <span className="text-xs text-[#1B4D3E] mb-0.5" style={{ fontWeight: 700 }}>{d.locations}</span>
                                )}
                                <div
                                  className="w-full bg-[#1B4D3E] rounded-t-md transition-all hover:bg-[#2d6b55] cursor-default"
                                  style={{ height: `${Math.max((d.locations / maxL) * BAR_H, d.locations > 0 ? 4 : 0)}px` }}
                                  title={`Locations : ${d.locations}`}
                                />
                              </div>
                              {/* Barre revenus */}
                              <div className="flex-1 flex flex-col items-center justify-end">
                                {d.revenus > 0 && (
                                  <span className="text-xs text-[#C9924A] mb-0.5 text-center leading-tight" style={{ fontWeight: 700 }}>
                                    {d.revenus >= 1000 ? `${Math.round(d.revenus/1000)}k` : d.revenus}
                                  </span>
                                )}
                                <div
                                  className="w-full bg-[#C9924A]/80 rounded-t-md transition-all hover:bg-[#C9924A] cursor-default"
                                  style={{ height: `${Math.max((d.revenus / maxR) * BAR_H, d.revenus > 0 ? 4 : 0)}px` }}
                                  title={`Revenus : ${d.revenus.toLocaleString("fr-DZ")} DA`}
                                />
                              </div>
                            </div>
                            <span className="text-xs text-gray-400 mt-2 text-center" style={{ fontWeight: 500 }}>{d.month}</span>
                          </div>
                        ))}
                      </div>

                      {/* Axe Y droit (revenus) */}
                      <div className="flex flex-col justify-between items-start shrink-0" style={{ height: `${BAR_H}px` }}>
                        {[maxR, Math.round(maxR * 0.5), 0].map((v) => (
                          <span key={v} className="text-xs text-[#C9924A]" style={{ fontWeight: 600 }}>
                            {v >= 1000 ? `${Math.round(v/1000)}k` : v}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Axe X label */}
                    <div className="flex items-center justify-between mt-2 px-8 text-xs text-gray-400">
                      <span className="text-[#1B4D3E]" style={{ fontWeight: 600 }}>← Nb. locations</span>
                      <span className="text-[#C9924A]" style={{ fontWeight: 600 }}>Revenus (DA) →</span>
                    </div>
                  </div>
                );
              })()}
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-gray-900 mb-4" style={{ fontWeight: 700 }}>Résumé temps réel</h3>
              <div className="space-y-2.5">
                {[
                  { label: "Litiges ouverts",      value: stats?.litiges_ouverts ?? "—", color: "text-red-600",      icon: <AlertCircle size={15} /> },
                  { label: "Locations en cours",   value: stats?.en_cours ?? "—",        color: "text-[#C9924A]",    icon: <Clock size={15} /> },
                  { label: "Annonces publiées",    value: stats?.tenues ?? "—",          color: "text-[#1B4D3E]",    icon: <ShoppingBag size={15} /> },
                  { label: "Utilisateurs inscrits",value: stats?.utilisateurs ?? "—",    color: "text-blue-600",     icon: <Users size={15} /> },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                    <div className={`flex items-center gap-2 ${item.color}`}>
                      {item.icon}
                      <span className="text-xs text-gray-600">{item.label}</span>
                    </div>
                    <span className={`text-sm ${item.color}`} style={{ fontWeight: 700 }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Virements ──────────────────────────────────────────────────── */}
        {activeTab === "virements" && (
          <div className="space-y-4">
            <div className="bg-[#1B4D3E]/10 border border-[#1B4D3E]/20 rounded-2xl p-4 flex items-start gap-3">
              <DollarSign size={20} className="text-[#1B4D3E] shrink-0 mt-0.5" />
              <div>
                <p className="text-[#1B4D3E] text-sm" style={{ fontWeight: 700 }}>Virements à effectuer</p>
                <p className="text-gray-600 text-xs mt-0.5">
                  Quand une location est terminée, vous devez virer 85% du montant au propriétaire via Barid Mobile/CCP,
                  et la caution est automatiquement libérée pour le locataire.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-gray-900" style={{ fontWeight: 700 }}>
                  Locations terminées — virements en attente ({virements.length})
                </h3>
              </div>

              {virementsLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin text-[#1B4D3E]" size={28} /></div>
              ) : virements.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle size={40} className="mx-auto text-green-300 mb-3" />
                  <p className="text-gray-500 text-sm">Tous les virements sont effectués ✓</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {virements.map((res) => {
                    const proprietaire = res.tenue?.proprietaire;
                    const locataire = res.locataire;
                    const isBoutique = proprietaire?.type_proprietaire === "boutique";
                    const commissionRate = isBoutique ? 0.15 : 0.19;
                    const net = Math.round(parseFloat(res.montant_total) * (1 - commissionRate));
                    const caution = res.caution?.montant ?? res.tenue?.caution ?? 0;
                    return (
                      <div key={res.id} className="p-5 hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col gap-4">
                          {/* Ligne titre + dates */}
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div>
                              <p className="text-gray-900" style={{ fontWeight: 600 }}>{res.tenue?.titre ?? "Tenue"}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{res.date_debut} → {res.date_fin} · Montant : <span style={{ fontWeight: 600 }}>{parseFloat(res.montant_total).toLocaleString("fr-DZ")} DA</span></p>
                            </div>
                            <button
                              onClick={() => payerVirement(res)}
                              disabled={payingId === res.id}
                              className="flex items-center gap-2 bg-[#1B4D3E] text-white px-5 py-2.5 rounded-xl text-sm hover:bg-[#2d6b55] disabled:opacity-50 transition-colors shrink-0"
                              style={{ fontWeight: 600 }}>
                              {payingId === res.id
                                ? <Loader2 size={14} className="animate-spin" />
                                : <CreditCard size={14} />}
                              Confirmer virement
                            </button>
                          </div>

                          {/* Infos paiement */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* Virement propriétaire */}
                            <div className="bg-[#1B4D3E]/5 border border-[#1B4D3E]/15 rounded-xl p-4">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-xs text-gray-500" style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                  Propriétaire — Virer {net.toLocaleString("fr-DZ")} DA
                                </p>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${isBoutique ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`} style={{ fontWeight: 600 }}>
                                  {isBoutique ? "Boutique 15%" : "Investisseur 19%"}
                                </span>
                              </div>
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-400 w-20 shrink-0">Nom :</span>
                                  <span className="text-sm text-gray-900" style={{ fontWeight: 700 }}>{proprietaire?.nom ?? "—"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-400 w-20 shrink-0">Téléphone :</span>
                                  <span className="text-sm text-gray-900" style={{ fontWeight: 600 }}>{proprietaire?.telephone ?? <span className="text-red-400">Non renseigné</span>}</span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <span className="text-xs text-gray-400 w-20 shrink-0 mt-0.5">RIB Barid :</span>
                                  {proprietaire?.rib_barid ? (
                                    <span className="text-sm text-[#1B4D3E] font-mono tracking-widest" style={{ fontWeight: 700 }}>
                                      {proprietaire.rib_barid}
                                    </span>
                                  ) : (
                                    <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full" style={{ fontWeight: 600 }}>
                                      RIB non renseigné — contacter le propriétaire
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Caution locataire */}
                            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                              <p className="text-xs text-gray-500 mb-2" style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                Locataire — Caution {parseFloat(caution).toLocaleString("fr-DZ")} DA
                              </p>
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-400 w-20 shrink-0">Nom :</span>
                                  <span className="text-sm text-gray-900" style={{ fontWeight: 700 }}>{locataire?.nom ?? "—"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-400 w-20 shrink-0">Téléphone :</span>
                                  <span className="text-sm text-gray-900" style={{ fontWeight: 600 }}>{locataire?.telephone ?? "—"}</span>
                                </div>
                                <p className="text-amber-700 flex items-center gap-1 mt-1" style={{ fontWeight: 600, fontSize: "0.8rem" }}>
                                  <CheckCircle size={13} /> Caution libérée automatiquement
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Users ──────────────────────────────────────────────────────── */}
        {activeTab === "users" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <div className="relative max-w-xs">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Rechercher un utilisateur..." value={searchUsers}
                  onChange={(e) => setSearchUsers(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#8B2635]" />
              </div>
            </div>
            {usersLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="animate-spin text-gray-400" size={28} /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 text-left">
                    <tr>
                      {["Utilisateur", "Téléphone", "Rôle", "Wilaya", "Vérifié", "Annonces", "Actions"].map((h) => (
                        <th key={h} className="px-4 py-3 text-xs text-gray-500" style={{ fontWeight: 600 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className={`hover:bg-gray-50 transition-colors ${!user.verifie ? "opacity-60" : ""}`}>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#1B4D3E] rounded-full flex items-center justify-center text-white text-sm shrink-0" style={{ fontWeight: 600 }}>
                              {user.nom?.[0] ?? "?"}
                            </div>
                            <div>
                              <p className="text-sm text-gray-900" style={{ fontWeight: 600 }}>{user.nom}</p>
                              <p className="text-xs text-gray-400">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          {user.telephone ? (
                            <div className="flex items-center gap-1.5">
                              <Phone size={12} className="text-gray-400" />
                              <span className="text-sm text-gray-700">{user.telephone}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-red-400 bg-red-50 px-2 py-0.5 rounded-full">Non renseigné</span>
                          )}
                        </td>
                        <td className="px-4 py-4">{getRoleBadge(user.role)}</td>
                        <td className="px-4 py-4 text-sm text-gray-500">{user.wilaya || "—"}</td>
                        <td className="px-4 py-4">
                          {user.verifie
                            ? <CheckCircle size={16} className="text-green-500" />
                            : <XCircle size={16} className="text-red-400" />}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600" style={{ fontWeight: 500 }}>
                          {user.tenues_count ?? 0}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => setUserDetailModal(user)}
                              className="p-1.5 text-gray-400 hover:text-[#1B4D3E] bg-gray-50 rounded-lg" title="Voir détails">
                              <Eye size={13} />
                            </button>
                            <button
                              onClick={() => { setMsgModal(user); setMsgContenu(""); }}
                              className="p-1.5 text-gray-400 hover:text-blue-600 bg-gray-50 rounded-lg" title="Envoyer un message">
                              <MessageSquare size={13} />
                            </button>
                            <button
                              onClick={() => suspendreUser(user)}
                              disabled={suspendingId === user.id}
                              className={`p-1.5 rounded-lg ${!user.verifie ? "bg-red-100 text-red-500 hover:bg-red-200" : "text-gray-400 hover:text-red-500 bg-gray-50"}`}
                              title={!user.verifie ? "Réactiver" : "Suspendre"}>
                              {suspendingId === user.id ? <Loader2 size={13} className="animate-spin" /> : <Ban size={13} />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr><td colSpan={7} className="text-center py-10 text-gray-400 text-sm">Aucun utilisateur trouvé</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Listings ───────────────────────────────────────────────────── */}
        {activeTab === "listings" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <div className="relative max-w-xs">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Rechercher une annonce..." value={searchListings}
                  onChange={(e) => setSearchListings(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#8B2635]" />
              </div>
            </div>
            {listingsLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="animate-spin text-gray-400" size={28} /></div>
            ) : (
              <div className="divide-y divide-gray-50">
                {filteredListings.map((listing) => {
                  const firstPhoto = listing.photos?.[0] ?? listing.photo_principale;
                  const img = firstPhoto?.chemin ? STORAGE_URL + firstPhoto.chemin : FALLBACK_IMG;
                  return (
                    <div key={listing.id} className="flex items-center gap-4 p-5 hover:bg-gray-50">
                      <img src={img} alt={listing.titre} className="w-14 h-14 rounded-xl object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 truncate" style={{ fontWeight: 600 }}>{listing.titre}</p>
                        <p className="text-xs text-gray-400">{listing.proprietaire?.nom ?? "—"} · {listing.wilaya ?? listing.proprietaire?.wilaya ?? "—"}</p>
                        <span className="text-xs text-[#1B4D3E]" style={{ fontWeight: 500 }}>
                          {parseFloat(listing.prix_jour ?? 0).toLocaleString("fr-DZ")} DA/j
                        </span>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${listing.statut === "disponible" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"}`}>
                          {listing.statut === "disponible" ? "Disponible" : listing.statut}
                        </span>
                        <div className="flex gap-1.5">
                          <Link to={`/annonce/${listing.id}`} className="p-1.5 text-gray-400 hover:text-[#1B4D3E] bg-gray-50 rounded-lg">
                            <Eye size={13} />
                          </Link>
                          <button onClick={() => supprimerTenue(listing)} disabled={deletingId === listing.id}
                            className="p-1.5 text-gray-400 hover:text-red-500 bg-gray-50 rounded-lg">
                            {deletingId === listing.id ? <Loader2 size={13} className="animate-spin" /> : <Ban size={13} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {filteredListings.length === 0 && (
                  <div className="text-center py-10 text-gray-400 text-sm">Aucune annonce trouvée</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Payments ───────────────────────────────────────────────────── */}
        {activeTab === "payments" && (
          <div className="space-y-4">
            {pendingPayments.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                  <CreditCard size={20} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="text-blue-900 text-sm mb-1" style={{ fontWeight: 700 }}>Paiements en attente de validation</h4>
                  <p className="text-blue-700 text-sm">
                    <span style={{ fontWeight: 600 }}>{pendingPayments.length}</span> paiement(s) à vérifier.
                  </p>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h3 className="text-gray-900" style={{ fontWeight: 700 }}>Validation des paiements</h3>
              </div>
              {paymentsLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="animate-spin text-gray-400" size={28} /></div>
              ) : pendingPayments.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle size={32} className="text-gray-400" />
                  </div>
                  <p className="text-gray-600 text-sm">Aucun paiement en attente</p>
                  <p className="text-gray-400 text-xs mt-1">Tous les paiements ont été traités</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {pendingPayments.map((payment) => (
                    <div key={payment.id} className="p-5 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start gap-4">
                        {/* Miniature du reçu cliquable */}
                        {payment.recu_photo ? (
                          <button
                            onClick={() => setPhotoModal(STORAGE_URL + payment.recu_photo)}
                            className="w-16 h-16 rounded-xl overflow-hidden border-2 border-dashed border-blue-300 hover:border-blue-500 shrink-0 bg-blue-50 flex items-center justify-center group relative transition-colors"
                            title="Voir le reçu de paiement"
                          >
                            <img
                              src={STORAGE_URL + payment.recu_photo}
                              alt="Reçu"
                              className="w-full h-full object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                              <Eye size={16} className="text-white" />
                            </div>
                          </button>
                        ) : (
                          <div className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-200 shrink-0 bg-gray-50 flex flex-col items-center justify-center gap-1">
                            <FileText size={18} className="text-gray-300" />
                            <span className="text-xs text-gray-300">Reçu</span>
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 truncate" style={{ fontWeight: 600 }}>
                            {payment.reservation?.tenue?.titre ?? "—"}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Locataire : <span style={{ fontWeight: 600 }}>{payment.reservation?.locataire?.nom ?? "—"}</span>
                          </p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full" style={{ fontWeight: 500 }}>
                              {payment.mode?.replace("_", " ").toUpperCase()}
                            </span>
                            {payment.ref_transaction && (
                              <span className="text-xs text-gray-400 font-mono">Réf : {payment.ref_transaction}</span>
                            )}
                          </div>
                          <p className="text-base text-[#1B4D3E] mt-1.5" style={{ fontWeight: 700 }}>
                            {parseFloat(payment.montant ?? 0).toLocaleString("fr-DZ")} DA
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <span className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full" style={{ fontWeight: 500 }}>
                            <Clock size={11} />En attente
                          </span>
                          <div className="flex gap-1.5">
                            <button onClick={() => validerPaiement(payment)} disabled={validatingPaymentId === payment.id}
                              className="flex items-center gap-1 text-xs bg-green-600 text-white px-3 py-1.5 rounded-xl hover:bg-green-700 disabled:opacity-50 transition-colors"
                              style={{ fontWeight: 600 }}>
                              {validatingPaymentId === payment.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                              Valider
                            </button>
                            <button onClick={() => rejeterPaiement(payment)} disabled={validatingPaymentId === payment.id}
                              className="flex items-center gap-1 text-xs border border-red-200 text-red-600 px-3 py-1.5 rounded-xl hover:bg-red-50 disabled:opacity-50 transition-colors"
                              style={{ fontWeight: 600 }}>
                              <XCircle size={12} />Rejeter
                            </button>
                          </div>
                          {payment.recu_photo && (
                            <button onClick={() => setPhotoModal(STORAGE_URL + payment.recu_photo)}
                              className="flex items-center gap-1 text-xs border border-blue-200 text-blue-600 px-3 py-1.5 rounded-xl hover:bg-blue-50 transition-colors w-full justify-center"
                              style={{ fontWeight: 600 }}>
                              <Eye size={12} />Voir le reçu
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Disputes ───────────────────────────────────────────────────── */}
        {activeTab === "disputes" && (
          <div className="space-y-4">
            {disputesLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="animate-spin text-gray-400" size={28} /></div>
            ) : disputes.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <CheckCircle size={40} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">Aucun litige enregistré</p>
              </div>
            ) : (
              disputes.map((litige) => {
                const clos = litige.statut === "clos";
                return (
                  <div key={litige.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 ${clos ? "bg-green-100" : "bg-red-100"} rounded-xl flex items-center justify-center shrink-0`}>
                          {clos ? <CheckCircle size={18} className="text-green-600" /> : <AlertCircle size={18} className="text-red-600" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900" style={{ fontWeight: 600 }}>
                            {litige.reservation?.tenue?.titre ?? `Litige #${litige.id}`}
                          </p>
                          <p className="text-sm text-gray-500 mt-0.5">
                            Locataire : <span style={{ fontWeight: 500 }}>{litige.reservation?.locataire?.nom ?? "—"}</span>
                          </p>
                          <p className={`text-sm mt-1 ${clos ? "text-green-600" : "text-red-600"}`}>
                            {clos ? `✓ Résolu — ${litige.decision_admin}` : `Motif : ${litige.description}`}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Signalé le {new Date(litige.created_at).toLocaleDateString("fr-DZ")}
                          </p>
                          {/* Photo du problème */}
                          {litige.photo_probleme && (
                            <button
                              onClick={() => setPhotoModal(STORAGE_URL + litige.photo_probleme)}
                              className="mt-2 flex items-center gap-1.5 text-xs bg-red-50 border border-red-200 text-red-700 px-3 py-1.5 rounded-full hover:bg-red-100 transition-colors"
                              style={{ fontWeight: 600 }}>
                              <Eye size={12} />Voir photo du problème
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-3 shrink-0">
                        <span className={`text-xs px-3 py-1 rounded-full ${clos ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`} style={{ fontWeight: 500 }}>
                          {clos ? "Résolu" : "En cours"}
                        </span>
                        {!clos && (
                          <button onClick={() => resoudreLitige(litige)} disabled={resolvingId === litige.id}
                            className="text-xs bg-[#1B4D3E] text-white px-3 py-1.5 rounded-full hover:bg-[#2d6b55] disabled:opacity-50 flex items-center gap-1">
                            {resolvingId === litige.id && <Loader2 size={12} className="animate-spin" />}
                            Résoudre
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ── Verifications ──────────────────────────────────────────────── */}
        {activeTab === "verifications" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-gray-900" style={{ fontWeight: 700 }}>Vérifications d'identité (CIN)</h3>
              <p className="text-sm text-gray-500 mt-1">Validez ou rejetez les demandes de vérification</p>
            </div>
            {verifLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="animate-spin text-gray-400" size={28} /></div>
            ) : (
              <div className="divide-y divide-gray-100">
                {verifications.map((user) => (
                  <div key={user.id} className="p-5 hover:bg-gray-50 transition-colors">
                    {/* ── En-tête utilisateur ── */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-11 h-11 bg-[#1B4D3E] rounded-full flex items-center justify-center text-white shrink-0 text-base" style={{ fontWeight: 700 }}>
                        {user.nom?.[0]?.toUpperCase() ?? "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm text-gray-900" style={{ fontWeight: 600 }}>{user.nom}</p>
                          {getRoleBadge(user.role)}
                          {getVerifBadge(user.statut_verification)}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
                        {user.cin_numero && (
                          <p className="text-xs text-gray-500 mt-0.5 font-mono">
                            N° CIN : <span style={{ fontWeight: 600 }}>{user.cin_numero}</span>
                          </p>
                        )}
                        {user.motif_rejet && (
                          <p className="text-xs text-red-500 mt-1 bg-red-50 px-2 py-1 rounded-lg">
                            ⚠ Motif rejet : {user.motif_rejet}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* ── Documents soumis ── */}
                    {(user.cin_photo_recto || user.cin_photo_verso || user.selfie_photo || user.ccp_photo || user.doc_boutique_photo) ? (
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-2" style={{ fontWeight: 600 }}>Documents soumis :</p>
                        <div className="flex gap-3 flex-wrap">
                          {[
                            { photo: user.cin_photo_recto,     label: "CIN Recto",    icon: <CreditCard size={11} />, color: "[#1B4D3E]" },
                            { photo: user.cin_photo_verso,     label: "CIN Verso",    icon: <CreditCard size={11} />, color: "[#1B4D3E]" },
                            { photo: user.selfie_photo,        label: "Selfie + CIN", icon: <Camera size={11} />,     color: "[#C9924A]" },
                            { photo: user.ccp_photo,           label: "Chèque CCP",   icon: <CreditCard size={11} />, color: "blue-600" },
                            { photo: user.doc_boutique_photo,  label: "Doc Boutique", icon: <FileText size={11} />,   color: "purple-600" },
                          ].filter(d => d.photo).map((doc) => (
                            <button
                              key={doc.label}
                              onClick={() => setPhotoModal(STORAGE_URL + doc.photo)}
                              className="flex flex-col items-center gap-1.5 p-3 border-2 border-dashed border-gray-200 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-colors group w-28"
                            >
                              <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                <img
                                  src={STORAGE_URL + doc.photo}
                                  alt={doc.label}
                                  className="w-full h-full object-cover"
                                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                />
                              </div>
                              <span className="text-xs text-gray-500 group-hover:text-gray-800 text-center leading-tight" style={{ fontWeight: 500 }}>
                                {doc.icon}{" "}{doc.label}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic mb-4">Aucun document soumis</p>
                    )}

                    {/* ── Actions ── */}
                    <div className="flex gap-2 flex-wrap">
                      {user.statut_verification !== "verifie" && (
                        <button onClick={() => validerVerif(user)} disabled={verifActionId === user.id}
                          className="flex items-center gap-1.5 text-xs bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 disabled:opacity-50 transition-colors"
                          style={{ fontWeight: 600 }}>
                          {verifActionId === user.id ? <Loader2 size={13} className="animate-spin" /> : <ShieldCheck size={13} />}
                          Valider le compte
                        </button>
                      )}
                      {user.statut_verification !== "rejete" && (
                        <button onClick={() => rejeterVerif(user)} disabled={verifActionId === user.id}
                          className="flex items-center gap-1.5 text-xs border border-red-200 text-red-600 px-4 py-2 rounded-xl hover:bg-red-50 disabled:opacity-50 transition-colors"
                          style={{ fontWeight: 600 }}>
                          <ShieldX size={13} />Rejeter
                        </button>
                      )}
                      {user.statut_verification === "verifie" && (
                        <span className="flex items-center gap-1.5 text-xs text-green-700 bg-green-50 px-4 py-2 rounded-xl" style={{ fontWeight: 600 }}>
                          <UserCheck size={13} />Compte vérifié
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {verifications.length === 0 && (
                  <div className="text-center py-12 text-gray-400 text-sm">Aucune demande de vérification</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Transactions ───────────────────────────────────────────────── */}
        {activeTab === "bookings" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-gray-900" style={{ fontWeight: 700 }}>Toutes les transactions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {["Tenue", "Locataire", "Montant", "Mode", "Référence", "Statut", "Date"].map((h) => (
                      <th key={h} className="px-4 py-3 text-xs text-gray-500 text-left" style={{ fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {allPayments.map((p) => {
                    const s = STATUS_FR[p.statut] ?? { label: p.statut, cls: "bg-gray-100 text-gray-600" };
                    return (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-sm text-gray-800 max-w-32 truncate" style={{ fontWeight: 500 }}>
                          {p.reservation?.tenue?.titre ?? "—"}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500">{p.reservation?.locataire?.nom ?? "—"}</td>
                        <td className="px-4 py-4 text-sm text-gray-800" style={{ fontWeight: 500 }}>
                          {parseFloat(p.montant ?? 0).toLocaleString("fr-DZ")} DA
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 capitalize">{p.mode}</td>
                        <td className="px-4 py-4 text-xs text-gray-400">{p.ref_transaction ?? "—"}</td>
                        <td className="px-4 py-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${s.cls}`} style={{ fontWeight: 500 }}>{s.label}</span>
                        </td>
                        <td className="px-4 py-4 text-xs text-gray-400">
                          {new Date(p.created_at).toLocaleDateString("fr-DZ")}
                        </td>
                      </tr>
                    );
                  })}
                  {allPayments.length === 0 && (
                    <tr><td colSpan={7} className="text-center py-10 text-gray-400 text-sm">Aucune transaction</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Messages de contact ────────────────────────────────────────── */}
        {activeTab === "messages" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-900 text-lg flex items-center gap-2" style={{ fontWeight: 700 }}>
                <Mail size={20} className="text-[#8B2635]" />
                Messages reçus via le formulaire de contact
              </h3>
              <span className="text-sm text-gray-500">
                {contactMsgs.filter((m) => !m.lu).length} non lu(s) sur {contactMsgs.length}
              </span>
            </div>

            {contactLoading ? (
              <div className="flex justify-center py-16"><Loader2 className="animate-spin text-[#8B2635]" size={32} /></div>
            ) : contactMsgs.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                <Mail size={40} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400">Aucun message reçu pour l'instant</p>
              </div>
            ) : (
              <div className="space-y-3">
                {contactMsgs.map((msg) => (
                  <div key={msg.id} className={`bg-white rounded-2xl shadow-sm border transition-all ${msg.lu ? "border-gray-100" : "border-[#C9924A]/40 ring-1 ring-[#C9924A]/20"}`}>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.lu ? "bg-gray-100" : "bg-[#C9924A]/10"}`}>
                            {msg.lu ? <MailOpen size={18} className="text-gray-400" /> : <Mail size={18} className="text-[#C9924A]" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-gray-900 text-sm" style={{ fontWeight: 600 }}>{msg.nom}</span>
                              {!msg.lu && (
                                <span className="text-xs px-2 py-0.5 bg-[#C9924A] text-white rounded-full" style={{ fontWeight: 600 }}>Nouveau</span>
                              )}
                            </div>
                            <p className="text-gray-500 text-xs mt-0.5">{msg.email}</p>
                            <p className="text-gray-700 text-sm mt-1" style={{ fontWeight: 500 }}>{msg.sujet}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-gray-400 text-xs whitespace-nowrap">
                            {new Date(msg.created_at).toLocaleDateString("fr-DZ", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                          </span>
                          <button
                            onClick={() => setExpandedMsg(expandedMsg === msg.id ? null : msg.id)}
                            className="text-[#1B4D3E] hover:text-[#2d6b55] p-1.5 rounded-lg hover:bg-[#1B4D3E]/10 transition-colors"
                            title="Voir le message"
                          >
                            <Eye size={16} />
                          </button>
                          {!msg.lu && (
                            <button
                              onClick={async () => {
                                try {
                                  await adminApi.marquerMessageLu(msg.id);
                                  setContactMsgs((prev) => prev.map((m) => m.id === msg.id ? { ...m, lu: true } : m));
                                } catch { toast.error("Erreur"); }
                              }}
                              className="text-green-600 hover:text-green-700 p-1.5 rounded-lg hover:bg-green-50 transition-colors"
                              title="Marquer comme lu"
                            >
                              <CheckCircle size={16} />
                            </button>
                          )}
                          <button
                            onClick={async () => {
                              if (!confirm(`Supprimer le message de ${msg.nom} ?`)) return;
                              try {
                                await adminApi.supprimerMessage(msg.id);
                                setContactMsgs((prev) => prev.filter((m) => m.id !== msg.id));
                                toast.success("Message supprimé");
                              } catch { toast.error("Erreur"); }
                            }}
                            className="text-red-500 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {expandedMsg === msg.id && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">{msg.message}</p>
                          <a
                            href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.sujet)}&body=Bonjour ${encodeURIComponent(msg.nom)},%0A%0A`}
                            className="inline-flex items-center gap-2 mt-3 text-sm text-white bg-[#1B4D3E] hover:bg-[#2d6b55] px-4 py-2 rounded-lg transition-colors"
                            style={{ fontWeight: 500 }}
                          >
                            <Mail size={14} />
                            Répondre par email
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Paramètres ─────────────────────────────────────────────────── */}
        {activeTab === "parametres" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-6">
                <Settings size={20} className="text-[#8B2635]" />
                <h3 className="text-gray-900 text-lg" style={{ fontWeight: 700 }}>Paramètres généraux</h3>
              </div>
              {paramsLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="animate-spin text-gray-400" size={28} /></div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {[
                      { key: "site_nom",       label: "Nom du site",    placeholder: "KASEWA.DZ" },
                      { key: "commission_pct", label: "Commission (%)", placeholder: "15" },
                      { key: "contact_tel",    label: "Téléphone",      placeholder: "+213 555 000 000" },
                      { key: "contact_email",  label: "Email contact",  placeholder: "contact@kasewa.dz" },
                      { key: "facebook_url",   label: "Facebook URL",   placeholder: "https://facebook.com/..." },
                      { key: "instagram_url",  label: "Instagram URL",  placeholder: "https://instagram.com/..." },
                    ].map(({ key, label, placeholder }) => (
                      <div key={key}>
                        <label className="block text-sm text-gray-600 mb-1.5" style={{ fontWeight: 500 }}>{label}</label>
                        <input type="text" value={(params as any)[key]}
                          onChange={(e) => setParams((p) => ({ ...p, [key]: e.target.value }))}
                          placeholder={placeholder}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#8B2635] bg-gray-50 text-gray-800" />
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm text-gray-600 mb-1.5" style={{ fontWeight: 500 }}>Slogan</label>
                    <input type="text" value={params.site_slogan}
                      onChange={(e) => setParams((p) => ({ ...p, site_slogan: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#8B2635] bg-gray-50 text-gray-800" />
                  </div>
                </>
              )}
            </div>

            <div className="bg-[#8B2635]/5 border border-[#8B2635]/20 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <AlertCircle size={18} className="text-[#8B2635] shrink-0 mt-0.5" />
                <p className="text-sm text-gray-600">
                  Les modifications s'appliquent immédiatement sur toute la plateforme. Commission actuelle :{" "}
                  <strong className="text-[#8B2635]">{params.commission_pct}%</strong>.
                </p>
              </div>
            </div>

            {/* ── Contenu du site ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 p-6 border-b border-gray-100">
                <FileText size={20} className="text-[#8B2635]" />
                <h3 className="text-gray-900 text-lg" style={{ fontWeight: 700 }}>Contenu du site</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {[
                  {
                    key: "hero", label: "🏠 Page d'accueil — Hero",
                    fields: [
                      { k: "hero_titre",    l: "Titre principal",  type: "textarea" },
                      { k: "hero_badge",    l: "Badge texte",      type: "text" },
                      { k: "prix_livraison",l: "Prix livraison (DA)", type: "text" },
                    ],
                  },
                  {
                    key: "securite", label: "🛡️ Section Sécurité",
                    fields: [
                      { k: "sec1_titre", l: "Point 1 — Titre", type: "text" }, { k: "sec1_desc", l: "Point 1 — Description", type: "textarea" },
                      { k: "sec2_titre", l: "Point 2 — Titre", type: "text" }, { k: "sec2_desc", l: "Point 2 — Description", type: "textarea" },
                      { k: "sec3_titre", l: "Point 3 — Titre", type: "text" }, { k: "sec3_desc", l: "Point 3 — Description", type: "textarea" },
                      { k: "sec4_titre", l: "Point 4 — Titre", type: "text" }, { k: "sec4_desc", l: "Point 4 — Description", type: "textarea" },
                    ],
                  },
                  {
                    key: "locataire", label: "👗 Comment ça marche — Locataire (4 étapes)",
                    fields: [
                      { k: "loc1_titre", l: "Étape 1 — Titre", type: "text" }, { k: "loc1_desc", l: "Étape 1 — Description", type: "textarea" },
                      { k: "loc2_titre", l: "Étape 2 — Titre", type: "text" }, { k: "loc2_desc", l: "Étape 2 — Description", type: "textarea" },
                      { k: "loc3_titre", l: "Étape 3 — Titre", type: "text" }, { k: "loc3_desc", l: "Étape 3 — Description", type: "textarea" },
                      { k: "loc4_titre", l: "Étape 4 — Titre", type: "text" }, { k: "loc4_desc", l: "Étape 4 — Description", type: "textarea" },
                    ],
                  },
                  {
                    key: "proprietaire", label: "🏡 Comment ça marche — Propriétaire (4 étapes)",
                    fields: [
                      { k: "pro1_titre", l: "Étape 1 — Titre", type: "text" }, { k: "pro1_desc", l: "Étape 1 — Description", type: "textarea" },
                      { k: "pro2_titre", l: "Étape 2 — Titre", type: "text" }, { k: "pro2_desc", l: "Étape 2 — Description", type: "textarea" },
                      { k: "pro3_titre", l: "Étape 3 — Titre", type: "text" }, { k: "pro3_desc", l: "Étape 3 — Description", type: "textarea" },
                      { k: "pro4_titre", l: "Étape 4 — Titre", type: "text" }, { k: "pro4_desc", l: "Étape 4 — Description", type: "textarea" },
                    ],
                  },
                ].map((section) => (
                  <div key={section.key}>
                    <button
                      type="button"
                      onClick={() => setContentSection(contentSection === section.key ? null : section.key)}
                      className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-sm text-gray-800" style={{ fontWeight: 600 }}>{section.label}</span>
                      <span className="text-gray-400 text-lg leading-none">{contentSection === section.key ? "▲" : "▼"}</span>
                    </button>
                    {contentSection === section.key && (
                      <div className="px-6 pb-6 grid grid-cols-1 gap-4">
                        {section.fields.map(({ k, l, type }) => (
                          <div key={k}>
                            <label className="block text-xs text-gray-500 mb-1" style={{ fontWeight: 500 }}>{l}</label>
                            {type === "textarea" ? (
                              <textarea
                                rows={2}
                                value={(params as any)[k]}
                                onChange={(e) => setParams((p) => ({ ...p, [k]: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#8B2635] bg-gray-50 text-gray-800 resize-none"
                              />
                            ) : (
                              <input
                                type="text"
                                value={(params as any)[k]}
                                onChange={(e) => setParams((p) => ({ ...p, [k]: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#8B2635] bg-gray-50 text-gray-800"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button onClick={sauvegarderParams} disabled={paramsSaving}
                className="flex items-center gap-2 bg-[#8B2635] text-white px-6 py-3 rounded-xl text-sm hover:bg-[#6d1e2a] disabled:opacity-50 transition-colors"
                style={{ fontWeight: 600 }}>
                {paramsSaving
                  ? <><Loader2 size={16} className="animate-spin" />Sauvegarde…</>
                  : <><Save size={16} />Sauvegarder</>}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Modal détails utilisateur ── */}
      {userDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="bg-[#1B4D3E] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white text-lg" style={{ fontWeight: 700 }}>
                  {userDetailModal.nom?.[0] ?? "?"}
                </div>
                <div>
                  <p className="text-white" style={{ fontWeight: 700 }}>{userDetailModal.nom}</p>
                  <p className="text-white/70 text-xs">{getRoleBadge(userDetailModal.role)}</p>
                </div>
              </div>
              <button onClick={() => setUserDetailModal(null)} className="text-white/70 hover:text-white p-1">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-3">
              {[
                { icon: <Mail size={15} className="text-gray-400" />, label: "Email", value: userDetailModal.email },
                { icon: <Phone size={15} className="text-gray-400" />, label: "Téléphone", value: userDetailModal.telephone || "Non renseigné" },
                { icon: <Users size={15} className="text-gray-400" />, label: "Wilaya", value: userDetailModal.wilaya || "—" },
                { icon: <ShoppingBag size={15} className="text-gray-400" />, label: "Annonces publiées", value: String(userDetailModal.tenues_count ?? 0) },
                { icon: <CheckCircle size={15} className="text-gray-400" />, label: "Réservations", value: String(userDetailModal.reservations_count ?? 0) },
                { icon: <Star size={15} className="text-gray-400" />, label: "Score réputation", value: parseFloat(userDetailModal.score_rep ?? "0").toFixed(1) },
                { icon: <Clock size={15} className="text-gray-400" />, label: "Inscrit le", value: userDetailModal.created_at ? new Date(userDetailModal.created_at).toLocaleDateString("fr-DZ") : "—" },
                { icon: userDetailModal.verifie ? <CheckCircle size={15} className="text-green-500" /> : <XCircle size={15} className="text-red-400" />, label: "Vérification", value: userDetailModal.verifie ? "Vérifié" : "Non vérifié" },
                ...(userDetailModal.rib_barid ? [{ icon: <CreditCard size={15} className="text-gray-400" />, label: "RIB Barid", value: userDetailModal.rib_barid }] : []),
              ].map((row, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="shrink-0">{row.icon}</div>
                  <div className="flex-1 flex items-center justify-between gap-2">
                    <span className="text-xs text-gray-500">{row.label}</span>
                    <span className="text-sm text-gray-800 text-right" style={{ fontWeight: 600 }}>{row.value}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 pb-5 flex gap-3">
              <button
                onClick={() => { setMsgModal(userDetailModal); setMsgContenu(""); setUserDetailModal(null); }}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-xl text-sm hover:bg-blue-700 transition-colors"
                style={{ fontWeight: 600 }}>
                <MessageSquare size={15} />Envoyer un message
              </button>
              <button onClick={() => setUserDetailModal(null)}
                className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm hover:bg-gray-50">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal envoi message interne ── */}
      {msgModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <MessageSquare size={18} className="text-blue-600" />
                <h3 className="text-gray-900" style={{ fontWeight: 700 }}>Message à {msgModal.nom}</h3>
              </div>
              <button onClick={() => { setMsgModal(null); setMsgContenu(""); }} className="p-1 hover:bg-gray-100 rounded-full">
                <X size={18} className="text-gray-400" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl mb-4">
                <div className="w-8 h-8 bg-[#1B4D3E] rounded-full flex items-center justify-center text-white text-sm" style={{ fontWeight: 700 }}>
                  {msgModal.nom?.[0]}
                </div>
                <div>
                  <p className="text-gray-900 text-sm" style={{ fontWeight: 600 }}>{msgModal.nom}</p>
                  <p className="text-gray-500 text-xs">{msgModal.email}</p>
                  {msgModal.telephone && (
                    <p className="text-gray-500 text-xs flex items-center gap-1 mt-0.5">
                      <Phone size={10} />{msgModal.telephone}
                    </p>
                  )}
                </div>
              </div>
              <textarea
                value={msgContenu}
                onChange={(e) => setMsgContenu(e.target.value)}
                placeholder="Écrivez votre message à l'utilisateur..."
                rows={5}
                maxLength={1000}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 resize-none mb-1"
              />
              <p className="text-xs text-gray-400 text-right mb-4">{msgContenu.length}/1000</p>
              <div className="flex gap-3">
                <button onClick={() => { setMsgModal(null); setMsgContenu(""); }}
                  className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm hover:bg-gray-50">
                  Annuler
                </button>
                <button onClick={envoyerMessageAdmin} disabled={msgLoading || msgContenu.trim().length < 5}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-2 transition-colors"
                  style={{ fontWeight: 600 }}>
                  {msgLoading ? <Loader2 size={14} className="animate-spin" /> : <><Send size={14} />Envoyer</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal photo (reçu paiement ou photo litige) ── */}
      {photoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          onClick={() => setPhotoModal(null)}
        >
          <div className="relative max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPhotoModal(null)}
              className="absolute -top-10 right-0 text-white text-sm flex items-center gap-1 hover:text-gray-300"
              style={{ fontWeight: 600 }}>
              <XCircle size={18} /> Fermer
            </button>
            <img
              src={photoModal}
              alt="Justificatif"
              className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
              onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Image+non+disponible"; }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

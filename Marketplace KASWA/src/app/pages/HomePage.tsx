import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Search, Star, Shield, ArrowRight, CheckCircle, Sparkles, TrendingUp, Users, Award, Target, Heart, Zap, CreditCard } from "lucide-react";
import { motion } from "motion/react";
import { ListingCard } from "../components/ListingCard";
import { NearbyListings } from "../components/NearbyListings";
import { Listing, TENUE_TYPES, OCCASIONS } from "../data/mockData";
import { PaymentModal } from "../components/PaymentModal";
import { tenuesApi, statsApi } from "../../services/api";
import tenuesSecurite from "../../assets/tenues-securite.png";
import robesSoiree from "../../assets/robes-soiree.jpg";
import cheddaImg from "../../assets/chedda.jpg";
import caftanImg from "../../assets/caftan.jpg";
import karakouImg from "../../assets/karakou.jpg";
import chaouieImg from "../../assets/chaouie.jpg";
import blouzaImg from "../../assets/blouza.jpg";
import { useSiteParams } from "../../hooks/useSiteParams";
import { STORAGE_URL } from "../../services/storageUrl";
const FALLBACK_IMG = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80";

function mapTenue(t: any): Listing {
  const photos = t.photos ?? (t.photo_principale ? [t.photo_principale] : []);
  const images = photos.length > 0 ? photos.map((p: any) => STORAGE_URL + (p.chemin ?? p)) : [FALLBACK_IMG];
  return {
    id: String(t.id), ownerId: String(t.proprietaire?.id ?? t.utilisateur_id ?? ""),
    ownerName: t.proprietaire?.nom ?? "Propriétaire", ownerRating: parseFloat(t.proprietaire?.score_rep ?? "0"),
    title: t.titre, type: t.type, occasion: [], description: t.description ?? "",
    pricePerDay: parseFloat(t.prix_jour), caution: parseFloat(t.caution ?? "0"),
    images, sizes: t.tailles ?? (t.taille ? [t.taille] : ["Unique"]), colors: t.couleurs ?? [],
    region: t.wilaya ?? "", wilaya: t.wilaya ?? "", available: t.statut === "disponible",
    rating: parseFloat(t.note_moyenne ?? "0"), reviewCount: parseInt(t.evaluations_count ?? "0", 10),
    featured: parseFloat(t.note_moyenne ?? "0") >= 4.5 || parseInt(t.evaluations_count ?? "0", 10) === 0,
    createdAt: t.created_at ?? new Date().toISOString(),
    quantite: parseInt(t.quantite ?? "1", 10),
  };
}

const HERO_IMAGE = "https://images.unsplash.com/photo-1709979773967-80940faecb0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200";
const HERO_IMAGE2 = "https://images.unsplash.com/photo-1649109669258-84a962e88a32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600";
const HERO_IMAGE3 = "https://images.unsplash.com/photo-1629332792054-caf90e135c3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600";
const TEXTILE_IMAGE = tenuesSecurite;

export function HomePage() {
  const sp = useSiteParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOccasion, setSelectedOccasion] = useState("");
  const [activeUserType, setActiveUserType] = useState<"owner" | "renter">("renter");
  const [showPaymentDemo, setShowPaymentDemo] = useState(false);
  const navigate = useNavigate();

  const [featuredListings, setFeaturedListings] = useState<Listing[]>([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [statsData, setStatsData] = useState<{
    annonces: number; utilisateurs: number; locations: number;
    note_moyenne: number | null; categories: Record<string, number>;
  } | null>(null);

  useEffect(() => {
    setFeaturedLoading(true);
    tenuesApi.liste({ page: 1 })
      .then((res) => {
        const data: any[] = res.data?.data ?? res.data ?? [];
        setFeaturedListings(data.slice(0, 4).map(mapTenue));
      })
      .catch(() => {})
      .finally(() => setFeaturedLoading(false));

    statsApi.publiques()
      .then((res) => setStatsData(res.data))
      .catch(() => {});
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedOccasion) params.set("occasion", selectedOccasion);
    navigate(`/catalogue?${params.toString()}`);
  };

  const stats = [
    { icon: <Sparkles size={22} />, value: statsData ? `${statsData.annonces}` : "…", label: "Annonces actives" },
    { icon: <Users size={22} />, value: statsData ? `${statsData.utilisateurs}` : "…", label: "Utilisateurs inscrits" },
    { icon: <TrendingUp size={22} />, value: statsData ? `${statsData.locations}` : "…", label: "Locations réalisées" },
    { icon: <Award size={22} />, value: statsData?.note_moyenne ? `${statsData.note_moyenne}/5 ⭐` : "—/5 ⭐", label: "Note moyenne" },
  ];

  const howItWorksOwner = [
    { step: "01", title: sp.pro1_titre, desc: sp.pro1_desc, icon: "👤", color: "bg-[#1B4D3E]" },
    { step: "02", title: sp.pro2_titre, desc: sp.pro2_desc, icon: "📸", color: "bg-[#C9924A]" },
    { step: "03", title: sp.pro3_titre, desc: sp.pro3_desc, icon: "📅", color: "bg-[#2d6b55]" },
    { step: "04", title: sp.pro4_titre, desc: sp.pro4_desc, icon: "💰", color: "bg-[#8B2635]" },
  ];

  const howItWorksRenter = [
    { step: "01", title: sp.loc1_titre, desc: sp.loc1_desc, icon: "🔍", color: "bg-[#1B4D3E]" },
    { step: "02", title: sp.loc2_titre, desc: sp.loc2_desc, icon: "❤️", color: "bg-[#C9924A]" },
    { step: "03", title: sp.loc3_titre, desc: sp.loc3_desc, icon: "🔒", color: "bg-[#2d6b55]" },
    { step: "04", title: sp.loc4_titre, desc: sp.loc4_desc, icon: "✨", color: "bg-[#8B2635]" },
  ];

  const CAT_META: Record<string, { emoji?: string; color: string; bg?: string }> = {
    "Chedda":         { color: "border-transparent", bg: cheddaImg },
    "Caftan":         { color: "border-transparent", bg: caftanImg },
    "Robes Soirée":   { color: "border-transparent", bg: robesSoiree },
    "Karakou":        { color: "border-transparent", bg: karakouImg },
    "Chaouie":        { color: "border-transparent", bg: chaouieImg },
    "Blouza":         { color: "border-transparent", bg: blouzaImg },
    "Gandoura":       { emoji: "🌿", color: "bg-lime-50 border-lime-200" },
  };

  const DISPLAY_CATS = ["Chedda", "Caftan", "Robes Soirée", "Karakou", "Chaouie", "Blouza"];

  const categories = DISPLAY_CATS.map((name) => ({
    name,
    emoji: CAT_META[name]?.emoji,
    count: statsData?.categories?.[name] ?? 0,
    color: CAT_META[name]?.color ?? "bg-gray-50 border-gray-200",
    bg: CAT_META[name]?.bg,
  }));

  const testimonials = [
    {
      name: "Yasmine A.",
      role: "Locataire",
      wilaya: "Alger",
      rating: 5,
      comment: "J'ai trouvé une Chedda magnifique pour le mariage de ma sœur en quelques heures ! La plateforme est intuitive et le processus très sécurisé.",
      avatar: "Y",
    },
    {
      name: "Fatima B.",
      role: "Propriétaire",
      wilaya: "Tlemcen",
      rating: 5,
      comment: "Ma Chedda portée une seule fois me rapporte maintenant 15 000 DA par mois. C'est une vraie révolution pour nous les propriétaires de tenues !",
      avatar: "F",
    },
    {
      name: "Boutique El Andalous",
      role: "Boutique partenaire",
      wilaya: "Alger",
      rating: 5,
      comment: "Keswa.dz a multiplié notre visibilité par 5. Nous recevons des demandes de toute l'Algérie. Le système de commission est juste et transparent.",
      avatar: "B",
    },
    {
      name: "Nadia K.",
      role: "Locataire",
      wilaya: "Oran",
      rating: 5,
      comment: "J'ai loué un Karakou Tlemcénien pour les fiançailles de ma fille. La tenue était parfaite, la livraison rapide et la caution remboursée en 24h !",
      avatar: "N",
    },
    {
      name: "Khadija M.",
      role: "Propriétaire",
      wilaya: "Constantine",
      rating: 5,
      comment: "Grâce à Keswa.dz, mes tenues travaillent pour moi. J'ai rentabilisé mon investissement en 3 mois. Je recommande vivement à toutes les propriétaires.",
      avatar: "K",
    },
    {
      name: "Maison Benali",
      role: "Boutique partenaire",
      wilaya: "Tlemcen",
      rating: 5,
      comment: "Une plateforme sérieuse et professionnelle. Le système de vérification des locataires nous donne confiance. Nos réservations ont doublé en deux mois.",
      avatar: "M",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF6EF]">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt="Tenues traditionnelles"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1B4D3E]/90 via-[#1B4D3E]/70 to-transparent" />
        </div>

        {/* Decorative pattern — grands losanges blancs qui s'estompent */}
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M60 0L120 60L60 120L0 60z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          maskImage: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.07) 40%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.07) 40%, transparent 100%)",
        }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 bg-[#C9924A]/20 border border-[#C9924A]/40 text-[#F0D598] px-4 py-1.5 rounded-full text-sm mb-6" style={{ fontWeight: 500 }}>
                <Sparkles size={14} />
                {sp.hero_badge}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-white mb-6"
              style={{ fontSize: "3.2rem", fontWeight: 800, lineHeight: 1.15 }}
            >
              {sp.hero_titre}
            </motion.h1>

            

            {/* Search Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl p-3 shadow-2xl flex flex-col sm:flex-row gap-2"
            >
              <div className="flex-1 flex items-center gap-2 px-3">
                <Search size={18} className="text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Rechercher une tenue (Chedda, Caftan...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="flex-1 outline-none text-gray-700 text-sm bg-transparent placeholder-gray-400"
                />
              </div>
              <div className="sm:border-l border-gray-200 flex items-center px-3">
                <select
                  value={selectedOccasion}
                  onChange={(e) => setSelectedOccasion(e.target.value)}
                  className="outline-none text-gray-600 text-sm bg-transparent w-full sm:w-40 cursor-pointer"
                >
                  <option value="">Occasion</option>
                  {OCCASIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleSearch}
                className="bg-[#1B4D3E] hover:bg-[#2d6b55] text-white px-6 py-3 rounded-xl text-sm transition-colors"
                style={{ fontWeight: 600 }}
              >
                Rechercher
              </button>
            </motion.div>

            {/* Quick Tags */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-2 mt-4"
            >
              <span className="text-white/60 text-sm">Populaire :</span>
              {["Chedda Tlemcénienne", "Caftan", "Robes Soirée", "Karakou"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => navigate(`/catalogue?type=${encodeURIComponent(tag)}`)}
                  className="text-white/80 hover:text-[#C9924A] text-sm bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-colors"
                >
                  {tag}
                </button>
              ))}
            </motion.div>

            {/* Demo Payment Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-6"
            >
              
            </motion.div>
          </div>
        </div>

      </section>

      {/* Stats Bar */}
      <section className="bg-[#1B4D3E] px-[0px] py-[30px] mx-[0px] my-[0px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center mb-2 text-[#C9924A]">{stat.icon}</div>
                <div className="text-white text-2xl" style={{ fontWeight: 700 }}>{stat.value}</div>
                <div className="text-white/60 text-sm mt-0.5">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-[#FAF6EF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#C9924A] text-sm" style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Explorer</span>
            <h2 className="text-gray-900 mt-2" style={{ fontSize: "2rem", fontWeight: 700 }}>Nos catégories de tenues</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Du patrimoine algérien à votre occasion spéciale — découvrez notre sélection de tenues traditionnelles authentiques</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to={`/catalogue?type=${encodeURIComponent(cat.name)}`}
                  className={`group flex flex-col items-center rounded-2xl border overflow-hidden hover:shadow-md transition-all ${cat.bg ? "border-transparent" : `${cat.color} p-5`}`}
                  style={cat.bg ? { position: "relative" } : {}}
                >
                  {cat.bg ? (
                    <>
                      <img src={cat.bg} alt={cat.name} className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="w-full px-3 py-2.5 bg-white text-center">
                        <p className="text-gray-800 text-sm" style={{ fontWeight: 600 }}>{cat.name}</p>
                        <p className="text-gray-400 text-xs mt-0.5">{cat.count} annonces</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="text-4xl mb-3">{cat.emoji}</span>
                      <p className="text-gray-800 text-center text-sm" style={{ fontWeight: 600 }}>{cat.name}</p>
                      <p className="text-gray-400 text-xs mt-1">{cat.count} annonces</p>
                    </>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="text-[#C9924A] text-sm" style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>À la une</span>
              <h2 className="text-gray-900 mt-2" style={{ fontSize: "2rem", fontWeight: 700 }}>Tenues vedettes</h2>
            </div>
            <Link
              to="/catalogue"
              className="hidden sm:flex items-center gap-2 text-[#1B4D3E] hover:text-[#C9924A] transition-colors text-sm"
              style={{ fontWeight: 500 }}
            >
              Voir tout le catalogue
              <ArrowRight size={16} />
            </Link>
          </div>

          {featuredLoading ? (
            /* Skeleton */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
                  <div className="aspect-[4/5] bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                    <div className="flex gap-1">
                      {[1,2,3].map(j => <div key={j} className="h-5 w-8 bg-gray-100 rounded" />)}
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredListings.length === 0 ? (
            /* État vide */
            <div className="text-center py-16">
              <p className="text-5xl mb-4">👗</p>
              <h3 className="text-gray-700 text-lg mb-2" style={{ fontWeight: 600 }}>Aucune tenue disponible pour le moment</h3>
              <p className="text-gray-400 text-sm mb-6">Les propriétaires n'ont pas encore publié d'annonces.</p>
              <Link to="/ajouter-annonce" className="inline-flex items-center gap-2 bg-[#1B4D3E] text-white px-6 py-3 rounded-full text-sm" style={{ fontWeight: 600 }}>
                Publier la première annonce
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredListings.map((listing, i) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <ListingCard listing={listing} />
                </motion.div>
              ))}
            </div>
          )}

          {!featuredLoading && featuredListings.length > 0 && (
            <div className="text-center mt-10">
              <Link
                to="/catalogue"
                className="inline-flex items-center gap-2 bg-[#1B4D3E] text-white px-8 py-3.5 rounded-full hover:bg-[#2d6b55] transition-colors"
                style={{ fontWeight: 600 }}
              >
                Explorer tout le catalogue
                <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Nearby Listings — Géolocalisation */}
      <NearbyListings />

      {/* How it works */}
      <section id="how-it-works" className="py-20 bg-[#FAF6EF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-[#C9924A] text-sm" style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Simple & Sécurisé</span>
            <h2 className="text-gray-900 mt-2" style={{ fontSize: "2rem", fontWeight: 700 }}>Comment ça marche ?</h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">En 4 étapes simples, louez ou proposez vos tenues traditionnelles en toute confiance. Choisissez votre profil :</p>
          </div>

          <div className="flex justify-center mb-10">
            <div className="inline-flex bg-white rounded-full p-1.5 shadow-md border border-gray-100">
              <button
                onClick={() => setActiveUserType("renter")}
                className={`px-8 py-3 rounded-full text-sm transition-all ${
                  activeUserType === "renter"
                    ? "bg-[#1B4D3E] text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                style={{ fontWeight: 600 }}
              >
                Je veux louer une tenue
              </button>
              <button
                onClick={() => setActiveUserType("owner")}
                className={`px-8 py-3 rounded-full text-sm transition-all ${
                  activeUserType === "owner"
                    ? "bg-[#1B4D3E] text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                style={{ fontWeight: 600 }}
              >
                Je veux proposer mes tenues
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(activeUserType === "renter" ? howItWorksRenter : howItWorksOwner).map((step, i) => (
              <motion.div
                key={`${activeUserType}-${i}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative hover:shadow-md transition-shadow"
              >
                <div className={`${step.color} w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-4 shadow-sm`}>
                  {step.icon}
                </div>
                <div className="absolute top-5 right-5 text-6xl text-gray-50" style={{ fontWeight: 900 }}>{step.step}</div>
                <h3 className="text-gray-900 mb-2.5" style={{ fontSize: "1.125rem", fontWeight: 700 }}>{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/inscription"
              className="inline-flex items-center gap-2 bg-[#C9924A] text-white px-8 py-3.5 rounded-full hover:bg-[#b5803c] transition-colors shadow-sm"
              style={{ fontWeight: 600 }}
            >
              Commencer maintenant
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-[#1B4D3E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[#C9924A] text-sm" style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Confiance & Sécurité</span>
              <h2 className="text-white mt-3 mb-6" style={{ fontSize: "2rem", fontWeight: 700 }}>
                Votre sécurité est notre priorité
              </h2>
              <div className="space-y-4">
                {[
                  { icon: <Shield size={20} />, title: sp.sec1_titre, desc: sp.sec1_desc },
                  { icon: <Star size={20} />, title: sp.sec2_titre, desc: sp.sec2_desc },
                  { icon: <CheckCircle size={20} />, title: sp.sec3_titre, desc: sp.sec3_desc },
                  { icon: <CheckCircle size={20} />, title: sp.sec4_titre, desc: sp.sec4_desc },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#C9924A]/20 flex items-center justify-center text-[#C9924A] shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-white text-sm mb-1" style={{ fontWeight: 600 }}>{item.title}</h4>
                      <p className="text-white/60 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src={TEXTILE_IMAGE}
                alt="Broderies traditionnelles"
                className="rounded-2xl w-full h-80 object-cover"
              />
              
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#C9924A] text-sm" style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Témoignages</span>
            <h2 className="text-gray-900 mt-2" style={{ fontSize: "2rem", fontWeight: 700 }}>Ce que disent nos utilisateurs</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.15 }}
                className="bg-[#FAF6EF] rounded-2xl p-6 border border-[#C9924A]/10"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} className="fill-[#C9924A] text-[#C9924A]" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-5 italic">"{t.comment}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1B4D3E] rounded-full flex items-center justify-center text-white" style={{ fontWeight: 600 }}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-gray-900 text-sm" style={{ fontWeight: 600 }}>{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.role} · {t.wilaya}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-[#FAF6EF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <span className="text-[#C9924A] text-sm" style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>À propos de Keswa.dz</span>
              <h2 className="text-gray-900 mt-3 mb-6" style={{ fontSize: "2.25rem", fontWeight: 700, lineHeight: 1.2 }}>
                Valorisons ensemble notre patrimoine vestimentaire algérien
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                <strong className="text-gray-900">Keswa.dz</strong> est née d'un constat simple : nos magnifiques tenues traditionnelles algériennes — Chedda, Caftan, Karakou, Robes Soirée — sont souvent portées une seule fois puis restent dans nos placards.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Notre mission est de créer un pont entre les propriétaires de ces trésors culturels et les personnes qui cherchent la tenue parfaite pour leurs événements importants : mariages, fiançailles, cérémonies traditionnelles.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Nous croyons que chaque tenue a une histoire à raconter et mérite d'être portée, admirée et célébrée. En facilitant la location entre locataires et propriétaires (Boutique ou Investisseur), nous rendons ces pièces d'exception accessibles à tous tout en générant des revenus pour leurs propriétaires.
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-full border border-[#C9924A]/20">
                  <CheckCircle size={15} className="text-[#1B4D3E] shrink-0" />
                  <span className="text-sm text-gray-700 whitespace-nowrap" style={{ fontWeight: 500 }}>100% Algérien</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-full border border-[#C9924A]/20">
                  <CheckCircle size={15} className="text-[#1B4D3E] shrink-0" />
                  <span className="text-sm text-gray-700 whitespace-nowrap" style={{ fontWeight: 500 }}>Sécurisé et fiable</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-full border border-[#C9924A]/20">
                  <CheckCircle size={15} className="text-[#1B4D3E] shrink-0" />
                  <span className="text-sm text-gray-700 whitespace-nowrap" style={{ fontWeight: 500 }}>Commission transparente</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 border border-[#C9924A]/10 shadow-sm"
              >
                <div className="w-12 h-12 bg-[#1B4D3E]/10 rounded-xl flex items-center justify-center mb-4">
                  <Target className="text-[#1B4D3E]" size={24} />
                </div>
                <h3 className="text-gray-900 mb-2" style={{ fontSize: "1.125rem", fontWeight: 700 }}>Notre Mission</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Démocratiser l'accès aux tenues traditionnelles algériennes tout en créant une économie circulaire profitable pour tous.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-6 border border-[#C9924A]/10 shadow-sm mt-8"
              >
                <div className="w-12 h-12 bg-[#C9924A]/10 rounded-xl flex items-center justify-center mb-4">
                  <Heart className="text-[#C9924A]" size={24} />
                </div>
                <h3 className="text-gray-900 mb-2" style={{ fontSize: "1.125rem", fontWeight: 700 }}>Nos Valeurs</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Authenticité, confiance, respect du patrimoine culturel et transparence dans toutes nos transactions.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-6 border border-[#C9924A]/10 shadow-sm"
              >
                <div className="w-12 h-12 bg-[#2d6b55]/10 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="text-[#2d6b55]" size={24} />
                </div>
                <h3 className="text-gray-900 mb-2" style={{ fontSize: "1.125rem", fontWeight: 700 }}>Sécurité</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Système de caution, vérification d'identité, paiements sécurisés et évaluations bidirectionnelles.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-6 border border-[#C9924A]/10 shadow-sm mt-8"
              >
                <div className="w-12 h-12 bg-[#8B2635]/10 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="text-[#8B2635]" size={24} />
                </div>
                <h3 className="text-gray-900 mb-2" style={{ fontSize: "1.125rem", fontWeight: 700 }}>Innovation</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Première plateforme algérienne dédiée à la location de tenues traditionnelles entre particuliers.
                </p>
              </motion.div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#1B4D3E] to-[#2d6b55] rounded-3xl p-8 md:p-12 text-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-3" style={{ fontWeight: 800 }}>2 acteurs</div>
                <p className="text-white/80 text-sm">Locataires & Propriétaires (Boutique ou Investisseur) réunis sur une seule plateforme</p>
              </div>
              <div className="text-center border-l border-r border-white/20 md:px-6">
                <div className="text-4xl mb-3" style={{ fontWeight: 800 }}>15-19%</div>
                <p className="text-white/80 text-sm">Commission selon votre profil : 15% Boutique · 19% Investisseur — sur transactions réussies uniquement</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3" style={{ fontWeight: 800 }}>48 wilayas</div>
                <p className="text-white/80 text-sm">Couverture nationale pour connecter tous les Algériens à leur patrimoine</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#1B4D3E] to-[#2d6b55]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-white mb-4" style={{ fontSize: "2.5rem", fontWeight: 800 }}>
            Prêt(e) à rejoindre Keswa.dz ?
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers d'Algériens qui partagent et valorisent notre patrimoine vestimentaire traditionnel.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/inscription"
              className="bg-[#C9924A] text-white px-8 py-4 rounded-full hover:bg-[#b5803c] transition-colors shadow-lg"
              style={{ fontWeight: 600, fontSize: "1rem" }}
            >
              Commencer gratuitement
            </Link>
            <Link
              to="/catalogue"
              className="bg-white/10 border border-white/30 text-white px-8 py-4 rounded-full hover:bg-white/20 transition-colors"
              style={{ fontWeight: 600, fontSize: "1rem" }}
            >
              Explorer le catalogue
            </Link>
          </div>
        </div>
      </section>

      {/* Payment Demo Modal */}
      <PaymentModal
        open={showPaymentDemo}
        onClose={() => setShowPaymentDemo(false)}
        bookingId="KSW-2024-00142"
        amount={12000}
        caution={5000}
        listingTitle="Chedda Tlemcénienne Luxe Brodée — Taille M"
        onConfirm={(method, file) => {
          console.log("Payment confirmed:", method, file.name);
        }}
      />
    </div>
  );
}
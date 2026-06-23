import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ArrowLeft, Target, Heart, Shield, Zap, Users, TrendingUp, Award, MapPin, Mail, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { tenuesApi } from "../../services/api";

const TEAM = [
  { nom: "BENOSMAN Mohammed El Hadi", role: "Développeur & Fondateur", initiales: "BMH", color: "bg-[#1B4D3E]" },
  { nom: "Mme KHITRI Souad", role: "Encadrante académique", initiales: "KS", color: "bg-[#C9924A]" },
];

const VALEURS = [
  { icon: <Target size={24} />, titre: "Notre Mission", texte: "Démocratiser l'accès aux tenues traditionnelles algériennes tout en créant une économie circulaire profitable pour tous.", color: "bg-[#1B4D3E]/10 text-[#1B4D3E]" },
  { icon: <Heart size={24} />, titre: "Nos Valeurs", texte: "Authenticité, confiance, respect du patrimoine culturel et transparence absolue dans toutes nos transactions.", color: "bg-[#C9924A]/10 text-[#C9924A]" },
  { icon: <Shield size={24} />, titre: "Sécurité", texte: "Système de caution, vérification d'identité, paiements sécurisés et évaluations bidirectionnelles pour une confiance totale.", color: "bg-blue-50 text-blue-600" },
  { icon: <Zap size={24} />, titre: "Innovation", texte: "Première plateforme algérienne dédiée à la location de tenues traditionnelles. Nous créons un marché là où il n'en existait pas.", color: "bg-purple-50 text-purple-600" },
];

const TIMELINE = [
  { annee: "2023", titre: "Idée & Recherche", desc: "Constat du vide sur le marché algérien — aucune solution de location de tenues traditionnelles." },
  { annee: "2024", titre: "Conception & Design", desc: "Étude de marché, analyse des besoins, conception UX/UI et architecture technique." },
  { annee: "2025", titre: "Développement", desc: "Développement de la plateforme : React + Laravel + MySQL. Intégration des paiements algériens." },
  { annee: "2026", titre: "Lancement", desc: "Lancement en version bêta à Tlemcen, puis extension nationale aux 48 wilayas d'Algérie." },
];

export function AProposPage() {
  const [stats, setStats] = useState({ tenues: 0, loaded: false });

  useEffect(() => {
    tenuesApi.liste({ page: 1 })
      .then((res) => setStats({ tenues: res.data?.total ?? 0, loaded: true }))
      .catch(() => setStats({ tenues: 0, loaded: true }));
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF6EF]">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#1B4D3E] to-[#2d6b55] pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M30 0L60 30L30 60L0 30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-8 transition-colors">
            <ArrowLeft size={16} />
            Retour à l'accueil
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white mb-4"
            style={{ fontSize: "3rem", fontWeight: 800, lineHeight: 1.2 }}
          >
            À propos de <span className="text-[#C9924A]">Keswa.dz</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed"
          >
            La première marketplace algérienne dédiée à la location de tenues traditionnelles entre locataires et propriétaires (Boutique ou Investisseur).
          </motion.p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: <Award size={20} />,      value: stats.loaded ? `${stats.tenues}` : "…", label: "Annonces actives" },
              { icon: <MapPin size={20} />,      value: "48",   label: "Wilayas couvertes" },
              { icon: <TrendingUp size={20} />,  value: "15-19%",  label: "Commission transparente" },
              { icon: <Users size={20} />,       value: "100%", label: "100% Algérien" },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="w-10 h-10 bg-[#1B4D3E]/10 text-[#1B4D3E] rounded-xl flex items-center justify-center mx-auto mb-2">
                  {s.icon}
                </div>
                <div className="text-2xl text-gray-900 mb-0.5" style={{ fontWeight: 700 }}>{s.value}</div>
                <div className="text-gray-500 text-sm">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Histoire */}
      <section className="py-16 bg-[#FAF6EF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#C9924A] text-sm" style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Notre histoire</span>
            <h2 className="text-gray-900 mt-2 text-3xl" style={{ fontWeight: 700 }}>
              Née d'un constat simple
            </h2>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
            <p className="text-gray-600 leading-relaxed mb-5">
              <strong className="text-gray-900">Keswa.dz</strong> est née d'une observation évidente : nos magnifiques tenues traditionnelles algériennes — Chedda, Caftan, Karakou, Robes Soirée, Chaouie, Blouza — sont souvent portées une seule fois puis restent dans nos placards pendant des années.
            </p>
            <p className="text-gray-600 leading-relaxed mb-5">
              Une Chedda Tlemcénienne peut coûter entre <strong className="text-[#C9924A]">200 000 et 800 000 DA</strong> et n'être portée qu'un seul jour. La Chedda est même classée au patrimoine immatériel de l'UNESCO. Il était impensable que ces trésors culturels restent inaccessibles au grand public.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Notre mission : créer un pont entre les propriétaires de ces trésors culturels et les personnes qui cherchent la tenue parfaite pour leurs événements importants. En facilitant la location entre locataires et propriétaires (Boutique ou Investisseur), nous rendons ces pièces d'exception accessibles à tous tout en générant des revenus pour leurs propriétaires.
            </p>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            {TIMELINE.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-5"
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-[#1B4D3E] text-white rounded-xl flex items-center justify-center text-sm shrink-0" style={{ fontWeight: 700 }}>
                    {item.annee}
                  </div>
                  {i < TIMELINE.length - 1 && <div className="w-0.5 flex-1 bg-[#1B4D3E]/20 my-1" />}
                </div>
                <div className="pb-4">
                  <h4 className="text-gray-900 mb-1" style={{ fontWeight: 600 }}>{item.titre}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#C9924A] text-sm" style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Ce qui nous guide</span>
            <h2 className="text-gray-900 mt-2 text-3xl" style={{ fontWeight: 700 }}>Nos valeurs</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {VALEURS.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#FAF6EF] rounded-2xl p-6 border border-gray-100"
              >
                <div className={`w-12 h-12 ${v.color} rounded-xl flex items-center justify-center mb-4`}>
                  {v.icon}
                </div>
                <h3 className="text-gray-900 mb-2" style={{ fontWeight: 700 }}>{v.titre}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{v.texte}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modèle économique */}
      <section className="py-16 bg-[#1B4D3E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-[#C9924A] text-sm" style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Transparent & Juste</span>
            <h2 className="text-white mt-2 text-3xl" style={{ fontWeight: 700 }}>Notre modèle économique</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {[
              { emoji: "💳", titre: "15% ou 19% Commission", desc: "15% pour les Boutiques, 19% pour les Investisseurs. Prélevée uniquement sur les transactions réussies. Zéro frais fixe." },
              { emoji: "🔒", titre: "Caution sécurisée", desc: "Bloquée automatiquement et restituée après retour de la tenue en bon état." },
              { emoji: "💰", titre: "Jusqu'à 85% pour vous", desc: "Le propriétaire perçoit 85% (Boutique) ou 81% (Investisseur) du montant de chaque location via Barid Mobile, CCP ou CIB." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/10 rounded-2xl p-6"
              >
                <p className="text-4xl mb-3">{item.emoji}</p>
                <h3 className="text-white mb-2" style={{ fontWeight: 700 }}>{item.titre}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Équipe */}
      <section className="py-16 bg-[#FAF6EF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-[#C9924A] text-sm" style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Qui sommes-nous</span>
            <h2 className="text-gray-900 mt-2 text-3xl" style={{ fontWeight: 700 }}>L'équipe Keswa.dz</h2>
            <p className="text-gray-500 mt-2 text-sm">Projet de mémoire de Master — Université Abou Bekr Belkaïd, Tlemcen</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            {TEAM.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center flex-1 max-w-xs mx-auto"
              >
                <div className={`w-16 h-16 ${m.color} rounded-full flex items-center justify-center text-white text-xl mx-auto mb-4`} style={{ fontWeight: 700 }}>
                  {m.initiales}
                </div>
                <h3 className="text-gray-900 mb-1" style={{ fontWeight: 700 }}>{m.nom}</h3>
                <p className="text-gray-500 text-sm">{m.role}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-8 bg-white rounded-2xl p-6 border border-gray-100 text-center">
            <p className="text-gray-600 text-sm">
              Master Informatique SIC · Spécialité : Systèmes d'Information et de Communication<br />
              Université Abou Bekr Belkaïd — Tlemcen · 2025/2026
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-gradient-to-br from-[#C9924A] to-[#b5803c]">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-white text-2xl mb-3" style={{ fontWeight: 700 }}>Rejoignez Keswa.dz dès aujourd'hui</h2>
          <p className="text-white/80 text-sm mb-6">Que vous souhaitiez louer ou proposer vos tenues, nous sommes là pour vous.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/catalogue" className="bg-white text-[#C9924A] px-7 py-3 rounded-full text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2" style={{ fontWeight: 600 }}>
              Explorer le catalogue <ArrowRight size={16} />
            </Link>
            <Link to="/inscription" className="bg-[#1B4D3E] text-white px-7 py-3 rounded-full text-sm hover:bg-[#2d6b55] transition-colors flex items-center justify-center gap-2" style={{ fontWeight: 600 }}>
              S'inscrire gratuitement
            </Link>
          </div>
        </div>
      </section>

      {/* Contact rapide */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <Mail size={16} className="text-[#C9924A]" />
            <a href="mailto:contact@keswa.dz" className="hover:text-[#1B4D3E] transition-colors">contact@keswa.dz</a>
          </div>
          <Link to="/contact" className="text-sm text-[#1B4D3E] hover:text-[#C9924A] transition-colors" style={{ fontWeight: 500 }}>
            Formulaire de contact →
          </Link>
        </div>
      </section>
    </div>
  );
}

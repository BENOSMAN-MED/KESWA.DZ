import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, ChevronDown, ChevronUp, Search, MessageCircle, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  // Général
  { category: "Général", question: "Qu'est-ce que Keswa.dz ?", answer: "Keswa.dz est la première marketplace algérienne dédiée à la location de tenues traditionnelles (Chedda, Caftan, Robes Soirée, Karakou, Chaouie, Blouza...). Elle met en relation des propriétaires de tenues avec des locataires pour les grandes occasions." },
  { category: "Général", question: "La plateforme est-elle gratuite ?", answer: "L'inscription est entièrement gratuite pour les locataires. Pour les propriétaires, la plateforme prélève une commission uniquement sur les transactions réussies : 15% pour les Boutiques et 19% pour les Investisseurs. Aucun abonnement, aucun frais caché." },
  { category: "Général", question: "Dans quelles wilayas êtes-vous disponibles ?", answer: "Keswa.dz couvre les 48 wilayas d'Algérie. Nous avons démarré avec une forte concentration à Tlemcen, Alger, Oran, Constantine et Tizi Ouzou, et nous nous étendons progressivement à l'ensemble du territoire national." },

  // Réservation
  { category: "Réservation", question: "Comment réserver une tenue ?", answer: "1) Parcourez le catalogue et choisissez votre tenue. 2) Sélectionnez vos dates et votre taille. 3) Choisissez votre mode de paiement. 4) Envoyez la demande. Le propriétaire a 24h pour accepter ou refuser." },
  { category: "Réservation", question: "Combien de temps à l'avance dois-je réserver ?", answer: "Nous recommandons de réserver au minimum 5-7 jours à l'avance pour les mariages et grandes cérémonies. Pour les occasions moins formelles, 2-3 jours suffisent généralement." },
  { category: "Réservation", question: "Puis-je annuler une réservation ?", answer: "Oui, vous pouvez annuler une réservation en attente (avant confirmation du propriétaire) sans frais. Après confirmation, des conditions d'annulation s'appliquent selon l'accord avec le propriétaire." },
  { category: "Réservation", question: "Que faire si le propriétaire refuse ma demande ?", answer: "En cas de refus, vous êtes notifié et aucun paiement n'est prélevé. Vous pouvez alors chercher une autre tenue dans notre catalogue ou contacter le propriétaire pour comprendre le motif du refus." },

  // Paiement
  { category: "Paiement", question: "Quels modes de paiement acceptez-vous ?", answer: "Nous acceptons Barid Mobile, CCP/e-CCP et Carte CIB/VISA. Ces trois modes couvrent l'ensemble des Algériens. Nous ne supportons pas Stripe ou PayPal qui ne sont pas disponibles en Algérie." },
  { category: "Paiement", question: "Quand est prélevé le paiement ?", answer: "Le paiement est prélevé après acceptation de votre demande par le propriétaire. Vous envoyez un reçu de paiement à l'administrateur qui valide la transaction dans les 24h." },
  { category: "Paiement", question: "Ma caution est-elle remboursée ?", answer: "Oui, la caution est intégralement remboursée dans les 48h suivant le retour de la tenue en bon état. En cas de dommage, la caution peut être partiellement ou totalement retenue selon l'accord établi." },
  { category: "Paiement", question: "Que se passe-t-il si je n'ai pas l'argent exact ?", answer: "Pour Barid Mobile et CCP, vous transférez le montant exact indiqué. Pour CIB, le montant est débité automatiquement. Contactez-nous si vous rencontrez un problème lors du paiement." },

  // Propriétaires
  { category: "Propriétaires", question: "Comment devenir propriétaire sur Keswa.dz ?", answer: "Créez un compte 'Propriétaire', vérifiez votre identité, puis publiez vos premières annonces. Ajoutez des photos de qualité, une description détaillée et fixez votre tarif journalier." },
  { category: "Propriétaires", question: "Combien puis-je gagner avec ma tenue ?", answer: "Une tenue louée 2 fois par mois à 3 000 DA/jour (3 jours) = 18 000 DA brut, soit 15 300 DA net après commission. Une Chedda à 5 000 DA/jour peut rapporter 25 000+ DA/mois." },
  { category: "Propriétaires", question: "Comment protéger ma tenue ?", answer: "La caution obligatoire protège votre investissement. Un contrat de location est généré automatiquement. En cas de dommage, vous pouvez initier une procédure de litige avec preuve photos." },
  { category: "Propriétaires", question: "Puis-je refuser des demandes ?", answer: "Oui, vous êtes libre d'accepter ou refuser chaque demande de réservation. Vous pouvez also bloquer des dates spécifiques dans votre calendrier de disponibilité." },

  // Sécurité
  { category: "Sécurité", question: "Comment vérifiez-vous les utilisateurs ?", answer: "Chaque utilisateur doit fournir un numéro de téléphone vérifié. Pour une vérification complète (badge Vérifié), un document d'identité (CIN ou Passeport) est requis." },
  { category: "Sécurité", question: "Que faire en cas de litige ?", answer: "Signalez le litige via votre tableau de bord. Notre équipe intervient dans les 48h, examine les preuves des deux parties et rend une décision équitable. La caution peut être mobilisée pour indemniser la partie lésée." },
  { category: "Sécurité", question: "Mes données personnelles sont-elles sécurisées ?", answer: "Toutes les communications sont chiffrées HTTPS/TLS. Vos données bancaires ne sont jamais stockées sur nos serveurs. Consultez notre politique de confidentialité pour plus de détails." },
];

const categories = ["Tous", ...Array.from(new Set(faqs.map((f) => f.category)))];

export function FAQPage() {
  const [openId, setOpenId] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [search, setSearch] = useState("");

  const filtered = faqs.filter((f) => {
    const matchCat = activeCategory === "Tous" || f.category === activeCategory;
    const matchSearch = !search || f.question.toLowerCase().includes(search.toLowerCase()) || f.answer.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAF6EF] pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link to="/" className="p-2 text-gray-400 hover:text-gray-600 bg-white rounded-xl shadow-sm">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-gray-900 text-2xl" style={{ fontWeight: 700 }}>Centre d'aide — FAQ</h1>
            <p className="text-gray-500 text-sm">Toutes les réponses à vos questions</p>
          </div>
        </div>

        {/* Hero */}
        <div className="bg-gradient-to-r from-[#1B4D3E] to-[#2d6b55] rounded-2xl p-8 mb-8 text-center text-white">
          <HelpCircle size={40} className="mx-auto mb-3 text-[#C9924A]" />
          <h2 className="text-xl mb-2" style={{ fontWeight: 700 }}>Comment pouvons-nous vous aider ?</h2>
          <p className="text-white/70 text-sm mb-5">Trouvez rapidement la réponse à votre question</p>
          <div className="relative max-w-md mx-auto">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une question..."
              className="w-full pl-11 pr-4 py-3 rounded-xl text-gray-800 text-sm outline-none focus:ring-2 focus:ring-[#C9924A]"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                activeCategory === cat
                  ? "bg-[#1B4D3E] text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-[#1B4D3E]"
              }`}
              style={{ fontWeight: 500 }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl">
            <p className="text-gray-400">Aucune question correspondante trouvée.</p>
            <button onClick={() => { setSearch(""); setActiveCategory("Tous"); }} className="mt-3 text-[#1B4D3E] text-sm hover:underline">
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((faq, i) => {
              const isOpen = openId === i;
              return (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => setOpenId(isOpen ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <span className={`text-xs px-2 py-1 rounded-full shrink-0 mt-0.5 ${
                        faq.category === "Général" ? "bg-blue-100 text-blue-700" :
                        faq.category === "Réservation" ? "bg-[#1B4D3E]/10 text-[#1B4D3E]" :
                        faq.category === "Paiement" ? "bg-[#C9924A]/10 text-[#C9924A]" :
                        faq.category === "Propriétaires" ? "bg-purple-100 text-purple-700" :
                        "bg-red-100 text-red-700"
                      }`} style={{ fontWeight: 500 }}>
                        {faq.category}
                      </span>
                      <span className="text-gray-900 text-sm" style={{ fontWeight: 600 }}>{faq.question}</span>
                    </div>
                    <div className="ml-3 shrink-0 text-gray-400">
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-4 ml-3">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}

        {/* Still need help */}
        <div className="mt-10 bg-white rounded-2xl p-8 border border-gray-100 text-center">
          <MessageCircle size={32} className="mx-auto text-[#1B4D3E] mb-3" />
          <h3 className="text-gray-900 mb-2" style={{ fontWeight: 700 }}>Vous n'avez pas trouvé votre réponse ?</h3>
          <p className="text-gray-500 text-sm mb-5">Notre équipe est disponible du dimanche au jeudi, de 8h à 18h</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/contact"
              className="bg-[#1B4D3E] text-white px-6 py-3 rounded-xl text-sm hover:bg-[#2d6b55] transition-colors flex items-center justify-center gap-2"
              style={{ fontWeight: 600 }}
            >
              <MessageCircle size={16} />
              Nous contacter
            </Link>
            <a
              href="mailto:support@keswa.dz"
              className="border border-gray-200 text-gray-600 px-6 py-3 rounded-xl text-sm hover:bg-gray-50 transition-colors"
              style={{ fontWeight: 500 }}
            >
              support@keswa.dz
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

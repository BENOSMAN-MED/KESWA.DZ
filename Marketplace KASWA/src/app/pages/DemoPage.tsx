import { Link } from "react-router";
import { MessageCircle, CreditCard, Star, ArrowRight } from "lucide-react";

export function DemoPage() {
  const features = [
    {
      title: "💬 Messagerie",
      description: "Système de messages en temps réel entre locataires et propriétaires",
      route: "/messages",
      features: [
        "Conversations en temps réel",
        "Liste des contacts avec statut non-lu",
        "Historique des messages",
        "Support pour démarrer conversation depuis une annonce"
      ]
    },
    {
      title: "💳 Paiements (3 Méthodes)",
      description: "Système de paiement complet avec 3 méthodes de paiement algériennes",
      route: "/payment-test",
      features: [
        "Barid Mobile (SMS)",
        "CCP / e-CCP (Compte courant)",
        "Carte CIB/VISA",
        "Validation complète avec modale de confirmation"
      ]
    },
    {
      title: "⭐ Système d'Évaluation",
      description: "Évaluation des locations avec notes et commentaires",
      route: "/evaluation-test",
      features: [
        "Notes de 1 à 5 étoiles",
        "Commentaires optionnels (max 200 caractères)",
        "Interface intuitive en 3 étapes",
        "Affichage des évaluations reçues"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF6EF] pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl text-gray-900 mb-4" style={{ fontWeight: 700 }}>
            🚀 Démonstration KASWA
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explorez les 3 fonctionnalités principales de la marketplace : 
            Messagerie, Paiements et Évaluations
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, idx) => (
            <Link key={idx} to={feature.route}>
              <div className="h-full bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all border border-gray-100 hover:border-[#C9924A] group cursor-pointer">
                {/* Title */}
                <h3 className="text-xl text-gray-900 mb-2" style={{ fontWeight: 700 }}>
                  {feature.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 text-sm mb-6">
                  {feature.description}
                </p>

                {/* Features List */}
                <div className="space-y-2 mb-6">
                  {feature.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#C9924A]" />
                      {f}
                    </div>
                  ))}
                </div>

                {/* Button */}
                <div className="flex items-center gap-2 text-[#1B4D3E] group-hover:text-[#C9924A] transition-colors">
                  <span className="text-sm" style={{ fontWeight: 600 }}>Essayer</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Workflow Diagram */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-12">
          <h2 className="text-2xl text-gray-900 mb-8 text-center" style={{ fontWeight: 700 }}>
            📊 Flux Utilisateur Complet
          </h2>
          
          <div className="flex items-center justify-between gap-4 overflow-x-auto pb-4">
            {[
              { step: 1, title: "Parcourir", icon: "📱" },
              { step: 2, title: "Réserver", icon: "📅" },
              { step: 3, title: "Payer", icon: "💳" },
              { step: 4, title: "Utiliser", icon: "👕" },
              { step: 5, title: "Communiquer", icon: "💬" },
              { step: 6, title: "Évaluer", icon: "⭐" },
            ].map((item, i) => (
              <div key={i} className="flex items-center">
                <div className="flex flex-col items-center min-w-fit">
                  <div className="w-12 h-12 rounded-full bg-[#1B4D3E] text-white flex items-center justify-center mb-2 text-lg">
                    {item.step}
                  </div>
                  <p className="text-xs text-gray-600 text-center whitespace-nowrap">
                    {item.title}
                  </p>
                </div>
                {i < 5 && (
                  <div className="w-8 h-0.5 bg-gradient-to-r from-[#1B4D3E] to-transparent mx-2 hidden sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
            <MessageCircle size={32} className="text-blue-600 mb-3" />
            <h3 className="text-lg text-blue-900 mb-2" style={{ fontWeight: 700 }}>
              Messagerie Temps Réel
            </h3>
            <p className="text-sm text-blue-700">
              Communication instantanée entre utilisateurs avec support complet des conversations.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
            <CreditCard size={32} className="text-green-600 mb-3" />
            <h3 className="text-lg text-green-900 mb-2" style={{ fontWeight: 700 }}>
              Paiements Sécurisés
            </h3>
            <p className="text-sm text-green-700">
              3 méthodes de paiement algériennes: Barid Mobile, CCP/e-CCP, et Carte CIB/VISA.
            </p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 border border-amber-200">
            <Star size={32} className="text-amber-600 mb-3" />
            <h3 className="text-lg text-amber-900 mb-2" style={{ fontWeight: 700 }}>
              Système de Notation
            </h3>
            <p className="text-sm text-amber-700">
              Évaluations avec notes de 1-5 étoiles et commentaires pour construire la confiance.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/catalogue">
            <button className="px-8 py-3 bg-[#1B4D3E] text-white rounded-lg hover:bg-[#2d6b55] transition-colors" style={{ fontWeight: 600 }}>
              Commencer la Navigation
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

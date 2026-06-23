import { Link, useSearchParams } from "react-router";
import { CheckCircle, Clock, CreditCard, Shield, Home } from "lucide-react";
import confetti from "canvas-confetti";
import { useEffect } from "react";

export function BookingSuccessPage() {
  const [searchParams] = useSearchParams();
  const listingTitle = searchParams.get("title") || "la tenue";

  useEffect(() => {
    // Lancer les confettis au chargement
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#C9924A", "#1B4D3E", "#FAF6EF"],
    });
  }, []);

  const steps = [
    {
      number: 1,
      icon: <Clock size={24} />,
      title: "Attendre l'acceptation du propriétaire",
      description: "Le propriétaire a reçu votre demande et va l'examiner. Vous recevrez une notification dès qu'il accepte ou refuse.",
      status: "pending",
      color: "bg-yellow-50 border-yellow-200 text-yellow-700",
      iconBg: "bg-yellow-100",
    },
    {
      number: 2,
      icon: <CreditCard size={24} />,
      title: "Procéder au paiement",
      description: "Une fois acceptée, vous pourrez payer via Barid Mobile, CCP ou CIB. Le montant inclut la location et la caution.",
      status: "waiting",
      color: "bg-gray-50 border-gray-200 text-gray-600",
      iconBg: "bg-gray-100",
    },
    {
      number: 3,
      icon: <Shield size={24} />,
      title: "Validation par l'administrateur",
      description: "Notre équipe vérifie votre paiement et valide la réservation. Votre location sera alors active !",
      status: "waiting",
      color: "bg-gray-50 border-gray-200 text-gray-600",
      iconBg: "bg-gray-100",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF6EF] pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Header */}
        <div
          className="text-center mb-8"
        >
          <div className="w-20 h-20 bg-[#1B4D3E] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <CheckCircle size={48} className="text-white" />
          </div>
          <h1 className="text-gray-900 text-3xl mb-2" style={{ fontWeight: 700 }}>
            Demande envoyée avec succès !
          </h1>
          <p className="text-gray-600 text-lg">
            Votre demande de réservation pour <span className="text-[#C9924A]" style={{ fontWeight: 600 }}>{listingTitle}</span> a bien été transmise.
          </p>
        </div>

        {/* Success Message Card */}
        <div
          className="bg-gradient-to-r from-[#1B4D3E] to-[#2d6b55] rounded-2xl p-6 mb-8 text-white shadow-lg"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <CheckCircle size={24} />
            </div>
            <div>
              <h3 className="text-lg mb-2" style={{ fontWeight: 700 }}>
                Que se passe-t-il maintenant ?
              </h3>
              <p className="text-white/90 text-sm leading-relaxed">
                Votre demande suit un processus en 3 étapes pour garantir la sécurité de tous. Vous pouvez suivre l'avancement dans votre tableau de bord.
              </p>
            </div>
          </div>
        </div>

        {/* Process Steps */}
        <div className="space-y-4 mb-8">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`bg-white rounded-2xl p-6 border-2 ${step.color} shadow-sm animate-card-in`}
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
            >
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className={`w-14 h-14 ${step.iconBg} rounded-xl flex items-center justify-center ${step.color.split(" ")[2]}`}>
                    {step.icon}
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-gray-100">
                    <span className="text-xs text-gray-700" style={{ fontWeight: 700 }}>
                      {step.number}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-900 text-lg mb-1" style={{ fontWeight: 700 }}>
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div
          className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-8"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
              <Shield size={16} className="text-blue-600" />
            </div>
            <div>
              <h4 className="text-blue-900 text-sm mb-1" style={{ fontWeight: 600 }}>
                Protection garantie
              </h4>
              <p className="text-blue-700 text-sm leading-relaxed">
                La caution sera remboursée intégralement après retour de la tenue en bon état. Tous les paiements sont sécurisés et vérifiés par notre équipe.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/tableau-de-bord-locataire"
            className="flex-1 flex items-center justify-center gap-2 bg-[#1B4D3E] text-white px-6 py-3 rounded-xl text-sm hover:bg-[#2d6b55] transition-colors"
            style={{ fontWeight: 600 }}
          >
            <Home size={18} />
            Aller au tableau de bord
          </Link>
          <Link
            to="/catalogue"
            className="flex-1 flex items-center justify-center gap-2 bg-white text-[#1B4D3E] px-6 py-3 rounded-xl text-sm border-2 border-[#1B4D3E] hover:bg-[#1B4D3E]/5 transition-colors"
            style={{ fontWeight: 600 }}
          >
            Continuer mes recherches
          </Link>
        </div>

        {/* Timeline Estimate */}
        <div
          className="text-center mt-8 text-sm text-gray-500"
        >
          <p>⏱️ Temps estimé total : <span style={{ fontWeight: 600 }}>2-24 heures</span></p>
          <p className="text-xs mt-1">Vous recevrez des notifications à chaque étape</p>
        </div>
      </div>
    </div>
  );
}

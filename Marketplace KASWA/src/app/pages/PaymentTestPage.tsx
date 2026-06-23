import { useState } from "react";
import { Smartphone, Building2, CreditCard, ArrowLeft, CheckCircle } from "lucide-react";
import { Link } from "react-router";
import { PaiementModal } from "../components/PaiementModal";
import { toast } from "react-toastify";

export function PaymentTestPage() {
  const [activeModal, setActiveModal] = useState<"barid" | "ccp" | "carte" | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePaymentConfirm = async (data: any) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    setActiveModal(null);
    toast.success(`Paiement de ${data.montant ?? 2500} DA confirmé !`, {
      description: `Méthode : ${data.method ?? "Barid Mobile"}. Votre reçu a été envoyé.`,
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF6EF] pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="flex items-center gap-2 text-[#1B4D3E] hover:text-[#C9924A] mb-4">
            <ArrowLeft size={16} />
            Retour
          </Link>
          <h1 className="text-3xl text-gray-900 mb-2" style={{ fontWeight: 700 }}>
            Test des modales de paiement
          </h1>
          <p className="text-gray-600">Cliquez sur une méthode de paiement pour voir la modale correspondante</p>
        </div>

        {/* Payment Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Barid Mobile */}
          <button
            onClick={() => setActiveModal("barid")}
            className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all hover:scale-105"
          >
            <div className="w-16 h-16 bg-[#1B4D3E]/10 rounded-2xl flex items-center justify-center mb-4 mx-auto">
              <Smartphone size={32} className="text-[#1B4D3E]" />
            </div>
            <h3 className="text-lg text-gray-900 mb-2 text-center" style={{ fontWeight: 700 }}>
              Barid Mobile
            </h3>
            <p className="text-sm text-gray-500 text-center mb-4">
              Paiement par téléphone portable via Barid Mobile
            </p>
            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm text-gray-600 text-center">
                <span style={{ fontWeight: 600 }}>2500 DA</span> de test
              </p>
            </div>
          </button>

          {/* CCP / e-CCP */}
          <button
            onClick={() => setActiveModal("ccp")}
            className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all hover:scale-105"
          >
            <div className="w-16 h-16 bg-[#C9924A]/10 rounded-2xl flex items-center justify-center mb-4 mx-auto">
              <Building2 size={32} className="text-[#C9924A]" />
            </div>
            <h3 className="text-lg text-gray-900 mb-2 text-center" style={{ fontWeight: 700 }}>
              CCP / e-CCP
            </h3>
            <p className="text-sm text-gray-500 text-center mb-4">
              Paiement par compte postal algérien
            </p>
            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm text-gray-600 text-center">
                <span style={{ fontWeight: 600 }}>2500 DA</span> de test
              </p>
            </div>
          </button>

          {/* Carte CIB/VISA */}
          <button
            onClick={() => setActiveModal("carte")}
            className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all hover:scale-105"
          >
            <div className="w-16 h-16 bg-[#1B4D3E]/10 rounded-2xl flex items-center justify-center mb-4 mx-auto">
              <CreditCard size={32} className="text-[#1B4D3E]" />
            </div>
            <h3 className="text-lg text-gray-900 mb-2 text-center" style={{ fontWeight: 700 }}>
              Carte CIB/VISA
            </h3>
            <p className="text-sm text-gray-500 text-center mb-4">
              Paiement par carte bancaire internationale
            </p>
            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm text-gray-600 text-center">
                <span style={{ fontWeight: 600 }}>2500 DA</span> de test
              </p>
            </div>
          </button>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h4 className="text-blue-900 mb-2" style={{ fontWeight: 700 }}>
            💡 À propos de ces modales
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✅ <strong>Barid Mobile:</strong> Champs: Numéro de téléphone + PIN</li>
            <li>✅ <strong>CCP/e-CCP:</strong> Champs: Numéro de compte + Nom + Code d'accès</li>
            <li>✅ <strong>Carte CIB/VISA:</strong> Champs: Numéro de carte + Expiration + CVV + Nom</li>
            <li>✅ Chaque modale a 3 étapes: Formulaire → Confirmation → Succès</li>
            <li>✅ Validation et messages d'erreur intégrés</li>
          </ul>
        </div>
      </div>

      {/* Modales */}
      <PaiementModal
        isOpen={activeModal === "barid"}
        onClose={() => setActiveModal(null)}
        paymentMethod="barid"
        montantLocation={2000}
        caution={500}
        reservationId={0}
        onSuccess={() => { setActiveModal(null); }}
      />

      <PaiementModal
        isOpen={activeModal === "ccp"}
        onClose={() => setActiveModal(null)}
        paymentMethod="ccp"
        montantLocation={2000}
        caution={500}
        reservationId={0}
        onSuccess={() => { setActiveModal(null); }}
      />

      <PaiementModal
        isOpen={activeModal === "carte"}
        onClose={() => setActiveModal(null)}
        paymentMethod="carte"
        montantLocation={2000}
        caution={500}
        reservationId={0}
        onSuccess={() => { setActiveModal(null); }}
      />
    </div>
  );
}

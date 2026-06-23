import { useState } from "react";
import { X, Check, AlertCircle, Smartphone, Building2, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PaiementModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentMethod: "barid" | "ccp" | "carte";
  montantLocation: number;
  caution: number;
  onConfirm: (data: any) => Promise<void>;
  loading?: boolean;
  reservationId?: number;
}

export function PaiementModal({
  isOpen,
  onClose,
  paymentMethod,
  montantLocation,
  caution,
  onConfirm,
  loading = false,
  reservationId,
}: PaiementModalProps) {
  const [step, setStep] = useState<"form" | "confirm" | "success">("form");
  const [formData, setFormData] = useState<any>({});
  const [error, setError] = useState("");

  const total = montantLocation + caution;

  const handleSubmit = async () => {
    setError("");
    try {
      // Validation basique
      if (paymentMethod === "barid" && !formData.phone) {
        setError("Numéro de téléphone requis");
        return;
      }
      if (paymentMethod === "ccp" && !formData.account) {
        setError("Numéro de compte requis");
        return;
      }
      if (paymentMethod === "carte" && (!formData.card || !formData.cvv)) {
        setError("Données de carte incomplètes");
        return;
      }

      setStep("confirm");
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    }
  };

  const handleConfirm = async () => {
    try {
      await onConfirm({
        method: paymentMethod,
        ...formData,
        montant: total,
        reservationId,
      });
      setStep("success");
      setTimeout(() => {
        onClose();
        setStep("form");
        setFormData({});
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Erreur de paiement");
      setStep("form");
    }
  };

  const resetModal = () => {
    onClose();
    setStep("form");
    setFormData({});
    setError("");
  };

  const getTitle = () => {
    switch (paymentMethod) {
      case "barid":
        return "Paiement Barid Mobile";
      case "ccp":
        return "Paiement CCP / e-CCP";
      case "carte":
        return "Paiement par Carte CIB/VISA";
      default:
        return "Paiement";
    }
  };

  const getIcon = () => {
    switch (paymentMethod) {
      case "barid":
        return <Smartphone size={20} />;
      case "ccp":
        return <Building2 size={20} />;
      case "carte":
        return <CreditCard size={20} />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetModal}
            className="fixed inset-0 bg-black/40 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Header */}
              <div className="bg-[#1B4D3E] p-5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  {getIcon()}
                  <h2 style={{ fontWeight: 700 }}>{getTitle()}</h2>
                </div>
                <button
                  onClick={resetModal}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {step === "success" ? (
                  // ✅ Succès
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check size={32} className="text-green-600" />
                    </div>
                    <h3 className="text-gray-900 mb-2" style={{ fontWeight: 700 }}>
                      Paiement confirmé !
                    </h3>
                    <p className="text-gray-500 text-sm mb-4">
                      Votre réservation a été enregistrée avec succès.
                    </p>
                    <p className="text-[#1B4D3E] font-bold">
                      {total.toLocaleString("fr-DZ")} DA débités
                    </p>
                  </motion.div>
                ) : step === "confirm" ? (
                  // ⏳ Confirmation
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="bg-[#FAF6EF] rounded-xl p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Location :</span>
                        <span className="text-gray-900" style={{ fontWeight: 600 }}>
                          {montantLocation.toLocaleString("fr-DZ")} DA
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Caution (remboursable) :</span>
                        <span className="text-gray-900" style={{ fontWeight: 600 }}>
                          {caution.toLocaleString("fr-DZ")} DA
                        </span>
                      </div>
                      <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between">
                        <span className="text-gray-900" style={{ fontWeight: 700 }}>
                          Total :
                        </span>
                        <span className="text-[#1B4D3E] text-lg" style={{ fontWeight: 700 }}>
                          {total.toLocaleString("fr-DZ")} DA
                        </span>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-2">
                      <AlertCircle size={16} className="text-blue-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-blue-700">
                        {paymentMethod === "barid"
                          ? "Vous recevrez un SMS pour confirmer le paiement."
                          : paymentMethod === "ccp"
                          ? "Votre compte CCP sera débité."
                          : "Votre banque authentifiera la transaction."}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className="w-full bg-[#1B4D3E] text-white py-3 rounded-lg hover:bg-[#2d6b55] disabled:opacity-50 transition-colors"
                        style={{ fontWeight: 600 }}
                      >
                        {loading ? "Traitement..." : "Confirmer le paiement"}
                      </button>
                      <button
                        onClick={() => setStep("form")}
                        disabled={loading}
                        className="w-full border border-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                        style={{ fontWeight: 600 }}
                      >
                        Annuler
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  // 📝 Formulaire
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {paymentMethod === "barid" && (
                      <>
                        <div>
                          <label className="text-xs text-gray-600 mb-1.5 block" style={{ fontWeight: 600 }}>
                            📱 Numéro Barid Mobile
                          </label>
                          <input
                            type="tel"
                            placeholder="0661 234 567"
                            value={formData.phone || ""}
                            onChange={(e) =>
                              setFormData({ ...formData, phone: e.target.value })
                            }
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1B4D3E] focus:ring-1 focus:ring-[#1B4D3E]/20"
                          />
                          <p className="text-xs text-gray-400 mt-1">
                            Vous recevrez un SMS pour confirmer
                          </p>
                        </div>

                        <div>
                          <label className="text-xs text-gray-600 mb-1.5 block" style={{ fontWeight: 600 }}>
                            PIN Barid Mobile
                          </label>
                          <input
                            type="password"
                            placeholder="••••"
                            maxLength={4}
                            value={formData.pin || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                pin: e.target.value.replace(/\D/g, ""),
                              })
                            }
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1B4D3E] focus:ring-1 focus:ring-[#1B4D3E]/20"
                          />
                        </div>
                      </>
                    )}

                    {paymentMethod === "ccp" && (
                      <>
                        <div>
                          <label className="text-xs text-gray-600 mb-1.5 block" style={{ fontWeight: 600 }}>
                            🏦 Numéro de Compte CCP
                          </label>
                          <input
                            type="text"
                            placeholder="001 000 123456 50"
                            value={formData.account || ""}
                            onChange={(e) =>
                              setFormData({ ...formData, account: e.target.value })
                            }
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1B4D3E] focus:ring-1 focus:ring-[#1B4D3E]/20"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-gray-600 mb-1.5 block" style={{ fontWeight: 600 }}>
                            Nom du titulaire
                          </label>
                          <input
                            type="text"
                            placeholder="Votre nom complet"
                            value={formData.holder || ""}
                            onChange={(e) =>
                              setFormData({ ...formData, holder: e.target.value })
                            }
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1B4D3E] focus:ring-1 focus:ring-[#1B4D3E]/20"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-gray-600 mb-1.5 block" style={{ fontWeight: 600 }}>
                            Code d'accès
                          </label>
                          <input
                            type="password"
                            placeholder="••••"
                            maxLength={4}
                            value={formData.code || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                code: e.target.value.replace(/\D/g, ""),
                              })
                            }
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1B4D3E] focus:ring-1 focus:ring-[#1B4D3E]/20"
                          />
                        </div>
                      </>
                    )}

                    {paymentMethod === "carte" && (
                      <>
                        <div>
                          <label className="text-xs text-gray-600 mb-1.5 block" style={{ fontWeight: 600 }}>
                            💳 Numéro de carte
                          </label>
                          <input
                            type="text"
                            placeholder="4532 1234 5678 9010"
                            value={formData.card || ""}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\s/g, "");
                              setFormData({
                                ...formData,
                                card: val.match(/.{1,4}/g)?.join(" ") || val,
                              });
                            }}
                            maxLength={19}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1B4D3E] focus:ring-1 focus:ring-[#1B4D3E]/20 font-mono"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-gray-600 mb-1.5 block" style={{ fontWeight: 600 }}>
                              Expiration
                            </label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              value={formData.expiry || ""}
                              onChange={(e) => {
                                let val = e.target.value.replace(/\D/g, "");
                                if (val.length >= 2) {
                                  val = val.slice(0, 2) + "/" + val.slice(2, 4);
                                }
                                setFormData({ ...formData, expiry: val });
                              }}
                              maxLength={5}
                              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1B4D3E] focus:ring-1 focus:ring-[#1B4D3E]/20 font-mono"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-600 mb-1.5 block" style={{ fontWeight: 600 }}>
                              CVV
                            </label>
                            <input
                              type="password"
                              placeholder="•••"
                              value={formData.cvv || ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  cvv: e.target.value.replace(/\D/g, ""),
                                })
                              }
                              maxLength={3}
                              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1B4D3E] focus:ring-1 focus:ring-[#1B4D3E]/20 font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs text-gray-600 mb-1.5 block" style={{ fontWeight: 600 }}>
                            Nom du titulaire
                          </label>
                          <input
                            type="text"
                            placeholder="Nom sur la carte"
                            value={formData.holder || ""}
                            onChange={(e) =>
                              setFormData({ ...formData, holder: e.target.value })
                            }
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1B4D3E] focus:ring-1 focus:ring-[#1B4D3E]/20"
                          />
                        </div>
                      </>
                    )}

                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2">
                        <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-red-700">{error}</p>
                      </div>
                    )}

                    <button
                      onClick={handleSubmit}
                      className="w-full bg-[#1B4D3E] text-white py-3 rounded-lg hover:bg-[#2d6b55] transition-colors"
                      style={{ fontWeight: 600 }}
                    >
                      Continuer
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

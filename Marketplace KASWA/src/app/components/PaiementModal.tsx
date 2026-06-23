import { useState, useRef } from "react";
import { X, ArrowLeft, Copy, Check, Upload, Smartphone, Building2, Landmark } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { paiementsApi } from "../../services/api";

// ─── Coordonnées bancaires KASEWA.DZ par méthode ───────────────────────────
const METHODES = [
  {
    id: "ccp",
    label: "CCP Algérie Poste",
    sous: "Virement par Compte Chèque Postal",
    icon: <Building2 size={20} className="text-[#C9924A]" />,
    mode: "ccp",
    coordonnees: [
      { label: "Numéro de compte CCP", valeur: "001 000 123456 78" },
      { label: "Nom du bénéficiaire", valeur: "KESWA DZ" },
      { label: "Clé RIP", valeur: "007 99900 0012345678 50" },
    ],
  },
  {
    id: "barid",
    label: "BaridiMob",
    sous: "Paiement mobile via l'application BaridiMob",
    icon: <Smartphone size={20} className="text-[#C9924A]" />,
    mode: "barid_mobile",
    coordonnees: [
      { label: "Numéro de compte BaridiMob", valeur: "0799 1234 5678 9012" },
      { label: "Nom du bénéficiaire", valeur: "KESWA DZ" },
      { label: "Code RIP", valeur: "007 99900 0012345678 96" },
    ],
  },
  {
    id: "virement",
    label: "Virement Bancaire",
    sous: "Virement depuis votre compte bancaire",
    icon: <Landmark size={20} className="text-[#C9924A]" />,
    mode: "cib",
    coordonnees: [
      { label: "RIB (IBAN)", valeur: "DZ58 0300 0000 0123 4567 8900" },
      { label: "Banque", valeur: "CPA — Crédit Populaire d'Algérie" },
      { label: "Nom du bénéficiaire", valeur: "KESWA DZ SARL" },
    ],
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  paymentMethod?: "barid" | "ccp" | "carte";
  montantLocation: number;
  caution: number;
  onSuccess: () => void;
  reservationId: number;
  locataireNom?: string;
  tenueTitre?: string;
  tenueTaille?: string;
  dateDebut?: string;
  dateFin?: string;
  onVoirContrat?: () => void;
}

export function PaiementModal({
  isOpen, onClose, montantLocation, caution, onSuccess,
  reservationId, locataireNom = "Client", tenueTitre = "Tenue", tenueTaille = "",
  onVoirContrat,
}: Props) {
  const [step, setStep] = useState<"methode" | "instructions" | "recu" | "succes">("methode");
  const [methodeChoisie, setMethodeChoisie] = useState<typeof METHODES[0] | null>(null);
  const [recuFile, setRecuFile] = useState<File | null>(null);
  const [recuPreview, setRecuPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [compteExpediteur, setCompteExpediteur] = useState("");
  const recuRef = useRef<HTMLInputElement>(null);

  const total = montantLocation + caution;
  const reference = `KSW-${new Date().getFullYear()}-${String(reservationId).padStart(5, "0")}`;

  const copier = (val: string) => {
    navigator.clipboard.writeText(val.replace(/\s/g, ""));
    setCopied(val);
    setTimeout(() => setCopied(null), 2000);
  };

  const soumettre = async () => {
    if (!recuFile) { setError("Veuillez importer le reçu."); return; }
    if (!compteExpediteur.trim()) { setError("Veuillez saisir votre numéro de compte expéditeur."); return; }
    setLoading(true); setError("");
    try {
      const fd = new FormData();
      fd.append("mode", methodeChoisie!.mode);
      fd.append("numero_compte", compteExpediteur.replace(/\s/g, ""));
      fd.append("recu_photo", recuFile);
      await paiementsApi.payerFormData(reservationId, fd);
      setStep("succes");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur lors de la soumission du paiement. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep("methode"); setMethodeChoisie(null);
    setRecuFile(null); setRecuPreview(""); setError("");
    setCompteExpediteur(""); onClose();
  };

  const etapes = ["methode", "instructions", "recu", "succes"];
  const etapeIdx = etapes.indexOf(step);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={reset} className="fixed inset-0 bg-black/60 z-50" />

          {/* Modal */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[480px] z-50 px-3">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

              {/* ── Header vert ── */}
              <div className="bg-[#1B4D3E] px-5 py-4 shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {step !== "methode" && step !== "succes" && (
                      <button onClick={() => setStep(step === "instructions" ? "methode" : "instructions")}
                        className="text-white/70 hover:text-white mr-1">
                        <ArrowLeft size={18} />
                      </button>
                    )}
                    <div>
                      <h2 className="text-white text-base" style={{ fontWeight: 700 }}>
                        {step === "succes" ? "Paiement soumis ✓" : "Paiement de la réservation"}
                      </h2>
                      <p className="text-white/60 text-xs mt-0.5">
                        {tenueTitre}{tenueTaille ? ` — Taille ${tenueTaille}` : ""}
                      </p>
                    </div>
                  </div>
                  <button onClick={reset} className="text-white/60 hover:text-white">
                    <X size={20} />
                  </button>
                </div>

                {/* Montants */}
                {step !== "succes" && (
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white/10 rounded-xl px-3 py-2">
                      <p className="text-white/50 text-xs">Location</p>
                      <p className="text-white text-sm" style={{ fontWeight: 700 }}>{montantLocation.toLocaleString("fr-DZ")} DA</p>
                    </div>
                    <div className="bg-white/10 rounded-xl px-3 py-2">
                      <p className="text-white/50 text-xs">Caution</p>
                      <p className="text-white text-sm" style={{ fontWeight: 700 }}>{caution.toLocaleString("fr-DZ")} DA</p>
                    </div>
                    <div className="bg-[#C9924A]/90 rounded-xl px-3 py-2">
                      <p className="text-white/70 text-xs">Total</p>
                      <p className="text-white text-sm" style={{ fontWeight: 700 }}>{total.toLocaleString("fr-DZ")} DA</p>
                    </div>
                  </div>
                )}

                {/* Dots progress */}
                {step !== "succes" && (
                  <div className="flex items-center gap-2 mt-3">
                    {["methode", "instructions", "recu"].map((s, i) => (
                      <div key={s} className={`w-2.5 h-2.5 rounded-full transition-all ${
                        etapeIdx > i ? "bg-[#C9924A]" : etapeIdx === i ? "bg-[#C9924A]" : "bg-white/30"
                      }`} />
                    ))}
                    <span className="text-white/60 text-xs ml-1" style={{ fontWeight: 500 }}>
                      {step === "methode" ? "Méthode" : step === "instructions" ? "Instructions" : "Reçu"}
                    </span>
                  </div>
                )}
              </div>

              {/* ── Contenu ── */}
              <div className="overflow-y-auto flex-1">

                {/* ÉTAPE 1 — Choix méthode */}
                {step === "methode" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5 space-y-3">
                    {onVoirContrat && (
                      <button onClick={onVoirContrat}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-[#1B4D3E]/30 bg-[#1B4D3E]/5 text-[#1B4D3E] hover:bg-[#1B4D3E]/10 transition-colors mb-1"
                        style={{ fontWeight: 600 }}>
                        <span className="flex items-center gap-2 text-sm">
                          <span className="text-base">📄</span>Consulter le contrat de location
                        </span>
                        <span className="text-xs text-[#1B4D3E]/60">Voir →</span>
                      </button>
                    )}
                    <p className="text-gray-600 text-sm mb-4">Choisissez votre méthode de paiement</p>
                    {METHODES.map((m) => (
                      <button key={m.id} onClick={() => { setMethodeChoisie(m); setStep("instructions"); }}
                        className="w-full flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all hover:border-[#C9924A] hover:bg-[#FFF8EC]"
                        style={{ borderColor: "#C9924A", background: "#FFFDF5" }}>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#FFF0D4] rounded-xl flex items-center justify-center">
                            {m.icon}
                          </div>
                          <div>
                            <p className="text-gray-900 text-sm" style={{ fontWeight: 600 }}>{m.label}</p>
                            <p className="text-gray-400 text-xs">{m.sous}</p>
                          </div>
                        </div>
                        <span className="text-gray-300 text-lg">›</span>
                      </button>
                    ))}
                  </motion.div>
                )}

                {/* ÉTAPE 2 — Instructions / Coordonnées */}
                {step === "instructions" && methodeChoisie && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-5 space-y-3">

                    {/* Coordonnées bancaires */}
                    <div className="border-2 border-[#C9924A] rounded-xl overflow-hidden" style={{ background: "#FFFDF5" }}>
                      <div className="px-4 py-2 border-b border-[#C9924A]/20">
                        <p className="text-xs text-gray-500" style={{ fontWeight: 700, letterSpacing: "0.05em" }}>
                          COORDONNÉES BANCAIRES
                        </p>
                      </div>
                      {methodeChoisie.coordonnees.map((c) => (
                        <div key={c.label} className="flex items-center justify-between px-4 py-3 border-b border-[#C9924A]/10 last:border-0">
                          <p className="text-gray-500 text-xs">{c.label}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-900 text-xs font-mono" style={{ fontWeight: 600 }}>{c.valeur}</span>
                            <button onClick={() => copier(c.valeur)}
                              className="text-gray-300 hover:text-[#C9924A] transition-colors">
                              {copied === c.valeur ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Montant exact */}
                    <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-[#C9924A]/40" style={{ background: "#FFFDF5" }}>
                      <span className="text-gray-600 text-sm">Montant exact à virer</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[#C9924A] text-base" style={{ fontWeight: 700 }}>{total.toLocaleString("fr-DZ")} DA</span>
                        <button onClick={() => copier(String(total))} className="text-gray-300 hover:text-[#C9924A]">
                          {copied === String(total) ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
                        </button>
                      </div>
                    </div>

                    {/* Référence */}
                    <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 bg-gray-50">
                      <span className="text-gray-600 text-sm">Référence à indiquer</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-900 text-xs font-mono" style={{ fontWeight: 600 }}>{reference}</span>
                        <button onClick={() => copier(reference)} className="text-gray-300 hover:text-[#C9924A]">
                          {copied === reference ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
                        </button>
                      </div>
                    </div>

                    {/* Comment procéder */}
                    <div>
                      <p className="text-xs text-gray-500 mb-2" style={{ fontWeight: 700, letterSpacing: "0.05em" }}>COMMENT PROCÉDER</p>
                      <div className="space-y-2">
                        {[
                          `Ouvrez ${methodeChoisie.label} et initiez un virement`,
                          `Entrez le numéro de compte KESWA DZ ci-dessus`,
                          `Saisissez le montant exact : ${total.toLocaleString("fr-DZ")} DA`,
                          `Indiquez la référence ${reference} dans le motif`,
                          "Faites une capture d'écran du reçu confirmatif",
                        ].map((s, i) => (
                          <div key={i} className="flex items-start gap-2.5">
                            <div className="w-5 h-5 rounded-full bg-[#1B4D3E] text-white text-xs flex items-center justify-center shrink-0 mt-0.5" style={{ fontWeight: 700 }}>{i + 1}</div>
                            <p className="text-gray-600 text-xs leading-relaxed">{s}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button onClick={() => setStep("recu")}
                      className="w-full bg-[#1B4D3E] text-white py-3 rounded-xl text-sm hover:bg-[#2d6b55] mt-2"
                      style={{ fontWeight: 600 }}>
                      J'ai effectué le virement →
                    </button>
                  </motion.div>
                )}

                {/* ÉTAPE 3 — Upload reçu */}
                {step === "recu" && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-5 space-y-4">
                    <div className="text-center">
                      <p className="text-gray-900 text-sm mb-1" style={{ fontWeight: 700 }}>Importez votre reçu de paiement</p>
                      <p className="text-gray-400 text-xs">Capture d'écran ou photo du reçu confirmatif de votre virement</p>
                    </div>

                    <input ref={recuRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      setRecuFile(f); setRecuPreview(URL.createObjectURL(f));
                    }} />

                    {recuPreview ? (
                      <div className="relative rounded-xl overflow-hidden border-2 border-[#C9924A]">
                        <img src={recuPreview} alt="Reçu" className="w-full max-h-48 object-contain bg-gray-50" />
                        <button onClick={() => { setRecuFile(null); setRecuPreview(""); }}
                          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow">
                          <X size={14} className="text-gray-500" />
                        </button>
                        <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <Check size={10} /> Reçu importé
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => recuRef.current?.click()}
                        className="w-full border-2 border-dashed border-gray-200 rounded-xl p-10 text-center hover:border-[#C9924A] hover:bg-[#FFFDF5] transition-colors">
                        <Upload size={28} className="mx-auto text-gray-300 mb-2" />
                        <p className="text-sm text-gray-400">Cliquer pour importer le reçu</p>
                        <p className="text-xs text-gray-300 mt-1">JPG, PNG — max 5 Mo</p>
                      </button>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Votre numéro de compte expéditeur (CCP / RIP) *
                      </label>
                      <input
                        type="text"
                        value={compteExpediteur}
                        onChange={(e) => setCompteExpediteur(e.target.value)}
                        placeholder="Ex: 001000123456789 clé 78"
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#C9924A]"
                      />
                      <p className="text-xs text-gray-400 mt-1">Numéro depuis lequel vous avez effectué le virement</p>
                    </div>

                    {error && <p className="text-red-500 text-xs text-center">{error}</p>}

                    <button onClick={soumettre} disabled={!recuFile || !compteExpediteur.trim() || loading}
                      className="w-full bg-[#C9924A] text-white py-3 rounded-xl text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                      style={{ fontWeight: 600 }}>
                      {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Soumettre le paiement"}
                    </button>
                  </motion.div>
                )}

                {/* ÉTAPE 4 — Succès */}
                {step === "succes" && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-6">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check size={32} className="text-green-600" />
                      </div>
                      <h3 className="text-gray-900 text-lg mb-2" style={{ fontWeight: 700 }}>Paiement soumis avec succès !</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        Votre reçu a été transmis. Nous vérifierons le paiement dans les{" "}
                        <span style={{ fontWeight: 700 }}>24h ouvrables</span> et confirmerons votre réservation.
                      </p>
                    </div>

                    {/* Récapitulatif */}
                    <div className="border border-gray-100 rounded-xl overflow-hidden">
                      {[
                        { label: "Réservation", valeur: reference },
                        { label: "Méthode", valeur: methodeChoisie?.label ?? "—" },
                        { label: "Montant", valeur: `${total.toLocaleString("fr-DZ")} DA`, gold: true },
                        { label: "Statut", valeur: "En attente de vérification", badge: true },
                      ].map((r, i) => (
                        <div key={i} className="flex items-center justify-between px-4 py-3 border-b border-gray-50 last:border-0">
                          <span className="text-gray-500 text-sm">{r.label}</span>
                          {r.badge ? (
                            <span className="text-xs bg-[#FFF0D4] text-[#C9924A] px-2.5 py-1 rounded-full" style={{ fontWeight: 600 }}>
                              {r.valeur}
                            </span>
                          ) : (
                            <span className={`text-sm ${r.gold ? "text-[#C9924A]" : "text-gray-900"}`} style={{ fontWeight: 600 }}>
                              {r.valeur}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    <button onClick={() => { onSuccess(); reset(); }}
                      className="w-full bg-[#1B4D3E] text-white py-3 rounded-xl text-sm mt-4 hover:bg-[#2d6b55]"
                      style={{ fontWeight: 600 }}>
                      Fermer
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

import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  CheckCircle2,
  Copy,
  Upload,
  X,
  ChevronRight,
  ArrowLeft,
  Smartphone,
  Building2,
  CreditCard,
  ImageIcon,
  AlertCircle,
  Check,
} from "lucide-react";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  bookingId: string;
  amount: number;
  caution: number;
  listingTitle: string;
  onConfirm: (method: string, receiptFile: File) => void;
}

type PaymentMethod = "ccp" | "baridimob" | "virement";
type Step = "choose" | "details" | "confirm" | "success";

const PAYMENT_INFO = {
  ccp: {
    label: "CCP Algérie Poste",
    icon: CreditCard,
    color: "#F5A623",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-300",
    description: "Virement par Compte Chèque Postal",
    fields: [
      { label: "Numéro de CCP", value: "0012345678 / clé 96" },
      { label: "Nom du bénéficiaire", value: "KESWA DZ SARL" },
      { label: "Agence", value: "Bureau de poste Alger Centre" },
    ],
    instructions: [
      "Rendez-vous à n'importe quel bureau de poste d'Algérie",
      "Demandez un bordereau de virement CCP",
      "Remplissez avec les informations ci-dessus",
      "Conservez le reçu tamponné par la poste",
      "Prenez une photo du reçu et téléchargez-la ici",
    ],
  },
  baridimob: {
    label: "BaridiMob",
    icon: Smartphone,
    color: "#FFC107",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-400",
    description: "Paiement mobile via l'application BaridiMob",
    fields: [
      { label: "Numéro de compte BaridiMob", value: "0799 1234 5678 9012" },
      { label: "Nom du bénéficiaire", value: "KESWA DZ" },
      { label: "Code RIP", value: "007 99900 0012345678 96" },
    ],
    instructions: [
      "Ouvrez l'application BaridiMob sur votre téléphone",
      "Allez dans « Virement » → « Virement BaridiMob »",
      "Entrez le numéro de compte ci-dessus",
      "Saisissez le montant exact indiqué",
      "Validez et prenez une capture d'écran de la confirmation",
    ],
  },
  virement: {
    label: "Virement Bancaire",
    icon: Building2,
    color: "#1B4D3E",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-400",
    description: "Virement depuis votre compte bancaire",
    fields: [
      { label: "Banque", value: "BNA — Banque Nationale d'Algérie" },
      { label: "Numéro de compte (RIB)", value: "002 00100 0000012345 67" },
      { label: "SWIFT / BIC", value: "BNAADZAL" },
      { label: "Nom du bénéficiaire", value: "KESWA DZ SARL" },
      { label: "Agence", value: "BNA Alger Centre — Agence 001" },
    ],
    instructions: [
      "Connectez-vous à votre espace bancaire en ligne ou app mobile",
      "Créez un nouveau virement avec les informations ci-dessus",
      "Indiquez le numéro de réservation en référence",
      "Validez le virement",
      "Téléchargez le justificatif PDF ou prenez une capture d'écran",
    ],
  },
};

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="ml-2 p-1 rounded hover:bg-white/60 transition-colors"
      title="Copier"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-green-600" />
      ) : (
        <Copy className="w-3.5 h-3.5 text-gray-400" />
      )}
    </button>
  );
}

export function PaymentModal({
  open,
  onClose,
  bookingId,
  amount,
  caution,
  listingTitle,
  onConfirm,
}: PaymentModalProps) {
  const [step, setStep] = useState<Step>("choose");
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const total = amount + caution;
  const info = method ? PAYMENT_INFO[method] : null;

  const handleMethodSelect = (m: PaymentMethod) => {
    setMethod(m);
    setStep("details");
  };

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") return;
    setReceiptFile(file);
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setReceiptPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setReceiptPreview(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange(file);
  };

  const handleSubmit = () => {
    if (!method || !receiptFile) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setStep("success");
      onConfirm(method, receiptFile);
    }, 1500);
  };

  const handleClose = () => {
    setStep("choose");
    setMethod(null);
    setReceiptFile(null);
    setReceiptPreview(null);
    setSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg w-full p-0 overflow-hidden rounded-2xl">
        {/* Header */}
        <div
          className="px-6 py-4 text-white"
          style={{ background: "linear-gradient(135deg, #1B4D3E 0%, #2d6b58 100%)" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {step !== "choose" && step !== "success" && (
                <button
                  onClick={() => setStep(step === "confirm" ? "details" : "choose")}
                  className="p-1 rounded-full hover:bg-white/20 transition-colors mr-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <div>
                <DialogTitle className="text-white text-base font-semibold m-0">
                  {step === "success" ? "Paiement soumis ✓" : "Paiement de la réservation"}
                </DialogTitle>
                <p className="text-white/70 text-xs mt-0.5 truncate max-w-[280px]">{listingTitle}</p>
              </div>
            </div>
            <button onClick={handleClose} className="p-1 rounded-full hover:bg-white/20 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Amount summary */}
          {step !== "success" && (
            <div className="mt-3 flex gap-3">
              <div className="flex-1 bg-white/10 rounded-lg px-3 py-2">
                <p className="text-white/60 text-xs">Location</p>
                <p className="text-white font-bold text-sm">{amount.toLocaleString("fr-DZ")} DA</p>
              </div>
              <div className="flex-1 bg-white/10 rounded-lg px-3 py-2">
                <p className="text-white/60 text-xs">Caution</p>
                <p className="text-white font-bold text-sm">{caution.toLocaleString("fr-DZ")} DA</p>
              </div>
              <div className="flex-1 rounded-lg px-3 py-2" style={{ background: "rgba(201,146,74,0.3)", border: "1px solid rgba(201,146,74,0.5)" }}>
                <p className="text-amber-200 text-xs">Total</p>
                <p className="font-bold text-sm" style={{ color: "#C9924A" }}>{total.toLocaleString("fr-DZ")} DA</p>
              </div>
            </div>
          )}

          {/* Step indicator */}
          {step !== "success" && (
            <div className="mt-3 flex items-center gap-1">
              {(["choose", "details", "confirm"] as Step[]).map((s, i) => (
                <div key={s} className="flex items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full transition-all ${
                      step === s ? "bg-amber-400 w-4" : i < ["choose","details","confirm"].indexOf(step) ? "bg-white/60" : "bg-white/20"
                    }`}
                  />
                </div>
              ))}
              <span className="text-white/50 text-xs ml-2">
                {step === "choose" ? "Méthode" : step === "details" ? "Instructions" : "Confirmation"}
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">

          {/* STEP 1: Choose method */}
          {step === "choose" && (
            <div className="space-y-3">
              <p className="text-sm text-gray-500 mb-4">Choisissez votre méthode de paiement</p>
              {(Object.entries(PAYMENT_INFO) as [PaymentMethod, typeof PAYMENT_INFO.ccp][]).map(([key, info]) => {
                const Icon = info.icon;
                return (
                  <button
                    key={key}
                    onClick={() => handleMethodSelect(key)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all hover:shadow-md text-left ${info.bgColor} ${info.borderColor} hover:scale-[1.01]`}
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: info.color + "22" }}
                    >
                      <Icon className="w-5 h-5" style={{ color: info.color === "#F5A623" ? "#C9924A" : info.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm">{info.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{info.description}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  </button>
                );
              })}

              <div className="mt-4 flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-700">
                  Réf. réservation : <strong className="font-mono">{bookingId}</strong> — mentionnez-la lors du virement.
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: Payment details */}
          {step === "details" && info && (
            <div className="space-y-4">
              {/* Info card */}
              <div className={`p-4 rounded-xl border-2 ${info.bgColor} ${info.borderColor}`}>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Coordonnées bancaires</p>
                <div className="space-y-2.5">
                  {info.fields.map((f) => (
                    <div key={f.label} className="flex items-start justify-between gap-2">
                      <span className="text-xs text-gray-500 flex-shrink-0 mt-0.5 w-36">{f.label}</span>
                      <div className="flex items-center gap-1 flex-1 justify-end">
                        <span className="text-sm font-semibold text-gray-800 text-right font-mono">{f.value}</span>
                        <CopyButton value={f.value} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amount to pay */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200">
                <span className="text-sm text-gray-600">Montant exact à virer</span>
                <span className="text-lg font-bold" style={{ color: "#C9924A" }}>
                  {total.toLocaleString("fr-DZ")} DA
                  <CopyButton value={total.toString()} />
                </span>
              </div>

              {/* Reference */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200">
                <span className="text-sm text-gray-600">Référence à indiquer</span>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold font-mono text-gray-800">{bookingId}</span>
                  <CopyButton value={bookingId} />
                </div>
              </div>

              {/* Instructions */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Comment procéder</p>
                <div className="space-y-2">
                  {info.instructions.map((step, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-white text-xs font-bold"
                        style={{ background: "#1B4D3E" }}
                      >
                        {i + 1}
                      </div>
                      <p className="text-sm text-gray-600">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                className="w-full mt-2 text-white font-semibold py-2.5 rounded-xl"
                style={{ background: "linear-gradient(135deg, #1B4D3E, #2d6b58)" }}
                onClick={() => setStep("confirm")}
              >
                J'ai effectué le paiement →
              </Button>
            </div>
          )}

          {/* STEP 3: Upload receipt */}
          {step === "confirm" && info && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-1">Téléversez votre reçu de paiement</p>
                <p className="text-xs text-gray-500">
                  Prenez une capture d'écran ou une photo du reçu {info.label} et importez-la ici pour valider votre paiement.
                </p>
              </div>

              {/* Upload area */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl transition-all cursor-pointer min-h-[180px] flex flex-col items-center justify-center gap-3 ${
                  dragging ? "border-amber-400 bg-amber-50" : receiptFile ? "border-green-400 bg-green-50" : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                }`}
              >
                {receiptPreview ? (
                  <div className="relative w-full h-48 p-2">
                    <img
                      src={receiptPreview}
                      alt="Reçu"
                      className="w-full h-full object-contain rounded-lg"
                    />
                    <button
                      onClick={(e) => { e.stopPropagation(); setReceiptFile(null); setReceiptPreview(null); }}
                      className="absolute top-3 right-3 bg-white rounded-full p-1 shadow-md hover:bg-red-50 transition-colors"
                    >
                      <X className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ) : receiptFile ? (
                  <div className="flex flex-col items-center gap-2 p-6">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">{receiptFile.name}</p>
                    <p className="text-xs text-gray-400">{(receiptFile.size / 1024).toFixed(0)} KB</p>
                    <button
                      onClick={(e) => { e.stopPropagation(); setReceiptFile(null); }}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Supprimer
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                      <Upload className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="text-center px-4">
                      <p className="text-sm font-medium text-gray-700">Glissez votre capture ici</p>
                      <p className="text-xs text-gray-400 mt-1">ou cliquez pour sélectionner</p>
                      <p className="text-xs text-gray-300 mt-2">JPG, PNG, PDF · max 10 Mo</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs gap-1">
                        <ImageIcon className="w-3 h-3" /> Image
                      </Badge>
                      <Badge variant="outline" className="text-xs gap-1">
                        <Upload className="w-3 h-3" /> PDF
                      </Badge>
                    </div>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                />
              </div>

              {/* Summary before submit */}
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Méthode</span>
                  <span className="font-medium text-gray-700">{info.label}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Montant</span>
                  <span className="font-bold" style={{ color: "#C9924A" }}>{total.toLocaleString("fr-DZ")} DA</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Référence</span>
                  <span className="font-mono font-medium text-gray-700">{bookingId}</span>
                </div>
              </div>

              <Button
                className="w-full py-2.5 rounded-xl font-semibold text-white transition-all"
                style={{
                  background: receiptFile && !submitting
                    ? "linear-gradient(135deg, #C9924A, #b8803d)"
                    : "#d1d5db",
                  cursor: receiptFile && !submitting ? "pointer" : "not-allowed",
                }}
                disabled={!receiptFile || submitting}
                onClick={handleSubmit}
              >
                {submitting ? (
                  <span className="flex items-center gap-2 justify-center">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Envoi en cours...
                  </span>
                ) : (
                  "Confirmer le paiement"
                )}
              </Button>
            </div>
          )}

          {/* STEP 4: Success */}
          {step === "success" && (
            <div className="flex flex-col items-center py-8 text-center gap-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #1B4D3E22, #1B4D3E44)" }}
              >
                <CheckCircle2 className="w-10 h-10" style={{ color: "#1B4D3E" }} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Paiement soumis avec succès !</h3>
                <p className="text-sm text-gray-500 mt-1 max-w-xs">
                  Votre reçu a été transmis. Nous vérifierons le paiement dans les <strong>24h ouvrables</strong> et confirmerons votre réservation.
                </p>
              </div>
              <div className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2 text-left">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Réservation</span>
                  <span className="font-mono font-semibold text-gray-700">{bookingId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Méthode</span>
                  <span className="font-medium text-gray-700">{method ? PAYMENT_INFO[method].label : ""}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Montant</span>
                  <span className="font-bold" style={{ color: "#C9924A" }}>{total.toLocaleString("fr-DZ")} DA</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Statut</span>
                  <Badge className="text-xs bg-amber-100 text-amber-700 border-amber-200">En attente de vérification</Badge>
                </div>
              </div>
              <Button
                className="w-full py-2.5 rounded-xl font-semibold text-white mt-2"
                style={{ background: "linear-gradient(135deg, #1B4D3E, #2d6b58)" }}
                onClick={handleClose}
              >
                Fermer
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

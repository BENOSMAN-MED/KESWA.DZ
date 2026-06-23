import { useState } from "react";
import { X, Upload, FileText, CheckCircle, AlertCircle, Camera, Mail, Phone, UserCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface BankInfo {
  type: "CCP" | "Bank";
  accountNumber: string;
  accountKey?: string; // Pour CCP
  bankName?: string; // Pour Bank
  rib?: string; // Pour Bank
  ownerName: string;
  proofDocument?: File | null;
}

interface IdentityDocument {
  type: "CIN" | "Passport";
  documentNumber: string;
  fullName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  issueDate: string;
  expiryDate: string;
  document?: File | null;
}

interface ContactVerification {
  email: string;
  emailCode: string;
  emailVerified: boolean;
  phone: string;
  phoneCode: string;
  phoneVerified: boolean;
  facePhoto?: File | null;
}

interface ProfileInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    contact: ContactVerification;
    identity: IdentityDocument;
    bankAccounts: BankInfo[]
  }) => void;
  initialEmail?: string;
  initialPhone?: string;
}

export function ProfileInfoModal({ isOpen, onClose, onSubmit, initialEmail = "", initialPhone = "" }: ProfileInfoModalProps) {
  const [currentStep, setCurrentStep] = useState<"contact" | "identity" | "bank">("contact");

  // Contact verification state
  const [contact, setContact] = useState<ContactVerification>({
    email: initialEmail,
    emailCode: "",
    emailVerified: false,
    phone: initialPhone,
    phoneCode: "",
    phoneVerified: false,
    facePhoto: null,
  });
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  const [phoneCodeSent, setPhoneCodeSent] = useState(false);

  // Identity state
  const [identityType, setIdentityType] = useState<"CIN" | "Passport">("CIN");
  const [identity, setIdentity] = useState<IdentityDocument>({
    type: "CIN",
    documentNumber: "",
    fullName: "",
    dateOfBirth: "",
    placeOfBirth: "",
    issueDate: "",
    expiryDate: "",
    document: null,
  });

  // Bank accounts state
  const [bankAccounts, setBankAccounts] = useState<BankInfo[]>([]);
  const [currentBankType, setCurrentBankType] = useState<"CCP" | "Bank">("CCP");
  const [currentBankInfo, setCurrentBankInfo] = useState<BankInfo>({
    type: "CCP",
    accountNumber: "",
    accountKey: "",
    ownerName: "",
    proofDocument: null,
  });

  const handleSendEmailCode = () => {
    // Simuler l'envoi du code
    if (!contact.email || !contact.email.includes("@")) {
      alert("Veuillez saisir une adresse email valide");
      return;
    }
    setEmailCodeSent(true);
    alert(`📧 Code de vérification envoyé à ${contact.email}`);
  };

  const handleVerifyEmailCode = () => {
    // Simuler la vérification (dans la réalité, vérifier avec le backend)
    if (contact.emailCode.length === 6) {
      setContact({ ...contact, emailVerified: true });
      alert("✅ Email vérifié avec succès !");
    } else {
      alert("❌ Code incorrect. Le code doit contenir 6 chiffres.");
    }
  };

  const handleSendPhoneCode = () => {
    // Simuler l'envoi du code SMS
    if (!contact.phone || contact.phone.length < 10) {
      alert("Veuillez saisir un numéro de téléphone valide");
      return;
    }
    setPhoneCodeSent(true);
    alert(`📱 Code SMS envoyé au ${contact.phone}`);
  };

  const handleVerifyPhoneCode = () => {
    // Simuler la vérification (dans la réalité, vérifier avec le backend)
    if (contact.phoneCode.length === 6) {
      setContact({ ...contact, phoneVerified: true });
      alert("✅ Téléphone vérifié avec succès !");
    } else {
      alert("❌ Code incorrect. Le code doit contenir 6 chiffres.");
    }
  };

  const handleFacePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier que c'est une image
      if (!file.type.startsWith("image/")) {
        alert("Veuillez sélectionner une image (JPG, PNG)");
        return;
      }
      setContact({ ...contact, facePhoto: file });
    }
  };

  const handleIdentityFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIdentity({ ...identity, document: file });
    }
  };

  const handleBankFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCurrentBankInfo({ ...currentBankInfo, proofDocument: file });
    }
  };

  const handleContactSubmit = () => {
    // Validation
    if (!contact.email || !contact.phone) {
      alert("Veuillez remplir l'email et le téléphone");
      return;
    }
    if (!contact.emailVerified || !contact.phoneVerified) {
      alert("Veuillez vérifier votre email et téléphone avant de continuer");
      return;
    }
    if (!contact.facePhoto) {
      alert("Veuillez prendre une photo de votre visage");
      return;
    }
    setCurrentStep("identity");
  };

  const handleIdentitySubmit = () => {
    // Validation
    if (!identity.documentNumber || !identity.fullName || !identity.dateOfBirth) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }
    setCurrentStep("bank");
  };

  const handleAddBankAccount = () => {
    if (!currentBankInfo.accountNumber || !currentBankInfo.ownerName) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }
    if (currentBankType === "CCP" && currentBankInfo.accountNumber.length !== 10) {
      alert("Le numéro de compte CCP doit contenir exactement 10 chiffres");
      return;
    }
    if (currentBankType === "CCP" && (!currentBankInfo.accountKey || currentBankInfo.accountKey.length !== 2)) {
      alert("La clé CCP doit contenir exactement 2 chiffres");
      return;
    }
    if (currentBankType === "Bank" && (!currentBankInfo.bankName || !currentBankInfo.rib)) {
      alert("Veuillez remplir le nom de la banque et le RIB");
      return;
    }

    setBankAccounts([...bankAccounts, { ...currentBankInfo }]);

    // Reset form
    setCurrentBankInfo({
      type: currentBankType,
      accountNumber: "",
      accountKey: currentBankType === "CCP" ? "" : undefined,
      bankName: currentBankType === "Bank" ? "" : undefined,
      rib: currentBankType === "Bank" ? "" : undefined,
      ownerName: "",
      proofDocument: null,
    });
  };

  const handleRemoveBankAccount = (index: number) => {
    setBankAccounts(bankAccounts.filter((_, i) => i !== index));
  };

  const handleFinalSubmit = () => {
    let finalAccounts = [...bankAccounts];

    // Si le formulaire est rempli mais pas encore ajouté, l'ajouter automatiquement
    if (currentBankInfo.accountNumber && currentBankInfo.ownerName) {
      const ccpOk = currentBankType !== "CCP" ||
        (currentBankInfo.accountNumber.length === 10 && (currentBankInfo.accountKey || "").length === 2);
      const bankOk = currentBankType !== "Bank" || (!!currentBankInfo.bankName && !!currentBankInfo.rib);
      if (ccpOk && bankOk) {
        finalAccounts = [...finalAccounts, { ...currentBankInfo }];
      }
    }

    if (finalAccounts.length === 0) {
      alert("Veuillez ajouter au moins un compte bancaire/CCP");
      return;
    }

    onSubmit({
      contact,
      identity,
      bankAccounts: finalAccounts,
    });

    onClose();
  };

  const getStepNumber = () => {
    if (currentStep === "contact") return 1;
    if (currentStep === "identity") return 2;
    return 3;
  };

  const getProgressWidth = () => {
    if (currentStep === "contact") return "33.33%";
    if (currentStep === "identity") return "66.66%";
    return "100%";
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1B4D3E] to-[#2d6b55] text-white p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Compléter mon profil</h2>
              <p className="text-sm text-white/80 mt-1">
                {currentStep === "contact" && "Étape 1/3 : Vérification Contact & Photo"}
                {currentStep === "identity" && "Étape 2/3 : Document d'identité"}
                {currentStep === "bank" && "Étape 3/3 : Informations bancaires"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-gray-100">
            <div
              className="h-full bg-[#C9924A] transition-all duration-300"
              style={{ width: getProgressWidth() }}
            />
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(90vh - 180px)" }}>
            {/* ÉTAPE 1 : CONTACT & PHOTO VISAGE */}
            {currentStep === "contact" && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
                  <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold">Vérification de sécurité</p>
                    <p className="text-xs mt-1">
                      Pour sécuriser votre compte et éviter les fraudes, nous devons vérifier votre email, téléphone et identité visuelle.
                    </p>
                  </div>
                </div>

                {/* Email Verification */}
                <div className="border border-gray-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Mail className="text-[#1B4D3E]" size={20} />
                    <h3 className="font-semibold text-gray-900">Vérification Email</h3>
                    {contact.emailVerified && (
                      <CheckCircle size={18} className="text-green-600 ml-auto" />
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Adresse email <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="email"
                          value={contact.email}
                          onChange={(e) => setContact({ ...contact, email: e.target.value })}
                          disabled={contact.emailVerified}
                          placeholder="exemple@email.com"
                          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent disabled:bg-gray-100"
                        />
                        {!contact.emailVerified && (
                          <button
                            onClick={handleSendEmailCode}
                            className="bg-[#1B4D3E] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#2d6b55] whitespace-nowrap"
                          >
                            {emailCodeSent ? "Renvoyer" : "Envoyer code"}
                          </button>
                        )}
                      </div>
                    </div>

                    {emailCodeSent && !contact.emailVerified && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Code de vérification (6 chiffres)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={contact.emailCode}
                            onChange={(e) => setContact({ ...contact, emailCode: e.target.value.replace(/\D/g, "").slice(0, 6) })}
                            placeholder="123456"
                            maxLength={6}
                            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent text-center text-lg tracking-widest"
                          />
                          <button
                            onClick={handleVerifyEmailCode}
                            className="bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700"
                          >
                            Vérifier
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Phone Verification */}
                <div className="border border-gray-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Phone className="text-[#1B4D3E]" size={20} />
                    <h3 className="font-semibold text-gray-900">Vérification Téléphone</h3>
                    {contact.phoneVerified && (
                      <CheckCircle size={18} className="text-green-600 ml-auto" />
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Numéro de téléphone <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="tel"
                          value={contact.phone}
                          onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                          disabled={contact.phoneVerified}
                          placeholder="+213 555 123 456"
                          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent disabled:bg-gray-100"
                        />
                        {!contact.phoneVerified && (
                          <button
                            onClick={handleSendPhoneCode}
                            className="bg-[#1B4D3E] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#2d6b55] whitespace-nowrap"
                          >
                            {phoneCodeSent ? "Renvoyer" : "Envoyer SMS"}
                          </button>
                        )}
                      </div>
                    </div>

                    {phoneCodeSent && !contact.phoneVerified && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Code SMS (6 chiffres)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={contact.phoneCode}
                            onChange={(e) => setContact({ ...contact, phoneCode: e.target.value.replace(/\D/g, "").slice(0, 6) })}
                            placeholder="123456"
                            maxLength={6}
                            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent text-center text-lg tracking-widest"
                          />
                          <button
                            onClick={handleVerifyPhoneCode}
                            className="bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700"
                          >
                            Vérifier
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Face Photo */}
                <div className="border border-gray-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <UserCircle className="text-[#1B4D3E]" size={20} />
                    <h3 className="font-semibold text-gray-900">Photo de votre visage</h3>
                    {contact.facePhoto && (
                      <CheckCircle size={18} className="text-green-600 ml-auto" />
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-3">
                    Prenez un selfie clair de votre visage pour vérification d'identité.
                  </p>

                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#1B4D3E] transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      capture="user"
                      onChange={handleFacePhotoUpload}
                      className="hidden"
                      id="face-photo-upload"
                    />
                    <label htmlFor="face-photo-upload" className="cursor-pointer">
                      {contact.facePhoto ? (
                        <div className="space-y-2">
                          <img
                            src={URL.createObjectURL(contact.facePhoto)}
                            alt="Photo de profil"
                            className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-green-500"
                          />
                          <div className="flex items-center justify-center gap-2 text-green-600">
                            <CheckCircle size={20} />
                            <span className="font-semibold text-sm">{contact.facePhoto.name}</span>
                          </div>
                          <p className="text-xs text-gray-500">Cliquez pour changer la photo</p>
                        </div>
                      ) : (
                        <>
                          <Camera size={48} className="mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600 font-semibold">
                            Prendre une photo ou sélectionner un fichier
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Assurez-vous que votre visage est clairement visible
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* ÉTAPE 2 : IDENTITÉ */}
            {currentStep === "identity" && (
              <div className="space-y-6">
                {/* Identity Type Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Type de document <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        setIdentityType("CIN");
                        setIdentity({ ...identity, type: "CIN" });
                      }}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        identityType === "CIN"
                          ? "border-[#1B4D3E] bg-[#1B4D3E]/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <FileText className={identityType === "CIN" ? "text-[#1B4D3E]" : "text-gray-400"} />
                      <p className="text-sm font-semibold mt-2">Carte d'identité biométrique</p>
                    </button>
                    <button
                      onClick={() => {
                        setIdentityType("Passport");
                        setIdentity({ ...identity, type: "Passport" });
                      }}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        identityType === "Passport"
                          ? "border-[#1B4D3E] bg-[#1B4D3E]/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <FileText className={identityType === "Passport" ? "text-[#1B4D3E]" : "text-gray-400"} />
                      <p className="text-sm font-semibold mt-2">Passeport</p>
                    </button>
                  </div>
                </div>

                {/* Identity Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Numéro de document <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={identity.documentNumber}
                      onChange={(e) => setIdentity({ ...identity, documentNumber: e.target.value })}
                      placeholder={identityType === "CIN" ? "Ex: 123456789012345" : "Ex: 12AB34567"}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nom complet <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={identity.fullName}
                      onChange={(e) => setIdentity({ ...identity, fullName: e.target.value })}
                      placeholder="Nom et prénom"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date de naissance <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={identity.dateOfBirth}
                      onChange={(e) => setIdentity({ ...identity, dateOfBirth: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Lieu de naissance
                    </label>
                    <input
                      type="text"
                      value={identity.placeOfBirth}
                      onChange={(e) => setIdentity({ ...identity, placeOfBirth: e.target.value })}
                      placeholder="Ville, Wilaya"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date de délivrance
                    </label>
                    <input
                      type="date"
                      value={identity.issueDate}
                      onChange={(e) => setIdentity({ ...identity, issueDate: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date d'expiration
                    </label>
                    <input
                      type="date"
                      value={identity.expiryDate}
                      onChange={(e) => setIdentity({ ...identity, expiryDate: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Upload Document */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Scanner ou photographier votre document <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#1B4D3E] transition-colors">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleIdentityFileUpload}
                      className="hidden"
                      id="identity-upload"
                    />
                    <label htmlFor="identity-upload" className="cursor-pointer">
                      {identity.document ? (
                        <div className="flex items-center justify-center gap-2 text-green-600">
                          <CheckCircle size={24} />
                          <span className="font-semibold">{identity.document.name}</span>
                        </div>
                      ) : (
                        <>
                          <Camera size={48} className="mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">
                            Cliquez pour télécharger ou prendre une photo
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Formats acceptés: JPG, PNG, PDF (Max 5 MB)
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* Alert */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
                  <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold">Vos données sont sécurisées</p>
                    <p className="text-xs mt-1">
                      Ces informations sont obligatoires pour valider votre identité et sécuriser les transactions.
                      Elles sont cryptées et conformes à la réglementation algérienne.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ÉTAPE 3 : BANQUE */}
            {currentStep === "bank" && (
              <div className="space-y-6">
                {/* Bank Type Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Type de compte <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        setCurrentBankType("CCP");
                        setCurrentBankInfo({
                          type: "CCP",
                          accountNumber: "",
                          accountKey: "",
                          ownerName: "",
                          proofDocument: null,
                        });
                      }}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        currentBankType === "CCP"
                          ? "border-[#1B4D3E] bg-[#1B4D3E]/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-2xl mb-2">📮</div>
                      <p className="text-sm font-semibold">Compte CCP</p>
                      <p className="text-xs text-gray-500 mt-1">Algérie Poste</p>
                    </button>
                    <button
                      onClick={() => {
                        setCurrentBankType("Bank");
                        setCurrentBankInfo({
                          type: "Bank",
                          accountNumber: "",
                          bankName: "",
                          rib: "",
                          ownerName: "",
                          proofDocument: null,
                        });
                      }}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        currentBankType === "Bank"
                          ? "border-[#1B4D3E] bg-[#1B4D3E]/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-2xl mb-2">🏦</div>
                      <p className="text-sm font-semibold">Compte Bancaire</p>
                      <p className="text-xs text-gray-500 mt-1">CIB, BADR, BNA, etc.</p>
                    </button>
                  </div>
                </div>

                {/* Bank Form */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-4">
                    Ajouter un {currentBankType === "CCP" ? "compte CCP" : "compte bancaire"}
                  </h4>

                  <div className="space-y-4">
                    {currentBankType === "Bank" && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Nom de la banque <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={currentBankInfo.bankName || ""}
                          onChange={(e) => setCurrentBankInfo({ ...currentBankInfo, bankName: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent"
                        >
                          <option value="">Sélectionner une banque</option>
                          <option value="BNA">Banque Nationale d'Algérie (BNA)</option>
                          <option value="BEA">Banque Extérieure d'Algérie (BEA)</option>
                          <option value="CPA">Crédit Populaire d'Algérie (CPA)</option>
                          <option value="BADR">Banque d'Agriculture et de Développement Rural (BADR)</option>
                          <option value="BDL">Banque de Développement Local (BDL)</option>
                          <option value="CNEP">CNEP Banque</option>
                          <option value="AGB">AGB (Algerian Gulf Bank)</option>
                          <option value="BNP Paribas">BNP Paribas El Djazair</option>
                          <option value="Société Générale">Société Générale Algérie</option>
                          <option value="ABC">Arab Banking Corporation (ABC)</option>
                          <option value="AL SALAM">AL SALAM Bank Algeria</option>
                          <option value="Al Baraka">Al Baraka Bank Algeria</option>
                        </select>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Numéro de compte {currentBankType === "CCP" && <span className="text-gray-400 font-normal">(10 chiffres)</span>} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={currentBankInfo.accountNumber}
                          onChange={(e) => {
                            const v = currentBankType === "CCP"
                              ? e.target.value.replace(/\D/g, "").slice(0, 10)
                              : e.target.value;
                            setCurrentBankInfo({ ...currentBankInfo, accountNumber: v });
                          }}
                          placeholder={currentBankType === "CCP" ? "Ex: 1234567890" : "Ex: 007 123456789"}
                          maxLength={currentBankType === "CCP" ? 10 : undefined}
                          className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent font-mono ${
                            currentBankType === "CCP" && currentBankInfo.accountNumber && currentBankInfo.accountNumber.length !== 10
                              ? "border-red-400 bg-red-50"
                              : "border-gray-300"
                          }`}
                        />
                        {currentBankType === "CCP" && (
                          <div className="flex justify-end mt-1">
                            <span className={`text-xs font-semibold ${currentBankInfo.accountNumber.length === 10 ? "text-green-600" : "text-gray-400"}`}>
                              {currentBankInfo.accountNumber.length}/10
                            </span>
                          </div>
                        )}
                      </div>

                      {currentBankType === "CCP" ? (
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Clé CCP <span className="text-gray-400 font-normal">(2 chiffres)</span> <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={currentBankInfo.accountKey || ""}
                            onChange={(e) => {
                              const v = e.target.value.replace(/\D/g, "").slice(0, 2);
                              setCurrentBankInfo({ ...currentBankInfo, accountKey: v });
                            }}
                            placeholder="Ex: 12"
                            maxLength={2}
                            className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent font-mono ${
                              currentBankInfo.accountKey && currentBankInfo.accountKey.length !== 2
                                ? "border-red-400 bg-red-50"
                                : "border-gray-300"
                            }`}
                          />
                          <div className="flex justify-end mt-1">
                            <span className={`text-xs font-semibold ${(currentBankInfo.accountKey || "").length === 2 ? "text-green-600" : "text-gray-400"}`}>
                              {(currentBankInfo.accountKey || "").length}/2
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            RIB (20 chiffres) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={currentBankInfo.rib || ""}
                            onChange={(e) => setCurrentBankInfo({ ...currentBankInfo, rib: e.target.value })}
                            placeholder="Ex: 00712345678901234567"
                            maxLength={20}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nom du titulaire <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={currentBankInfo.ownerName}
                        onChange={(e) => setCurrentBankInfo({ ...currentBankInfo, ownerName: e.target.value })}
                        placeholder="Nom complet du titulaire"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent"
                      />
                    </div>

                    {/* Upload Bank Document */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Justificatif (RIP / Relevé de compte)
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-[#1B4D3E] transition-colors">
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleBankFileUpload}
                          className="hidden"
                          id="bank-upload"
                        />
                        <label htmlFor="bank-upload" className="cursor-pointer">
                          {currentBankInfo.proofDocument ? (
                            <div className="flex items-center justify-center gap-2 text-green-600">
                              <CheckCircle size={20} />
                              <span className="text-sm font-semibold">{currentBankInfo.proofDocument.name}</span>
                            </div>
                          ) : (
                            <>
                              <Upload size={32} className="mx-auto text-gray-400 mb-1" />
                              <p className="text-xs text-gray-600">Cliquez pour télécharger</p>
                            </>
                          )}
                        </label>
                      </div>
                    </div>

                    <button
                      onClick={handleAddBankAccount}
                      className="w-full bg-[#C9924A] text-white py-2.5 rounded-xl font-semibold hover:bg-[#b88440] transition-colors"
                    >
                      + Ajouter ce compte
                    </button>
                  </div>
                </div>

                {/* Added Bank Accounts List */}
                {bankAccounts.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">
                      Comptes ajoutés ({bankAccounts.length})
                    </h4>
                    <div className="space-y-3">
                      {bankAccounts.map((account, index) => (
                        <div
                          key={index}
                          className="bg-white border border-gray-200 rounded-xl p-4 flex items-start justify-between"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xl">
                                {account.type === "CCP" ? "📮" : "🏦"}
                              </span>
                              <span className="font-semibold text-gray-800">
                                {account.type === "CCP" ? "CCP" : account.bankName}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              Compte: {account.accountNumber}
                              {account.accountKey && ` - Clé: ${account.accountKey}`}
                            </p>
                            <p className="text-sm text-gray-600">
                              Titulaire: {account.ownerName}
                            </p>
                            {account.rib && (
                              <p className="text-xs text-gray-500 mt-1">RIB: {account.rib}</p>
                            )}
                          </div>
                          <button
                            onClick={() => handleRemoveBankAccount(index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="bg-gray-50 p-6 flex gap-3 border-t border-gray-200">
            {currentStep !== "contact" && (
              <button
                onClick={() => {
                  if (currentStep === "identity") setCurrentStep("contact");
                  if (currentStep === "bank") setCurrentStep("identity");
                }}
                className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                ← Retour
              </button>
            )}
            <button
              onClick={() => {
                if (currentStep === "contact") handleContactSubmit();
                else if (currentStep === "identity") handleIdentitySubmit();
                else handleFinalSubmit();
              }}
              className="flex-1 bg-[#1B4D3E] text-white py-2.5 rounded-xl font-semibold hover:bg-[#2d6b55] transition-colors"
            >
              {currentStep === "bank" ? "Enregistrer mes informations" : "Suivant →"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

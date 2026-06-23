import { useState, useRef } from "react";
import { useApp } from "../context/AppContext";
import { ProfileInfoModal } from "../components/ProfileInfoModal";
import {
  User, FileText, CheckCircle, AlertCircle, Shield,
  Edit, Mail, Phone, MapPin, Lock, Camera, Eye, EyeOff, ChevronRight, CreditCard,
  Upload, Clock, XCircle, Printer, X, FileCheck2
} from "lucide-react";
import { profilApi } from "../../services/api";
import { STORAGE_URL } from "../../services/storageUrl";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "motion/react";

const WILAYAS = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra",
  "Béchar", "Blida", "Bouira", "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret",
  "Tizi Ouzou", "Alger", "Djelfa", "Jijel", "Sétif", "Saïda", "Skikda",
  "Sidi Bel Abbès", "Annaba", "Guelma", "Constantine", "Médéa", "Mostaganem",
  "M'Sila", "Mascara", "Ouargla", "Oran", "El Bayadh", "Illizi",
  "Bordj Bou Arréridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt",
  "El Oued", "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Aïn Defla",
  "Naâma", "Aïn Témouchent", "Ghardaïa", "Relizane", "Timimoun",
  "Bordj Badji Mokhtar", "Ouled Djellal", "Béni Abbès", "In Salah",
  "In Guezzam", "Touggourt", "Djanet", "El M'Ghair", "El Meniaa"
];

type NavSection = "profil" | "securite" | "verification";

export function ProfilePage() {
  const { currentUser, setCurrentUser } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<NavSection>("profil");
  const [contratPlatOpen, setContratPlatOpen] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      const res = await profilApi.uploadPhoto(file);
      const raw: string = res.data.photo_profil;
      const photoUrl = STORAGE_URL + raw;
      setCurrentUser({ ...currentUser!, avatar: photoUrl });
      toast.success("Photo de profil mise à jour !");
    } catch {
      toast.error("Erreur lors du chargement de la photo");
    } finally {
      setAvatarUploading(false);
      e.target.value = "";
    }
  };

  // Editable profile fields
  const [editName, setEditName] = useState(currentUser?.name || "");
  const [editPhone, setEditPhone] = useState(currentUser?.phone || "");
  const [editWilaya, setEditWilaya] = useState(currentUser?.wilaya || "");
  const [editRib, setEditRib] = useState(currentUser?.rib_barid || "");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // Security fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [pwdSaved, setPwdSaved] = useState(false);

  // Verification form states
  const [typeDocument, setTypeDocument] = useState<"cin" | "passeport">("cin");
  const [cinNumero, setCinNumero] = useState("");
  const [cinDateDelivrance, setCinDateDelivrance] = useState("");
  const [cinDateExpiration, setCinDateExpiration] = useState("");
  const [cinRecto, setCinRecto] = useState<File | null>(null);
  const [cinVerso, setCinVerso] = useState<File | null>(null);
  const [selfiePhoto, setSelfiePhoto] = useState<File | null>(null);
  const [ccpPhoto, setCcpPhoto] = useState<File | null>(null);
  const [docBoutiquePhoto, setDocBoutiquePhoto] = useState<File | null>(null);
  const [verifSubmitting, setVerifSubmitting] = useState(false);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#FAF6EF] pt-20 flex items-center justify-center">
        <p className="text-gray-600">Vous devez être connecté pour accéder à votre profil.</p>
      </div>
    );
  }

  const initials = (currentUser.name || "Utilisateur")
    .split(" ")
    .map((n) => n[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase() || "US";

  const roleLabel = currentUser.role === "owner" ? "Propriétaire" : currentUser.role === "admin" ? "Admin" : "Locataire";

  const handleSaveProfile = async () => {
    if (editRib && !/^[0-9]{20}$/.test(editRib)) {
      toast.error("Le RIB Barid Mobile doit contenir exactement 20 chiffres");
      return;
    }
    setProfileSaving(true);
    try {
      await profilApi.modifier({
        nom: editName,
        telephone: editPhone,
        wilaya: editWilaya,
        rib_barid: editRib || undefined,
      });
      setCurrentUser({ ...currentUser!, name: editName, phone: editPhone, wilaya: editWilaya, rib_barid: editRib || undefined });
      setProfileSaved(true);
      toast.success("Profil mis à jour !");
      setTimeout(() => setProfileSaved(false), 2500);
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setProfileSaving(false);
    }
  };

  const handleSavePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    try {
      await profilApi.changerMotDePasse({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPwdSaved(true);
      toast.success("Mot de passe mis à jour !");
      setTimeout(() => setPwdSaved(false), 2500);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Erreur lors du changement de mot de passe";
      toast.error(msg);
    }
  };

  const handleSoumettreVerification = async () => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const docLabel = typeDocument === "cin" ? "CIN" : "Passeport";
    const isBoutique = currentUser.type_proprietaire === "boutique";
    if (!cinNumero.trim()) { toast.error("Veuillez entrer votre NIN (18 chiffres)"); return; }
    if (cinNumero.replace(/\D/g, "").length !== 18) { toast.error("Le NIN doit contenir exactement 18 chiffres"); return; }
    if (!cinDateDelivrance) { toast.error("Veuillez entrer la date de délivrance"); return; }
    if (new Date(cinDateDelivrance) >= today) { toast.error("La date de délivrance doit être antérieure à aujourd'hui"); return; }
    if (!cinDateExpiration) { toast.error("Veuillez entrer la date d'expiration"); return; }
    if (new Date(cinDateExpiration) <= today) { toast.error("La date d'expiration doit être postérieure à aujourd'hui"); return; }
    if (!cinRecto) { toast.error(`Veuillez uploader la photo recto de votre ${docLabel}`); return; }
    if (!cinVerso) { toast.error(`Veuillez uploader la photo verso de votre ${docLabel}`); return; }
    if (!selfiePhoto) { toast.error(`Veuillez uploader un selfie avec votre ${docLabel}`); return; }
    if (!ccpPhoto) { toast.error("Veuillez uploader la photo de votre chèque barré CCP"); return; }
    if (isBoutique && !docBoutiquePhoto) { toast.error("Veuillez uploader votre document de boutique (carte d'artisanat, registre de commerce, etc.)"); return; }
    setVerifSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("type_document", typeDocument);
      formData.append("cin_numero", cinNumero.replace(/\D/g, ""));
      formData.append("cin_date_delivrance", cinDateDelivrance);
      formData.append("cin_date_expiration", cinDateExpiration);
      formData.append("cin_photo_recto", cinRecto);
      formData.append("cin_photo_verso", cinVerso);
      formData.append("selfie_photo", selfiePhoto);
      formData.append("ccp_photo", ccpPhoto);
      if (isBoutique && docBoutiquePhoto) formData.append("doc_boutique", docBoutiquePhoto);
      await profilApi.soumettreVerification(formData);
      setCurrentUser({ ...currentUser!, statut_verification: "en_attente" });
      toast.success("Demande de vérification envoyée ! Elle sera traitée sous 24h.");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Erreur lors de l'envoi";
      toast.error(msg);
    } finally {
      setVerifSubmitting(false);
    }
  };

  const navItems: { id: NavSection; label: string; icon: React.ReactNode }[] = [
    { id: "profil", label: "Mon profil", icon: <User size={18} /> },
    { id: "securite", label: "Sécurité", icon: <Lock size={18} /> },
    ...(currentUser.role !== "admin"
      ? [{ id: "verification" as NavSection, label: "Vérification ID", icon: <FileText size={18} /> }]
      : []),
  ];

  return (
    <div className="min-h-screen bg-[#FAF6EF] pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Profile header card ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 flex items-center gap-5">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt="Photo de profil"
                className="w-20 h-20 rounded-full object-cover border-4 border-[#1B4D3E]"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-[#1B4D3E] flex items-center justify-center border-4 border-[#1B4D3E]">
                <span className="text-white text-2xl font-bold">{initials}</span>
              </div>
            )}
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <button
              onClick={() => avatarInputRef.current?.click()}
              disabled={avatarUploading}
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#C9924A] text-white rounded-full flex items-center justify-center shadow hover:bg-[#b88440] transition-colors disabled:opacity-60"
              title="Changer la photo"
            >
              {avatarUploading ? (
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Camera size={13} />
              )}
            </button>
          </div>

          {/* Name & info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-gray-900 uppercase truncate">{currentUser.name}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{currentUser.email}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#1B4D3E]/10 text-[#1B4D3E]">
                {roleLabel}
              </span>
              {currentUser.verified ? (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                  <CheckCircle size={12} />
                  Vérifié
                </span>
              ) : (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                  <AlertCircle size={12} />
                  Non vérifié
                </span>
              )}
            </div>
          </div>

          {/* Modifier button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors flex-shrink-0"
          >
            <Edit size={15} />
            Modifier
          </button>
        </div>

        {/* ── Two-column layout ── */}
        <div className="flex gap-6 items-start">

          {/* Sidebar */}
          <aside className="w-56 flex-shrink-0 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-5 py-4 text-sm font-medium transition-colors border-l-4 ${
                  activeSection === item.id
                    ? "border-[#1B4D3E] bg-[#1B4D3E]/5 text-[#1B4D3E]"
                    : "border-transparent text-gray-600 hover:bg-gray-50"
                }`}
              >
                {item.icon}
                <span className="flex-1 text-left">{item.label}</span>
                <ChevronRight size={14} className="opacity-40" />
              </button>
            ))}
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">

            {/* ── Mon profil ── */}
            {activeSection === "profil" && (
              <motion.div
                key="profil"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-6">Informations personnelles</h3>

                <div className="space-y-5">
                  {/* Nom complet */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <User size={15} className="text-gray-400" />
                        Nom complet
                      </span>
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent bg-gray-50"
                    />
                  </div>

                  {/* Email (read-only) */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <Mail size={15} className="text-gray-400" />
                        Email
                      </span>
                    </label>
                    <input
                      type="email"
                      value={currentUser.email}
                      disabled
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      L'email ne peut pas être modifié ici.{" "}
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="text-[#1B4D3E] underline"
                      >
                        Changer via Sécurité
                      </button>
                    </p>
                  </div>

                  {/* Téléphone */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <Phone size={15} className="text-gray-400" />
                        Téléphone
                      </span>
                    </label>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="Ex: 0771234567"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent bg-gray-50"
                    />
                  </div>

                  {/* Wilaya */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <MapPin size={15} className="text-gray-400" />
                        Wilaya
                      </span>
                    </label>
                    <select
                      value={editWilaya}
                      onChange={(e) => setEditWilaya(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent bg-gray-50 text-gray-700"
                    >
                      <option value="">Sélectionner votre wilaya</option>
                      {WILAYAS.map((w) => (
                        <option key={w} value={w}>{w}</option>
                      ))}
                    </select>
                  </div>

                  {/* RIB Barid Mobile (proprietaire uniquement) */}
                  {currentUser.role === "owner" && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                        <span className="flex items-center gap-1.5">
                          <CreditCard size={15} className="text-gray-400" />
                          RIB Barid Mobile <span className="text-gray-400 font-normal">(20 chiffres)</span>
                        </span>
                      </label>
                      <input
                        type="text"
                        value={editRib}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, "").slice(0, 20);
                          setEditRib(v);
                        }}
                        placeholder="00799999123456789012"
                        maxLength={20}
                        className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent bg-gray-50 font-mono tracking-wider ${
                          editRib && editRib.length !== 20 ? "border-red-300" : "border-gray-200"
                        }`}
                      />
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-gray-400">
                          Utilisé par l'admin pour vous virer vos revenus après chaque location
                        </p>
                        <span className={`text-xs font-semibold ${editRib.length === 20 ? "text-green-600" : "text-gray-400"}`}>
                          {editRib.length}/20
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Contrat d'adhésion — propriétaire uniquement */}
                  {currentUser.role === "owner" && (
                    <div className="bg-gradient-to-r from-[#1B4D3E] to-[#2d6b55] rounded-2xl p-5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                          <FileCheck2 size={20} className="text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-bold text-sm">Contrat d'adhésion plateforme</p>
                          <p className="text-white/70 text-xs mt-0.5 truncate">
                            Commission {currentUser.type_proprietaire === "boutique" ? "15%" : "19%"} — Durée indéterminée
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setContratPlatOpen(true)}
                        className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs px-4 py-2 rounded-xl flex-shrink-0 transition-colors"
                        style={{ fontWeight: 600 }}
                      >
                        <FileText size={14} />
                        Voir le contrat
                      </button>
                    </div>
                  )}

                  {/* Save button */}
                  <button
                    onClick={handleSaveProfile}
                    disabled={profileSaving}
                    className="w-full bg-[#1B4D3E] text-white py-3 rounded-xl font-semibold hover:bg-[#2d6b55] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {profileSaved ? (
                      <>
                        <CheckCircle size={18} />
                        Sauvegardé !
                      </>
                    ) : profileSaving ? (
                      "Sauvegarde..."
                    ) : (
                      "Sauvegarder"
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── Sécurité ── */}
            {activeSection === "securite" && (
              <motion.div
                key="securite"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-6">Sécurité du compte</h3>

                <div className="space-y-5">
                  {/* Current password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                      Mot de passe actuel
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPwd ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent bg-gray-50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPwd(!showCurrentPwd)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* New password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                      Nouveau mot de passe
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPwd ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent bg-gray-50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPwd(!showNewPwd)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                      Confirmer le mot de passe
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPwd ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent bg-gray-50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleSavePassword}
                    className="w-full bg-[#1B4D3E] text-white py-3 rounded-xl font-semibold hover:bg-[#2d6b55] transition-colors flex items-center justify-center gap-2"
                  >
                    {pwdSaved ? (
                      <>
                        <CheckCircle size={18} />
                        Mot de passe mis à jour !
                      </>
                    ) : (
                      "Mettre à jour le mot de passe"
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── Vérification ID ── */}
            {activeSection === "verification" && currentUser.role !== "admin" && (
              <motion.div
                key="verification"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Shield size={22} className="text-[#1B4D3E]" />
                    <h3 className="text-lg font-bold text-gray-900">Vérification d'identité</h3>
                  </div>
                  {currentUser.statut_verification === "verifie" && (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                      <CheckCircle size={12} /> Vérifié
                    </span>
                  )}
                  {currentUser.statut_verification === "en_attente" && (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                      <Clock size={12} /> En cours d'examen
                    </span>
                  )}
                  {currentUser.statut_verification === "rejete" && (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                      <XCircle size={12} /> Rejeté
                    </span>
                  )}
                  {currentUser.statut_verification === "non_soumis" && (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                      <AlertCircle size={12} /> Non soumis
                    </span>
                  )}
                </div>

                {/* VERIFIE */}
                {currentUser.statut_verification === "verifie" && (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={32} className="text-green-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-lg mb-1">Identité vérifiée</h4>
                    <p className="text-sm text-gray-500">Votre identité a été confirmée par notre équipe. Vous bénéficiez d'un accès complet à la plateforme.</p>
                  </div>
                )}

                {/* EN ATTENTE */}
                {currentUser.statut_verification === "en_attente" && (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock size={32} className="text-amber-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-lg mb-1">Vérification en cours</h4>
                    <p className="text-sm text-gray-500">Votre demande a bien été reçue. Notre équipe l'examinera sous 24 à 48 heures. Vous serez notifié du résultat.</p>
                  </div>
                )}

                {/* REJETE ou NON_SOUMIS → afficher le formulaire */}
                {(currentUser.statut_verification === "non_soumis" || currentUser.statut_verification === "rejete") && (
                  <div className="space-y-5">
                    {currentUser.statut_verification === "rejete" && (
                      <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <XCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-red-700">Vérification rejetée</p>
                          {currentUser.motif_rejet ? (
                            <p className="text-xs text-red-600 mt-0.5">Motif : {currentUser.motif_rejet}</p>
                          ) : (
                            <p className="text-xs text-red-600 mt-0.5">Vérifiez la qualité des photos et soumettez à nouveau.</p>
                          )}
                        </div>
                      </div>
                    )}

                    <p className="text-sm text-gray-600">
                      Pour utiliser toutes les fonctionnalités de KASEWA.DZ, veuillez fournir une copie de votre document d'identité et un selfie.
                    </p>

                    {/* Type de document */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Type de document
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setTypeDocument("cin")}
                          className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border-2 text-sm font-semibold transition-colors ${
                            typeDocument === "cin"
                              ? "border-[#1B4D3E] bg-[#1B4D3E]/10 text-[#1B4D3E]"
                              : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300"
                          }`}
                        >
                          <FileText size={16} />
                          Carte d'identité
                        </button>
                        <button
                          type="button"
                          onClick={() => setTypeDocument("passeport")}
                          className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border-2 text-sm font-semibold transition-colors ${
                            typeDocument === "passeport"
                              ? "border-[#1B4D3E] bg-[#1B4D3E]/10 text-[#1B4D3E]"
                              : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300"
                          }`}
                        >
                          <FileText size={16} />
                          Passeport
                        </button>
                      </div>
                    </div>

                    {/* NIN — commun CIN et Passeport */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        NIN — Numéro d'Identification National
                        <span className="text-xs font-normal text-gray-400 ml-2">(18 chiffres, identique sur CIN et Passeport)</span>
                      </label>
                      <input
                        type="text"
                        value={cinNumero}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, "").slice(0, 18);
                          setCinNumero(v);
                        }}
                        placeholder="Ex: 123456789012345678"
                        maxLength={18}
                        className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] bg-gray-50 font-mono tracking-wider ${
                          cinNumero && cinNumero.length !== 18 ? "border-red-400" : "border-gray-200"
                        }`}
                      />
                      <div className="flex justify-between mt-1">
                        <p className="text-xs text-gray-400">Même numéro sur votre CIN et votre Passeport</p>
                        <span className={`text-xs font-semibold ${cinNumero.length === 18 ? "text-green-600" : "text-gray-400"}`}>
                          {cinNumero.length}/18
                        </span>
                      </div>
                    </div>

                    {/* Dates CIN */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Date de délivrance
                        </label>
                        <input
                          type="date"
                          value={cinDateDelivrance}
                          max={new Date().toISOString().split("T")[0]}
                          onChange={(e) => setCinDateDelivrance(e.target.value)}
                          className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] bg-gray-50 ${
                            cinDateDelivrance && new Date(cinDateDelivrance) >= new Date(new Date().setHours(0,0,0,0))
                              ? "border-red-400 bg-red-50"
                              : "border-gray-200"
                          }`}
                        />
                        <p className="text-xs text-gray-400 mt-1">Doit être avant aujourd'hui</p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Date d'expiration
                        </label>
                        <input
                          type="date"
                          value={cinDateExpiration}
                          min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
                          onChange={(e) => setCinDateExpiration(e.target.value)}
                          className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] bg-gray-50 ${
                            cinDateExpiration && new Date(cinDateExpiration) <= new Date(new Date().setHours(0,0,0,0))
                              ? "border-red-400 bg-red-50"
                              : "border-gray-200"
                          }`}
                        />
                        <p className="text-xs text-gray-400 mt-1">Doit être après aujourd'hui</p>
                      </div>
                    </div>

                    {/* Document Recto */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        {typeDocument === "cin" ? "Photo CIN — Recto (face avant)" : "Photo Passeport — Page principale"}
                      </label>
                      <label className={`flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                        cinRecto ? "border-[#1B4D3E] bg-[#1B4D3E]/5" : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                      }`}>
                        <Upload size={20} className={cinRecto ? "text-[#1B4D3E]" : "text-gray-400"} />
                        <span className="text-xs mt-1.5 text-gray-500 text-center px-4">
                          {cinRecto ? cinRecto.name : "Cliquer pour sélectionner (JPG, PNG — max 5 Mo)"}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => setCinRecto(e.target.files?.[0] || null)}
                        />
                      </label>
                    </div>

                    {/* Document Verso */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        {typeDocument === "cin" ? "Photo CIN — Verso (face arrière)" : "Photo Passeport — Page avec signature"}
                      </label>
                      <label className={`flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                        cinVerso ? "border-[#1B4D3E] bg-[#1B4D3E]/5" : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                      }`}>
                        <Upload size={20} className={cinVerso ? "text-[#1B4D3E]" : "text-gray-400"} />
                        <span className="text-xs mt-1.5 text-gray-500 text-center px-4">
                          {cinVerso ? cinVerso.name : "Cliquer pour sélectionner (JPG, PNG — max 5 Mo)"}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => setCinVerso(e.target.files?.[0] || null)}
                        />
                      </label>
                    </div>

                    {/* Selfie */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        {typeDocument === "cin" ? "Selfie avec votre CIN" : "Selfie avec votre Passeport"}
                      </label>
                      <label className={`flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                        selfiePhoto ? "border-[#1B4D3E] bg-[#1B4D3E]/5" : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                      }`}>
                        <Camera size={20} className={selfiePhoto ? "text-[#1B4D3E]" : "text-gray-400"} />
                        <span className="text-xs mt-1.5 text-gray-500 text-center px-4">
                          {selfiePhoto ? selfiePhoto.name : `Photo de vous tenant votre ${typeDocument === "cin" ? "CIN" : "Passeport"} bien visible`}
                        </span>
                        <input type="file" accept="image/*" className="hidden"
                          onChange={(e) => setSelfiePhoto(e.target.files?.[0] || null)} />
                      </label>
                    </div>

                    {/* Séparateur bancaire */}
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <CreditCard size={16} className="text-[#C9924A]" />
                        Document bancaire CCP
                      </p>

                      {/* Chèque barré CCP */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Photo du chèque barré CCP <span className="text-red-500">*</span>
                          <span className="text-xs font-normal text-gray-400 ml-2">(recto du chèque avec votre nom et numéro de compte)</span>
                        </label>
                        <label className={`flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                          ccpPhoto ? "border-[#C9924A] bg-[#C9924A]/5" : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                        }`}>
                          <Upload size={20} className={ccpPhoto ? "text-[#C9924A]" : "text-gray-400"} />
                          <span className="text-xs mt-1.5 text-gray-500 text-center px-4">
                            {ccpPhoto ? ccpPhoto.name : "Photo du chèque barré CCP (JPG, PNG — max 5 Mo)"}
                          </span>
                          <input type="file" accept="image/*" className="hidden"
                            onChange={(e) => setCcpPhoto(e.target.files?.[0] || null)} />
                        </label>
                        <p className="text-xs text-gray-400 mt-1">Permet à l'admin de vérifier votre numéro de compte CCP pour les virements</p>
                      </div>
                    </div>

                    {/* Document boutique — uniquement pour les boutiques */}
                    {currentUser.type_proprietaire === "boutique" && (
                      <div className="border-t border-gray-100 pt-4">
                        <p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                          <FileText size={16} className="text-[#1B4D3E]" />
                          Document professionnel boutique
                        </p>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Carte d'artisanat / Registre de commerce <span className="text-red-500">*</span>
                          </label>
                          <label className={`flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                            docBoutiquePhoto ? "border-[#1B4D3E] bg-[#1B4D3E]/5" : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                          }`}>
                            <FileText size={20} className={docBoutiquePhoto ? "text-[#1B4D3E]" : "text-gray-400"} />
                            <span className="text-xs mt-1.5 text-gray-500 text-center px-4">
                              {docBoutiquePhoto ? docBoutiquePhoto.name : "Carte d'artisanat, RC ou tout document officiel de votre boutique"}
                            </span>
                            <input type="file" accept="image/*,.pdf" className="hidden"
                              onChange={(e) => setDocBoutiquePhoto(e.target.files?.[0] || null)} />
                          </label>
                          <p className="text-xs text-gray-400 mt-1">Exemples : carte d'artisanat, registre de commerce, extrait CNRC</p>
                        </div>
                      </div>
                    )}

                    {/* Récapitulatif des documents requis */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <p className="text-blue-800 text-xs font-bold mb-2">📋 Documents requis pour la vérification :</p>
                      <ul className="text-blue-700 text-xs space-y-1">
                        <li className={`flex items-center gap-1.5 ${cinRecto ? "line-through text-blue-400" : ""}`}>
                          {cinRecto ? "✅" : "⬜"} CIN / Passeport — Recto
                        </li>
                        <li className={`flex items-center gap-1.5 ${cinVerso ? "line-through text-blue-400" : ""}`}>
                          {cinVerso ? "✅" : "⬜"} CIN / Passeport — Verso
                        </li>
                        <li className={`flex items-center gap-1.5 ${selfiePhoto ? "line-through text-blue-400" : ""}`}>
                          {selfiePhoto ? "✅" : "⬜"} Selfie avec le document
                        </li>
                        <li className={`flex items-center gap-1.5 ${ccpPhoto ? "line-through text-blue-400" : ""}`}>
                          {ccpPhoto ? "✅" : "⬜"} Chèque barré CCP
                        </li>
                        {currentUser.type_proprietaire === "boutique" && (
                          <li className={`flex items-center gap-1.5 ${docBoutiquePhoto ? "line-through text-blue-400" : ""}`}>
                            {docBoutiquePhoto ? "✅" : "⬜"} Document boutique (carte artisanat, RC...)
                          </li>
                        )}
                      </ul>
                    </div>

                    <button
                      onClick={handleSoumettreVerification}
                      disabled={verifSubmitting}
                      className="w-full bg-[#1B4D3E] text-white py-3 rounded-xl font-semibold hover:bg-[#2d6b55] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {verifSubmitting ? (
                        "Envoi en cours..."
                      ) : (
                        <>
                          <Upload size={18} />
                          Soumettre ma vérification
                        </>
                      )}
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            </AnimatePresence>
          </div>
        </div>
      </div>

      <ProfileInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={() => setIsModalOpen(false)}
        initialEmail={currentUser.email}
        initialPhone={currentUser.phone || ""}
      />

      {/* Modal Contrat d'adhésion plateforme */}
      {contratPlatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 shrink-0">
              <h2 className="text-gray-900" style={{ fontWeight: 700 }}>Contrat d'adhésion — KASEWA.DZ</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const w = window.open("", "_blank", "width=900,height=700");
                    if (!w) return;
                    w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Contrat Plateforme</title>
                    <style>body{font-family:Arial,sans-serif;font-size:13px;color:#222;padding:40px;max-width:800px;margin:0 auto}
                    h1{color:#1B4D3E;font-size:20px;border-bottom:3px solid #C9924A;padding-bottom:12px;margin-bottom:20px}
                    h3{color:#1B4D3E;margin-top:20px;margin-bottom:8px}p{color:#555;margin-bottom:8px;line-height:1.6}
                    .box{background:#FAF6EF;border:2px solid #C9924A;border-radius:8px;padding:16px;margin:16px 0}
                    .parties{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:20px 0}
                    .partie{border:2px solid #1B4D3E;border-radius:8px;padding:14px}
                    .sign{display:grid;grid-template-columns:1fr 1fr;gap:30px;margin-top:30px}
                    .sign-box{border-top:2px solid #1B4D3E;padding-top:10px}
                    footer{text-align:center;margin-top:30px;padding-top:12px;border-top:1px solid #ddd;font-size:10px;color:#aaa}
                    @media print{@page{margin:15mm}}</style></head><body>
                    <h1>CONTRAT D'ADHÉSION À LA PLATEFORME KASEWA.DZ</h1>
                    <div class="box"><p><strong>N° :</strong> PLAT-${String(currentUser.id ?? "").padStart(6,"0")}</p>
                    <p><strong>Date :</strong> ${new Date().toLocaleDateString("fr-DZ",{day:"2-digit",month:"long",year:"numeric"})}</p></div>
                    <div class="parties">
                    <div class="partie"><h3>La Plateforme</h3><p><strong>KASEWA DZ SARL</strong></p><p>Tlemcen, Algérie</p><p>contact@kasewa.dz</p></div>
                    <div class="partie"><h3>Le Propriétaire</h3><p><strong>${currentUser.name}</strong></p><p>Type : ${currentUser.type_proprietaire === "boutique" ? "Boutique professionnelle" : "Investisseur particulier"}</p></div>
                    </div>
                    <h3>Article 1 — Objet</h3><p>Ce contrat régit les conditions dans lesquelles le propriétaire met à disposition des tenues traditionnelles algériennes en location via la plateforme numérique KASEWA.DZ.</p>
                    <h3>Article 2 — Obligations de la plateforme</h3><p>• Mettre à disposition un espace de publication d'annonces<br>• Assurer la mise en relation avec les locataires<br>• Gérer les litiges via un système de médiation neutre<br>• Verser les revenus nets dans les 5 jours ouvrés après confirmation de location</p>
                    <h3>Article 3 — Obligations du propriétaire</h3><p>• Fournir des informations exactes sur chaque tenue (photos, état, dimensions)<br>• Assurer la disponibilité des tenues aux dates annoncées<br>• Restituer la caution dans un délai de 48h après retour en bon état<br>• Respecter les prix annoncés sur la plateforme</p>
                    <h3>Article 4 — Commission plateforme</h3><p>La plateforme prélève une commission de <strong>${currentUser.type_proprietaire === "boutique" ? "15%" : "19%"}</strong> sur le montant de chaque location.</p>
                    <h3>Article 5 — Médiation et litiges</h3><p>En cas de litige avec un locataire, les parties s'engagent à recourir au système de médiation KASEWA.DZ avant tout recours judiciaire.</p>
                    <h3>Article 6 — Durée et résiliation</h3><p>Ce contrat est conclu pour une durée indéterminée. Chaque partie peut y mettre fin avec un préavis de 30 jours par voie électronique.</p>
                    <div class="sign"><div class="sign-box"><p><strong>Signature KASEWA.DZ</strong></p><p style="font-size:11px;color:#888">Lu et approuvé</p><div style="height:60px;border-bottom:1px dashed #aaa;margin-top:8px"></div></div>
                    <div class="sign-box"><p><strong>Signature du Propriétaire</strong></p><p style="font-size:11px;color:#888">Lu et approuvé</p><div style="height:60px;border-bottom:1px dashed #aaa;margin-top:8px"></div></div></div>
                    <footer>KASEWA.DZ — Plateforme de location de tenues traditionnelles algériennes — Tlemcen, Algérie</footer>
                    <script>window.onload=function(){window.print()}<\/script></body></html>`);
                    w.document.close();
                  }}
                  className="flex items-center gap-2 bg-[#1B4D3E] text-white px-4 py-2 rounded-xl text-sm hover:bg-[#2d6b55]"
                  style={{ fontWeight: 600 }}
                >
                  <Printer size={16} />Télécharger PDF
                </button>
                <button onClick={() => setContratPlatOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400">
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto flex-1 p-6 bg-gray-50">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 max-w-2xl mx-auto" style={{ fontFamily: "'Segoe UI', Arial, sans-serif", fontSize: "13px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "3px solid #C9924A", paddingBottom: "20px", marginBottom: "20px" }}>
                  <div>
                    <h1 style={{ color: "#1B4D3E", fontSize: "18px", fontWeight: 700 }}>CONTRAT D'ADHÉSION</h1>
                    <p style={{ color: "#C9924A", fontSize: "14px", fontWeight: 600, marginTop: "4px" }}>Plateforme KASEWA.DZ</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ color: "#888", fontSize: "11px" }}>N° PLAT-{String(currentUser.id ?? "").padStart(6, "0")}</p>
                    <p style={{ color: "#888", fontSize: "11px", marginTop: "2px" }}>
                      {new Date().toLocaleDateString("fr-DZ", { day: "2-digit", month: "long", year: "numeric" })}
                    </p>
                  </div>
                </div>

                <div style={{ background: "#FAF6EF", borderLeft: "4px solid #C9924A", padding: "12px 16px", marginBottom: "20px", fontStyle: "italic", color: "#666", fontSize: "12px", borderRadius: "4px" }}>
                  "En rejoignant KASEWA.DZ, vous contribuez à la valorisation du patrimoine vestimentaire algérien."
                  <div style={{ textAlign: "right", marginTop: "6px", fontSize: "11px", fontWeight: 600, color: "#1B4D3E" }}>— L'équipe KASEWA.DZ —</div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                  <div style={{ border: "2px solid #C9924A", borderRadius: "8px", padding: "14px", background: "#FAF6EF" }}>
                    <h3 style={{ color: "#1B4D3E", fontWeight: 700, fontSize: "12px", textTransform: "uppercase", borderBottom: "2px solid #C9924A", paddingBottom: "6px", marginBottom: "10px" }}>La Plateforme</h3>
                    <p style={{ fontWeight: 600, color: "#222", marginBottom: "4px" }}>KASEWA DZ SARL</p>
                    <p style={{ color: "#555", fontSize: "12px" }}>Tlemcen, Algérie</p>
                    <p style={{ color: "#555", fontSize: "12px" }}>contact@kasewa.dz</p>
                  </div>
                  <div style={{ border: "2px solid #1B4D3E", borderRadius: "8px", padding: "14px", background: "#fff" }}>
                    <h3 style={{ color: "#1B4D3E", fontWeight: 700, fontSize: "12px", textTransform: "uppercase", borderBottom: "2px solid #1B4D3E", paddingBottom: "6px", marginBottom: "10px" }}>Le Propriétaire</h3>
                    <p style={{ fontWeight: 600, color: "#222", marginBottom: "4px" }}>{currentUser.name}</p>
                    <p style={{ color: "#555", fontSize: "12px" }}>Type : {currentUser.type_proprietaire === "boutique" ? "Boutique professionnelle" : "Investisseur particulier"}</p>
                    <p style={{ color: "#555", fontSize: "12px" }}>Commission : {currentUser.type_proprietaire === "boutique" ? "15%" : "19%"}</p>
                  </div>
                </div>

                {[
                  { titre: "Article 1 — Objet", texte: "Ce contrat régit les conditions dans lesquelles le propriétaire met à disposition des tenues traditionnelles algériennes en location via la plateforme numérique KASEWA.DZ." },
                  { titre: "Article 2 — Obligations de la plateforme", texte: "• Mettre à disposition un espace de publication d'annonces\n• Assurer la mise en relation avec les locataires\n• Gérer les litiges via un système de médiation neutre\n• Verser les revenus nets dans les 5 jours ouvrés après confirmation" },
                  { titre: "Article 3 — Obligations du propriétaire", texte: "• Fournir des informations exactes sur chaque tenue (photos, état, dimensions)\n• Assurer la disponibilité des tenues aux dates annoncées\n• Restituer la caution dans un délai de 48h après retour en bon état\n• Respecter les prix annoncés sur la plateforme" },
                  { titre: "Article 4 — Commission plateforme", texte: `La plateforme prélève une commission de ${currentUser.type_proprietaire === "boutique" ? "15%" : "19%"} sur le montant de chaque location. La commission est prélevée automatiquement avant le versement des revenus nets.` },
                  { titre: "Article 5 — Médiation et litiges", texte: "En cas de litige avec un locataire, les parties s'engagent à recourir au système de médiation KASEWA.DZ avant tout recours judiciaire." },
                  { titre: "Article 6 — Durée et résiliation", texte: "Ce contrat est conclu pour une durée indéterminée. Chaque partie peut y mettre fin avec un préavis de 30 jours par voie électronique." },
                ].map((art) => (
                  <div key={art.titre} style={{ borderLeft: "3px solid #C9924A", paddingLeft: "14px", marginBottom: "16px" }}>
                    <h3 style={{ color: "#1B4D3E", fontWeight: 700, fontSize: "13px", marginBottom: "6px" }}>{art.titre}</h3>
                    <p style={{ color: "#555", fontSize: "12px", lineHeight: "1.7", whiteSpace: "pre-line" }}>{art.texte}</p>
                  </div>
                ))}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginTop: "24px", paddingTop: "20px", borderTop: "1px solid #eee" }}>
                  {["Signature KASEWA.DZ", "Signature du Propriétaire"].map((s) => (
                    <div key={s}>
                      <p style={{ fontSize: "12px", fontWeight: 600, color: "#444", marginBottom: "4px" }}>{s}</p>
                      <p style={{ fontSize: "11px", color: "#888", marginBottom: "8px" }}>Lu et approuvé</p>
                      <div style={{ height: "60px", borderBottom: "1px dashed #aaa" }} />
                    </div>
                  ))}
                </div>

                <div style={{ textAlign: "center", marginTop: "20px", fontSize: "10px", color: "#bbb", paddingTop: "12px", borderTop: "1px solid #eee" }}>
                  KASEWA.DZ — Plateforme de location de tenues traditionnelles algériennes — Tlemcen, Algérie
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

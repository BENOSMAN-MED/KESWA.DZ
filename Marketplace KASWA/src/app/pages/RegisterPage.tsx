import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import { useApp, mapApiUser } from "../context/AppContext";
import { authApi } from "../../services/api";
import logoImage from "../../imports/designarena_image_56urdtwj.jpg";

const HERO = "https://images.unsplash.com/photo-1667179529444-1c8e8defa2a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800";

const WILAYAS = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra",
  "Béchar", "Blida", "Bouira", "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret",
  "Tizi Ouzou", "Alger", "Djelfa", "Jijel", "Sétif", "Saïda", "Skikda",
  "Sidi Bel Abbès", "Annaba", "Guelma", "Constantine", "Médéa", "Mostaganem",
  "M'Sila", "Mascara", "Ouargla", "Oran", "El Bayadh", "Illizi", "Bordj Bou Arréridj",
  "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela",
  "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent",
  "Ghardaïa", "Relizane",
];

export function RegisterPage() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"renter" | "owner" | "">("");
  const [typeProprietaire, setTypeProprietaire] = useState<"investisseur" | "boutique" | "">("");
  const [nomBoutique, setNomBoutique] = useState("");
  const [adresseBoutique, setAdresseBoutique] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [wilaya, setWilaya] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const { setCurrentUser } = useApp();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return;
    setError("");
    setLoading(true);

    try {
      const apiRole = role === "owner" ? "proprietaire" : "locataire";
      const res = await authApi.inscrire({
        nom: name,
        email,
        password,
        password_confirmation: confirmPassword,
        telephone: phone || undefined,
        wilaya: wilaya || undefined,
        role: apiRole,
        type_proprietaire: role === "owner" ? typeProprietaire : undefined,
        nom_boutique: typeProprietaire === "boutique" ? nomBoutique : undefined,
        adresse_boutique: typeProprietaire === "boutique" ? adresseBoutique : undefined,
      });

      const { utilisateur, token } = res.data;
      localStorage.setItem("kasewa_token", token);
      const user = mapApiUser(utilisateur);
      setCurrentUser(user);
      navigate(role === "owner" ? "/dashboard/owner" : "/dashboard/renter");
    } catch (err: any) {
      const msg = err?.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(" ")
        : err?.response?.data?.message || "Erreur lors de l'inscription. Vérifiez vos informations.";
      setError(String(msg));
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    {
      key: "renter",
      emoji: "👗",
      title: "Locataire",
      desc: "Je cherche une tenue traditionnelle pour une occasion spéciale (mariage, fiançailles, cérémonie...)",
      benefits: ["Accès à des centaines de tenues", "Réservation sécurisée", "Caution remboursable"],
    },
    {
      key: "owner",
      emoji: "💼",
      title: "Propriétaire",
      desc: "Je possède des tenues traditionnelles et je souhaite les mettre en location sur la plateforme.",
      benefits: ["Monétisez vos tenues", "Gestion simplifiée des réservations", "Paiement sécurisé"],
    },
  ];

  return (
    <div className="min-h-screen flex pt-16">
      <div className="hidden lg:block lg:w-5/12 relative">
        <img src={HERO} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#1B4D3E]/70 flex flex-col items-start justify-end p-12">
          <h2 className="text-white text-2xl mb-3" style={{ fontWeight: 700 }}>
            Rejoignez la communauté KASEWA.DZ
          </h2>
          <p className="text-white/70 text-sm">
            Des milliers d'Algériens valorisent déjà leur patrimoine vestimentaire grâce à notre plateforme.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-start justify-center p-6 bg-[#FAF6EF] overflow-y-auto">
        <div className="w-full max-w-lg py-8 animate-fade-in">
          <div className="lg:hidden flex items-center mb-8 justify-center">
            <img src={logoImage} alt="KASEWA.DZ" className="h-12 w-auto object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          </div>

          {/* Steps */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors ${
                  step >= s ? "bg-[#1B4D3E] text-white" : "bg-gray-200 text-gray-400"
                }`} style={{ fontWeight: 600 }}>
                  {step > s ? <CheckCircle size={16} /> : s}
                </div>
                <span className={`text-xs hidden sm:block ${step >= s ? "text-[#1B4D3E]" : "text-gray-400"}`} style={{ fontWeight: 500 }}>
                  {s === 1 ? "Choisir un rôle" : "Informations"}
                </span>
                {s < 2 && <div className={`w-12 h-0.5 ${step > s ? "bg-[#1B4D3E]" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>

          {/* Step 1: Role */}
          {step === 1 && (
            <div>
              <h1 className="text-gray-900 mb-2" style={{ fontSize: "1.8rem", fontWeight: 700 }}>Créer un compte</h1>
              <p className="text-gray-500 mb-8">Commencez par choisir votre type de compte</p>
              <div className="space-y-4 mb-8">
                {roles.map((r) => (
                  <button key={r.key} onClick={() => setRole(r.key as "renter" | "owner")}
                    className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
                      role === r.key ? "border-[#1B4D3E] bg-[#1B4D3E]/5 shadow-md" : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-3xl">{r.emoji}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-gray-900" style={{ fontWeight: 700 }}>{r.title}</h3>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                            role === r.key ? "border-[#1B4D3E] bg-[#1B4D3E]" : "border-gray-300"
                          }`}>
                            {role === r.key && <div className="w-2 h-2 bg-white rounded-full" />}
                          </div>
                        </div>
                        <p className="text-gray-500 text-sm mt-1 mb-3">{r.desc}</p>
                        <ul className="space-y-1">
                          {r.benefits.map((b) => (
                            <li key={b} className="flex items-center gap-1.5 text-xs text-gray-600">
                              <CheckCircle size={12} className="text-[#1B4D3E] shrink-0" />{b}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(2)} disabled={!role}
                className="w-full bg-[#1B4D3E] text-white py-3.5 rounded-xl text-sm hover:bg-[#2d6b55] disabled:opacity-50 transition-colors"
                style={{ fontWeight: 600 }}>
                Continuer
              </button>
            </div>
          )}

          {/* Step 2: Info */}
          {step === 2 && (
            <div>
              <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1">
                ← Retour
              </button>
              <h1 className="text-gray-900 mb-2" style={{ fontSize: "1.8rem", fontWeight: 700 }}>Vos informations</h1>
              <p className="text-gray-500 mb-6">
                Compte : <span className="text-[#1B4D3E]" style={{ fontWeight: 600 }}>
                  {role === "owner"
                    ? (typeProprietaire === "boutique" ? "Boutique (15%)" : typeProprietaire === "investisseur" ? "Investisseur (19%)" : "Propriétaire")
                    : "Locataire"}
                </span>
              </p>

              {/* Sélection du type propriétaire */}
              {role === "owner" && (
                <div className="mb-6">
                  <p className="text-sm text-gray-700 mb-3" style={{ fontWeight: 600 }}>Quel type de propriétaire êtes-vous ?</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => setTypeProprietaire("investisseur")}
                      className={`p-4 rounded-2xl border-2 text-left transition-all ${
                        typeProprietaire === "investisseur"
                          ? "border-[#1B4D3E] bg-[#1B4D3E]/5 shadow-md"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">👤</span>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          typeProprietaire === "investisseur" ? "border-[#1B4D3E] bg-[#1B4D3E]" : "border-gray-300"
                        }`}>
                          {typeProprietaire === "investisseur" && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                      </div>
                      <p className="text-gray-900 text-sm" style={{ fontWeight: 700 }}>Investisseur</p>
                      <p className="text-gray-500 text-xs mt-1">Particulier avec des tenues à louer</p>
                      <span className="inline-block mt-2 px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs" style={{ fontWeight: 600 }}>
                        Commission 19%
                      </span>
                    </button>

                    <button type="button" onClick={() => setTypeProprietaire("boutique")}
                      className={`p-4 rounded-2xl border-2 text-left transition-all ${
                        typeProprietaire === "boutique"
                          ? "border-[#1B4D3E] bg-[#1B4D3E]/5 shadow-md"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">🏪</span>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          typeProprietaire === "boutique" ? "border-[#1B4D3E] bg-[#1B4D3E]" : "border-gray-300"
                        }`}>
                          {typeProprietaire === "boutique" && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                      </div>
                      <p className="text-gray-900 text-sm" style={{ fontWeight: 700 }}>Boutique</p>
                      <p className="text-gray-500 text-xs mt-1">Commerce avec essayage possible</p>
                      <span className="inline-block mt-2 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs" style={{ fontWeight: 600 }}>
                        Commission 15%
                      </span>
                    </button>
                  </div>
                  {!typeProprietaire && (
                    <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                      ⚠️ Veuillez sélectionner votre type de propriétaire
                    </p>
                  )}
                </div>
              )}

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>
                      Nom complet
                    </label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                      placeholder="Ex: Fatima Benali"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1B4D3E] text-gray-800" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                      placeholder="votre@email.com"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1B4D3E] text-gray-800" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>Téléphone</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                      placeholder="+213 555 ..."
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1B4D3E] text-gray-800" />
                  </div>
                  {/* Champs boutique */}
                  {typeProprietaire === "boutique" && (
                    <>
                      <div className="col-span-2">
                        <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>Nom de la boutique</label>
                        <input type="text" value={nomBoutique} onChange={(e) => setNomBoutique(e.target.value)} required
                          placeholder="Ex: Boutique Tlemcen Tradition"
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1B4D3E] text-gray-800" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>Adresse de la boutique</label>
                        <input type="text" value={adresseBoutique} onChange={(e) => setAdresseBoutique(e.target.value)} required
                          placeholder="Ex: 12 Rue Sebti, Tlemcen"
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1B4D3E] text-gray-800" />
                      </div>
                    </>
                  )}

                  <div className="col-span-2">
                    <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>Wilaya</label>
                    <select value={wilaya} onChange={(e) => setWilaya(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1B4D3E] text-gray-700">
                      <option value="">Sélectionnez votre wilaya</option>
                      {WILAYAS.map((w) => <option key={w} value={w}>{w}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>Mot de passe</label>
                    <div className="relative">
                      <input type={showPass ? "text" : "password"} value={password}
                        onChange={(e) => setPassword(e.target.value)} required minLength={8}
                        placeholder="8 caractères min."
                        className="w-full px-4 py-3 pr-10 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1B4D3E] text-gray-800" />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>Confirmer</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                      placeholder="Répétez le mot de passe"
                      className={`w-full px-4 py-3 bg-white border rounded-xl text-sm outline-none text-gray-800 ${
                        confirmPassword && password !== confirmPassword ? "border-red-300" : "border-gray-200 focus:border-[#1B4D3E]"
                      }`} />
                    {confirmPassword && password !== confirmPassword && (
                      <p className="text-xs text-red-500 mt-1">Les mots de passe ne correspondent pas</p>
                    )}
                  </div>
                </div>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="accent-[#1B4D3E] mt-1" />
                  <span className="text-sm text-gray-500">
                    J'accepte les{" "}
                    <Link to="/cgu" className="text-[#1B4D3E] hover:underline">Conditions Générales d'Utilisation</Link>
                    {" "}et la{" "}
                    <Link to="/confidentialite" className="text-[#1B4D3E] hover:underline">Politique de confidentialité</Link>
                  </span>
                </label>

                <button type="submit" disabled={loading || !agreeTerms || password !== confirmPassword || (role === "owner" && !typeProprietaire)}
                  className="w-full bg-[#C9924A] text-white py-3.5 rounded-xl text-sm hover:bg-[#b5803c] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                  style={{ fontWeight: 600 }}>
                  {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Créer mon compte"}
                </button>
              </form>
            </div>
          )}

          <p className="text-center text-sm text-gray-500 mt-6">
            Déjà un compte ?{" "}
            <Link to="/connexion" className="text-[#1B4D3E] hover:text-[#C9924A]" style={{ fontWeight: 600 }}>
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

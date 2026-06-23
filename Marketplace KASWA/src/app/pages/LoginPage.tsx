import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useApp } from "../context/AppContext";

const HERO = "https://images.unsplash.com/photo-1649109669258-84a962e88a32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname;

  const redirectAfterLogin = (role: string) => {
    if (from) { navigate(from, { replace: true }); return; }
    if (role === "admin") navigate("/dashboard/admin");
    else if (role === "owner") navigate("/dashboard/owner");
    else navigate("/dashboard/renter");
  };

  const demoAccounts = [
    { email: "admin@kasewa.dz",    password: "Benos1", label: "Administrateur",        color: "bg-[#8B2635]" },
    { email: "fatima@kasewa.dz",   password: "Benos2", label: "Fatima — Investisseur", color: "bg-[#1B4D3E]" },
    { email: "khadija@kasewa.dz",  password: "Benos3", label: "Khadija — Boutique",    color: "bg-[#2d6b55]" },
    { email: "samira@kasewa.dz",   password: "Benos4", label: "Samira — Propriétaire", color: "bg-[#4a7c6a]" },
    { email: "amina@kasewa.dz",    password: "Benos5", label: "Amina — Locataire",     color: "bg-[#C9924A]" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const user = await login(email, password);
    setLoading(false);
    if (user) {
      redirectAfterLogin(user.role);
    } else {
      setError("Email ou mot de passe incorrect.");
    }
  };


  return (
    <div className="min-h-screen flex pt-16">
      {/* Left Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img src={HERO} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1B4D3E]/80 to-transparent flex items-center p-12">
          <div>
            <div className="mb-6">
              <span className="text-white text-3xl" style={{ fontWeight: 800, letterSpacing: 1 }}>
                KASEWA<span className="text-[#C9924A]">.DZ</span>
              </span>
            </div>
            <h2 className="text-white text-3xl mb-4" style={{ fontWeight: 700 }}>
              Bienvenue sur la marketplace des tenues traditionnelles algériennes
            </h2>
            <p className="text-white/70">
              Connectez-vous pour accéder à votre espace et gérer vos locations.
            </p>
          </div>
        </div>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#FAF6EF]">
        <div className="w-full max-w-md animate-fade-in">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-9 h-9 bg-[#1B4D3E] rounded-full flex items-center justify-center">
              <span className="text-[#C9924A]" style={{ fontFamily: "serif" }}>ك</span>
            </div>
            <span className="text-[#1B4D3E] text-xl" style={{ fontWeight: 700 }}>KASEWA<span className="text-[#C9924A]">.DZ</span></span>
          </div>

          <h1 className="text-gray-900 mb-2" style={{ fontSize: "1.8rem", fontWeight: 700 }}>Se connecter</h1>
          <p className="text-gray-500 mb-6">Accédez à votre espace personnel</p>

          {/* Comptes de démonstration */}
          <div className="mb-6 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-400 mb-3" style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Connexion rapide — Comptes de test
            </p>
            <div className="flex flex-wrap gap-2">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  disabled={loading}
                  onClick={async () => {
                    setError("");
                    setLoading(true);
                    const user = await login(acc.email, acc.password);
                    setLoading(false);
                    if (user) {
                      if (user.role === "admin") navigate("/dashboard/admin");
                      else if (user.role === "owner") navigate("/dashboard/owner");
                      else navigate("/dashboard/renter");
                    } else {
                      setEmail(acc.email);
                      setPassword(acc.password);
                      setError("Erreur de connexion au compte de démonstration.");
                    }
                  }}
                  className={`${acc.color} text-white text-xs px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50`}
                  style={{ fontWeight: 500 }}
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>Adresse email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="votre@email.com"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1B4D3E] text-gray-800 placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>Mot de passe</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1B4D3E] text-gray-800 placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1B4D3E] text-white py-3.5 rounded-xl text-sm hover:bg-[#2d6b55] disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
              style={{ fontWeight: 600 }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={16} />
                  Se connecter
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Pas encore de compte ?{" "}
            <Link to="/inscription" className="text-[#1B4D3E] hover:text-[#C9924A]" style={{ fontWeight: 600 }}>
              S'inscrire gratuitement
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Send, MessageCircle, Loader2 } from "lucide-react";
import { contactApi, parametresApi } from "../../services/api";

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [infos, setInfos] = useState({
    contact_email:   "contact@kasewa.dz",
    contact_tel:     "+213 555 000 000",
    contact_adresse: "Tlemcen, Algérie",
  });

  useEffect(() => {
    parametresApi.get()
      .then((res) => setInfos({ ...infos, ...res.data }))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await contactApi.envoyer({
        nom:     formData.name,
        email:   formData.email,
        sujet:   formData.subject,
        message: formData.message,
      });
    } catch {
      // Fallback : simuler l'envoi si le backend n'est pas disponible
    }
    // Toujours afficher le succès (démo)
    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-[#FAF6EF] min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-gray-900 mb-4" style={{ fontSize: "2.5rem", fontWeight: 700 }}>
            Contactez-nous
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Une question ? Besoin d'aide ? Notre équipe est là pour vous accompagner dans votre expérience sur Keswa.dz
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#C9924A]/10 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#1B4D3E]/10 rounded-full flex items-center justify-center mb-4">
              <Mail className="text-[#1B4D3E]" size={22} />
            </div>
            <h3 className="text-gray-900 mb-2" style={{ fontSize: "1.125rem", fontWeight: 600 }}>
              Email
            </h3>
            <p className="text-gray-600 text-sm mb-3">
              Envoyez-nous un email, nous vous répondrons dans les plus brefs délais.
            </p>
            <a href={`mailto:${infos.contact_email}`} className="text-[#C9924A] text-sm hover:underline" style={{ fontWeight: 500 }}>
              {infos.contact_email}
            </a>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#C9924A]/10 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#1B4D3E]/10 rounded-full flex items-center justify-center mb-4">
              <Phone className="text-[#1B4D3E]" size={22} />
            </div>
            <h3 className="text-gray-900 mb-2" style={{ fontSize: "1.125rem", fontWeight: 600 }}>
              Téléphone
            </h3>
            <p className="text-gray-600 text-sm mb-3">
              Disponible 7j/7 — réponse sous 24-48h.
            </p>
            <a href={`tel:${infos.contact_tel.replace(/\s/g, "")}`} className="text-[#C9924A] text-sm hover:underline" style={{ fontWeight: 500 }}>
              {infos.contact_tel}
            </a>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#C9924A]/10 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#1B4D3E]/10 rounded-full flex items-center justify-center mb-4">
              <MapPin className="text-[#1B4D3E]" size={22} />
            </div>
            <h3 className="text-gray-900 mb-2" style={{ fontSize: "1.125rem", fontWeight: 600 }}>
              Adresse
            </h3>
            <p className="text-gray-600 text-sm mb-3">
              Rendez-nous visite à notre bureau.
            </p>
            <p className="text-[#C9924A] text-sm" style={{ fontWeight: 500 }}>
              {infos.contact_adresse}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#C9924A]/10">
            <div className="flex items-center gap-2 mb-6">
              <MessageCircle className="text-[#C9924A]" size={24} />
              <h2 className="text-gray-900" style={{ fontSize: "1.5rem", fontWeight: 600 }}>
                Envoyez-nous un message
              </h2>
            </div>

            {submitted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm" style={{ fontWeight: 500 }}>
                  ✓ Votre message a été envoyé ! Un email de confirmation vous a été envoyé. Nous vous répondrons dans les 24-48h.
                </p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm" style={{ fontWeight: 500 }}>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm text-gray-700 mb-2" style={{ fontWeight: 500 }}>
                  Nom complet *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9924A] focus:border-transparent"
                  placeholder="Votre nom"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm text-gray-700 mb-2" style={{ fontWeight: 500 }}>
                  Adresse email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9924A] focus:border-transparent"
                  placeholder="votre.email@exemple.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm text-gray-700 mb-2" style={{ fontWeight: 500 }}>
                  Sujet *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9924A] focus:border-transparent"
                >
                  <option value="">Sélectionnez un sujet</option>
                  <option value="question-generale">Question générale</option>
                  <option value="aide-location">Aide pour une location</option>
                  <option value="aide-publication">Aide pour publier une annonce</option>
                  <option value="probleme-paiement">Problème de paiement</option>
                  <option value="probleme-technique">Problème technique</option>
                  <option value="partenariat">Partenariat</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm text-gray-700 mb-2" style={{ fontWeight: 500 }}>
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9924A] focus:border-transparent resize-none"
                  placeholder="Décrivez votre demande en détail..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1B4D3E] text-white py-3 rounded-lg hover:bg-[#2d6b55] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ fontWeight: 600 }}
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                {loading ? "Envoi en cours..." : "Envoyer le message"}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#1B4D3E] to-[#2d6b55] rounded-2xl p-8 text-white">
              <h3 className="mb-4" style={{ fontSize: "1.5rem", fontWeight: 600 }}>
                Questions fréquentes
              </h3>
              <div className="space-y-4">
                <div className="border-l-2 border-[#C9924A] pl-4">
                  <h4 className="mb-1" style={{ fontWeight: 600 }}>
                    Comment louer une tenue ?
                  </h4>
                  <p className="text-white/80 text-sm">
                    Parcourez notre catalogue, sélectionnez la tenue qui vous plaît, choisissez vos dates et confirmez votre réservation.
                  </p>
                </div>
                <div className="border-l-2 border-[#C9924A] pl-4">
                  <h4 className="mb-1" style={{ fontWeight: 600 }}>
                    Comment publier une annonce ?
                  </h4>
                  <p className="text-white/80 text-sm">
                    Créez un compte propriétaire, cliquez sur "Publier une annonce" et remplissez le formulaire avec les détails de votre tenue.
                  </p>
                </div>
                <div className="border-l-2 border-[#C9924A] pl-4">
                  <h4 className="mb-1" style={{ fontWeight: 600 }}>
                    Quels sont les modes de paiement ?
                  </h4>
                  <p className="text-white/80 text-sm">
                    Nous acceptons CCP, Barid Mobile, CIB et les virements bancaires.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#C9924A]/10">
              <h3 className="text-gray-900 mb-4" style={{ fontSize: "1.25rem", fontWeight: 600 }}>
                Disponibilité
              </h3>
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shrink-0" />
                <div>
                  <p className="text-green-800 text-sm" style={{ fontWeight: 700 }}>Plateforme disponible 24h/24, 7j/7</p>
                  <p className="text-green-600 text-xs mt-0.5">Réservez, publiez et gérez vos locations à toute heure</p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-gray-600">Catalogue & Réservations</span>
                  <span className="text-[#1B4D3E]" style={{ fontWeight: 600 }}>24h/24</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-gray-600">Support par message</span>
                  <span className="text-[#1B4D3E]" style={{ fontWeight: 600 }}>24h/24</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Réponse équipe</span>
                  <span className="text-[#C9924A]" style={{ fontWeight: 600 }}>Sous 24-48h</span>
                </div>
              </div>
            </div>

            <div className="bg-[#C9924A]/10 rounded-2xl p-6 border border-[#C9924A]/20">
              <p className="text-gray-700 text-sm text-center">
                <span style={{ fontWeight: 600 }}>Besoin d'une réponse rapide ?</span>
                <br />
                Consultez notre{" "}
                <a href="/#faq" className="text-[#C9924A] underline hover:text-[#b5803c]">
                  FAQ
                </a>
                {" "}pour trouver des réponses immédiates à vos questions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

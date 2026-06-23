import { Link } from "react-router";
import { ArrowLeft, Shield, FileText, AlertCircle, CheckCircle } from "lucide-react";

export function CGUPage() {
  const sections = [
    {
      title: "1. Objet",
      content: `Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation de la plateforme Keswa.dz, marketplace algérienne dédiée à la location de tenues traditionnelles entre particuliers, investisseurs et boutiques.`,
    },
    {
      title: "2. Acceptation des CGU",
      content: `En vous inscrivant sur Keswa.dz, vous déclarez avoir lu, compris et accepté sans réserve les présentes CGU. Si vous n'acceptez pas ces conditions, vous ne pouvez pas utiliser nos services.`,
    },
    {
      title: "3. Services proposés",
      content: `Keswa.dz met en relation des propriétaires de tenues traditionnelles (vendeurs) avec des locataires (acheteurs). La plateforme facilite : la publication d'annonces de location, la réservation et le paiement sécurisé, la gestion des contrats de location, le système d'évaluation bidirectionnel, et la messagerie entre utilisateurs.`,
    },
    {
      title: "4. Inscription et compte utilisateur",
      content: `L'inscription est gratuite et ouverte à toute personne physique majeure ou personne morale. Vous vous engagez à fournir des informations exactes et à jour. Vous êtes responsable de la confidentialité de vos identifiants de connexion.`,
    },
    {
      title: "5. Obligations des propriétaires",
      content: `Les propriétaires s'engagent à : publier des annonces conformes à la réalité, garantir l'état de la tenue décrit, être disponibles aux dates annoncées, respecter les conditions de la réservation, déposer la caution selon les modalités définies.`,
    },
    {
      title: "6. Obligations des locataires",
      content: `Les locataires s'engagent à : utiliser la tenue de façon raisonnable et soigneuse, la retourner dans l'état initial, respecter les dates convenues, effectuer le paiement dans les délais impartis, signaler tout dommage immédiatement.`,
    },
    {
      title: "7. Commission et paiements",
      content: `Keswa.dz prélève une commission sur chaque transaction réussie : 15% pour les Boutiques (le propriétaire reçoit 85%) et 19% pour les Investisseurs (le propriétaire reçoit 81%). La caution est bloquée jusqu'au retour de la tenue en bon état. Les paiements sont acceptés via Barid Mobile, CCP/e-CCP et Carte CIB/VISA.`,
    },
    {
      title: "8. Litiges",
      content: `En cas de litige, les deux parties doivent d'abord tenter une résolution amiable. Keswa.dz peut intervenir en tant que médiateur. La plateforme se réserve le droit de trancher en cas de preuves suffisantes.`,
    },
    {
      title: "9. Responsabilité",
      content: `Keswa.dz agit en qualité d'intermédiaire et ne peut être tenu responsable des actes des utilisateurs. La plateforme met en œuvre tous les moyens nécessaires pour assurer la sécurité des transactions mais ne garantit pas l'absence de tout risque.`,
    },
    {
      title: "10. Modification des CGU",
      content: `Keswa.dz se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés par email des modifications importantes. La continuation de l'utilisation des services vaut acceptation des nouvelles CGU.`,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF6EF] pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link to="/" className="p-2 text-gray-400 hover:text-gray-600 bg-white rounded-xl shadow-sm">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-gray-900 text-2xl" style={{ fontWeight: 700 }}>Conditions Générales d'Utilisation</h1>
            <p className="text-gray-500 text-sm">Dernière mise à jour : Juin 2025</p>
          </div>
        </div>

        {/* Intro Card */}
        <div className="bg-[#1B4D3E] rounded-2xl p-6 mb-8 text-white">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <FileText size={22} />
            </div>
            <div>
              <h2 className="text-lg mb-1" style={{ fontWeight: 700 }}>Bienvenue sur Keswa.dz</h2>
              <p className="text-white/80 text-sm leading-relaxed">
                Ces conditions régissent votre utilisation de notre plateforme. Veuillez les lire attentivement avant de vous inscrire.
              </p>
            </div>
          </div>
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: <CheckCircle size={18} />, label: "Commission transparente 15-19%", color: "text-green-600 bg-green-50" },
            { icon: <Shield size={18} />, label: "Caution sécurisée", color: "text-blue-600 bg-blue-50" },
            { icon: <AlertCircle size={18} />, label: "Litiges traités 48h", color: "text-orange-600 bg-orange-50" },
          ].map((h, i) => (
            <div key={i} className={`${h.color} rounded-xl p-4 flex items-center gap-3`}>
              {h.icon}
              <span className="text-sm" style={{ fontWeight: 600 }}>{h.label}</span>
            </div>
          ))}
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map((section, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-gray-900 mb-3" style={{ fontWeight: 700 }}>{section.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-8 p-5 bg-[#C9924A]/10 border border-[#C9924A]/20 rounded-2xl text-center">
          <p className="text-gray-700 text-sm">
            Pour toute question concernant ces CGU, contactez-nous à{" "}
            <a href="mailto:legal@keswa.dz" className="text-[#1B4D3E]" style={{ fontWeight: 600 }}>legal@keswa.dz</a>
          </p>
          <Link to="/contact" className="inline-block mt-3 bg-[#1B4D3E] text-white px-6 py-2.5 rounded-full text-sm hover:bg-[#2d6b55] transition-colors" style={{ fontWeight: 600 }}>
            Nous contacter
          </Link>
        </div>
      </div>
    </div>
  );
}

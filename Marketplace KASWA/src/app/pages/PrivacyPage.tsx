import { Link } from "react-router";
import { ArrowLeft, Lock, Eye, Database, Shield, Trash2 } from "lucide-react";

export function PrivacyPage() {
  const sections = [
    {
      icon: <Database size={18} className="text-[#1B4D3E]" />,
      title: "Données collectées",
      content: `Nous collectons les informations suivantes : nom et prénom, adresse email, numéro de téléphone, wilaya de résidence, documents d'identité (CIN ou Passeport pour la vérification), informations bancaires (CCP, numéro Barid Mobile) pour les paiements, photos de profil optionnelles, historique des transactions et évaluations.`,
    },
    {
      icon: <Eye size={18} className="text-[#C9924A]" />,
      title: "Utilisation des données",
      content: `Vos données sont utilisées pour : vérifier votre identité et prévenir la fraude, faciliter les transactions entre utilisateurs, envoyer des notifications relatives à vos réservations, améliorer nos services et l'expérience utilisateur, répondre à vos demandes de support. Nous ne vendons jamais vos données personnelles à des tiers.`,
    },
    {
      icon: <Shield size={18} className="text-blue-600" />,
      title: "Protection des données",
      content: `Keswa.dz met en œuvre des mesures de sécurité robustes : chiffrement HTTPS/TLS pour toutes les communications, mots de passe hashés avec bcrypt, accès aux données limité au personnel autorisé, sauvegardes régulières et sécurisées, conformité avec les réglementations algériennes sur la protection des données.`,
    },
    {
      icon: <Lock size={18} className="text-purple-600" />,
      title: "Partage avec des tiers",
      content: `Vos données peuvent être partagées uniquement dans les cas suivants : avec l'autre partie d'une transaction (nom, téléphone après confirmation de réservation), avec les autorités compétentes en cas d'obligation légale, avec nos prestataires techniques (hébergement, paiement) sous contrat de confidentialité.`,
    },
    {
      icon: <Trash2 size={18} className="text-red-500" />,
      title: "Vos droits",
      content: `Conformément à la législation algérienne, vous disposez des droits suivants : droit d'accès à vos données personnelles, droit de rectification des données inexactes, droit à l'effacement de votre compte et de vos données, droit à la portabilité de vos données, droit d'opposition au traitement. Pour exercer ces droits, contactez privacy@keswa.dz.`,
    },
    {
      icon: <Database size={18} className="text-gray-500" />,
      title: "Conservation des données",
      content: `Vos données sont conservées pendant la durée de votre utilisation de nos services, plus 3 ans après la suppression de votre compte (obligation légale). Les données de transaction sont conservées 5 ans pour des raisons comptables et légales.`,
    },
    {
      icon: <Eye size={18} className="text-orange-500" />,
      title: "Cookies",
      content: `Keswa.dz utilise des cookies essentiels au fonctionnement du site (authentification, préférences) et des cookies analytiques anonymisés pour améliorer nos services. Aucun cookie publicitaire tiers n'est utilisé.`,
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
            <h1 className="text-gray-900 text-2xl" style={{ fontWeight: 700 }}>Politique de confidentialité</h1>
            <p className="text-gray-500 text-sm">Dernière mise à jour : Juin 2025</p>
          </div>
        </div>

        {/* Intro */}
        <div className="bg-gradient-to-r from-[#1B4D3E] to-[#2d6b55] rounded-2xl p-6 mb-8 text-white">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <Lock size={22} />
            </div>
            <div>
              <h2 className="text-lg mb-1" style={{ fontWeight: 700 }}>Vos données, votre vie privée</h2>
              <p className="text-white/80 text-sm leading-relaxed">
                Keswa.dz s'engage à protéger vos données personnelles. Cette politique explique comment nous collectons, utilisons et protégeons vos informations.
              </p>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map((section, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                  {section.icon}
                </div>
                <h3 className="text-gray-900" style={{ fontWeight: 700 }}>{section.title}</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed pl-10">{section.content}</p>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-8 p-5 bg-[#1B4D3E]/5 border border-[#1B4D3E]/10 rounded-2xl text-center">
          <h3 className="text-gray-900 mb-2" style={{ fontWeight: 600 }}>DPO — Délégué à la Protection des Données</h3>
          <p className="text-gray-500 text-sm mb-4">
            Pour toute question relative à vos données personnelles :<br />
            <a href="mailto:privacy@keswa.dz" className="text-[#1B4D3E]" style={{ fontWeight: 600 }}>privacy@keswa.dz</a>
          </p>
          <div className="flex justify-center gap-3">
            <Link to="/contact" className="bg-[#1B4D3E] text-white px-5 py-2.5 rounded-full text-sm hover:bg-[#2d6b55] transition-colors" style={{ fontWeight: 600 }}>
              Nous contacter
            </Link>
            <Link to="/cgu" className="border border-gray-200 text-gray-600 px-5 py-2.5 rounded-full text-sm hover:bg-gray-50 transition-colors" style={{ fontWeight: 600 }}>
              Voir les CGU
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

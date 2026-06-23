import { useState } from "react";
import { Star, ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { TerminatedReservations } from "../components/TerminatedReservations";

export function EvaluationTestPage() {
  const [reservations] = useState([
    {
      id: 1,
      tenueId: 101,
      tenueTitre: "Magnifique Chedda Algérienne",
      proprietaireNom: "Fatima El Jazaïri",
      dateFin: "2026-05-28",
      montant: 15000,
      evaluated: false,
    },
    {
      id: 2,
      tenueId: 102,
      tenueTitre: "Caftan Marocain Doré",
      proprietaireNom: "Aisha Boumediene",
      dateFin: "2026-05-20",
      montant: 12000,
      evaluated: true,
      evaluationNote: 5,
    },
    {
      id: 3,
      tenueId: 103,
      tenueTitre: "Gandoura Traditionnelle",
      proprietaireNom: "Leila Kahina",
      dateFin: "2026-05-15",
      montant: 8000,
      evaluated: true,
      evaluationNote: 4,
    },
  ]);

  return (
    <div className="min-h-screen bg-[#FAF6EF] pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="flex items-center gap-2 text-[#1B4D3E] hover:text-[#C9924A] mb-4">
            <ArrowLeft size={16} />
            Retour
          </Link>
          <h1 className="text-3xl text-gray-900 mb-2" style={{ fontWeight: 700 }}>
            Test Système d'Évaluation
          </h1>
          <p className="text-gray-600">
            Cliquez sur "Évaluer" pour ouvrir la modale d'évaluation
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
          <h3 className="text-blue-900 mb-3" style={{ fontWeight: 700 }}>
            💡 Comment ça marche ?
          </h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>
              ✅ <strong>Étape 1:</strong> Sélectionnez une note de 1 à 5 étoiles
            </li>
            <li>
              ✅ <strong>Étape 2:</strong> Écrivez un commentaire optionnel (max 200
              caractères)
            </li>
            <li>
              ✅ <strong>Étape 3:</strong> Confirmez l'envoi de l'évaluation
            </li>
            <li>
              ✅ <strong>Résultat:</strong> Votre évaluation s'ajoute au profil du
              propriétaire
            </li>
          </ul>
        </div>

        {/* Réservations */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg text-gray-900 mb-4" style={{ fontWeight: 700 }}>
            📋 Vos locations
          </h2>
          <TerminatedReservations
            reservations={reservations}
            onEvaluationSuccess={() => {
              alert("Évaluation envoyée avec succès !");
            }}
          />
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="text-2xl text-[#C9924A]" style={{ fontWeight: 700 }}>
              {reservations.length}
            </div>
            <p className="text-sm text-gray-500 mt-1">Total des locations</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="text-2xl text-green-600" style={{ fontWeight: 700 }}>
              {reservations.filter((r) => r.evaluated).length}
            </div>
            <p className="text-sm text-gray-500 mt-1">Évaluées</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="text-2xl text-blue-600" style={{ fontWeight: 700 }}>
              {reservations.filter((r) => !r.evaluated).length}
            </div>
            <p className="text-sm text-gray-500 mt-1">À évaluer</p>
          </div>
        </div>
      </div>
    </div>
  );
}

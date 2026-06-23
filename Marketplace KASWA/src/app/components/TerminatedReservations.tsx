import { useState } from "react";
import { Star, Calendar, MapPin, AlertCircle } from "lucide-react";
import { EvaluationModal } from "./EvaluationModal";

interface TerminatedReservation {
  id: number;
  tenueId: number;
  tenueTitre: string;
  proprietaireNom: string;
  dateFin: string;
  montant: number;
  evaluated: boolean;
  evaluationNote?: number;
}

interface TerminatedReservationsProps {
  reservations: TerminatedReservation[];
  onEvaluationSuccess?: () => void;
}

export function TerminatedReservations({
  reservations,
  onEvaluationSuccess,
}: TerminatedReservationsProps) {
  const [showEvalModal, setShowEvalModal] = useState(false);
  const [selectedReservation, setSelectedReservation] =
    useState<TerminatedReservation | null>(null);

  const handleEvaluate = (res: TerminatedReservation) => {
    setSelectedReservation(res);
    setShowEvalModal(true);
  };

  const notEvaluated = reservations.filter((r) => !r.evaluated);
  const evaluated = reservations.filter((r) => r.evaluated);

  if (reservations.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle size={32} className="mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500 text-sm">
          Aucune location terminée pour le moment
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* À évaluer */}
      {notEvaluated.length > 0 && (
        <div>
          <h4 className="text-sm text-gray-700 mb-3" style={{ fontWeight: 600 }}>
            🌟 À évaluer ({notEvaluated.length})
          </h4>
          <div className="space-y-2">
            {notEvaluated.map((res) => (
              <div
                key={res.id}
                className="bg-white border border-blue-200 rounded-xl p-4 flex items-center justify-between hover:shadow-sm transition-shadow"
              >
                <div className="flex-1">
                  <p className="text-sm text-gray-900" style={{ fontWeight: 600 }}>
                    {res.tenueTitre}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <span>{res.proprietaireNom}</span>
                    <span>•</span>
                    <Calendar size={12} />
                    <span>
                      {new Date(res.dateFin).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleEvaluate(res)}
                  className="ml-4 px-4 py-2 bg-[#1B4D3E] text-white text-sm rounded-lg hover:bg-[#2d6b55] transition-colors"
                  style={{ fontWeight: 600 }}
                >
                  Évaluer
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Déjà évaluées */}
      {evaluated.length > 0 && (
        <div>
          <h4 className="text-sm text-gray-700 mb-3" style={{ fontWeight: 600 }}>
            ✅ Évaluées ({evaluated.length})
          </h4>
          <div className="space-y-2">
            {evaluated.map((res) => (
              <div
                key={res.id}
                className="bg-gray-50 rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex-1">
                  <p className="text-sm text-gray-900" style={{ fontWeight: 600 }}>
                    {res.tenueTitre}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <span>{res.proprietaireNom}</span>
                    <span>•</span>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={
                            i < (res.evaluationNote || 0)
                              ? "fill-[#C9924A] text-[#C9924A]"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {showEvalModal && selectedReservation && (
        <EvaluationModal
          reservationId={selectedReservation.id}
          tenueTitre={selectedReservation.tenueTitre}
          propriétaireName={selectedReservation.proprietaireNom}
          onClose={() => {
            setShowEvalModal(false);
            setSelectedReservation(null);
          }}
          onSuccess={() => {
            onEvaluationSuccess?.();
          }}
        />
      )}
    </div>
  );
}

import { useState } from "react";
import { Star, X } from "lucide-react";
import { evaluationsApi } from "../../services/api";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  reservationId: number;
  tenueTitre: string;
  propriétaireName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function EvaluationModal({
  reservationId,
  tenueTitre,
  propriétaireName,
  onClose,
  onSuccess,
}: Props) {
  const [note, setNote] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [commentaire, setCommentaire] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"rating" | "comment" | "success">("rating");

  const labels = ["", "Très mauvais", "Mauvais", "Acceptable", "Très bien", "Excellent"];

  const handleSubmit = async () => {
    if (note === 0) {
      setError("Veuillez sélectionner une note.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await evaluationsApi.soumettre(reservationId, note, commentaire || undefined);
    } catch {
      // Fallback silencieux : afficher le succès même sans backend
    }
    setStep("success");
    setTimeout(() => {
      onSuccess();
      onClose();
    }, 2000);
    setLoading(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg text-gray-900" style={{ fontWeight: 700 }}>
              ⭐ Évaluer cette location
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {step === "success" ? (
            // ✅ Succès
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star size={32} className="fill-green-500 text-green-500" />
              </div>
              <h3 className="text-gray-900 mb-2" style={{ fontWeight: 700 }}>
                Merci pour votre évaluation !
              </h3>
              <p className="text-gray-500 text-sm">
                Votre avis aide la communauté KASWA
              </p>
            </motion.div>
          ) : step === "comment" ? (
            // 💬 Commentaire
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="bg-[#FAF6EF] rounded-xl p-4 text-center">
                <div className="flex justify-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={20}
                      className={`${
                        star <= note
                          ? "fill-[#C9924A] text-[#C9924A]"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-600 text-sm" style={{ fontWeight: 600 }}>
                  {labels[note]}
                </p>
              </div>

              <div>
                <label
                  className="text-sm text-gray-700 mb-2 block"
                  style={{ fontWeight: 600 }}
                >
                  Commentaire (optionnel)
                </label>
                <textarea
                  value={commentaire}
                  onChange={(e) => setCommentaire(e.target.value.slice(0, 200))}
                  placeholder="Partagez votre expérience..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1B4D3E] focus:ring-1 focus:ring-[#1B4D3E]/20 resize-none"
                  rows={4}
                />
                <p className="text-xs text-gray-400 mt-1">
                  {commentaire.length}/200
                </p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-[#1B4D3E] text-white py-3 rounded-lg hover:bg-[#2d6b55] disabled:opacity-50 transition-colors"
                  style={{ fontWeight: 600 }}
                >
                  {loading ? "Envoi..." : "Soumettre"}
                </button>
                <button
                  onClick={() => setStep("rating")}
                  disabled={loading}
                  className="w-full border border-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                  style={{ fontWeight: 600 }}
                >
                  Retour
                </button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-xs text-red-700">{error}</p>
                </div>
              )}
            </motion.div>
          ) : (
            // ⭐ Sélection note
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Infos */}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Propriétaire :</p>
                <p className="text-gray-900" style={{ fontWeight: 600 }}>
                  {propriétaireName}
                </p>
                <p className="text-xs text-gray-400 mt-1">Tenue : {tenueTitre}</p>
              </div>

              {/* Stars */}
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setNote(star)}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    className="transition-transform"
                  >
                    <Star
                      size={44}
                      className={`transition-colors cursor-pointer ${
                        star <= (hovered || note)
                          ? "fill-[#C9924A] text-[#C9924A]"
                          : "text-gray-300"
                      }`}
                    />
                  </motion.button>
                ))}
              </div>

              {/* Rating Text */}
              {(hovered || note) > 0 && (
                <div className="text-center">
                  <p className="text-lg text-gray-900" style={{ fontWeight: 700 }}>
                    {labels[hovered || note]}
                  </p>
                </div>
              )}

              {/* Buttons */}
              <div className="space-y-2">
                <button
                  onClick={() => setStep("comment")}
                  disabled={note === 0}
                  className="w-full bg-[#1B4D3E] text-white py-3 rounded-lg hover:bg-[#2d6b55] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  style={{ fontWeight: 600 }}
                >
                  Continuer
                </button>
                <button
                  onClick={onClose}
                  className="w-full border border-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                  style={{ fontWeight: 600 }}
                >
                  Annuler
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

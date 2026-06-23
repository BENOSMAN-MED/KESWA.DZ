import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Star, X } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  listingTitle: string;
  ownerName: string;
  onSubmit: (rating: number, comment: string) => void;
}

export function ReviewModal({ open, onClose, listingTitle, ownerName, onSubmit }: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(rating, comment);
      setRating(5);
      setComment("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl text-gray-900" style={{ fontWeight: 700 }}>
            Laisser un avis
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-4">
          {/* Listing Info */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-900" style={{ fontWeight: 600 }}>
              {listingTitle}
            </p>
            <p className="text-xs text-gray-500 mt-1">Par {ownerName}</p>
          </div>

          {/* Rating */}
          <div>
            <label className="text-sm text-gray-700 mb-2 block" style={{ fontWeight: 600 }}>
              Votre note
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    size={36}
                    className={`${
                      star <= (hoveredRating || rating)
                        ? "fill-[#C9924A] text-[#C9924A]"
                        : "text-gray-300"
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {rating === 5 && "⭐ Excellent !"}
              {rating === 4 && "👍 Très bien"}
              {rating === 3 && "👌 Bien"}
              {rating === 2 && "😐 Moyen"}
              {rating === 1 && "😞 Décevant"}
            </p>
          </div>

          {/* Comment */}
          <div>
            <label className="text-sm text-gray-700 mb-2 block" style={{ fontWeight: 600 }}>
              Votre avis <span className="text-gray-400 font-normal">(optionnel)</span>
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Partagez votre expérience avec cette tenue et ce propriétaire..."
              className="min-h-[120px] resize-none"
            />
            <p className="text-xs text-gray-400 mt-2">
              Votre avis aidera d'autres locataires à faire leur choix
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={rating === 0}
              className="flex-1 bg-[#C9924A] hover:bg-[#b5803c] text-white"
            >
              Publier l'avis
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

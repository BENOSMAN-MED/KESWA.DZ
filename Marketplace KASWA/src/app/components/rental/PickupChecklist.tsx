import React, { useState } from "react";
import { Booking, Listing } from "../../data/mockData";
import { CheckCircle, X, AlertCircle } from "lucide-react";

interface PickupChecklistProps {
  booking: Booking;
  listing: Listing;
  renterName: string;
  onValidate: (checklist: PickupChecklistData) => void;
  onCancel: () => void;
}

export interface PickupChecklistData {
  generalCondition: boolean;
  accessoriesComplete: boolean;
  acceptableCondition: boolean;
  noVisibleDamage: boolean;
  itemsReceived: string;
  notes: string;
}

export function PickupChecklist({ booking, listing, renterName, onValidate, onCancel }: PickupChecklistProps) {
  const [checklist, setChecklist] = useState<PickupChecklistData>({
    generalCondition: false,
    accessoriesComplete: false,
    acceptableCondition: false,
    noVisibleDamage: false,
    itemsReceived: "",
    notes: "",
  });

  const handleCheckboxChange = (field: keyof PickupChecklistData, value: boolean) => {
    setChecklist((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTextChange = (field: keyof PickupChecklistData, value: string) => {
    setChecklist((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const allRequiredChecked =
    checklist.generalCondition &&
    checklist.accessoriesComplete &&
    checklist.acceptableCondition &&
    checklist.noVisibleDamage &&
    checklist.itemsReceived.trim() !== "";

  const handleSubmit = () => {
    if (!allRequiredChecked) {
      alert("Veuillez compléter toutes les vérifications obligatoires");
      return;
    }
    onValidate(checklist);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#1B4D3E] to-[#2d6b55] text-white p-4 flex items-center justify-between rounded-t-lg">
          <div>
            <h2 className="text-xl font-bold">Check-list de retrait</h2>
            <p className="text-sm text-white/90 mt-0.5">Vérification avant location</p>
          </div>
          <button
            onClick={onCancel}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Article Info */}
          <div className="mb-5 p-3 bg-[#FAF6EF] rounded-lg border-l-4 border-[#C9924A]">
            <p className="text-sm font-semibold text-gray-800">{listing.title}</p>
            <p className="text-xs text-gray-600 mt-0.5">Locataire: {renterName}</p>
            <p className="text-xs text-gray-500">
              Du {new Date(booking.startDate).toLocaleDateString("fr-FR")} au{" "}
              {new Date(booking.endDate).toLocaleDateString("fr-FR")}
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-5 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-800">Important</p>
              <p className="text-xs text-blue-700 mt-1">
                Vérifiez attentivement l'état de la tenue avant de la récupérer. Cette checklist vous protège en cas de litige.
              </p>
            </div>
          </div>

          {/* Checklist Items */}
          <div className="space-y-3 mb-5">
            <label className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={checklist.generalCondition}
                onChange={(e) => handleCheckboxChange("generalCondition", e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-[#1B4D3E] focus:ring-[#1B4D3E] cursor-pointer"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors flex-1">
                État général satisfaisant
              </span>
              {checklist.generalCondition && (
                <CheckCircle className="w-4 h-4 text-green-600" />
              )}
            </label>

            <label className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={checklist.accessoriesComplete}
                onChange={(e) => handleCheckboxChange("accessoriesComplete", e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-[#1B4D3E] focus:ring-[#1B4D3E] cursor-pointer"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors flex-1">
                Tous les accessoires présents
              </span>
              {checklist.accessoriesComplete && (
                <CheckCircle className="w-4 h-4 text-green-600" />
              )}
            </label>

            <label className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={checklist.acceptableCondition}
                onChange={(e) => handleCheckboxChange("acceptableCondition", e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-[#1B4D3E] focus:ring-[#1B4D3E] cursor-pointer"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors flex-1">
                Propreté conforme
              </span>
              {checklist.acceptableCondition && (
                <CheckCircle className="w-4 h-4 text-green-600" />
              )}
            </label>

            <label className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={checklist.noVisibleDamage}
                onChange={(e) => handleCheckboxChange("noVisibleDamage", e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-[#1B4D3E] focus:ring-[#1B4D3E] cursor-pointer"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors flex-1">
                Aucun dommage visible
              </span>
              {checklist.noVisibleDamage && (
                <CheckCircle className="w-4 h-4 text-green-600" />
              )}
            </label>
          </div>

          {/* Items Received */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Articles reçus <span className="text-red-500">*</span>
            </label>
            <textarea
              value={checklist.itemsReceived}
              onChange={(e) => handleTextChange("itemsReceived", e.target.value)}
              placeholder="Ex: Robe, ceinture, voile, bijoux..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B4D3E] focus:border-[#1B4D3E] resize-none"
              rows={3}
            />
          </div>

          {/* Notes */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes ou observations (optionnel)
            </label>
            <textarea
              value={checklist.notes}
              onChange={(e) => handleTextChange("notes", e.target.value)}
              placeholder="Ajoutez vos remarques..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B4D3E] focus:border-[#1B4D3E] resize-none"
              rows={2}
            />
          </div>

          {/* Validation Summary */}
          {!allRequiredChecked && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-5">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-orange-800">Checklist incomplète</p>
                  <p className="text-xs text-orange-700 mt-1">
                    Veuillez cocher toutes les cases et lister les articles reçus avant de valider.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              disabled={!allRequiredChecked}
              className={`flex-1 px-4 py-2.5 text-sm font-medium text-white rounded-lg transition-colors ${
                allRequiredChecked
                  ? "bg-[#1B4D3E] hover:bg-[#163d32]"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Valider le retrait
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

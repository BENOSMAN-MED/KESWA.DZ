import React, { useState } from "react";
import { Booking, Listing } from "../../data/mockData";
import { AlertTriangle, X, CheckCircle } from "lucide-react";

interface ReturnChecklistProps {
  booking: Booking;
  listing: Listing;
  renterName: string;
  onValidate: (checklist: ReturnChecklistData) => void;
  onCancel: () => void;
}

export interface ReturnChecklistData {
  generalCondition: boolean;
  accessoriesComplete: boolean;
  acceptableCondition: boolean;
  needsCleaning: boolean;
  damagesFound: boolean;
  damageDescription: string;
  cautionDeduction: number;
}

export function ReturnChecklist({ booking, listing, renterName, onValidate, onCancel }: ReturnChecklistProps) {
  const [checklist, setChecklist] = useState<ReturnChecklistData>({
    generalCondition: false,
    accessoriesComplete: false,
    acceptableCondition: false,
    needsCleaning: false,
    damagesFound: false,
    damageDescription: "",
    cautionDeduction: 0,
  });

  const handleCheckboxChange = (field: keyof ReturnChecklistData, value: boolean) => {
    setChecklist((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTextChange = (value: string) => {
    setChecklist((prev) => ({
      ...prev,
      damageDescription: value,
    }));
  };

  const handleCautionChange = (value: string) => {
    const num = parseFloat(value) || 0;
    setChecklist((prev) => ({
      ...prev,
      cautionDeduction: Math.min(Math.max(0, num), booking.caution),
    }));
  };

  const hasIssues = checklist.needsCleaning || checklist.damagesFound;
  const returnAccepted =
    checklist.generalCondition &&
    checklist.accessoriesComplete &&
    checklist.acceptableCondition;

  const handleSubmit = () => {
    if (hasIssues && checklist.cautionDeduction === 0 && !confirm(
      "Vous avez signalé des problèmes mais aucune retenue de caution. Continuer ?"
    )) {
      return;
    }
    onValidate(checklist);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#C9924A] to-[#b88440] text-white p-4 flex items-center justify-between rounded-t-lg">
          <div>
            <h2 className="text-xl font-bold">Check-list de retour</h2>
            <p className="text-sm text-white/90 mt-0.5">Vérification après location</p>
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
          <div className="mb-5 p-3 bg-[#FAF6EF] rounded-lg border-l-4 border-[#1B4D3E]">
            <p className="text-sm font-semibold text-gray-800">{listing.title}</p>
            <p className="text-xs text-gray-600 mt-0.5">Locataire: {renterName}</p>
            <p className="text-xs text-gray-500">
              Retour prévu le {new Date(booking.endDate).toLocaleDateString("fr-FR")}
            </p>
            <p className="text-xs font-semibold text-[#1B4D3E] mt-2">
              Caution: {booking.caution.toLocaleString("fr-FR")} DA
            </p>
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
                Accessoires complets
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
                Propreté acceptable
              </span>
              {checklist.acceptableCondition && (
                <CheckCircle className="w-4 h-4 text-green-600" />
              )}
            </label>

            <div className="border-t border-gray-200 pt-3 mt-3">
              <p className="text-xs font-semibold text-gray-600 mb-3">Problèmes constatés</p>

              <label className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-orange-50 transition-colors">
                <input
                  type="checkbox"
                  checked={checklist.needsCleaning}
                  onChange={(e) => handleCheckboxChange("needsCleaning", e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-600 cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors flex-1">
                  Nécessite un nettoyage
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-red-50 transition-colors mt-2">
                <input
                  type="checkbox"
                  checked={checklist.damagesFound}
                  onChange={(e) => handleCheckboxChange("damagesFound", e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-600 cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors flex-1">
                  Dommages constatés
                </span>
              </label>
            </div>
          </div>

          {/* Damage Description */}
          {checklist.damagesFound && (
            <div className="mb-5 animate-fadeIn">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description des dommages <span className="text-red-500">*</span>
              </label>
              <textarea
                value={checklist.damageDescription}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="Un dommage par ligne..."
                className="w-full px-3 py-2 text-sm border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                rows={3}
              />
            </div>
          )}

          {/* Caution Deduction */}
          {hasIssues && (
            <div className="mb-5 animate-fadeIn">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Retenue sur caution (DA)
              </label>
              <input
                type="number"
                min="0"
                max={booking.caution}
                value={checklist.cautionDeduction}
                onChange={(e) => handleCautionChange(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9924A] focus:border-[#C9924A]"
              />
              <p className="text-xs text-gray-500 mt-1">
                Max: {booking.caution.toLocaleString("fr-FR")} DA
              </p>
            </div>
          )}

          {/* Status Summary */}
          {returnAccepted && !hasIssues && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-5 animate-fadeIn">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-green-800">Retour conforme</p>
                  <p className="text-xs text-green-700 mt-1">
                    La caution sera restituée intégralement au locataire.
                  </p>
                </div>
              </div>
            </div>
          )}

          {hasIssues && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-5 animate-fadeIn">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-orange-800">Vérifications nécessaires</p>
                  <p className="text-xs text-orange-700 mt-1">
                    {checklist.needsCleaning && "Un nettoyage sera requis. "}
                    {checklist.damagesFound && "Des dommages ont été signalés. "}
                    {checklist.cautionDeduction > 0 ? (
                      <>Retenue prévue: {checklist.cautionDeduction.toLocaleString("fr-FR")} DA</>
                    ) : (
                      <>Aucune retenue de caution.</>
                    )}
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
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-[#C9924A] rounded-lg hover:bg-[#b88440] transition-colors"
            >
              Valider le retour
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

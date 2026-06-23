import React, { useState } from "react";
import { Booking, Listing, User } from "../../data/mockData";
import { RentalContract } from "./RentalContract";
import { ReturnChecklist, ReturnChecklistData } from "./ReturnChecklist";
import { PickupChecklist, PickupChecklistData } from "./PickupChecklist";
import { FileText, ClipboardCheck, PackageCheck, X } from "lucide-react";

interface BookingDocumentsProps {
  booking: Booking;
  listing: Listing;
  owner: User;
  renter: User;
  currentUserRole: "owner" | "renter";
  onClose: () => void;
}

export function BookingDocuments({
  booking,
  listing,
  owner,
  renter,
  currentUserRole,
  onClose,
}: BookingDocumentsProps) {
  const [activeTab, setActiveTab] = useState<"contract">("contract");
  const [showPickupChecklist, setShowPickupChecklist] = useState(false);
  const [showReturnChecklist, setShowReturnChecklist] = useState(false);

  const handleValidatePickup = (checklist: PickupChecklistData) => {
    console.log("Checklist de retrait validée:", checklist);
    // TODO: Enregistrer la checklist dans le contexte/backend
    setShowPickupChecklist(false);
    alert("Retrait validé avec succès !");
  };

  const handleValidateReturn = (checklist: ReturnChecklistData) => {
    console.log("Checklist de retour validée:", checklist);
    // TODO: Enregistrer la checklist dans le contexte/backend
    setShowReturnChecklist(false);
    if (checklist.cautionDeduction > 0) {
      alert(
        `Retour validé. Retenue sur caution: ${checklist.cautionDeduction.toLocaleString("fr-FR")} DA`
      );
    } else {
      alert("Retour validé avec succès ! La caution sera restituée intégralement.");
    }
  };

  const handleCancelPickupChecklist = () => {
    setShowPickupChecklist(false);
  };

  const handleCancelReturnChecklist = () => {
    setShowReturnChecklist(false);
  };

  // Determine when to show each checklist button
  const canShowPickupChecklist =
    currentUserRole === "renter" &&
    (booking.status === "confirmed" || booking.status === "active") &&
    !booking.pickupChecklist;

  const canShowReturnChecklist =
    currentUserRole === "owner" &&
    (booking.status === "active" || booking.status === "completed") &&
    new Date(booking.endDate) <= new Date();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-5xl w-full my-8">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-lg p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-gray-800">Documents de location</h2>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setActiveTab("contract")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "contract"
                    ? "bg-[#1B4D3E] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <FileText className="w-4 h-4" />
                Contrat
              </button>

              {canShowPickupChecklist && (
                <button
                  onClick={() => setShowPickupChecklist(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[#1B4D3E] text-white hover:bg-[#163d32] transition-colors"
                >
                  <PackageCheck className="w-4 h-4" />
                  Checklist de retrait
                </button>
              )}

              {canShowReturnChecklist && (
                <button
                  onClick={() => setShowReturnChecklist(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[#C9924A] text-white hover:bg-[#b88440] transition-colors"
                >
                  <ClipboardCheck className="w-4 h-4" />
                  Checklist de retour
                </button>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {activeTab === "contract" && (
            <RentalContract booking={booking} listing={listing} owner={owner} renter={renter} />
          )}
        </div>
      </div>

      {/* Pickup Checklist Modal (for Renter) */}
      {showPickupChecklist && (
        <PickupChecklist
          booking={booking}
          listing={listing}
          renterName={renter.name}
          onValidate={handleValidatePickup}
          onCancel={handleCancelPickupChecklist}
        />
      )}

      {/* Return Checklist Modal (for Owner) */}
      {showReturnChecklist && (
        <ReturnChecklist
          booking={booking}
          listing={listing}
          renterName={renter.name}
          onValidate={handleValidateReturn}
          onCancel={handleCancelReturnChecklist}
        />
      )}
    </div>
  );
}

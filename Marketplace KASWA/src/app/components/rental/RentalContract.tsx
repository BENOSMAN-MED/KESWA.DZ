import React from "react";
import { Booking, Listing, User } from "../../data/mockData";
import { QrCode, Printer } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import logoImage from "../../../imports/designarena_image_56urdtwj.jpg";

interface RentalContractProps {
  booking: Booking;
  listing: Listing;
  owner: User;
  renter: User;
}

export function RentalContract({ booking, listing, owner, renter }: RentalContractProps) {
  const contractNumber = booking.id.replace("b", "");
  const durationDays = Math.ceil(
    (new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  const deposit = booking.totalPrice * 0.5; // 50% acompte
  const remainingAmount = booking.totalPrice - deposit;
  const totalAmount = booking.totalPrice + booking.caution;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white">
      {/* Print Button - Hidden when printing */}
      <div className="no-print flex justify-end mb-4">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-[#1B4D3E] text-white px-4 py-2 rounded-lg hover:bg-[#163d32] transition-colors"
        >
          <Printer className="w-5 h-5" />
          Imprimer
        </button>
      </div>

      {/* Contract Content */}
      <div className="contract-page bg-white p-8 max-w-4xl mx-auto shadow-lg border border-gray-200">
        {/* Header */}
        <div className="border-b-4 border-[#C9924A] pb-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <ImageWithFallback
                src={logoImage}
                alt="Keswa.dz"
                className="h-20 w-auto object-contain mb-3"
              />
              <p className="text-sm text-gray-600">Location de Tenues Traditionnelles</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold text-[#1B4D3E] mb-2">BON DE LOCATION</h2>
              <p className="text-lg font-semibold text-[#C9924A]">N° {contractNumber}</p>
              <p className="text-sm text-gray-600 mt-1">
                Date: {new Date(booking.createdAt).toLocaleDateString("fr-FR")}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#FAF6EF] to-white p-4 rounded-lg border-l-4 border-[#C9924A] italic text-gray-700 text-sm">
            "Nous vous remercions de votre confiance et vous souhaitons une excellente cérémonie.
            Que cette tenue traditionnelle sublime votre événement et vous apporte joie et élégance."
            <div className="text-right mt-2 text-xs font-semibold text-[#1B4D3E]">
              - Toute l'équipe Keswa.dz -
            </div>
          </div>
        </div>

        {/* Parties contractantes */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Le Loueur */}
          <div className="border-2 border-[#C9924A] rounded-lg p-4 bg-gradient-to-br from-[#FAF6EF] to-white">
            <h3 className="text-lg font-bold text-[#1B4D3E] mb-3 border-b-2 border-[#C9924A] pb-2">
              LE LOUEUR
            </h3>
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-gray-800">{owner.name}</p>
              {owner.phone && (
                <p className="text-gray-600">
                  <span className="font-medium">Tél:</span> {owner.phone}
                </p>
              )}
              {owner.wilaya && (
                <p className="text-gray-600">
                  <span className="font-medium">Wilaya:</span> {owner.wilaya}
                </p>
              )}
              {owner.email && (
                <p className="text-gray-600">
                  <span className="font-medium">Email:</span> {owner.email}
                </p>
              )}
            </div>
          </div>

          {/* Le Locataire */}
          <div className="border-2 border-[#1B4D3E] rounded-lg p-4 bg-gradient-to-br from-white to-[#FAF6EF]">
            <h3 className="text-lg font-bold text-[#1B4D3E] mb-3 border-b-2 border-[#1B4D3E] pb-2">
              LE LOCATAIRE
            </h3>
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-gray-800">{renter.name}</p>
              {renter.phone && (
                <p className="text-gray-600">
                  <span className="font-medium">Tél:</span> {renter.phone}
                </p>
              )}
              {renter.email && (
                <p className="text-gray-600">
                  <span className="font-medium">Email:</span> {renter.email}
                </p>
              )}
              {renter.wilaya && (
                <p className="text-gray-600">
                  <span className="font-medium">Wilaya:</span> {renter.wilaya}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Article Loué */}
        <div className="border-2 border-[#C9924A] rounded-lg p-4 mb-6 bg-gradient-to-r from-[#FAF6EF] to-white">
          <h3 className="text-lg font-bold text-[#1B4D3E] mb-3 border-b-2 border-[#C9924A] pb-2">
            ARTICLE LOUÉ
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">
                <span className="font-medium text-gray-800">Référence:</span> {listing.id.toUpperCase()}
              </p>
              <p className="text-gray-600">
                <span className="font-medium text-gray-800">Désignation:</span> {listing.title}
              </p>
              <p className="text-gray-600">
                <span className="font-medium text-gray-800">Catégorie:</span> {listing.type}
              </p>
            </div>
            <div>
              <p className="text-gray-600">
                <span className="font-medium text-gray-800">Taille:</span> {listing.sizes.join(", ")}
              </p>
              <p className="text-gray-600">
                <span className="font-medium text-gray-800">Couleur:</span> {listing.colors[0]}
              </p>
              <p className="text-gray-600">
                <span className="font-medium text-gray-800">État:</span> Excellent
              </p>
            </div>
          </div>
        </div>

        {/* Période de Location */}
        <div className="border-2 border-[#1B4D3E] rounded-lg p-4 mb-6 bg-gradient-to-r from-white to-[#FAF6EF]">
          <h3 className="text-lg font-bold text-[#1B4D3E] mb-3 border-b-2 border-[#1B4D3E] pb-2">
            PÉRIODE DE LOCATION
          </h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center bg-white p-3 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Date de retrait</p>
              <p className="font-semibold text-[#1B4D3E]">
                {new Date(booking.startDate).toLocaleDateString("fr-FR")}
              </p>
            </div>
            <div className="text-center bg-white p-3 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Date de retour prévue</p>
              <p className="font-semibold text-[#C9924A]">
                {new Date(booking.endDate).toLocaleDateString("fr-FR")}
              </p>
            </div>
            <div className="text-center bg-white p-3 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Durée</p>
              <p className="font-semibold text-[#1B4D3E]">{durationDays} jour{durationDays > 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>

        {/* Conditions Financières */}
        <div className="border-2 border-[#C9924A] rounded-lg p-4 mb-6 bg-gradient-to-br from-[#FAF6EF] to-white">
          <h3 className="text-lg font-bold text-[#1B4D3E] mb-3 border-b-2 border-[#C9924A] pb-2">
            CONDITIONS FINANCIÈRES
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Prix de location:</span>
              <span className="font-semibold text-gray-800">{booking.totalPrice.toLocaleString("fr-FR")} DA</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Caution:</span>
              <span className="font-semibold text-gray-800">{booking.caution.toLocaleString("fr-FR")} DA</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Acompte versé:</span>
              <span className="font-semibold text-green-600">{deposit.toLocaleString("fr-FR")} DA</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Reste à payer:</span>
              <span className="font-semibold text-orange-600">{remainingAmount.toLocaleString("fr-FR")} DA</span>
            </div>
            <div className="flex justify-between py-3 bg-[#1B4D3E] text-white px-3 rounded-lg mt-2">
              <span className="font-bold">TOTAL (Location + Caution):</span>
              <span className="font-bold text-lg">{totalAmount.toLocaleString("fr-FR")} DA</span>
            </div>
          </div>
        </div>

        {/* Conditions Générales */}
        <div className="border-2 border-gray-300 rounded-lg p-4 mb-6 bg-gray-50">
          <h3 className="text-lg font-bold text-[#1B4D3E] mb-3 border-b-2 border-gray-300 pb-2">
            CONDITIONS GÉNÉRALES
          </h3>
          <ul className="space-y-2 text-xs text-gray-700">
            <li className="flex items-start">
              <span className="text-[#C9924A] mr-2">•</span>
              <span>Le locataire s'engage à restituer l'article dans l'état où il l'a reçu.</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#C9924A] mr-2">•</span>
              <span>Toute dégradation, tache ou déchirure entraînera une retenue sur la caution.</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#C9924A] mr-2">•</span>
              <span>Le retard de restitution sera facturé au tarif journalier.</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#C9924A] mr-2">•</span>
              <span>La caution sera restituée après vérification de l'article, sous réserve de son bon état.</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#C9924A] mr-2">•</span>
              <span>Le locataire est responsable de l'article pendant toute la durée de la location.</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#C9924A] mr-2">•</span>
              <span>En cas de perte ou vol, le locataire devra s'acquitter de la valeur totale de l'article.</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#C9924A] mr-2">•</span>
              <span>Le nettoyage de l'article est à la charge du loueur, sauf en cas de salissures exceptionnelles.</span>
            </li>
          </ul>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="border-2 border-[#C9924A] rounded-lg p-4 bg-[#FAF6EF] text-center">
            <p className="font-semibold text-[#1B4D3E] mb-2">Signature du Loueur</p>
            <p className="text-sm text-gray-600 mb-8">{owner.name}</p>
            <div className="border-t-2 border-dashed border-gray-400 pt-2">
              <p className="text-xs text-gray-500 italic">Cachet et signature</p>
            </div>
          </div>
          <div className="border-2 border-[#1B4D3E] rounded-lg p-4 bg-[#FAF6EF] text-center">
            <p className="font-semibold text-[#1B4D3E] mb-2">Signature du Locataire</p>
            <p className="text-sm text-gray-600 mb-8">{renter.name}</p>
            <div className="border-t-2 border-dashed border-gray-400 pt-2">
              <p className="text-xs text-gray-500 italic">Lu et approuvé</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-4 border-[#C9924A] pt-4 text-center">
          <p className="text-sm text-[#C9924A] mb-2">
            ✨ Merci d'avoir choisi KESWA.DZ pour embellir votre événement ✨
          </p>
          <p className="text-xs text-gray-600 mb-1">Nous sommes à votre service pour toute demande future</p>
          <p className="text-xs text-gray-500 italic">Ce bon de location fait foi entre les deux parties</p>
          <p className="text-xs text-gray-500 italic">Conservez précieusement ce document</p>
        </div>
      </div>
    </div>
  );
}

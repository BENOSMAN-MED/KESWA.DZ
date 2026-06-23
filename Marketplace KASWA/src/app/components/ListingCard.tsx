import { useState } from "react";
import { Link } from "react-router";
import { Heart, Star, MapPin, Tag } from "lucide-react";
import { Listing } from "../data/mockData";
import { useApp } from "../context/AppContext";

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const { currentUser, toggleFavori, isFavori } = useApp();
  const tenueId = parseInt(listing.id);
  const liked = isFavori(tenueId);
  const [imgError, setImgError] = useState(false);

  const handleFavori = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    await toggleFavori(tenueId);
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={imgError ? "https://images.unsplash.com/photo-1649109669757-d69d5c38c1b9?w=400" : listing.images[0]}
          alt={listing.title}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {listing.featured && (
            <span className="bg-[#C9924A] text-white text-xs px-2.5 py-1 rounded-full" style={{ fontWeight: 600 }}>
              ✨ Vedette
            </span>
          )}
          {!listing.available && (
            <span className="bg-red-500 text-white text-xs px-2.5 py-1 rounded-full" style={{ fontWeight: 600 }}>
              Indisponible
            </span>
          )}
        </div>

        {/* Favorite */}
        <button
          onClick={handleFavori}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors shadow-sm"
        >
          <Heart
            size={15}
            className={liked ? "fill-red-500 text-red-500" : "text-gray-500"}
          />
        </button>

        {/* Type tag + stock */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          <span className="bg-white/90 backdrop-blur-sm text-[#1B4D3E] text-xs px-2.5 py-1 rounded-full flex items-center gap-1" style={{ fontWeight: 500 }}>
            <Tag size={11} />
            {listing.type}
          </span>
          {listing.quantite > 1 && (
            <span className="bg-[#1B4D3E] text-white text-xs px-2 py-1 rounded-full" style={{ fontWeight: 600 }}>
              {listing.quantite} dispo.
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <Link to={`/annonce/${listing.id}`}>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="text-gray-900 line-clamp-1 flex-1" style={{ fontSize: "0.95rem", fontWeight: 600 }}>
              {listing.title}
            </h3>
          </div>

          {/* Location & Rating */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1 text-gray-500">
              <MapPin size={12} />
              <span className="text-xs">{listing.wilaya}</span>
            </div>
            {listing.reviewCount > 0 ? (
              <div className="flex items-center gap-1">
                <Star size={12} className="fill-[#C9924A] text-[#C9924A]" />
                <span className="text-xs text-gray-700" style={{ fontWeight: 500 }}>
                  {listing.rating.toFixed(1)}
                </span>
                <span className="text-xs text-gray-400">({listing.reviewCount})</span>
              </div>
            ) : (
              <span className="text-xs text-gray-400">Nouveau</span>
            )}
          </div>

          {/* Sizes */}
          <div className="flex gap-1 mb-3">
            {listing.sizes.slice(0, 4).map((size) => (
              <span
                key={size}
                className="text-xs border border-gray-200 text-gray-600 px-1.5 py-0.5 rounded"
              >
                {size}
              </span>
            ))}
          </div>

          {/* Price */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div>
              <span className="text-[#1B4D3E] text-lg" style={{ fontWeight: 700 }}>
                {listing.pricePerDay.toLocaleString("fr-DZ")}
              </span>
              <span className="text-gray-400 text-xs"> DA/jour</span>
            </div>
            <div className="text-xs text-gray-400">
              Caution: {listing.caution.toLocaleString("fr-DZ")} DA
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

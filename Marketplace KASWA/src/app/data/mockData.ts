export type UserRole = "visitor" | "owner" | "renter" | "admin";

export interface ContactVerification {
  email: string;
  emailVerified: boolean;
  phone: string;
  phoneVerified: boolean;
  facePhotoUrl?: string;
}

export interface IdentityDocument {
  type: "CIN" | "Passport";
  documentNumber: string;
  fullName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  issueDate: string;
  expiryDate: string;
  documentUrl?: string;
  verified?: boolean;
}

export interface BankInfo {
  type: "CCP" | "Bank";
  accountNumber: string;
  accountKey?: string; // Pour CCP
  bankName?: string; // Pour Bank
  rib?: string; // Pour Bank
  ownerName: string;
  proofDocumentUrl?: string;
  verified?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  wilaya?: string;
  rib_barid?: string;
  verified: boolean;
  statut_verification?: "non_soumis" | "en_attente" | "verifie" | "rejete";
  motif_rejet?: string;
  type_proprietaire?: "investisseur" | "boutique";
  favoris?: number[];
  rating: number;
  reviewCount: number;
  joinedDate: string;
  contactVerification?: ContactVerification;
  identityDocument?: IdentityDocument;
  bankAccounts?: BankInfo[];
}

export interface Listing {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerAvatar?: string;
  ownerRating: number;
  title: string;
  type: string;
  occasion: string[];
  description: string;
  pricePerDay: number;
  caution: number;
  images: string[];
  sizes: string[];
  colors: string[];
  region: string;
  wilaya: string;
  available: boolean;
  availableDates?: string[];
  rating: number;
  reviewCount: number;
  featured: boolean;
  createdAt: string;
  quantite: number;
}

export interface PickupChecklist {
  generalCondition: boolean;
  accessoriesComplete: boolean;
  acceptableCondition: boolean;
  noVisibleDamage: boolean;
  itemsReceived: string;
  notes?: string;
  checkedBy: string;
  checkedAt: string;
}

export interface ReturnChecklist {
  generalCondition: boolean;
  accessoriesComplete: boolean;
  acceptableCondition: boolean;
  needsCleaning: boolean;
  damagesFound: boolean;
  damageDescription?: string;
  verificationNeeded: boolean;
  checkedBy: string;
  checkedAt: string;
}

export interface RentalContract {
  contractNumber: string;
  generatedAt: string;
  listingReference: string;
  listingCategory: string;
  listingSize: string;
  listingColor: string;
  listingCondition: "new" | "excellent" | "good";
  ownerCompanyName?: string;
  ownerRC?: string;
  ownerAddress?: string;
  ownerPhone: string;
  renterPhone: string;
  renterEmail: string;
  renterAddress?: string;
  renterCIN?: string;
  pickupDate: string;
  returnDate: string;
  durationDays: number;
  rentalPrice: number;
  caution: number;
  deposit: number;
  remainingAmount: number;
  totalAmount: number;
}

export interface Booking {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  renterId: string;
  renterName: string;
  ownerId: string;
  ownerName: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  caution: number;
  commission: number;
  status: "pending" | "confirmed" | "active" | "completed" | "cancelled" | "disputed";
  paymentMethod: string;
  createdAt: string;
  contract?: RentalContract;
  pickupChecklist?: PickupChecklist;
  returnChecklist?: ReturnChecklist;
}

export interface Review {
  id: string;
  listingId: string;
  bookingId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export const TENUE_TYPES = [
  "Chedda Tlemcénienne",
  "Caftan",
  "Karakou",
  "Chaouie",
  "Haïk",
  "Fouta",
  "Djellaba",
  "Robes Soirée",
];

export const OCCASIONS = [
  "Mariage",
  "Fiançailles",
  "Cérémonie",
  "Henna",
  "Aïd",
  "Anniversaire",
  "Bal",
  "Fête Familiale",
];

export const WILAYAS = [
  "Alger", "Oran", "Constantine", "Tlemcen", "Annaba",
  "Sétif", "Blida", "Béjaïa", "Tizi Ouzou", "Batna",
  "Sidi Bel Abbès", "Biskra", "Skikda", "Mostaganem", "Chlef",
];

export const WILAYA_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "Alger":          { lat: 36.7538, lng: 3.0588 },
  "Oran":           { lat: 35.6969, lng: -0.6331 },
  "Constantine":    { lat: 36.3650, lng: 6.6147 },
  "Tlemcen":        { lat: 34.8828, lng: -1.3159 },
  "Annaba":         { lat: 36.9000, lng: 7.7667 },
  "Sétif":          { lat: 36.1898, lng: 5.4114 },
  "Blida":          { lat: 36.4700, lng: 2.8277 },
  "Béjaïa":         { lat: 36.7600, lng: 5.0800 },
  "Tizi Ouzou":     { lat: 36.7169, lng: 4.0497 },
  "Batna":          { lat: 35.5550, lng: 6.1742 },
  "Sidi Bel Abbès": { lat: 35.1900, lng: -0.6300 },
  "Biskra":         { lat: 34.8500, lng: 5.7333 },
  "Skikda":         { lat: 36.8769, lng: 6.9063 },
  "Mostaganem":     { lat: 35.9333, lng: 0.0833 },
  "Chlef":          { lat: 36.1667, lng: 1.3333 },
  "Mascara":        { lat: 35.3950, lng: 0.1403 },
  "Médéa":          { lat: 36.2638, lng: 2.7504 },
  "Béchar":         { lat: 31.6238, lng: -2.2162 },
  "Ouargla":        { lat: 31.9539, lng: 5.3249 },
  "Ghardaïa":       { lat: 32.4935, lng: 3.6741 },
  "Tamanrasset":    { lat: 22.7851, lng: 5.5228 },
  "Adrar":          { lat: 27.8742, lng: -0.2819 },
  "Djelfa":         { lat: 34.6736, lng: 3.2634 },
  "Msila":          { lat: 35.7064, lng: 4.5408 },
  "Tiaret":         { lat: 35.3706, lng: 1.3290 },
  "Souk Ahras":     { lat: 36.2867, lng: 7.9511 },
  "Guelma":         { lat: 36.4618, lng: 7.4253 },
  "Jijel":          { lat: 36.8217, lng: 5.7660 },
  "Khenchela":      { lat: 35.4345, lng: 7.1437 },
  "Bordj Bou Arreridj": { lat: 36.0731, lng: 4.7631 },
  "Bouira":         { lat: 36.3755, lng: 3.9002 },
  "Boumerdès":      { lat: 36.7594, lng: 3.4776 },
  "Tipaza":         { lat: 36.5894, lng: 2.4479 },
  "Aïn Defla":      { lat: 36.2638, lng: 1.9659 },
  "Relizane":       { lat: 35.7380, lng: 0.5553 },
  "Saïda":          { lat: 34.8303, lng: 0.1510 },
  "Naâma":          { lat: 33.2673, lng: -0.3125 },
  "Tindouf":        { lat: 27.6741, lng: -8.1471 },
  "Illizi":         { lat: 26.5077, lng: 8.4787 },
  "Tébessa":        { lat: 35.4039, lng: 8.1249 },
  "Oum El Bouaghi": { lat: 35.8735, lng: 7.1101 },
  "El Tarf":        { lat: 36.7676, lng: 8.3133 },
  "El Oued":        { lat: 33.3700, lng: 6.8600 },
  "Laghouat":       { lat: 33.8000, lng: 2.8833 },
  "El Bayadh":      { lat: 33.6836, lng: 1.0161 },
  "Tissemsilt":     { lat: 35.6064, lng: 1.8128 },
  "Aïn Témouchent": { lat: 35.2985, lng: -1.1401 },
  "Mila":           { lat: 36.4503, lng: 6.2640 },
};

export const mockListings: Listing[] = [
  {
    id: "l1",
    ownerId: "u2",
    ownerName: "Fatima Benali",
    ownerRating: 4.9,
    title: "Chedda Tlemcénienne Brodée Or",
    type: "Chedda Tlemcénienne",
    occasion: ["Mariage", "Fiançailles"],
    description: "Magnifique Chedda Tlemcénienne authentique, brodée à la main avec des fils d'or et d'argent. Tenue complète incluant la robe, le velours, la ceinture dorée et les accessoires traditionnels. Achetée chez un maître artisan de Tlemcen. Parfaite pour un mariage traditionnel ou des fiançailles.",
    pricePerDay: 5000,
    caution: 15000,
    images: [
      "https://images.unsplash.com/photo-1709979773967-80940faecb0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1649109669757-d69d5c38c1b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    ],
    sizes: ["S", "M", "L"],
    colors: ["Bordeaux & Or", "Bleu Marine & Or"],
    region: "Ouest",
    wilaya: "Tlemcen",
    available: true,
    rating: 4.9,
    reviewCount: 23,
    featured: true,
    createdAt: "2024-01-15",
  },
  {
    id: "l2",
    ownerId: "u3",
    ownerName: "Boutique El Andalous",
    ownerRating: 4.8,
    title: "Caftan Marocain Luxe Brodé",
    type: "Caftan",
    occasion: ["Mariage", "Henna", "Cérémonie"],
    description: "Caftan luxueux en velours et soie avec broderie zari. Un chef-d'œuvre d'artisanat traditionnel. Disponible dans plusieurs couleurs. Parfait pour les grandes occasions.",
    pricePerDay: 3500,
    caution: 10000,
    images: [
      "https://images.unsplash.com/photo-1649109669258-84a962e88a32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1629332792054-caf90e135c3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Vert Émeraude & Or", "Bordeaux & Argent", "Bleu Royal & Or"],
    region: "Centre",
    wilaya: "Alger",
    available: true,
    rating: 4.8,
    reviewCount: 41,
    featured: true,
    createdAt: "2024-02-10",
  },
  {
    id: "l3",
    ownerId: "u4",
    ownerName: "Amira Kaci",
    ownerRating: 4.7,
    title: "Robe Kabyle Traditionnelle",
    type: "Robe Kabyle",
    occasion: ["Mariage", "Aïd", "Fête Familiale"],
    description: "Robe kabyle authentique avec tablier brodé de motifs berbères. Accompagnée de ses bijoux en argent traditionnels. Un trésor du patrimoine amazigh.",
    pricePerDay: 2500,
    caution: 8000,
    images: [
      "https://images.unsplash.com/photo-1667179529444-1c8e8defa2a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1726208229202-0d54c1cf2ebc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    ],
    sizes: ["S", "M", "L"],
    colors: ["Noir & Rouge", "Bleu & Argent"],
    region: "Kabylie",
    wilaya: "Tizi Ouzou",
    available: true,
    rating: 4.7,
    reviewCount: 18,
    featured: true,
    createdAt: "2024-03-05",
  },
  {
    id: "l4",
    ownerId: "u5",
    ownerName: "Hassan Meziani",
    ownerRating: 4.6,
    title: "Burnous Blanc Cérémonie",
    type: "Burnous",
    occasion: ["Mariage", "Aïd", "Cérémonie"],
    description: "Burnous traditionnel en laine fine, blanc immaculé avec broderies dorées. Idéal pour le marié ou le père lors d'une cérémonie de mariage traditionnelle.",
    pricePerDay: 2000,
    caution: 6000,
    images: [
      "https://images.unsplash.com/photo-1555545624-16240401df02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1649109669757-d69d5c38c1b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    ],
    sizes: ["M", "L", "XL"],
    colors: ["Blanc & Or", "Crème & Beige"],
    region: "Ouest",
    wilaya: "Oran",
    available: true,
    rating: 4.6,
    reviewCount: 12,
    featured: false,
    createdAt: "2024-02-20",
  },
  {
    id: "l5",
    ownerId: "u2",
    ownerName: "Fatima Benali",
    ownerRating: 4.9,
    title: "Karakou Algérois Velours",
    type: "Karakou",
    occasion: ["Mariage", "Fiançailles", "Henna"],
    description: "Karakou traditionnel algérois en velours avec broderies en fils d'or. Veste courte accompagnée de sa jupe assortie. Un symbole élégant du patrimoine algérois.",
    pricePerDay: 4000,
    caution: 12000,
    images: [
      "https://images.unsplash.com/photo-1649109669258-84a962e88a32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1709979773967-80940faecb0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    ],
    sizes: ["XS", "S", "M"],
    colors: ["Bordeaux & Or", "Noir & Or"],
    region: "Centre",
    wilaya: "Alger",
    available: false,
    rating: 4.9,
    reviewCount: 31,
    featured: true,
    createdAt: "2024-01-20",
  },
  {
    id: "l6",
    ownerId: "u3",
    ownerName: "Boutique El Andalous",
    ownerRating: 4.8,
    title: "Gandoura Brodée Constantine",
    type: "Gandoura",
    occasion: ["Aïd", "Cérémonie", "Fête Familiale"],
    description: "Gandoura traditionnelle de Constantine, brodée à la main. Légère et confortable pour les grandes occasions estivales.",
    pricePerDay: 1500,
    caution: 5000,
    images: [
      "https://images.unsplash.com/photo-1629332792054-caf90e135c3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1667179529444-1c8e8defa2a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Blanc", "Bleu Ciel", "Rose Poudré"],
    region: "Est",
    wilaya: "Constantine",
    available: true,
    rating: 4.5,
    reviewCount: 9,
    featured: false,
    createdAt: "2024-03-15",
  },
  {
    id: "l7",
    ownerId: "u4",
    ownerName: "Amira Kaci",
    ownerRating: 4.7,
    title: "Keswa El Kbira Fès",
    type: "Keswa El Kbira",
    occasion: ["Mariage", "Fiançailles"],
    description: "Keswa El Kbira authentique, la grande tenue de fête, en soie naturelle avec broderies traditionnelles. Une pièce d'exception pour les grandes cérémonies.",
    pricePerDay: 6000,
    caution: 20000,
    images: [
      "https://images.unsplash.com/photo-1649109669757-d69d5c38c1b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1726208229202-0d54c1cf2ebc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    ],
    sizes: ["S", "M"],
    colors: ["Or & Bordeaux", "Or & Vert"],
    region: "Ouest",
    wilaya: "Tlemcen",
    available: true,
    rating: 5.0,
    reviewCount: 7,
    featured: true,
    createdAt: "2024-01-05",
  },
  {
    id: "l8",
    ownerId: "u5",
    ownerName: "Hassan Meziani",
    ownerRating: 4.6,
    title: "Djellaba Nuptiale Soie",
    type: "Djellaba",
    occasion: ["Mariage", "Cérémonie", "Henna"],
    description: "Djellaba nuptiale en pure soie avec capuche brodée. Élégante et fluide, parfaite pour la cérémonie du henné.",
    pricePerDay: 2800,
    caution: 9000,
    images: [
      "https://images.unsplash.com/photo-1555545624-16240401df02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1629332792054-caf90e135c3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: ["Blanc Nacré", "Crème", "Rose Gold"],
    region: "Centre",
    wilaya: "Blida",
    available: true,
    rating: 4.4,
    reviewCount: 15,
    featured: false,
    createdAt: "2024-02-28",
  },
  {
    id: "l9",
    ownerId: "u4",
    ownerName: "Amira Kaci",
    ownerRating: 4.7,
    title: "Haïk Blanc Traditionnel Tlemcen",
    type: "Haïk",
    occasion: ["Mariage", "Cérémonie", "Aïd"],
    description: "Haïk traditionnel en mousseline blanche, finement brodé à la main. Pièce rare du patrimoine vestimentaire algérien, portée lors des grandes cérémonies.",
    pricePerDay: 1800,
    caution: 6000,
    images: [
      "https://images.unsplash.com/photo-1649109669757-d69d5c38c1b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1555545624-16240401df02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    ],
    sizes: ["Unique"],
    colors: ["Blanc Ivoire"],
    region: "Ouest",
    wilaya: "Tlemcen",
    available: true,
    rating: 4.6,
    reviewCount: 8,
    featured: false,
    createdAt: "2024-04-01",
  },
  {
    id: "l10",
    ownerId: "u3",
    ownerName: "Boutique El Andalous",
    ownerRating: 4.8,
    title: "Fouta Constantine Brodée",
    type: "Fouta",
    occasion: ["Henna", "Fête Familiale", "Aïd"],
    description: "Fouta constantinoise en coton fin avec broderies multicolores traditionnelles. Légère et colorée, idéale pour les fêtes estivales et cérémonies du henné.",
    pricePerDay: 1200,
    caution: 4000,
    images: [
      "https://images.unsplash.com/photo-1667179529444-1c8e8defa2a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1726208229202-0d54c1cf2ebc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Turquoise & Or", "Rose & Argent", "Vert & Doré"],
    region: "Est",
    wilaya: "Constantine",
    available: true,
    rating: 4.5,
    reviewCount: 19,
    featured: false,
    createdAt: "2024-03-20",
  },
  {
    id: "l11",
    ownerId: "u2",
    ownerName: "Fatima Benali",
    ownerRating: 4.9,
    title: "Chedda Tlemcénienne Argent & Bleu",
    type: "Chedda Tlemcénienne",
    occasion: ["Mariage", "Fiançailles"],
    description: "Chedda Tlemcénienne en velours bleu royal avec broderies argentées. Un chef-d'œuvre de l'artisanat tlemcénien, accompagnée de tous ses accessoires traditionnels.",
    pricePerDay: 5500,
    caution: 18000,
    images: [
      "https://images.unsplash.com/photo-1649109669258-84a962e88a32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1709979773967-80940faecb0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    ],
    sizes: ["XS", "S", "M"],
    colors: ["Bleu Royal & Argent"],
    region: "Ouest",
    wilaya: "Tlemcen",
    available: true,
    rating: 5.0,
    reviewCount: 14,
    featured: true,
    createdAt: "2024-01-10",
  },
  {
    id: "l12",
    ownerId: "u5",
    ownerName: "Hassan Meziani",
    ownerRating: 4.6,
    title: "Gandoura Homme Mariage",
    type: "Gandoura",
    occasion: ["Mariage", "Aïd", "Cérémonie"],
    description: "Gandoura homme en laine de chameau, couleur beige chaud avec broderies traditionnelles. Parfaite pour le marié ou les invités d'honneur lors d'un mariage traditionnel.",
    pricePerDay: 2200,
    caution: 7000,
    images: [
      "https://images.unsplash.com/photo-1629332792054-caf90e135c3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1555545624-16240401df02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    ],
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Beige & Or", "Blanc Cassé"],
    region: "Centre",
    wilaya: "Alger",
    available: true,
    rating: 4.3,
    reviewCount: 11,
    featured: false,
    createdAt: "2024-03-10",
  },
  {
    id: "l13",
    ownerId: "u4",
    ownerName: "Amira Kaci",
    ownerRating: 4.7,
    title: "Robe Kabyle Argent Moderne",
    type: "Robe Kabyle",
    occasion: ["Mariage", "Fiançailles", "Bal"],
    description: "Robe kabyle revisitée avec coupe moderne, brodée de fils d'argent et ornée de motifs berbères contemporains. Alliance parfaite entre tradition et modernité.",
    pricePerDay: 3000,
    caution: 10000,
    images: [
      "https://images.unsplash.com/photo-1726208229202-0d54c1cf2ebc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1667179529444-1c8e8defa2a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    ],
    sizes: ["XS", "S", "M"],
    colors: ["Noir & Argent", "Bordeaux & Argent"],
    region: "Kabylie",
    wilaya: "Béjaïa",
    available: true,
    rating: 4.8,
    reviewCount: 22,
    featured: true,
    createdAt: "2024-02-15",
  },
  {
    id: "l14",
    ownerId: "u3",
    ownerName: "Boutique El Andalous",
    ownerRating: 4.8,
    title: "Caftan Oran Luxe Brodé",
    type: "Caftan",
    occasion: ["Mariage", "Fiançailles", "Cérémonie"],
    description: "Caftan luxueux d'inspiration oranaise, brodé à la main de fils de soie et d'or. Accompagné de sa ceinture brodée assortie. Une tenue somptueuse pour les grandes occasions.",
    pricePerDay: 4500,
    caution: 14000,
    images: [
      "https://images.unsplash.com/photo-1709979773967-80940faecb0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1649109669258-84a962e88a32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: ["Vert Sapin & Or", "Violet & Argent"],
    region: "Ouest",
    wilaya: "Oran",
    available: true,
    rating: 4.9,
    reviewCount: 33,
    featured: true,
    createdAt: "2024-01-25",
  },
  {
    id: "l15",
    ownerId: "u2",
    ownerName: "Fatima Benali",
    ownerRating: 4.9,
    title: "Burnous Enfant Cérémonie",
    type: "Burnous",
    occasion: ["Mariage", "Aïd", "Cérémonie"],
    description: "Petit burnous traditionnel pour garçon (3-8 ans), en laine douce avec broderies dorées. Parfait pour le jour d'un mariage ou une fête de famille.",
    pricePerDay: 800,
    caution: 2500,
    images: [
      "https://images.unsplash.com/photo-1555545624-16240401df02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1629332792054-caf90e135c3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    ],
    sizes: ["3-4 ans", "5-6 ans", "7-8 ans"],
    colors: ["Blanc & Or", "Bleu & Or"],
    region: "Ouest",
    wilaya: "Tlemcen",
    available: true,
    rating: 4.7,
    reviewCount: 6,
    featured: false,
    createdAt: "2024-04-05",
  },
  {
    id: "l16",
    ownerId: "u5",
    ownerName: "Hassan Meziani",
    ownerRating: 4.6,
    title: "Keswa El Kbira Constantine",
    type: "Keswa El Kbira",
    occasion: ["Mariage", "Fiançailles"],
    description: "Grande tenue de cérémonie constantinoise, brodée à la main de motifs floraux délicats en fils d'or. Une pièce unique représentant le savoir-faire artisanal de l'Est algérien.",
    pricePerDay: 5000,
    caution: 16000,
    images: [
      "https://images.unsplash.com/photo-1649109669757-d69d5c38c1b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1726208229202-0d54c1cf2ebc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    ],
    sizes: ["S", "M", "L"],
    colors: ["Or & Rouge", "Or & Blanc"],
    region: "Est",
    wilaya: "Constantine",
    available: false,
    rating: 4.8,
    reviewCount: 5,
    featured: false,
    createdAt: "2024-02-01",
  },
];

export const mockBookings: Booking[] = [
  {
    id: "b1",
    listingId: "l1",
    listingTitle: "Chedda Tlemcénienne Brodée Or",
    listingImage: "https://images.unsplash.com/photo-1709979773967-80940faecb0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    renterId: "u6",
    renterName: "Nadia Boudiaf",
    ownerId: "u2",
    ownerName: "Fatima Benali",
    startDate: "2026-07-10",
    endDate: "2026-07-12",
    totalPrice: 10000,
    caution: 15000,
    commission: 1500,
    status: "confirmed",
    paymentMethod: "Barid Mobile",
    createdAt: "2026-06-20",
  },
  {
    id: "b2",
    listingId: "l2",
    listingTitle: "Caftan Marocain Luxe Brodé",
    listingImage: "https://images.unsplash.com/photo-1649109669258-84a962e88a32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    renterId: "u6",
    renterName: "Nadia Boudiaf",
    ownerId: "u3",
    ownerName: "Boutique El Andalous",
    startDate: "2026-08-20",
    endDate: "2026-08-22",
    totalPrice: 7000,
    caution: 10000,
    commission: 1050,
    status: "pending",
    paymentMethod: "CCP",
    createdAt: "2026-06-25",
  },
  {
    id: "b3",
    listingId: "l3",
    listingTitle: "Robe Kabyle Traditionnelle",
    listingImage: "https://images.unsplash.com/photo-1667179529444-1c8e8defa2a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    renterId: "u7",
    renterName: "Yasmine Amrani",
    ownerId: "u4",
    ownerName: "Amira Kaci",
    startDate: "2026-04-05",
    endDate: "2026-04-06",
    totalPrice: 2500,
    caution: 8000,
    commission: 375,
    status: "completed",
    paymentMethod: "CIB",
    createdAt: "2026-03-20",
  },
  {
    id: "b4",
    listingId: "l5",
    listingTitle: "Karakou Algérois Velours",
    listingImage: "https://images.unsplash.com/photo-1649109669258-84a962e88a32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    renterId: "u6",
    renterName: "Nadia Boudiaf",
    ownerId: "u2",
    ownerName: "Fatima Benali",
    startDate: "2026-05-15",
    endDate: "2026-05-17",
    totalPrice: 8000,
    caution: 12000,
    commission: 1200,
    status: "active",
    paymentMethod: "Barid Mobile",
    createdAt: "2026-05-01",
  },
  {
    id: "b5",
    listingId: "l7",
    listingTitle: "Keswa El Kbira Fès",
    listingImage: "https://images.unsplash.com/photo-1649109669757-d69d5c38c1b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    renterId: "u7",
    renterName: "Yasmine Amrani",
    ownerId: "u4",
    ownerName: "Amira Kaci",
    startDate: "2026-06-01",
    endDate: "2026-06-03",
    totalPrice: 12000,
    caution: 20000,
    commission: 1800,
    status: "completed",
    paymentMethod: "CIB",
    createdAt: "2026-05-10",
  },
  {
    id: "b6",
    listingId: "l11",
    listingTitle: "Chedda Tlemcénienne Argent & Bleu",
    listingImage: "https://images.unsplash.com/photo-1649109669258-84a962e88a32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    renterId: "u6",
    renterName: "Nadia Boudiaf",
    ownerId: "u2",
    ownerName: "Fatima Benali",
    startDate: "2026-09-05",
    endDate: "2026-09-07",
    totalPrice: 11000,
    caution: 18000,
    commission: 1650,
    status: "pending",
    paymentMethod: "CCP",
    createdAt: "2026-06-07",
  },
];

export const mockReviews: Review[] = [
  {
    id: "r1",
    listingId: "l1",
    bookingId: "b3",
    authorId: "u7",
    authorName: "Yasmine Amrani",
    rating: 5,
    comment: "Tenue absolument magnifique ! La broderie est d'une qualité exceptionnelle. La propriétaire était très professionnelle et arrangeante. Je recommande vivement !",
    createdAt: "2025-04-08",
  },
  {
    id: "r2",
    listingId: "l1",
    bookingId: "b1",
    authorId: "u8",
    authorName: "Samia Hadji",
    rating: 5,
    comment: "Chedda de rêve ! Exactement comme sur les photos. La tenue était parfaitement nettoyée et repassée. Service impeccable.",
    createdAt: "2025-03-15",
  },
  {
    id: "r3",
    listingId: "l2",
    bookingId: "b2",
    authorId: "u9",
    authorName: "Meriem Taleb",
    rating: 4,
    comment: "Très beau caftan, bien entretenu. La boutique est sérieuse et professionnelle. Je reviendrai pour ma prochaine occasion.",
    createdAt: "2025-02-28",
  },
];

export const mockUsers: User[] = [
  {
    id: "u1",
    name: "Admin Plateforme",
    email: "admin@keswa.dz",
    role: "admin",
    verified: true,
    rating: 5,
    reviewCount: 0,
    wilaya: "Alger",
    joinedDate: "2023-01-01",
  },
  {
    id: "u2",
    name: "Fatima Benali",
    email: "fatima@example.com",
    role: "owner",
    phone: "+213 555 123 456",
    wilaya: "Tlemcen",
    verified: true,
    rating: 4.9,
    reviewCount: 54,
    joinedDate: "2023-06-15",
  },
  {
    id: "u3",
    name: "Boutique El Andalous",
    email: "andalous@example.com",
    role: "owner",
    phone: "+213 555 789 012",
    wilaya: "Alger",
    verified: true,
    rating: 4.8,
    reviewCount: 89,
    joinedDate: "2023-03-20",
  },
  {
    id: "u4",
    name: "Amira Kaci",
    email: "amira@example.com",
    role: "owner",
    phone: "+213 555 345 678",
    wilaya: "Tizi Ouzou",
    verified: true,
    rating: 4.7,
    reviewCount: 31,
    joinedDate: "2023-09-10",
  },
  {
    id: "u6",
    name: "Nadia Boudiaf",
    email: "nadia@example.com",
    role: "renter",
    phone: "+213 555 901 234",
    wilaya: "Alger",
    verified: true,
    rating: 4.8,
    reviewCount: 7,
    joinedDate: "2024-01-05",
  },
  {
    id: "u7",
    name: "Yasmine Amrani",
    email: "yasmine@example.com",
    role: "renter",
    phone: "+213 555 432 198",
    wilaya: "Tizi Ouzou",
    verified: true,
    rating: 4.9,
    reviewCount: 12,
    joinedDate: "2024-02-10",
  },
];

export const platformStats = {
  totalListings: 312,
  totalUsers: 2147,
  totalBookings: 4156,
  totalRevenue: 6234000,
  commissionRate: 0.15,
  averageRating: 4.8,
};

export interface MockMessage {
  id: string;
  fromId: string;
  toId: string;
  contenu: string;
  lu: boolean;
  createdAt: string;
}

export const mockMessages: MockMessage[] = [
  // Conversation Nadia ↔ Fatima (à propos de Chedda)
  { id: "msg1", fromId: "u6", toId: "u2", contenu: "Bonjour, la Chedda Tlemcénienne est-elle disponible du 15 au 17 mai ?", lu: true, createdAt: "2025-04-20T10:00:00" },
  { id: "msg2", fromId: "u2", toId: "u6", contenu: "Bonjour Nadia ! Oui elle est disponible à ces dates. Elle est en parfait état, brodée à la main. 😊", lu: true, createdAt: "2025-04-20T10:15:00" },
  { id: "msg3", fromId: "u6", toId: "u2", contenu: "Super ! Quelle est la taille disponible ? Je fais du M.", lu: true, createdAt: "2025-04-20T10:20:00" },
  { id: "msg4", fromId: "u2", toId: "u6", contenu: "Parfait, nous avons du S, M et L. Le M vous conviendra parfaitement. Souhaitez-vous réserver ?", lu: true, createdAt: "2025-04-20T10:30:00" },
  { id: "msg5", fromId: "u6", toId: "u2", contenu: "Oui je vais faire la réservation maintenant. Merci beaucoup !", lu: false, createdAt: "2025-04-20T10:45:00" },
  // Conversation Yasmine ↔ Amira (Robe Kabyle)
  { id: "msg6", fromId: "u7", toId: "u4", contenu: "Salam, est-ce que les bijoux sont inclus avec la robe kabyle ?", lu: true, createdAt: "2025-03-18T14:00:00" },
  { id: "msg7", fromId: "u4", toId: "u7", contenu: "Wa alaykum salam ! Oui, les bijoux en argent traditionnels sont inclus. Collier, bracelets et boucles d'oreilles.", lu: true, createdAt: "2025-03-18T14:30:00" },
  { id: "msg8", fromId: "u7", toId: "u4", contenu: "Magnifique ! Et est-il possible de voir la tenue avant de réserver ?", lu: true, createdAt: "2025-03-18T15:00:00" },
  { id: "msg9", fromId: "u4", toId: "u7", contenu: "Bien sûr ! Je suis disponible le weekend à Tizi Ouzou. On peut arranger ça.", lu: true, createdAt: "2025-03-18T15:15:00" },
  { id: "msg10", fromId: "u7", toId: "u4", contenu: "Parfait, samedi matin ça vous convient ? Vers 10h ?", lu: true, createdAt: "2025-03-18T15:20:00" },
  { id: "msg11", fromId: "u4", toId: "u7", contenu: "Samedi à 10h c'est parfait ! À bientôt 😊", lu: true, createdAt: "2025-03-18T15:25:00" },
];
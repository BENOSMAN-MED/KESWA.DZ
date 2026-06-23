// Types étendus pour le système de gestion complet
import { Listing, Booking, User } from "./mockData";

// Statuts et conditions
export type ItemStatus = "available" | "rented" | "cleaning" | "repair" | "retired";
export type ItemCondition = "excellent" | "good" | "fair" | "worn";
export type MaintenanceType = "cleaning" | "repair" | "inspection";
export type PaymentStatus = "pending" | "partial" | "paid" | "refunded" | "overdue";
export type TaskStatus = "pending" | "in_progress" | "completed" | "cancelled";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

// Accessoires
export interface Accessory {
  id: string;
  name: string;
  quantity: number;
  included: boolean;
  price?: number;
}

// Historique de maintenance
export interface MaintenanceRecord {
  id: string;
  listingId: string;
  date: string;
  type: MaintenanceType;
  cost: number;
  provider?: string;
  providerContact?: string;
  notes: string;
  photos?: string[];
  performedBy: string;
  nextMaintenanceDate?: string;
}

// Tenue étendue avec gestion complète
export interface ExtendedListing extends Listing {
  status: ItemStatus;
  condition: ItemCondition;
  priceWeekend?: number;
  priceWeek?: number;
  purchaseDate?: string;
  purchasePrice?: number;
  totalRentals: number;
  totalRevenue: number;
  lastMaintenance?: string;
  nextMaintenanceDue?: string;
  accessories?: Accessory[];
  maintenanceHistory?: MaintenanceRecord[];
  material?: string;
  origin?: string;
  sku?: string;
  retired?: boolean;
  retiredDate?: string;
  retiredReason?: string;
}

// Réservation étendue
export interface ExtendedBooking extends Booking {
  fittingDate?: string;
  fittingCompleted?: boolean;
  deliveryMethod?: "pickup" | "delivery" | "courier";
  deliveryAddress?: string;
  deliveryCost?: number;
  returnDate?: string;
  returnCompleted?: boolean;
  inspectionNotes?: string;
  damageReported?: boolean;
  damageDescription?: string;
  damagePhotos?: string[];
  damageCost?: number;
  lateDays?: number;
  lateFees?: number;
  paymentStatus?: PaymentStatus;
  depositReturned?: boolean;
  depositReturnDate?: string;
}

// Paiements
export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  type: "rental" | "caution" | "damage" | "late_fee" | "deposit_return";
  method: string;
  status: PaymentStatus;
  date: string;
  reference?: string;
  notes?: string;
}

// Factures
export interface Invoice {
  id: string;
  bookingId: string;
  number: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  paidDate?: string;
  notes?: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// Programme de fidélité
export interface LoyaltyProgram {
  id: string;
  userId: string;
  points: number;
  tier: "bronze" | "silver" | "gold" | "platinum";
  totalSpent: number;
  totalRentals: number;
  discountRate: number;
  benefits: string[];
}

// Utilisateur étendu
export interface ExtendedUser extends User {
  loyaltyPoints?: number;
  loyaltyTier?: "bronze" | "silver" | "gold" | "platinum";
  favorites?: string[];
  preferences?: {
    sizes?: string[];
    occasions?: string[];
    priceRange?: { min: number; max: number };
    notificationEmail?: boolean;
    notificationSMS?: boolean;
  };
  totalSpent?: number;
  totalRentals?: number;
  blockedUntil?: string;
  blockedReason?: string;
}

// Tâches opérationnelles
export interface Task {
  id: string;
  type: "cleaning" | "repair" | "inspection" | "delivery" | "pickup" | "fitting";
  title: string;
  description: string;
  listingId?: string;
  bookingId?: string;
  assignedTo?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  completedDate?: string;
  estimatedCost?: number;
  actualCost?: number;
  notes?: string;
  photos?: string[];
}

// Prestataires externes
export interface Provider {
  id: string;
  name: string;
  type: "cleaning" | "repair" | "delivery" | "other";
  contact: string;
  phone: string;
  email?: string;
  address?: string;
  rating: number;
  totalServices: number;
  averageCost: number;
  notes?: string;
}

// Calendrier de disponibilité
export interface AvailabilityCalendar {
  listingId: string;
  blockedDates: DateRange[];
  reservedDates: DateRange[];
  maintenanceDates: DateRange[];
}

export interface DateRange {
  start: string;
  end: string;
  reason?: string;
  bookingId?: string;
}

// Statistiques et analyses
export interface DashboardStats {
  period: "day" | "week" | "month" | "year";
  totalRevenue: number;
  totalBookings: number;
  averageBookingValue: number;
  occupancyRate: number;
  topListings: ListingPerformance[];
  revenueByType: { type: string; revenue: number }[];
  bookingsByStatus: { status: string; count: number }[];
  upcomingMaintenance: MaintenanceRecord[];
  pendingTasks: Task[];
}

export interface ListingPerformance {
  listingId: string;
  title: string;
  totalRentals: number;
  totalRevenue: number;
  occupancyRate: number;
  averageRating: number;
  maintenanceCost: number;
  profit: number;
  roi: number;
}

// Notifications
export interface Notification {
  id: string;
  userId: string;
  type: "booking" | "payment" | "maintenance" | "review" | "system";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

// Messages
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  bookingId?: string;
  subject?: string;
  message: string;
  read: boolean;
  createdAt: string;
}

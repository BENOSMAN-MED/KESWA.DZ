import { createBrowserRouter, useLocation } from "react-router";
import React, { lazy, Suspense } from "react";
import { AnimatePresence } from "motion/react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ProtectedRoute } from "./components/ProtectedRoute";

// ─── Chargement immédiat (pages critiques) ─────────────────────────────────
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";

// ─── Chargement différé (lazy) ─────────────────────────────────────────────
const CatalogPage          = lazy(() => import("./pages/CatalogPage").then(m => ({ default: m.CatalogPage })));
const ListingDetailPage    = lazy(() => import("./pages/ListingDetailPage").then(m => ({ default: m.ListingDetailPage })));
const OwnerDashboard       = lazy(() => import("./pages/OwnerDashboard").then(m => ({ default: m.OwnerDashboard })));
const RenterDashboard      = lazy(() => import("./pages/RenterDashboard").then(m => ({ default: m.RenterDashboard })));
const AdminDashboard       = lazy(() => import("./pages/AdminDashboard").then(m => ({ default: m.AdminDashboard })));
const AddListingPage       = lazy(() => import("./pages/AddListingPage").then(m => ({ default: m.AddListingPage })));
const EditListingPage      = lazy(() => import("./pages/EditListingPage").then(m => ({ default: m.EditListingPage })));
const ContactPage          = lazy(() => import("./pages/ContactPage").then(m => ({ default: m.ContactPage })));
const ManagementDashboard  = lazy(() => import("./pages/ManagementDashboard").then(m => ({ default: m.ManagementDashboard })));
const ProfilePage          = lazy(() => import("./pages/ProfilePage").then(m => ({ default: m.ProfilePage })));
const BookingSuccessPage   = lazy(() => import("./pages/BookingSuccessPage").then(m => ({ default: m.BookingSuccessPage })));
const MessagesPage         = lazy(() => import("./pages/MessagesPage").then(m => ({ default: m.MessagesPage })));
const CGUPage              = lazy(() => import("./pages/CGUPage").then(m => ({ default: m.CGUPage })));
const PrivacyPage          = lazy(() => import("./pages/PrivacyPage").then(m => ({ default: m.PrivacyPage })));
const InventoryManagementPage = lazy(() => import("./pages/InventoryManagementPage").then(m => ({ default: m.InventoryManagementPage })));
const FAQPage              = lazy(() => import("./pages/FAQPage").then(m => ({ default: m.FAQPage })));
const DemoPage             = lazy(() => import("./pages/DemoPage").then(m => ({ default: m.DemoPage })));
const EvaluationTestPage   = lazy(() => import("./pages/EvaluationTestPage").then(m => ({ default: m.EvaluationTestPage })));
const PaymentTestPage      = lazy(() => import("./pages/PaymentTestPage").then(m => ({ default: m.PaymentTestPage })));
const NotificationsPage    = lazy(() => import("./pages/NotificationsPage").then(m => ({ default: m.NotificationsPage })));
const AProposPage          = lazy(() => import("./pages/AProposPage").then(m => ({ default: m.AProposPage })));

// ─── Fallback de chargement ────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="min-h-screen bg-[#FAF6EF] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-3 border-[#1B4D3E]/20 border-t-[#1B4D3E] rounded-full animate-spin mx-auto mb-3" style={{ borderWidth: 3 }} />
        <p className="text-gray-400 text-sm">Chargement…</p>
      </div>
    </div>
  );
}

function SuspenseWrap({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <AnimatePresence mode="sync" initial={false}>
        <main className="flex-1" key={location.pathname}>
          {children}
        </main>
      </AnimatePresence>
      <Footer />
    </div>
  );
}

function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen">{children}</div>;
}

export const router = createBrowserRouter([
  { path: "/", element: <Layout><HomePage /></Layout> },
  { path: "/catalogue", element: <Layout><SuspenseWrap><CatalogPage /></SuspenseWrap></Layout> },
  { path: "/annonce/:id", element: <Layout><SuspenseWrap><ListingDetailPage /></SuspenseWrap></Layout> },
  { path: "/connexion", element: <AuthLayout><LoginPage /></AuthLayout> },
  { path: "/inscription", element: <AuthLayout><RegisterPage /></AuthLayout> },
  { path: "/dashboard/owner", element: <Layout><ProtectedRoute roles={["owner"]}><SuspenseWrap><OwnerDashboard /></SuspenseWrap></ProtectedRoute></Layout> },
  { path: "/gestion", element: <Layout><ProtectedRoute roles={["owner", "admin"]}><SuspenseWrap><ManagementDashboard /></SuspenseWrap></ProtectedRoute></Layout> },
  { path: "/dashboard/renter", element: <Layout><ProtectedRoute roles={["renter"]}><SuspenseWrap><RenterDashboard /></SuspenseWrap></ProtectedRoute></Layout> },
  { path: "/dashboard/admin", element: <Layout><ProtectedRoute roles={["admin"]}><SuspenseWrap><AdminDashboard /></SuspenseWrap></ProtectedRoute></Layout> },
  { path: "/ajouter-annonce", element: <Layout><ProtectedRoute roles={["owner"]}><SuspenseWrap><AddListingPage /></SuspenseWrap></ProtectedRoute></Layout> },
  { path: "/modifier-annonce/:id", element: <Layout><ProtectedRoute roles={["owner"]}><SuspenseWrap><EditListingPage /></SuspenseWrap></ProtectedRoute></Layout> },
  { path: "/contact", element: <Layout><SuspenseWrap><ContactPage /></SuspenseWrap></Layout> },
  { path: "/profil", element: <Layout><ProtectedRoute><SuspenseWrap><ProfilePage /></SuspenseWrap></ProtectedRoute></Layout> },
  { path: "/reservation-reussie", element: <Layout><ProtectedRoute><SuspenseWrap><BookingSuccessPage /></SuspenseWrap></ProtectedRoute></Layout> },
  { path: "/favoris", element: <Layout><ProtectedRoute roles={["renter"]}><SuspenseWrap><RenterDashboard /></SuspenseWrap></ProtectedRoute></Layout> },
  { path: "/tableau-de-bord-locataire", element: <Layout><ProtectedRoute roles={["renter"]}><SuspenseWrap><RenterDashboard /></SuspenseWrap></ProtectedRoute></Layout> },
  { path: "/messages", element: <Layout><ProtectedRoute><SuspenseWrap><MessagesPage /></SuspenseWrap></ProtectedRoute></Layout> },
  { path: "/notifications", element: <Layout><ProtectedRoute><SuspenseWrap><NotificationsPage /></SuspenseWrap></ProtectedRoute></Layout> },
  { path: "/inventaire", element: <Layout><ProtectedRoute roles={["owner"]}><SuspenseWrap><InventoryManagementPage /></SuspenseWrap></ProtectedRoute></Layout> },
  { path: "/cgu", element: <Layout><SuspenseWrap><CGUPage /></SuspenseWrap></Layout> },
  { path: "/confidentialite", element: <Layout><SuspenseWrap><PrivacyPage /></SuspenseWrap></Layout> },
  { path: "/aide", element: <Layout><SuspenseWrap><FAQPage /></SuspenseWrap></Layout> },
  { path: "/a-propos", element: <Layout><SuspenseWrap><AProposPage /></SuspenseWrap></Layout> },
  { path: "/demo", element: <Layout><SuspenseWrap><DemoPage /></SuspenseWrap></Layout> },
  { path: "/evaluation-test", element: <Layout><SuspenseWrap><EvaluationTestPage /></SuspenseWrap></Layout> },
  { path: "/payment-test", element: <Layout><SuspenseWrap><PaymentTestPage /></SuspenseWrap></Layout> },
  {
    path: "*",
    element: (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-[#FAF6EF] pt-20">
          <div className="text-center">
            <p className="text-8xl mb-4">🔍</p>
            <h1 className="text-gray-800 mb-3" style={{ fontSize: "2rem", fontWeight: 700 }}>Page introuvable</h1>
            <p className="text-gray-400 mb-6">La page que vous cherchez n'existe pas.</p>
            <a href="/" className="bg-[#1B4D3E] text-white px-6 py-3 rounded-full text-sm" style={{ fontWeight: 600 }}>
              Retour à l'accueil
            </a>
          </div>
        </div>
      </Layout>
    ),
  },
]);

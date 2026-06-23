import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import {
  Star, MapPin, Shield, ArrowLeft, ChevronLeft, ChevronRight,
  CheckCircle, Tag, Calendar, MessageCircle, Heart, Loader2, Store, Info,
  Truck, CreditCard, Banknote, AlertCircle
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { tenuesApi, reservationsApi, favorisApi } from "../../services/api";
import { evaluationsApi } from "../../services/api";
import { motion } from "motion/react";
import { toast } from "react-toastify";
import { STORAGE_URL } from "../../services/storageUrl";
const FALLBACK_IMG = "https://images.unsplash.com/photo-1649109669258-84a962e88a32?w=800&h=600&fit=crop";

interface Proprietaire {
  id: number;
  nom: string;
  score_rep: number;
  verifie: boolean;
  type_proprietaire?: "investisseur" | "boutique";
  nom_boutique?: string;
  adresse_boutique?: string;
}

interface Tenue {
  id: number;
  titre: string;
  type: string;
  description: string;
  prix_jour: number;
  caution: number;
  tailles: string[];
  taille: string;
  couleurs: string[];
  wilaya: string;
  statut: string;
  quantite: number;
  photos: { chemin: string; principale: boolean }[];
  proprietaire: Proprietaire;
}

interface Evaluation {
  id: number;
  note: number;
  commentaire: string;
  auteur_type: string;
  created_at: string;
  auteur?: { nom: string };
}

const FRAIS_SERVICE = 250;

type TarifWilaya = { domicile: number | null; relais: number | null; duree: string };
const TARIFS_LIVRAISON: Record<string, TarifWilaya> = {
  "Adrar":               { domicile: 1100, relais: 700,  duree: "4-7 jours" },
  "Chlef":               { domicile: 600,  relais: 350,  duree: "1-2 jours" },
  "Laghouat":            { domicile: 700,  relais: 500,  duree: "1-3 jours" },
  "Oum El Bouaghi":      { domicile: 800,  relais: 450,  duree: "2-4 jours" },
  "Batna":               { domicile: 700,  relais: 400,  duree: "2-4 jours" },
  "Béjaïa":              { domicile: 550,  relais: 300,  duree: "1-3 jours" },
  "Biskra":              { domicile: 800,  relais: 600,  duree: "2-4 jours" },
  "Béchar":              { domicile: 1000, relais: 1000, duree: "3-5 jours" },
  "Blida":               { domicile: 250,  relais: 0,    duree: "24h" },
  "Bouira":              { domicile: 600,  relais: 400,  duree: "1-2 jours" },
  "Tamanrasset":         { domicile: 1200, relais: 700,  duree: "4-7 jours" },
  "Tébessa":             { domicile: 700,  relais: 450,  duree: "2-4 jours" },
  "Tlemcen":             { domicile: 700,  relais: 400,  duree: "1-3 jours" },
  "Tiaret":              { domicile: 700,  relais: 400,  duree: "1-3 jours" },
  "Tizi Ouzou":          { domicile: 550,  relais: 350,  duree: "1-2 jours" },
  "Alger":               { domicile: 250,  relais: 100,  duree: "24h" },
  "Djelfa":              { domicile: 700,  relais: 500,  duree: "1-3 jours" },
  "Jijel":               { domicile: 600,  relais: 400,  duree: "1-3 jours" },
  "Sétif":               { domicile: 550,  relais: 350,  duree: "1-3 jours" },
  "Saïda":               { domicile: 800,  relais: 800,  duree: "2-4 jours" },
  "Skikda":              { domicile: 650,  relais: 400,  duree: "2-4 jours" },
  "Sidi Bel Abbès":      { domicile: 650,  relais: 400,  duree: "1-3 jours" },
  "Annaba":              { domicile: 550,  relais: 350,  duree: "1-3 jours" },
  "Guelma":              { domicile: 700,  relais: 450,  duree: "2-4 jours" },
  "Constantine":         { domicile: 550,  relais: 350,  duree: "1-3 jours" },
  "Médéa":               { domicile: 600,  relais: 400,  duree: "1-2 jours" },
  "Mostaganem":          { domicile: 600,  relais: 400,  duree: "1-3 jours" },
  "M'Sila":              { domicile: 650,  relais: 400,  duree: "2-4 jours" },
  "Mascara":             { domicile: 650,  relais: 450,  duree: "2-4 jours" },
  "Ouargla":             { domicile: 900,  relais: 600,  duree: "2-4 jours" },
  "Oran":                { domicile: 500,  relais: 300,  duree: "1-3 jours" },
  "El Bayadh":           { domicile: 900,  relais: 600,  duree: "3-5 jours" },
  "Illizi":              { domicile: null,  relais: null,  duree: "Non disponible" },
  "Bordj Bou Arréridj":  { domicile: 600,  relais: 400,  duree: "1-3 jours" },
  "Boumerdès":           { domicile: 500,  relais: 350,  duree: "1-2 jours" },
  "El Tarf":             { domicile: 700,  relais: 450,  duree: "2-4 jours" },
  "Tindouf":             { domicile: 1300, relais: 1300, duree: "4-7 jours" },
  "Tissemsilt":          { domicile: 700,  relais: 700,  duree: "1-3 jours" },
  "El Oued":             { domicile: 800,  relais: 500,  duree: "2-4 jours" },
  "Khenchela":           { domicile: 700,  relais: 700,  duree: "2-4 jours" },
  "Souk Ahras":          { domicile: 800,  relais: 450,  duree: "2-4 jours" },
  "Tipasa":              { domicile: 500,  relais: 350,  duree: "1-2 jours" },
  "Mila":                { domicile: 700,  relais: 450,  duree: "1-3 jours" },
  "Aïn Defla":           { domicile: 600,  relais: 400,  duree: "1-2 jours" },
  "Naâma":               { domicile: 900,  relais: 600,  duree: "3-5 jours" },
  "Aïn Timouchent":      { domicile: 600,  relais: 450,  duree: "1-3 jours" },
  "Ghardaïa":            { domicile: 800,  relais: 500,  duree: "2-4 jours" },
  "Relizane":            { domicile: 600,  relais: 450,  duree: "1-3 jours" },
  "Timimoun":            { domicile: 1300, relais: 1300, duree: "4-7 jours" },
  "Bordj Badji Mokhtar": { domicile: null,  relais: null,  duree: "Non disponible" },
  "Ouled Djellal":       { domicile: 800,  relais: 800,  duree: "2-4 jours" },
  "Béni Abbès":          { domicile: 1000, relais: 1000, duree: "3-5 jours" },
  "In Salah":            { domicile: 1400, relais: 1400, duree: "4-7 jours" },
  "In Guezzam":          { domicile: null,  relais: null,  duree: "Non disponible" },
  "Touggourt":           { domicile: 900,  relais: 900,  duree: "2-4 jours" },
  "Djanet":              { domicile: null,  relais: null,  duree: "Non disponible" },
  "El Meghaier":         { domicile: 900,  relais: 900,  duree: "2-4 jours" },
  "El Méniaâ":           { domicile: 900,  relais: 900,  duree: "2-4 jours" },
};

const COMMUNES_PAR_WILAYA: Record<string, string[]> = {
  "Adrar":              ["Adrar","Aoulef","Reggane","Timimoun","Bordj Badji Mokhtar"],
  "Chlef":             ["Chlef","Ténès","Oued Fodda","El Karimia","Boukadir"],
  "Laghouat":          ["Laghouat","Aflou","Hassi R'Mel","Ksar El Hirane"],
  "Oum El Bouaghi":    ["Oum El Bouaghi","Aïn Beïda","Aïn M'Lila","Meskiana"],
  "Batna":             ["Batna","Barika","Arris","Merouana","Aïn Touta","Timgad"],
  "Béjaïa":            ["Béjaïa","Akbou","Sidi Aïch","Kherrata","Tichy","El Kseur"],
  "Biskra":            ["Biskra","Tolga","Sidi Okba","El Outaya","Ouled Djellal"],
  "Béchar":            ["Béchar","Abadla","Kenadsa","Beni Abbes","Taghit"],
  "Blida":             ["Blida","Boufarik","Larbaa","Meftah","Chréa","Bougara"],
  "Bouira":            ["Bouira","Lakhdaria","M'Chedallah","Aïn Bessem","Sour El Ghozlane"],
  "Tamanrasset":       ["Tamanrasset","Abalessa","In Salah","In Guezzam"],
  "Tébessa":           ["Tébessa","Cheria","El Aouinet","Bir El Ater","Ouenza"],
  "Tlemcen":           ["Tlemcen","Maghnia","Ghazaouet","Remchi","Nedroma","Beni Saf","Sebdou","Mansourah"],
  "Tiaret":            ["Tiaret","Frenda","Sougueur","Ksar Chellala","Mahdia"],
  "Tizi Ouzou":        ["Tizi Ouzou","Azazga","Draa Ben Khedda","Makouda","Larbaa Nath Irathen","Tigzirt"],
  "Alger":             ["Alger Centre","Bab El Oued","El Harrach","Hussein Dey","Kouba","Bouzaréah","Bir Mourad Raïs","El Biar","Hydra","Rouiba","Baraki","Dar El Beïda","Bab Ezzouar"],
  "Djelfa":            ["Djelfa","Aïn Oussera","Messaad","Birine","Charef"],
  "Jijel":             ["Jijel","El Milia","Taher","Collo","Ziama Mansouriah"],
  "Sétif":             ["Sétif","El Eulma","Aïn El Kebira","Aïn Oulmane","Bougaâ"],
  "Saïda":             ["Saïda","Aïn El Hadjar","Youb","Sidi Boubekeur"],
  "Skikda":            ["Skikda","Azzaba","El Harrouch","Tamalous","Collo"],
  "Sidi Bel Abbès":    ["Sidi Bel Abbès","Telagh","Ras El Ma","Ben Badis","Tessala"],
  "Annaba":            ["Annaba","El Hadjar","El Bouni","Berrahal","Aïn Berda"],
  "Guelma":            ["Guelma","Bouchegouf","Oued Zenati","Heliopolis"],
  "Constantine":       ["Constantine","El Khroub","Aïn Smara","Hamma Bouziane","Didouche Mourad","Zighoud Youcef"],
  "Médéa":             ["Médéa","Ksar El Boukhari","Berrouaghia","Tablat","El Omaria"],
  "Mostaganem":        ["Mostaganem","Relizane","Aïn Tédelès","Tighenif","Sidi Ali"],
  "M'Sila":            ["M'Sila","Bou Saâda","Aïn El Melh","Sidi Aïssa","Magra"],
  "Mascara":           ["Mascara","Sig","Mohammadia","Tighennif","Matemore"],
  "Ouargla":           ["Ouargla","Hassi Messaoud","Touggourt","El Hadjira","Rouissat"],
  "Oran":              ["Oran","Es Sénia","Bir El Djir","Aïn El Turck","Arzew","Bethioua","Mers El Kébir","Misserghine"],
  "El Bayadh":         ["El Bayadh","Saïda","Boualem","Rogassa"],
  "Illizi":            ["Illizi","Djanet","In Amenas"],
  "Bordj Bou Arréridj":["Bordj Bou Arréridj","Ras El Oued","El Anseur","Aïn Taghrout"],
  "Boumerdès":         ["Boumerdès","Dellys","Khemis El Khechna","Boudouaou","Thenia"],
  "El Tarf":           ["El Tarf","Ben Mehidi","Besbes","Drean","El Kala"],
  "Tindouf":           ["Tindouf"],
  "Tissemsilt":        ["Tissemsilt","Khemisti","Lazharia","Theniet El Had"],
  "El Oued":           ["El Oued","Guemar","Robbah","Debila","Kouinine"],
  "Khenchela":         ["Khenchela","Babar","Aïn Touila","Chechar"],
  "Souk Ahras":        ["Souk Ahras","Sedrata","Merahna","Taoura"],
  "Tipaza":            ["Tipaza","Koléa","Hadjout","Cherchell","Aïn Tagourait","Bou Ismaïl"],
  "Mila":              ["Mila","Ferdjioua","Grarem Gouga","Chelghoum Laïd"],
  "Aïn Defla":         ["Aïn Defla","Khemis Miliana","El Attaf","Miliana","Boumedfaa"],
  "Naâma":             ["Naâma","Méchria","Aïn Sefra","Sfissifa"],
  "Aïn Témouchent":   ["Aïn Témouchent","Hammam Bou Hadjar","El Malah","Beni Saf"],
  "Ghardaïa":          ["Ghardaïa","Metlili","El Meniaa","Daya Ben Dahoua"],
  "Relizane":          ["Relizane","Jidiouia","Mazouna","Aïn Tarek","Oued Rhiou"],
};

export function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, toggleFavori, isFavori } = useApp();

  const [tenue, setTenue] = useState<Tenue | null>(null);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImg, setCurrentImg] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [bookingStep, setBookingStep] = useState<"form" | "confirm" | "success">("form");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showContact, setShowContact] = useState(false);

  // Options réservation
  const [modeLivraison, setModeLivraison] = useState<"point_retrait" | "domicile">("point_retrait");
  const [modePaiement, setModePaiement] = useState<"sur_place" | "en_ligne">("sur_place");
  const [avecEssayage, setAvecEssayage] = useState(false);
  const [datesBloquees, setDatesBloquees] = useState<{ debut: string; fin: string }[]>([]);
  const [conflitDates, setConflitDates] = useState(false);
  const [stockDispo, setStockDispo] = useState<number | null>(null);

  const [tailleChoisie, setTailleChoisie] = useState("");
  const [couleurChoisie, setCouleurChoisie] = useState("");
  const [quantiteChoisie, setQuantiteChoisie] = useState(1);

  // Adresse livraison à domicile
  const [adresseRue, setAdresseRue] = useState("");
  const [adresseQuartier, setAdresseQuartier] = useState("");
  const [adresseCommune, setAdresseCommune] = useState("");
  const [adresseWilaya, setAdresseWilaya] = useState(currentUser?.wilaya ?? "");
  const [adresseTelephone, setAdresseTelephone] = useState(currentUser?.phone ?? "");

  useEffect(() => {
    if (!id) return;
    const charger = async () => {
      setLoading(true);
      try {
        const [tenueRes, evalRes, bloqueesRes] = await Promise.all([
          tenuesApi.detail(id),
          evaluationsApi.parTenue(Number(id)),
          tenuesApi.datesBloquees(id),
        ]);
        setTenue(tenueRes.data);
        setEvaluations(evalRes.data?.evaluations ?? evalRes.data?.data ?? []);
        setDatesBloquees(bloqueesRes.data ?? []);
      } catch {
        setTenue(null);
      } finally {
        setLoading(false);
      }
    };
    charger();
  }, [id]);

  const verifierConflit = async (debut: string, fin: string) => {
    if (!debut || !fin) { setConflitDates(false); setStockDispo(null); return; }
    if (!id) return;
    try {
      const res = await tenuesApi.verifierDispo(id, debut, fin);
      const stock = res.data.stock_disponible ?? 0;
      setStockDispo(stock);
      setConflitDates(stock === 0);
    } catch {
      setStockDispo(null);
      setConflitDates(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF6EF] pt-20">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-[#1B4D3E]/20 border-t-[#1B4D3E] rounded-full animate-spin mx-auto mb-3" style={{ borderWidth: 3 }} />
          <p className="text-gray-400 text-sm">Chargement…</p>
        </div>
      </div>
    );
  }

  if (!tenue) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF6EF] pt-20">
        <div className="text-center">
          <p className="text-6xl mb-4">🔍</p>
          <h2 className="text-gray-800 mb-3" style={{ fontWeight: 700 }}>Annonce introuvable</h2>
          <Link to="/catalogue" className="text-[#1B4D3E] hover:text-[#C9924A]">← Retour au catalogue</Link>
        </div>
      </div>
    );
  }

  const images = tenue.photos?.length > 0
    ? tenue.photos.map((p) => STORAGE_URL + p.chemin)
    : [FALLBACK_IMG];

  const sizes = tenue.tailles?.length > 0 ? tenue.tailles : (tenue.taille ? [tenue.taille] : ["Unique"]);
  const colors = tenue.couleurs ?? [];
  const available = tenue.statut === "disponible";
  const avgRating = evaluations.length > 0
    ? (evaluations.reduce((s, e) => s + e.note, 0) / evaluations.length).toFixed(1)
    : null;

  const isBoutique = tenue.proprietaire?.type_proprietaire === "boutique";
  const commissionRate = isBoutique ? 15 : 19;

  const getDays = () => {
    if (!startDate || !endDate) return 0;
    const diff = Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return diff >= 1 ? diff : 1;
  };
  const days = getDays();
  const subtotal = days * Number(tenue.prix_jour) * quantiteChoisie;
  const memeWilaya = adresseWilaya !== "" && tenue.wilaya === adresseWilaya;
  const tarifWilaya = TARIFS_LIVRAISON[adresseWilaya] ?? null;
  const fraisLivraison = modeLivraison === "domicile"
    ? (memeWilaya ? 250 : (tarifWilaya?.domicile ?? 0))
    : 0;
  const livraisonIndisponible = modeLivraison === "domicile" && adresseWilaya !== "" && !memeWilaya && tarifWilaya?.domicile === null;
  const fraisService = FRAIS_SERVICE;
  const adresseLivraisonComplete = [adresseCommune, adresseWilaya, adresseTelephone ? `Tél: ${adresseTelephone}` : ""].filter(Boolean).join(", ");
  const total = subtotal + fraisLivraison + fraisService;

  const handleBooking = async () => {
    if (!currentUser) { navigate("/connexion"); return; }
    if (currentUser.role === "admin" || currentUser.role === "owner") {
      toast.error("Les propriétaires et administrateurs ne peuvent pas effectuer de location. Inscrivez-vous avec un compte locataire.");
      return;
    }
    if (bookingStep === "form") {
      if (!startDate || !endDate) { toast.error("Sélectionnez les dates de location."); return; }
      if (conflitDates) { toast.error("Ces dates sont indisponibles."); return; }
      if (!tailleChoisie) { toast.error("Choisissez une taille."); return; }
      if (modeLivraison === "domicile" && !adresseWilaya.trim()) {
        toast.error("Sélectionnez votre wilaya."); return;
      }
      if (livraisonIndisponible) {
        toast.error("La livraison à domicile n'est pas disponible dans cette wilaya. Choisissez un point de retrait."); return;
      }
      if (modeLivraison === "domicile" && !adresseCommune.trim()) {
        toast.error("Sélectionnez votre commune."); return;
      }
      if (modeLivraison === "domicile" && !adresseTelephone.trim()) {
        toast.error("Vérifiez votre numéro de téléphone."); return;
      }
      setBookingStep("confirm");
    } else if (bookingStep === "confirm") {
      setBookingLoading(true);
      try {
        await reservationsApi.creer(tenue.id, startDate, endDate, {
          mode_livraison: modeLivraison,
          mode_paiement: modePaiement,
          avec_essayage: avecEssayage,
          adresse_livraison: modeLivraison === "domicile" ? adresseLivraisonComplete : undefined,
          tailles_choisies: tailleChoisie ? { [tailleChoisie]: quantiteChoisie } : undefined,
        });
        setBookingStep("success");
        toast.success("Réservation envoyée ! Le propriétaire a reçu votre demande.");
      } catch (err: any) {
        const msg = err?.response?.data?.message || "Erreur lors de la réservation.";
        toast.error(msg);
        setBookingStep("form");
      } finally {
        setBookingLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6EF] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Link to="/catalogue" className="flex items-center gap-1.5 text-gray-500 hover:text-[#1B4D3E] text-sm transition-colors">
            <ArrowLeft size={16} />Catalogue
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-700 text-sm truncate">{tenue.titre}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="relative aspect-video">
                <img src={images[currentImg] ?? FALLBACK_IMG} alt={tenue.titre} className="w-full h-full object-cover" />
                {images.length > 1 && (
                  <>
                    <button onClick={() => setCurrentImg((p) => (p === 0 ? images.length - 1 : p - 1))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white">
                      <ChevronLeft size={18} />
                    </button>
                    <button onClick={() => setCurrentImg((p) => (p === images.length - 1 ? 0 : p + 1))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white">
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={async () => { if (tenue && currentUser) await toggleFavori(tenue.id); }}
                    className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white"
                    title={tenue && isFavori(tenue.id) ? "Retirer des favoris" : "Ajouter aux favoris"}
                  >
                    <Heart size={16} className={tenue && isFavori(tenue.id) ? "fill-red-500 text-red-500" : "text-gray-500"} />
                  </button>
                </div>
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 p-3">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setCurrentImg(i)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${currentImg === i ? "border-[#1B4D3E]" : "border-transparent"}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="flex items-center gap-1 bg-[#1B4D3E]/10 text-[#1B4D3E] text-xs px-2.5 py-1 rounded-full" style={{ fontWeight: 500 }}>
                  <Tag size={11} />{tenue.type}
                </span>
                {isBoutique && (
                  <span className="flex items-center gap-1 bg-amber-100 text-amber-700 text-xs px-2.5 py-1 rounded-full" style={{ fontWeight: 500 }}>
                    <Store size={11} />Boutique partenaire
                  </span>
                )}
              </div>
              <h1 className="text-gray-900 mb-3" style={{ fontSize: "1.6rem", fontWeight: 700 }}>{tenue.titre}</h1>
              <div className="flex flex-wrap gap-4 mb-4">
                {avgRating && (
                  <div className="flex items-center gap-1.5">
                    <Star size={16} className="fill-[#C9924A] text-[#C9924A]" />
                    <span className="text-gray-800 text-sm" style={{ fontWeight: 600 }}>{avgRating}</span>
                    <span className="text-gray-400 text-sm">({evaluations.length} avis)</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-gray-500">
                  <MapPin size={15} /><span className="text-sm">{tenue.wilaya}, Algérie</span>
                </div>
                {available ? (
                  <div className="flex items-center gap-1.5 text-green-600">
                    <CheckCircle size={15} />
                    <span className="text-sm" style={{ fontWeight: 500 }}>
                      Disponible
                      {(tenue.quantite ?? 1) > 1 && (
                        <span className="ml-1 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                          {tenue.quantite} unités par taille
                        </span>
                      )}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-red-500" style={{ fontWeight: 500 }}>Indisponible</span>
                )}
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">{tenue.description}</p>

              {sizes.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-gray-800 text-sm mb-2" style={{ fontWeight: 600 }}>Tailles disponibles</h4>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <span key={size} className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm">
                        {size}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Choisissez vos tailles dans le formulaire de réservation →</p>
                </div>
              )}

              {colors.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-gray-800 text-sm mb-2" style={{ fontWeight: 600 }}>Couleurs disponibles</h4>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <span key={color} className="text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full">{color}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5 border-t border-gray-100">
                {[
                  { icon: <Shield size={16} className="text-[#1B4D3E]" />, label: "Caution sécurisée", desc: `${Number(tenue.caution).toLocaleString("fr-DZ")} DA bloquée` },
                  { icon: <CheckCircle size={16} className="text-green-600" />, label: "Propriétaire vérifié", desc: tenue.proprietaire?.verifie ? "Identité vérifiée" : "En attente de vérification" },
                  { icon: <Star size={16} className="text-[#C9924A]" />, label: "Satisfaction garantie", desc: "Remboursement en cas de litige" },
                ].map((g, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 bg-gray-50 rounded-xl">
                    <div className="mt-0.5">{g.icon}</div>
                    <div>
                      <p className="text-gray-800 text-xs" style={{ fontWeight: 600 }}>{g.label}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{g.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Boutique collaboration section */}
            {isBoutique && tenue.proprietaire?.nom_boutique && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Store size={20} className="text-amber-600" />
                  <h3 className="text-amber-800" style={{ fontWeight: 700 }}>Boutique partenaire — Essayage disponible</h3>
                </div>
                <p className="text-amber-700 text-sm mb-4">
                  Cette tenue est proposée par une boutique partenaire. Vous pouvez l'essayer directement en boutique avant de finaliser votre location.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-white rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-0.5">Nom de la boutique</p>
                    <p className="text-gray-800 text-sm" style={{ fontWeight: 600 }}>{tenue.proprietaire.nom_boutique}</p>
                  </div>
                  {tenue.proprietaire.adresse_boutique && (
                    <div className="bg-white rounded-xl p-3">
                      <p className="text-xs text-gray-500 mb-0.5">Adresse</p>
                      <p className="text-gray-800 text-sm" style={{ fontWeight: 600 }}>{tenue.proprietaire.adresse_boutique}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Owner */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-gray-900 mb-4" style={{ fontWeight: 700 }}>À propos du propriétaire</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-[#1B4D3E] rounded-full flex items-center justify-center text-white text-xl" style={{ fontWeight: 700 }}>
                  {tenue.proprietaire?.nom?.[0] ?? "?"}
                </div>
                <div>
                  <p className="text-gray-900" style={{ fontWeight: 600 }}>{tenue.proprietaire?.nom}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Star size={13} className="fill-[#C9924A] text-[#C9924A]" />
                    <span className="text-sm text-gray-600">{parseFloat(tenue.proprietaire?.score_rep?.toString() ?? "0").toFixed(1)}</span>
                    {isBoutique && (
                      <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full" style={{ fontWeight: 500 }}>Boutique</span>
                    )}
                  </div>
                  {tenue.proprietaire?.verifie && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <CheckCircle size={13} className="text-green-500" />
                      <span className="text-xs text-gray-400">Identité vérifiée</span>
                    </div>
                  )}
                </div>
              </div>
              {currentUser ? (
                <Link to={`/messages?dest=${tenue.proprietaire?.id}`}
                  className="flex items-center gap-2 text-sm text-[#1B4D3E] hover:text-[#C9924A] transition-colors">
                  <MessageCircle size={16} />Contacter le propriétaire
                </Link>
              ) : (
                <button onClick={() => setShowContact(!showContact)}
                  className="flex items-center gap-2 text-sm text-[#1B4D3E] hover:text-[#C9924A] transition-colors">
                  <MessageCircle size={16} />Contacter le propriétaire
                </button>
              )}
              {showContact && !currentUser && (
                <div className="mt-3 p-3 bg-[#1B4D3E]/5 rounded-xl">
                  <p className="text-sm text-gray-600">
                    <Link to="/connexion" className="text-[#1B4D3E]" style={{ fontWeight: 600 }}>Connectez-vous</Link> pour contacter {tenue.proprietaire?.nom?.split(" ")[0]}.
                  </p>
                </div>
              )}
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-gray-900" style={{ fontWeight: 700 }}>Avis clients ({evaluations.length})</h3>
                {avgRating && (
                  <div className="flex items-center gap-2">
                    <Star size={18} className="fill-[#C9924A] text-[#C9924A]" />
                    <span className="text-gray-800 text-lg" style={{ fontWeight: 700 }}>{avgRating}</span>
                    <span className="text-gray-400 text-sm">/5</span>
                  </div>
                )}
              </div>
              {evaluations.length === 0 ? (
                <p className="text-gray-400 text-sm">Aucun avis pour le moment.</p>
              ) : (
                <div className="space-y-5">
                  {evaluations.map((ev) => (
                    <div key={ev.id} className="pb-5 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 bg-[#C9924A] rounded-full flex items-center justify-center text-white text-sm" style={{ fontWeight: 600 }}>
                          {ev.auteur?.nom?.[0] ?? "?"}
                        </div>
                        <div>
                          <p className="text-gray-900 text-sm" style={{ fontWeight: 600 }}>{ev.auteur?.nom ?? "Utilisateur"}</p>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: ev.note }).map((_, i) => (
                              <Star key={i} size={11} className="fill-[#C9924A] text-[#C9924A]" />
                            ))}
                            <span className="text-gray-400 text-xs ml-1">{new Date(ev.created_at).toLocaleDateString("fr-DZ")}</span>
                          </div>
                        </div>
                      </div>
                      {ev.commentaire && <p className="text-gray-600 text-sm leading-relaxed pl-12">{ev.commentaire}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Booking Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 sticky top-24 overflow-hidden">
              {bookingStep === "success" ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-green-600" />
                  </div>
                  <h3 className="text-gray-900 mb-2" style={{ fontWeight: 700 }}>Réservation envoyée !</h3>
                  <p className="text-gray-500 text-sm mb-6">Le propriétaire a reçu votre demande. Vous serez notifié(e) dès confirmation.</p>
                  <Link to="/dashboard/renter"
                    className="block w-full bg-[#1B4D3E] text-white py-3 rounded-xl text-sm text-center" style={{ fontWeight: 600 }}>
                    Voir mes réservations
                  </Link>
                </div>
              ) : bookingStep === "confirm" ? (
                <div className="p-5">
                  <h3 className="text-gray-900 mb-4" style={{ fontWeight: 700 }}>Confirmer la réservation</h3>
                  <div className="space-y-2 mb-5 bg-[#FAF6EF] rounded-xl p-3">
                    {tailleChoisie && (
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Taille choisie</span>
                        <span className="text-[#1B4D3E]" style={{ fontWeight: 700 }}>{tailleChoisie}</span>
                      </div>
                    )}
                    {couleurChoisie && (
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Couleur choisie</span>
                        <span className="text-[#1B4D3E]" style={{ fontWeight: 700 }}>{couleurChoisie}</span>
                      </div>
                    )}
                    {[
                      { label: "Période", value: `${startDate} → ${endDate}` },
                      { label: "Durée", value: `${days} jour${days > 1 ? "s" : ""}` },
                      { label: `Location (${days}j × ${Number(tenue.prix_jour).toLocaleString("fr-DZ")} DA${quantiteChoisie > 1 ? ` × ${quantiteChoisie}` : ""})`, value: `${subtotal.toLocaleString("fr-DZ")} DA` },
                      { label: "Livraison", value: modeLivraison === "domicile"
                          ? livraisonIndisponible
                            ? "Non disponible"
                            : memeWilaya
                              ? `+250 DA · Même wilaya (24h–48h)`
                              : `+${fraisLivraison.toLocaleString("fr-DZ")} DA · ${tarifWilaya?.duree ?? ""}`
                          : "Point de retrait · Gratuit" },
                      ...(modeLivraison === "domicile" && adresseLivraisonComplete ? [{ label: "Adresse", value: adresseLivraisonComplete }] : []),
                      { label: "Paiement", value: modePaiement === "sur_place" ? "Sur place (cash)" : "En ligne (Barid/CCP)" },
                      ...(modeLivraison === "point_retrait" ? [{ label: "Frais de service KASEWA", value: `${FRAIS_SERVICE} DA` }] : []),
                      { label: "Caution (remboursable)", value: `${Number(tenue.caution).toLocaleString("fr-DZ")} DA` },
                    ].map((row, i) => (
                      <div key={i} className="flex justify-between text-xs gap-2">
                        <span className="text-gray-500 shrink-0">{row.label}</span>
                        <span className="text-gray-800 text-right" style={{ fontWeight: 500 }}>{row.value}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-sm pt-2 mt-1 border-t border-gray-200">
                      <span className="text-gray-900" style={{ fontWeight: 700 }}>Total</span>
                      <span className="text-[#1B4D3E] text-base" style={{ fontWeight: 800 }}>{total.toLocaleString("fr-DZ")} DA</span>
                    </div>
                    {modeLivraison === "domicile" && !livraisonIndisponible && (
                      <div className="mt-2 p-2.5 bg-amber-50 border border-amber-200 rounded-lg space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-amber-700" style={{ fontWeight: 600 }}>🔒 Acompte à verser maintenant</span>
                          <span className="text-amber-800" style={{ fontWeight: 800 }}>250 DA</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-amber-700">Reste à payer à la réception</span>
                          <span className="text-amber-800" style={{ fontWeight: 700 }}>{(total - 250).toLocaleString("fr-DZ")} DA</span>
                        </div>
                        <p className="text-[10px] text-amber-600 pt-0.5 border-t border-amber-200 mt-1">
                          📸 À la réception : signez le bon de livraison et prenez une photo du ticket de livraison.
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setBookingStep("form")}
                      className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl text-sm hover:bg-gray-50">
                      Modifier
                    </button>
                    <button onClick={handleBooking} disabled={bookingLoading}
                      className="flex-1 bg-[#C9924A] text-white py-3 rounded-xl text-sm hover:bg-[#b5803c] disabled:opacity-60 flex items-center justify-center gap-2"
                      style={{ fontWeight: 600 }}>
                      {bookingLoading ? <Loader2 size={16} className="animate-spin" /> : "Confirmer"}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Header prix */}
                  <div className="bg-[#1B4D3E] px-5 py-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-white text-2xl" style={{ fontWeight: 800 }}>{Number(tenue.prix_jour).toLocaleString("fr-DZ")}</span>
                      <span className="text-white/70 text-sm">DA / jour</span>
                    </div>
                    <p className="text-white/60 text-xs mt-0.5">Caution remboursable : {Number(tenue.caution).toLocaleString("fr-DZ")} DA</p>
                  </div>

                  <div className="p-5 space-y-5">

                    {/* ── Dates ── */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>Date de début</label>
                        <div className="relative">
                          <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                          <input
                            type="date"
                            value={startDate}
                            min={new Date().toISOString().split("T")[0]}
                            onChange={(e) => {
                              setStartDate(e.target.value);
                              setTailleChoisie("");
                              setCouleurChoisie("");
                              setQuantiteChoisie(1);
                              verifierConflit(e.target.value, endDate);
                            }}
                            className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1B4D3E] text-gray-700 bg-white"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>Date de fin</label>
                        <div className="relative">
                          <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                          <input
                            type="date"
                            value={endDate}
                            min={startDate || new Date().toISOString().split("T")[0]}
                            onChange={(e) => {
                              setEndDate(e.target.value);
                              setTailleChoisie("");
                              setCouleurChoisie("");
                              setQuantiteChoisie(1);
                              verifierConflit(startDate, e.target.value);
                            }}
                            className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1B4D3E] text-gray-700 bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Alerte dates indisponibles uniquement */}
                    {startDate && endDate && days > 0 && conflitDates && (
                      <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                        <AlertCircle size={15} className="text-red-500 shrink-0" />
                        <div>
                          <p className="text-xs text-red-700" style={{ fontWeight: 600 }}>Dates indisponibles</p>
                          <p className="text-[10px] text-red-500 mt-0.5">Ces dates sont déjà réservées. Choisissez d'autres dates.</p>
                        </div>
                      </div>
                    )}

                    {/* ── Couleur + Taille ── (si dates dispo) */}
                    {startDate && endDate && !conflitDates && days > 0 && stockDispo !== 0 && (
                      <div className="space-y-4">

                        {/* Couleurs en premier */}
                        {colors.length > 0 && (
                          <div>
                            <label className="block text-xs text-gray-500 mb-2" style={{ fontWeight: 500 }}>Couleur</label>
                            <div className="flex flex-wrap gap-2">
                              {colors.map((couleur) => {
                                const selected = couleurChoisie === couleur;
                                return (
                                  <button
                                    key={couleur}
                                    onClick={() => setCouleurChoisie(selected ? "" : couleur)}
                                    className={`px-3 py-2 rounded-xl border-2 text-xs transition-all ${
                                      selected
                                        ? "border-[#1B4D3E] bg-[#1B4D3E] text-white shadow-sm"
                                        : "border-gray-200 text-gray-700 hover:border-[#1B4D3E] hover:text-[#1B4D3E] bg-white"
                                    }`}
                                    style={{ fontWeight: 600 }}
                                  >
                                    {couleur}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Taille ensuite */}
                        <div>
                          <label className="block text-xs text-gray-500 mb-2" style={{ fontWeight: 500 }}>Taille</label>
                          <div className="flex flex-wrap gap-2">
                            {sizes.map((size) => {
                              const selected = tailleChoisie === size;
                              return (
                                <button
                                  key={size}
                                  onClick={() => { setTailleChoisie(selected ? "" : size); setQuantiteChoisie(1); }}
                                  className={`w-12 h-10 rounded-xl border-2 text-sm transition-all ${
                                    selected
                                      ? "border-[#1B4D3E] bg-[#1B4D3E] text-white shadow-sm"
                                      : "border-gray-200 text-gray-700 hover:border-[#1B4D3E] hover:text-[#1B4D3E] bg-white"
                                  }`}
                                  style={{ fontWeight: 600 }}
                                >
                                  {size}
                                </button>
                              );
                            })}
                          </div>

                          {/* Carte stock : total + disponible pour les dates */}
                          {tailleChoisie && stockDispo !== null && (
                            <div className={`mt-3 rounded-xl border-2 overflow-hidden ${
                              stockDispo === 0 ? "border-red-300"
                              : stockDispo === 1 ? "border-amber-300"
                              : "border-[#1B4D3E]/40"
                            }`}>
                              <div className={`px-4 py-2 text-xs border-b ${
                                stockDispo === 0 ? "bg-red-50 border-red-200 text-red-700"
                                : stockDispo === 1 ? "bg-amber-50 border-amber-200 text-amber-700"
                                : "bg-[#1B4D3E]/5 border-[#1B4D3E]/20 text-[#1B4D3E]"
                              }`} style={{ fontWeight: 600 }}>
                                Taille <span style={{ fontWeight: 800 }}>{tailleChoisie}</span>
                              </div>
                              <div className="grid grid-cols-2 divide-x divide-gray-200 bg-white">
                                <div className="px-4 py-3 text-center">
                                  <p className="text-[10px] text-gray-400 mb-1" style={{ fontWeight: 500 }}>Quantité totale</p>
                                  <p className="text-2xl text-gray-700 leading-none" style={{ fontWeight: 800 }}>{tenue.quantite ?? 1}</p>
                                  <p className="text-[10px] text-gray-400 mt-0.5">unité{(tenue.quantite ?? 1) > 1 ? "s" : ""} par taille</p>
                                </div>
                                <div className="px-4 py-3 text-center">
                                  <p className="text-[10px] text-gray-400 mb-1" style={{ fontWeight: 500 }}>Dispo. ces dates</p>
                                  <p className={`text-2xl leading-none ${
                                    stockDispo === 0 ? "text-red-500"
                                    : stockDispo === 1 ? "text-amber-600"
                                    : "text-[#1B4D3E]"
                                  }`} style={{ fontWeight: 800 }}>{stockDispo}</p>
                                  <p className="text-[10px] text-gray-400 mt-0.5">
                                    {stockDispo === 0 ? "indisponible" : "unité" + (stockDispo > 1 ? "s" : "") + " par taille"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                          {!tailleChoisie && (
                            <p className="text-[10px] text-gray-400 mt-1.5">Sélectionnez votre taille pour voir les quantités</p>
                          )}

                          {/* Sélecteur quantité */}
                          {tailleChoisie && stockDispo !== null && stockDispo > 0 && (
                            <div className="mt-3 flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl">
                              <div>
                                <p className="text-xs text-gray-700" style={{ fontWeight: 600 }}>Combien de tenues ?</p>
                                <p className="text-[10px] text-gray-400 mt-0.5">Max {stockDispo} disponible{stockDispo > 1 ? "s" : ""} par taille</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => setQuantiteChoisie(q => Math.max(1, q - 1))}
                                  disabled={quantiteChoisie <= 1}
                                  className="w-9 h-9 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-[#1B4D3E] hover:text-[#1B4D3E] disabled:opacity-30 transition-colors text-lg"
                                  style={{ fontWeight: 700 }}
                                >
                                  −
                                </button>
                                <span className="text-xl text-gray-900 w-6 text-center" style={{ fontWeight: 800 }}>{quantiteChoisie}</span>
                                <button
                                  onClick={() => setQuantiteChoisie(q => Math.min(stockDispo ?? 1, q + 1))}
                                  disabled={quantiteChoisie >= (stockDispo ?? 1)}
                                  className="w-9 h-9 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-[#1B4D3E] hover:text-[#1B4D3E] disabled:opacity-30 transition-colors text-lg"
                                  style={{ fontWeight: 700 }}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* ── ÉTAPE 3 : Livraison + Paiement ── (si taille choisie) */}
                    {tailleChoisie && (
                      <div className="border-t border-gray-100 pt-4 space-y-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-5 h-5 rounded-full bg-[#1B4D3E] text-white text-[10px] flex items-center justify-center shrink-0" style={{ fontWeight: 700 }}>3</span>
                          <p className="text-xs text-gray-700" style={{ fontWeight: 600 }}>Mode de récupération</p>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <button onClick={() => setModeLivraison("point_retrait")}
                            className={`p-3 rounded-xl border-2 text-left transition-all ${modeLivraison === "point_retrait" ? "border-[#1B4D3E] bg-[#1B4D3E]/5" : "border-gray-200 hover:border-gray-300"}`}>
                            <div className="flex items-center gap-1.5 mb-1">
                              <Store size={13} className="text-[#1B4D3E]" />
                              <span className="text-xs" style={{ fontWeight: 700 }}>Point de retrait</span>
                            </div>
                            <span className="text-[10px] text-green-600" style={{ fontWeight: 600 }}>Gratuit · service {FRAIS_SERVICE} DA</span>
                          </button>
                          <button onClick={() => setModeLivraison("domicile")}
                            className={`p-3 rounded-xl border-2 text-left transition-all ${modeLivraison === "domicile" ? "border-[#1B4D3E] bg-[#1B4D3E]/5" : "border-gray-200 hover:border-gray-300"}`}>
                            <div className="flex items-center gap-1.5 mb-1">
                              <Truck size={13} className="text-[#1B4D3E]" />
                              <span className="text-xs" style={{ fontWeight: 700 }}>Livraison à domicile</span>
                            </div>
                            {adresseWilaya ? (
                              memeWilaya
                                ? <span className="text-[10px] text-green-600" style={{ fontWeight: 600 }}>+250 DA · Même wilaya</span>
                                : tarifWilaya?.domicile === null
                                  ? <span className="text-[10px] text-red-500" style={{ fontWeight: 600 }}>Non disponible</span>
                                  : <span className="text-[10px] text-[#C9924A]" style={{ fontWeight: 600 }}>+{tarifWilaya?.domicile?.toLocaleString("fr-DZ")} DA · {tarifWilaya?.duree}</span>
                            ) : (
                              <span className="text-[10px] text-[#C9924A]" style={{ fontWeight: 600 }}>Prix selon wilaya</span>
                            )}
                          </button>
                        </div>

                        {modeLivraison === "domicile" && (
                          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2.5">
                            <p className="text-xs text-amber-800 flex items-center gap-1.5" style={{ fontWeight: 600 }}>
                              <MapPin size={12} />Adresse de livraison
                            </p>

                            {/* 1. Wilaya */}
                            <div>
                              <label className="text-[10px] text-amber-700 mb-1 block" style={{ fontWeight: 600 }}>Wilaya *</label>
                              <select value={adresseWilaya}
                                onChange={(e) => { setAdresseWilaya(e.target.value); setAdresseCommune(""); }}
                                className="w-full px-3 py-2 text-xs border border-amber-200 rounded-lg outline-none focus:border-[#C9924A] bg-white">
                                <option value="">— Sélectionnez votre wilaya —</option>
                                {Object.keys(COMMUNES_PAR_WILAYA).map((w) => (
                                  <option key={w} value={w}>{w}</option>
                                ))}
                              </select>
                            </div>

                            {/* 2. Commune (selon wilaya) */}
                            <div>
                              <label className="text-[10px] text-amber-700 mb-1 block" style={{ fontWeight: 600 }}>Commune *</label>
                              <select value={adresseCommune} onChange={(e) => setAdresseCommune(e.target.value)}
                                disabled={!adresseWilaya}
                                className="w-full px-3 py-2 text-xs border border-amber-200 rounded-lg outline-none focus:border-[#C9924A] bg-white disabled:opacity-50">
                                <option value="">{adresseWilaya ? "— Sélectionnez votre commune —" : "Choisissez d'abord une wilaya"}</option>
                                {(COMMUNES_PAR_WILAYA[adresseWilaya] ?? []).map((c) => (
                                  <option key={c} value={c}>{c}</option>
                                ))}
                              </select>
                            </div>

                            {/* 3. Téléphone — auto-rempli depuis le profil */}
                            <div>
                              <label className="text-[10px] text-amber-700 mb-1 block" style={{ fontWeight: 600 }}>Téléphone *</label>
                              <input type="tel" value={adresseTelephone}
                                onChange={(e) => setAdresseTelephone(e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-amber-300 rounded-lg outline-none focus:border-[#C9924A] bg-white"
                                style={{ fontWeight: adresseTelephone ? 600 : 400 }} />
                              {currentUser?.phone && adresseTelephone === currentUser.phone && (
                                <p className="text-[10px] text-green-600 mt-0.5 flex items-center gap-1">
                                  <CheckCircle size={10} />Numéro enregistré lors de l'inscription
                                </p>
                              )}
                            </div>

                            {adresseWilaya ? (
                              memeWilaya ? (
                                <div className="text-[10px] pt-1 space-y-0.5 text-green-700">
                                  <p>✅ <strong>Même wilaya que la tenue ({tenue.wilaya})</strong> — tarif réduit appliqué.</p>
                                  <p>Livraison à domicile : <strong>250 DA</strong></p>
                                  <p>Délai estimé : <strong>24h – 48h</strong></p>
                                </div>
                              ) : livraisonIndisponible ? (
                                <p className="text-[10px] text-red-600 pt-1 font-semibold">⚠ Livraison non disponible dans cette wilaya.</p>
                              ) : (
                                <div className="text-[10px] text-amber-700 pt-1 space-y-0.5">
                                  <p>Livraison à domicile : <strong>{tarifWilaya?.domicile?.toLocaleString("fr-DZ")} DA</strong></p>
                                  <p>Point de relais : <strong>{tarifWilaya?.relais === 0 ? "Gratuit" : `${tarifWilaya?.relais?.toLocaleString("fr-DZ")} DA`}</strong></p>
                                  <p>Délai estimé : <strong>{tarifWilaya?.duree}</strong></p>
                                </div>
                              )
                            ) : (
                              <p className="text-[10px] text-amber-700 pt-1">Sélectionnez votre wilaya pour voir le tarif exact.</p>
                            )}
                          </div>
                        )}

                        {/* ── Conditions de livraison ── */}
                        {modeLivraison === "domicile" && !livraisonIndisponible && (
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-2">
                            <p className="text-xs text-blue-800 flex items-center gap-1.5" style={{ fontWeight: 700 }}>
                              <Truck size={12} />Conditions de livraison
                            </p>
                            <div className="space-y-1.5">
                              <div className="flex items-start gap-2">
                                <span className="w-4 h-4 rounded-full bg-[#C9924A] text-white text-[9px] flex items-center justify-center shrink-0 mt-0.5" style={{ fontWeight: 700 }}>1</span>
                                <p className="text-[10px] text-blue-700">
                                  <strong>Acompte obligatoire : 250 DA</strong> à verser à la confirmation de commande. Le reste du montant est payé à la réception de la tenue.
                                </p>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="w-4 h-4 rounded-full bg-[#C9924A] text-white text-[9px] flex items-center justify-center shrink-0 mt-0.5" style={{ fontWeight: 700 }}>2</span>
                                <p className="text-[10px] text-blue-700">
                                  <strong>À la réception :</strong> vous devez <strong>signer le bon de livraison</strong> et <strong>prendre une photo du ticket de livraison</strong> comme preuve de réception.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Mode paiement */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="w-5 h-5 rounded-full bg-[#1B4D3E] text-white text-[10px] flex items-center justify-center shrink-0" style={{ fontWeight: 700 }}>4</span>
                            <p className="text-xs text-gray-700" style={{ fontWeight: 600 }}>Mode de paiement</p>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => setModePaiement("sur_place")}
                              className={`p-3 rounded-xl border-2 text-left transition-all ${modePaiement === "sur_place" ? "border-[#C9924A] bg-amber-50" : "border-gray-200 hover:border-gray-300"}`}>
                              <div className="flex items-center gap-1.5 mb-1">
                                <Banknote size={13} className="text-[#C9924A]" />
                                <span className="text-xs" style={{ fontWeight: 700 }}>Sur place</span>
                              </div>
                              <span className="text-[10px] text-gray-500">Cash à la livraison</span>
                            </button>
                            <button onClick={() => setModePaiement("en_ligne")}
                              className={`p-3 rounded-xl border-2 text-left transition-all ${modePaiement === "en_ligne" ? "border-[#C9924A] bg-amber-50" : "border-gray-200 hover:border-gray-300"}`}>
                              <div className="flex items-center gap-1.5 mb-1">
                                <CreditCard size={13} className="text-[#C9924A]" />
                                <span className="text-xs" style={{ fontWeight: 700 }}>En ligne</span>
                              </div>
                              <span className="text-[10px] text-gray-500">Barid / CCP</span>
                            </button>
                          </div>
                        </div>

                        {isBoutique && (
                          <label className="flex items-center justify-between p-2.5 rounded-xl border border-amber-200 bg-amber-50 cursor-pointer">
                            <div className="flex items-center gap-2">
                              <Store size={14} className="text-amber-600" />
                              <span className="text-xs text-amber-800" style={{ fontWeight: 500 }}>Essayage en boutique</span>
                            </div>
                            <input type="checkbox" checked={avecEssayage} onChange={(e) => setAvecEssayage(e.target.checked)}
                              className="accent-amber-600 w-4 h-4" />
                          </label>
                        )}

                        {/* ── Récapitulatif prix ── */}
                        <div className="bg-[#FAF6EF] rounded-xl p-3 space-y-1.5 border border-gray-200">
                          <p className="text-xs text-gray-500 mb-2" style={{ fontWeight: 700 }}>Récapitulatif</p>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">
                              {days}j × {Number(tenue.prix_jour).toLocaleString("fr-DZ")} DA
                              {quantiteChoisie > 1 ? ` × ${quantiteChoisie} tenues` : ""}
                              {tailleChoisie ? ` · ${tailleChoisie}` : ""}
                              {couleurChoisie ? ` · ${couleurChoisie}` : ""}
                            </span>
                            <span className="text-gray-700" style={{ fontWeight: 500 }}>{subtotal.toLocaleString("fr-DZ")} DA</span>
                          </div>
                          {modeLivraison === "domicile" && (
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-500">Livraison à domicile</span>
                              <span className="text-gray-700" style={{ fontWeight: 500 }}>+{fraisLivraison.toLocaleString("fr-DZ")} DA</span>
                            </div>
                          )}
                          {modeLivraison === "point_retrait" && (
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-500">Frais de service KASEWA</span>
                              <span className="text-gray-700" style={{ fontWeight: 500 }}>{FRAIS_SERVICE} DA</span>
                            </div>
                          )}
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Caution (remboursable à la restitution)</span>
                            <span className="text-gray-700" style={{ fontWeight: 500 }}>{Number(tenue.caution).toLocaleString("fr-DZ")} DA</span>
                          </div>
                          <div className="flex justify-between text-sm pt-2 mt-1 border-t border-gray-200">
                            <span className="text-gray-900" style={{ fontWeight: 700 }}>Total</span>
                            <span className="text-[#1B4D3E] text-base" style={{ fontWeight: 800 }}>{total.toLocaleString("fr-DZ")} DA</span>
                          </div>
                          <p className="text-[10px] text-gray-400 pt-1">
                            {modePaiement === "en_ligne" ? "Paiement en ligne via Barid Mobile / CCP" : "Paiement en espèces à la remise de la tenue"}
                          </p>
                        </div>

                        {currentUser && (currentUser.role === "admin" || currentUser.role === "owner") ? (
                          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                            <p className="text-amber-800 text-sm" style={{ fontWeight: 600 }}>
                              Réservation non disponible
                            </p>
                            <p className="text-amber-700 text-xs mt-1 leading-relaxed">
                              Les propriétaires et administrateurs ne peuvent pas effectuer de location.
                            </p>
                            <Link to="/inscription" className="inline-block mt-3 bg-[#1B4D3E] text-white px-4 py-2 rounded-lg text-xs hover:bg-[#2d6b55] transition-colors" style={{ fontWeight: 600 }}>
                              Créer un compte locataire →
                            </Link>
                          </div>
                        ) : (
                          <>
                            <button onClick={handleBooking}
                              disabled={!available || bookingLoading}
                              className="w-full bg-[#C9924A] text-white py-3.5 rounded-xl text-sm hover:bg-[#b5803c] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                              style={{ fontWeight: 700 }}>
                              {bookingLoading
                                ? <Loader2 size={16} className="animate-spin" />
                                : !available ? "Tenue indisponible"
                                : !currentUser ? "Se connecter pour réserver"
                                : "Réserver maintenant →"}
                            </button>
                            <p className="text-[10px] text-gray-400 text-center">Vous ne serez débité qu'après confirmation du propriétaire</p>
                          </>
                        )}
                      </div>
                    )}

                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

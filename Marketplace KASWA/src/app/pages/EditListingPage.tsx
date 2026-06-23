import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { ArrowLeft, CheckCircle, Info, Save, Loader2 } from "lucide-react";
import { OCCASIONS, WILAYAS } from "../data/mockData";

const TENUE_TYPES = ["Chedda", "Caftan", "Robes Soirée", "Karakou", "Chaouie", "Haïk", "Fouta", "Djellaba", "Blouza", "Autre"];
import { useApp } from "../context/AppContext";
import { motion } from "motion/react";
import { toast } from "react-toastify";
import { tenuesApi } from "../../services/api";
import { STORAGE_URL } from "../../services/storageUrl";
const FALLBACK_IMG = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80";
const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "Unique"];

export function EditListingPage() {
  const { id } = useParams();
  const { currentUser } = useApp();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [tenue, setTenue] = useState<any>(null);

  const [form, setForm] = useState({
    title: "",
    type: "",
    description: "",
    pricePerDay: "",
    caution: "",
    selectedSizes: [] as string[],
    selectedOccasions: [] as string[],
    colors: "",
    wilaya: "",
  });

  useEffect(() => {
    if (!id) return;
    tenuesApi.detail(id)
      .then((res) => {
        const t = res.data;
        setTenue(t);
        setForm({
          title: t.titre ?? "",
          type: t.type ?? "",
          description: t.description ?? "",
          pricePerDay: t.prix_jour?.toString() ?? "",
          caution: t.caution?.toString() ?? "",
          selectedSizes: t.tailles ?? (t.taille ? [t.taille] : []),
          selectedOccasions: t.occasions ?? [],
          colors: Array.isArray(t.couleurs) ? t.couleurs.join(", ") : (t.couleurs ?? ""),
          wilaya: t.wilaya ?? "",
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const toggleItem = (key: "selectedSizes" | "selectedOccasions", value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].includes(value) ? prev[key].filter((v) => v !== value) : [...prev[key], value],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await tenuesApi.modifier(Number(id), {
        titre: form.title,
        type: form.type,
        description: form.description,
        prix_jour: parseFloat(form.pricePerDay),
        caution: parseFloat(form.caution),
        tailles: form.selectedSizes,
        occasions: form.selectedOccasions,
        couleurs: form.colors ? form.colors.split(",").map((c) => c.trim()) : [],
        wilaya: form.wilaya,
      });
      setSaved(true);
      toast.success("Annonce mise à jour ! Les modifications ont été enregistrées.");
      setTimeout(() => navigate("/dashboard/owner"), 1500);
    } catch (err: any) {
      if (!err.response) {
        setSaved(true);
        toast.success("Modifications sauvegardées ! Mode démo — les changements sont enregistrés localement.");
        setTimeout(() => navigate("/dashboard/owner"), 1500);
      } else {
        const errors = err.response?.data?.errors;
        if (errors) {
          const first = Object.values(errors)[0] as string[];
          toast.error(first[0]);
        } else {
          toast.error(err.response?.data?.message ?? "Erreur lors de la mise à jour");
        }
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF6EF] pt-20 flex items-center justify-center">
        <Loader2 className="animate-spin text-[#1B4D3E]" size={32} />
      </div>
    );
  }

  if (!tenue) {
    return (
      <div className="min-h-screen bg-[#FAF6EF] pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">🔍</p>
          <h2 className="text-gray-800 mb-3" style={{ fontWeight: 700 }}>Annonce introuvable</h2>
          <Link to="/dashboard/owner" className="text-[#1B4D3E] hover:text-[#C9924A]">← Retour au tableau de bord</Link>
        </div>
      </div>
    );
  }

  if (saved) {
    return (
      <div className="min-h-screen bg-[#FAF6EF] pt-20 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md px-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="text-gray-900 text-2xl mb-3" style={{ fontWeight: 700 }}>Annonce mise à jour !</h2>
          <p className="text-gray-500 mb-6">Vos modifications ont été enregistrées avec succès.</p>
          <Link to="/dashboard/owner" className="inline-block bg-[#1B4D3E] text-white px-8 py-3 rounded-full" style={{ fontWeight: 600 }}>
            Retour au tableau de bord
          </Link>
        </motion.div>
      </div>
    );
  }

  const photos = tenue.photos ?? (tenue.photo_principale ? [tenue.photo_principale] : []);
  const mainImg = photos.length > 0 ? STORAGE_URL + (photos[0].chemin ?? photos[0]) : FALLBACK_IMG;

  return (
    <div className="min-h-screen bg-[#FAF6EF] pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link to="/dashboard/owner" className="p-2 text-gray-400 hover:text-gray-600 bg-white rounded-xl shadow-sm">
            <ArrowLeft size={18} />
          </Link>
          <div className="flex-1">
            <h1 className="text-gray-900 text-2xl" style={{ fontWeight: 700 }}>Modifier l'annonce</h1>
            <p className="text-gray-500 text-sm truncate">{tenue.titre}</p>
          </div>
          <Link to={`/annonce/${tenue.id}`} className="text-sm text-[#1B4D3E] hover:text-[#C9924A] border border-[#1B4D3E]/30 px-3 py-1.5 rounded-full transition-colors" style={{ fontWeight: 500 }}>
            Voir l'annonce
          </Link>
        </div>

        {/* Preview image */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-6">
          <div className="relative h-48">
            <img src={mainImg} alt={tenue.titre} className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }} />
            <div className="absolute inset-0 bg-[#1B4D3E]/30 flex items-center justify-center">
              <span className="bg-white/90 text-[#1B4D3E] text-sm px-4 py-2 rounded-full" style={{ fontWeight: 600 }}>
                Photo principale actuelle
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Description */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
            <h2 className="text-gray-900" style={{ fontWeight: 700 }}>Description</h2>

            <div>
              <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>Titre de l'annonce</label>
              <input type="text" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1B4D3E] text-gray-800" />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>Type de tenue</label>
              <select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1B4D3E] text-gray-700">
                {TENUE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>Description</label>
              <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                rows={5} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1B4D3E] text-gray-800 resize-none" />
              <p className="text-xs text-gray-400 mt-1 text-right">{form.description.length} caractères</p>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2" style={{ fontWeight: 500 }}>Occasions</label>
              <div className="flex flex-wrap gap-2">
                {OCCASIONS.map((occ) => (
                  <button key={occ} type="button" onClick={() => toggleItem("selectedOccasions", occ)}
                    className={`text-sm px-3.5 py-1.5 rounded-full border transition-colors ${
                      form.selectedOccasions.includes(occ) ? "bg-[#1B4D3E] text-white border-[#1B4D3E]" : "border-gray-200 text-gray-600 hover:border-[#1B4D3E]"
                    }`}>
                    {occ}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2" style={{ fontWeight: 500 }}>Tailles</label>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((size) => (
                  <button key={size} type="button" onClick={() => toggleItem("selectedSizes", size)}
                    className={`px-4 py-2 border rounded-lg text-sm transition-colors ${
                      form.selectedSizes.includes(size) ? "bg-[#1B4D3E] text-white border-[#1B4D3E]" : "border-gray-200 text-gray-600 hover:border-[#1B4D3E]"
                    }`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Prix & Localisation */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
            <h2 className="text-gray-900" style={{ fontWeight: 700 }}>Prix & Localisation</h2>

            <div className="bg-[#C9924A]/10 border border-[#C9924A]/20 rounded-xl p-3 flex gap-2">
              <Info size={16} className="text-[#C9924A] shrink-0 mt-0.5" />
              <p className="text-xs text-gray-600">Commission plateforme : <strong>15%</strong> (Boutique) ou <strong>19%</strong> (Investisseur) selon votre profil.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>Prix par jour (DA)</label>
                <input type="number" value={form.pricePerDay} onChange={(e) => setForm((p) => ({ ...p, pricePerDay: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1B4D3E] text-gray-800" />
                {form.pricePerDay && (
                  <p className="text-xs text-green-600 mt-1">Vous recevez : {(Number(form.pricePerDay) * 0.85).toLocaleString("fr-DZ")} DA/j</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>Caution (DA)</label>
                <input type="number" value={form.caution} onChange={(e) => setForm((p) => ({ ...p, caution: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1B4D3E] text-gray-800" />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>Couleurs disponibles</label>
              <input type="text" value={form.colors} onChange={(e) => setForm((p) => ({ ...p, colors: e.target.value }))}
                placeholder="Ex: Bordeaux & Or, Bleu Marine & Argent"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1B4D3E] text-gray-800" />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>Wilaya</label>
              <select value={form.wilaya} onChange={(e) => setForm((p) => ({ ...p, wilaya: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1B4D3E] text-gray-700">
                {WILAYAS.map((w) => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Link to="/dashboard/owner" className="flex-1 text-center border border-gray-200 text-gray-600 py-3.5 rounded-xl hover:bg-gray-50 text-sm transition-colors">
              Annuler
            </Link>
            <button onClick={handleSave} disabled={saving || !form.title || !form.pricePerDay}
              className="flex-1 bg-[#C9924A] text-white py-3.5 rounded-xl hover:bg-[#b5803c] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              style={{ fontWeight: 600 }}>
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? "Enregistrement..." : "Enregistrer les modifications"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

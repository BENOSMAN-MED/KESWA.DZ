import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router";
import { Upload, X, CheckCircle, ArrowLeft, Info } from "lucide-react";
import { OCCASIONS, WILAYAS } from "../data/mockData";

// Types exacts correspondant à l'enum en base de données
const TENUE_TYPES = ["Chedda", "Caftan", "Karakou", "Chaouie", "Haïk", "Fouta", "Djellaba", "Robes Soirée", "Autre"];
import { useApp } from "../context/AppContext";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "react-toastify";
import { tenuesApi } from "../../services/api";

export function AddListingPage() {
  const { currentUser } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [typeAutre, setTypeAutre] = useState("");
  const [sizeQuantities, setSizeQuantities] = useState<Record<string, number>>({});
  const [sizeColors, setSizeColors] = useState<Record<string, Array<{ name: string; qty: number }>>>({});
  const [sizeColorInput, setSizeColorInput] = useState<Record<string, string>>({});
  const [sizeColorQtyInput, setSizeColorQtyInput] = useState<Record<string, number>>({});
  const [form, setForm] = useState({
    title: "",
    type: "",
    description: "",
    pricePerDay: "",
    caution: "",
    selectedOccasions: [] as string[],
    wilaya: "",
  });

  const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "Unique"];

  const toggleItem = (key: "selectedOccasions", value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  const toggleSize = (size: string) => {
    setSizeQuantities((prev) => {
      if (prev[size] !== undefined) {
        const next = { ...prev };
        delete next[size];
        return next;
      }
      return { ...prev, [size]: 1 };
    });
    setSizeColors((prev) => {
      const next = { ...prev };
      delete next[size];
      return next;
    });
    setSizeColorInput((prev) => { const next = { ...prev }; delete next[size]; return next; });
    setSizeColorQtyInput((prev) => { const next = { ...prev }; delete next[size]; return next; });
  };

  const setSizeQty = (size: string, qty: number) => {
    const newQty = Math.max(1, qty);
    setSizeQuantities((prev) => ({ ...prev, [size]: newQty }));
    setSizeColors((prev) => {
      const colors = prev[size] ?? [];
      let sum = 0;
      const trimmed = colors.filter((c) => { sum += c.qty; return sum <= newQty; });
      return { ...prev, [size]: trimmed };
    });
  };

  const updateForm = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setPhotoFiles((prev) => [...prev, ...files].slice(0, 8));
    e.target.value = "";
  };

  const removePhoto = (index: number) => {
    setPhotoFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("titre", form.title);
      fd.append("type", form.type === "Autre" ? (typeAutre.trim() || "Autre") : form.type);
      fd.append("description", form.description);
      fd.append("prix_jour", form.pricePerDay);
      fd.append("caution", form.caution);
      fd.append("wilaya", form.wilaya);
      const selectedSizes = Object.keys(sizeQuantities);
      if (selectedSizes.length > 0) {
        fd.append("tailles", selectedSizes.join(","));
        fd.append("quantite", String(Object.values(sizeQuantities).reduce((a, b) => a + b, 0)));
        fd.append("quantites_par_taille", JSON.stringify(sizeQuantities));
        fd.append("couleurs_tailles", JSON.stringify(sizeColors));
      }
      photoFiles.forEach((file) => fd.append("photos[]", file));
      await tenuesApi.creer(fd);
      setSubmitted(true);
      setTimeout(() => navigate("/dashboard/owner"), 2500);
    } catch (err: any) {
      const errors = err.response?.data?.errors;
      if (errors) {
        const first = Object.values(errors)[0] as string[];
        toast.error(first[0]);
      } else {
        toast.error(err.response?.data?.message ?? "Erreur lors de la publication");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isStep1Valid = form.title && form.type && form.description.length > 20;
  const isStep2Valid = form.pricePerDay && form.caution && Object.keys(sizeQuantities).length > 0 && form.selectedOccasions.length > 0 && form.wilaya;

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#FAF6EF] pt-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md px-6"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="text-gray-900 text-2xl mb-3" style={{ fontWeight: 700 }}>Annonce soumise !</h2>
          <p className="text-gray-500 mb-6">
            Votre annonce est en cours de modération. Elle sera publiée dans les 24h après validation par notre équipe.
          </p>
          <Link to="/dashboard/owner" className="inline-block bg-[#1B4D3E] text-white px-8 py-3 rounded-full" style={{ fontWeight: 600 }}>
            Retour au tableau de bord
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6EF] pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link to="/dashboard/owner" className="p-2 text-gray-400 hover:text-gray-600 bg-white rounded-xl shadow-sm">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-gray-900 text-2xl" style={{ fontWeight: 700 }}>Publier une annonce</h1>
            <p className="text-gray-500 text-sm">Mettez en location votre tenue traditionnelle</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors ${
                step > s ? "bg-green-500 text-white" : step === s ? "bg-[#1B4D3E] text-white" : "bg-gray-200 text-gray-400"
              }`} style={{ fontWeight: 600 }}>
                {step > s ? <CheckCircle size={16} /> : s}
              </div>
              <span className={`text-xs hidden sm:block ${step >= s ? "text-[#1B4D3E]" : "text-gray-400"}`} style={{ fontWeight: 500 }}>
                {s === 1 ? "Description" : s === 2 ? "Détails & Prix" : "Photos"}
              </span>
              {s < 3 && <div className={`w-16 h-0.5 ${step > s ? "bg-green-400" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
        {/* Step 1: Description */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
              <h2 className="text-gray-900" style={{ fontWeight: 700 }}>Description de la tenue</h2>

              <div>
                <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>Titre de l'annonce *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => updateForm("title", e.target.value)}
                  placeholder="Ex: Chedda Tlemcénienne Brodée Or — État impeccable"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1B4D3E] text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>Type de tenue *</label>
                <select
                  value={form.type}
                  onChange={(e) => { updateForm("type", e.target.value); setTypeAutre(""); }}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1B4D3E] text-gray-700"
                >
                  <option value="">Sélectionner un type</option>
                  {TENUE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                {form.type === "Autre" && (
                  <input
                    type="text"
                    value={typeAutre}
                    onChange={(e) => setTypeAutre(e.target.value)}
                    placeholder="Précisez le type de tenue..."
                    className="mt-2 w-full px-4 py-3 bg-gray-50 border border-[#1B4D3E] rounded-xl text-sm outline-none focus:border-[#1B4D3E] text-gray-700"
                    autoFocus
                  />
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>
                  Description détaillée *
                  <span className="text-gray-400 ml-1" style={{ fontWeight: 400 }}>(min. 20 caractères)</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateForm("description", e.target.value)}
                  rows={5}
                  placeholder="Décrivez votre tenue en détail : matière, état, origine, broderies, accessoires inclus, histoire de la pièce..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1B4D3E] text-gray-800 resize-none"
                />
                <p className="text-xs text-gray-400 mt-1 text-right">{form.description.length} / 20 min.</p>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2" style={{ fontWeight: 500 }}>Occasions *</label>
                <div className="flex flex-wrap gap-2">
                  {OCCASIONS.map((occ) => (
                    <button
                      key={occ}
                      type="button"
                      onClick={() => toggleItem("selectedOccasions", occ)}
                      className={`text-sm px-3.5 py-1.5 rounded-full border transition-colors ${
                        form.selectedOccasions.includes(occ)
                          ? "bg-[#1B4D3E] text-white border-[#1B4D3E]"
                          : "border-gray-200 text-gray-600 hover:border-[#1B4D3E]"
                      }`}
                    >
                      {occ}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2" style={{ fontWeight: 500 }}>Tailles disponibles *</label>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`px-4 py-2 border rounded-lg text-sm transition-colors ${
                        sizeQuantities[size] !== undefined
                          ? "bg-[#1B4D3E] text-white border-[#1B4D3E]"
                          : "border-gray-200 text-gray-600 hover:border-[#1B4D3E]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {Object.keys(sizeQuantities).length > 0 && (
                  <div className="mt-3 space-y-2">
                    {Object.entries(sizeQuantities).map(([size, qty]) => (
                      <div key={size} className="bg-[#FAF6EF] border border-[#1B4D3E]/20 rounded-xl overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-2.5">
                          <span className="text-sm text-[#1B4D3E]" style={{ fontWeight: 600 }}>Taille {size}</span>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setSizeQty(size, qty - 1)}
                              disabled={qty <= 1}
                              className="w-7 h-7 rounded-full border border-gray-300 text-gray-600 flex items-center justify-center hover:border-[#1B4D3E] disabled:opacity-40 text-base leading-none"
                            >−</button>
                            <span className="text-sm w-5 text-center" style={{ fontWeight: 700 }}>{qty}</span>
                            <button
                              type="button"
                              onClick={() => setSizeQty(size, qty + 1)}
                              className="w-7 h-7 rounded-full border border-gray-300 text-gray-600 flex items-center justify-center hover:border-[#1B4D3E] text-base leading-none"
                            >+</button>
                          </div>
                        </div>
                        {(() => {
                          const usedQty = (sizeColors[size] ?? []).reduce((s, c) => s + c.qty, 0);
                          const remaining = qty - usedQty;
                          const colorQtyVal = Math.min(sizeColorQtyInput[size] ?? 1, remaining);
                          const addColor = () => {
                            const val = (sizeColorInput[size] ?? "").trim();
                            if (val && remaining > 0) {
                              setSizeColors((prev) => ({ ...prev, [size]: [...(prev[size] ?? []), { name: val, qty: colorQtyVal }] }));
                              setSizeColorInput((prev) => ({ ...prev, [size]: "" }));
                              setSizeColorQtyInput((prev) => ({ ...prev, [size]: 1 }));
                            }
                          };
                          return (
                            <div className="px-4 pb-3">
                              {(sizeColors[size] ?? []).length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mb-2">
                                  {(sizeColors[size] ?? []).map((c, ci) => (
                                    <span key={ci} className="flex items-center gap-1 px-2.5 py-1 bg-white border border-[#1B4D3E]/30 rounded-full text-xs text-[#1B4D3E]" style={{ fontWeight: 500 }}>
                                      {c.name}{c.qty > 1 && <span className="text-[#C9924A]"> ×{c.qty}</span>}
                                      <button type="button" onClick={() => setSizeColors((prev) => ({ ...prev, [size]: prev[size].filter((_, i) => i !== ci) }))} className="ml-0.5 text-gray-400 hover:text-red-500 leading-none">×</button>
                                    </span>
                                  ))}
                                </div>
                              )}
                              {remaining > 0 ? (
                                <div className="flex gap-2 items-center">
                                  <input
                                    type="text"
                                    value={sizeColorInput[size] ?? ""}
                                    onChange={(e) => setSizeColorInput((prev) => ({ ...prev, [size]: e.target.value }))}
                                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addColor(); } }}
                                    placeholder={`Couleur (reste ${remaining})...`}
                                    className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:border-[#1B4D3E] text-gray-700"
                                  />
                                  <div className="flex items-center gap-1 shrink-0">
                                    <button type="button" onClick={() => setSizeColorQtyInput((prev) => ({ ...prev, [size]: Math.max(1, colorQtyVal - 1) }))} disabled={colorQtyVal <= 1} className="w-6 h-6 rounded-full border border-gray-300 text-gray-500 flex items-center justify-center text-sm hover:border-[#1B4D3E] disabled:opacity-40">−</button>
                                    <span className="text-xs w-4 text-center" style={{ fontWeight: 700 }}>{colorQtyVal}</span>
                                    <button type="button" onClick={() => setSizeColorQtyInput((prev) => ({ ...prev, [size]: Math.min(remaining, colorQtyVal + 1) }))} disabled={colorQtyVal >= remaining} className="w-6 h-6 rounded-full border border-gray-300 text-gray-500 flex items-center justify-center text-sm hover:border-[#1B4D3E] disabled:opacity-40">+</button>
                                  </div>
                                  <button type="button" onClick={addColor} className="px-3 py-2 bg-[#1B4D3E] text-white rounded-lg text-xs hover:bg-[#2d6b55] shrink-0">+</button>
                                </div>
                              ) : (
                                <p className="text-xs text-green-600" style={{ fontWeight: 500 }}>✓ Toutes les couleurs définies ({qty}/{qty})</p>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!isStep1Valid}
              className="mt-5 w-full bg-[#1B4D3E] text-white py-3.5 rounded-xl hover:bg-[#2d6b55] disabled:opacity-50 transition-colors"
              style={{ fontWeight: 600 }}
            >
              Continuer →
            </button>
          </motion.div>
        )}

        {/* Step 2: Price & Details */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
              <h2 className="text-gray-900" style={{ fontWeight: 700 }}>Prix & Détails</h2>

              <div className="bg-[#C9924A]/10 border border-[#C9924A]/20 rounded-xl p-3 flex gap-2">
                <Info size={16} className="text-[#C9924A] shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600">
                  La plateforme prélève une commission sur chaque transaction réussie : <strong>15%</strong> pour les Boutiques (vous recevez <strong>85%</strong>) ou <strong>19%</strong> pour les Investisseurs (vous recevez <strong>81%</strong>).
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>Prix par jour (DA) *</label>
                  <input
                    type="number"
                    value={form.pricePerDay}
                    onChange={(e) => updateForm("pricePerDay", e.target.value)}
                    placeholder="Ex: 5000"
                    min="500"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1B4D3E] text-gray-800"
                  />
                  {form.pricePerDay && (
                    <p className="text-xs text-green-600 mt-1">
                      Vous recevez : {(Number(form.pricePerDay) * 0.85).toLocaleString("fr-DZ")} DA/j
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>Caution (DA) *</label>
                  <input
                    type="number"
                    value={form.caution}
                    onChange={(e) => updateForm("caution", e.target.value)}
                    placeholder="Ex: 15000"
                    min="1000"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1B4D3E] text-gray-800"
                  />
                  <p className="text-xs text-gray-400 mt-1">Remboursée si la tenue est rendue en bon état</p>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>Wilaya *</label>
                <select
                  value={form.wilaya}
                  onChange={(e) => updateForm("wilaya", e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1B4D3E] text-gray-700"
                >
                  <option value="">Sélectionner votre wilaya</option>
                  {WILAYAS.map((w) => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={() => setStep(1)} className="flex-1 border border-gray-200 text-gray-600 py-3.5 rounded-xl hover:bg-gray-50 text-sm">
                ← Retour
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!isStep2Valid}
                className="flex-2 flex-1 bg-[#1B4D3E] text-white py-3.5 rounded-xl hover:bg-[#2d6b55] disabled:opacity-50 text-sm"
                style={{ fontWeight: 600 }}
              >
                Continuer →
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Photos */}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
              <h2 className="text-gray-900" style={{ fontWeight: 700 }}>Photos de la tenue</h2>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex gap-2">
                <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600">
                  Les photos sont <strong>obligatoires</strong> et doivent être réelles. Des photos de qualité augmentent vos chances de location de 80%.
                </p>
              </div>

              {/* Upload Zone */}
              <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handlePhotoChange} />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center hover:border-[#1B4D3E] transition-colors cursor-pointer"
              >
                <Upload size={32} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm" style={{ fontWeight: 500 }}>Cliquez pour ajouter vos photos</p>
                <p className="text-gray-400 text-xs mt-1">JPEG, PNG · Max 10MB par photo · Min 3 photos recommandées</p>
                <span className="mt-4 inline-block bg-[#1B4D3E] text-white px-5 py-2 rounded-full text-sm" style={{ fontWeight: 500 }}>
                  Parcourir les fichiers
                </span>
              </div>

              {/* Photo Previews */}
              {photoFiles.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {photoFiles.map((file, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                      <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removePhoto(i)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Summary */}
              <div className="bg-[#FAF6EF] rounded-xl p-4">
                <h4 className="text-gray-800 text-sm mb-3" style={{ fontWeight: 600 }}>Récapitulatif de votre annonce</h4>
                <div className="space-y-2">
                  {[
                    { label: "Titre", value: form.title },
                    { label: "Type", value: form.type },
                    { label: "Prix", value: `${Number(form.pricePerDay).toLocaleString("fr-DZ")} DA/jour` },
                    { label: "Caution", value: `${Number(form.caution).toLocaleString("fr-DZ")} DA` },
                    { label: "Tailles", value: Object.entries(sizeQuantities).map(([s, q]) => `${s} ×${q}${(sizeColors[s] ?? []).length ? ` — ${sizeColors[s].map(c => c.qty > 1 ? `${c.name} ×${c.qty}` : c.name).join(", ")}` : ""}`).join(" · ") },
                    { label: "Occasions", value: form.selectedOccasions.join(", ") },
                    { label: "Wilaya", value: form.wilaya },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-500">{item.label}</span>
                      <span className="text-gray-800 text-right" style={{ fontWeight: 500 }}>{item.value || "—"}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={() => setStep(2)} className="border border-gray-200 text-gray-600 px-6 py-3.5 rounded-xl hover:bg-gray-50 text-sm">
                ← Retour
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 bg-[#C9924A] text-white py-3.5 rounded-xl hover:bg-[#b5803c] disabled:opacity-60 flex items-center justify-center gap-2 text-sm"
                style={{ fontWeight: 600 }}
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Publication en cours...
                  </>
                ) : "✓ Publier mon annonce"}
              </button>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </div>
  );
}

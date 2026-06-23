import { useRef } from "react";
import { X, Printer } from "lucide-react";
import { ReservationFrontend } from "../../hooks/useReservations";
import logoImage from "../../imports/designarena_image_56urdtwj.jpg";

interface Props {
  reservation: ReservationFrontend;
  locataireNom: string;
  locataireEmail: string;
  onClose: () => void;
}

export function ContratLocation({ reservation, locataireNom, locataireEmail, onClose }: Props) {
  const contratRef = useRef<HTMLDivElement>(null);

  const numeroContrat = `KSW-${String(reservation.id).padStart(6, "0")}`;
  const dateAujourdhui = new Date().toLocaleDateString("fr-DZ", { day: "2-digit", month: "long", year: "numeric" });

  const handleImprimer = () => {
    const contenu = contratRef.current?.innerHTML ?? "";
    const fenetre = window.open("", "_blank", "width=900,height=700");
    if (!fenetre) return;
    fenetre.document.write(`
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8"/>
        <title>Contrat de location — ${numeroContrat}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 13px; color: #222; background: white; }
          .page { max-width: 800px; margin: 0 auto; padding: 32px; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #C9924A; padding-bottom: 20px; margin-bottom: 20px; }
          .logo { height: 60px; }
          .titre-contrat { text-align: right; }
          .titre-contrat h1 { color: #1B4D3E; font-size: 20px; font-weight: 700; }
          .titre-contrat p { color: #C9924A; font-size: 15px; font-weight: 600; margin-top: 4px; }
          .titre-contrat small { color: #888; font-size: 11px; }
          .citation { background: #FAF6EF; border-left: 4px solid #C9924A; padding: 12px 16px; margin-bottom: 20px; font-style: italic; color: #555; font-size: 12px; }
          .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
          .box { border: 2px solid #C9924A; border-radius: 8px; padding: 14px; background: #FAF6EF; }
          .box.vert { border-color: #1B4D3E; background: #fff; }
          .box h3 { color: #1B4D3E; font-size: 13px; font-weight: 700; text-transform: uppercase; border-bottom: 2px solid #C9924A; padding-bottom: 6px; margin-bottom: 10px; }
          .box.vert h3 { border-color: #1B4D3E; }
          .box p { color: #555; margin-bottom: 4px; font-size: 12px; }
          .box p strong { color: #222; }
          .section { border: 2px solid #1B4D3E; border-radius: 8px; padding: 14px; margin-bottom: 16px; }
          .section h3 { color: #1B4D3E; font-size: 13px; font-weight: 700; text-transform: uppercase; border-bottom: 2px solid #1B4D3E; padding-bottom: 6px; margin-bottom: 10px; }
          .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
          .date-box { text-align: center; border: 1px solid #ddd; border-radius: 6px; padding: 10px; background: white; }
          .date-box small { color: #888; font-size: 10px; display: block; margin-bottom: 4px; }
          .date-box strong { color: #1B4D3E; font-size: 13px; }
          .financier { border: 2px solid #C9924A; border-radius: 8px; padding: 14px; margin-bottom: 16px; background: #FAF6EF; }
          .financier h3 { color: #1B4D3E; font-size: 13px; font-weight: 700; text-transform: uppercase; border-bottom: 2px solid #C9924A; padding-bottom: 6px; margin-bottom: 10px; }
          .ligne { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #eee; font-size: 12px; }
          .ligne:last-child { border-bottom: none; }
          .total-box { background: #1B4D3E; color: white; padding: 10px 14px; border-radius: 6px; margin-top: 10px; display: flex; justify-content: space-between; font-weight: 700; font-size: 14px; }
          .conditions { border: 1px solid #ddd; border-radius: 8px; padding: 14px; margin-bottom: 20px; background: #f9f9f9; }
          .conditions h3 { color: #1B4D3E; font-size: 13px; font-weight: 700; margin-bottom: 10px; }
          .conditions ul { list-style: none; }
          .conditions li { padding: 3px 0; font-size: 11px; color: #555; }
          .conditions li::before { content: "• "; color: #C9924A; font-weight: bold; }
          .signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 20px; }
          .signature-box { border-top: 2px solid #1B4D3E; padding-top: 10px; }
          .signature-box p { font-size: 12px; color: #444; margin-bottom: 4px; }
          .signature-zone { height: 60px; border-bottom: 1px dashed #aaa; margin-top: 8px; }
          .footer { text-align: center; margin-top: 24px; padding-top: 12px; border-top: 1px solid #ddd; font-size: 10px; color: #aaa; }
          @media print {
            body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
            @page { margin: 15mm; }
          }
        </style>
      </head>
      <body>
        <div class="page">
          ${contenu}
        </div>
        <script>window.onload = function() { window.print(); }<\/script>
      </body>
      </html>
    `);
    fenetre.document.close();
  };

  const caution = reservation.caution ? Number(reservation.caution.montant) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">

        {/* Barre du haut */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 shrink-0">
          <h2 className="text-gray-900" style={{ fontWeight: 700 }}>Contrat de location</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleImprimer}
              className="flex items-center gap-2 bg-[#1B4D3E] text-white px-4 py-2 rounded-xl text-sm hover:bg-[#2d6b55] transition-colors"
              style={{ fontWeight: 600 }}
            >
              <Printer size={16} />
              Télécharger PDF
            </button>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Contenu du contrat */}
        <div className="overflow-y-auto flex-1 p-6 bg-gray-50">
          <div ref={contratRef} className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 max-w-2xl mx-auto" style={{ fontFamily: "'Segoe UI', Arial, sans-serif", fontSize: "13px" }}>

            {/* En-tête */}
            <div className="header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "3px solid #C9924A", paddingBottom: "20px", marginBottom: "20px" }}>
              <div>
                <img src={logoImage} alt="KASEWA.DZ" className="logo" style={{ height: "55px" }} />
                <p style={{ color: "#888", fontSize: "11px", marginTop: "6px" }}>Location de Tenues Traditionnelles</p>
                <p style={{ color: "#888", fontSize: "11px" }}>Tlemcen, Algérie</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <h1 style={{ color: "#1B4D3E", fontSize: "18px", fontWeight: 700 }}>BON DE LOCATION</h1>
                <p style={{ color: "#C9924A", fontSize: "15px", fontWeight: 600, marginTop: "4px" }}>N° {numeroContrat}</p>
                <p style={{ color: "#888", fontSize: "11px", marginTop: "4px" }}>Date : {dateAujourdhui}</p>
              </div>
            </div>

            {/* Citation */}
            <div style={{ background: "#FAF6EF", borderLeft: "4px solid #C9924A", padding: "12px 16px", marginBottom: "20px", fontStyle: "italic", color: "#666", fontSize: "12px", borderRadius: "4px" }}>
              "Nous vous remercions de votre confiance et vous souhaitons une excellente cérémonie."
              <div style={{ textAlign: "right", marginTop: "6px", fontSize: "11px", fontWeight: 600, color: "#1B4D3E" }}>— L'équipe KASEWA.DZ —</div>
            </div>

            {/* Parties */}
            <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div style={{ border: "2px solid #C9924A", borderRadius: "8px", padding: "14px", background: "#FAF6EF" }}>
                <h3 style={{ color: "#1B4D3E", fontWeight: 700, fontSize: "12px", textTransform: "uppercase", borderBottom: "2px solid #C9924A", paddingBottom: "6px", marginBottom: "10px" }}>Le Loueur (Propriétaire)</h3>
                <p style={{ fontWeight: 600, color: "#222", marginBottom: "4px" }}>{reservation.proprietaireNom || "Propriétaire"}</p>
                {reservation.locatairePhone && <p style={{ color: "#555", fontSize: "12px" }}>Tél : {reservation.locatairePhone}</p>}
                <p style={{ color: "#555", fontSize: "12px" }}>Plateforme : KASEWA.DZ</p>
              </div>
              <div style={{ border: "2px solid #1B4D3E", borderRadius: "8px", padding: "14px", background: "#fff" }}>
                <h3 style={{ color: "#1B4D3E", fontWeight: 700, fontSize: "12px", textTransform: "uppercase", borderBottom: "2px solid #1B4D3E", paddingBottom: "6px", marginBottom: "10px" }}>Le Locataire</h3>
                <p style={{ fontWeight: 600, color: "#222", marginBottom: "4px" }}>{locataireNom}</p>
                <p style={{ color: "#555", fontSize: "12px" }}>Email : {locataireEmail}</p>
              </div>
            </div>

            {/* Article loué */}
            <div style={{ border: "2px solid #C9924A", borderRadius: "8px", padding: "14px", background: "#FAF6EF", marginBottom: "16px" }}>
              <h3 style={{ color: "#1B4D3E", fontWeight: 700, fontSize: "12px", textTransform: "uppercase", borderBottom: "2px solid #C9924A", paddingBottom: "6px", marginBottom: "10px" }}>Article loué</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "12px" }}>
                <p><strong>Désignation :</strong> {reservation.tenueTitre}</p>
                <p><strong>Catégorie :</strong> {reservation.tenueType}</p>
                <p><strong>Référence :</strong> {reservation.tenueId}</p>
                <p><strong>État :</strong> Excellent</p>
              </div>
            </div>

            {/* Période */}
            <div style={{ border: "2px solid #1B4D3E", borderRadius: "8px", padding: "14px", marginBottom: "16px" }}>
              <h3 style={{ color: "#1B4D3E", fontWeight: 700, fontSize: "12px", textTransform: "uppercase", borderBottom: "2px solid #1B4D3E", paddingBottom: "6px", marginBottom: "10px" }}>Période de location</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                {[
                  { label: "Date de retrait", val: reservation.dateDebut, color: "#1B4D3E" },
                  { label: "Date de retour", val: reservation.dateFin, color: "#C9924A" },
                  { label: "Durée", val: `${reservation.nbJours} jour(s)`, color: "#1B4D3E" },
                ].map((d, i) => (
                  <div key={i} style={{ textAlign: "center", border: "1px solid #ddd", borderRadius: "6px", padding: "10px", background: "white" }}>
                    <p style={{ fontSize: "10px", color: "#888", marginBottom: "4px" }}>{d.label}</p>
                    <p style={{ fontWeight: 700, color: d.color, fontSize: "13px" }}>{d.val}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Conditions financières */}
            <div style={{ border: "2px solid #C9924A", borderRadius: "8px", padding: "14px", background: "#FAF6EF", marginBottom: "16px" }}>
              <h3 style={{ color: "#1B4D3E", fontWeight: 700, fontSize: "12px", textTransform: "uppercase", borderBottom: "2px solid #C9924A", paddingBottom: "6px", marginBottom: "10px" }}>Conditions financières</h3>
              {[
                { label: "Prix de location", val: reservation.montantTotal, color: "#222" },
                { label: "Caution (remboursable)", val: caution, color: "#555" },
              ].map((l, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #e5e5e5", fontSize: "12px" }}>
                  <span style={{ color: "#555" }}>{l.label}</span>
                  <span style={{ fontWeight: 600, color: l.color }}>{l.val.toLocaleString("fr-DZ")} DA</span>
                </div>
              ))}
              <div style={{ background: "#1B4D3E", color: "white", padding: "10px 14px", borderRadius: "6px", marginTop: "10px", display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "14px" }}>
                <span>TOTAL</span>
                <span>{(reservation.montantTotal + caution).toLocaleString("fr-DZ")} DA</span>
              </div>
            </div>

            {/* Conditions générales */}
            <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "14px", marginBottom: "20px", background: "#f9f9f9" }}>
              <h3 style={{ color: "#1B4D3E", fontWeight: 700, fontSize: "12px", marginBottom: "10px" }}>Conditions générales</h3>
              <ul style={{ listStyle: "none", fontSize: "11px", color: "#555", lineHeight: "1.8" }}>
                {[
                  "Le locataire s'engage à restituer la tenue dans l'état où il l'a reçue.",
                  "Toute dégradation ou tache entraînera une retenue sur la caution.",
                  "Le retard de restitution sera facturé au tarif journalier.",
                  "La caution sera restituée dans un délai de 48h après retour en bon état.",
                  "En cas de litige, les parties s'engagent à recourir à la médiation KASEWA.DZ.",
                ].map((c, i) => (
                  <li key={i} style={{ paddingLeft: "12px", position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, color: "#C9924A", fontWeight: "bold" }}>•</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            {/* Signatures */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginTop: "20px" }}>
              {["Signature du Propriétaire", "Signature du Locataire"].map((s, i) => (
                <div key={i}>
                  <p style={{ fontSize: "12px", fontWeight: 600, color: "#444", marginBottom: "4px" }}>{s}</p>
                  <p style={{ fontSize: "11px", color: "#888", marginBottom: "8px" }}>Lu et approuvé</p>
                  <div style={{ height: "60px", borderBottom: "1px dashed #aaa" }} />
                </div>
              ))}
            </div>

            {/* Pied de page */}
            <div style={{ textAlign: "center", marginTop: "24px", paddingTop: "12px", borderTop: "1px solid #eee", fontSize: "10px", color: "#bbb" }}>
              KASEWA.DZ — Plateforme de location de tenues traditionnelles algériennes — Tlemcen, Algérie
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

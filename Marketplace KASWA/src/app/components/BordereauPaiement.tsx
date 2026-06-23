import { useRef } from "react";
import { Printer, X } from "lucide-react";

interface BordereauProps {
  method: "barid" | "ccp" | "carte";
  montantLocation: number;
  caution: number;
  reference: string;
  locataireNom: string;
  tenueTitre: string;
  dateDebut: string;
  dateFin: string;
  onClose: () => void;
}

const COMPTES = {
  barid: {
    titre: "Virement Barid Mobile / CCP Postal",
    lignes: [
      { label: "Compte bénéficiaire", valeur: "0555 000 001" },
      { label: "Titulaire", valeur: "KASEWA.DZ Platform — SARL" },
      { label: "Agence", valeur: "Barid El Djazaïr — Tlemcen" },
    ],
  },
  ccp: {
    titre: "Virement CCP",
    lignes: [
      { label: "Numéro compte CCP", valeur: "001 000 123456 78" },
      { label: "Clé RIB", valeur: "50" },
      { label: "Titulaire", valeur: "KASEWA.DZ SARL" },
      { label: "Agence", valeur: "Algérie Poste — Tlemcen Centre" },
    ],
  },
  carte: {
    titre: "Virement Bancaire CIB",
    lignes: [
      { label: "RIB (IBAN)", valeur: "DZ58 0300 0000 0123 4567 8900" },
      { label: "Banque", valeur: "CPA — Crédit Populaire d'Algérie" },
      { label: "Agence", valeur: "CPA Tlemcen — Code 030" },
      { label: "Titulaire", valeur: "KASEWA.DZ SARL" },
    ],
  },
};

export function BordereauPaiement({
  method, montantLocation, caution, reference,
  locataireNom, tenueTitre, dateDebut, dateFin, onClose,
}: BordereauProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const total = montantLocation + caution;
  const compte = COMPTES[method];
  const dateAujourdhui = new Date().toLocaleDateString("fr-DZ", { day: "2-digit", month: "2-digit", year: "numeric" });

  const imprimer = () => {
    const contenu = printRef.current?.innerHTML;
    if (!contenu) return;
    const fenetre = window.open("", "_blank", "width=800,height=900");
    if (!fenetre) return;
    fenetre.document.write(`
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <title>Bordereau de Paiement — KASEWA.DZ</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; font-size: 13px; color: #111; background: #fff; }
          .page { width: 21cm; min-height: 29.7cm; margin: 0 auto; padding: 1.5cm; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #1B4D3E; padding-bottom: 12px; margin-bottom: 20px; }
          .logo-text { font-size: 24px; font-weight: 800; color: #1B4D3E; }
          .logo-sub { font-size: 11px; color: #666; margin-top: 2px; }
          .ref-box { text-align: right; }
          .ref-box .ref { font-size: 14px; font-weight: 700; color: #C9924A; }
          .ref-box .date { font-size: 11px; color: #666; margin-top: 4px; }
          .titre { font-size: 18px; font-weight: 700; color: #1B4D3E; text-align: center; margin: 20px 0 8px; }
          .sous-titre { font-size: 12px; color: #666; text-align: center; margin-bottom: 24px; }
          .section { margin-bottom: 20px; }
          .section-titre { font-size: 12px; font-weight: 700; color: #fff; background: #1B4D3E; padding: 6px 12px; border-radius: 4px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
          .tableau { width: 100%; border-collapse: collapse; }
          .tableau td { padding: 8px 12px; border: 1px solid #e5e7eb; font-size: 12px; }
          .tableau td:first-child { font-weight: 600; color: #374151; width: 45%; background: #f9fafb; }
          .montant-box { background: #1B4D3E; color: #fff; border-radius: 8px; padding: 16px 20px; margin: 20px 0; display: flex; justify-content: space-between; align-items: center; }
          .montant-label { font-size: 13px; opacity: 0.8; }
          .montant-valeur { font-size: 28px; font-weight: 800; }
          .montant-detail { font-size: 11px; opacity: 0.65; margin-top: 4px; }
          .compte-box { border: 2px solid #C9924A; border-radius: 8px; padding: 16px; margin: 16px 0; }
          .compte-titre { font-size: 13px; font-weight: 700; color: #C9924A; margin-bottom: 10px; }
          .instructions { background: #FFF8E6; border: 1px solid #F6C84B; border-radius: 6px; padding: 12px; margin: 16px 0; font-size: 12px; color: #7c5e10; line-height: 1.6; }
          .instructions ol { padding-left: 18px; margin-top: 6px; }
          .instructions li { margin-bottom: 4px; }
          .decoupe { border-top: 2px dashed #ccc; margin: 30px 0; padding-top: 20px; display: flex; gap: 20px; }
          .recu-caisse { flex: 1; border: 1px solid #ccc; border-radius: 6px; padding: 12px; min-height: 120px; }
          .recu-caisse-titre { font-size: 11px; font-weight: 700; color: #1B4D3E; margin-bottom: 8px; text-align: center; }
          .recu-ligne { font-size: 11px; border-bottom: 1px dotted #ccc; padding: 4px 0; display: flex; justify-content: space-between; }
          .cachet-zone { flex: 1; border: 1px dashed #999; border-radius: 6px; padding: 12px; min-height: 120px; display: flex; align-items: center; justify-content: center; text-align: center; color: #999; font-size: 11px; }
          .signature-zone { border-top: 1px solid #ccc; margin-top: 30px; padding-top: 16px; display: flex; justify-content: space-between; }
          .signature-item { text-align: center; }
          .signature-ligne { width: 160px; border-top: 1px solid #111; margin: 40px auto 6px; }
          .signature-label { font-size: 11px; color: #666; }
          .footer { margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 12px; font-size: 10px; color: #9ca3af; text-align: center; }
          @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
        </style>
      </head>
      <body>
        <div class="page">
          ${contenu}
        </div>
      </body>
      </html>
    `);
    fenetre.document.close();
    fenetre.focus();
    setTimeout(() => { fenetre.print(); }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Boutons action */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-gray-900 text-sm" style={{ fontWeight: 700 }}>Bordereau de versement</h2>
          <div className="flex gap-2">
            <button onClick={imprimer}
              className="flex items-center gap-1.5 bg-[#1B4D3E] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#2d6b55]"
              style={{ fontWeight: 600 }}>
              <Printer size={15} /> Imprimer
            </button>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Aperçu du bordereau */}
        <div ref={printRef} className="p-6">

          {/* En-tête */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "3px solid #1B4D3E", paddingBottom: "12px", marginBottom: "20px" }}>
            <div>
              <div style={{ fontSize: "22px", fontWeight: 800, color: "#1B4D3E" }}>KESWA.DZ</div>
              <div style={{ fontSize: "11px", color: "#666", marginTop: "2px" }}>Marketplace des Tenues Traditionnelles Algériennes</div>
              <div style={{ fontSize: "11px", color: "#666" }}>contact@keswa.dz — Tlemcen, Algérie</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#C9924A" }}>Réf : {reference}</div>
              <div style={{ fontSize: "11px", color: "#666", marginTop: "4px" }}>Date : {dateAujourdhui}</div>
            </div>
          </div>

          {/* Titre */}
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <div style={{ fontSize: "17px", fontWeight: 700, color: "#1B4D3E" }}>BORDEREAU DE VERSEMENT</div>
            <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>{compte.titre}</div>
          </div>

          {/* Infos réservation */}
          <div style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#fff", background: "#1B4D3E", padding: "5px 10px", borderRadius: "4px", marginBottom: "8px", textTransform: "uppercase" }}>
              Informations de la réservation
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              {[
                ["Locataire", locataireNom],
                ["Tenue", tenueTitre],
                ["Période", `${dateDebut} au ${dateFin}`],
                ["Référence", reference],
              ].map(([label, val]) => (
                <tr key={label}>
                  <td style={{ padding: "7px 10px", border: "1px solid #e5e7eb", fontWeight: 600, color: "#374151", width: "40%", background: "#f9fafb", fontSize: "12px" }}>{label}</td>
                  <td style={{ padding: "7px 10px", border: "1px solid #e5e7eb", fontSize: "12px" }}>{val}</td>
                </tr>
              ))}
            </table>
          </div>

          {/* Montant */}
          <div style={{ background: "#1B4D3E", color: "#fff", borderRadius: "8px", padding: "14px 18px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "12px", opacity: 0.75 }}>Montant total à verser</div>
              <div style={{ fontSize: "11px", opacity: 0.6, marginTop: "3px" }}>
                Location : {montantLocation.toLocaleString("fr-DZ")} DA &nbsp;·&nbsp; Caution remboursable : {caution.toLocaleString("fr-DZ")} DA
              </div>
            </div>
            <div style={{ fontSize: "26px", fontWeight: 800 }}>{total.toLocaleString("fr-DZ")} DA</div>
          </div>

          {/* Compte bénéficiaire */}
          <div style={{ border: "2px solid #C9924A", borderRadius: "8px", padding: "14px", marginBottom: "16px" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#C9924A", marginBottom: "10px" }}>
              Compte bénéficiaire — KASEWA.DZ
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              {compte.lignes.map(({ label, valeur }) => (
                <tr key={label}>
                  <td style={{ padding: "6px 10px", border: "1px solid #f3e8d0", fontWeight: 600, color: "#374151", width: "40%", background: "#fdf8f0", fontSize: "12px" }}>{label}</td>
                  <td style={{ padding: "6px 10px", border: "1px solid #f3e8d0", fontSize: "12px", fontWeight: 500 }}>{valeur}</td>
                </tr>
              ))}
            </table>
          </div>

          {/* Instructions */}
          <div style={{ background: "#FFF8E6", border: "1px solid #F6C84B", borderRadius: "6px", padding: "12px", marginBottom: "20px", fontSize: "12px", color: "#7c5e10", lineHeight: 1.6 }}>
            <strong>Instructions :</strong>
            <ol style={{ paddingLeft: "18px", marginTop: "6px" }}>
              <li>Présentez ce bordereau à votre agence Barid El Djazaïr / Banque.</li>
              <li>Demandez un virement vers le compte indiqué ci-dessus.</li>
              <li>Mentionnez la référence <strong>{reference}</strong> dans le motif du virement.</li>
              <li>Conservez le reçu tamponné remis par l'agence.</li>
              <li>Scannez / photographiez le reçu et uploadez-le sur la plateforme KASEWA.DZ.</li>
            </ol>
          </div>

          {/* Zone découpe */}
          <div style={{ borderTop: "2px dashed #bbb", marginTop: "24px", paddingTop: "18px", display: "flex", gap: "16px" }}>
            <div style={{ flex: 1, border: "1px solid #ccc", borderRadius: "6px", padding: "12px" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#1B4D3E", textAlign: "center", marginBottom: "8px" }}>
                REÇU CLIENT
              </div>
              {[
                ["Réf", reference],
                ["Montant", `${total.toLocaleString("fr-DZ")} DA`],
                ["Locataire", locataireNom],
                ["Date", dateAujourdhui],
              ].map(([l, v]) => (
                <div key={l} style={{ fontSize: "11px", borderBottom: "1px dotted #ddd", padding: "4px 0", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#666" }}>{l} :</span>
                  <span style={{ fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ flex: 1.5, border: "1px dashed #999", borderRadius: "6px", padding: "12px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", color: "#999", minHeight: "100px" }}>
              <div>
                <div style={{ fontSize: "12px", marginBottom: "6px" }}>CACHET ET SIGNATURE</div>
                <div style={{ fontSize: "11px" }}>de l'agence bancaire / postale</div>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div style={{ borderTop: "1px solid #e5e7eb", marginTop: "24px", paddingTop: "14px", display: "flex", justifyContent: "space-between" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: "150px", borderTop: "1px solid #111", margin: "36px auto 6px" }}></div>
              <div style={{ fontSize: "11px", color: "#666" }}>Signature du client</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: "150px", borderTop: "1px solid #111", margin: "36px auto 6px" }}></div>
              <div style={{ fontSize: "11px", color: "#666" }}>Cachet de l'agence</div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ marginTop: "24px", borderTop: "1px solid #e5e7eb", paddingTop: "10px", fontSize: "10px", color: "#9ca3af", textAlign: "center" }}>
            KASEWA.DZ — Plateforme de location de tenues traditionnelles algériennes — contact@keswa.dz
            <br />Ce bordereau est généré automatiquement et constitue une preuve de demande de paiement.
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { parametresApi } from "../services/api";

const DEFAULTS = {
  hero_titre: "Louez ou proposez vos tenues traditionnelles algériennes",
  hero_badge: "La 1ère marketplace de tenues traditionnelles en Algérie",
  prix_livraison: "250",
  sec1_titre: "Caution sécurisée",
  sec1_desc: "La caution est bloquée jusqu'au retour de la tenue en bon état. Votre investissement est protégé.",
  sec2_titre: "Système d'évaluations",
  sec2_desc: "Chaque location donne lieu à des avis bidirectionnels. La réputation est au cœur de notre système.",
  sec3_titre: "Vérification d'identité",
  sec3_desc: "Tous les utilisateurs sont vérifiés par numéro de téléphone et documents officiels pour réduire la fraude.",
  sec4_titre: "Paiements locaux sécurisés",
  sec4_desc: "Barid Mobile, CCP, et CIB — des solutions adaptées à la réalité algérienne et sécurisées HTTPS/SSL.",
  loc1_titre: "Parcourez le catalogue",
  loc1_desc: "Explorez des centaines de tenues traditionnelles authentiques disponibles partout en Algérie.",
  loc2_titre: "Réservez votre tenue",
  loc2_desc: "Sélectionnez vos dates, vérifiez la disponibilité et contactez le propriétaire pour finaliser les détails.",
  loc3_titre: "Payez en toute sécurité",
  loc3_desc: "Effectuez le paiement via Barid Mobile, CCP ou CIB. Une caution est requise pour protéger la tenue.",
  loc4_titre: "Profitez de votre événement",
  loc4_desc: "Récupérez la tenue, profitez de votre événement, puis retournez-la au propriétaire dans les délais convenus.",
  pro1_titre: "Créez votre compte",
  pro1_desc: "Inscrivez-vous gratuitement en tant que propriétaire. Vérifiez votre identité avec votre numéro de téléphone.",
  pro2_titre: "Publiez votre annonce",
  pro2_desc: "Photographiez votre tenue, ajoutez une description détaillée, les tailles disponibles et fixez votre tarif journalier.",
  pro3_titre: "Gérez les réservations",
  pro3_desc: "Recevez des demandes de location. Vous décidez qui peut louer votre tenue et pour quelles dates.",
  pro4_titre: "Recevez vos paiements",
  pro4_desc: "Après chaque location, vous recevez 85% du montant total sur votre compte. Commission plateforme : 15%.",
};

export type SiteParams = typeof DEFAULTS;

export function useSiteParams(): SiteParams {
  const [p, setP] = useState<SiteParams>(DEFAULTS);
  useEffect(() => {
    parametresApi.get()
      .then((res) => {
        const d = res.data;
        setP((prev) => {
          const merged = { ...prev };
          (Object.keys(DEFAULTS) as (keyof SiteParams)[]).forEach((k) => {
            if (d[k] !== undefined && d[k] !== null && d[k] !== "") {
              (merged as any)[k] = String(d[k]);
            }
          });
          return merged;
        });
      })
      .catch(() => {});
  }, []);
  return p;
}

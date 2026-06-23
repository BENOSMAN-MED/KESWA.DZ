import { useState, useEffect, useCallback } from "react";
import { messagesApi, reservationsApi } from "../services/api";
import { useApp } from "../app/context/AppContext";

interface Notifications {
  messagesNonLus: number;
  demandesEnAttente: number;
  total: number;
}

export function useNotifications() {
  const { currentUser } = useApp();
  const [notifs, setNotifs] = useState<Notifications>({
    messagesNonLus: 0,
    demandesEnAttente: 0,
    total: 0,
  });

  const charger = useCallback(async () => {
    if (!currentUser) return;

    try {
      const myId = Number(currentUser.id);

      // Compter messages non lus
      const msgRes = await messagesApi.liste();
      const msgs = msgRes.data?.data ?? msgRes.data ?? [];
      const nonLus = msgs.filter((m: any) => !m.lu && m.destinataire_id === myId).length;

      // Compter demandes en attente (propriétaires uniquement)
      let demandes = 0;
      if (currentUser.role === "owner" || currentUser.role === "proprietaire") {
        const resaRes = await reservationsApi.demandesRecues();
        const reservations = resaRes.data?.data ?? resaRes.data ?? [];
        demandes = reservations.filter((r: any) => r.statut === "demande").length;
      }

      setNotifs({
        messagesNonLus: nonLus,
        demandesEnAttente: demandes,
        total: nonLus + demandes,
      });
    } catch {
      // Silencieux si non connecté
    }
  }, [currentUser]);

  useEffect(() => {
    charger();
    const interval = setInterval(charger, 30000); // Refresh toutes les 30s
    return () => clearInterval(interval);
  }, [charger]);

  return { notifs, recharger: charger };
}

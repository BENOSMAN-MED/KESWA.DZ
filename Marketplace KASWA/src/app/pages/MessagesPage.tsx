import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router";
import { Send, Search, ArrowLeft, MessageCircle, User, Loader2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import { messagesApi } from "../../services/api";
import { toast } from "react-toastify";

interface ApiMessage {
  id: number;
  expediteur_id: number;
  destinataire_id: number;
  contenu: string;
  lu: boolean;
  created_at: string;
  expediteur?: { id: number; nom: string; photo_profil?: string };
  destinataire?: { id: number; nom: string; photo_profil?: string };
}

interface Conversation {
  userId: number;
  nom: string;
  dernierMessage: string;
  date: string;
  nonLus: number;
}

export function MessagesPage() {
  const { currentUser } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const destIdParam = searchParams.get("dest");

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [convMessages, setConvMessages] = useState<ApiMessage[]>([]);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(
    destIdParam ? parseInt(destIdParam) : null,
  );
  const [newMessage, setNewMessage] = useState("");
  const [search, setSearch] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentUser) { navigate("/connexion"); return; }
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    const myId = parseInt(currentUser.id);
    messagesApi.liste()
      .then((res) => {
        const msgs: ApiMessage[] = res.data?.data ?? res.data ?? [];
        const convMap = new Map<number, Conversation>();
        [...msgs]
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .forEach((msg) => {
            const autreId = msg.expediteur_id === myId ? msg.destinataire_id : msg.expediteur_id;
            const autreUser = msg.expediteur_id === myId ? msg.destinataire : msg.expediteur;
            if (!convMap.has(autreId)) {
              convMap.set(autreId, {
                userId: autreId,
                nom: autreUser?.nom ?? `Utilisateur ${autreId}`,
                dernierMessage: msg.contenu,
                date: msg.created_at,
                nonLus: !msg.lu && msg.destinataire_id === myId ? 1 : 0,
              });
            } else {
              if (!msg.lu && msg.destinataire_id === myId) {
                convMap.get(autreId)!.nonLus++;
              }
            }
          });
        const convs = Array.from(convMap.values());
        if (destIdParam && !convMap.has(parseInt(destIdParam))) {
          // Récupérer le vrai nom de l'utilisateur
          messagesApi.utilisateurInfo(parseInt(destIdParam))
            .then((r) => {
              const u = r.data;
              const nomAffiche = u.nom_boutique || u.nom || `Utilisateur ${destIdParam}`;
              convs.unshift({
                userId: parseInt(destIdParam),
                nom: nomAffiche,
                dernierMessage: "",
                date: new Date().toISOString(),
                nonLus: 0,
              });
              setConversations([...convs]);
            })
            .catch(() => {
              convs.unshift({
                userId: parseInt(destIdParam),
                nom: `Utilisateur ${destIdParam}`,
                dernierMessage: "",
                date: new Date().toISOString(),
                nonLus: 0,
              });
              setConversations([...convs]);
            });
        } else {
          setConversations(convs);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingConvs(false));
  }, [currentUser]);

  useEffect(() => {
    if (!selectedUserId) return;
    setLoadingMsgs(true);
    messagesApi.conversation(selectedUserId)
      .then((res) => {
        const msgs: ApiMessage[] = res.data?.data ?? res.data ?? [];
        setConvMessages([...msgs].reverse());
        setConversations((prev) =>
          prev.map((c) => (c.userId === selectedUserId ? { ...c, nonLus: 0 } : c)),
        );
      })
      .catch(() => {})
      .finally(() => setLoadingMsgs(false));
  }, [selectedUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [convMessages, selectedUserId]);

  if (!currentUser) return null;

  const myId = parseInt(currentUser.id);

  const envoyer = async () => {
    if (!newMessage.trim() || !selectedUserId || sending) return;
    const content = newMessage.trim();
    setNewMessage("");
    setSending(true);
    try {
      const res = await messagesApi.envoyer(selectedUserId, content);
      setConvMessages((prev) => [...prev, res.data]);
      setConversations((prev) => {
        const exists = prev.find((c) => c.userId === selectedUserId);
        if (exists) {
          return prev.map((c) =>
            c.userId === selectedUserId ? { ...c, dernierMessage: content, date: new Date().toISOString() } : c,
          );
        }
        const convExistante = conversations.find(c => c.userId === selectedUserId);
        return [
          { userId: selectedUserId, nom: convExistante?.nom ?? `Utilisateur ${selectedUserId}`, dernierMessage: content, date: new Date().toISOString(), nonLus: 0 },
          ...prev,
        ];
      });
    } catch {
      toast.error("Erreur lors de l'envoi du message");
      setNewMessage(content);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); envoyer(); }
  };

  const convFiltrees = conversations.filter((c) =>
    c.nom.toLowerCase().includes(search.toLowerCase()),
  );
  const selectedConv = conversations.find((c) => c.userId === selectedUserId);
  const totalNonLus = conversations.reduce((acc, c) => acc + c.nonLus, 0);

  return (
    <div className="min-h-screen bg-[#FAF6EF] pt-16">
      <div className="max-w-6xl mx-auto px-4 py-6" style={{ height: "calc(100vh - 4rem)" }}>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden h-full flex">

          {/* ─── Sidebar conversations ─── */}
          <div className={`w-full md:w-80 border-r border-gray-100 flex flex-col ${selectedUserId ? "hidden md:flex" : "flex"}`}>
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg text-gray-900 flex items-center gap-2" style={{ fontWeight: 700 }}>
                  <MessageCircle size={20} className="text-[#1B4D3E]" />
                  Messagerie
                  {totalNonLus > 0 && (
                    <span className="w-5 h-5 bg-[#C9924A] text-white text-xs rounded-full flex items-center justify-center" style={{ fontWeight: 700 }}>
                      {totalNonLus}
                    </span>
                  )}
                </h2>
              </div>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher une conversation..."
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-[#1B4D3E]"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loadingConvs ? (
                <div className="flex justify-center py-12"><Loader2 className="animate-spin text-gray-300" size={24} /></div>
              ) : convFiltrees.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <MessageCircle size={32} className="mx-auto text-gray-200 mb-3" />
                  <p className="text-gray-500 text-sm" style={{ fontWeight: 500 }}>Aucune conversation</p>
                  <p className="text-gray-400 text-xs mt-1">Contactez un propriétaire depuis une annonce</p>
                  <Link to="/catalogue" className="inline-block mt-4 text-xs bg-[#1B4D3E] text-white px-4 py-2 rounded-full" style={{ fontWeight: 500 }}>
                    Explorer le catalogue
                  </Link>
                </div>
              ) : (
                convFiltrees.map((conv) => (
                  <button
                    key={conv.userId}
                    onClick={() => setSelectedUserId(conv.userId)}
                    className={`w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 ${
                      selectedUserId === conv.userId ? "bg-[#1B4D3E]/5 border-l-2 border-l-[#1B4D3E]" : ""
                    }`}
                  >
                    <div className="w-10 h-10 bg-[#1B4D3E] rounded-full flex items-center justify-center shrink-0 text-white text-sm" style={{ fontWeight: 700 }}>
                      {conv.nom[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-800 truncate" style={{ fontWeight: 600 }}>{conv.nom}</p>
                        {conv.nonLus > 0 && (
                          <span className="w-5 h-5 bg-[#C9924A] text-white text-xs rounded-full flex items-center justify-center shrink-0 ml-1" style={{ fontWeight: 700 }}>
                            {conv.nonLus}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 truncate mt-0.5">
                        {conv.dernierMessage || <span className="italic">Nouvelle conversation</span>}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* ─── Zone de chat ─── */}
          <div className={`flex-1 flex flex-col ${!selectedUserId ? "hidden md:flex" : "flex"}`}>
            {!selectedUserId ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 bg-[#1B4D3E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle size={36} className="text-[#1B4D3E]/40" />
                </div>
                <h3 className="text-gray-700 mb-2" style={{ fontWeight: 600 }}>Sélectionnez une conversation</h3>
                <p className="text-gray-400 text-sm max-w-xs">
                  Choisissez une conversation à gauche ou contactez un propriétaire depuis une annonce.
                </p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex items-center gap-3 p-4 border-b border-gray-100 bg-white">
                  <button onClick={() => setSelectedUserId(null)} className="md:hidden p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                    <ArrowLeft size={20} />
                  </button>
                  <div className="w-10 h-10 bg-[#1B4D3E] rounded-full flex items-center justify-center text-white" style={{ fontWeight: 700 }}>
                    {selectedConv?.nom?.[0]?.toUpperCase() ?? <User size={16} />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900" style={{ fontWeight: 600 }}>
                      {selectedConv?.nom ?? `Utilisateur ${selectedUserId}`}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAF6EF]/30">
                  {loadingMsgs ? (
                    <div className="flex justify-center py-10"><Loader2 className="animate-spin text-gray-300" size={24} /></div>
                  ) : convMessages.length === 0 ? (
                    <div className="text-center py-10">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <MessageCircle size={22} className="text-gray-300" />
                      </div>
                      <p className="text-gray-400 text-sm">Commencez la conversation !</p>
                    </div>
                  ) : (
                    convMessages.map((msg) => {
                      const isMine = msg.expediteur_id === myId;
                      return (
                        <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                          {!isMine && (
                            <div className="w-7 h-7 bg-[#1B4D3E] rounded-full flex items-center justify-center text-white text-xs shrink-0 mr-2 mt-1" style={{ fontWeight: 700 }}>
                              {(msg.expediteur?.nom ?? selectedConv?.nom ?? "?")[0]?.toUpperCase()}
                            </div>
                          )}
                          <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm ${
                            isMine ? "bg-[#1B4D3E] text-white rounded-br-sm" : "bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100"
                          }`}>
                            <p className="leading-relaxed">{msg.contenu}</p>
                            <p className={`text-xs mt-1 ${isMine ? "text-white/60" : "text-gray-400"}`}>
                              {new Date(msg.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Zone de saisie */}
                <div className="p-4 border-t border-gray-100 bg-white">
                  <div className="flex items-end gap-2">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Écrivez votre message..."
                      rows={1}
                      className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none resize-none focus:border-[#1B4D3E] max-h-32"
                      style={{ lineHeight: "1.5" }}
                    />
                    <button
                      onClick={envoyer}
                      disabled={!newMessage.trim() || sending}
                      className="w-11 h-11 bg-[#1B4D3E] text-white rounded-xl flex items-center justify-center hover:bg-[#2d6b55] disabled:opacity-40 shrink-0 transition-colors"
                    >
                      {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-300 mt-1.5 ml-1">Entrée pour envoyer · Maj+Entrée pour saut de ligne</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

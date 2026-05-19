"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  MessageSquare,
  Send,
  ArrowLeft,
  Search,
  Phone,
  Wifi,
  WifiOff,
  Plus,
  User,
  Settings,
  X,
  Smartphone,
  RefreshCw,
  Loader2,
} from "lucide-react";
import type { Conversation, InboxMessage, Channel } from "@/types/database";

interface AdminMessagesProps {
  conversations: Conversation[];
  channels: Channel[];
}

function timeAgo(dateStr: string | null) {
  if (!dateStr) return "—";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Agora";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "short",
  });
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return "Hoje";
  if (d.toDateString() === yesterday.toDateString()) return "Ontem";
  return d.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function displayName(conv: Conversation): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = (conv as any).profile as {
    first_name: string;
    last_name: string;
    whatsapp?: string;
    phone?: string;
  } | null;
  if (p) return `${p.first_name} ${p.last_name}`;
  if (conv.subject) return conv.subject;
  return "Contato desconhecido";
}

function contactPhone(conv: Conversation): string | null {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = (conv as any).profile as { whatsapp?: string; phone?: string } | null;
  return p?.whatsapp || p?.phone || conv.subject || null;
}

function QRCodeModal({
  onClose,
  onConnected,
}: {
  onClose: () => void;
  onConnected: () => void;
}) {
  const [state, setState] = useState<"loading" | "scanning" | "connected" | "error">(
    "loading",
  );
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startConnection = async () => {
    setState("loading");
    setError(null);
    try {
      const res = await fetch("/api/unipile/connect", { method: "POST" });
      const data = (await res.json()) as {
        qrDataUrl?: string;
        accountId?: string;
        error?: string;
      };
      if (!res.ok || data.error) {
        throw new Error(data.error || "Falha ao gerar QR code");
      }
      setQrDataUrl(data.qrDataUrl ?? null);
      setAccountId(data.accountId ?? null);
      setState("scanning");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      setState("error");
    }
  };

  const mountedRef = useRef(false);
  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    startConnection();
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  useEffect(() => {
    if (state !== "scanning" || !accountId) return;

    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/unipile/status?accountId=${accountId}`);
        const data = (await res.json()) as { connected?: boolean };
        if (data.connected) {
          setState("connected");
          if (pollRef.current) clearInterval(pollRef.current);
          setTimeout(() => onConnected(), 1500);
        }
      } catch {
        // Keep polling
      }
    }, 3000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [state, accountId, onConnected]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm rounded-xl border border-border bg-background p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Conectar WhatsApp</h2>
          <button onClick={onClose} className="rounded p-1 hover:bg-background-secondary">
            <X size={20} />
          </button>
        </div>

        {state === "loading" && (
          <div className="flex flex-col items-center py-8 gap-3">
            <Loader2 size={32} className="animate-spin text-accent" />
            <p className="text-sm text-foreground-secondary">Gerando QR code...</p>
          </div>
        )}

        {state === "scanning" && qrDataUrl && (
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-xl border-2 border-border p-3 bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrDataUrl}
                alt="QR Code WhatsApp"
                width={280}
                height={280}
                className="rounded-lg"
              />
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm font-medium">Escaneie com seu WhatsApp</p>
              <ol className="text-xs text-foreground-secondary space-y-1 text-left">
                <li>1. Abra o WhatsApp no celular</li>
                <li>
                  2. Toque em <strong>Configurações</strong> →{" "}
                  <strong>Aparelhos conectados</strong>
                </li>
                <li>
                  3. Toque em <strong>Conectar um aparelho</strong>
                </li>
                <li>4. Aponte a câmera para o QR code acima</li>
              </ol>
            </div>
            <div className="flex items-center gap-2 text-xs text-foreground-secondary">
              <Loader2 size={12} className="animate-spin" />
              Aguardando conexão...
            </div>
          </div>
        )}

        {state === "connected" && (
          <div className="flex flex-col items-center py-8 gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
              <Wifi size={32} className="text-success" />
            </div>
            <p className="text-sm font-semibold text-success">WhatsApp conectado!</p>
            <p className="text-xs text-foreground-secondary">Recarregando...</p>
          </div>
        )}

        {state === "error" && (
          <div className="flex flex-col items-center py-8 gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-error/10">
              <WifiOff size={32} className="text-error" />
            </div>
            <p className="text-sm text-error">{error}</p>
            <button
              onClick={startConnection}
              className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90"
            >
              <RefreshCw size={14} />
              Tentar novamente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function AdminMessages({
  conversations: initialConversations,
  channels,
}: AdminMessagesProps) {
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [disconnecting, setDisconnecting] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const whatsappChannel = channels.find(
    (ch) => ch.type === "whatsapp" && ch.status === "connected",
  );

  const handleDisconnect = async () => {
    if (!whatsappChannel) return;
    setDisconnecting(true);
    try {
      await fetch("/api/unipile/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelId: whatsappChannel.id }),
      });
      window.location.reload();
    } finally {
      setDisconnecting(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await fetch("/api/unipile/sync", { method: "POST" });
      window.location.reload();
    } finally {
      setSyncing(false);
    }
  };

  const selected = conversations.find((c) => c.id === selectedId);

  const filtered = conversations.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const name = displayName(c).toLowerCase();
    const preview = c.last_message_preview?.toLowerCase() ?? "";
    return name.includes(q) || preview.includes(q);
  });

  const handleMessageSent = useCallback((conversationId: string, preview: string) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              last_message_at: new Date().toISOString(),
              last_message_preview: preview.slice(0, 100),
              unread_count: 0,
            }
          : c,
      ),
    );
  }, []);

  // Mobile: show thread only
  if (selected && typeof window !== "undefined" && window.innerWidth < 1024) {
    return (
      <div className="flex h-[calc(100vh-64px)] flex-col">
        <ThreadView
          key={selected.id}
          conversation={selected}
          onBack={() => setSelectedId(null)}
          onMessageSent={handleMessageSent}
        />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <div className="flex w-full flex-col border-r border-border lg:w-[340px] lg:shrink-0">
        <div className="flex items-center justify-between px-4 pt-4">
          <h1 className="text-lg font-bold">Mensagens</h1>
          <div className="flex items-center gap-2">
            {whatsappChannel ? (
              <>
                <span className="flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                  <Wifi size={12} />
                  Conectado
                </span>
                <button
                  onClick={handleSync}
                  disabled={syncing}
                  className="rounded-lg p-1.5 hover:bg-background-secondary transition-colors"
                  title="Sincronizar mensagens"
                >
                  <RefreshCw
                    size={16}
                    className={`text-foreground-secondary ${syncing ? "animate-spin" : ""}`}
                  />
                </button>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="rounded-lg p-1.5 hover:bg-background-secondary transition-colors"
                  title="Configurações do WhatsApp"
                >
                  <Settings size={16} className="text-foreground-secondary" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowQR(true)}
                className="flex items-center gap-1.5 rounded-lg bg-success px-3 py-1.5 text-xs font-medium text-white hover:bg-success/90"
              >
                <Plus size={12} />
                Conectar WhatsApp
              </button>
            )}
          </div>
        </div>

        {whatsappChannel && showSettings && (
          <div className="mx-4 mt-3 rounded-lg border border-border bg-background p-3 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone size={16} className="text-success" />
                <span className="text-sm font-medium">WhatsApp</span>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="rounded p-0.5 hover:bg-background-secondary"
              >
                <X size={14} className="text-foreground-secondary" />
              </button>
            </div>
            <div className="space-y-1.5 text-xs text-foreground-secondary">
              {whatsappChannel.label && (
                <p>
                  <span className="font-medium text-foreground">Número:</span>{" "}
                  {whatsappChannel.label}
                </p>
              )}
              {whatsappChannel.connected_at && (
                <p>
                  <span className="font-medium text-foreground">Conectado em:</span>{" "}
                  {new Date(whatsappChannel.connected_at).toLocaleDateString("pt-BR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              )}
              <p>
                <span className="font-medium text-foreground">Status:</span>{" "}
                <span className="text-success">Ativo</span>
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowQR(true)}
                className="flex-1 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-background-secondary transition-colors"
              >
                Conectar outro
              </button>
              <button
                onClick={handleDisconnect}
                disabled={disconnecting}
                className="flex-1 rounded-lg border border-error/30 px-3 py-2 text-xs font-medium text-error hover:bg-error/5 disabled:opacity-50 transition-colors"
              >
                {disconnecting ? "Desconectando..." : "Desconectar"}
              </button>
            </div>
          </div>
        )}

        {!whatsappChannel && (
          <div className="mx-4 mt-3 flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/5 px-3 py-2">
            <WifiOff size={14} className="mt-0.5 shrink-0 text-warning" />
            <p className="text-xs text-foreground-secondary">
              Nenhum WhatsApp conectado. Conecte para enviar e receber mensagens.
            </p>
          </div>
        )}

        <div className="relative mt-3 px-4">
          <Search
            size={14}
            className="absolute left-7 top-1/2 -translate-y-1/2 text-foreground-secondary"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar conversas..."
            className="h-9 w-full rounded-lg border border-border pl-9 pr-3 text-sm outline-none placeholder:text-foreground-secondary/50 focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </div>

        <div className="mt-2 flex-1 space-y-0.5 overflow-y-auto px-2">
          {filtered.length === 0 ? (
            <div className="py-12 text-center">
              <MessageSquare size={24} className="mx-auto text-foreground-secondary/30" />
              <p className="mt-2 text-sm text-foreground-secondary">
                {conversations.length === 0
                  ? "Nenhuma conversa ainda"
                  : "Nenhum resultado"}
              </p>
            </div>
          ) : (
            filtered.map((conv) => {
              const name = displayName(conv);
              const phone = contactPhone(conv);
              const unread = conv.unread_count > 0;
              return (
                <button
                  key={conv.id}
                  onClick={() => setSelectedId(conv.id)}
                  className={`flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left transition ${
                    selectedId === conv.id
                      ? "bg-accent/5 border border-accent/20"
                      : "hover:bg-background-secondary border border-transparent"
                  }`}
                >
                  <div className="relative">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                      <User size={18} className="text-accent" />
                    </div>
                    {unread && (
                      <div className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-accent" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={`truncate text-sm ${unread ? "font-semibold" : "font-medium text-foreground-secondary"}`}
                      >
                        {name}
                      </p>
                      <span className="shrink-0 text-[10px] text-foreground-secondary">
                        {timeAgo(conv.last_message_at)}
                      </span>
                    </div>
                    {phone && (
                      <p className="truncate text-[11px] text-foreground-secondary">
                        {phone}
                      </p>
                    )}
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <MessageSquare size={10} className="shrink-0 text-success" />
                      <p
                        className={`truncate text-xs ${unread ? "font-medium" : "text-foreground-secondary"}`}
                      >
                        {conv.last_message_preview || "Sem mensagens"}
                      </p>
                    </div>
                    {unread && (
                      <span className="mt-1 inline-block rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold text-white">
                        {conv.unread_count}
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Thread */}
      <div className="hidden flex-1 lg:flex lg:flex-col">
        {selected ? (
          <ThreadView
            key={selected.id}
            conversation={selected}
            onBack={() => setSelectedId(null)}
            onMessageSent={handleMessageSent}
          />
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <MessageSquare size={32} className="mx-auto text-foreground-secondary/30" />
              <p className="mt-3 text-sm font-medium text-foreground-secondary">
                Selecione uma conversa
              </p>
              <p className="mt-1 text-xs text-foreground-secondary">
                Escolha uma conversa na lista para ver as mensagens
              </p>
            </div>
          </div>
        )}
      </div>

      {showQR && (
        <QRCodeModal
          onClose={() => setShowQR(false)}
          onConnected={() => {
            setShowQR(false);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}

function ThreadView({
  conversation,
  onBack,
  onMessageSent,
}: {
  conversation: Conversation;
  onBack: () => void;
  onMessageSent: (conversationId: string, preview: string) => void;
}) {
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const name = displayName(conversation);
  const phone = contactPhone(conversation);

  useEffect(() => {
    let mounted = true;

    fetch(`/api/inbox/messages?conversationId=${conversation.id}`)
      .then((r) => r.json() as Promise<{ messages: InboxMessage[] }>)
      .then((data) => {
        if (mounted) {
          setMessages(data.messages);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });

    fetch("/api/inbox/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId: conversation.id }),
    }).catch(() => {});

    return () => {
      mounted = false;
    };
  }, [conversation.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSend = async () => {
    if (!reply.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/inbox/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: conversation.id, body: reply.trim() }),
      });
      if (res.ok) {
        const sent: InboxMessage = {
          id: crypto.randomUUID(),
          conversation_id: conversation.id,
          direction: "outbound",
          sender: "admin",
          body: reply.trim(),
          media_url: null,
          content_type: "text",
          status: "sent",
          metadata: {},
          created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, sent]);
        onMessageSent(conversation.id, reply.trim());
        setReply("");
      }
    } finally {
      setSending(false);
    }
  };

  let lastDate = "";

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="shrink-0 border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="rounded-lg p-1.5 hover:bg-background-secondary lg:hidden"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10">
            <User size={16} className="text-accent" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">{name}</p>
            {phone && (
              <div className="flex items-center gap-1.5">
                <Phone size={10} className="text-success" />
                <span className="text-xs text-foreground-secondary">{phone}</span>
              </div>
            )}
          </div>
          {phone && (
            <a
              href={`https://wa.me/${phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-background-secondary transition-colors"
            >
              <MessageSquare size={12} className="text-success" />
              Abrir no WhatsApp
            </a>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 space-y-2 bg-background-secondary/50">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          </div>
        ) : messages.length === 0 ? (
          <p className="py-8 text-center text-sm text-foreground-secondary">
            Nenhuma mensagem ainda
          </p>
        ) : (
          messages.map((msg) => {
            const msgDate = formatDate(msg.created_at);
            let showDate = false;
            if (msgDate !== lastDate) {
              lastDate = msgDate;
              showDate = true;
            }
            const isOutbound = msg.direction === "outbound";
            const meta = msg.metadata as Record<string, string> | undefined;
            const senderName = meta?.sender_name;

            return (
              <div key={msg.id}>
                {showDate && (
                  <div className="flex justify-center py-2">
                    <span className="rounded-full bg-background px-3 py-0.5 text-[10px] font-medium text-foreground-secondary border border-border">
                      {msgDate}
                    </span>
                  </div>
                )}
                <div className={`flex ${isOutbound ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                      isOutbound
                        ? "bg-accent text-white rounded-br-md"
                        : "bg-background border border-border rounded-bl-md"
                    }`}
                  >
                    {!isOutbound && senderName && (
                      <p className="text-[10px] font-semibold text-accent mb-0.5">
                        {senderName}
                      </p>
                    )}
                    <p className="text-sm whitespace-pre-wrap">
                      {msg.body || "📎 Anexo"}
                    </p>
                    <p
                      className={`mt-1 text-[10px] text-right ${isOutbound ? "text-white/60" : "text-foreground-secondary"}`}
                    >
                      {new Date(msg.created_at).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply bar */}
      <div className="shrink-0 border-t border-border bg-background p-3">
        <div className="flex items-end gap-2">
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Digite uma mensagem..."
            rows={1}
            className="min-h-[36px] max-h-[120px] w-full resize-none rounded-xl border border-border bg-background-secondary px-4 py-2.5 text-sm outline-none placeholder:text-foreground-secondary/50 focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
          <button
            disabled={!reply.trim() || sending}
            onClick={handleSend}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-white transition hover:bg-accent/90 disabled:opacity-40"
          >
            {sending ? (
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
        <p className="mt-1.5 text-[10px] text-foreground-secondary">
          Respondendo via WhatsApp
        </p>
      </div>
    </div>
  );
}

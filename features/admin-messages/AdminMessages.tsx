"use client";

import { useState } from "react";
import { MessageSquare, Mail, Send } from "lucide-react";
import type { MessageLog } from "@/types/database";

interface AdminMessagesProps {
  messages: MessageLog[];
}

export function AdminMessages({ messages }: AdminMessagesProps) {
  const [activeTab, setActiveTab] = useState<"whatsapp" | "email">("whatsapp");

  const filteredMessages = messages.filter((m) => m.channel === activeTab);

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Mensagens</h1>

      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("whatsapp")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${
            activeTab === "whatsapp"
              ? "bg-accent text-white"
              : "border border-border hover:bg-background-secondary"
          }`}
        >
          <MessageSquare size={16} />
          WhatsApp
        </button>
        <button
          onClick={() => setActiveTab("email")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${
            activeTab === "email"
              ? "bg-accent text-white"
              : "border border-border hover:bg-background-secondary"
          }`}
        >
          <Mail size={16} />
          Email
        </button>
      </div>

      <div className="rounded-xl border border-border">
        {filteredMessages.length === 0 ? (
          <div className="p-8 text-center text-foreground-secondary">
            Nenhuma mensagem de {activeTab === "whatsapp" ? "WhatsApp" : "email"} ainda.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredMessages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-4 p-4">
                <div
                  className={`rounded-full p-2 ${
                    msg.direction === "outbound"
                      ? "bg-accent/10"
                      : "bg-background-secondary"
                  }`}
                >
                  {msg.channel === "whatsapp" ? (
                    <MessageSquare size={16} className="text-accent" />
                  ) : (
                    <Mail size={16} className="text-accent" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium uppercase text-foreground-secondary">
                      {msg.direction === "outbound" ? "Enviado" : "Recebido"}
                    </span>
                    <span className="text-xs text-foreground-secondary">
                      {new Date(msg.sent_at).toLocaleString("pt-BR")}
                    </span>
                  </div>
                  <p className="mt-1 text-sm">{msg.content}</p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    msg.status === "read"
                      ? "bg-success/10 text-success"
                      : msg.status === "delivered"
                        ? "bg-accent/10 text-accent"
                        : msg.status === "sent"
                          ? "bg-warning/10 text-warning"
                          : "bg-error/10 text-error"
                  }`}
                >
                  {msg.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Digite uma mensagem..."
          className="flex-1 rounded-lg border border-border px-4 py-2.5 focus:border-accent focus:outline-none"
        />
        <button className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent/90">
          <Send size={16} />
          Enviar
        </button>
      </div>
    </div>
  );
}

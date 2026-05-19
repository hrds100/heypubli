import { AdminMessages } from "@/features/admin-messages";
import type { MessageLog } from "@/types/database";

const MOCK_MESSAGES: MessageLog[] = [
  {
    id: "msg-1",
    profile_id: "user-1",
    channel: "whatsapp",
    direction: "outbound",
    content: "Oi Ana! Tudo bem? Seu conteúdo está ótimo, parabéns!",
    status: "read",
    sent_at: "2026-05-19T10:30:00Z",
    sent_by: "admin-1",
  },
  {
    id: "msg-2",
    profile_id: "user-1",
    channel: "email",
    direction: "outbound",
    content: "Bem-vinda ao HeyPubli! Confira as marcas disponíveis.",
    status: "delivered",
    sent_at: "2026-05-18T09:00:00Z",
    sent_by: "admin-1",
  },
];

export default function MensagensPage() {
  return <AdminMessages messages={MOCK_MESSAGES} />;
}

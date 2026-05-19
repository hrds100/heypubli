import { AdminMessages } from "@/features/admin-messages";
import { getConversations, getChannels } from "@/lib/data/inbox";

export default async function MensagensPage() {
  const [conversations, channels] = await Promise.all([
    getConversations(),
    getChannels(),
  ]);
  return <AdminMessages conversations={conversations} channels={channels} />;
}

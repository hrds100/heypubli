import { AdminMessages } from "@/features/admin-messages";
import { getAllMessages } from "@/lib/data";

export default async function MensagensPage() {
  const messages = await getAllMessages();
  return <AdminMessages messages={messages} />;
}

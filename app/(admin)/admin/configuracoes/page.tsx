import { AdminPostingSettings } from "@/features/admin-posting-settings";
import { getPostingSettingsAdmin } from "@/lib/data/outstand";

export default async function AdminConfiguracoesPage() {
  const settings = await getPostingSettingsAdmin();

  return <AdminPostingSettings settings={settings} />;
}

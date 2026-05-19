import { AdminScheduler } from "@/features/admin-scheduler";

const MOCK_INFLUENCERS = [
  { id: "user-1", first_name: "Ana", last_name: "Silva" },
  { id: "user-2", first_name: "Carlos", last_name: "Santos" },
  { id: "user-3", first_name: "Maria", last_name: "Oliveira" },
];

export default function AgendadorPage() {
  return <AdminScheduler influencers={MOCK_INFLUENCERS} />;
}

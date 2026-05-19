import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OnboardingWizard } from "@/features/onboarding";
import { getAllSectors } from "@/lib/data";
import type { Sector } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const sectors: Sector[] = await getAllSectors();

  const userName = user.user_metadata?.first_name || "Influenciador";

  return (
    <Suspense>
      <OnboardingWizard sectors={sectors} userName={userName} />
    </Suspense>
  );
}

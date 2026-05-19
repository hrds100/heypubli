import { Suspense } from "react";
import { OnboardingWizard } from "@/features/onboarding";
import { SECTORS } from "@/mocks/sectors.mock";

export default function OnboardingPage() {
  return (
    <Suspense>
      <OnboardingWizard sectors={SECTORS} userName="Influenciador" />
    </Suspense>
  );
}

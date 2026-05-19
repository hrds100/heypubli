import { OnboardingWizard } from "@/features/onboarding";
import { SECTORS } from "@/mocks/sectors.mock";

export default function OnboardingPage() {
  return <OnboardingWizard sectors={SECTORS} userName="Influenciador" />;
}

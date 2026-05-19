interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const STEP_LABELS = [
  "Dados Pessoais",
  "Conectar Instagram",
  "Setores Preferidos",
  "Tópicos da Rede",
  "Seu Perfil",
  "Pronto!",
];

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1;
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;

        return (
          <div key={step} className="flex items-center gap-2">
            <div
              data-testid={`step-${step}`}
              data-active={isActive ? "true" : "false"}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                isActive
                  ? "bg-accent text-white"
                  : isCompleted
                    ? "bg-success text-white"
                    : "bg-background-secondary text-foreground-secondary"
              }`}
            >
              {step}
            </div>
            <span className="hidden text-xs text-foreground-secondary sm:inline">
              {STEP_LABELS[i]}
            </span>
            {step < totalSteps && (
              <div className={`h-0.5 w-6 ${isCompleted ? "bg-success" : "bg-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

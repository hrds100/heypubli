"use client";

const IS_PRODUCTION = process.env.NEXT_PUBLIC_VERCEL_ENV === "production";

const testAccounts = [
  {
    role: "Admin",
    email: "admin@heypubli.com",
    password: "admin123456",
    bg: "bg-purple-50",
    border: "border-purple-200 hover:border-purple-300",
    text: "text-purple-700",
    dot: "bg-purple-400",
  },
  {
    role: "Influenciador",
    email: "influencer@heypubli.com",
    password: "test123456",
    bg: "bg-pink-50",
    border: "border-pink-200 hover:border-pink-300",
    text: "text-pink-700",
    dot: "bg-pink-400",
  },
];

export function TestCredentials() {
  function fillForm(email: string, password: string) {
    const emailInput = document.getElementById("email") as HTMLInputElement | null;
    const passwordInput = document.getElementById("password") as HTMLInputElement | null;
    if (emailInput) {
      emailInput.value = email;
      emailInput.dispatchEvent(new Event("input", { bubbles: true }));
    }
    if (passwordInput) {
      passwordInput.value = password;
      passwordInput.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }

  if (IS_PRODUCTION) return null;

  return (
    <div className="rounded-xl border border-border p-4">
      <p className="mb-3 text-center text-xs font-medium tracking-wide text-foreground-secondary uppercase">
        Contas de teste
      </p>
      <div className="flex gap-2">
        {testAccounts.map((account) => (
          <button
            key={account.role}
            type="button"
            onClick={() => fillForm(account.email, account.password)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${account.bg} ${account.border} ${account.text}`}
          >
            <span className={`h-2 w-2 rounded-full ${account.dot}`} />
            {account.role}
          </button>
        ))}
      </div>
    </div>
  );
}

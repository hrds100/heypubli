"use client";

const testAccounts = [
  {
    role: "Admin",
    email: "admin@heypubli.com",
    password: "admin123456",
    color: "bg-purple-50 border-purple-200 text-purple-700",
  },
  {
    role: "Influenciador",
    email: "influencer@heypubli.com",
    password: "test123456",
    color: "bg-pink-50 border-pink-200 text-pink-700",
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

  return (
    <div className="rounded-xl border border-border bg-background-secondary p-4">
      <p className="mb-3 text-center text-xs font-semibold tracking-wide text-foreground-secondary uppercase">
        Contas de teste
      </p>
      <div className="flex gap-2">
        {testAccounts.map((account) => (
          <button
            key={account.role}
            type="button"
            onClick={() => fillForm(account.email, account.password)}
            className={`flex-1 rounded-lg border px-3 py-2 text-center text-sm font-medium transition-colors hover:opacity-80 ${account.color}`}
          >
            {account.role}
          </button>
        ))}
      </div>
    </div>
  );
}

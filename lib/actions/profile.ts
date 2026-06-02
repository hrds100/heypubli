"use server";

import { createClient } from "@/lib/supabase/server";
import { contactSchema } from "@/schemas";
import { redirect } from "next/navigation";

/**
 * Save the real email + WhatsApp captured right after the first Instagram login.
 * Clears needs_contact so the influencer can proceed into onboarding.
 */
export async function saveContactInfo(
  formData: FormData,
): Promise<{ error: string } | null> {
  const parsed = contactSchema.safeParse({
    email: formData.get("email"),
    whatsapp: formData.get("whatsapp"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (supabase.from("profiles") as any)
    .update({
      email: parsed.data.email,
      whatsapp: parsed.data.whatsapp,
      needs_contact: false,
    })
    .eq("id", user.id);

  if (error) {
    return { error: "Não foi possível salvar. Tente novamente." };
  }

  redirect("/onboarding");
}

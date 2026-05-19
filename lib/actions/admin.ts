"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import type { PostMediaType } from "@/types/database";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single<{ is_admin: boolean }>();

  if (!profile?.is_admin) throw new Error("Acesso negado");
  return user.id;
}

export async function deleteInfluencer(profileId: string) {
  await requireAdmin();
  const admin = createAdminClient();

  const { error: postsErr } = await admin
    .from("scheduled_posts")
    .delete()
    .eq("profile_id", profileId);
  if (postsErr) throw postsErr;

  const { error: salesErr } = await admin
    .from("hotmart_sales")
    .delete()
    .eq("profile_id", profileId);
  if (salesErr) throw salesErr;

  const { error: msgsErr } = await admin
    .from("messages_log")
    .delete()
    .eq("profile_id", profileId);
  if (msgsErr) throw msgsErr;

  const { error: assignErr } = await admin
    .from("brand_assignments")
    .delete()
    .eq("profile_id", profileId);
  if (assignErr) throw assignErr;

  const { error: sectorsErr } = await admin
    .from("influencer_sectors")
    .delete()
    .eq("profile_id", profileId);
  if (sectorsErr) throw sectorsErr;

  const { error: igErr } = await admin
    .from("instagram_connections")
    .delete()
    .eq("profile_id", profileId);
  if (igErr) throw igErr;

  const { error: profileErr } = await admin.from("profiles").delete().eq("id", profileId);
  if (profileErr) throw profileErr;

  const { error: authErr } = await admin.auth.admin.deleteUser(profileId);
  if (authErr) throw authErr;

  revalidatePath("/admin/influenciadores");
  revalidatePath("/admin");
}

export async function disconnectInfluencerInstagram(connectionId: string) {
  await requireAdmin();
  const admin = createAdminClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (admin.from("instagram_connections") as any)
    .update({ is_connected: false })
    .eq("id", connectionId);

  if (error) throw error;
  revalidatePath("/admin/influenciadores");
}

export async function createBrand(formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();

  const name = formData.get("name") as string;
  const description = (formData.get("description") as string) || null;
  const hotmartProductId = (formData.get("hotmart_product_id") as string) || null;
  const hotmartProductUrl = (formData.get("hotmart_product_url") as string) || null;
  const sectorsRaw = (formData.get("target_sectors") as string) || "";
  const targetSectors = sectorsRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const isActive = formData.get("is_active") === "true";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (admin.from("brands") as any).insert({
    name,
    description,
    logo_url: null,
    hotmart_product_id: hotmartProductId,
    hotmart_product_url: hotmartProductUrl,
    target_sectors: targetSectors,
    is_active: isActive,
  });

  if (error) throw error;
  revalidatePath("/admin/marcas");
}

export async function updateBrand(brandId: string, formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();

  const name = formData.get("name") as string;
  const description = (formData.get("description") as string) || null;
  const hotmartProductId = (formData.get("hotmart_product_id") as string) || null;
  const hotmartProductUrl = (formData.get("hotmart_product_url") as string) || null;
  const sectorsRaw = (formData.get("target_sectors") as string) || "";
  const targetSectors = sectorsRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const isActive = formData.get("is_active") === "true";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (admin.from("brands") as any)
    .update({
      name,
      description,
      hotmart_product_id: hotmartProductId,
      hotmart_product_url: hotmartProductUrl,
      target_sectors: targetSectors,
      is_active: isActive,
    })
    .eq("id", brandId);

  if (error) throw error;
  revalidatePath("/admin/marcas");
}

export async function deleteBrand(brandId: string) {
  await requireAdmin();
  const admin = createAdminClient();

  const { error: assignErr } = await admin
    .from("brand_assignments")
    .delete()
    .eq("brand_id", brandId);
  if (assignErr) throw assignErr;

  const { error: postsErr } = await admin
    .from("scheduled_posts")
    .delete()
    .eq("brand_id", brandId);
  if (postsErr) throw postsErr;

  const { error } = await admin.from("brands").delete().eq("id", brandId);
  if (error) throw error;

  revalidatePath("/admin/marcas");
}

export async function schedulePost(formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();

  const influencerIds = (formData.get("influencer_ids") as string).split(",");
  const brandId = formData.get("brand_id") as string;
  const mediaType = formData.get("media_type") as PostMediaType;
  const mediaUrl = (formData.get("media_url") as string) || "";
  const caption = formData.get("caption") as string;
  const scheduledAt = formData.get("scheduled_at") as string;

  const rows = influencerIds.map((profileId) => ({
    profile_id: profileId.trim(),
    brand_id: brandId,
    media_type: mediaType,
    media_url: mediaUrl,
    caption,
    scheduled_at: new Date(scheduledAt).toISOString(),
    status: "pending" as const,
    ig_media_id: null,
    published_at: null,
    error_message: null,
    reach: null,
    likes: null,
    comments: null,
    shares: null,
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (admin.from("scheduled_posts") as any).insert(rows);
  if (error) throw error;

  revalidatePath("/admin/agendador");
  revalidatePath("/admin");
}

export async function deletePost(postId: string) {
  await requireAdmin();
  const admin = createAdminClient();

  const { error } = await admin.from("scheduled_posts").delete().eq("id", postId);
  if (error) throw error;

  revalidatePath("/admin/agendador");
}

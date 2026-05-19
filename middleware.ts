import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isDashboardRoute =
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/vendas") ||
    request.nextUrl.pathname.startsWith("/calendario");
  const isOnboardingRoute = request.nextUrl.pathname.startsWith("/onboarding");
  const isProtectedRoute = isAdminRoute || isDashboardRoute || isOnboardingRoute;

  if (!isProtectedRoute) return response;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminRoute) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (!profile?.is_admin) {
      const dashboardUrl = new URL("/dashboard", request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/vendas/:path*",
    "/calendario/:path*",
    "/onboarding/:path*",
  ],
};

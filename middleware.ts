import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { response, user, supabase } = await updateSession(request);

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isDashboardRoute =
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/vendas") ||
    request.nextUrl.pathname.startsWith("/calendario") ||
    request.nextUrl.pathname.startsWith("/metricas") ||
    request.nextUrl.pathname.startsWith("/configuracoes");
  const isOnboardingRoute = request.nextUrl.pathname.startsWith("/onboarding");
  const isProtectedRoute = isAdminRoute || isDashboardRoute || isOnboardingRoute;

  if (!isProtectedRoute) return response;

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
    "/metricas/:path*",
    "/configuracoes/:path*",
    "/onboarding/:path*",
  ],
};

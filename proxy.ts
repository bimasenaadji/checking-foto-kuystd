import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "./utils/supabase/middleware";
import { createClient } from "./utils/supabase/server";

export async function proxy(request: NextRequest) {
  const response = await updateSession(request);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  const isAuthPage = path.startsWith("/login") || path.startsWith("/register");

  // --- 1. LOGIKA UNTUK USER YANG BELUM LOGIN ---
  if (!user) {
    if (!isAuthPage) {
      // Kalau mau buka halaman dalem tapi belum login, lempar ke login
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url, { headers: response.headers });
    }
    // PENYELAMAT: Kalau dia di halaman login/register, biarkan masuk dan STOP di sini!
    return response;
  }

  // --- 2. LOGIKA UNTUK USER YANG SUDAH LOGIN ---
  // Ubah bagian ini untuk menangkap error:
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // TARUH CONSOLE LOG INI:
  console.log("CEK PROFIL BIMA ->", profile);
  if (profileError) {
    console.log("ERROR SUPABASE ->", profileError.message);
  }

  const role = profile?.role;

  if (role === "CREW" && path.startsWith("/admin")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url, { headers: response.headers });
  }

  if (role === "SUPERVISOR" && path.startsWith("/dashboard")) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url, { headers: response.headers });
  }

  if (isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = role === "SUPERVISOR" ? "/admin" : "/dashboard";
    return NextResponse.redirect(url, { headers: response.headers });
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

import { ReactNode } from "react";
import { ShieldCheck, LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { signOutAction } from "@/actions/auth";

export default async function SupervisorLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Opsional: Cuma buat ambil nama untuk di Navbar. Nggak ada logic redirect.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user?.id)
    .single();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* NAVBAR */}
      <header className="border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10 bg-white">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-primary" />
          <h1 className="font-bold text-lg">Supervisor Panel</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">
            {profile?.full_name || "Supervisor"}
          </span>
          <form action={signOutAction}>
            <button
              type="submit"
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </form>
        </div>
      </header>

      {/* KONTEN HALAMAN (page.tsx masuk ke sini) */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="border-t py-4 text-center text-xs text-muted-foreground">
        © 2026 Kuy Studio Management System
      </footer>
    </div>
  );
}

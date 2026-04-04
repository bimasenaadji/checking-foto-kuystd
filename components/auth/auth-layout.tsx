// src/components/auth/auth-layout.tsx
import { Camera } from "lucide-react";
import Image from "next/image";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-18 h-18 rounded-2xl  flex items-center justify-center mb-4 shadow-lg shadow-primary/25">
            <Image
              src={"/images/kuy_studio_logo.jpg"}
              alt="Logo Kuy Studio"
              width={56}
              height={56}
            />
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Kuy Studio
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Sistem Laporan Harian
          </p>
        </div>
        {children}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Kuy Studio &copy; {new Date().getFullYear()} &mdash; Hak cipta
          dilindungi
        </p>
      </div>
    </div>
  );
}

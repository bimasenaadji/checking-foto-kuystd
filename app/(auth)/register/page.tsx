"use client";

import { useState } from "react";
import { signUpAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { AuthLayout } from "@/components/auth/auth-layout";
import { PasswordInput } from "@/components/auth/password-input";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);

    // Panggil Server Action
    const result = await signUpAction(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Daftar Akun Baru</CardTitle>
          <CardDescription>
            Lengkapi data diri untuk mulai melapor di Kuy Studio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            {/* Input Nama Lengkap */}
            <div className="grid gap-1.5">
              <Label htmlFor="fullName">Nama Lengkap</Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="Contoh: Bima Sena"
                required
              />
            </div>

            {/* Input Email */}
            <div className="grid gap-1.5">
              <Label htmlFor="email">Email Kerja</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="nama@kuystudio.com"
                required
              />
            </div>

            {/* Input Role (Select) */}
            <div className="grid gap-1.5">
              <Label htmlFor="role">Posisi / Unit Kerja</Label>
              <Select name="role" defaultValue="CREW">
                <SelectTrigger id="role">
                  <SelectValue placeholder="Pilih posisi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CREW">Crew</SelectItem>
                  <SelectItem value="SUPERVISOR">Supervisor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Input Token Keamanan */}
            <div className="grid gap-1.5">
              <Label htmlFor="token">Token Registrasi</Label>
              <Input
                id="token"
                name="token"
                type="text"
                placeholder="Masukkan token dari admin"
                required
              />
            </div>

            {/* Input Password (Custom Component) */}
            <PasswordInput
              id="password"
              // Pastikan komponen ini punya <input name="password" /> di dalamnya
              value={password}
              onChange={setPassword}
              name="password"
            />

            {/* Menampilkan Error jika ada */}
            {error && (
              <div className="bg-destructive/15 border border-destructive/30 p-3 rounded-md text-destructive text-sm font-medium">
                {error}
              </div>
            )}

            {/* Tombol Submit */}
            <Button
              type="submit"
              className="w-full font-semibold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mendaftarkan...
                </>
              ) : (
                "Daftar Sekarang"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="text-primary hover:underline font-medium"
            >
              Masuk di sini
            </Link>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}

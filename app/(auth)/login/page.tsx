// src/app/(auth)/login/page.tsx
"use client";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthLayout } from "@/components/auth/auth-layout";
import { PasswordInput } from "@/components/auth/password-input";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Nanti di sini panggil supabase.auth.signInWithPassword
    console.log("Login dengan:", email);
    setLoading(false);
  };

  return (
    <AuthLayout>
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg">Masuk</CardTitle>
          <CardDescription>Masukkan email kerja Anda.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@kuystudio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <PasswordInput value={password} onChange={setPassword} />
            <Button className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Masuk"
              )}
            </Button>
          </form>
          <div className="text-center text-sm text-muted-foreground">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="text-primary hover:underline font-medium"
            >
              Daftar di sini
            </Link>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}

// src/app/(auth)/register/page.tsx
"use client";
import { useState } from "react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { PasswordInput } from "@/components/auth/password-input";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    role: "cs",
  });

  return (
    <AuthLayout>
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg">Daftar Akun Baru</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-1.5">
            <Label>Nama Lengkap</Label>
            <Input
              placeholder="Bima Sena"
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
            />
          </div>
          <div className="grid gap-1.5">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="bima@kuystudio.com"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div className="grid gap-1.5">
            <Label>Posisi / Lantai</Label>
            <Select
              onValueChange={(val) => setFormData({ ...formData, role: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cs">CS / Kebersihan</SelectItem>
                <SelectItem value="op_lt1">Operator Lantai 1</SelectItem>
                <SelectItem value="op_lt2">Operator Lantai 2</SelectItem>
                <SelectItem value="op_lt3">Operator Lantai 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <PasswordInput
            value={formData.password}
            onChange={(val) => setFormData({ ...formData, password: val })}
          />
          <Button className="w-full">Daftar</Button>
          <div className="text-center text-sm text-muted-foreground">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="text-primary hover:underline font-medium"
            >
              Masuk
            </Link>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}

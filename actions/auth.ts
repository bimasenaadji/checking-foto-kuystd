"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Form } from "radix-ui";

export async function signUpAction(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const role = formData.get("role") as string;
  const token = formData.get("token") as string;

  const SECRET_TOKEN = process.env.REGISTRATION_TOKEN || "KUY2026";
  if (token !== SECRET_TOKEN) {
    return { error: "Token registrasi tidak valid! Hubungi Administrator." };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Data metadata ini akan ditangkap oleh TRIGGER SQL di database
      // untuk otomatis membuat baris di tabel 'profiles'
      data: {
        full_name: fullName,
        role: role,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/login");
}

export async function signInAction(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/landing");
}

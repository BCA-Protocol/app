"use server";
import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";


  export const signIn = async ({email,password}:{email:string,password:string}) => {

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect("/?message=Could not authenticate user");
    }

    return redirect("/dashboard");
};

export const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/");
}

export const authUserSession = async () => {
  const supabase = createClient();
  const session = await supabase.auth.getSession();
  if (!session) {
    return redirect("/");
  }
  return session;
}
'use server'
import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
export const getUser = async (id: string) => {
    console.log("id", id)   
    const origin = headers().get("origin");
    const supabase = createClient();

    const response = await supabase.from('users').select().eq('id', id).single();

   console.log("response", response)

    return response;
};
'use server'
import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const getPagination = (page:number, size:number) => {
    const limit = size ? +size : 3;
    const from = page ? page * limit : 0;
    const to = page ? from + size : size;
  
    return { from, to };
  };
export const fetchLeaderboardUsers = async ({page}:{page:number}) => {
    const { from, to } = getPagination(page, 100); 
    const origin = headers().get("origin");
    const supabase = createClient();
    const { data, error } = await supabase.functions.invoke('fetchPaginatedLeaderboard', {
        body: { from, to }
    })
 
    // const response = await supabase.from('users').select().eq('id', id).single();

   

    return data;
};
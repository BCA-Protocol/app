"use server";
import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const addQuests = async ({
  name,
  link,
  twitter,
  discord,
  user,
  light,
}: {
  name: string;
  link: string;
  twitter: string;
  discord: string;
  user: string;
  light: string;
}) => {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("quests")
      .insert({ name, link, twitter, discord, user, light });
    console.log(data, error);
    if (error) {
      throw new Error(`Error insert quest`);
    }
    return { success: true };
  } catch (error) {
    console.log("Error insert quest", error);
  }
};
export const editQuests = async (
  id: string,
  {
    name,
    link,
    twitter,
    discord,
    user,
    light,
  }: {
    name: string;
    link: string;
    twitter: string;
    discord: string;
    user: string;
    light: string;
  }
) => {
  const supabase = createClient();
    console.log("editQuests", id, name, link, twitter, discord, user, light);
  try {
    const { data, error } = await supabase
      .from("quests")
      .update({ name, link, twitter, discord, user, light })
      .eq("id", id);
    if (error) {
      throw new Error(`Error insert quest`);
    }
    return { success: true };
  } catch (error) {
    console.log("Error insert quest", error);
  }
};

export const getQuests = async () => {
    try {
        const supabase = createClient();
        const { data: quests, error } = await supabase
        .from("quests")
        .select("*")
        return quests;
    } catch (error) {
        console.log("Error getQuests", error);
    }
}
export const deleteQuests = async (id: string) => {
    try {
        const supabase = createClient();
        const { data, error } = await supabase
        .from("quests")
        .delete()
        .eq("id", id)
        return { success: true };
    } catch (error) {
        console.log("Error deleteQuests", error);
    }
}
"use server";
import { createClient } from "@/utils/supabase/server";

const getGlobalSettings = async (id: string) => {
  const supabase = createClient();

  try {
    const { data, error }  = await supabase.from('general').select("settings").single();
    if (error) {
      throw new Error(`Error fetching global settings: ${error.message}`);
    }
    if (data) {
      return data;
    }
  } catch (error) {
    console.error("Error getting global settings:", error);
  }
};

const checkReference = async (referenceId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase.functions.invoke('checkReference', {
      body: { referenceId }
  })

  return data;
};

export { 
  getGlobalSettings,
  checkReference,
}
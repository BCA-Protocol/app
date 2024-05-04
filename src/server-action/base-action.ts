"use server";
import { createClient } from "@/utils/supabase/server";

const getGlobalSettings = async (id: string) => {
  const supabase = createClient();

  try {
    const { data, error }  = await supabase.from('general').select("settings").single();
    // console.log("-----tempRes1------", await supabase.from('general').select("settings").single())
    // console.log("-----tempRes2------", await supabase.from('general').select("settings"))
    if (error) {
      throw new Error(`Error fetching global settings: ${error.message}`);
    }
    if (data) {
      return data;
    }
  } catch (error) {
    console.error("Error getting global settings:", error);
  }

  // const settingsDocRef = doc(db, "general", "settings");

  // const settingsSnapshot = await getDoc(settingsDocRef);

  // if (!settingsSnapshot.exists()) {
  //   console.log("No settings found.");
  //   return null;
  // }

  // const settings = settingsSnapshot.data();
  // return settings;
};

export { 
  getGlobalSettings,
}
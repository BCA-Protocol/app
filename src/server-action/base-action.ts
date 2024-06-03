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

const addData = async (tableName: string, data: any) => {
  try {
    const supabase = createClient();
    const { data: updatedData, error } = await supabase
      .from(tableName)
      .insert(data)
      .select();
    if (error) {
      console.error("Error adding document:", error);
      throw error;
    }
    if (updatedData?.length === 1 ) {
      console.log("Document written with ID:", updatedData[0]?.id);
    }
    return { success: true, docId: updatedData[0]?.id };
  } catch (error) {
    console.error("Error adding document:", error);
    throw error;
  }
}

const getData = async (tableName: string) => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from(tableName).select();
    if (error) {
      console.error(`Error fetching ${tableName} table:`, error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error(`Error getting ${tableName} table:`, error);
    throw error;
  }
}

const deleteData = async (tableName: string, id: string) => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from(tableName)
      .delete()
      .eq("id", id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error deleting data with ${id} id:`, error);
      throw error;
    }    
    return { success: true, docId: data?.id };
  } catch (error) {
    console.error(`Error deleting data with ${id} id:`, error);
    throw error;
  }
}

const editQuests = async (id: string, data: any) => {
  try {
    const supabase = createClient();
    const { data: updatedData, error } = await supabase
      .from('quests')
      .update(data)
      .eq('id', id)
      .select();

    if (error) {
      console.error(`Error updating Quests document with ${id} id:`, error);
      throw error;
    }    
    return { success: true, docId: updatedData[0]?.id };
  } catch (error) {
    console.error(`Error editing Quests document with ${id} id:`, error);
    throw error;
  }
}

export { 
  getGlobalSettings,
  checkReference,
  getData,
  addData,
  deleteData,
  editQuests,
}
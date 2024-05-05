"use server";
import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const getUserById = async (id: string) => {
  console.log("id", Date.now(), id)   
  const origin = headers().get("origin");
  const supabase = createClient();

  try {
    const { data, error }  = await supabase.from('users').select().eq('id', id).single();
    console.log("userData:---", Date.now(), data?.email, error)
    if (error) {      
      throw new Error(`Error fetching referral count for user ${id}: ${error.message}`);
    }
    if (data) {
      console.log("userData:---returned---", Date.now(), data?.email, error)
      return data;
    }
  } catch (error) {
    console.log("Error getting referral count:", error);
  }
};

const getReferralCount = async (id: string) => {
  const supabase = createClient();

  try {
    const { count, error } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("refered_by", id);      

    if (error) {
      // throw new Error(`Error fetching referral count for user ${id}: ${error.message}`);
      console.error("Error fetching referral count:", error);
      return 0; // Return 0 for error handling
    }

    return count || 0;
  } catch (error) {
    console.error("Error getting referral count:", error);
    return 0; // Return 0 for error handling
  }
};

const toggleCollecting = async (id: string, value: boolean) => {
  const supabase = createClient();

  try {
    const { data: updatedUserData, error } = await supabase
      .from("users")
      .update({ collecting: value})
      .eq("id", id)  
      .select()
      .single();

    if (error) {
      // throw new Error(`Error fetching referral count for user ${id}: ${error.message}`);
      console.log("Error fetching referral count:", error)
      return { success: false, error: error?.message };
    }

    return { success: true, user: updatedUserData };
  } catch (error) {
    console.error("Error getting referral count:", error);
    return { success: false, error: error };
  }
};

const addPointsToUser = async ({
  userId,
  pointsToAdd,
  description,
  type,
}: {
  userId: string;
  pointsToAdd: number;
  description: string;
  type: string;
}) => {
    console.log("addPointsToUser:userId", userId);
    console.log("addPointsToUser:pointsToAdd", pointsToAdd);
    console.log("addPointsToUser:description", description);
    console.log("addPointsToUser:type", type);

  const newPoints: number = Math.floor(pointsToAdd);

  const supabase = createClient();
  let updatedUser;
  const { data: user } = await supabase
    .from("users")
    .select()
    .eq("id", userId)
    .single();
  if (!user) {
    throw new Error("User not found");
  }
  console.log("user", user);

  // Update the totalPoints field by adding the specified points
  if (type == "Referral") {
    const updateUserResponse = await supabase
      .from("users")
      .update({
        referral_points: (user.referral_points || 0) + newPoints,
        overall_points: (user.overall_points || 0) + newPoints,
      })
      .eq("id", userId);
    console.log("updateUserResponse1", updateUserResponse);
    updatedUser = updateUserResponse.data;
  } else {
    const updateUserResponse = await supabase
      .from("users")
      .update({ overall_points: (user.overall_points || 0) + newPoints })
      .eq("id", userId);
    console.log("updateUserResponse2", updateUserResponse);
    updatedUser = updateUserResponse.data;
  }
  // Add a new record to the usersPoints collection
  const userPointResponse = await supabase
    .from("usersPoints")
    .insert({ userId: userId, points: newPoints, description: description });
  console.log("userPointResponse", userPointResponse);
  // update global points here
  const generalResponse = await supabase.from("general").select().eq("id", 1).single();
  console.log("generalResponse", generalResponse);
  const { settings }: any = generalResponse.data;
  settings.protocol_points = parseInt(settings.protocol_points) + newPoints;
  const generalDataUpdateResponse = await supabase
    .from("general")
    .update({ settings })
    .eq("id", 1);
  console.log("generalDataUpdateResponse", generalDataUpdateResponse);
  return { success: true, user: updatedUser };
};

const handleTaskCompletion = async (
  userId: string,
  taskId: string,
  additionalUserData: any = {}
) => {
  try {
    console.log("handleTaskCompletion:userId", userId);
    console.log("handleTaskCompletion:taskId", taskId);
    console.log("handleTaskCompletion:additionalUserData", additionalUserData);
    // Get user documents
    const supabase = createClient();
    const { data: user } = await supabase
      .from("users")
      .select()
      .eq("id", userId)
      .single();
    if (!user) {
      throw new Error("User not found");
    }

    if (!user) {
      console.log("User document does not exist.");
      return;
    }

    // Assume there is only one user with a specific localId (or handle multiple results as needed)

    const referedBy = user.refered_by;

    const { data: task } = await supabase
      .from("tasks")
      .select()
      .eq("taskId", taskId)
      .single();
    console.log("task", task);

    if (!task) {
      console.log("Task document does not exist.");
      return;
    }

    // Assuming there's only one task document with the specified taskId
    const taskPoints = task.points;

    let completed_tasks = user.completed_tasks || {};
    const updatedUserData = {
      completed_tasks: {
        ...completed_tasks,
        [taskId]: {
          taskId: taskId,
          created: Date.now(),
        },
      },
      ...additionalUserData,
      // ip:additionalUserData.ip,
      // browser_data:additionalUserData.browserData,
    };
    console.log("updatedUserData",updatedUserData)
    await supabase.from("users").update(updatedUserData).eq("id", userId);

    await addPointsToUser({
      userId,
      pointsToAdd: taskPoints,
      description: task.name,
      type: "",
    });
    if(referedBy){
        await addPointsToUser({
            userId: referedBy,
            pointsToAdd: taskPoints * 0.07,
            description: task.name + " (Referral)",
            type: "Referral",
        });
    }
  
    // await addReferralPointsToUser(referedBy, taskPoints * 0.07);
    return true;
  } catch (error) {
    console.error("Error handling task completion:", error);
    return false;
  }
};

export { 
  getUserById,
  getReferralCount,
  toggleCollecting,
  addPointsToUser,
  handleTaskCompletion,
}
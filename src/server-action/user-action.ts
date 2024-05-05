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
      throw new Error(`Error fetching userData for user ${id}: ${error.message}`);
    }
    if (data) {
      console.log("userData:---returned---", Date.now(), data?.email, error)
      return data;
    }
  } catch (error) {
    console.log("Error getting userData count:", error);
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

  // Update the totalPoints field by adding the specified points
  if (type == "Referral") {
    const updateUserResponse = await supabase
      .from("users")
      .update({
        referral_points: (user.referral_points || 0) + newPoints,
        overall_points: (user.overall_points || 0) + newPoints,
      })
      .eq("id", userId);
    updatedUser = updateUserResponse.data;
  } else {
    const updateUserResponse = await supabase
      .from("users")
      .update({ overall_points: (user.overall_points || 0) + newPoints })
      .eq("id", userId);
    updatedUser = updateUserResponse.data;
  }
  // Add a new record to the usersPoints collection
  const userPointResponse = await supabase
    .from("usersPoints")
    .insert({ userId: userId, points: newPoints, description: description });
  // update global points here
  const generalResponse = await supabase.from("general").select().eq("id", 1).single();
  const { settings }: any = generalResponse.data;
  settings.protocol_points = parseInt(settings.protocol_points) + newPoints;
  const generalDataUpdateResponse = await supabase
    .from("general")
    .update({ settings })
    .eq("id", 1);
  return { success: true, user: updatedUser };
};

const handleTaskCompletion = async (
  userId: string,
  taskId: string,
  additionalUserData: any = {}
) => {
  try {
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

const getUserActivity = async (userId: string) => {
  try {
    const supabase = createClient();

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    // console.log("---------times-1---------", thirtyDaysAgo)
    
    const { data: userPoints, error } = await supabase
      .from("usersPoints")
      .select()
      .eq("userId", userId)
      .gt("created_at", thirtyDaysAgo);
    // console.log("---------userActivityData---------", userPoints,error)    

    const dailySummary: {
      [key: string]: { referral: number, points: number}
    } = {};

    (userPoints || []).forEach((data) => {
      const { created_at, description, points } = data;

      if (!created_at) return;

      const activityDate = new Date(created_at);
      const dateString = activityDate.toLocaleDateString("en-US");

      if (!dailySummary[dateString]) {
        dailySummary[dateString] = { referral: 0, points: 0 };
      }

      if (description.toLowerCase().includes("referral")) {
        dailySummary[dateString].referral += points;
      } else {
        dailySummary[dateString].points += points;
      }
    });
    // console.log("--------------dailySummary--------------",dailySummary)

    // Initialize the result object
    let result: {
      days: string[];
      totals: number[];
      referrals: number[];
    } = {
      days: [],
      totals: [],
      referrals: [],
    };

    // Populate the result object
    Object.keys(dailySummary).forEach((date) => {
      result.days.push(date); // Add the date
      const totalPoints =
        dailySummary[date].points + dailySummary[date].referral;
      result.totals.push(totalPoints);
      result.referrals.push(dailySummary[date].referral);
    });
    // console.log("--------------result--------------",result)

    return result;
  } catch (error) {
    console.error("Error getting activity for user:", error);
    throw error;
  }
};

export { 
  getUserById,
  getReferralCount,
  toggleCollecting,
  addPointsToUser,
  handleTaskCompletion,
  getUserActivity,
}
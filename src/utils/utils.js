import {
  collection,
  query,
  doc,
  where,
  startAt,
  getDocs,
  getDoc,
  addDoc,
  orderBy,
  limit,
  runTransaction,
  updateDoc,
  deleteDoc,
  increment,
  startAfter,
} from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { confirmPasswordReset } from "firebase/auth";
import { db, auth } from "../firebase";

export async function handleResetPassword(actionCode, newPassword) {
  try {
    const response = await confirmPasswordReset(auth, actionCode, newPassword);
    console.log("reset password resp", response);
    return { success: true, message: "Password reset successful." };
  } catch (error) {
    console.error("Error resetting password:", error);
    return {
      success: false,
      message: "Error resetting password. Please try again.",
    };
  }
}

export async function addData(collectionName, data) {
  try {
    const theCollection = collection(db, collectionName);
    const docRef = await addDoc(theCollection, {
      ...data,
      created: Timestamp.now(),
    });
    console.log("Document written with ID:", docRef.id);
    return { success: true, docId: docRef.id };
  } catch (error) {
    console.error("Error adding document:", error);
    throw error;
  }
}

export async function getAllTasks() {
  try {
    const tasksCollection = collection(db, "tasks");
    const tasksSnapshot = await getDocs(tasksCollection);
    const tasks = tasksSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    return tasks; // Array of task objects with additional 'id' property
  } catch (error) {
    console.error("Error getting tasks:", error);
    // Handle errors (throw an error, display a message to the user)
    throw error;
  }
}

export async function getTopUsers(lastVisible = null) {
  try {
    const usersCollection = collection(db, "users");
    let q;

    q = lastVisible
      ? query(
          usersCollection,
          orderBy("overallPoints", "desc"),
          startAfter(lastVisible),
          limit(100)
        )
      : query(usersCollection, orderBy("overallPoints", "desc"), limit(100));

    const usersSnapshot = await getDocs(q);

    let users = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const lastDoc =
      usersSnapshot.docs[usersSnapshot.docs.length - 1] || lastVisible;
    return { users, lastDoc };
  } catch (error) {
    console.error("Error getting top users:", error);
    throw error;
  }
}

export async function getUserTasks(userId) {
  try {
    const userTasksQuery = query(
      collection(db, "userTasks"),
      where("userId", "==", userId)
    );
    const userTasksSnapshot = await getDocs(userTasksQuery);
    const userTasks = userTasksSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    return userTasks; // Array of user task objects with additional 'id' property
  } catch (error) {
    console.error("Error getting user tasks:", error);
    // Handle errors (throw an error, display a message to the user)
    throw error;
  }
}

export async function getAllTasksV2() {
  try {
    const tasksCollection = collection(db, "tasks"); // Reference the tasks collection
    const tasksSnapshot = await getDocs(tasksCollection); // Get all documents

    // Extract and format task data with IDs
    const allTasks = tasksSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    return allTasks;
  } catch (error) {
    console.error("Error getting all tasks:", error);
    // Handle errors appropriately (throw, display user message)
    throw error;
  }
}

export async function getUserIncompleteTasks(userId) {
  try {
    // Get user's completed tasks
    const usersQuery = query(
      collection(db, "users"),
      where("userId", "==", userId)
    );
    const usersSnapshot = await getDocs(usersQuery);

    if (!usersSnapshot.empty) {
      const userDoc = usersSnapshot.docs[0];
      const userData = userDoc.data();
      const completedTaskIds = userData.completedTasks || [];

      // Get all tasks
      const tasksQuery = query(collection(db, "tasks"));
      const tasksSnapshot = await getDocs(tasksQuery);

      // Filter incomplete tasks on the client side
      const incompleteTasks = tasksSnapshot.docs
        .filter((doc) => !completedTaskIds.includes(doc.id))
        .map((doc) => ({ id: doc.id, ...doc.data() }));

      return incompleteTasks;
    } else {
      console.log("User not found");
      return [];
    }
  } catch (error) {
    console.error("Error getting user incomplete tasks:", error);
    throw error;
  }
}

export async function getUserByUUID(uuid) {
  try {
    const usersCollection = collection(db, "users");

    const userQuery = query(usersCollection, where("userId", "==", uuid));
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.docs.length === 0) {
      return null;
    }

    // Assuming there is only one user with a given UUID (or you want the first one)
    const user = userSnapshot.docs[0].data();
    return user;
  } catch (error) {
    console.error("Error getting user by UUID:", error);
    throw error;
  }
}

export async function getGlobalSettings() {
  try {
    const settingsDocRef = doc(db, "general", "settings");

    const settingsSnapshot = await getDoc(settingsDocRef);

    if (!settingsSnapshot.exists()) {
      console.log("No settings found.");
      return null;
    }

    const settings = settingsSnapshot.data();
    return settings;
  } catch (error) {
    console.error("Error getting general settings:", error);
    throw error;
  }
}

export async function addPointsToUser(uuid, pointsToAdd, description, type) {
  try {
    const usersCollection = collection(db, "users");
    const usersPointsCollection = collection(db, "usersPoints");
    const settingsDocRef = doc(db, "general", "settings"); // Reference to the settings document

    // Get the user document reference
    const userQuery = query(usersCollection, where("userId", "==", uuid));
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.docs.length === 0) {
      throw new Error("User not found");
    }

    const userDoc = userSnapshot.docs[0].ref;
    const newPoints = parseInt(Math.floor(pointsToAdd));

    // Update the totalPoints field by adding the specified points
    if (type == "Referral") {
      await updateDoc(userDoc, {
        referralPoints:
          (userSnapshot.docs[0].data().referralPoints || 0) + newPoints,
        overallPoints:
          (userSnapshot.docs[0].data().overallPoints || 0) + newPoints,
      });
    } else {
      await updateDoc(userDoc, {
        totalPoints: (userSnapshot.docs[0].data().totalPoints || 0) + newPoints,
        overallPoints:
          (userSnapshot.docs[0].data().overallPoints || 0) + newPoints,
      });
    }

    // Add a new record to the usersPoints collection
    await addDoc(usersPointsCollection, {
      userId: uuid,
      points: newPoints,
      description: description,
      created: Timestamp.now(),
    });

    // update global points here
    updateDoc(settingsDocRef, {
      protocolPoints: increment(newPoints),
    });

    // Optionally, you can fetch and return the updated user data
    const updatedUserSnapshot = await getDocs(userQuery);
    const updatedUser = updatedUserSnapshot.docs[0].data();

    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Error adding points to user:", error);
    return { success: false, error: error.message };
  }
}

export async function toggleCollecting(userId, flag) {
  try {
    const usersCollection = collection(db, "users");
    const userQuery = query(usersCollection, where("userId", "==", userId));
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.docs.length === 0) {
      throw new Error("User not found");
    }

    const userDoc = userSnapshot.docs[0].ref;

    await updateDoc(userDoc, {
      collecting: flag,
    });

    const updatedUserSnapshot = await getDocs(userQuery);
    const updatedUser = updatedUserSnapshot.docs[0].data();

    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Error toggle collection:", error);
    return { success: false, error: error.message };
  }
}

export async function getReferralCount(userId) {
  try {
    const usersCollection = collection(db, "users");

    // First, query users with the given userId as referedBy
    const referralQuery = query(
      usersCollection,
      where("referedBy", "==", userId)
    );
    const referralSnapshot = await getDocs(referralQuery);

    // Return the count of users with the given userId as referedBy
    return referralSnapshot.size;
  } catch (error) {
    console.error("Error getting referral count:", error);
    throw error;
  }
}

export async function calculateTotalProtocolPoints() {
  try {
    const usersCollection = collection(db, "users");

    // First, query users with the given userId as referedBy
    const referralQuery = query(usersCollection);
    const referralSnapshot = await getDocs(referralQuery);

    // Return the count of users with the given userId as referedBy
    return referralSnapshot.size;
  } catch (error) {
    console.error("Error getting referral count:", error);
    throw error;
  }
}

export async function getUserActivity(userId) {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30); // 30 days from today

    // Query for activities in the last 30 days for the given userId
    const theQuery = query(
      collection(db, "usersPoints"),
      where("userId", "==", userId),
      orderBy("created"),
      startAt(thirtyDaysAgo)
    );

    const theSnapshot = await getDocs(theQuery);
    const dailySummary = {};

    theSnapshot.forEach((doc) => {
      const data = doc.data();

      if (!data.created) return;

      const { created, description, points } = data;
      const activityDate = created.toDate();
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

    // Initialize the result object
    let result = {
      days: [],
      totals: [],
      // referrals: [],
    };

    // Populate the result object
    Object.keys(dailySummary).forEach((date) => {
      result.days.push(date); // Add the date
      const totalPoints =
        dailySummary[date].points + dailySummary[date].referral;
      result.totals.push(totalPoints.toFixed(2));
      // result.referrals.push(dailySummary[date].referral);
    });

    return result;
  } catch (error) {
    console.error("Error getting activity for user:", error);
    throw error;
  }
}

export async function getUserIncompleteTasksv2(userId) {
  try {
    // Leverage a subquery to filter tasks based on userTasks existence
    const userTasksSubquery = query(
      collection(db, "userTasks"),
      where("userId", "==", userId)
    );

    // Create a main query for tasks, handling empty userTasks
    const tasksQuery = async () => {
      const userTasksSnapshot = await getDocs(userTasksSubquery);
      const userTaskIds = userTasksSnapshot.docs.map((doc) => doc.id);

      if (userTaskIds.length === 0) {
        return query(collection(db, "tasks")); // Fetch all tasks if no userTasks
      } else {
        return query(
          collection(db, "tasks"),
          where("taskId", "not-in", userTaskIds)
        );
      }
    };

    const finalTasksQuery = await tasksQuery(); // Execute the dynamic query
    const tasksSnapshot = await getDocs(finalTasksQuery);

    // Extract and format task data with IDs
    const incompleteTasks = tasksSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    return incompleteTasks;
  } catch (error) {
    console.error("Error getting user incomplete tasks:", error);
    // Handle errors appropriately (throw, display user message)
    throw error;
  }
}

export const handleTaskCompletion = async (
  userId,
  taskId,
  additionalUserData = {}
) => {
  try {
    const usersCollection = collection(db, "users");
    const userQuery = query(usersCollection, where("userId", "==", userId));

    // Get user documents
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
      console.log("User document does not exist.");
      return;
    }

    // Assume there is only one user with a specific localId (or handle multiple results as needed)
    const userDoc = userSnapshot.docs[0];
    const userRef = userDoc.ref;
    const completedTasks = userDoc.data().completedTasks;
    const referedBy = userDoc.data().referedBy;

    const tasksCollection = collection(db, "tasks");
    const taskQuery = query(tasksCollection, where("taskId", "==", taskId));
    const taskSnapshot = await getDocs(taskQuery);

    if (taskSnapshot.empty) {
      console.log("Task document does not exist.");
      return;
    }

    // Assuming there's only one task document with the specified taskId
    const taskDoc = taskSnapshot.docs[0];
    const taskData = taskDoc.data();
    const taskPoints = taskData.points;

    await runTransaction(db, async (transaction) => {
      // Check if the task has already been completed
      if (!completedTasks?.hasOwnProperty(taskId)) {
        // Update user document
        transaction.update(userRef, {
          completedTasks: {
            ...completedTasks,
            [taskId]: {
              taskId: taskId,
              created: Timestamp.now(),
            },
          }, // Add the completed task to the list
          ...additionalUserData,
        });
        await addPointsToUser(userId, taskPoints, taskData.name);
        if(referedBy){
          await addPointsToUser(
            referedBy,
            taskPoints * 0.07,
            taskData.name + " (Referral)",
            "Referral"
          );
        }
        // await addReferralPointsToUser(referedBy, taskPoints * 0.07);
        console.log("Task completed. Points added.");
      } else {
        console.log("Task has already been completed.");
      }
    });
    return true;
  } catch (error) {
    console.error("Error handling task completion:", error);
    return false;
  }
};

export async function verifyEmail(verificationCode) {
  const apiKey = process.env.FIREBASE_APIKEY; // Replace with your actual API key

  const endpoint = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${apiKey}`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        oobCode: verificationCode,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error updating account:", error);
    throw error;
  }
}

export async function getData(mycollection) {
  try {
    const querySnapshot = await getDocs(collection(db, mycollection));
    const document = [];
    querySnapshot.forEach((doc) => {
      document.push({
        ...doc.data(),
        id: doc.id,
      });
    });
    return document;
  } catch (error) {
    console.error(`Error getting ${mycollection} Collection:`, error);
    throw error;
  }
}

export async function editQuests(docId, data) {
  try {
    const questsDocRef = await updateDoc(doc(db, "quests", docId),data);
    console.log(questsDocRef)
    
    return { success: true };
  } catch (error) {
    console.error("Error getting Quests:", error);
    throw error;
  }
}
export async function deleteData(mycollection,docId) {
  try {
    const questsDocRef = await deleteDoc(doc(db, mycollection, docId));
    console.log(questsDocRef)
    
    return { success: true };
  } catch (error) {
    console.error("Error getting Quests:", error);
    throw error;
  }
}
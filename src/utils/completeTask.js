import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Assuming `firebase.js` is in the same directory

async function markTaskCompleted(userId, taskId) {
  try {
    // Check if the user has already completed this task
    const existingTasksQuery = query(collection(db, 'userTasks'), where('userId', '==', userId), where('taskId', '==', taskId));
    const existingTasksSnapshot = await getDocs(existingTasksQuery);

    if (existingTasksSnapshot.empty) {
      // Add user-task document if not completed before
      await addDoc(collection(db, 'userTasks'), { userId, taskId });
      // Update user points based on task points (separate function or logic)
      updateUserPoints(userId, getTaskPoints(taskId)); // Replace with your logic
    } else {
      console.log('Task already completed by user.'); // Handle already completed scenario (optional)
    }
  } catch (error) {
    console.error('Error marking task completed:', error);
    // Handle errors (throw an error, display a message to the user)
    throw error;
  }
}

export default markTaskCompleted;
async function updateUserPoints(userId, pointsToAdd) {
    try {
      const userRef = doc(db, 'users', userId);
  
      // Perform an atomic update to ensure data consistency
      await updateDoc(userRef, {
        totalPoints: firebase.firestore.FieldValue.increment(pointsToAdd),
      });
  
      console.log('User points updated successfully.');
    } catch (error) {
      console.error('Error updating user points:', error);
      // Handle errors (throw an error, display a message to the user)
      throw error;
    }
  }
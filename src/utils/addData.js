
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase'; 

async function addData(collectionName, data) {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log('Document written with ID:', docRef.id);
    return { success: true, docId: docRef.id };
  } catch (error) {
    
    console.error('Error adding document:', error);
    throw error;
  }
}

export default addData;
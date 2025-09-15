import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './chat';

export async function uploadProfilePicture(file, userId) {
  try {
    const storageRef = ref(storage, `profilePictures/${userId}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw error;
  }
}

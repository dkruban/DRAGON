import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, where, orderBy, onSnapshot, doc, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "dragon-app.firebaseapp.com",
  projectId: "dragon-app",
  storageBucket: "dragon-app.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Messages
export async function sendMessage(chatId, message, senderId, type = 'text') {
  try {
    await addDoc(collection(db, 'chats', chatId, 'messages'), {
      text: message,
      senderId,
      type,
      timestamp: serverTimestamp(),
      deleted: false
    });
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

export function getMessages(chatId, callback) {
  const q = query(
    collection(db, 'chats', chatId, 'messages'),
    where('deleted', '==', false),
    orderBy('timestamp')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const messages = [];
    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });
    callback(messages);
  });
}

export async function deleteMessage(chatId, messageId) {
  try {
    await updateDoc(doc(db, 'chats', chatId, 'messages', messageId), {
      deleted: true
    });
  } catch (error) {
    console.error('Error deleting message:', error);
  }
}

// Chats
export async function createChat(userIds) {
  try {
    const chatRef = await addDoc(collection(db, 'chats'), {
      participants: userIds,
      createdAt: serverTimestamp()
    });
    return chatRef.id;
  } catch (error) {
    console.error('Error creating chat:', error);
  }
}

export function getUserChats(userId, callback) {
  const q = query(
    collection(db, 'chats'),
    where('participants', 'array-contains', userId)
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const chats = [];
    querySnapshot.forEach((doc) => {
      chats.push({ id: doc.id, ...doc.data() });
    });
    callback(chats);
  });
}

// File Upload
export async function uploadFile(file, path) {
  try {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

// Stories
export async function uploadStory(userId, file, caption) {
  try {
    const storageRef = ref(storage, `stories/${userId}/${Date.now()}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    
    await addDoc(collection(db, 'stories'), {
      userId,
      mediaUrl: downloadURL,
      caption,
      timestamp: serverTimestamp(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    });
  } catch (error) {
    console.error('Error uploading story:', error);
  }
}

export function getStories(callback) {
  const q = query(
    collection(db, 'stories'),
    where('expiresAt', '>', new Date()),
    orderBy('timestamp', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const stories = [];
    querySnapshot.forEach((doc) => {
      stories.push({ id: doc.id, ...doc.data() });
    });
    callback(stories);
  });
}

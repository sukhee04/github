// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB_Xjdnxa7KfyAOvyAzpXrTRZFoWJAgBsc",
  authDomain: "cultural-friend.firebaseapp.com",
  projectId: "cultural-friend",
  storageBucket: "cultural-friend.firebasestorage.app",
  messagingSenderId: "666470345900",
  appId: "1:666470345900:web:134840c2d1502c57810309",
  measurementId: "G-56FQCWJ4ML",
};

// Firebase app initialize
const app = initializeApp(firebaseConfig);

// ✅ ашиглах service-үүд
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// ❌ messaging, FCM одоохондоо ашиглахгүй тул бүр мөсөн авлаа
// 나중에 푸시 알림 쓸 때 다시 추가하면 돼!
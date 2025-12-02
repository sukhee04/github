import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";

// 1) Хэрэглэгчийн бүх чат realtime сонсох
export function listenUserChats(uid: string, cb: (chats: any[]) => void) {
  const q = query(
    collection(db, "chats"),
    where("members", "array-contains", uid),
    orderBy("lastMessageAt", "desc")
  );

  return onSnapshot(q, (snap) => {
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}

// 2) Нэг чатны мессежүүд realtime сонсох
export function listenMessages(chatId: string, cb: (messages: any[]) => void) {
  const q = query(
    collection(db, "chats", chatId, "messages"),
    orderBy("createdAt", "asc")
  );

  return onSnapshot(q, (snap) => {
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}

// 3) Мессеж илгээх
export async function sendMessage(chatId: string, senderId: string, text: string) {
  await addDoc(collection(db, "chats", chatId, "messages"), {
    senderId,
    text,
    createdAt: serverTimestamp(),
    readBy: [senderId],
  });

  await updateDoc(doc(db, "chats", chatId), {
    lastMessage: text,
    lastMessageAt: serverTimestamp(),
    lastSenderId: senderId,
  });
}

// 4) Chat open үед уншсан гэж тэмдэглэх
export async function markChatRead(chatId: string, uid: string) {
  const chatRef = doc(db, "chats", chatId);
  const snap = await getDoc(chatRef);
  if (!snap.exists()) return;

  const data: any = snap.data();
  const readByMap = data.readByMap || {};
  readByMap[uid] = serverTimestamp();

  await updateDoc(chatRef, { readByMap });
}

// 5) Private chat байхгүй бол үүсгэх (Matching → Chat)
export async function createPrivateChat(uid1: string, uid2: string) {
  const chatId = [uid1, uid2].sort().join("_");
  const chatRef = doc(db, "chats", chatId);

  const snap = await getDoc(chatRef);
  if (!snap.exists()) {
    await setDoc(chatRef, {
      type: "private",
      title: "",
      members: [uid1, uid2],
      lastMessage: "",
      lastMessageAt: serverTimestamp(),
      lastSenderId: "",
      createdAt: serverTimestamp(),
      readByMap: {},
    });
  }
  return chatId;
}

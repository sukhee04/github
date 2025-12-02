// src/lib/chatService.ts
import { db } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

type CreateChatOptions = {
  type: "private" | "group";
  title: string;
  memberIds: string[];
  // 👉 нэг match эсвэл request-ыг таних түлхүүр
  roomKey?: string;
};

export async function createOrGetChat(options: CreateChatOptions) {
  const { type, title, memberIds, roomKey } = options;
  const chatsCol = collection(db, "chats");

  // 1) roomKey байвал эхлээд байгаа room-оо хайна
  if (roomKey) {
    const q = query(chatsCol, where("roomKey", "==", roomKey));
    const snap = await getDocs(q);

    if (!snap.empty) {
      const chatDoc = snap.docs[0];
      const chatRef = doc(db, "chats", chatDoc.id);

      // одоогийн хэрэглэгчийг members руу нэмнэ (давхцвал arrayUnion өөрөө үл тооно)
      await updateDoc(chatRef, {
        members: arrayUnion(...memberIds),
      });

      return chatDoc.id;
    }
  }

  // 2) олдоогүй бол ШИНЭ room үүсгэнэ
  const now = serverTimestamp();
  const newDoc = await addDoc(chatsCol, {
    type,
    title,
    members: memberIds,
    roomKey: roomKey ?? null,
    createdAt: now,
    lastMessage: "",
    lastMessageAt: now,
    lastSenderId: null,
  });

  return newDoc.id;
}
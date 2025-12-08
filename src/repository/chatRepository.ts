import { db } from "./firebaseConfig";
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
  limit,
} from "firebase/firestore";

type CreateChatOptions = {
  type: "private" | "group";
  title: string;
  memberIds: string[];
  roomKey?: string;  // request-123, match-456 같은 고유 키
};

export async function createOrGetChat(options: CreateChatOptions) {
  const { type, title, memberIds, roomKey } = options;
  const chatsCol = collection(db, "chats");

  // ✅ 1) roomKey가 있으면 먼저 기존 방 있는지 확인
  if (roomKey) {
    const q = query(chatsCol, where("roomKey", "==", roomKey), limit(1));
    const snap = await getDocs(q);

    if (!snap.empty) {
      const chatDoc = snap.docs[0];
      const chatRef = doc(db, "chats", chatDoc.id);

      // 이미 있는 방이면 memberIds를 members에 합쳐줌 (중복은 arrayUnion이 무시)
      await updateDoc(chatRef, {
        members: arrayUnion(...memberIds),
      });

      return chatDoc.id; // ⭐ 기존 방 재사용
    }
  }

  // ✅ 2) 없으면 새 채팅방 생성
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

import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

const matchCol = collection(db, "matchRequests");

export type MatchStatus = "pending" | "accepted" | "rejected" | "cancelled";

export type MatchRequest = {
  id?: string;
  courseId: string;     // 어떤 코스에 대한 요청인지
  hostId: string;       // 코스를 만든 사람(호스트)
  guestId: string;      // 신청하는 유학생(게스트)
  groupSize: number;    // 인원 수
  message: string;      // 호스트에게 보내는 메시지
  status: MatchStatus;  // 기본 pending
  createdAt?: any;      // Firestore Timestamp
  chatId?: string;      // 채팅방 ID (있으면)
};
export const matchingRepository = {

  // 중복 체크
  async hasPendingRequest(courseId: string, guestId: string) {
    const q = query(
      matchCol,
      where("courseId", "==", courseId),
      where("guestId", "==", guestId)
    );

    const snap = await getDocs(q);
    if (snap.empty) return false;

    const docs = snap.docs.map((d) => d.data() as any);

    // pending 또는 accepted 이면 중복으로 간주
    return docs.some(
      (d) => d.status === "pending" || d.status === "accepted"
    );
  },

  // 매칭 요청 생성
  async createRequest(payload: Omit<MatchRequest, "id" | "status" | "createdAt">) {
    const docRef = await addDoc(matchCol, {
      ...payload,
      status: "pending",
      createdAt: serverTimestamp(),
    });

    return docRef.id;
  },

  // 🔹 내가 보낸 요청들 (게스트 기준)
  async getRequestsByGuest(guestId: string) {
    const q = query(matchCol, where("guestId", "==", guestId));
    const snap = await getDocs(q);

    return snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as MatchRequest),
    })) as (MatchRequest & { id: string })[];
  },

  // 호스트 기준으로 들어온 요청 목록
  async getRequestsForHost(hostId: string) {
    const q = query(matchCol, where("hostId", "==", hostId));
    const snap = await getDocs(q);

    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as (MatchRequest & { id: string })[];
  },

  // 상태 변경 (수락/거절/취소 등)
  async updateStatus(id: string, status: MatchStatus) {
    const ref = doc(db, "matchRequests", id);
    await updateDoc(ref, { status });
  },
};


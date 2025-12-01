// src/repositories/scheduleRepository.ts
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebaseConfig.js";

const schedulesCol = collection(db, "courseSchedules");

export const scheduleRepository = {
  // 일정 생성
  async createSchedule(schedule: {
    courseId: string;
    time: string; // "2025-12-25 10:00" 같은 형식 (원하면 Date/Timestamp로 바꿔도 됨)
    description: string; // 일정 내용
  }) {
    const docRef = await addDoc(schedulesCol, {
      ...schedule,
      createdAt: new Date(),
    });
    return docRef.id; // 일정 ID
  },

  // 특정 일정 조회
  async getScheduleById(id: string) {
    const ref = doc(db, "courseSchedules", id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
  },

  // 특정 코스의 전체 일정 조회 (시간순 정렬)
  async getSchedulesByCourse(courseId: string) {
    const q = query(
      schedulesCol,
      where("courseId", "==", courseId),
      orderBy("time", "asc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  // 일정 수정
  async updateSchedule(id: string, data: any) {
    const ref = doc(db, "courseSchedules", id);
    await updateDoc(ref, data);
  },

  // 일정 삭제
  async deleteSchedule(id: string) {
    const ref = doc(db, "courseSchedules", id);
    await deleteDoc(ref);
  },
};

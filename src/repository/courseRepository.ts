// src/repositories/courseRepository.ts (또는 .js)
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  addDoc,
} from "firebase/firestore";
import { db } from "./firebaseConfig.js";

const coursesCol = collection(db, "courses");

export const courseRepository = {
  // 코스 생성
  async createCourse(course: {
    userId: string;
    title: string;
    description: string;
    date: string; // "2025-01-01" 이런 형식으로 가정
    place: string;
    maxParticipants: number;
    price: number;
    languages: string[]; // 사용 가능 언어
    tags: string[]; // ["문화체험", "음식", ...]
    requirements: string;
  }) {
    // participants은 항상 0으로 시작
    const docRef = await addDoc(coursesCol, {
      ...course,
      participants: 0,
      createdAt: new Date(),
      // 코스ID는 Firestore 문서 id를 그대로 사용하면 됨 → docRef.id
    });
    return docRef.id; // 이게 코스 ID 역할
  },

  // 특정 코스 조회 (필요하면)
  async getCourseById(id: string) {
    const ref = doc(db, "courses", id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
  },

  // 특정 유저의 전체 코스 조회
  // → title, date, maxNum, curNum, price, language만 리턴
  async getCoursesByUser(userId: string) {
    const q = query(coursesCol, where("userId", "==", userId));
    const snap = await getDocs(q);

    return snap.docs.map((d) => {
      const data: any = d.data();
      return {
        id: d.id, // 코스ID
        title: data.title,
        date: data.date,
        maxParticipants: data.maxParticipants,
        participants: data.participants,
        price: data.price,
        language: data.language,
      };
    });
  },

  // 코스 수정 (부분 수정 가능)
  async updateCourse(id: string, data: any) {
    const ref = doc(db, "courses", id);
    await updateDoc(ref, data);
  },

  // 코스 삭제
  async deleteCourse(id: string) {
    const ref = doc(db, "courses", id);
    await deleteDoc(ref);
  },
};

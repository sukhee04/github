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
import { db } from "./firebaseConfig";

const coursesCol = collection(db, "courses");

export type Course = {
  id?: string;
  hostName: string; 
  userId: string;
  title: string;
  description: string;
  date: string;
  place: string;
  maxParticipants: number;
  participants?: number;
  price: number;
  languages: string[];
  tags: string[];
  requirements: string;
  time: string;
  // 필요하면 아래 필드들도 나중에 추가:
  // image?: string;
  // category?: string;
  // rating?: number;
  // reviews?: number;
};

export const courseRepository = {
  // 코스 생성
  async createCourse(course: Course) {
    const docRef = await addDoc(coursesCol, {
      ...course,
      participants: 0,
      createdAt: new Date(),
    });
    return docRef.id;
  },

  // 전체 코스 조회 (전체 유저의 코스)
  async getAllCourses() {
    const snap = await getDocs(coursesCol);
    return snap.docs.map((d) => {
      const data = d.data() as any;
      return {
        id: d.id,
        ...data,
      } as Course & { id: string };
    });
  },

  // 특정 코스 조회
  async getCourseById(id: string) {
    const ref = doc(db, "courses", id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Course & { id: string };
  },

  // 특정 유저의 전체 코스 조회
  async getCoursesByUser(userId: string) {
    const q = query(coursesCol, where("userId", "==", userId));
    const snap = await getDocs(q);

    return snap.docs.map((d) => {
      const data: any = d.data();
      return {
        id: d.id,
        title: data.title,
        date: data.date,
        maxParticipants: data.maxParticipants,
        participants: data.participants,
        price: data.price,
        languages: data.languages, // 기존에 language로 해둔 거면 languages로 통일
        time: data.time,  
      };
    });
  },
  

  async updateCourse(id: string, data: any) {
    const ref = doc(db, "courses", id);
    await updateDoc(ref, data);
  },

  async deleteCourse(id: string) {
    const ref = doc(db, "courses", id);
    await deleteDoc(ref);
  },
};

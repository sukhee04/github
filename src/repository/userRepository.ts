// src/repositories/userRepository.ts (또는 .js)
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
  limit,
} from "firebase/firestore";
import { db } from "./firebaseConfig.js";

const usersCol = collection(db, "users");

export const userRepository = {
  // 회원가입
  async createUser(user: {
    email: string;
    password: string;
    name: string;
    university: string;
    languages: string[];
    interests: string[];
    userType: "korean" | "international";
  }) {
    const docRef = await addDoc(usersCol, {
      ...user,
      createdAt: new Date(),
    });
    return docRef.id;
  },

  // 전체 유저 조회
  async getAllUsers() {
    const snap = await getDocs(usersCol);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  // 특정 유저 조회
  async getUserById(id: string) {
    const ref = doc(db, "users", id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
  },

  // 이메일로 유저 한 명 찾기
  async findByEmail(email: string) {
    const q = query(usersCol, where("email", "==", email), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...d.data() };
  },

  // 로그인 (이메일 + 비밀번호 확인)
  async login(email: string, password: string) {
    const user: any = await this.findByEmail(email);
    if (!user) {
      return null; // 이메일 없음
    }
    if (user.password !== password) {
      return null; // 비밀번호 불일치
    }
    return user; // 로그인 성공 → 유저 데이터 반환
  },

  // 유저 수정
  async updateUser(id: string, data: any) {
    const ref = doc(db, "users", id);
    await updateDoc(ref, data);
  },

  // 유저 삭제
  async deleteUser(id: string) {
    const ref = doc(db, "users", id);
    await deleteDoc(ref);
  },
};

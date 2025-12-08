import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  limit,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "./firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

const usersCol = collection(db, "users");

export type AppUser = {
  id: string;
  uid: string;
  email: string;
  name: string;
  university: string;
  userType: "korean" | "international";
  languages: string[];
  interests: string[];
  createdAt?: any;
};

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
    // 1) Auth 계정 생성
    const res = await createUserWithEmailAndPassword(
      auth,
      user.email,
      user.password
    );

    // 2) Auth 프로필 displayName 설정
    await updateProfile(res.user, {
      displayName: user.name,
    });

    // 3) Firestore users 문서 생성 (문서 ID = uid)
    await setDoc(doc(db, "users", res.user.uid), {
      uid: res.user.uid,
      email: user.email,
      name: user.name,
      university: user.university,
      userType: user.userType,
      languages: user.languages,
      interests: user.interests,
      createdAt: serverTimestamp(),
    });

    return res.user.uid;
  },

  // 로그인 (Auth + Firestore 유저 정보 반환)
  async login(email: string, password: string) {
    // 1) Firebase Auth 로그인
    const res = await signInWithEmailAndPassword(auth, email, password);

    // 2) Firestore에서 해당 uid의 user 문서 가져오기
    const snap = await getDoc(doc(db, "users", res.user.uid));
    if (!snap.exists()) {
      return null;
    }

    // 필요하면 any로 두고 빠르게 진행해도 됨
    const user: any = { id: snap.id, ...snap.data() };
    return user;
  },

  // 전체 유저 조회
  async getAllUsers() {
    const snap = await getDocs(usersCol);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  // 특정 유저 조회
  async getUserById(id: string): Promise<AppUser | null> {
    const ref = doc(db, "users", id);
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    const data = snap.data() as any;

    return {
      id: snap.id,
      uid: data.uid,
      email: data.email,
      name: data.name,
      university: data.university,
      userType: data.userType,
      languages: data.languages ?? [],
      interests: data.interests ?? [],
      createdAt: data.createdAt,
    };
  },

  // 이메일로 유저 한 명 찾기 (필요하면 유지)
  async findByEmail(email: string) {
    const q = query(usersCol, where("email", "==", email), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...d.data() };
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

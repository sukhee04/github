import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { auth, db } from "../../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<"korean" | "international" | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    university: "",
    languages: [] as string[],
    interests: [] as string[],
  });

  const navigate = useNavigate();

  const availableLanguages = ["한국어", "영어", "중국어", "일본어", "스페인어", "프랑스어"];
  const availableInterests = ["문화체험", "음식", "쇼핑", "K-POP", "역사", "자연", "예술", "스포츠"];

  const handleLanguageToggle = (language: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter((l) => l !== language)
        : [...prev.languages, language],
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      // -------------------------------------
      // ✅ LOGIN
      // -------------------------------------
      if (isLogin) {
        const res = await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        console.log("로그인 성공 UID:", res.user.uid);
        navigate("/", { replace: true });
        return;
      }

      // -------------------------------------
      // ✅ SIGNUP
      // -------------------------------------
      if (!userType) {
        alert("사용자 유형을 선택하세요.");
        return;
      }

      if (!formData.name.trim() || !formData.university.trim()) {
        alert("이름, 대학교를 입력하세요.");
        return;
      }

      const res = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // ✅ Auth profile дээр нэр хадгална (chat дээр хэрэгтэй)
      await updateProfile(res.user, {
        displayName: formData.name,
      });

      // ✅ Firestore users collection-д хадгална
      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        email: formData.email,
        name: formData.name,
        university: formData.university,
        userType,
        languages: formData.languages,
        interests: formData.interests,
        createdAt: serverTimestamp(),
      });

      console.log("회원가입 성공 UID:", res.user.uid);
      navigate("/", { replace: true });
    } catch (error: any) {
      console.error(error);

      // Алдааг арай ойлгомжтой харуулах
      const msg =
        error?.code === "auth/email-already-in-use"
          ? "이미 사용중인 이메일입니다."
          : error?.code === "auth/invalid-credential"
          ? "이메일 또는 비밀번호가 틀렸습니다."
          : error?.code === "auth/weak-password"
          ? "비밀번호는 6자 이상이어야 합니다."
          : "오류가 발생했습니다: " + error.message;

      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-50">
      {/* 상단 네비 */}
      <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-sky-100 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            className="w-8 h-8 flex items-center justify-center"
            onClick={() => navigate(-1)}
          >
            <i className="ri-arrow-left-line text-gray-600 text-lg"></i>
          </button>
          <h1 className="text-lg font-bold text-gray-800">
            {isLogin ? "로그인" : "회원가입"}
          </h1>
          <div className="w-8"></div>
        </div>
      </div>

      <div className="pt-16 px-4 py-6">
        {/* Лого */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-global-line text-white text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">문화친구</h2>
          <p className="text-gray-600">
            {isLogin ? "다시 만나서 반가워요!" : "새로운 문화 친구들과 만나보세요"}
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 회원가입 → 역할 сонголт */}
          {!isLogin && !userType && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800 text-center mb-6">
                어떤 역할로 참여하시나요?
              </h3>

              <button
                type="button"
                onClick={() => setUserType("korean")}
                className="w-full p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-sky-300 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full flex items-center justify-center">
                    <i className="ri-user-star-line text-white text-xl"></i>
                  </div>
                  <div className="text-left">
                    <h4 className="text-lg font-bold text-gray-800">한국 학생</h4>
                    <p className="text-sm text-gray-600">
                      문화 체험 코스를 제공하고 유학생들과 교류해요
                    </p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setUserType("international")}
                className="w-full p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-sky-300 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                    <i className="ri-earth-line text-white text-xl"></i>
                  </div>
                  <div className="text-left">
                    <h4 className="text-lg font-bold text-gray-800">유학생</h4>
                    <p className="text-sm text-gray-600">
                      한국 문화를 체험하고 현지 친구들과 만나요
                    </p>
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* Логин эсвэл Signup form */}
          {(isLogin || userType) && (
            <div className="space-y-4">
              {/* EMAIL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이메일
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="이메일"
                  required
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  비밀번호
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, password: e.target.value }))
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="비밀번호"
                  required
                />
              </div>

              {/* SIGNUP нэмэлт талбарууд */}
              {!isLogin && (
                <>
                  {/* NAME */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      이름
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, name: e.target.value }))
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                      required
                    />
                  </div>

                  {/* UNIVERSITY */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      대학교
                    </label>
                    <input
                      type="text"
                      value={formData.university}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          university: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                      required
                    />
                  </div>

                  {/* LANGUAGES */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      사용 가능한 언어
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableLanguages.map((language) => (
                        <button
                          key={language}
                          type="button"
                          onClick={() => handleLanguageToggle(language)}
                          className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                            formData.languages.includes(language)
                              ? "bg-sky-500 text-white"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {language}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* INTERESTS */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      관심사
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableInterests.map((interest) => (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => handleInterestToggle(interest)}
                          className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                            formData.interests.includes(interest)
                              ? "bg-sky-500 text-white"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {interest}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl font-medium transition-colors mt-6 ${
                  loading
                    ? "bg-gray-300 text-gray-500"
                    : "bg-sky-500 text-white hover:bg-sky-600"
                }`}
              >
                {loading ? "처리중..." : isLogin ? "로그인" : "회원가입"}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setUserType(null);
                    setFormData({
                      email: "",
                      password: "",
                      name: "",
                      university: "",
                      languages: [],
                      interests: [],
                    });
                  }}
                  className="text-sky-500 text-sm font-medium"
                >
                  {isLogin
                    ? "계정이 없으신가요? 회원가입"
                    : "이미 계정이 있으신가요? 로그인"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
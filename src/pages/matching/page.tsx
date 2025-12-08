import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../repository/firebaseConfig";
import { createOrGetChat } from "../../repository/chatRepository";
import BottomNav from "../../components/BottomNav";

import {
  MatchStatus,
  matchingRepository,
} from "../../repository/matchingRepository";
import { courseRepository } from "../../repository/courseRepository";
import { userRepository } from "../../repository/userRepository";

type SentRequestUI = {
  id: string;
  courseTitle: string;
  host: string;
  university: string;
  date: string;
  time: string; 
  location: string;
  status: MatchStatus;
  requestDate: string;
  groupSize: number;
  hostUid: string;
};

type MatchUI = {
  id: string;
  courseTitle: string;
  host: string;
  university: string;
  date: string;
  time: string;
  location: string;
  participants: string[];
  hostUid: string;
};


export default function Matching() {
  const [activeTab, setActiveTab] = useState<"sent" | "matches">("sent");
  const navigate = useNavigate();

  const [sentRequests, setSentRequests] = useState<SentRequestUI[]>([]);
  const [matches, setMatches] = useState<MatchUI[]>([]);
  const [loading, setLoading] = useState(true);

  // Firestore에서 내가 보낸 요청들 + 매칭된 요청들 가져오기
  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try { // 👈 try: 를 try { 로 수정했습니다.
        // 1) 내가 보낸 매칭 요청들
        const reqs = await matchingRepository.getRequestsByGuest(user.uid);

        // 2) 코스 + 호스트 정보 붙이기
        const sentUI: SentRequestUI[] = await Promise.all(
          reqs.map(async (req) => {
            const course = await courseRepository.getCourseById(req.courseId);
            const hostUser = await userRepository.getUserById(req.hostId);

            const createdAt = (req.createdAt as any)?.toDate
              ? (req.createdAt as any).toDate()
              : null;

            return {
              id: req.id!,
              courseTitle: course?.title ?? "코스 제목",
              host: (hostUser as any)?.name ?? "호스트",
              university: (hostUser as any)?.university ?? "",
              date: course?.date ?? "",
              time: (course as any)?.time ?? "", 
              location: (course as any)?.place ?? "",
              status: req.status,
              requestDate: createdAt
                ? createdAt.toLocaleDateString("ko-KR")
                : "",
              groupSize: req.groupSize,
              hostUid: req.hostId,
            };
          })
        );


        // 3) accepted만 별도 배열로 → 매칭 완료 탭
        const matchesUI: MatchUI[] = sentUI
          .filter((r) => r.status === "accepted")
          .map((r) => ({
            id: r.id,
            courseTitle: r.courseTitle,
            host: r.host,
            university: r.university,
            date: r.date,
            time: r.time,          // ✅ 여기
            location: r.location,  // ✅ 여기
            participants: [user.displayName || "나"],
            hostUid: r.hostUid,
          }));

        setSentRequests(sentUI);
        setMatches(matchesUI);
      } catch (err) {
        console.error("매칭 데이터 불러오기 실패:", err);
        alert("매칭 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 요청 취소
  const handleCancelRequest = async (requestId: string) => {
    const ok = window.confirm("정말로 매칭 요청을 취소하시겠습니까?");
    if (!ok) return;

    try {
      await matchingRepository.updateStatus(requestId, "cancelled");

      setSentRequests((prev) =>
        prev.map((r) =>
          r.id === requestId ? { ...r, status: "cancelled" } : r
        )
      );

      alert("매칭 요청이 취소되었습니다.");
    } catch (err) {
      console.error("요청 취소 실패:", err);
      alert("요청 취소 중 오류가 발생했습니다.");
    }
  };

  const getStatusColor = (status: MatchStatus | string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-600";
      case "accepted":
        return "bg-green-100 text-green-600";
      case "rejected":
        return "bg-red-100 text-red-600";
      case "cancelled":
        return "bg-gray-100 text-gray-500";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusText = (status: MatchStatus | string) => {
    switch (status) {
      case "pending":
        return "대기중";
      case "accepted":
        return "수락됨";
      case "rejected":
        return "거절됨";
      case "cancelled":
        return "취소됨";
      default:
        return "알 수 없음";
    }
  };

  // 🔵 보낸 요청 → 1:1 Chat 생성
  const handleRequestChat = async (requestId: string) => {
    const user = auth.currentUser;
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    const request = sentRequests.find((r) => r.id === requestId);
    if (!request) return;

    try {
      const chatId = await createOrGetChat({
        type: "private",
        title: `${request.courseTitle} 채팅`,
        memberIds: [user.uid, request.hostUid],
        roomKey: `request-${request.id}`,
      });

      navigate("/chat", { state: { chatId } });
    } catch (err) {
      console.error(err);
      alert("채팅방 생성에 실패했습니다.");
    }
  };

  // 🔵 매칭 완료 → 그룹 채팅 생성
  const handleMatchGroupChat = async (matchId: string) => {
    const user = auth.currentUser;
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    const match = matches.find((m) => m.id === matchId);
    if (!match) return;

    try {
      const chatId = await createOrGetChat({
        type: "group",
        title: `${match.courseTitle} 그룹채팅`,
        memberIds: [user.uid, match.hostUid],
        roomKey: `match-${match.id}`,
      });

      navigate("/chat", { state: { chatId } });
    } catch (err) {
      console.error(err);
      alert("그룹 채팅방 생성에 실패했습니다.");
    }
  };

  // UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <span className="text-gray-600">매칭 정보를 불러오는 중입니다...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-50 pb-20">
      {/* 상단 */}
      <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-sky-100 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full flex items-center justify-center">
              <i className="ri-heart-line text-white text-lg"></i>
            </div>
            <h1 className="text-lg font-bold text-gray-800">매칭</h1>
          </div>

          <button className="w-8 h-8 flex items-center justify-center">
            <i className="ri-filter-line text-gray-600 text-lg"></i>
          </button>
        </div>
      </div>

      <div className="pt-16 pb-20">
        {/* Tabs */}
        <div className="px-4 py-4">
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setActiveTab("sent")}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "sent"
                  ? "bg-white text-sky-600 shadow-sm"
                  : "text-gray-600"
              }`}
            >
              보낸 요청
            </button>

            <button
              onClick={() => setActiveTab("matches")}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "matches"
                  ? "bg-white text-sky-600 shadow-sm"
                  : "text-gray-600"
              }`}
            >
              매칭 완료
            </button>
          </div>
        </div>

        {/* 보낸 요청 탭 */}
        {activeTab === "sent" && (
          <div className="px-4 space-y-4">
            {sentRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-800 flex-1 mr-2">
                    {request.courseTitle}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      request.status
                    )}`}
                  >
                    {getStatusText(request.status)}
                  </span>
                </div>

                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full flex items-center justify-center">
                    <i className="ri-user-line text-white text-xs"></i>
                  </div>
                  <span className="text-sm text-gray-600">
                    {request.host} • {request.university}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <i className="ri-calendar-line text-gray-400 text-sm"></i>
                    <span className="text-sm text-gray-600">
                      날짜: {request.date}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <i className="ri-group-line text-gray-400 text-sm"></i>
                    <span className="text-sm text-gray-600">
                      신청 인원: {request.groupSize}명
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <i className="ri-time-line text-gray-400 text-sm"></i>
                    <span className="text-sm text-gray-600">
                      신청일: {request.requestDate}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {request.status === "pending" && (
                    <button
                      onClick={() => handleCancelRequest(request.id)}
                      className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                    >
                      요청 취소
                    </button>
                  )}
                  {request.status === "accepted" && (
                    <button
                      onClick={() => handleRequestChat(request.id)}
                      className="flex-1 bg-sky-500 text-white py-2 rounded-lg text-sm font-medium"
                    >
                      채팅하기
                    </button>
                  )}
                  <button className="flex-1 bg-gray-50 text-gray-600 py-2 rounded-lg text-sm font-medium">
                    상세보기
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 매칭 완료 탭 */}
        {activeTab === "matches" && (
          <div className="px-4 space-y-4">
            {matches.map((match) => (
              <div
                key={match.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-800 flex-1 mr-2">
                    {match.courseTitle}
                  </h3>
                  <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-medium">
                    매칭완료
                  </span>
                </div>

                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-6 h-6 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full flex items-center justify-center">
                    <i className="ri-user-line text-white text-xs"></i>
                  </div>
                  <span className="text-sm text-gray-600">
                    {match.host} • {match.university}
                  </span>
                </div>

                <div className="bg-sky-50 rounded-xl p-3 mb-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <i className="ri-calendar-line text-sky-500"></i>
                      <span className="text-gray-700">{match.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="ri-time-line text-sky-500"></i>
                      <span className="text-gray-700">{match.time}</span>
                    </div>
                    <div className="flex items-center space-x-2 col-span-2">
                      <i className="ri-map-pin-line text-sky-500"></i>
                      <span className="text-gray-700">{match.location}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <i className="ri-group-line text-gray-400 text-sm"></i>
                    <span className="text-sm font-medium text-gray-700">
                      참가자 ({match.participants.length + 1}명)
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                        <i className="ri-user-line text-white text-sm"></i>
                      </div>

                      {match.participants.slice(0, 3).map((participant, index) => (
                        <div
                          key={index}
                          className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center border-2 border-white"
                        >
                          <span className="text-white text-xs font-medium">
                            {participant.charAt(0)}
                          </span>
                        </div>
                      ))}

                      {match.participants.length > 3 && (
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center border-2 border-white">
                          <span className="text-gray-600 text-xs font-medium">
                            +{match.participants.length - 3}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleMatchGroupChat(match.id)}
                    className="flex-1 bg-sky-500 text-white py-2 rounded-lg text-sm font-medium"
                  >
                    그룹 채팅
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg text-sm font-medium">
                    상세보기
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
  // const [requests, setRequests] = useState([
  //   {
  //     id: 1,
  //     userName: '김유진',
  //     university: '연세대학교 교환학생',
  //     courseTitle: '경복궁과 북촌 한옥마을 투어',
  //     message: '한국 전통 문화에 관심이 많아서 신청했습니다. 한복 체험도 가능한가요?',
  //     languages: ['영어', '중국어'],
  //     rating: 4.8,
  //     reviews: 12,
  //     time: '2시간 전',
  //     status: 'pending'
  //   },
  //   {
  //     id: 2,
  //     userName: '마이클 존슨',
  //     university: '서울대학교 교환학생',
  //     courseTitle: '경복궁과 북촌 한옥마을 투어',
  //     message: '친구 2명과 함께 참가하고 싶습니다.',
  //     languages: ['영어'],
  //     rating: 4.9,
  //     reviews: 8,
  //     time: '5시간 전',
  //     status: 'pending'
  //   },
  //   {
  //     id: 3,
  //     userName: '사라 윌슨',
  //     university: '고려대학교 교환학생',
  //     courseTitle: '홍대 야시장과 K-POP 체험',
  //     message: 'K-POP에 정말 관심이 많아요! 꼭 참가하고 싶습니다.',
  //     languages: ['영어', '일본어'],
  //     rating: 4.6,
  //     reviews: 15,
  //     time: '1일 전',
  //     status: 'pending'
  //   }
  // ]);

  // // 신청 완료된 참가자 목록
  // const [participants, setParticipants] = useState([
  //   {
  //     id: 1,
  //     courseId: "1",
  //     courseTitle: '경복궁과 북촌 한옥마을 투어',
  //     userName: '에밀리 존슨',
  //     university: '연세대학교 교환학생',
  //     country: '미국',
  //     languages: ['영어', '한국어'],
  //     rating: 4.9,
  //     reviews: 15,
  //     joinDate: '2024-03-10',
  //     groupSize: 1,
  //     phone: '+82-10-1234-5678',
  //     email: 'emily.johnson@yonsei.ac.kr',
  //     specialRequests: '한복 체험에 특히 관심이 있습니다.'
  //   },
  //   {
  //     id: 2,
  //     courseId: "1",
  //     courseTitle: '경복궁과 북촌 한옥마을 투어',
  //     userName: '다니엘 김',
  //     university: '서울대학교 교환학생',
  //     country: '캐나다',
  //     languages: ['영어', '프랑스어'],
  //     rating: 4.7,
  //     reviews: 8,
  //     joinDate: '2024-03-11',
  //     groupSize: 2,
  //     phone: '+82-10-2345-6789',
  //     email: 'daniel.kim@snu.ac.kr',
  //     specialRequests: '친구와 함께 참가합니다.'
  //   },
  //   {
  //     id: 3,
  //     courseId: "2",
  //     courseTitle: '홍대 야시장과 K-POP 체험',
  //     userName: '마리아 가르시아',
  //     university: '고려대학교 교환학생',
  //     country: '스페인',
  //     languages: ['스페인어', '영어'],
  //     rating: 4.8,
  //     reviews: 12,
  //     joinDate: '2024-03-12',
  //     groupSize: 1,
  //     phone: '+82-10-3456-7890',
  //     email: 'maria.garcia@korea.ac.kr',
  //     specialRequests: 'K-POP 댄스 체험을 원합니다.'
  //   },
  //   {
  //     id: 4,
  //     courseId: "2",
  //     courseTitle: '홍대 야시장과 K-POP 체험',
  //     userName: '타카시 야마다',
  //     university: '성균관대학교 교환학생',
  //     country: '일본',
  //     languages: ['일본어', '영어'],
  //     rating: 4.6,
  //     reviews: 20,
  //     joinDate: '2024-03-13',
  //     groupSize: 3,
  //     phone: '+82-10-4567-8901',
  //     email: 'takashi.yamada@skku.edu',
  //     specialRequests: '일본 친구들과 함께 참가합니다.'
  //   }
  // ]);

  // const myCourses = [
  //   {
  //     id: 1,
  //     title: '경복궁과 북촌 한옥마을 투어',
  //     status: 'active',
  //     participants: 3,
  //     maxParticipants: 5,
  //     date: '3월 15일',
  //     price: '무료',
  //     requests: 7
  //   },
  //   {
  //     id: 2,
  //     title: '홍대 야시장과 K-POP 체험',
  //     status: 'full',
  //     participants: 4,
  //     maxParticipants: 4,
  //     date: '3월 18일',
  //     price: '15,000원',
  //     requests: 12
  //   }
  // ];
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../KoBottomNav';
import { StorageManager } from '../../auth/storageManager';
import { courseRepository } from '../../../repository/courseRepository';
import { scheduleRepository } from '../../../repository/scheduleRepository';
import { matchingRepository, MatchRequest } from '../../../repository/matchingRepository';
import { userRepository } from '../../../repository/userRepository';

export default function CourseManagement() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('my-courses');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  const [newCourse, setNewCourse] = useState({
    userId: '',
    place: '',
    title: '',
    description: '',
    price: '',
    date: '',
    time: '',
    location: '',
    maxParticipants: '',
    languages: [] as string[],
    tags: [] as string[],
    requirements: '',
    itinerary: [{ time: '', activity: '' }]
  });

  type MyCourseCard = {
    id: string;
    title: string;
    status: 'active' | 'full';
    participants: number;
    maxParticipants: number;
    date: string;
    price: string;
    requests: number; // 🔹 해당 코스의 pending 매칭 요청 수
  };

  type UIMatchRequest = MatchRequest & {
    id: string;          // Firestore 문서 ID
    courseTitle?: string;
    guestName?: string;  // 🔹 신청자 이름
  };

  type ParticipantUI = {
    id: string;          // matchRequests 문서 ID 사용
    courseId: string;
    courseTitle: string;
    userName: string;

    university?: string;
    country?: string;
    languages: string[];

    rating?: number;
    reviews?: number;
    joinDate: string;    // "2025-12-09" 이런 형식
    groupSize: number;

    phone?: string;
    email?: string;
    specialRequests?: string;
  };


  const [requests, setRequests] = useState<UIMatchRequest[]>([]);
  const [participants, setParticipants] = useState<ParticipantUI[]>([]);

  const [myCourses, setMyCourses] = useState<MyCourseCard[]>([]);

  const user = StorageManager.get("user");

  // 초기화 화면 정보 불러오기
  const init = async () => {
    if (user == null) {
      StorageManager.clear();
      navigate("/auth");
      return;
    }

    console.log(`userId: ${user.id}`);
    console.log(`userName: ${user.name}`);

    // 1) 내가 만든 코스들
    const courses = await courseRepository.getCoursesByUser(user.id);

    if (!courses || courses.length === 0) {
      console.log("코스 없음");
      setMyCourses([]);
    } else {
      console.log("코스 목록:", courses);

      const mapped = courses.map((c: any) => ({
        id: c.id,
        title: c.title,
        status: (c.participants >= c.maxParticipants ? 'full' : 'active') as 'active' | 'full',
        participants: c.participants ?? 0,
        maxParticipants: c.maxParticipants ?? 0,
        date: c.date,
        price: c.price === 0 ? "무료" : `${c.price.toLocaleString()}원`,
        requests: 0, // 이건 나중에 요청 개수 세서 넣어도 됨
      }));

      setMyCourses(mapped);
    }

    // 2) 내 코스들에 들어온 매칭 요청
    const hostRequests = await matchingRepository.getRequestsForHost(user.id);
    console.log("hostRequests:", hostRequests);

    // 3) guestId → user 정보 매핑
    const guestMap: Record<
      string,
      {
        name: string;
        university?: string;
        email?: string;
        languages?: string[];
      }
    > = {};

    await Promise.all(
      hostRequests.map(async (r) => {
        if (!r.guestId) return;
        if (guestMap[r.guestId]) return;

        const u = await userRepository.getUserById(r.guestId);
        if (!u) {
          guestMap[r.guestId] = {
            name: `신청자(${r.guestId})`,
          };
          return;
        }

        guestMap[r.guestId] = {
          name: u.name,
          university: u.university,
          email: u.email,
          languages: u.languages,
        };
      })
    );


    // 4) 코스 제목 + 신청자 이름 붙이기
    const uiRequests: UIMatchRequest[] = hostRequests.map((r) => {
      const course = courses?.find((c: any) => c.id === r.courseId);
      const guest = guestMap[r.guestId];

      return {
        ...r,
        id: r.id!, // matchingRepository에서 이미 넣어줬을 거라고 가정
        courseTitle: course?.title ?? "알 수 없는 코스",
        guestName: guest?.name ?? `신청자(${r.guestId})`,
      };
    });

    // 🔹 5) accepted 상태인 요청들 → 참가자 목록으로 변환
  const acceptedRequests = hostRequests.filter(
    (r) => r.status === "accepted"
  );

  const participantList: ParticipantUI[] = acceptedRequests.map((r) => {
    const course = courses?.find((c: any) => c.id === r.courseId);
    const guest = guestMap[r.guestId];
    const created =
      r.createdAt && typeof (r.createdAt as any).toDate === "function"
        ? (r.createdAt as any).toDate()
        : null;

    return {
      id: r.id!, // matchRequests 문서 ID
      courseId: r.courseId,
      courseTitle: course?.title ?? "알 수 없는 코스",
      userName: guest?.name ?? `신청자(${r.guestId})`,
      university: guest?.university,
      country: "", // 나중에 user에 country 추가하면 채우면 됨
      languages: guest?.languages ?? [],
      rating: undefined,
      reviews: undefined,
      joinDate: created
        ? created.toISOString().split("T")[0]
        : "-",
      groupSize: r.groupSize,
      phone: "", // phone 정보도 나중에 users에 추가하면 여기서 넣으면 됨
      email: guest?.email,
      specialRequests: r.message,
    };
  });

  setParticipants(participantList);
  };



  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  // 신청 완료된 참가자(더미 데이터) – 나중에 실제 data로 교체 예정
  // const [participants, setParticipants] = useState([
  //   {
  //     id: 1,
  //     courseId: "1",
  //     courseTitle: '경복궁과 북촌 한옥마을 투어',
  //     userName: '에밀리 존슨',
  //     university: '연세대학교 교환학생',
  //     country: '미국',
  //     languages: ['영어', '한국어'],
  //     rating: 4.9,
  //     reviews: 15,
  //     joinDate: '2024-03-10',
  //     groupSize: 1,
  //     phone: '+82-10-1234-5678',
  //     email: 'emily.johnson@yonsei.ac.kr',
  //     specialRequests: '한복 체험에 특히 관심이 있습니다.'
  //   },
  //   {
  //     id: 2,
  //     courseId: "1",
  //     courseTitle: '경복궁과 북촌 한옥마을 투어',
  //     userName: '다니엘 김',
  //     university: '서울대학교 교환학생',
  //     country: '캐나다',
  //     languages: ['영어', '프랑스어'],
  //     rating: 4.7,
  //     reviews: 8,
  //     joinDate: '2024-03-11',
  //     groupSize: 2,
  //     phone: '+82-10-2345-6789',
  //     email: 'daniel.kim@snu.ac.kr',
  //     specialRequests: '친구와 함께 참가합니다.'
  //   },
  //   {
  //     id: 3,
  //     courseId: "2",
  //     courseTitle: '홍대 야시장과 K-POP 체험',
  //     userName: '마리아 가르시아',
  //     university: '고려대학교 교환학생',
  //     country: '스페인',
  //     languages: ['스페인어', '영어'],
  //     rating: 4.8,
  //     reviews: 12,
  //     joinDate: '2024-03-12',
  //     groupSize: 1,
  //     phone: '+82-10-3456-7890',
  //     email: 'maria.garcia@korea.ac.kr',
  //     specialRequests: 'K-POP 댄스 체험을 원합니다.'
  //   },
  //   {
  //     id: 4,
  //     courseId: "2",
  //     courseTitle: '홍대 야시장과 K-POP 체험',
  //     userName: '타카시 야마다',
  //     university: '성균관대학교 교환학생',
  //     country: '일본',
  //     languages: ['일본어', '영어'],
  //     rating: 4.6,
  //     reviews: 20,
  //     joinDate: '2024-03-13',
  //     groupSize: 3,
  //     phone: '+82-10-4567-8901',
  //     email: 'takashi.yamada@skku.edu',
  //     specialRequests: '일본 친구들과 함께 참가합니다.'
  //   }
  // ]);

  const availableLanguages = ['한국어', '영어', '중국어', '일본어'];
  const availableTags = ['문화체험', '음식', '쇼핑', 'K-POP', '역사', '자연', '예술'];

  const handleLanguageToggle = (language: string) => {
    setNewCourse(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  const handleTagToggle = (tag: string) => {
    setNewCourse(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const addItineraryItem = () => {
    setNewCourse(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, { time: '', activity: '' }]
    }));
  };

  const removeItineraryItem = (index: number) => {
    setNewCourse(prev => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== index)
    }));
  };

  const updateItineraryItem = (index: number, field: 'time' | 'activity', value: string) => {
    setNewCourse(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('New course:', newCourse);

    if (!user) {
      alert("로그인이 필요합니다.");
      navigate("/auth");
      return;
    }

    try {
      // 1) 코스 생성 (hostName 추가)
      const newCourseId = await courseRepository.createCourse({
        userId: user.id,
        hostName: user.name, // 🔹 코스 호스트 이름
        title: newCourse.title,
        description: newCourse.description,
        date: newCourse.date,
        place: newCourse.location,
        maxParticipants: Number(newCourse.maxParticipants),
        price: newCourse.price === "무료" ? 0 : Number(newCourse.price),
        languages: newCourse.languages,
        tags: newCourse.tags,
        requirements: newCourse.requirements,
        time: newCourse.time
      } as any);

      console.log("새로 생성된 코스 ID:", newCourseId);

      // 2) 일정 저장 (상세 일정 → schedule 컬렉션)
      await Promise.all(
        newCourse.itinerary.map((t) =>
          scheduleRepository.createSchedule({
            courseId: newCourseId,
            time: `${newCourse.date} ${t.time}`,
            description: t.activity,
          })
        )
      );

      // 3) 폼 리셋 + 리스트 새로고침
      setShowCreateForm(false);
      setNewCourse({
        userId: '',
        place: '',
        title: '',
        description: '',
        price: '',
        date: '',
        time: '',
        location: '',
        maxParticipants: '',
        languages: [],
        tags: [],
        requirements: '',
        itinerary: [{ time: '', activity: '' }],
      });

      await init(); // 코스 + 매칭 요청 목록 다시 불러오기
    } catch (err) {
      console.error("코스 생성/일정 저장 실패:", err);
      alert("코스 생성 중 오류가 발생했습니다.");
    }
  };

  // 🔹 매칭 요청 수락
  const handleAcceptRequest = async (requestId: string) => {
    try {
      await matchingRepository.updateStatus(requestId, "accepted");
      setRequests(prev =>
        prev.map(r =>
          r.id === requestId ? { ...r, status: "accepted" } : r
        )
      );
      alert('매칭 요청을 수락했습니다!');
      await init(); // 상태 반영 위해 다시 불러오기 (코스 요청 수 갱신)
    } catch (err) {
      console.error("매칭 요청 수락 실패:", err);
      alert("요청 수락 중 오류가 발생했습니다.");
    }
  };

  // 🔹 매칭 요청 거절
  const handleRejectRequest = async (requestId: string) => {
    try {
      await matchingRepository.updateStatus(requestId, "rejected");
      setRequests(prev =>
        prev.map(r =>
          r.id === requestId ? { ...r, status: "rejected" } : r
        )
      );
      alert('매칭 요청을 거절했습니다.');
      await init();
    } catch (err) {
      console.error("매칭 요청 거절 실패:", err);
      alert("요청 거절 중 오류가 발생했습니다.");
    }
  };

  // 🔹 참가자 삭제
  const handleRemoveParticipant = (participantId: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== participantId));
    setShowDeleteConfirm(null);
    alert("참가자가 삭제되었습니다.");
  };

  // 🔹 코스별 참가자 필터
  const getParticipantsByCourse = (courseId: string) => {
    return participants.filter((p) => p.courseId === courseId);
  };


  // 🔹 createdAt → 간단한 표시용 문자열
  const formatCreatedAt = (createdAt: any) => {
    if (!createdAt || !createdAt.toDate) return '-';
    const d = createdAt.toDate() as Date;
    return d.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-50 pb-20">
      {/* 상단 네비게이션 */}
      <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-sky-100 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <button className="w-8 h-8 flex items-center justify-center">
            {/* <i className="ri-arrow-left-line text-gray-600 text-lg"></i> */}
          </button>
          <h1 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Pretendard, sans-serif' }}>
            코스 관리
          </h1>
          <button className="w-8 h-8 flex items-center justify-center relative">
            <i className="ri-notification-line text-gray-600 text-lg"></i>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </button>
        </div>
      </div>

      <div className="pt-16 pb-20">
        {/* 탭 메뉴 */}
        <div className="px-4 py-4">
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('my-courses')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${activeTab === 'my-courses'
                ? 'bg-white text-sky-600 shadow-sm'
                : 'text-gray-600'
                }`}
            >
              내 코스
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${activeTab === 'requests'
                ? 'bg-white text-sky-600 shadow-sm'
                : 'text-gray-600'
                }`}
            >
              매칭 요청
            </button>
            <button
              onClick={() => setActiveTab('participants')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${activeTab === 'participants'
                ? 'bg-white text-sky-600 shadow-sm'
                : 'text-gray-600'
                }`}
            >
              참가자
            </button>
          </div>
        </div>

        {/* 내 코스 탭 */}
        {activeTab === 'my-courses' && (
          <div className="px-4 space-y-4">
            {myCourses.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-map-pin-line text-gray-400 text-2xl"></i>
                </div>
                <p className="text-gray-500">아직 만든 코스가 없습니다</p>
                <p className="text-sm text-gray-400 mt-1">오른쪽 아래 + 버튼으로 첫 코스를 만들어보세요</p>
              </div>
            ) : (
              myCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-800 flex-1 mr-2">
                      {course.title}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${course.status === 'active'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-orange-100 text-orange-600'
                        }`}
                    >
                      {course.status === 'active' ? '모집중' : '마감'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <i className="ri-calendar-line text-gray-400 text-sm"></i>
                      <span className="text-sm text-gray-600">{course.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="ri-money-dollar-circle-line text-gray-400 text-sm"></i>
                      <span className="text-sm text-gray-600">{course.price}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="ri-group-line text-gray-400 text-sm"></i>
                      <span className="text-sm text-gray-600">
                        {course.participants}/{course.maxParticipants}명
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="ri-notification-line text-gray-400 text-sm"></i>
                      <span className="text-sm text-gray-600">
                        요청 {course.requests}건
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate('/course-edit')}
                      className="flex-1 bg-sky-50 text-sky-600 py-2 rounded-lg text-sm font-medium"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => navigate('/course-detail')}
                      className="flex-1 bg-gray-50 text-gray-600 py-2 rounded-lg text-sm font-medium"
                    >
                      상세보기
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 매칭 요청 탭 */}
        {activeTab === 'requests' && (
          <div className="px-4 space-y-4">
            {requests.filter(r => r.status === 'pending').map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                    <i className="ri-user-line text-white text-lg"></i>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800">
                      {request.guestName ?? request.guestId}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {/* university는 아직 users 컬렉션에 저장 안 했으니 나중에 붙이면 됨 */}
                      {request.courseTitle}
                    </p>

                  </div>
                  <span className="text-xs text-gray-500">
                    {formatCreatedAt(request.createdAt)}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-xl p-3 mb-3">
                  <p className="text-sm text-gray-700 font-medium mb-1">
                    {request.courseTitle ?? '코스 제목 없음'}
                  </p>
                  {request.message && (
                    <p className="text-xs text-gray-600">
                      "{request.message}"
                    </p>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAcceptRequest(request.id!)}
                    className="flex-1 bg-sky-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-sky-600 transition-colors"
                  >
                    수락
                  </button>
                  <button
                    onClick={() => handleRejectRequest(request.id!)}
                    className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    거절
                  </button>
                </div>
              </div>
            ))}

            {requests.filter(r => r.status === 'pending').length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-inbox-line text-gray-400 text-2xl"></i>
                </div>
                <p className="text-gray-500">새로운 매칭 요청이 없습니다</p>
              </div>
            )}
          </div>
        )}

        {/* 참가자 탭 (지금은 더미 데이터 유지) */}
        {activeTab === 'participants' && (
          <div className="px-4 space-y-4">
            {myCourses.map((course) => {
              const courseParticipants = getParticipantsByCourse(course.id);

              if (courseParticipants.length === 0) return null;

              return (
                <div key={course.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800">{course.title}</h3>
                    <span className="text-sm text-gray-500">
                      {courseParticipants.length}명 참가
                    </span>
                  </div>

                  <div className="space-y-3">
                    {courseParticipants.map((participant) => (
                      <div
                        key={participant.id}
                        className="border border-gray-100 rounded-xl p-3"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                              <i className="ri-user-line text-white text-sm"></i>
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-800">{participant.userName}</h4>
                              <p className="text-sm text-gray-600">{participant.university}</p>
                              <p className="text-xs text-gray-500">{participant.country}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => setShowDeleteConfirm(participant.id)}
                            className="w-8 h-8 bg-red-50 text-red-500 rounded-full flex items-center justify-center hover:bg-red-100 transition-colors"
                          >
                            <i className="ri-delete-bin-line text-sm"></i>
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div className="flex items-center space-x-2">
                            <i className="ri-group-line text-gray-400 text-sm"></i>
                            <span className="text-sm text-gray-600">{participant.groupSize}명</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <i className="ri-calendar-line text-gray-400 text-sm"></i>
                            <span className="text-sm text-gray-600">{participant.joinDate}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <i className="ri-star-fill text-yellow-400 text-sm"></i>
                            <span className="text-sm text-gray-600">{participant.rating} ({participant.reviews}4.5)</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <i className="ri-global-line text-gray-400 text-sm"></i>
                            <span className="text-sm text-gray-600">{participant.languages.join(', ')}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <i className="ri-phone-line text-gray-400 text-sm"></i>
                            <span className="text-sm text-gray-600">{participant.phone}010-1234-5678</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <i className="ri-mail-line text-gray-400 text-sm"></i>
                            <span className="text-sm text-gray-600">{participant.email}</span>
                          </div>
                        </div>

                        {participant.specialRequests && (
                          <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">
                              <i className="ri-message-line text-gray-400 mr-2"></i>
                              {participant.specialRequests}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {participants.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-user-line text-gray-400 text-2xl"></i>
                </div>
                <p className="text-gray-500">아직 참가자가 없습니다</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 플로팅 액션 버튼 */}
      <button
        onClick={() => setShowCreateForm(true)}
        className="fixed bottom-20 right-4 w-14 h-14 bg-sky-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-sky-600 transition-colors z-40"
      >
        <i className="ri-add-line text-2xl"></i>
      </button>

      {/* 참가자 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-delete-bin-line text-red-500 text-2xl"></i>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">참가자 삭제</h3>
              <p className="text-gray-600">
                이 참가자를 코스에서 삭제하시겠습니까?<br />
                삭제된 참가자는 복구할 수 없습니다.
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-medium"
              >
                취소
              </button>
              <button
                onClick={() => handleRemoveParticipant(showDeleteConfirm)}
                className="flex-1 bg-red-500 text-white py-3 rounded-xl font-medium"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 코스 생성 모달 */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full max-h-[90vh] rounded-t-3xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-600"
                >
                  취소
                </button>
                <h2 className="text-lg font-bold text-gray-800">새 코스 만들기</h2>
                <button
                  onClick={handleSubmit}
                  className="text-sky-500 font-medium"
                >
                  완료
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  코스 제목
                </label>
                <input
                  type="text"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="코스 제목을 입력하세요"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  코스 설명
                </label>
                <textarea
                  value={newCourse.description}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 h-24 resize-none"
                  placeholder="코스에 대한 자세한 설명을 입력하세요"
                  maxLength={500}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    날짜
                  </label>
                  <input
                    type="date"
                    value={newCourse.date}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    시간
                  </label>
                  <input
                    type="time"
                    value={newCourse.time}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  만날 장소
                </label>
                <input
                  type="text"
                  value={newCourse.location}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="만날 장소를 입력하세요"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text_sm font-medium text-gray-700 mb-2">
                    참가비
                  </label>
                  <input
                    type="text"
                    value={newCourse.price}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="무료 또는 금액"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    최대 인원
                  </label>
                  <input
                    type="number"
                    value={newCourse.maxParticipants}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, maxParticipants: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="명"
                    min="1"
                    max="20"
                    required
                  />
                </div>
              </div>

              {/* 상세 일정 섹션 */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    상세 일정
                  </label>
                  <button
                    type="button"
                    onClick={addItineraryItem}
                    className="text-sky-500 text-sm font-medium"
                  >
                    + 일정 추가
                  </button>
                </div>
                <div className="space-y-3">
                  {newCourse.itinerary.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <input
                        type="time"
                        value={item.time}
                        onChange={(e) => updateItineraryItem(index, 'time', e.target.value)}
                        className="w-24 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                        required
                      />
                      <input
                        type="text"
                        value={item.activity}
                        onChange={(e) => updateItineraryItem(index, 'activity', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                        placeholder="일정 내용을 입력하세요"
                        required
                      />
                      {newCourse.itinerary.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItineraryItem(index)}
                          className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors"
                        >
                          <i className="ri-delete-bin-line text-sm"></i>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

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
                      className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${newCourse.languages.includes(language)
                        ? 'bg-sky-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                        }`}
                    >
                      {language}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  태그
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagToggle(tag)}
                      className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${newCourse.tags.includes(tag)
                        ? 'bg-sky-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                        }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  참가 요건 (선택사항)
                </label>
                <textarea
                  value={newCourse.requirements}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, requirements: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 h-20 resize-none"
                  placeholder="특별한 요건이 있다면 입력하세요"
                  maxLength={200}
                />
              </div>
            </form>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

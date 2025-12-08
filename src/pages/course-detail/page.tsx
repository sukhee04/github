
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { courseRepository } from '../../repository/courseRepository';
import { matchingRepository } from '../../repository/matchingRepository';
import { StorageManager } from '../auth/storageManager';

export default function CourseDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [groupSize, setGroupSize] = useState(1);
  const [message, setMessage] = useState('');
  const [course, setCourse] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const user = StorageManager.get("user");

    // Firestore에서 해당 코스 상세 정보 가져오기
  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;
      try {
        const data = await courseRepository.getCourseById(id);
        setCourse(data);
      } catch (err) {
        console.error('코스 상세 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const formatPrice = (price: number | string | undefined) => {
    if (typeof price === 'string') return price;
    if (price === 0) return '무료';
    if (!price && price !== 0) return '-';
    return `${price.toLocaleString()}원`;
  };

  // const course = {
  //   id: 1,
  //   title: '경복궁과 북촌 한옥마을 투어',
  //   host: '김민지',
  //   university: '서울대학교',
  //   rating: 4.9,
  //   reviews: 23,
  //   price: '무료',
  //   image: 'https://readdy.ai/api/search-image?query=Beautiful%20traditional%20Korean%20palace%20Gyeongbokgung%20with%20colorful%20hanbok%20people%20walking%2C%20bright%20sunny%20day%2C%20cultural%20heritage%20site%2C%20vibrant%20colors%2C%20travel%20photography%20style%2C%20high%20quality%2C%20detailed%20architecture&width=375&height=250&seq=coursedetail1&orientation=landscape',
  //   tags: ['문화체험', '역사', '사진촬영'],
  //   languages: ['한국어', '영어'],
  //   date: '3월 15일',
  //   time: '오후 2:00',
  //   duration: '3시간',
  //   location: '경복궁 정문',
  //   maxParticipants: 5,
  //   currentParticipants: 2,
  //   description: '한국의 대표적인 궁궐인 경복궁과 전통 한옥마을인 북촌을 함께 둘러보는 문화 체험 투어입니다. 조선시대의 역사와 전통 건축의 아름다움을 직접 체험하고, 한복 착용 체험도 가능합니다.',
  //   itinerary: [
  //     { time: '14:00', activity: '경복궁 정문에서 만남' },
  //     { time: '14:30', activity: '경복궁 투어 및 수문장 교대식 관람' },
  //     { time: '15:30', activity: '북촌 한옥마을 산책' },
  //     { time: '16:30', activity: '한복 체험 및 사진 촬영' },
  //     { time: '17:00', activity: '투어 종료' }
  //   ],
  //   included: ['가이드 투어', '한복 체험', '기념품'],
  //   requirements: '편한 신발 착용 권장',
  //   hostInfo: {
  //     name: '김민지',
  //     university: '서울대학교',
  //     major: '한국사학과',
  //     rating: 4.9,
  //     totalTours: 15,
  //     languages: ['한국어', '영어'],
  //     introduction: '안녕하세요! 한국사를 전공하고 있는 김민지입니다. 한국의 전통 문화와 역사를 외국 친구들과 함께 나누는 것을 좋아합니다.'
  //   }
  // };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <span className="text-gray-600">코스 정보를 불러오는 중입니다...</span>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
          <div className="flex items-center justify-between px-4 py-3">
            <button 
              onClick={() => navigate(-1)}
              className="w-8 h-8 flex items-center justify-center"
            >
              <i className="ri-arrow-left-line text-gray-600 text-lg"></i>
            </button>
            <h1 className="text-lg font-bold text-gray-800">코스 상세</h1>
            <div className="w-8" />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center pt-16">
          <span className="text-gray-500">해당 코스를 찾을 수 없습니다.</span>
        </div>
      </div>
    );
  }

  // Firestore 필드 기준으로 안전하게 값 뽑기 (없는 건 기본값)
  const {
    title,
    description,
    date,
    time,
    duration,
    place,
    maxParticipants = 0,
    participants = 0,
    price,
    image,
    tags = [],
    languages = [],
    hostInfo,
  } = course;

  const host = hostInfo ?? {
    name: course.host ?? '호스트',
    university: course.university ?? '',
    major: course.major ?? '',
    rating: course.rating ?? 4.8,
    totalTours: course.totalTours ?? 0,
    languages: course.languages ?? languages,
    introduction: course.hostIntroduction ?? '',
  };

  const itinerary = course.itinerary ?? [];
  const included = course.included ?? [];
  const requirements = course.requirements ?? '';

  const participationRate =
    maxParticipants > 0 ? (participants / maxParticipants) * 100 : 0;

  const remainSeats =
    maxParticipants > participants ? maxParticipants - participants : 0;

  const handleBooking = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      navigate("/auth");
      return;
    }

    if (!id) {
      alert("코스 ID가 없습니다.");
      return;
    }

    if (!course?.userId) {
      console.error("course.userId(호스트 ID)가 없습니다.", course);
      alert("코스 정보에 호스트 정보가 없습니다.");
      return;
    }

   try {
      // 먼저 중복 여부 체크
      const alreadyRequested = await matchingRepository.hasPendingRequest(
        id,
        user.id
      );

      if (alreadyRequested) {
        alert("이미 이 코스에 보낸 매칭 요청이 있습니다.\n호스트의 응답을 기다려 주세요.");
        setShowBookingModal(false);
        return;
      }

      // 1) 매칭 요청 생성
      const matchId = await matchingRepository.createRequest({
        courseId: id,
        hostId: course.userId,   // 코스 만든 사람
        guestId: user.id,        // 신청하는 사람(유학생)
        groupSize,
        message,
        // chatId: 나중에 채팅방 만들면 여기 넣기
      });

      console.log("매칭 요청 생성 완료, matchId:", matchId);

      // 2) 참가 인원 증가 (신청 = 확정이라고 보는 경우)
      const currentParticipants = course.participants ?? 0;
      const newParticipants = currentParticipants + groupSize;

      // Firestore 업데이트
      await courseRepository.updateCourse(id, {
        participants: newParticipants,
      });

      // 로컬 state도 같이 업데이트해서 화면 바로 반영
      setCourse((prev: any) =>
        prev
          ? {
              ...prev,
              participants: newParticipants,
            }
          : prev
      );

      alert("매칭 요청이 전송되었습니다!");

      setShowBookingModal(false);

      // 굳이 다른 페이지로 안 보내고 여기 두고 싶으면 아래 줄은 빼도 됨
      // navigate('/matching');
    } catch (err) {
      console.error("매칭 요청 생성 실패:", err);
      alert("매칭 요청 중 오류가 발생했습니다.");
    }
  };


  return (
    <div className="min-h-screen bg-white">
      {/* 상단 네비게이션 */}
      <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={() => navigate(-1)}
            className="w-8 h-8 flex items-center justify-center"
          >
            <i className="ri-arrow-left-line text-gray-600 text-lg"></i>
          </button>
          <h1 className="text-lg font-bold text-gray-800">코스 상세</h1>
          <button className="w-8 h-8 flex items-center justify-center">
            <i className="ri-share-line text-gray-600 text-lg"></i>
          </button>
        </div>
      </div>

      <div className="pt-16 pb-20">
        {/* 메인 이미지 */}
        <div className="relative">
          <img
            src={
              image ||
              'https://readdy.ai/api/search-image?query=Beautiful%20traditional%20Korean%20palace%20Gyeongbokgung%20with%20colorful%20hanbok%20people%20walking%2C%20bright%20sunny%20day%2C%20cultural%20heritage%20site%2C%20vibrant%20colors%2C%20travel%20photography%20style%2C%20high%20quality%2C%20detailed%20architecture&width=375&height=250&seq=coursedetail1&orientation=landscape'
            }
            alt={title}
            className="w-full h-64 object-cover"
          />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-sm font-medium text-gray-700">
              {formatPrice(price)}
            </span>
          </div>
          <button className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
            <i className="ri-heart-line text-gray-600 text-lg"></i>
          </button>
        </div>

        {/* 코스 정보 */}
        <div className="px-4 py-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {Array.isArray(tags) &&
              tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-sky-50 text-sky-600 text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {title}
          </h1>

          {/* 참가 현황 바 */}
          {maxParticipants > 0 && (
            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">참가 현황</span>
                <span className="text-sm text-gray-600">
                  {participants}/{maxParticipants}명
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div 
                  className="bg-gradient-to-r from-sky-400 to-blue-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${participationRate}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  {remainSeats}자리 남음
                </span>
                <span>
                  {participationRate.toFixed(0)}% 찬
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <i className="ri-calendar-line text-gray-400 text-lg"></i>
              <div>
                <p className="text-sm text-gray-600">날짜</p>
                <p className="font-medium text-gray-800">{date ?? '-'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <i className="ri-time-line text-gray-400 text-lg"></i>
              <div>
                <p className="text-sm text-gray-600">시간</p>
                <p className="font-medium text-gray-800">{time ?? '-'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <i className="ri-map-pin-line text-gray-400 text-lg"></i>
              <div>
                <p className="text-sm text-gray-600">만날 장소</p>
                <p className="font-medium text-gray-800">{place ?? '-'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <i className="ri-time-fill text-gray-400 text-lg"></i>
              <div>
                <p className="text-sm text-gray-600">소요 시간</p>
                <p className="font-medium text-gray-800">{duration ?? '-'}</p>
              </div>
            </div>
          </div>

          {/* 호스트 정보 */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">호스트 정보</h3>
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full flex items-center justify-center">
                <i className="ri-user-line text-white text-lg"></i>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-800">{host.name}</h4>
                <p className="text-sm text-gray-600">
                  {host.university}{host.major ? ` • ${host.major}` : ''}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1">
                  <i className="ri-star-fill text-yellow-400 text-sm"></i>
                  <span className="text-sm font-medium">
                    {host.rating ?? '-'}
                  </span>
                </div>
                {host.totalTours !== undefined && (
                  <p className="text-xs text-gray-500">
                    {host.totalTours}회 투어
                  </p>
                )}
              </div>
            </div>
            {host.introduction && (
              <p className="text-sm text-gray-700 mb-3">{host.introduction}</p>
            )}
            <div className="flex items-center space-x-2">
              <i className="ri-global-line text-gray-400 text-sm"></i>
              <span className="text-sm text-gray-600">
                {Array.isArray(host.languages)
                  ? host.languages.join(', ')
                  : ''}
              </span>
            </div>
          </div>

          {/* 코스 설명 */}
          {description && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">코스 소개</h3>
              <p className="text-gray-700 leading-relaxed">{description}</p>
            </div>
          )}

          {/* 일정 */}
          {Array.isArray(itinerary) && itinerary.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">상세 일정</h3>
              <div className="space-y-3">
                {itinerary.map((item: any, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-16 h-8 bg-sky-100 text-sky-600 rounded-lg flex items-center justify-center text-sm font-medium">
                      {item.time ?? ''}
                    </div>
                    <p className="flex-1 text-gray-700 pt-1">{item.activity}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 포함 사항 */}
          {Array.isArray(included) && included.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">포함 사항</h3>
              <div className="space-y-2">
                {included.map((item: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <i className="ri-check-line text-green-500 text-sm"></i>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 참가 요건 */}
          {requirements && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">참가 요건</h3>
              <p className="text-gray-700">{requirements}</p>
            </div>
          )}
        </div>
      </div>

      {/* 하단 예약 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <button
          onClick={() => setShowBookingModal(true)}
          className="w-full bg-sky-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-sky-600 transition-colors"
        >
          매칭 요청하기
        </button>
      </div>

      {/* 예약 모달 */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full max-h-[80vh] rounded-t-3xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setShowBookingModal(false)}
                  className="text-gray-600"
                >
                  취소
                </button>
                <h2 className="text-lg font-bold text-gray-800">매칭 요청</h2>
                <button 
                  onClick={handleBooking}
                  className="text-sky-500 font-medium"
                >
                  요청
                </button>
              </div>
            </div>

            <div className="p-4 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  참가 인원
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setGroupSize(Math.max(1, groupSize - 1))}
                    className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
                  >
                    <i className="ri-subtract-line text-gray-600"></i>
                  </button>
                  <span className="text-xl font-bold text-gray-800 w-8 text-center">
                    {groupSize}
                  </span>
                  <button
                    onClick={() =>
                      setGroupSize(
                        Math.min(
                          remainSeats > 0 ? remainSeats : groupSize,
                          groupSize + 1
                        )
                      )
                    }
                    className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
                    disabled={remainSeats <= 0}
                  >
                    <i className="ri-add-line text-gray-600"></i>
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  최대 {remainSeats}명까지 신청 가능
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  호스트에게 메시지 (선택사항)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 h-24 resize-none"
                  placeholder="궁금한 점이나 특별한 요청사항이 있다면 적어주세요"
                  maxLength={200}
                />
              </div>

              <div className="bg-sky-50 rounded-xl p-4">
                <h4 className="font-bold text-gray-800 mb-2">요청 정보</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">코스</span>
                    <span className="text-gray-800">{title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">날짜</span>
                    <span className="text-gray-800">
                      {date ?? '-'} {time ?? ''}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">참가 인원</span>
                    <span className="text-gray-800">{groupSize}명</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">참가비</span>
                    <span className="text-gray-800 font-medium">
                      {formatPrice(price)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
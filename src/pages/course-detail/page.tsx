
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CourseDetail() {
  const navigate = useNavigate();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [groupSize, setGroupSize] = useState(1);
  const [message, setMessage] = useState('');

  const course = {
    id: 1,
    title: '경복궁과 북촌 한옥마을 투어',
    host: '김민지',
    university: '서울대학교',
    rating: 4.9,
    reviews: 23,
    price: '무료',
    image: 'https://readdy.ai/api/search-image?query=Beautiful%20traditional%20Korean%20palace%20Gyeongbokgung%20with%20colorful%20hanbok%20people%20walking%2C%20bright%20sunny%20day%2C%20cultural%20heritage%20site%2C%20vibrant%20colors%2C%20travel%20photography%20style%2C%20high%20quality%2C%20detailed%20architecture&width=375&height=250&seq=coursedetail1&orientation=landscape',
    tags: ['문화체험', '역사', '사진촬영'],
    languages: ['한국어', '영어'],
    date: '3월 15일',
    time: '오후 2:00',
    duration: '3시간',
    location: '경복궁 정문',
    maxParticipants: 5,
    currentParticipants: 2,
    description: '한국의 대표적인 궁궐인 경복궁과 전통 한옥마을인 북촌을 함께 둘러보는 문화 체험 투어입니다. 조선시대의 역사와 전통 건축의 아름다움을 직접 체험하고, 한복 착용 체험도 가능합니다.',
    itinerary: [
      { time: '14:00', activity: '경복궁 정문에서 만남' },
      { time: '14:30', activity: '경복궁 투어 및 수문장 교대식 관람' },
      { time: '15:30', activity: '북촌 한옥마을 산책' },
      { time: '16:30', activity: '한복 체험 및 사진 촬영' },
      { time: '17:00', activity: '투어 종료' }
    ],
    included: ['가이드 투어', '한복 체험', '기념품'],
    requirements: '편한 신발 착용 권장',
    hostInfo: {
      name: '김민지',
      university: '서울대학교',
      major: '한국사학과',
      rating: 4.9,
      totalTours: 15,
      languages: ['한국어', '영어'],
      introduction: '안녕하세요! 한국사를 전공하고 있는 김민지입니다. 한국의 전통 문화와 역사를 외국 친구들과 함께 나누는 것을 좋아합니다.'
    }
  };

  const participationRate = (course.currentParticipants / course.maxParticipants) * 100;

  const handleBooking = () => {
    console.log('Booking request:', { groupSize, message });
    setShowBookingModal(false);
    // 매칭 요청 완료 후 매칭 페이지로 이동
    navigate('/matching');
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
            src={course.image}
            alt={course.title}
            className="w-full h-64 object-cover"
          />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-sm font-medium text-gray-700">
              {course.price}
            </span>
          </div>
          <button className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
            <i className="ri-heart-line text-gray-600 text-lg"></i>
          </button>
        </div>

        {/* 코스 정보 */}
        <div className="px-4 py-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {course.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-sky-50 text-sky-600 text-sm rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {course.title}
          </h1>

          {/* 참가 현황 바 */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">참가 현황</span>
              <span className="text-sm text-gray-600">
                {course.currentParticipants}/{course.maxParticipants}명
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
                {course.maxParticipants - course.currentParticipants}자리 남음
              </span>
              <span>
                {participationRate.toFixed(0)}% 찬
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <i className="ri-calendar-line text-gray-400 text-lg"></i>
              <div>
                <p className="text-sm text-gray-600">날짜</p>
                <p className="font-medium text-gray-800">{course.date}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <i className="ri-time-line text-gray-400 text-lg"></i>
              <div>
                <p className="text-sm text-gray-600">시간</p>
                <p className="font-medium text-gray-800">{course.time}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <i className="ri-map-pin-line text-gray-400 text-lg"></i>
              <div>
                <p className="text-sm text-gray-600">만날 장소</p>
                <p className="font-medium text-gray-800">{course.location}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <i className="ri-time-fill text-gray-400 text-lg"></i>
              <div>
                <p className="text-sm text-gray-600">소요 시간</p>
                <p className="font-medium text-gray-800">{course.duration}</p>
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
                <h4 className="font-bold text-gray-800">{course.hostInfo.name}</h4>
                <p className="text-sm text-gray-600">
                  {course.hostInfo.university} • {course.hostInfo.major}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1">
                  <i className="ri-star-fill text-yellow-400 text-sm"></i>
                  <span className="text-sm font-medium">{course.hostInfo.rating}</span>
                </div>
                <p className="text-xs text-gray-500">{course.hostInfo.totalTours}회 투어</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-3">{course.hostInfo.introduction}</p>
            <div className="flex items-center space-x-2">
              <i className="ri-global-line text-gray-400 text-sm"></i>
              <span className="text-sm text-gray-600">
                {course.hostInfo.languages.join(', ')}
              </span>
            </div>
          </div>

          {/* 코스 설명 */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">코스 소개</h3>
            <p className="text-gray-700 leading-relaxed">{course.description}</p>
          </div>

          {/* 일정 */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">상세 일정</h3>
            <div className="space-y-3">
              {course.itinerary.map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-16 h-8 bg-sky-100 text-sky-600 rounded-lg flex items-center justify-center text-sm font-medium">
                    {item.time}
                  </div>
                  <p className="flex-1 text-gray-700 pt-1">{item.activity}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 포함 사항 */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">포함 사항</h3>
            <div className="space-y-2">
              {course.included.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <i className="ri-check-line text-green-500 text-sm"></i>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 참가 요건 */}
          {course.requirements && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">참가 요건</h3>
              <p className="text-gray-700">{course.requirements}</p>
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
                    onClick={() => setGroupSize(Math.min(course.maxParticipants - course.currentParticipants, groupSize + 1))}
                    className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
                  >
                    <i className="ri-add-line text-gray-600"></i>
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  최대 {course.maxParticipants - course.currentParticipants}명까지 신청 가능
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
                    <span className="text-gray-800">{course.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">날짜</span>
                    <span className="text-gray-800">{course.date} {course.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">참가 인원</span>
                    <span className="text-gray-800">{groupSize}명</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">참가비</span>
                    <span className="text-gray-800 font-medium">{course.price}</span>
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

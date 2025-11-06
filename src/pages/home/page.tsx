
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('all');

  const courses = [
    {
      id: 1,
      title: '경복궁과 북촌 한옥마을 투어',
      host: '김민지',
      university: '서울대학교',
      rating: 4.9,
      reviews: 23,
      price: '무료',
      image: 'https://readdy.ai/api/search-image?query=Beautiful%20traditional%20Korean%20palace%20Gyeongbokgung%20with%20colorful%20hanbok%20people%20walking%2C%20bright%20sunny%20day%2C%20cultural%20heritage%20site%2C%20vibrant%20colors%2C%20travel%20photography%20style%2C%20high%20quality%2C%20detailed%20architecture&width=300&height=200&seq=course1&orientation=landscape',
      tags: ['문화체험', '역사', '사진촬영'],
      languages: ['한국어', '영어'],
      date: '3월 15일'
    },
    {
      id: 2,
      title: '홍대 야시장과 K-POP 체험',
      host: '박서준',
      university: '연세대학교',
      rating: 4.8,
      reviews: 31,
      price: '15,000원',
      image: 'https://readdy.ai/api/search-image?query=Vibrant%20Korean%20night%20market%20in%20Hongdae%20with%20colorful%20street%20food%20stalls%2C%20neon%20lights%2C%20young%20people%20enjoying%20food%2C%20lively%20atmosphere%2C%20urban%20nightlife%2C%20warm%20lighting%2C%20cultural%20experience&width=300&height=200&seq=course2&orientation=landscape',
      tags: ['음식', 'K-POP', '야시장'],
      languages: ['한국어', '영어', '중국어'],
      date: '3월 18일'
    },
    {
      id: 3,
      title: '제주도 올레길 트레킹',
      host: '이하늘',
      university: '제주대학교',
      rating: 5.0,
      reviews: 18,
      price: '25,000원',
      image: 'https://readdy.ai/api/search-image?query=Beautiful%20Jeju%20Island%20Olle%20trail%20with%20ocean%20view%2C%20green%20hills%2C%20walking%20path%2C%20clear%20blue%20sky%2C%20peaceful%20nature%20scenery%2C%20hiking%20adventure%2C%20Korean%20landscape%2C%20travel%20destination&width=300&height=200&seq=course3&orientation=landscape',
      tags: ['자연', '트레킹', '힐링'],
      languages: ['한국어', '영어'],
      date: '3월 22일'
    },
    {
      id: 4,
      title: '부산 해운대와 감천문화마을',
      host: '최유진',
      university: '부산대학교',
      rating: 4.7,
      reviews: 27,
      price: '20,000원',
      image: 'https://readdy.ai/api/search-image?query=Colorful%20Gamcheon%20Culture%20Village%20in%20Busan%20with%20rainbow%20houses%20on%20hillside%2C%20artistic%20murals%2C%20coastal%20city%20view%2C%20bright%20sunny%20day%2C%20Korean%20cultural%20landmark%2C%20vibrant%20community%20art&width=300&height=200&seq=course4&orientation=landscape',
      tags: ['해변', '문화마을', '예술'],
      languages: ['한국어', '영어', '일본어'],
      date: '3월 25일'
    }
  ];

  const categories = [
    { name: '전체', key: 'all', icon: 'ri-apps-line' },
    { name: '문화체험', key: 'culture', icon: 'ri-building-line' },
    { name: '음식', key: 'food', icon: 'ri-restaurant-line' },
    { name: '자연', key: 'nature', icon: 'ri-leaf-line' },
    { name: '쇼핑', key: 'shopping', icon: 'ri-shopping-bag-line' },
    { name: 'K-POP', key: 'kpop', icon: 'ri-music-line' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-50">
      {/* 상단 네비게이션 */}
      <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-sky-100 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full flex items-center justify-center">
              <i className="ri-global-line text-white text-lg"></i>
            </div>
            <h1 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Pretendard, sans-serif' }}>
              문화친구
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <button className="w-8 h-8 flex items-center justify-center">
              <i className="ri-search-line text-gray-600 text-lg"></i>
            </button>
            <button className="w-8 h-8 flex items-center justify-center relative">
              <i className="ri-notification-line text-gray-600 text-lg"></i>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </button>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="pt-16 pb-20">
        {/* 환영 메시지 */}
        <div className="px-4 py-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Pretendard, sans-serif' }}>
            안녕하세요! 👋
          </h2>
          <p className="text-gray-600">
            새로운 친구들과 함께 한국 문화를 경험해보세요
          </p>
        </div>

        {/* 카테고리 */}
        <div className="px-4 mb-6">
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setSelectedTab(category.key)}
                className={`flex-shrink-0 px-4 py-2 rounded-full border transition-all duration-200 ${
                  selectedTab === category.key
                    ? 'bg-sky-500 text-white border-sky-500'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-sky-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <i className={`${category.icon} text-sm`}></i>
                  <span className="text-sm font-medium whitespace-nowrap">
                    {category.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 추천 코스 */}
        <div className="px-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">추천 문화 코스</h3>
            <button
              onClick={() => navigate('/course-list')}
              className="text-sky-500 text-sm font-medium"
            >
              전체보기
            </button>
          </div>

          <div className="space-y-4">
            {courses.map((course) => (
              <div
                key={course.id}
                onClick={() => navigate('/course-detail')}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                    <span className="text-xs font-medium text-gray-700">
                      {course.price}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-lg font-bold text-gray-800 flex-1 mr-2">
                      {course.title}
                    </h4>
                    <button className="w-8 h-8 flex items-center justify-center">
                      <i className="ri-heart-line text-gray-400 text-lg hover:text-red-5

00 transition-colors"></i>
                    </button>
                  </div>

                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full flex items-center justify-center">
                      <i className="ri-user-line text-white text-xs"></i>
                    </div>
                    <span className="text-sm text-gray-600">
                      {course.host} • {course.university}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-1">
                      <i className="ri-star-fill text-yellow-400 text-sm"></i>
                      <span className="text-sm font-medium text-gray-700">
                        {course.rating}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({course.reviews})
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <i className="ri-calendar-line text-gray-400 text-sm"></i>
                      <span className="text-sm text-gray-600">
                        {course.date}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {course.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-sky-50 text-sky-600 text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <i className="ri-global-line text-gray-400 text-sm"></i>
                      <span className="text-xs text-gray-500">
                        {course.languages.join(', ')}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/course-detail');
                      }}
                      className="bg-sky-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-sky-600 transition-colors"
                    >
                      매칭 요청
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="grid grid-cols-5 h-16">
          <button className="flex flex-col items-center justify-center space-y-1 text-sky-500">
            <i className="ri-home-fill text-lg"></i>
            <span className="text-xs font-medium">홈</span>
          </button>
          <button className="flex flex-col items-center justify-center space-y-1 text-gray-400">
            <i className="ri-map-pin-line text-lg"></i>
            <span className="text-xs">코스</span>
          </button>
          <button className="flex flex-col items-center justify-center space-y-1 text-gray-400">
            <i className="ri-heart-line text-lg"></i>
            <span className="text-xs">매칭</span>
          </button>
          <button className="flex flex-col items-center justify-center space-y-1 text-gray-400 relative">
            <i className="ri-message-line text-lg"></i>
            <span className="text-xs">채팅</span>
            <div className="absolute top-2 right-6 w-2 h-2 bg-red-500 rounded-full"></div>
          </button>
          <button className="flex flex-col items-center justify-center space-y-1 text-gray-400">
            <i className="ri-user-line text-lg"></i>
            <span className="text-xs">프로필</span>
          </button>
        </div>
      </div>
    </div>
  );
}

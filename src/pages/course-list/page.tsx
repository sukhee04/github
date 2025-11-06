import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CourseList() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  const categories = [
    { name: '전체', key: 'all', icon: 'ri-apps-line' },
    { name: '문화체험', key: 'culture', icon: 'ri-building-line' },
    { name: '음식', key: 'food', icon: 'ri-restaurant-line' },
    { name: '자연', key: 'nature', icon: 'ri-leaf-line' },
    { name: '쇼핑', key: 'shopping', icon: 'ri-shopping-bag-line' },
    { name: 'K-POP', key: 'kpop', icon: 'ri-music-line' }
  ];

  const sortOptions = [
    { name: '인기순', key: 'popular' },
    { name: '최신순', key: 'latest' },
    { name: '가격 낮은순', key: 'price-low' },
    { name: '가격 높은순', key: 'price-high' },
    { name: '평점순', key: 'rating' }
  ];

  const courses = [
    {
      id: 1,
      title: '경복궁과 북촌 한옥마을 투어',
      host: '김민지',
      university: '서울대학교',
      rating: 4.9,
      reviews: 23,
      price: '무료',
      image: 'https://readdy.ai/api/search-image?query=Beautiful%20traditional%20Korean%20palace%20Gyeongbokgung%20with%20colorful%20hanbok%20people%20walking%2C%20bright%20sunny%20day%2C%20cultural%20heritage%20site%2C%20vibrant%20colors%2C%20travel%20photography%20style%2C%20high%20quality%2C%20detailed%20architecture&width=300&height=200&seq=courselist1&orientation=landscape',
      tags: ['문화체험', '역사', '사진촬영'],
      languages: ['한국어', '영어'],
      date: '3월 15일',
      category: 'culture'
    },
    {
      id: 2,
      title: '홍대 야시장과 K-POP 체험',
      host: '박서준',
      university: '연세대학교',
      rating: 4.8,
      reviews: 31,
      price: '15,000원',
      image: 'https://readdy.ai/api/search-image?query=Vibrant%20Korean%20night%20market%20in%20Hongdae%20with%20colorful%20street%20food%20stalls%2C%20neon%20lights%2C%20young%20people%20enjoying%20food%2C%20lively%20atmosphere%2C%20urban%20nightlife%2C%20warm%20lighting%2C%20cultural%20experience&width=300&height=200&seq=courselist2&orientation=landscape',
      tags: ['음식', 'K-POP', '야시장'],
      languages: ['한국어', '영어', '중국어'],
      date: '3월 18일',
      category: 'kpop'
    },
    {
      id: 3,
      title: '제주도 올레길 트레킹',
      host: '이하늘',
      university: '제주대학교',
      rating: 5.0,
      reviews: 18,
      price: '25,000원',
      image: 'https://readdy.ai/api/search-image?query=Beautiful%20Jeju%20Island%20Olle%20trail%20with%20ocean%20view%2C%20green%20hills%2C%20walking%20path%2C%20clear%20blue%20sky%2C%20peaceful%20nature%20scenery%2C%20hiking%20adventure%2C%20Korean%20landscape%2C%20travel%20destination&width=300&height=200&seq=courselist3&orientation=landscape',
      tags: ['자연', '트레킹', '힐링'],
      languages: ['한국어', '영어'],
      date: '3월 22일',
      category: 'nature'
    },
    {
      id: 4,
      title: '부산 해운대와 감천문화마을',
      host: '최유진',
      university: '부산대학교',
      rating: 4.7,
      reviews: 27,
      price: '20,000원',
      image: 'https://readdy.ai/api/search-image?query=Colorful%20Gamcheon%20Culture%20Village%20in%20Busan%20with%20rainbow%20houses%20on%20hillside%2C%20artistic%20murals%2C%20coastal%20city%20view%2C%20bright%20sunny%20day%2C%20Korean%20cultural%20landmark%2C%20vibrant%20community%20art&width=300&height=200&seq=courselist4&orientation=landscape',
      tags: ['해변', '문화마을', '예술'],
      languages: ['한국어', '영어', '일본어'],
      date: '3월 25일',
      category: 'culture'
    },
    {
      id: 5,
      title: '명동 쇼핑과 한국 뷰티 체험',
      host: '정수아',
      university: '이화여자대학교',
      rating: 4.6,
      reviews: 19,
      price: '10,000원',
      image: 'https://readdy.ai/api/search-image?query=Busy%20Myeongdong%20shopping%20street%20in%20Seoul%20with%20Korean%20cosmetics%20stores%2C%20fashion%20shops%2C%20bright%20neon%20signs%2C%20crowded%20pedestrian%20area%2C%20modern%20urban%20shopping%20district%2C%20vibrant%20commercial%20area&width=300&height=200&seq=courselist5&orientation=landscape',
      tags: ['쇼핑', '뷰티', '패션'],
      languages: ['한국어', '영어', '중국어'],
      date: '3월 28일',
      category: 'shopping'
    },
    {
      id: 6,
      title: '한강 피크닉과 치킨 파티',
      host: '김태현',
      university: '고려대학교',
      rating: 4.5,
      reviews: 15,
      price: '18,000원',
      image: 'https://readdy.ai/api/search-image?query=Han%20River%20picnic%20in%20Seoul%20with%20people%20enjoying%20fried%20chicken%20and%20beer%2C%20beautiful%20river%20view%2C%20city%20skyline%20background%2C%20relaxing%20outdoor%20dining%2C%20Korean%20lifestyle%2C%20sunset%20atmosphere&width=300&height=200&seq=courselist6&orientation=landscape',
      tags: ['음식', '피크닉', '한강'],
      languages: ['한국어', '영어'],
      date: '3월 30일',
      category: 'food'
    }
  ];

  const filteredCourses = courses.filter(course => 
    selectedCategory === 'all' || course.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-50">
      {/* 상단 네비게이션 */}
      <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-sky-100 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={() => navigate(-1)}
            className="w-8 h-8 flex items-center justify-center"
          >
            <i className="ri-arrow-left-line text-gray-600 text-lg"></i>
          </button>
          <h1 className="text-lg font-bold text-gray-800">전체 코스</h1>
          <button className="w-8 h-8 flex items-center justify-center">
            <i className="ri-search-line text-gray-600 text-lg"></i>
          </button>
        </div>
      </div>

      <div className="pt-16 pb-20">
        {/* 필터 및 정렬 */}
        <div className="px-4 py-4 space-y-4">
          {/* 카테고리 필터 */}
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`flex-shrink-0 px-4 py-2 rounded-full border transition-all duration-200 ${
                  selectedCategory === category.key
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

          {/* 정렬 옵션 */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              총 {filteredCourses.length}개의 코스
            </span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.name}
                  </option>
                ))}
              </select>
              <i className="ri-arrow-down-s-line absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
            </div>
          </div>
        </div>

        {/* 코스 목록 */}
        <div className="px-4 space-y-4">
          {filteredCourses.map((course) => (
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
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    // 찜하기 로직
                  }}
                  className="absolute top-3 left-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center"
                >
                  <i className="ri-heart-line text-gray-600 text-lg hover:text-red-500 transition-colors"></i>
                </button>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-lg font-bold text-gray-800 flex-1 mr-2">
                    {course.title}
                  </h4>
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
                    자세히 보기
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="grid grid-cols-4 h-16">
          <button className="flex flex-col items-center justify-center space-y-1 text-sky-500">
            <i className="ri-map-pin-fill text-lg"></i>
            <span className="text-xs font-medium">코스</span>
          </button>
          <button className="flex flex-col items-center justify-center space-y-1 text-gray-400">
            <i className="ri-heart-line text-lg"></i>
            <span className="text-xs">매칭</span>
          </button>
          <button className="flex flex-col items-center justify-center space-y-1 text-gray-400">
            <i className="ri-message-line text-lg"></i>
            <span className="text-xs">채팅</span>
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
import { useState } from 'react';
import BottomNav from '../../components/BottomNav'; // ✅ 경로는 프로젝트 구조에 맞게 조정

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: '김민지',
    university: '서울대학교',
    userType: 'korean',
    email: 'minji.kim@snu.ac.kr',
    bio: '한국 문화를 사랑하는 서울대 학생입니다. 외국인 친구들과 함께 한국의 아름다운 문화를 나누고 싶어요!',
    languages: ['한국어', '영어', '중국어'],
    interests: ['문화체험', '역사', '음식', 'K-POP'],
    rating: 4.9,
    reviews: 23,
    coursesHosted: 12,
    friendsMade: 45
  });

  const availableLanguages = ['한국어', '영어', '중국어', '일본어', '스페인어', '프랑스어'];
  const availableInterests = ['문화체험', '음식', '쇼핑', 'K-POP', '역사', '자연', '예술', '스포츠'];

  const handleLanguageToggle = (language: string) => {
    setUserInfo(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setUserInfo(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log('Profile updated:', userInfo);
  };

  return (
    // ✅ pb-20 추가: 아래 BottomNav 때문에 내용이 가려지지 않도록 padding
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-50 pb-20">
      {/* 상단 네비게이션 */}
      <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-sky-100 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full flex items-center justify-center">
              <i className="ri-user-line text-white text-lg"></i>
            </div>
            <h1 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Pretendard, sans-serif' }}>
              프로필
            </h1>
          </div>
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="text-sky-500 text-sm font-medium"
          >
            {isEditing ? '저장' : '편집'}
          </button>
        </div>
      </div>

      <div className="pt-16 pb-20">
        {/* 프로필 헤더 */}
        <div className="px-4 py-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-20 h-20 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full flex items-center justify-center">
                <i className="ri-user-line text-white text-2xl"></i>
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={userInfo.name}
                      onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full text-xl font-bold text-gray-800 bg-gray-50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    <input
                      type="text"
                      value={userInfo.university}
                      onChange={(e) => setUserInfo(prev => ({ ...prev, university: e.target.value }))}
                      className="w-full text-gray-600 bg-gray-50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                ) : (
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{userInfo.name}</h2>
                    <p className="text-gray-600">{userInfo.university}</p>
                  </div>
                )}
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1">
                    <i className="ri-star-fill text-yellow-400 text-sm"></i>
                    <span className="text-sm font-medium text-gray-700">
                      {userInfo.rating}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({userInfo.reviews})
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    userInfo.userType === 'korean' 
                      ? 'bg-sky-100 text-sky-600'
                      : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    {userInfo.userType === 'korean' ? '한국 학생' : '유학생'}
                  </span>
                </div>
              </div>
            </div>

            {/* 통계 */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <div className="text-xl font-bold text-gray-800">{userInfo.coursesHosted}</div>
                <div className="text-xs text-gray-500">진행한 코스</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-800">{userInfo.friendsMade}</div>
                <div className="text-xs text-gray-500">만난 친구</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-800">{userInfo.reviews}</div>
                <div className="text-xs text-gray-500">받은 리뷰</div>
              </div>
            </div>
          </div>
        </div>

        {/* 자기소개 */}
        <div className="px-4 mb-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <h3 className="text-lg font-bold text-gray-800 mb-3">자기소개</h3>
            {isEditing ? (
              <textarea
                value={userInfo.bio}
                onChange={(e) => setUserInfo(prev => ({ ...prev, bio: e.target.value }))}
                className="w-full h-24 text-gray-700 bg-gray-50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                placeholder="자신을 소개해주세요"
                maxLength={200}
              />
            ) : (
              <p className="text-gray-700 leading-relaxed">{userInfo.bio}</p>
            )}
          </div>
        </div>

        {/* 언어 */}
        <div className="px-4 mb-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <h3 className="text-lg font-bold text-gray-800 mb-3">사용 가능한 언어</h3>
            {isEditing ? (
              <div className="flex flex-wrap gap-2">
                {availableLanguages.map((language) => (
                  <button
                    key={language}
                    type="button"
                    onClick={() => handleLanguageToggle(language)}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                      userInfo.languages.includes(language)
                        ? 'bg-sky-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {language}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {userInfo.languages.map((language) => (
                  <span
                    key={language}
                    className="px-3 py-2 bg-sky-50 text-sky-600 text-sm rounded-full"
                  >
                    {language}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 관심사 */}
        <div className="px-4 mb-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <h3 className="text-lg font-bold text-gray-800 mb-3">관심사</h3>
            {isEditing ? (
              <div className="flex flex-wrap gap-2">
                {availableInterests.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleInterestToggle(interest)}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                      userInfo.interests.includes(interest)
                        ? 'bg-sky-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {userInfo.interests.map((interest) => (
                  <span
                    key={interest}
                    className="px-3 py-2 bg-sky-50 text-sky-600 text-sm rounded-full"
                  >
                    #{interest}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 설정 메뉴 */}
        <div className="px-4 mb-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <i className="ri-notification-line text-gray-400 text-lg"></i>
                <span className="text-gray-800">알림 설정</span>
              </div>
              <i className="ri-arrow-right-s-line text-gray-400"></i>
            </button>
            
            <div className="border-t border-gray-100"></div>
            
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <i className="ri-shield-line text-gray-400 text-lg"></i>
                <span className="text-gray-800">개인정보 보호</span>
              </div>
              <i className="ri-arrow-right-s-line text-gray-400"></i>
            </button>
            
            <div className="border-t border-gray-100"></div>
            
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <i className="ri-question-line text-gray-400 text-lg"></i>
                <span className="text-gray-800">도움말</span>
              </div>
              <i className="ri-arrow-right-s-line text-gray-400"></i>
            </button>
            
            <div className="border-t border-gray-100"></div>
            
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <i className="ri-logout-circle-line text-red-400 text-lg"></i>
                <span className="text-red-600">로그아웃</span>
              </div>
              <i className="ri-arrow-right-s-line text-gray-400"></i>
            </button>
          </div>
        </div>
      </div>

      {/* ✅ 공통 하단 네비게이션 */}
      <BottomNav />
    </div>
  );
}

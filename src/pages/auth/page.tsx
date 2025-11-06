
import { useState } from 'react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<'korean' | 'international' | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    university: '',
    languages: [] as string[],
    interests: [] as string[]
  });

  const availableLanguages = ['한국어', '영어', '중국어', '일본어', '스페인어', '프랑스어'];
  const availableInterests = ['문화체험', '음식', '쇼핑', 'K-POP', '역사', '자연', '예술', '스포츠'];

  const handleLanguageToggle = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 로그인/회원가입 로직
    console.log('Form submitted:', { ...formData, userType });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-50">
      {/* 상단 네비게이션 */}
      <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-sky-100 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <button className="w-8 h-8 flex items-center justify-center">
            <i className="ri-arrow-left-line text-gray-600 text-lg"></i>
          </button>
          <h1 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Pretendard, sans-serif' }}>
            {isLogin ? '로그인' : '회원가입'}
          </h1>
          <div className="w-8"></div>
        </div>
      </div>

      <div className="pt-16 px-4 py-6">
        {/* 로고 및 환영 메시지 */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-global-line text-white text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Pretendard, sans-serif' }}>
            문화친구
          </h2>
          <p className="text-gray-600">
            {isLogin ? '다시 만나서 반가워요!' : '새로운 문화 친구들과 만나보세요'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 사용자 유형 선택 (회원가입 시에만) */}
          {!isLogin && !userType && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800 text-center mb-6">
                어떤 역할로 참여하시나요?
              </h3>
              
              <button
                type="button"
                onClick={() => setUserType('korean')}
                className="w-full p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-sky-300 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full flex items-center justify-center">
                    <i className="ri-user-star-line text-white text-xl"></i>
                  </div>
                  <div className="text-left">
                    <h4 className="text-lg font-bold text-gray-800">한국 학생</h4>
                    <p className="text-sm text-gray-600">문화 체험 코스를 제공하고 유학생들과 교류해요</p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setUserType('international')}
                className="w-full p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-sky-300 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                    <i className="ri-earth-line text-white text-xl"></i>
                  </div>
                  <div className="text-left">
                    <h4 className="text-lg font-bold text-gray-800">유학생</h4>
                    <p className="text-sm text-gray-600">한국 문화를 체험하고 현지 친구들과 만나요</p>
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* 기본 정보 입력 */}
          {(isLogin || userType) && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이메일
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="이메일을 입력하세요"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  비밀번호
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="비밀번호를 입력하세요"
                  required
                />
              </div>

              {!isLogin && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      이름
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="이름을 입력하세요"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      대학교
                    </label>
                    <input
                      type="text"
                      value={formData.university}
                      onChange={(e) => setFormData(prev => ({ ...prev, university: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="대학교를 입력하세요"
                      required
                    />
                  </div>

                  {/* 파일 업로드 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {userType === 'korean' ? '재학증명서' : '여권 사본'}
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-sky-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        id="document-upload"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            console.log('File selected:', file.name);
                          }
                        }}
                      />
                      <label htmlFor="document-upload" className="cursor-pointer">
                        <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <i className="ri-upload-cloud-line text-sky-500 text-xl"></i>
                        </div>
                        <p className="text-gray-600 text-sm mb-1">
                          {userType === 'korean' ? '재학증명서를 업로드하세요' : '여권 사본을 업로드하세요'}
                        </p>
                        <p className="text-gray-400 text-xs">
                          JPG, PNG, PDF 파일 (최대 5MB)
                        </p>
                      </label>
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
                          className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                            formData.languages.includes(language)
                              ? 'bg-sky-500 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {language}
                        </button>
                      ))}
                    </div>
                  </div>

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
                              ? 'bg-sky-500 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {interest}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full bg-sky-500 text-white py-3 rounded-xl font-medium hover:bg-sky-600 transition-colors mt-6"
              >
                {isLogin ? '로그인' : '회원가입'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setUserType(null);
                    setFormData({
                      email: '',
                      password: '',
                      name: '',
                      university: '',
                      languages: [],
                      interests: []
                    });
                  }}
                  className="text-sky-500 text-sm font-medium"
                >
                  {isLogin ? '계정이 없으신가요? 회원가입' : '이미 계정이 있으신가요? 로그인'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

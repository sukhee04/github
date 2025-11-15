
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CourseEdit() {
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState({
    title: '경복궁과 북촌 한옥마을 투어',
    description: '한국의 대표적인 궁궐인 경복궁과 전통 한옥마을인 북촌을 함께 둘러보는 문화 체험 투어입니다.',
    price: '무료',
    date: '2024-03-15',
    time: '14:00',
    location: '경복궁 정문',
    maxParticipants: '5',
    languages: ['한국어', '영어'],
    tags: ['문화체험', '역사', '사진촬영'],
    requirements: '편한 신발 착용 권장',
    itinerary: [
      { time: '14:00', activity: '경복궁 정문에서 만남' },
      { time: '14:30', activity: '경복궁 투어 및 수문장 교대식 관람' },
      { time: '15:30', activity: '북촌 한옥마을 산책' },
      { time: '16:30', activity: '한복 체험 및 사진 촬영' },
      { time: '17:00', activity: '투어 종료' }
    ]
  });

  const availableLanguages = ['한국어', '영어', '중국어', '일본어'];
  const availableTags = ['문화체험', '음식', '쇼핑', 'K-POP', '역사', '자연', '예술'];

  const handleLanguageToggle = (language: string) => {
    setCourseData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  const handleTagToggle = (tag: string) => {
    setCourseData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const addItineraryItem = () => {
    setCourseData(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, { time: '', activity: '' }]
    }));
  };

  const removeItineraryItem = (index: number) => {
    setCourseData(prev => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== index)
    }));
  };

  const updateItineraryItem = (index: number, field: 'time' | 'activity', value: string) => {
    setCourseData(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updated course:', courseData);
    navigate('/course-management');
  };

  const handleDelete = () => {
    if (window.confirm('정말로 이 코스를 삭제하시겠습니까?')) {
      console.log('Course deleted');
      navigate('/course-management');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-50">
      {/* 상단 네비게이션 */}
      <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-sky-100 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={() => navigate(-1)}
            className="text-gray-600"
          >
            취소
          </button>
          <h1 className="text-lg font-bold text-gray-800">코스 수정</h1>
          <button 
            onClick={handleSubmit}
            className="text-sky-500 font-medium"
          >
            저장
          </button>
        </div>
      </div>

      <div className="pt-16 pb-20">
        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              코스 제목
            </label>
            <input
              type="text"
              value={courseData.title}
              onChange={(e) => setCourseData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              코스 설명
            </label>
            <textarea
              value={courseData.description}
              onChange={(e) => setCourseData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 h-24 resize-none"
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
                value={courseData.date}
                onChange={(e) => setCourseData(prev => ({ ...prev, date: e.target.value }))}
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
                value={courseData.time}
                onChange={(e) => setCourseData(prev => ({ ...prev, time: e.target.value }))}
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
              value={courseData.location}
              onChange={(e) => setCourseData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                참가비
              </label>
              <input
                type="text"
                value={courseData.price}
                onChange={(e) => setCourseData(prev => ({ ...prev, price: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                최대 인원
              </label>
              <input
                type="number"
                value={courseData.maxParticipants}
                onChange={(e) => setCourseData(prev => ({ ...prev, maxParticipants: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
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
              {courseData.itinerary.map((item, index) => (
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
                  {courseData.itinerary.length > 1 && (
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
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                    courseData.languages.includes(language)
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
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                    courseData.tags.includes(tag)
                      ? 'bg-sky-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              참가 요건 (선택사항)
            </label>
            <textarea
              value={courseData.requirements}
              onChange={(e) => setCourseData(prev => ({ ...prev, requirements: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 h-20 resize-none"
              maxLength={200}
            />
          </div>

          {/* 삭제 버튼 */}
          <div className="pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleDelete}
              className="w-full bg-red-500 text-white py-3 rounded-xl font-medium hover:bg-red-600 transition-colors"
            >
              코스 삭제
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

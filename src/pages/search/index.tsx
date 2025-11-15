import { useState } from 'react';
import BottomNav from '../../components/BottomNav';

export default function SearchPage() {
  const [keyword, setKeyword] = useState('');

  // mock data
  const recentKeywords = ['경복궁 투어', '홍대 야시장', 'K-POP', '한강 피크닉'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('검색 키워드:', keyword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-50 pb-20">
      {/* 상단 네비게이션 + 검색바 */}
      <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-sky-100 z-50">
        <form onSubmit={handleSubmit} className="px-4 py-3 flex items-center space-x-2">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="코스, 지역, 호스트를 검색해보세요"
          />
          <button
            type="submit"
            className="w-9 h-9 rounded-full bg-sky-500 text-white flex items-center justify-center"
          >
            <i className="ri-search-line text-lg"></i>
          </button>
        </form>
      </div>

      <div className="pt-16 px-4">
        {/* 최근 검색어 */}
        <h2 className="text-sm font-bold text-gray-800 mb-2">최근 검색</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {recentKeywords.map((k) => (
            <button
              key={k}
              onClick={() => setKeyword(k)}
              className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs text-gray-600"
            >
              {k}
            </button>
          ))}
        </div>

        {/* 검색 결과 영역 (одоо бол placeholder) */}
        <div className="mt-4 text-sm text-gray-500">
          검색 결과가 여기에 표시됩니다.
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

import { useState } from 'react';

export default function Matching() {
  const [activeTab, setActiveTab] = useState('sent');
  const [sentRequests, setSentRequests] = useState([
    {
      id: 1,
      courseTitle: '경복궁과 북촌 한옥마을 투어',
      host: '김민지',
      university: '서울대학교',
      date: '3월 15일',
      status: 'pending',
      requestDate: '3월 10일',
      groupSize: 2
    },
    {
      id: 2,
      courseTitle: '홍대 야시장과 K-POP 체험',
      host: '박서준',
      university: '연세대학교',
      date: '3월 18일',
      status: 'accepted',
      requestDate: '3월 8일',
      groupSize: 1
    },
    {
      id: 3,
      courseTitle: '제주도 올레길 트레킹',
      host: '이하늘',
      university: '제주대학교',
      date: '3월 22일',
      status: 'rejected',
      requestDate: '3월 12일',
      groupSize: 3
    }
  ]);

  const matches = [
    {
      id: 1,
      courseTitle: '홍대 야시장과 K-POP 체험',
      host: '박서준',
      university: '연세대학교',
      date: '3월 18일',
      time: '오후 6시',
      location: '홍대입구역 9번 출구',
      participants: ['김유진', '리웨이', '사토시'],
      chatId: 'chat1'
    },
    {
      id: 2,
      courseTitle: '부산 해운대와 감천문화마을',
      host: '최유진',
      university: '부산대학교',
      date: '3월 25일',
      time: '오전 10시',
      location: '부산역 광장',
      participants: ['존스미스', '마리아'],
      chatId: 'chat2'
    }
  ];

  const handleCancelRequest = (requestId: number) => {
    if (window.confirm('정말로 매칭 요청을 취소하시겠습니까?')) {
      setSentRequests(prev => prev.filter(request => request.id !== requestId));
      alert('매칭 요청이 취소되었습니다.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-600';
      case 'accepted':
        return 'bg-green-100 text-green-600';
      case 'rejected':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '대기중';
      case 'accepted':
        return '수락됨';
      case 'rejected':
        return '거절됨';
      default:
        return '알 수 없음';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-50">
      {/* 상단 네비게이션 */}
      <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-sky-100 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full flex items-center justify-center">
              <i className="ri-heart-line text-white text-lg"></i>
            </div>
            <h1 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Pretendard, sans-serif' }}>
              매칭
            </h1>
          </div>
          <button className="w-8 h-8 flex items-center justify-center">
            <i className="ri-filter-line text-gray-600 text-lg"></i>
          </button>
        </div>
      </div>

      <div className="pt-16 pb-20">
        {/* 탭 메뉴 */}
        <div className="px-4 py-4">
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('sent')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'sent'
                  ? 'bg-white text-sky-600 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              보낸 요청
            </button>
            <button
              onClick={() => setActiveTab('matches')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'matches'
                  ? 'bg-white text-sky-600 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              매칭 완료
            </button>
          </div>
        </div>

        {/* 보낸 요청 탭 */}
        {activeTab === 'sent' && (
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
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
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
                    <span className="text-sm text-gray-600">코스 날짜: {request.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <i className="ri-group-line text-gray-400 text-sm"></i>
                    <span className="text-sm text-gray-600">신청 인원: {request.groupSize}명</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <i className="ri-time-line text-gray-400 text-sm"></i>
                    <span className="text-sm text-gray-600">신청일: {request.requestDate}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {request.status === 'pending' && (
                    <button 
                      onClick={() => handleCancelRequest(request.id)}
                      className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                    >
                      요청 취소
                    </button>
                  )}
                  {request.status === 'accepted' && (
                    <button className="flex-1 bg-sky-500 text-white py-2 rounded-lg text-sm font-medium">
                      채팅하기
                    </button>
                  )}
                  <button className="flex-1 bg-gray-50 text-gray-600 py-2 rounded-lg text-sm font-medium">
                    상세보기
                  </button>
                </div>
              </div>
            ))}
            
            {sentRequests.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-send-plane-line text-gray-400 text-2xl"></i>
                </div>
                <p className="text-gray-500">보낸 매칭 요청이 없습니다</p>
              </div>
            )}
          </div>
        )}

        {/* 매칭 완료 탭 */}
        {activeTab === 'matches' && (
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
                  <button className="flex-1 bg-sky-500 text-white py-2 rounded-lg text-sm font-medium">
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

      {/* 하단 네비게이션 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="grid grid-cols-4 h-16">
          <button className="flex flex-col items-center justify-center space-y-1 text-gray-400">
            <i className="ri-map-pin-line text-lg"></i>
            <span className="text-xs">코스</span>
          </button>
          <button className="flex flex-col items-center justify-center space-y-1 text-sky-500">
            <i className="ri-heart-fill text-lg"></i>
            <span className="text-xs font-medium">매칭</span>
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


import { useState } from 'react';

export default function Chat() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');

  const chatList = [
    {
      id: 1,
      type: 'group',
      title: '홍대 야시장 투어 그룹',
      lastMessage: '내일 6시에 홍대입구역에서 만나요!',
      lastTime: '오후 3:24',
      unread: 2,
      participants: ['박서준', '김유진', '리웨이', '사토시'],
      avatar: 'group'
    },
    {
      id: 2,
      type: 'private',
      title: '김민지',
      subtitle: '서울대학교',
      lastMessage: '경복궁 투어 관련해서 질문이 있어요',
      lastTime: '오후 1:15',
      unread: 0,
      avatar: 'user'
    },
    {
      id: 3,
      type: 'group',
      title: '부산 문화마을 탐방',
      lastMessage: '사진 정말 예쁘게 나왔네요!',
      lastTime: '오전 11:30',
      unread: 5,
      participants: ['최유진', '존스미스', '마리아'],
      avatar: 'group'
    },
    {
      id: 4,
      type: 'private',
      title: '이하늘',
      subtitle: '제주대학교',
      lastMessage: '제주도 날씨가 정말 좋네요',
      lastTime: '어제',
      unread: 0,
      avatar: 'user'
    }
  ];

  const messages = [
    {
      id: 1,
      sender: '박서준',
      message: '안녕하세요! 내일 홍대 야시장 투어 정말 기대돼요 😊',
      time: '오후 2:30',
      isMe: false
    },
    {
      id: 2,
      sender: '김유진',
      message: '저도요! 한국 음식 정말 많이 먹어보고 싶어요',
      time: '오후 2:32',
      isMe: false
    },
    {
      id: 3,
      sender: '나',
      message: '네! 맛있는 곳들 많이 준비했어요. 떡볶이, 호떡, 타코야키 등등 다양하게 먹어볼 수 있을 거예요',
      time: '오후 2:35',
      isMe: true
    },
    {
      id: 4,
      sender: '리웨이',
      message: '와! 정말 기대돼요. 그리고 K-POP 관련 상품도 볼 수 있나요?',
      time: '오후 2:40',
      isMe: false
    },
    {
      id: 5,
      sender: '나',
      message: '물론이죠! 홍대에는 K-POP 굿즈샵도 많고, 버스킹 공연도 볼 수 있어요',
      time: '오후 2:42',
      isMe: true
    },
    {
      id: 6,
      sender: '사토시',
      message: '혹시 늦을 수도 있는데 괜찮을까요? 😅',
      time: '오후 3:10',
      isMe: false
    },
    {
      id: 7,
      sender: '나',
      message: '괜찮아요! 연락만 주세요. 내일 6시에 홍대입구역 9번 출구에서 만나요!',
      time: '오후 3:24',
      isMe: true
    }
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  if (selectedChat) {
    const chat = chatList.find(c => c.id === selectedChat);
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-50 flex flex-col">
        {/* 채팅 헤더 */}
        <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-sky-100 z-50">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setSelectedChat(null)}
                className="w-8 h-8 flex items-center justify-center"
              >
                <i className="ri-arrow-left-line text-gray-600 text-lg"></i>
              </button>
              <div className="flex items-center space-x-3">
                {chat?.type === 'group' ? (
                  <div className="w-10 h-10 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full flex items-center justify-center">
                    <i className="ri-group-line text-white text-lg"></i>
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                    <i className="ri-user-line text-white text-lg"></i>
                  </div>
                )}
                <div>
                  <h1 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Pretendard, sans-serif' }}>
                    {chat?.title}
                  </h1>
                  {chat?.type === 'group' && (
                    <p className="text-xs text-gray-500">
                      {chat.participants.length}명 참여중
                    </p>
                  )}
                  {chat?.type === 'private' && chat.subtitle && (
                    <p className="text-xs text-gray-500">{chat.subtitle}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="w-8 h-8 flex items-center justify-center">
                <i className="ri-phone-line text-gray-600 text-lg"></i>
              </button>
              <button className="w-8 h-8 flex items-center justify-center">
                <i className="ri-more-line text-gray-600 text-lg"></i>
              </button>
            </div>
          </div>
        </div>

        {/* 메시지 영역 */}
        <div className="flex-1 pt-16 pb-20 px-4 py-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${message.isMe ? 'order-2' : 'order-1'}`}>
                  {!message.isMe && (
                    <p className="text-xs text-gray-500 mb-1 px-3">
                      {message.sender}
                    </p>
                  )}
                  <div
                    className={`px-4 py-3 rounded-2xl ${
                      message.isMe
                        ? 'bg-sky-500 text-white rounded-br-md'
                        : 'bg-white text-gray-800 rounded-bl-md border border-gray-100'
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                  </div>
                  <p className={`text-xs text-gray-400 mt-1 px-3 ${message.isMe ? 'text-right' : 'text-left'}`}>
                    {message.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 메시지 입력 */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
            <button
              type="button"
              className="w-8 h-8 flex items-center justify-center text-gray-400"
            >
              <i className="ri-add-line text-lg"></i>
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white border-none text-sm"
                placeholder="메시지를 입력하세요..."
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 flex items-center justify-center text-gray-400"
              >
                <i className="ri-emotion-line text-lg"></i>
              </button>
            </div>
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                newMessage.trim()
                  ? 'bg-sky-500 text-white'
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              <i className="ri-send-plane-fill text-lg"></i>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-50">
      {/* 상단 네비게이션 */}
      <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-sky-100 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full flex items-center justify-center">
              <i className="ri-message-line text-white text-lg"></i>
            </div>
            <h1 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Pretendard, sans-serif' }}>
              채팅
            </h1>
          </div>
          <button className="w-8 h-8 flex items-center justify-center">
            <i className="ri-search-line text-gray-600 text-lg"></i>
          </button>
        </div>
      </div>

      <div className="pt-16 pb-20">
        {/* 채팅 목록 */}
        <div className="px-4 py-4">
          <div className="space-y-2">
            {chatList.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow text-left"
              >
                <div className="flex items-center space-x-3">
                  {chat.type === 'group' ? (
                    <div className="w-12 h-12 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full flex items-center justify-center">
                      <i className="ri-group-line text-white text-lg"></i>
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                      <i className="ri-user-line text-white text-lg"></i>
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-gray-800 truncate">
                        {chat.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">
                          {chat.lastTime}
                        </span>
                        {chat.unread > 0 && (
                          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-xs text-white font-medium">
                              {chat.unread}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {chat.subtitle && (
                      <p className="text-xs text-gray-500 mb-1">{chat.subtitle}</p>
                    )}
                    
                    <p className="text-sm text-gray-600 truncate">
                      {chat.lastMessage}
                    </p>
                    
                    {chat.type === 'group' && chat.participants && (
                      <div className="flex items-center space-x-1 mt-2">
                        <i className="ri-group-line text-gray-400 text-xs"></i>
                        <span className="text-xs text-gray-500">
                          {chat.participants.length}명
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="grid grid-cols-4 h-16">
          <button className="flex flex-col items-center justify-center space-y-1 text-gray-400">
            <i className="ri-map-pin-line text-lg"></i>
            <span className="text-xs">코스</span>
          </button>
          <button className="flex flex-col items-center justify-center space-y-1 text-gray-400">
            <i className="ri-heart-line text-lg"></i>
            <span className="text-xs">매칭</span>
          </button>
          <button className="flex flex-col items-center justify-center space-y-1 text-sky-500 relative">
            <i className="ri-message-fill text-lg"></i>
            <span className="text-xs font-medium">채팅</span>
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

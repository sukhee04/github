import BottomNav from '../../components/BottomNav';

export default function NotificationPage() {
  const notifications = [
    {
      id: 1,
      type: 'match',
      title: '매칭 요청이 수락되었어요 🎉',
      message: '홍대 야시장 투어에서 박서준 님이 매칭을 수락했습니다.',
      time: '오늘 • 오후 3:30'
    },
    {
      id: 2,
      type: 'review',
      title: '후기를 작성해 주세요 ✏️',
      message: '경복궁과 북촌 한옥마을 투어 후기를 남겨보세요.',
      time: '오늘 • 오후 1:10'
    },
    {
      id: 3,
      type: 'system',
      title: '안전 가이드 안내',
      message: '첫 만남은 항상 사람 많은 공공장소에서 만나는 것을 추천합니다.',
      time: '어제 • 오후 6:00'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-50 pb-20">
      {/* 상단 네비게이션 */}
      <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-sky-100 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold text-gray-800">알림</h1>
          {/* 필요하면 설정 아이콘 등 추가 가능 */}
        </div>
      </div>

      <div className="pt-16 px-4 space-y-3">
        {notifications.map(n => (
          <div
            key={n.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
          >
            <h3 className="text-sm font-bold text-gray-800 mb-1">
              {n.title}
            </h3>
            <p className="text-sm text-gray-600 mb-1">
              {n.message}
            </p>
            <p className="text-xs text-gray-400">
              {n.time}
            </p>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}

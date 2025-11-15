// src/components/BottomNav.tsx
import { useNavigate, useLocation } from "react-router-dom";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { label: "홈", path: "/", icon: "ri-home-5-line" },
    { label: "코스", path: "/course-list", icon: "ri-map-pin-line" },
    { label: "매칭", path: "/matching", icon: "ri-heart-3-line" },
    { label: "채팅", path: "/chat", icon: "ri-message-line" },
    { label: "프로필", path: "/profile", icon: "ri-user-line" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="grid grid-cols-5 h-16">
        {tabs.map((tab) => {
          // 지금 주소(location.pathname)와 tab.path 비교해서 active 여부 결정
          const isActive =
            tab.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(tab.path);

          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)} // ✅ 어느 페이지에서든 누르면 이동
              className={`flex flex-col items-center justify-center space-y-1 ${
                isActive ? "text-sky-500" : "text-gray-400"
              }`}
            >
              <i className={`${tab.icon} text-lg`}></i>
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
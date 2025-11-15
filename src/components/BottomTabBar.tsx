// src/components/BottomTabBar.tsx
import { useNavigate, useLocation } from "react-router-dom";

export default function BottomTabBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { label: "홈", path: "/", icon: "ri-home-5-line" },
    { label: "코스", path: "/courses", icon: "ri-map-pin-line" },
    { label: "매칭", path: "/matches", icon: "ri-heart-3-line" },
    { label: "채팅", path: "/chats", icon: "ri-chat-3-line" },
    { label: "프로필", path: "/profile", icon: "ri-user-3-line" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 z-50">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;

        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center text-xs ${
              isActive ? "text-sky-500" : "text-gray-400"
            }`}
          >
            <i className={`${tab.icon} text-xl mb-1`} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
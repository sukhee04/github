import { useNavigate, useLocation } from "react-router-dom";

export default function KoBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { label: "코스", path: "/course-management", icon: "ri-map-pin-line" },
    // { label: "매칭", path: "/ko/matching", icon: "ri-heart-3-line" },
    { label: "채팅", path: "/ko/chat", icon: "ri-message-line" },
    { label: "프로필", path: "/ko/profile", icon: "ri-user-line" },
  ];

  const isActivePath = (currentPath: string, tabPath: string): boolean => {
    if (tabPath === "/") return currentPath === "/";
    return currentPath.startsWith(tabPath);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="grid grid-cols-3 h-16">
        {tabs.map((tab) => {
          const isActive = isActivePath(location.pathname, tab.path);

          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors ${isActive ? "text-sky-500" : "text-gray-400"
                }`}
            >
              <i className={`${tab.icon} text-xl`} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

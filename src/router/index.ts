// src/router/index.ts
import { useEffect } from "react";
import {
  useNavigate,
  useRoutes,
  type NavigateFunction,
} from "react-router-dom";
import routes from "./config";

// navigatePromise-д resolve хийх функц (Optional болголоо)
let navigateResolver: ((navigate: NavigateFunction) => void) | null = null;

declare global {
  interface Window {
    REACT_APP_NAVIGATE: NavigateFunction;
  }
}

// 앱 어디서 ч ашиглаж болох global navigate Promise
export const navigatePromise = new Promise<NavigateFunction>((resolve) => {
  navigateResolver = resolve;
});

export function AppRoutes() {
  const element = useRoutes(routes);
  const navigate = useNavigate();

  useEffect(() => {
    // window дээр global navigate хадгална
    window.REACT_APP_NAVIGATE = navigate;

    // Promise-ийн resolve-ийг 실제 navigate-ээр дуудна
    if (navigateResolver) {
      navigateResolver(navigate);
      // 필요하면 한 번 쓴 후 null болгож болно
      // navigateResolver = null;
    }
  }, [navigate]); // ✅ dependency зааж өгч нэг удаа / navigate өөрчлөгдөхөд л ажиллуулна

  return element;
}
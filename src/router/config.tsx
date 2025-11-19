import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

const Home = lazy(() => import('../pages/home/page'));
const Auth = lazy(() => import('../pages/auth/page'));
const CourseManagement = lazy(() => import('../pages/ko/course-management/page'));
const CourseDetail = lazy(() => import('../pages/course-detail/page'));
const CourseList = lazy(() => import('../pages/course-list/page'));
const CourseEdit = lazy(() => import('../pages/ko/course-edit/page'));
const Matching = lazy(() => import('../pages/matching/page'));
const Chat = lazy(() => import('../pages/chat/page'));
const Profile = lazy(() => import('../pages/profile/page'));
const NotFound = lazy(() => import('../pages/NotFound'));

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/auth',
    element: <Auth />
  },
  {
    path: '/course-management',
    element: <CourseManagement />
  },
  {
    path: '/course-detail',
    element: <CourseDetail />
  },
  {
    path: '/course-list',
    element: <CourseList />
  },
  {
    path: '/course-edit',
    element: <CourseEdit />
  },
  {
    path: '/matching',
    element: <Matching />
  },
  {
    path: '/ko/matching',
    element: <KoMatching />
  },
  {
    path: '/chat',
    element: <Chat />
  },
    {
    path: '/ko/chat',
    element: <KoChat />
  },
  {
    path: '/profile',
    element: <Profile />
  },
  {
    path: '/ko/profile',
    element: <KoProfile />
  },


  // 404
  {
    path: '*',
    element: <NotFound />
  }
];

export default routes;
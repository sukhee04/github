import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

const Home = lazy(() => import('../pages/home/page'));
const Auth = lazy(() => import('../pages/auth/page'));
const CourseManagement = lazy(() => import('../pages/course-management/page'));
const CourseDetail = lazy(() => import('../pages/course-detail/page'));
const CourseList = lazy(() => import('../pages/course-list/page'));
const CourseEdit = lazy(() => import('../pages/course-edit/page'));
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
    path: '/chat',
    element: <Chat />
  },
  {
    path: '/profile',
    element: <Profile />
  },


  // 404
  {
    path: '*',
    element: <NotFound />
  }
];

export default routes;
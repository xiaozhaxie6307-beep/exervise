import { Navigate, useRoutes } from 'react-router-dom';

import AuthPage from '@/pages/auth';
import { Sidebar } from '@/pages/menu';
import MovieCinema from '@/pages/movie-cinema';

const hasSession = () => {
  const refreshToken = localStorage.getItem('refreshToken');
  return Boolean(refreshToken && refreshToken !== '');
};

function ProtectedRoute({ children }: { children: JSX.Element }) {
  if (!hasSession()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function PublicRoute({ children }: { children: JSX.Element }) {
  if (hasSession()) {
    return <Navigate to="/index" replace />;
  }

  return children;
}

function MyRoutes() {
  const getRoutes = useRoutes([
    {
      path: '/',
      element: <Navigate to={hasSession() ? '/index' : '/login'} replace />,
    },
    {
      path: '/login',
      element: (
        <PublicRoute>
          <AuthPage mode="login" />
        </PublicRoute>
      ),
    },
    {
      path: '/register',
      element: (
        <PublicRoute>
          <AuthPage mode="register" />
        </PublicRoute>
      ),
    },
    {
      path: '/movie-demo',
      element: <MovieCinema />,
    },
    {
      path: '/index',
      element: (
        <ProtectedRoute>
          <Sidebar />
        </ProtectedRoute>
      ),
    },
    {
      path: '/404',
      element: <div>路径错误，用户未登录或权限不足</div>,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return <>{getRoutes}</>;
}

export default MyRoutes;

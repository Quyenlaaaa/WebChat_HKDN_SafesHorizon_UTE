import './App.css';
import Dashboard from './modules/Home';
import Form from './modules/Forms'; 
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, auth = false }) => {
  const isLoggedIn = localStorage.getItem('user:token') !== null;
  const location = useLocation();

  // Nếu cần quyền truy cập nhưng người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
  if (!isLoggedIn && auth) {
    return <Navigate to='/users/sign_in' />;
  }

  /* Nếu người dùng đã đăng nhập và cố vào trang đăng nhập/đăng ký/quên mật khẩu, chuyển hướng đến trang chính
  if (isLoggedIn && ['/users/sign_in', '/users/sign_up', '/forgot_password'].includes(location.pathname)) {
    return <Navigate to='/home' />;
  }*/

  return children;
};

function App() {
  return (
    <Routes>
      <Route
        path='/home'
        element={
          <ProtectedRoute auth={true}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path='/users/sign_in'
        element={
          <ProtectedRoute>
            <Form isSignInPage={true} isForgotPasswordPage={false} />
          </ProtectedRoute>
        }
      />
      <Route
        path='/users/sign_up'
        element={
          <ProtectedRoute>
            <Form isSignInPage={false} isForgotPasswordPage={false} />
          </ProtectedRoute>
        }
      />
      <Route
        path='/forgot_password'
        element={
          <ProtectedRoute>
            <Form isSignInPage={false} isForgotPasswordPage={true} />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;

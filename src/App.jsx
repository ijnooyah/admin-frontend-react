import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import UserListPage from './pages/UserListPage';
import MainLayout from './components/MainLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* /login 주소로 오면 LoginPage 컴포넌트를 보여줘라! */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* 공통 레이아웃(Header 포함)이 필요한 페이지들 */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<h1>로그인 성공 후 들어오는 메인 화면</h1>} />
          <Route path="/users" element={<UserListPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
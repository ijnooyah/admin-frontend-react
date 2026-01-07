import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import UserListPage from './pages/UserListPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* /login 주소로 오면 LoginPage 컴포넌트를 보여줘라! */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* 홈 주소로 오면 임시로 성공 메시지만 띄움 */}
        <Route path="/" element={<h1>로그인 성공 후 들어오는 메인 화면</h1>} />
        // src/App.jsx
        <Route path="/users" element={<UserListPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import { Avatar, Space, Button, Typography } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const { Text } = Typography;

const Header = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();         // Zustand & LocalStorage 비우기
    navigate('/login'); // 로그인 페이지로 튕기기
  };

  // 유저 정보 없으면 아무것도 안 그림 (로그인 페이지 등에서 헤더 안 보임)
  if (!user) return null; 

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'flex-end', 
      padding: '0 24px',
      height: '64px',
      alignItems: 'center',
      background: '#fff',
      boxShadow: '0 2px 8px #f0f1f2',
      position: 'sticky',
      top: 0,
      zIndex: 1
    }}>
      <Space size="middle">
        <Avatar src={user.profileImageUrl} icon={<UserOutlined />} />
        <Text><b>{user.nickname}</b> 관리자님</Text>
        <Button 
          type="default" 
          icon={<LogoutOutlined />} 
          onClick={handleLogout}
          size="small"
        >
          로그아웃
        </Button>
      </Space>
    </div>
  );
};

export default Header;
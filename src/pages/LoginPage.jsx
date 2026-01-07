import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../store/useAuthStore'; // Zustand 스토어 임포트

const { Title } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login); // Zustand의 login 함수

  // Ant Design Form의 성공 핸들러
  const onFinish = async (values) => {
    setLoading(true);
    try {
      // 1. 백엔드 로그인 API 호출
      // 세션 쿠키를 위해 { withCredentials: true } 필수
      const res = await axios.post('http://localhost:8080/api/v1/auth/login', values, {
        withCredentials: true,
      });

      // 2. 응답 데이터(UserResponse) 추출
      const userData = res.data.body;

      // 3. Zustand 창고에 유저 정보 저장 (persist 덕분에 로컬스토리지에도 저장됨)
      login(userData);

      // 4. 성공 알림 및 페이지 이동
      message.success(`${userData.nickname}님, 환영합니다!`);
      navigate('/users'); // 유저 목록 페이지로 이동
    } catch (error) {
      console.error('Login Error:', error);
      // 백엔드 에러 메시지가 있다면 표시, 없으면 기본 메시지
      const errorMsg = error.response?.data?.message || '로그인에 실패했습니다. 이메일과 비밀번호를 확인하세요.';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      backgroundColor: '#f0f2f5' 
    }}>
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <Title level={2}>Admin Login</Title>
        </div>

        <Form
          name="login_form"
          initialValues={{ remember: true }}
          onFinish={onFinish} // 폼 제출 시 실행
          size="large"
        >
          {/* 이메일 입력창 */}
          <Form.Item
            name="email"
            rules={[{ required: true, message: '이메일를 입력해주세요' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="이메일" />
          </Form.Item>

          {/* 비밀번호 입력창 */}
          <Form.Item
            name="password"
            rules={[{ required: true, message: '비밀번호를 입력해주세요' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="비밀번호" />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              style={{ width: '100%' }} 
              loading={loading}
            >
              로그인
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
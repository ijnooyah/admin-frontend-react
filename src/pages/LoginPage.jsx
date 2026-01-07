import { useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // 페이지 이동을 위한 도구 (redirect 역할)

  const onFinish = (values) => {
    setLoading(true);
    axios.post('http://localhost:8080/api/v1/auth/login', {
      email: values.email,
      password: values.password
    }, { withCredentials: true })
    .then(res => {
      message.success("로그인 성공!");
      navigate("/"); // 로그인 성공 시 홈으로 이동
    })
    .catch(err => {
      message.error("로그인 실패");
    })
    .finally(() => setLoading(false));
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
      <Card title="Admin Login" style={{ width: 400 }}>
        <Form name="login" onFinish={onFinish}>
          <Form.Item name="email" rules={[{ required: true, message: '이메일을 입력하세요' }]}>
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '비밀번호를 입력하세요' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>로그인</Button>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
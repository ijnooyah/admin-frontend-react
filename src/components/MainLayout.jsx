import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom'; // 👈 1. Outlet 임포트 확인
import AppHeader from './Header';

const { Content, Footer } = Layout;

const MainLayout = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppHeader /> 

      <Content style={{ padding: '0 50px', marginTop: 24 }}>
        <div style={{ background: '#fff', padding: 24, minHeight: 380 }}>
          <Outlet /> 
        </div>
      </Content>

      <Footer style={{ textAlign: 'center' }}>Admin Project ©2026 Created by Yoonji</Footer>
    </Layout>
  );
};

export default MainLayout;
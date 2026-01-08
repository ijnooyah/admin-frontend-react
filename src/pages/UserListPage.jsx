import React, { useState, useEffect } from 'react';
import { Table, Input, Select, Button, Space, Card, Tag, Typography } from 'antd';
import { SearchOutlined, ReloadOutlined, SortAscendingOutlined } from '@ant-design/icons';
import axios from '../api/axios';

const { Text } = Typography;

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [params, setParams] = useState({
    searchType: 'ALL',
    searchInput: '',
    roles: [],
    providers: [],
    size: 10,
    sortType: 'CREATED_AT',
    order: 'ASC'
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/v1/admin/users/search', { params });
      setUsers(res.data.body.users);
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = () => fetchUsers();

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '이메일', dataIndex: 'email', key: 'email' },
    { title: '닉네임', dataIndex: 'nickname', key: 'nickname' },
    {
      title: '권한',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles) => (
        <Space size={[0, 4]} wrap>
          {roles.map(role => (
            <Tag color={role === 'ROLE_ADMIN' ? 'volcano' : 'blue'} key={role}>{role}</Tag>
          ))}
        </Space>
      ),
    },
    { title: '제공자', dataIndex: 'provider', key: 'provider' },
    { 
      title: '가입일', 
      dataIndex: 'createdAt', 
      key: 'createdAt',
      render: (text) => text.split('T')[0]
    },
  ];

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="middle">
      <Card size="small" title="사용자 필터 및 정렬">
        <Space wrap>
          {/* --- 검색 조건 영역 --- */}
          <Select 
            value={params.searchType} 
            style={{ width: 100 }}
            onChange={(val) => setParams({...params, searchType: val})}
            options={[
              { value: 'ALL', label: '전체' },
              { value: 'EMAIL', label: '이메일' },
              { value: 'NICKNAME', label: '닉네임' }
            ]}
          />
          <Input 
            placeholder="검색어" 
            style={{ width: 150 }}
            value={params.searchInput}
            onChange={(e) => setParams({...params, searchInput: e.target.value})}
            onPressEnter={handleSearch} 
          />

          {/* --- 다중 선택 영역 --- */}
          <Select
            mode="multiple"
            placeholder="권한 선택"
            style={{ minWidth: 180 }}
            value={params.roles}
            onChange={(vals) => setParams({...params, roles: vals})}
            options={[
              { value: 'ROLE_USER', label: '유저' },
              { value: 'ROLE_MANAGER', label: '매니저' }, 
              { value: 'ROLE_ADMIN', label: '관리자' }
            ]}
          />
          <Select
            mode="multiple"
            placeholder="가입 경로"
            style={{ minWidth: 150 }}
            value={params.providers}
            onChange={(vals) => setParams({...params, providers: vals})}
            options={[
              { value: 'LOCAL', label: '로컬' },
              { value: 'GOOGLE', label: '구글' },
              { value: 'NAVER', label: '네이버' }
            ]}
          />

          {/* --- 정렬 영역 --- */}
          <Select
            value={params.sortType}
            style={{ width: 120 }}
            onChange={(val) => setParams({...params, sortType: val})}
            options={[
              { value: 'CREATED_AT', label: '가입일순' },
              { value: 'EMAIL', label: '이메일순' }
            ]}
          />
          <Select
            value={params.order}
            style={{ width: 100 }}
            onChange={(val) => setParams({...params, order: val})}
            options={[
              { value: 'ASC', label: '오름차순' },
              { value: 'DESC', label: '내림차순' }
            ]}
          />

          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch} loading={loading}>
            검색
          </Button>
          <Button icon={<ReloadOutlined />} onClick={() => window.location.reload()}>
            초기화
          </Button>
        </Space>
      </Card>

      <Table dataSource={users} columns={columns} rowKey="id" loading={loading} pagination={false} />
    </Space>
  );
};

export default UserListPage;
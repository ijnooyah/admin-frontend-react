import React, { useState, useEffect } from 'react';
import { Table, Input, Select, Button, Space, Card, Tag } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import axios from '../api/axios'; 

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // 
  const [params, setParams] = useState({
    searchType: 'ALL',
    searchInput: '',
    roles: [],      
    size: 10,
    sortType: 'CREATED_AT',
    order: 'DESC'
  });

  //데이터를 가져오는 함수
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

  // 처음 로딩 시 실행
  useEffect(() => {
    fetchUsers();
  }, []);

  // 검색 버튼 클릭 시 실행
  const handleSearch = () => {
    fetchUsers();
  };

  // 테이블 컬럼 정의 (표의 헤더 설정)
  const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: '이메일', dataIndex: 'email', key: 'email' },
        { title: '닉네임', dataIndex: 'nickname', key: 'nickname' },
        {
            title: '권한',
            dataIndex: 'roles',
            key: 'roles',
            // 자바의 List<String>을 리액트에서 Tag로 변환하는 로직
            render: (roles) => (
            <>
                {roles.map(role => (
                <Tag color={role === 'ROLE_ADMIN' ? 'volcano' : 'blue'} key={role}>
                    {role}
                </Tag>
                ))}
            </>
            ),
        },
        { title: '제공자', dataIndex: 'provider', key: 'provider' },
        { 
            title: '가입일', 
            dataIndex: 'createdAt', 
            key: 'createdAt',
            render: (text) => text.split('T')[0] // 'YYYY-MM-DD' 처럼 날짜만 나오게 자름
        },
    ];

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="middle">
      <Card size="small" title="사용자 필터링">
        <Space wrap>
          {/* 검색 타입 선택 */}
          <Select 
            value={params.searchType} 
            style={{ width: 120 }}
            onChange={(val) => setParams({...params, searchType: val})}
            options={[
              { value: 'ALL', label: '전체' },
              { value: 'EMAIL', label: '이메일' },
              { value: 'NICKNAME', label: '닉네임' }
            ]}
          />

          {/* 검색어 입력 */}
          <Input 
            placeholder="검색어 입력" 
            style={{ width: 200 }}
            value={params.searchInput}
            onChange={(e) => setParams({...params, searchInput: e.target.value})}
            onPressEnter={handleSearch} 
          />

          {/* 권한 다중 선택 */}
          <Select
            mode="multiple"
            placeholder="권한 선택"
            style={{ minWidth: 200 }}
            value={params.roles}
            onChange={(vals) => setParams({...params, roles: vals})}
            options={[
                { value: 'ROLE_USER', label: '일반 유저' },
                { value: 'ROLE_MANAGER', label: '매니저' }, 
                { value: 'ROLE_ADMIN', label: '관리자' }
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

      <Table 
        dataSource={users} 
        columns={columns} 
        rowKey="id" 
        loading={loading}
        pagination={false} 
      />
    </Space>
  );
};

export default UserListPage;
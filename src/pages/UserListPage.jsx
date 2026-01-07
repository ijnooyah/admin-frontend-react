import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Table, Button, Space, Card, message, Tag } from 'antd';

const UserListPage = () => {
  const [users, setUsers] = useState([]); // 서버에서 받은 유저 리스트 (List<UserDTO>)
  const [loading, setLoading] = useState(false);
  const [lastId, setLastId] = useState(null); // 커서 페이징을 위한 마지막 ID 저장
  const [hasNext, setHasNext] = useState(false);
  
  // 유저 데이터를 가져오는 함수
  const fetchUsers = (cursorId = null) => {
    setLoading(true);

    // 1. 백엔드 DTO(AdminUserSearchCondition) 구조와 똑같이 객체를 만듭니다.
    const searchCondition = {
        cursorId: cursorId,             // 커서 ID
        size: 10,                       // 한 번에 가져올 사이즈
        searchInput: "",                // 검색어 (나중에 input과 연결)
        searchType: "ALL",              // 검색 타입
        sortType: "CREATED_AT",         // 정렬 기준
        order: "ASC",                   // 정렬 방향
        // 리스트(roles, providers)는 배열로 보내면 스프링이 알아서 List로 받는다
        roles: ["ROLE_USER", "ROLE_ADMIN"], 
        providers: ["LOCAL", "GOOGLE"]
    };

    axios.get('http://localhost:8080/api/v1/admin/users/search', {
        params: searchCondition,        // 여기서 객체를 통째로 넘긴다
        withCredentials: true
    })
    .then(res => {
        const responseBody = res.data.body; // CommonResponse의 body 접근
        if (responseBody) {
        const newUsers = responseBody.users || [];
        
        if (cursorId) {
            setUsers(prev => [...prev, ...newUsers]);
        } else {
            setUsers(newUsers);
        }

        // 백엔드가 준 데이터를 상태에 저장
        setLastId(responseBody.nextCursorId);
        setHasNext(responseBody.hasNext); // 여기서 true/false 저장
        }
    })
    .catch(err => {
        console.error("검색 실패:", err);
        message.error("데이터를 불러오지 못했습니다.");
    })
    .finally(() => setLoading(false));
  };

  // 화면이 처음 켜질 때 실행 (Spring의 @PostConstruct 느낌)
  useEffect(() => {
    fetchUsers();
  }, []);

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
    <Card title="유저 관리 (Admin Only)" style={{ margin: '20px' }}>
        <Table 
            dataSource={users} 
            columns={columns} 
            rowKey="id" 
            loading={loading}
            pagination={false} // 커서 페이징이므로 기본 페이징은 끔
        />
        {/* 조건부 렌더링: hasNext가 true일 때만 버튼을 보여준다 */}
        {hasNext && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Button onClick={() => fetchUsers(lastId)} loading={loading}>
            더보기
            </Button>
        </div>
        )}
    </Card>
  );
};

export default UserListPage;
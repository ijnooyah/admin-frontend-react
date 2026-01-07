import axios from 'axios';
import useAuthStore from '../store/useAuthStore';

// 1. 설정을 담은 인스턴스 생성 (자바의 빈 설정과 비슷함)
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080', // 매번 주소 다 안 써도 됨
  withCredentials: true,           // 세션 쿠키 전송 자동 활성화
});

// 2. 응답 인터셉터 (모든 API 응답이 여기를 거쳐감)
axiosInstance.interceptors.response.use(
  (response) => response, 
  (error) => {
    // 서버가 401(Unauthorized)을 던지면 실행
    if (error.response && error.response.status === 401) {
      console.error("세션 만료! 로그인 페이지로 이동합니다.");
      
      // Zustand 창고 비우기
      useAuthStore.getState().logout(); 
      
      // 로그인 페이지로 튕기기
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

// 3. 이 인스턴스를 내보냄 (export default)
export default axiosInstance;
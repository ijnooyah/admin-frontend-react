import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null, // 초기값은 유저 정보 없음
      isLoggedIn: false,

      // 로그인 성공 시 유저 정보를 저장하는 함수
      login: (userData) => set({ 
        user: userData, 
        isLoggedIn: true 
      }),

      // 로그아웃 시 정보를 비우는 함수
      logout: () => set({ 
        user: null, 
        isLoggedIn: false 
      }),
    }),
    {
      name: 'auth-storage', // localStorage에 저장될 키 이름
    }
  )
);

export default useAuthStore;
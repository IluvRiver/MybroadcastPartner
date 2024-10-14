import axios from "axios";

const serverIP = process.env.REACT_APP_GITHUB_IP;
const port = process.env.REACT_APP_PORT;
const refreshToken = localStorage.getItem('refreshToken');

// axios 인스턴스 생성
const api = axios.create({
  baseURL: `http://${serverIP}:${port}`,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
});

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    // 액세스 토큰이 만료되었을 때만 다음 로직을 실행
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 재시도 표시를 설정하여 무한 루프 방지
      const { data } = await api.post('/refreshToken', { refreshToken });
      localStorage.setItem('accessToken', data.accessToken);
      api.defaults.headers['Authorization'] = `Bearer ${data.accessToken}`;
      return api(originalRequest); // 실패한 요청 재시도
    }
    return Promise.reject(error);
  }
);

export default api;
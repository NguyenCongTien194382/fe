// AuthContext.js
import { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Lấy thông tin người dùng từ local storage nếu có
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const login = async (loginData) => {
    try {
      // Gọi API đăng nhập
      const response = await apiLogin(loginData);
      // Kiểm tra xem đăng nhập có thành công không
      if (response.data.data.result === true) {
        // Lưu thông tin người dùng vào state
        setUser(response.data.data.user_infor);
        navigate('/homePage');
        localStorage.setItem('user', JSON.stringify(response.data.data.user_infor));
      } else {
        // Xử lý trường hợp đăng nhập thất bại (hiển thị thông báo, log lỗi, ...)
        setError(response.data.error.message);
        console.error('Đăng nhập thất bại:', response.message);
      }
    } catch (error) {
      // Xử lý lỗi khi gọi API đăng nhập
      setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.');
      console.error('Lỗi khi đăng nhập:', error);
    }
  };

  const logout = () => {
    // Xử lý đăng xuất, reset state người dùng
    setUser(null);
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hàm giả định gọi API đăng nhập
export const apiLogin = async (loginData) => {
  try {
    const response = await axios.post('http://localhost:9000/api/conv/auth/login', loginData);
    return response;

  } catch (error) {
    console.error('Lỗi khi gọi API đăng nhập:', error);
    return { success: false, message: 'Đăng nhập thất bại' };
  }
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

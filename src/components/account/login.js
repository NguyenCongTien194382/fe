// Login.js
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [error] = useState(null);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      // Gọi API đăng nhập
      let response = await login(formData);
      if(response){
        toast.success('Đăng nhập thành công');
      }else{
        toast.error('Đăng nhập thất bại');
      }
      // Hiển thị thông báo thành công
      
    } catch (error) {
      // Hiển thị thông báo lỗi
      console.error('Đăng nhập thất bại:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Đăng nhập</h2>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email</label>
        <input
          type="email"
          name="email"
          className="form-control"
          id="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">Mật khẩu</label>
        <input
          type="password"
          name="password"
          className="form-control"
          id="password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>
      <button
        className="btn btn-primary"
        onClick={handleLogin}
      >
        Đăng nhập
      </button>
      {/* Component ToastContainer để hiển thị thông báo */}
      <ToastContainer />
    </div>
  );
};

export default Login;

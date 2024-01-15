// Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Register = () => {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    avatar: null
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.type === 'file') {
      // Nếu là trường tệp tin, lưu đối tượng tệp tin vào formData
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleRegister = async () => {
    try {
      // Gọi API đăng ký
      const formDataToSend = new FormData();
      formDataToSend.append('userName', formData.userName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('avatar', formData.avatar); // Thêm tệp tin ảnh vào FormData

      // Gọi API đăng ký
      const response = await axios.post('http://localhost:9000/api/conv/auth/register', formDataToSend);
      console.log('Đăng ký thành công:', response.data);

      // Chuyển hướng đến trang đăng nhập sau khi đăng ký thành công
      if(response.data.data.result === true){
        navigate('/login');
      }
    } catch (error) {
      console.error('Đăng ký thất bại:', error);
      setError('Đăng ký thất bại. Vui lòng kiểm tra lại thông tin đăng ký.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Đăng ký</h2>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="mb-3">
        <label htmlFor="userName" className="form-label">Tên người dùng</label>
        <input
          type="text"
          name="userName"
          className="form-control"
          id="userName"
          value={formData.userName}
          onChange={handleChange}
        />
      </div>
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
      <div className="mb-3">
        <label htmlFor="avatar" className="form-label">
          Avatar
        </label>
        <input
          type="file"
          name="avatar"
          className="form-control"
          id="avatar"
          accept="image/*"
          onChange={handleChange}
        />
      </div>
      <button
        className="btn btn-primary"
        onClick={handleRegister}
      >
        Đăng ký
      </button>
    </div>
  );
};

export default Register;

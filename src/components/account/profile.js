// Profile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    avatar: null,
    userName: user ? user.userName : '',
    email: user ? user.email : '',
    userId: user ? user._id : '',
  });
  console.log(profileData)
  const handleChange = (e) => {
    if (e.target.type === 'file') {
      // Nếu là trường tệp tin, lưu đối tượng tệp tin vào formData
      setProfileData({ ...profileData, [e.target.name]: e.target.files[0] });
    } else {
      setProfileData({ ...profileData, [e.target.name]: e.target.value });
    }
  };

  
  const handleUpdateProfile = async () => {
    try {
      // Gọi API để cập nhật thông tin người dùng
      const formData = new FormData();
   
        formData.append('avatar', profileData.avatar);
        formData.append('userName', profileData.userName);
        formData.append('userId', profileData.userId);
        console.log(formData.get('avatar'));

      const response = await axios.post('http://localhost:9000/api/users/ChangeName', formData);
      
      // Cập nhật thông tin người dùng sau khi cập nhật thành công
      setProfileData({
        ...profileData,
        avatar: response.data.data.avatar,
        userName: response.data.data.userName,
      });

      // Hiển thị thông báo thành công
      toast.success('Cập nhật thông tin thành công');

      // Chuyển hướng về trang homePage sau 2 giây
      setTimeout(() => {
        navigate('/homePage');
      }, 2000);
    } catch (error) {
      console.error('Cập nhật thông tin thất bại:', error);
      // Hiển thị thông báo lỗi
      toast.error('Cập nhật thông tin thất bại');
    }
  };

  useEffect(() => {
    // Thực hiện các tác vụ khởi tạo khi component được tạo
    // Load thông tin người dùng nếu có
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Thông tin tài khoản</h2>

      <div className="mb-3">
        <label htmlFor="userName" className="form-label">Tên người dùng</label>
        <input
          type="text"
          name="userName"
          className="form-control"
          id="userName"
          value={profileData.userName}
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
          value={profileData.email}
          disabled
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
        onClick={handleUpdateProfile}
      >
        Cập nhật thông tin
      </button>

      {/* Component ToastContainer để hiển thị thông báo */}
      <ToastContainer />
    </div>
  );
};

export default Profile;

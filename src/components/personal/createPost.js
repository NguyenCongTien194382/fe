import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const CreatePostModal = ({ isOpen, onClose, updatePostList }) => {
  const [postContent, setPostContent] = useState('');
  const [postFile, setPostFile] = useState(null);
  const { user } = useAuth();

  const handlePost = async () => {
    try {
      const formData = new FormData();
      formData.append('contentPost', postContent);
      formData.append('userId', user._id);
      formData.append('raw', 1);
      if (postFile) {
        formData.append('file', postFile);
      }

      // Gọi API để tạo bài viết mới
      const response = await axios.post('http://localhost:9000/api/personal/createpost', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Post created successfully:', response.data.data.result);

      // Đóng modal và cập nhật danh sách bài viết trong component cha
      onClose();
      updatePostList();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <Modal show={isOpen} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create New Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="postContent">
            <Form.Label>Post Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Write your post here..."
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="postFile">
            <Form.Label>Upload File</Form.Label>
            <Form.Control type="file" onChange={(e) => setPostFile(e.target.files[0])} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handlePost}>
          Post
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreatePostModal;

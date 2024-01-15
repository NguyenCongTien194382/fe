import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardImage, MDBCardBody, MDBInput, MDBBtn, MDBIcon, MDBTypography,MDBCardText } from 'mdb-react-ui-kit';
import CreatePost from '../personal/createPost';

const Comment = ({ comment }) => {
  return (
    <div className="d-flex flex-row mb-2">
      <img src={comment.commentAvatar} width="40" className="rounded-image" alt="Commenter Avatar" />
      <div className="d-flex flex-column ml-2">
        <span className="name">{comment.commentName}</span>
        <small className="comment-text">{comment.content}</small>
        <div className="d-flex flex-row align-items-center status">
          <small>Like</small>
          <small>Reply</small>
          <small>Translate</small>
          <small>{comment.createAt}</small>
        </div>
      </div>
    </div>
  );
};

const Personal = () => {
  const { user } = useAuth();
  const [photoCount, setPhotoCount] = useState(0);
  const [videoCount, setVideoCount] = useState(0);
  const [recentPhotos, setRecentPhotos] = useState([]);
  const [post, setPost] = useState([]);

  const [isCreatePostModalOpen, setCreatePostModalOpen] = useState(false);

  const openCreatePostModal = () => {
    setCreatePostModalOpen(true);
  };

  const closeCreatePostModal = () => {
    setCreatePostModalOpen(false);
  };
  
  const styles = ` @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800&display=swap");body{background-color: #eee;font-family: "Poppins", sans-serif;font-weight: 300}.card{border:none}.ellipsis{color: #a09c9c}hr{color: #a09c9c;margin-top: 4px;margin-bottom: 8px}.muted-color{color: #a09c9c;font-size: 13px}.ellipsis i{margin-top: 3px;cursor: pointer}.icons i{font-size: 25px}.icons .fa-heart{color: red}.icons .fa-smile-o{color: yellow;font-size: 29px}.rounded-image{border-radius: 50%!important;display: flex;justify-content: center;align-items: center;height: 50px;width: 50px}.name{font-weight: 600}.comment-text{font-size: 12px}.status small{margin-right: 10px;color: blue}.form-control{border-radius: 26px}.comment-input{position: relative}.fonts{position: absolute;right: 13px;top:8px;color: #a09c9c}.form-control:focus{color: #495057;background-color: #fff;border-color: #8bbafe;outline: 0;box-shadow: none} `;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch photo count
        const response = await axios.get(`http://localhost:9000/api/personal/countfile/${user._id}`);
        setPhotoCount(response.data.data.result.totalImage);
        setVideoCount(response.data.data.result.totalVideo);

        // Fetch recent photos
        const formData = new FormData();
        formData.append('userId', user._id);
        formData.append('type', 'image');
        formData.append('index', 0);
        const response1 = await axios.post('http://localhost:9000/api/personal/GetListLibra', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setRecentPhotos(response1.data.data.imageList);

        // Fetch all posts
        const response2 = await axios.get(`http://localhost:9000/api/personal/getallpost/${user._id}/${user._id}/0`);
        setPost(response2.data.data.result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [user._id]);

  const updatePostList = async () => {
    try {
      // Gọi API để lấy danh sách bài viết mới sau khi tạo
      const response = await axios.get(`http://localhost:9000/api/personal/getallpost/${user._id}/${user._id}/0`);
      setPost(response.data.data.result);
    } catch (error) {
      console.error('Error fetching updated post list:', error);
    }
  };

  // Group photos by date
  const uniqueDates = [...new Set(recentPhotos.map((photo) => photo.createAt))];
  const photosByDate = uniqueDates.map((date) => ({
    date: date,
    photos: recentPhotos.filter((photo) => photo.createAt === date),
  }));

  return (
    <MDBContainer fluid className="py-5" style={{ backgroundColor: '#9de2ff' }}>
      <div className="gradient-custom-2" style={{ backgroundColor: '#9de2ff' }}>
      <style>{styles}</style>
      <MDBContainer className="py-5 h-100">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol lg="5" xl="4"  style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
            <MDBCard>
              <div className="rounded-top text-white d-flex flex-row" style={{ backgroundColor: '#000', height: '200px' }}>
                <div className="ms-4 mt-5 d-flex flex-column" style={{ width: '150px' }}>
                  <MDBCardImage src={user.avatarUser} alt="Avatar" className="mt-4 mb-2 img-thumbnail" fluid style={{ width: '150px', zIndex: '1' }} />
                </div>
                <div className="ms-3" style={{ marginTop: '130px' }}>
                  <MDBTypography tag="h5">{user.userName}</MDBTypography>
                </div>
              </div>
              
              <div className="p-4 text-black" style={{ backgroundColor: '#f8f9fa' }}>
                <div className="d-flex justify-content-end text-center py-1">
                  <div>
                    <MDBCardText className="mb-1 h5">{photoCount}</MDBCardText>
                    <MDBCardText className="small text-muted mb-0">Photos</MDBCardText>
                  </div>
                  <div className="ms-2">
                    <MDBCardText className="mb-1 h5">{videoCount}</MDBCardText>
                    <MDBCardText className="small text-muted mb-0">Video</MDBCardText>
                  </div>
                </div>
              </div>
              <div className="ms-auto">
                  <MDBBtn color="primary" onClick={openCreatePostModal}>
                    Create New Post
                  </MDBBtn>
                </div>
              <MDBCardBody className="text-black p-4">
                <MDBRow>
                  {photosByDate.map((group) => (
                    <div key={group.date} className="mb-4">
                      <h5>{group.date}</h5>
                      <MDBRow>
                        {group.photos.map((photo, index) => (
                          <React.Fragment key={index}>
                            {photo.path.map((path, pathIndex) => (
                              <MDBCol key={pathIndex} className="mb-2">
                                <MDBCardImage
                                  src={path}
                                  alt={`Recent Photo ${pathIndex}`}
                                  className="w-100 rounded-3"
                                  style={{ maxWidth: '15%' }}
                                />
                              </MDBCol>
                            ))}
                          </React.Fragment>
                        ))}
                      </MDBRow>
                    </div>
                  ))}
                </MDBRow>
                
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol lg="9" xl="8" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
              {post.map((post) => (
                <React.Fragment key={post._id}>
                  <Post post={post} width={1} /> {/* Bài viết chiếm hết chiều rộng của MDBCol */}
                  <hr className="my-4" /> {/* Thêm dòng kẻ giữa các bài viết nếu cần thiết */}
                </React.Fragment>
              ))}
            </MDBCol>

        </MDBRow>
      </MDBContainer>
      <CreatePost isOpen={isCreatePostModalOpen} onClose={closeCreatePostModal} updatePostList={updatePostList} />
    </div>
      </MDBContainer>
    
  );
};

const Post = ({ post }) => {
  const { user } = useAuth();
  const [commentInput, setCommentInput] = useState('');

  const handleComment = () => {
    // Logic to handle posting a comment
    console.log(`Commenting on post ${post._id}: ${commentInput}`);
    setCommentInput(''); // Clear the comment input after posting
  };

  return (
    <MDBCol md="12" className="mb-4">
      <MDBCard>
        <div className="d-flex justify-content-between p-2 px-3">
          <div className="d-flex flex-row align-items-center">
            <img src={user.avatarUser} width= '80px' height= '100px' className="rounded-circle" alt="User Avatar" />
            <div className="d-flex flex-column ml-2">
              <span className="font-weight-bold">{user.userName}</span>

            </div>
          </div>
          <div className="d-flex flex-row mt-1 ellipsis">
            <small className="mr-2">{post.createAt}</small>
            <MDBIcon icon="ellipsis-h" />
          </div>
        </div>
        {post.imageList.length > 0 && <MDBCardImage src={post.imageList[0].pathFile} alt="Post Image" className="img-fluid" />}
        <MDBCardBody className="p-2">
          <p className="text-justify">{post.contentPost}</p>
          <hr />
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex flex-row icons d-flex align-items-center">
              <MDBIcon icon="heart" />
              <MDBIcon icon="smile-o" className="ml-2" />
            </div>
            <div className="d-flex flex-row muted-color">
              <span>{post.totalCommnet} comments</span>
              <span className="ml-2">Share</span>
            </div>
          </div>
          <hr />
          <div className="comments">
            {post.commentList.map((comment, index) => (
              <Comment key={index} comment={comment} />
            ))}
            <div className="comment-input d-flex">
              <MDBInput
                type="text"
                label="Write a comment..."
                className="form-control"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
              />
              <MDBBtn color="primary" className="fonts" onClick={handleComment}>
                <MDBIcon icon="camera" />
              </MDBBtn>
            </div>
          </div>
        </MDBCardBody>
      </MDBCard>
    </MDBCol>
  );
};



export default Personal;

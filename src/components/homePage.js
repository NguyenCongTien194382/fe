import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBBtn,
  MDBTypography,
  MDBTextArea,
  MDBCardHeader,
} from 'mdb-react-ui-kit';
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';


const HomePage = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { user, logout } = useAuth()
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);

  const navigate = useNavigate();

  // const [messageType, setMessageType] = useState('')

  useEffect(() => {
    if (user) {
      const socket = io.connect('http://127.0.0.1:4000', {
        secure: true,
        enabledTransports: ["wss"],
        transports: ['websocket', 'polling'],
      });
      socket.emit('Login', user._id);
      socket.on('SendMessage', messageInfo => {
        console.log(messageInfo)
        const convIndex = conversations.find(conv => conv.conversationId === messageInfo.ConversationID)
        if (convIndex !== -1) {
          //Xử lý phần ds tin nhắn
          if (selectedConversation && selectedConversation.conversationId === messageInfo.ConversationID) {
            setMessages(prev => [...prev, {
              senderID: messageInfo.SenderID,
              messageID: messageInfo.MessageID,
              createAt: messageInfo.CreateAt,
              listFile: messageInfo.ListFile,
              message: messageInfo.Message
            }])
          }
          //Xử lý phần conversation: chuyển conv lên đầu
          setConversations(prev => {
            const updatedConv = prev.slice()
            const conversationToMove = updatedConv.splice(convIndex, 1)[0]
            updatedConv.unshift({ ...conversationToMove, message: messageInfo.Message })
            return updatedConv
          });
        }
        else {
          const formData = new FormData();
          formData.append('senderId', user._id);
          formData.append('conversationId', messageInfo.ConversationID);
          axios.post('http://localhost:9000/api/conversations/GetConversation', formData)
            .then(response => {
              setConversations(prev => [response.data.data.conversation_info, ...prev])
            })
            .catch(err => { })
        }
      })

      return () => {
        socket.disconnect();
      };
    }
  }, [user, conversations, selectedConversation]);

  useEffect(() => {
    // Gọi API để lấy danh sách cuộc trò chuyện khi component được tạo
    const fetchConversations = async () => {
      try {
        // Kiểm tra xem user đã đăng nhập chưa
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          console.error('Người dùng chưa đăng nhập.');
          return;
        }
        // Lấy thông tin người dùng từ local storage
        const parsedUser = JSON.parse(storedUser);

        // Tạo FormData và thêm các trường cần thiết
        const formData = new FormData();
        formData.append('userId', parsedUser._id); // Sử dụng _id của user đã đăng nhập
        formData.append('countConversation', '2000');
        formData.append('countConversationLoad', '0');

        // Gửi POST request với FormData
        const response = await axios.post('http://localhost:9000/api/conversations/GetListConversation', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setConversations(response.data.data.listCoversation);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách cuộc trò chuyện:', error);
      }
    };

    fetchConversations();
  }, []);

  const fetchMessages = async () => {
    if (selectedConversation) {
      try {
        // Kiểm tra xem user đã đăng nhập chưa
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          console.error('Người dùng chưa đăng nhập.');
          return;
        }
        // Lấy thông tin người dùng từ local storage
        const parsedUser = JSON.parse(storedUser);

        // Tạo FormData và thêm các trường cần thiết
        const formData = new FormData();
        formData.append('userId', parsedUser._id); // Sử dụng _id của user đã đăng nhập
        formData.append('conversationId', selectedConversation.conversationId);
        formData.append('adminId', '0');
        formData.append('countMessage', '0');
        formData.append('listMess', '0');
        const response = await axios.post('http://localhost:9000/api/message/loadMessage', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setMessages(response.data.data.listMessages);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách tin nhắn:', error);
      }
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedConversation) {
        try {
          const storedUser = localStorage.getItem('user');
          if (!storedUser) {
            console.error('Người dùng chưa đăng nhập.');
            return;
          }
          const parsedUser = JSON.parse(storedUser);

          const formData = new FormData();
          formData.append('userId', parsedUser._id);
          formData.append('conversationId', selectedConversation.conversationId);
          formData.append('adminId', '0');
          formData.append('countMessage', '0');
          formData.append('listMess', '0');
          const response = await axios.post('http://localhost:9000/api/message/loadMessage', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          setMessages(response.data.data.listMessages);
        } catch (error) {
          console.error('Lỗi khi lấy danh sách tin nhắn:', error);
        }
      }
    };

    fetchMessages();
  }, [selectedConversation]);


  // Ref để truy cập input file
  const fileInputRef = React.createRef();

  const handleSendMessage = async () => {
    // Gọi API để gửi tin nhắn mới
    if (selectedConversation) {
      try {
        const formData = new FormData();
        // Kiểm tra xem user đã đăng nhập chưa
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          console.error('Người dùng chưa đăng nhập.');
          return;
        }
        if (fileInputRef.current && fileInputRef.current.files.length > 0) {
          formData.append('MessageType', 'sendFile');
          formData.append('Message', fileInputRef.current.files[0]); // Thêm file vào formData
        } else {
          formData.append('MessageType', 'text');
        }
        // Lấy thông tin người dùng từ local storage
        const parsedUser = JSON.parse(storedUser);
        formData.append('SenderID', parsedUser._id); // Sử dụng _id của user đã đăng nhập
        formData.append('ConversationID', selectedConversation.conversationId);
        formData.append('Message', newMessage);
        await axios.post('http://localhost:9000/api/message/SendMessage', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        // const response = await axios.post('http://localhost:9000/api/message/SendMessage', formData, {
        //   headers: {
        //     'Content-Type': 'multipart/form-data',
        //   },
        // });
        // setMessages([...messages, response.data.data]);
        setNewMessage('');
      } catch (error) {
        console.error('Lỗi khi gửi tin nhắn:', error);
      }
    }
  };


  const handleProfile = async () => {
    try {
      navigate('/profile');
    } catch (error) {
      console.error('chuyển trang thất bại:', error);
    }
  };

  const handlePersonal = async () => {
    try {
      navigate('/personal');
    } catch (error) {
      console.error('chuyển trang thất bại:', error);
    }
  };

  const handleSubmitSearch = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('senderId', user._id);
      formData.append('message', searchQuery);
      formData.append('type', 'all')

      const response = await axios.post('http://localhost:9000/api/users/finduser/app', formData);
      setSearchResults(response.data.data.listEveryone);
    } catch (error) {
      console.error('Lỗi khi tìm kiếm:', error);
    }
  };

  const handleUserSelect = async (contactId) => {
    try {
      const formData = new FormData();
      formData.append('userId', user._id);
      formData.append('contactId', contactId);

      const response = await axios.post('http://localhost:9000/api/conversations/CreateNewConversation', formData);
      // Bước 2: Cập nhật selectedConversation với conversationId mới
      const newConversationId = response.data.data.conversationId;
      const formData1 = new FormData();
      formData1.append('senderId', user._id);
      formData1.append('conversationId', newConversationId);
      const response1 = await axios.post('http://localhost:9000/api/conversations/GetConversation', formData1);
      setSelectedConversation(response1.data.data.conversation_info);
      // Bước 3: Fetch tin nhắn cho cuộc trò chuyện mới
      fetchMessages();
    } catch (error) {
      console.error('Lỗi khi tạo cuộc trò chuyện:', error);
    }
  };

  // Hàm mở cửa sổ tạo nhóm
  const handleCreateGroupClick = async () => {
    try {// Gọi API để lấy danh sách người dùng gần đây (không cần chú thích, vì đã có trong code của bạn)
      setIsCreatingGroup(true);
      const formData = new FormData();
      formData.append('senderId', user._id);
      formData.append('message', '');
      formData.append('type', 'all')

      const response = await axios.post('http://localhost:9000/api/users/finduser/app', formData);
      setSearchResults(response.data.data.listEveryone);

    } catch (error) {
      console.error('Lỗi khi tìm kiếm:', error);
    }
  };

  // Hàm đóng cửa sổ tạo nhóm
  const handleCloseGroupModal = () => {
    setIsCreatingGroup(false);
    setGroupName('');
    setSelectedMembers([]);
    setSearchResults([]);
  };

  // Hàm chọn hoặc bỏ chọn thành viên
  const handleToggleMember = (member) => {
    // Kiểm tra xem người dùng hiện tại có trong danh sách hay không
    const isCurrentUserSelected = selectedMembers.some((selectedMember) => selectedMember._id === user._id);

    // Kiểm tra xem thành viên có trong danh sách chưa
    const isMemberSelected = selectedMembers.some((selectedMember) => selectedMember.id === member.id);

    if (isMemberSelected) {
      // Bỏ chọn thành viên nếu đã chọn trước đó
      setSelectedMembers((prevMembers) => prevMembers.filter((selectedMember) => selectedMember.id !== member.id));
    } else {
      // Chọn thành viên nếu chưa chọn trước đó
      setSelectedMembers((prevMembers) => [...prevMembers, { ...member, _id: member.id }]);
    }

    // Nếu người dùng hiện tại không có trong danh sách, thêm nó vào
    if (!isCurrentUserSelected) {
      setSelectedMembers((prevMembers) => [...prevMembers, { _id: user._id, userName: user.userName }]);
    }
    console.log(selectedMembers)
  };




  // Hàm tạo nhóm mới
  const handleCreateGroup = async () => {
    try {
      const formData = new FormData();
      formData.append('senderId', user._id);
      formData.append('typeGroup', 'normal');
      formData.append('conversationName', groupName);
      formData.append('memberList', JSON.stringify(selectedMembers));

      // Gọi API để tạo nhóm mới
      const response = await axios.post('http://localhost:9000/api/conversations/AddNewConversation', formData);
      // Đóng cửa sổ tạo nhóm và làm các bước cần thiết để hiển thị nhóm mới
      handleCloseGroupModal();
      // Cập nhật danh sách cuộc trò chuyện (không cần chú thích, vì đã có trong code của bạn)

      const formData1 = new FormData();
      formData1.append('userId', user._id);
      formData1.append('countConversation', '2000');
      formData1.append('countConversationLoad', '0');

      // Gửi POST request với FormData
      const response1 = await axios.post('http://localhost:9000/api/conversations/GetListConversation', formData1, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setConversations(response1.data.data.listCoversation);

      const formData2 = new FormData();
      formData2.append('senderId', user._id);
      formData2.append('conversationId', Number(response.data.data.conversation_info._id));
      const response2 = await axios.post('http://localhost:9000/api/conversations/GetConversation', formData2);

      setSelectedConversation(response2.data.data.conversation_info);
      console.log(conversations)
      // Bước 3: Fetch tin nhắn cho cuộc trò chuyện mới
      fetchMessages();

    } catch (error) {
      console.error('Lỗi khi tạo nhóm:', error);
    }
  };

  return (
    <div>
      <na v className="navbar navbar-expand-lg bg-body-tertiary" >
        <div className="container-fluid" >
          <a className="navbar-brand" href="/homePage" style={{ fontSize: '25px' }}>
            ChatBK
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <div>
              {/* Form tìm kiếm */}
              <form className="d-flex" onSubmit={handleSubmitSearch}>
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  name="searchInput"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="btn btn-outline-success" type="submit" style={{ fontSize: '18px' }}>
                  Search
                </button>
                <button className="btn btn-outline-success ms-2" style={{ whiteSpace: 'nowrap', fontSize: '18px' }} onClick={handleCreateGroupClick} >
                  Create Group
                </button>
              </form>



              {isCreatingGroup && (
                <div className="modal fade show" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: 'block' }}>
                  <div className="modal-dialog" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">New Group</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={handleCloseGroupModal}>
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <form>
                          <div className="form-group">
                            <label htmlFor="group-name" className="col-form-label">Group Name:</label>
                            <input type="text" className="form-control" id="group-name" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
                          </div>
                          <div className="form-group">
                            <label className="col-form-label">Select Members:</label>
                            <ul>
                              {searchResults.map((result) => (
                                <li key={result.id}>
                                  <label>
                                    <input
                                      type="checkbox"
                                      checked={selectedMembers.some((selectedMember) => selectedMember.id === result.id)}
                                      onChange={() => handleToggleMember(result)}
                                    />
                                    {result.userName}
                                  </label>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </form>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={handleCloseGroupModal}>Close</button>
                        <button type="button" className="btn btn-primary" onClick={handleCreateGroup}>Create Group</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Kết quả tìm kiếm dropdown */}
              {!isCreatingGroup && searchResults.length > 0 && (
                <div className="dropdown">
                  <ul className="dropdown-menu" style={{ display: 'block', position: 'absolute', zIndex: 1000 }}>
                    {searchResults.map((result) => (
                      <li key={result.id} className="dropdown-item" onClick={() => handleUserSelect(result.id)}>
                        {result.userName}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
            {/* Thêm nút "Thông tin tài khoản" */}
            {user && (
              <div className="d-flex align-items-center ms-auto">
                <button
                  className="btn btn-outline-danger ms-2"
                  onClick={handleProfile}
                  style={{ fontSize: '18px' }}
                >
                  Thông tin tài khoản
                </button>
                <button
                  className="btn btn-outline-danger ms-2"
                  onClick={handlePersonal}
                  style={{ fontSize: '18px' }}
                >
                  Trang cá nhân
                </button>
                <button className="btn btn-outline-danger ms-2" onClick={logout} style={{ fontSize: '18px' }}>
                  Logout
                </button>
              </div>
            )}

          </div>
        </div>
      </na>
      <MDBContainer fluid className="py-5" style={{ backgroundColor: 'aliceblue' }}>
        <MDBRow>
          <MDBCol md="6" lg="5" xl="4" className="mb-4 mb-md-0">
            <h5 className="font-weight-bold mb-3 text-center text-black" style={{ fontSize: '25px' }}>Danh sách cuộc trò chuyện</h5>
            <MDBCard className="mask-custom" style={{ overflowY: 'scroll', display: 'flex', flexDirection: 'column-reverse' }}>
              <MDBCardBody>
                <MDBTypography listUnStyled className="mb-0">
                  {conversations.map((conversation) => (
                    <li
                      key={conversation.conversationId}
                      className={`p-2 border-bottom ${selectedConversation && selectedConversation.conversationId === conversation.conversationId ? 'active' : ''
                        }`}
                      style={{ backgroundColor: '#eee', cursor: 'pointer' }}
                      onClick={() => setSelectedConversation(conversation)}
                    >
                      <div className="d-flex flex-row">
                        <img
                          src={conversation.linkAvatar}
                          alt="avatar"
                          className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
                          width="60"
                        />
                        <div className="pt-1" style={{ fontSize: '20px' }}>
                          <p className="fw-bold mb-0">{conversation.conversationName}</p>
                          <p className="small text-muted">{conversation.message}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </MDBTypography>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>

          <MDBCol md="6" lg="7" xl="8">
            {selectedConversation && (
              <div>
                <div style={{ maxHeight: '600px', overflowY: 'scroll', display: 'flex', flexDirection: 'column-reverse' }}>
                  <MDBTypography listUnStyled>
                    {messages.slice(-10).map((message) => {
                      // Kiểm tra xem user đã đăng nhập chưa
                      const storedUser = localStorage.getItem('user');
                      // Lấy thông tin người dùng từ local storage
                      const parsedUser = JSON.parse(storedUser);
                      let isCurrentUser
                      if (message.senderID === undefined) {
                        isCurrentUser = true
                      } else isCurrentUser = message.senderID === parsedUser._id
                      const sender = selectedConversation.listMember.find((member) => member._id === message.senderID);

                      return (
                        <li key={message.messageID} className={`d-flex justify-content-${isCurrentUser ? 'end' : 'start'} mb-4`}>
                          {isCurrentUser ? (
                            <>
                              <MDBCard style={{ minWidth: 'fit-content', marginLeft: 'auto', marginRight: '20px' }}>
                                <MDBCardHeader className="d-flex justify-content-between p-2">
                                  <p className="fw-bold mb-0">{sender?.userName}</p>
                                  <p className="text-muted small mb-0">
                                    <MDBIcon far icon="clock" /> {message.createAt}
                                  </p>
                                </MDBCardHeader>
                                <MDBCardBody>
                                  <p className="mb-0" style={{ fontSize: '20px' }}>{message.message}</p>
                                  {/* Display files if available */}
                                  {message.listFile.map((file, index) => (
                                    // Check if the file is an image
                                    /\.(jpg|jpeg|png|gif)$/i.test(file.originalname) ? (
                                      <img
                                        key={index}
                                        src={`http://localhost:9000/api/file/DownLoadFile/${file.originalname}`}
                                        alt={file.originalname}
                                        style={{ maxWidth: '100%', maxHeight: '200px' }}
                                      />
                                    ) : (
                                      // Display link for non-image files
                                      <div key={index}>
                                        <a href={`http://localhost:9000/api/file/DownLoadFile/${file.originalname}`} target="_blank" rel="noopener noreferrer">
                                          {file.originalname}
                                        </a>
                                      </div>
                                    )
                                  ))}
                                </MDBCardBody>
                              </MDBCard>
                              {sender?.avatarUser && (
                                <img
                                  src={sender.avatarUser}
                                  alt={sender.userName}
                                  className="avatar-image me-3"
                                  style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                                />
                              )}
                            </>
                          ) : (
                            <>
                              {/* Display Avatar */}
                              {sender?.avatarUser && (
                                <img
                                  src={sender.avatarUser}
                                  alt={sender.userName}
                                  className="avatar-image me-3"
                                  style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                                />
                              )}
                              <MDBCard style={{ minWidth: 'fit-content' }}>
                                <MDBCardHeader className="d-flex justify-content-between p-2">
                                  <p className="fw-bold mb-0">{sender?.userName}</p>
                                  <p className="text-muted small mb-0">
                                    <MDBIcon far icon="clock" /> {message.createAt}
                                  </p>
                                </MDBCardHeader>
                                <MDBCardBody>
                                  <p className="mb-0" style={{ fontSize: '20px' }}>{message.message}</p>
                                  {/* Display files if available */}
                                  {message.listFile.map((file, index) => (
                                    // Check if the file is an image
                                    /\.(jpg|jpeg|png|gif)$/i.test(file.originalname) ? (
                                      <img
                                        key={index}
                                        src={`http://localhost:9000/api/file/DownLoadFile/${file.originalname}`}
                                        alt={file.originalname}
                                        style={{ maxWidth: '100%', maxHeight: '200px' }}
                                      />
                                    ) : (
                                      // Display link for non-image files
                                      <div key={index}>
                                        <a href={`http://localhost:9000/api/file/DownLoadFile/${file.originalname}`} target="_blank" rel="noopener noreferrer">
                                          {file.originalname}
                                        </a>
                                      </div>
                                    )
                                  ))}
                                </MDBCardBody>
                              </MDBCard>
                            </>
                          )}
                        </li>
                      );
                    })}
                  </MDBTypography>
                </div>
                <div className="bg-white mb-3">
                  <MDBTextArea
                    rows={1}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    spellCheck={false}
                  />
                </div>

                {/* Input để chọn file */}
                <input type="file" ref={fileInputRef} />
                <MDBBtn color="info" rounded className="float-end" style={{ fontSize: '18px' }} onClick={handleSendMessage}>
                  Send
                </MDBBtn>
              </div>

            )}
          </MDBCol>

        </MDBRow>
      </MDBContainer>
    </div>

  );
};

export default HomePage;

import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import "./accountmanager.css";
import { Link, useNavigate } from "react-router-dom";

const AccountManager = () => {
  const [users, setUser] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [lockUnlockMessage, setLockUnlockMessage] = useState("");

  const fetchUser = async () => {
    try {
      const response = await axiosClient.get(`/users/get/user`);
      console.log(response);
      setUser(response);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  const handleLockUnlock = async (userId, currentIsActive) => {
    
    const newIsActive = currentIsActive === 1 ? 0 : 1;
    const action = newIsActive === 1 ? "Mở Khoá" : "Khoá";
    const confirmationMessage = `Bạn có chắc muốn ${action} tài khoản không?`;

  const isConfirmed = window.confirm(confirmationMessage);
    if(isConfirmed){
    try {
      const ok = await axiosClient.delete(
        `users/delete/${userId}?isActive=${newIsActive}`
      );

      console.log("User status updated successfully");
      setUser((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, isActive: newIsActive } : user
        )
      );
      setLockUnlockMessage(newIsActive === 1 ? "Đã mở khóa tài khoản!" : "Đã khóa tài khoản!");
      setShowSuccessMessage(true); // Hiển thị thông báo thành công
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
      
    } catch (error) {
      console.error("Error:", error);
    }
  }
  };

  return (
    <div >
      <div className="container-body">
        <div className="product-manager">
          <h1>Quản lý tài khoản</h1>
        </div>
        <div className="product-container">
          <div className="product-row1">
            <div className="product-column id1">ID</div>
            <div className="product-column name1">Tên Tài Khoản</div>
            <div className="product-column phone1">Số Điện Thoại</div>
            <div className="product-column address1">Địa Chỉ</div>
            <div className="product-column status1">Trạng Thái Tài Khoản</div>
          </div>

          {users.map((user) => (
            <div className="product-row">
              <div className="product-column id" key={user.id}>
                {user.id}
              </div>
              <div className="product-column name">{user.fullName}</div>
              <div className="product-column phone">{user.username}</div>

              <div className="product-column address">{user.address}</div>
              <div className="product-column status">
                <span> {user.isActive === 1 ? "Hoạt động" : "Bị khóa"}</span>
                <div className="product-column">
                  <button
                    className="lock-btn"
                    onClick={() => handleLockUnlock(user.id, user.isActive)}
                  >
                    {user.isActive === 1 ? "Khoá" : "Mở"}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {showSuccessMessage && (
            <div className="success-message">
               {lockUnlockMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountManager;

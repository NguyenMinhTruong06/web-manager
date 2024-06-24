import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { useLocalStorage } from "@uidotdev/usehooks";
import "./ordermanager.css";

const OrderManager = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  React.useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);
  const [orders, setOrders] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showSuccessMessage1, setShowSuccessMessage1] = useState(false);
  const [lockUnlockMessage, setLockUnlockMessage] = useState("");
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [showStatusDialog, setShowStatusDialog] = useState(false); // State để điều khiển việc hiển thị hộp thoại
  const [currentStatus, setCurrentStatus] = useState("");
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosClient.get("/orders/getall"); // URL của API để lấy sản phẩm đã bán
        console.log(response);
        setOrders(response);
      } catch (err) {
        setError(err);
      } 
    };

    fetchOrders();
  }, []);

  const handleDeleteClick = async (orderId) => {
    const isConfirmed = window.confirm("Bạn có chắc muốn xoá đơn hàng không?");
    if (isConfirmed) {
      const response = await axiosClient.delete(`/orders/${orderId}`);
      console.log("response" + response);
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== orderId)
      );
    }
  };
  const handleEditClick = (orderId, currentStatus) => {
    setEditingOrderId(orderId); // Set ID của đơn hàng đang được chỉnh sửa
    setCurrentStatus(currentStatus); // Set trạng thái hiện tại của đơn hàng đang được chỉnh sửa
    setShowStatusDialog(true); // Hiển thị hộp thoại khi nhấn chỉnh sửa
  };

  const handleCloseStatusDialog = () => {
    setShowStatusDialog(false); // Đóng hộp thoại
  };

  const selectStatus = async (newStatus) => {
    try {
      const response = await axiosClient.put(`/orders/status/${editingOrderId}`, {
        status: newStatus,
      });
      console.log("Update status response:", response);
      // Cập nhật lại danh sách đơn hàng sau khi thay đổi
      const updatedOrders = orders.map((order) =>
        order.id === editingOrderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
      setShowSuccessMessage1(true);
      setTimeout(() => {
        setShowSuccessMessage1(false);
      }, 3000);
    } catch (err) {
      console.error("Error updating status:", err);
      // Xử lý lỗi khi không thể cập nhật trạng thái
    } finally {
      setShowStatusDialog(false); // Đóng hộp thoại sau khi cập nhật xong
    }
  };

  return (
    <div>
      <div className="container-body">
        <div className="product-manager">
          <h1>Quản lý đơn hàng</h1>
        </div>
        <div className="product-container">
          <div className="product-row1">
            <div className="product-column id1">ID</div>
            <div className="product-column phone1">Số điện thoại</div>
            <div className="product-column totalmoney1">Tổng tiền</div>
            <div className="product-column address1">Địa Chỉ</div>
            <div className="product-column status1">Trạng thái</div>
            <div className="product-column payment1">
              Phương thức thanh toán
            </div>
            <div className="product-column detail1">Chi tiết đơn hàng</div>
            <div className="product-column delete1">Thao tác</div>
          </div>

          {orders.map((order) => (
            <div className="product-row">
              <div className="product-column id" key={order.id}>
                {order.id}
              </div>
              <div className="product-column phone">{order.phoneNumber}</div>
              <div className="product-column totalmoney">
                {order.totalMoney}
              </div>
              <div className="product-column address">{order.address}</div>
              <div className="product-column status">
                {order.status}{" "}
                <button onClick={() => handleEditClick(order.id, order.status)}>
                  <i className="fas fa-edit"></i> Chỉnh sửa
                </button>
              </div>
              <div className="product-column payment">
                {order.paymentMethod}
              </div>
              <div className="product-column detail">
                <Link to={`/orderdetail/${order.id}`}>Xem</Link>
              </div>
              <div className="product-column delete">
                <span> {order.active === true ? "" : "Đã xoá"}</span>
                <div className="product-column">
                  <button
                    className="lock-btn"
                    onClick={() => handleDeleteClick(order.id)}
                  >
                    {order.active === true ? "Xoá" : ""}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {showSuccessMessage && (
            <div className="success-message">Xoá thành công</div>
          )}
          {showSuccessMessage1 && (
            <div className="success-message">Thay đổi trạng thái đơn hàng thành công</div>
          )}
        </div>
      </div>
      {showStatusDialog && (
        <div className="dialog-background">
          <div className="dialog" id="statusDialog">
            <h2>Chọn trạng thái mới:</h2>
            <ul>
              <li>
                <button onClick={() => selectStatus("pending")} className={currentStatus === "pending" ? "selected" : ""}>
                  Pending
                </button>
              </li>
              <li>
                <button onClick={() => selectStatus("processing")} className={currentStatus === "processing" ? "selected" : ""}>
                  Process
                </button>
              </li>
              
              <li>
                <button onClick={() => selectStatus("shipped")} className={currentStatus === "shipped" ? "selected" : ""}>
                  Shipped
                </button>
              </li>
              <li>
                <button onClick={() => selectStatus("delivered")} className={currentStatus === "delivered" ? "selected" : ""}>
                Delivered
                </button>
              </li>
              <li>
                <button onClick={() => selectStatus("cancelled")} className={currentStatus === "cancelled" ? "selected" : ""}>
                  Cancel
                </button>
              </li>
            </ul>
            <button onClick={handleCloseStatusDialog}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManager;

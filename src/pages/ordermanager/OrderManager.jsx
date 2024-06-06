import React, { useState, useEffect } from "react";

import axiosClient from "../../api/axiosClient";
import "./ordermanager.css";

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [lockUnlockMessage, setLockUnlockMessage] = useState("");
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosClient.get("/orders/getall"); // URL của API để lấy sản phẩm đã bán
        console.log(response);
        setOrders(response);
        
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

 const handleDeleteClick = async(orderId)=>{
    const response = await axiosClient.delete(`/orders/${orderId}`);
    console.log("response"+response);
    setShowSuccessMessage(true);
    setTimeout(()=>{
        setShowSuccessMessage(false);
    },3000);
    setOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== orderId)
      );

 };
  return (
    <div>
      <div className="container-body">
        <div>
            
        </div>
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
            <div className="product-column detail1">
                    Chi tiết đơn hàng
                </div>
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
              <div className="product-column status">{order.status}</div>
              <div className="product-column payment">
                {order.paymentMethod}
              </div>
                <div className="product-column detail">
                    <button >Xem</button>
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
        </div>
      </div>
    </div>
  );
};

export default OrderManager;

import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { useNavigate } from 'react-router-dom';

import "./orderdetail.css";
const OrderDetail = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);




  const { orderId } = useParams();

  const [order, setOrders] = useState(null);
  const fetchOrderDetail = async (orderId) => {
    const response = await axiosClient.get(`/orders/${orderId}`);
    setOrders(response);
    console.log(order.shippingMethod);
    console.log("order " + response);
  };
  useEffect(() => {
    fetchOrderDetail(orderId);
  }, []);

  if (!order) {
    return <div>Loading...</div>; // Hiển thị loading nếu order là null
  }
  
  return (
    <div className="container-body">
      <div class="order-header">
        <h1>Chi Tiết Đơn Hàng</h1>
      </div>
      <div class="order-info">
        <div>
          <h2>Thông tin khách hàng</h2>
          <p>
            <strong>ID:</strong> {order.userId}
          </p>
          <p>
            <strong>Tên:</strong> {order.fullName}
          </p>
          <p>
            <strong>Số điện thoại:</strong> {order.phoneNumber}
          </p>
          <p>
            <strong>Địa chỉ:</strong> {order.address}
          </p>
          <p>
            <strong>Ghi chú:</strong>{" "}
          </p>
        </div>
        <div>
          <h2>Thông tin đơn hàng</h2>
          <p>
            <strong>Mã đơn hàng: </strong>
            {order.id}{" "}
          </p>
          <p>
            <strong>Trạng thái: </strong> {order.status}
          </p>
          <p>
            <strong>Ngày đặt hàng: </strong> {order.orderDate}
          </p>
          <p>
            <strong>Phương thức giao hàng: </strong> {order.shippingMethod}
          </p>
          <p>
            <strong>Ngày giao hàng: </strong>
            {order.shippingDate}
          </p>
          <p>
            <strong>Địa chỉ giao hàng: </strong> {order.address}
          </p>
          <p>
            <strong>Phương thức thanh toán: </strong>
            {order.paymentMethod}
          </p>
          <p>
            <strong>Tiền ship: </strong>{" "}
            { order.shippingMethod === "Hoả tốc"
              ? "100.000"
              : order.shippingMethod === "Nhanh"
              ? "50.000"
              : order.shippingMethod === "Tiết kiệm"
              ? "20.000"
              : "0"}{" "}
            ₫
          </p>
          <p>
            <strong>Tổng tiền: </strong> {order.totalMoney.toLocaleString()} ₫
          </p>
        </div>
      </div>
      <div class="order-details">
        <h2>Chi tiết sản phẩm</h2>
        <table class="product-list">
          <thead>
            <tr>
              <th>ID sản phẩm</th>
              <th>Tên sản phẩm</th>
              <th>Tùy chọn</th>
              <th>Đơn giá</th>
              <th>Số lượng</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {order.orderDetails.map((detail) => (
              <tr key={detail.id}>
                <td>{detail.productId}</td>
                <td>{detail.productName}</td>
                <td>{detail.option}</td>
                <td>{detail.price.toLocaleString()} ₫</td>
                <td>{detail.numberOfProducts}</td>
                <td>{detail.totalMoney.toLocaleString()} ₫</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderDetail;

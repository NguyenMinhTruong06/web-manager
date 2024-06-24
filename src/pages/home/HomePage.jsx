import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";
import { useLocalStorage } from "@uidotdev/usehooks";
import axiosClient from "../../api/axiosClient";

const HomePage = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [totalSales, setTotalSales] = useState(0);

  useEffect(() => {
   
    const fetchOrders = async () => {
      try {
        const response = await axiosClient.get("/orders/getall"); // URL của API để lấy sản phẩm đã bán
        console.log(response);
        setProducts(response);
        const totalOrders = response.length;
        
        setOrderCount(totalOrders);
        let totalMoney = 0;
        for (let i = 0; i < response.length; i++) {
          const order = response[i];  // Access the current order object
          if (order && typeof order.totalMoney === 'number') {
            totalMoney += order.totalMoney;
          }
        }
        setTotalSales(totalMoney);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosClient.get(`/products/all`);
        
        const totalProducts = response.products.length;
       
        console.log('totalProduct'+ totalProducts);
        setProductCount(totalProducts);
        
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, []);

  return (
    
      <div className="container-body">
        <h2>Thống kê </h2>
        <section className="statistics">
          <div className="stat-item product-count">
            <h2>Sản Phẩm</h2>
            <span id="product-count-value">{productCount}</span>
          </div>
          <div className="stat-item order-count">
            <h2>Đơn Hàng</h2>
            <span id="order-count-value">{orderCount}</span>
          </div>
          <div className="stat-item total-sales">
            <h2>Doanh Thu</h2>
            <span id="total-sales-value">{totalSales}₫</span>
          </div>
        </section>

        
      </div>
   
  );
};

export default HomePage;

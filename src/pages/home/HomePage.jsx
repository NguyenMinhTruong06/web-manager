import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";
import axiosClient from "../../api/axiosClient";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [totalSales, setTotalSales] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosClient.get("/products/orderdetail/order"); // URL của API để lấy sản phẩm đã bán
        console.log(response);
        setProducts(response);

        
        const totalProducts = response.length;
        const totalOrders = response.reduce((acc, product) => acc + product.orderCount, 0);
        const totalSalesValue = response.reduce((acc, product) => acc + product.totalPrice, 0);

        setProductCount(totalProducts);
        setOrderCount(totalOrders);
        setTotalSales(totalSalesValue.toLocaleString());
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  

  return (
    
      <div className="container-body">
        <h2>Thống kê </h2>
        <section className="statistics">
          <div className="stat-item product-count">
            <h2>Tổng Số Sản Phẩm</h2>
            <span id="product-count-value">{productCount}</span>
          </div>
          <div className="stat-item order-count">
            <h2>Tổng Số Đơn Hàng</h2>
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

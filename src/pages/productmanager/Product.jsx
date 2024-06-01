import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./product.css";
import axiosClient from "../../api/axiosClient";

const Product = () => {
  const [products, setProduct] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 1;
  const visiblePages = 1;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosClient.get(`/products/all`, {
          params: {
            page: currentPage - 1,
            limit: itemsPerPage,
          },
        });
        console.log(response);
        setProduct(response.products);
        setTotalPages(response.totalPages);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [currentPage]);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  console.log(products);
  const handleAddProductPage = () => {
    navigate("/addproduct");
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axiosClient.delete(`/products/${id}`);
      // Sau khi xóa thành công, cập nhật danh sách sản phẩm
      const updatedProducts = products.filter((product) => product.id !== id);
      setProduct(updatedProducts);
    } catch (err) {
      console.error("Failed to delete product", err);
    }
    // const response = await axiosClient.delete(`/products/${id}`);
  };
  const renderPagination = () => {
    const paginationButtons = [];

    if (currentPage > 1) {
      paginationButtons.push(
        <button
          key="prev"
          className="pagination-btn"
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Trước
        </button>
      );
    }

    if (currentPage > 2 + visiblePages) {
      paginationButtons.push(
        <button key="start-ellipsis" className="pagination-btn disabled">
          ...
        </button>
      );
    }

    for (
      let page = Math.max(1, currentPage - visiblePages);
      page <= Math.min(totalPages, currentPage + visiblePages);
      page++
    ) {
      paginationButtons.push(
        <button
          key={page}
          className={`pagination-btn ${currentPage === page ? "active" : ""}`}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </button>
      );
    }

    if (currentPage < totalPages - 1 - visiblePages) {
      paginationButtons.push(
        <button key="end-ellipsis" className="pagination-btn disabled">
          ...
        </button>
      );
    }

    if (currentPage < totalPages) {
      paginationButtons.push(
        <button
          key="next"
          className="pagination-btn"
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Sau
        </button>
      );
    }

    return paginationButtons;
  };

  return (
    <div>
      <div className="container-body">
        <div className="product-manager">
          <h1>Quản lý sản phẩm</h1>
        </div>
        <div className="product-container">
          <div className="product-row">
            <div className="product-column id">Id</div>
            <div className="product-column image">Image</div>
            <div className="product-column name">Name</div>
            <div className="product-column option">Option</div>
            <div className="product-column price">Price</div>

            <button className="add-btn" onClick={handleAddProductPage}>
              Thêm sản phẩm
            </button>
          </div>

          {products.map((product) => (
            <div className="product-row">
              <div className="product-column id" key={product.id}>
                {product.id}
              </div>
              <div className="product-column image">
                <img
                  src={
                    product.images && product.images.length > 0
                      ? product.images[0].imageUrl
                      : "default-image-url.jpg"
                  }
                  alt="Sản phẩm 1"
                />
              </div>
              <div className="product-column name">{product.name}</div>

              <div className="product-column option">
                {product.options && product.options.length > 0
                  ? product.options[0].option
                  : "No option available"}
              </div>
              <div className="product-column price">
                {product.options && product.options.length > 0
                  ? `${product.options[0].price} ₫`
                  : "No price available"}
              </div>

              <div className="product-column actions">
                <Link to={`/updateproduct/${product.id}`} className="edit-btn">
                  Sửa
                </Link>
                <button
                  className="delete-btn"
                  onClick={handleDeleteProduct(product.id)}
                >
                  Xoá
                </button>
              </div>
            </div>
          ))}
          
          <div className="pagination">{renderPagination()}</div>
        </div>
      </div>
    </div>
  );
};

export default Product;

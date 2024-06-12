import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import "./searchproduct.css";

const SearchProduct = () => {
    const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  

  useEffect(() => {
    fetchCategories();
  }, []);
  

    const handleDeleteClick = async(productId)=>{
      const isConfirmed = window.confirm("Bạn có chắc muốn xoá sản phẩm không?");
      if (isConfirmed) {
      try {
        const response = await axiosClient.delete(`/products/${productId}`);
  
        console.log("Product deleted successfully:", response);
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== productId)
      );
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);
        
      } catch {
        console.error("Product deletion failed:", error);
        setShowErrorMessage(true);
        setTimeout(() => {
          setShowErrorMessage(false);
        }, 3000);
      }
    }
      };
      const fetchCategories = async () => {
        try {
          const response = await axiosClient.get(`/categories/get`);
          setCategories(response);
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };
      const handleSearch = async () => {
        
        try {
          const response = await axiosClient.get(`/products/all`, {
            params: {
              keyword: searchTerm,
              category_id: selectedCategoryId,
            },
          });
          
          
          setProducts(response.products);
        } catch (error) {
          console.error("Error searching products:", error);
        }
      };
      const handleCategoryChange = (event) => {
        const selectedCategoryName = event.target.value;
        const selectedCategory = categories.find(
          (category) => category.name === selectedCategoryName
        );
        setSelectedCategoryId(selectedCategory ? selectedCategory.id : "");
        console.log("categoryId",selectedCategoryId);
      };
    


  return (
    <div>
      <div className="container-body">
        <div className="product-manager">
          <h1>Tìm kiếm</h1>
        </div>
        <div className="search-bar">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-btn" onClick={handleSearch}>
          {/* <i className="fa fa-search"></i> */}
          <div >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
          </div>
          
        </button>
        <select
          className="category-filter"
          value={
            categories.find(
              (category) => category.id === selectedCategoryId
            )?.name || ""
          }
          onChange={handleCategoryChange}
        >
          <option value="">Chọn danh mục</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
        <div className="product-container">
          <div className="product-row">
            <div className="product-column id">Id</div>
            <div className="product-column image">Image</div>
            <div className="product-column name">Name</div>
            <div className="product-column option">Option</div>
            <div className="product-column price">Price</div>

            <button className="add-btn1" >
             Thao tác
            </button>
          </div>

          {products.length > 0 ? (
            products.map((product) => (
              <div className="product-row" key={product.id}>
                <div className="product-column id">
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
                    onClick={() => handleDeleteClick(product.id)}
                  >
                    Xoá
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">Không có sản phẩm nào</div>
          )}
         
        </div>
        {showSuccessMessage && (
        <div className="success-message">Xoá thành công!</div>
      )}
      </div>
      {showErrorMessage && (
        <div className="success-message">Xoá thất bại!</div>
      )}
    </div>
  )
}

export default SearchProduct;

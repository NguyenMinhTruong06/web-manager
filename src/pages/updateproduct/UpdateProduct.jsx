import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import "./updateproduct.css";
import { Link, useNavigate } from "react-router-dom";
const UpdateProduct = () => {
  const { productId } = useParams();
  console.log("productId - ", productId);
  const navigate = useNavigate();

  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [options, setOptions] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  console.log(options);
  const [product, setProduct] = useState([]);
  useEffect(() => {
    fetchProduct(productId);
  }, [productId]);
  const fetchProduct = async (productId) => {
    const response = await axiosClient.get(`/products/${productId}`);
    setProduct(response);
    setProductName(response.name || ""); // Gán tên sản phẩm
    setProductDescription(response.description || ""); // Gán mô tả sản phẩm
    setSelectedCategoryId(response.category_id || ""); // Gán ID danh mục sản phẩm
    setSelectedImages(response.images.map((image) => image.imageUrl) || []); // Gán danh sách hình ảnh sản phẩm
    setOptions(response.options || []);
    console.log("options", options);
    console.log("image", selectedImages);
  };

  // useEffect(() => {
  //   fetchCategories();
  // }, []);

  const fetchCategories = async () => {
    try {
      const response = await axiosClient.get("/categories/get");
      console.log(response);
      setCategories(response);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const selectedFiles = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setSelectedImages((prevImages) => [...prevImages, ...selectedFiles]);
  };
  const handlePostProductImage = async (productId) => {
    try {
      console.log("ok");
      const formData = new FormData();
      selectedImages.forEach((image) => formData.append("files", image.file));
      const response = await axiosClient.post(
        `/products/uploads/${productId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Product images uploaded successfully:", response);
    } catch (error) {
      console.error("Error uploading product images:", error);
    }
  };
  const handleCategoryChange = (event) => {
    const selectedCategoryName = event.target.value;
    const selectedCategory = categories.find(
      (category) => category.name === selectedCategoryName
    );
    setSelectedCategoryId(selectedCategory ? selectedCategory.id : "");
  };
  const handleAddOption = () => {
    setOptions([...options, { id: null, options: "", prices: "" }]);
  };
  const handleRemoveOption = async (id) => {
    try {
      if (id) {
        const response = await axiosClient.delete(`/options/delete/${id}`);
      } else {
        const newOptions = options.slice(0, options.length - 1);
        setOptions(newOptions);
      }
      fetchProduct(productId);
    } catch (error) {
      console.error("Lỗi khi gửi request xóa option:", error);
    }
  };
  const handleOptionNameChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index].option = value;
    setOptions(newOptions);
  };

  const handleOptionPriceChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index].price = value;
    setOptions(newOptions);
  };

  const handleAddOptions = async (productId) => {
    try {
      const newOptions = options.filter((option) => option.id === null);
      const optionDTOs = newOptions.map((option) => ({
        options: option.option,
        prices: option.price,
      }));

      const response = await axiosClient.post(
        `/options/post/${productId}`,
        optionDTOs
      );
      console.log(response);
    } catch (error) {
      if (error.response) {
        console.error("Error adding options:", error.response);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
    }
  };
  const handleUpdateProduct = async (productId) => {
    const productDTO = {
      name: productName,
      category_id: selectedCategoryId,
      description: productDescription,
    };
    const response = await axiosClient.put(
      `/products/${productId}`,
      productDTO
    );
    await handleAddOptions(productId);
    await handlePostProductImage(productId);
    setShowSuccessMessage(true); // Hiển thị thông báo thành công
    setTimeout(() => {
      setShowSuccessMessage(false),navigate("/productmanager");
    },3000);
    
  };

  const handleRemoveImage = async (index) => {
    const removedImage = selectedImages[index];
    if (removedImage.id) {
      // Nếu ảnh đã có id (đã được lưu trong cơ sở dữ liệu), gửi request để xóa ảnh
      try {
        const response = await axiosClient.delete(
          `/image/delete/${removedImage.id}`
        );
        console.log("Image deleted successfully:", response);
        
      } catch (error) {
        console.error("Error deleting image:", error);
        
      }
    }
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };
  return (
    <div>
      <div className="container-body">
        <div className="row">
            <input
              className="addfile"
              type="file"
              multiple
              onChange={handleImageChange}
            ></input>
            <div className="thumnail-container">
              {selectedImages.map((image, index) => (
                <div className="thumnail-item" key={index}>
                  <img
                    className="thumnail-image"
                    src={typeof image === "string" ? image : image.url}
                    alt={`Selected ${index}`}
                  />
                  <button
                    className="remove-image-button"
                    onClick={() => handleRemoveImage(index)}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="col-md-6">
            <div className="product-details">
              <h2>Thông tin chi tiết sản phẩm</h2>
              <p>Tên sản phẩm</p>
              <input
                className="input"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                type="text"
              />
              <p>Danh mục sản phẩm</p>

              <select
                className="input"
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

              <p>Mô tả sản phẩm</p>
              <input
                className="input"
                type="text"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
              />

              <div className="options-container">
                {options.map((option, index) => (
                  <div key={option.id} className="option-item">
                    <input
                      className="option-input"
                      type="text"
                      placeholder="Option"
                      value={option.option}
                      onChange={(e) =>
                        handleOptionNameChange(index, e.target.value)
                      }
                    />
                    <input
                      className="option-input"
                      type="text"
                      placeholder="Price"
                      value={option.price}
                      onChange={(e) =>
                        handleOptionPriceChange(index, e.target.value)
                      }
                    />
                    <button
                      className="remove-option"
                      onClick={() => handleRemoveOption(option.id)}
                    >
                      Xóa
                    </button>
                  </div>
                ))}
              </div>

              <button className="add-option-btn" onClick={handleAddOption}>
                Thêm Option
              </button>

              <div className="product-actions">
                <button
                  className="btn-addproduct"
                  onClick={() => handleUpdateProduct(productId)}
                >
                  Update
                </button>
              </div>
            </div>
            {showSuccessMessage && (
        <div className="success-message">Cập nhật thành công!</div>
      )}
          </div>
          
      </div>
      
    </div>
  );
};

export default UpdateProduct;

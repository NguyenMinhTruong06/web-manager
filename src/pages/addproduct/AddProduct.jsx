import "./addproduct.css";
import React, { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";

const AddProduct = () => {
  const [selectedImages, setSelectedImages] = useState([]);

  const [categories, setCategories] = useState([]);

  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [options, setOptions] = useState([{ options: "", price: "" }]);

  useEffect(() => {
    fetchCategories();
  }, []);
  const fetchCategories = async () => {
    try {
      const response = await axiosClient.get("/categories/get");
      console.log(response);
      setCategories(response);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const selectedFiles = files.map((file) => file);
    setSelectedImages((prevImages) => [...prevImages, ...selectedFiles]);
  };

  const handlePostProductImage = async (productId) => {
    try {
      
      const formData = new FormData();
      selectedImages.forEach((file) => formData.append("files", file));
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

  const handleAddProduct = async () => {
    try {
      const productDTO = {
        name: productName,
        category_id: selectedCategoryId,
        description: productDescription,
      };

      const response = await axiosClient.post("/products/post", productDTO);

      const newProduct = response;
      const newProductId = newProduct.id;
      await handlePostProductImage(newProductId);
      await handleAddOptions(newProductId);
      console.log(newProductId);
      setProductName("");
      setSelectedCategoryId("");
      setProductDescription("");

      setSelectedImages([]);
      setOptions([]);
      setShowSuccessMessage(true); // Hiển thị thông báo thành công
    setTimeout(() => {
      setShowSuccessMessage(false);
    },3000);
    
    } catch (error) {
      console.error("Error adding category:", error);
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
    setOptions([...options, { options: "", price: "" }]);
  };

  const handleRemoveOption = (index) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
    // await axiosClient.delete(`/delete/`);
  };

  const handleOptionNameChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index].options = value;
    setOptions(newOptions);
  };

  const handleOptionPriceChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index].price = value;
    setOptions(newOptions);
  };
  const handleAddOptions = async (productId) => {
    try {
      // Create an array of option objects
      const optionDTOs = options.map((option) => ({
        options: option.options,
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

            <div  className="thumbnail-container2">
              {selectedImages.map((image, index) => (
                <div className="thumbnail-item2" key={index}>
                  <img
                    className="thumbnail-image2"
                    src={URL.createObjectURL(image)}
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
                  <div key={index} className="option-item">
                    <input
                      className="option-input"
                      type="text"
                      placeholder="Option"
                      value={option.options}
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
                      onClick={() => handleRemoveOption(index)}
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
                <button className="btn-addproduct" onClick={handleAddProduct}>
                  Thêm
                </button>
              </div>
            </div>
            {showSuccessMessage && (
        <div className="success-message">Thêm thành công!</div>
      )}
        </div>
      </div>
    </div>
  );
};

export default AddProduct;

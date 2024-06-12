import React, { useState, useEffect } from "react";
import "./categories.css";
import axiosClient from "../../api/axiosClient";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editedCategory, setEditedCategory] = useState({ id: null, name: "" });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showSuccessMessage1, setShowSuccessMessage1] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);
  const fetchCategories = async () => {
    try {
      const response = await axiosClient.get("/categories/get");

      setCategories(response);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      setError("Tên danh mục không được để trống");
      return;
    }
    try {
      const response = await axiosClient.post("/categories/post", {
        name: newCategoryName,
      });
      setCategories([...categories, response.data]);
      setNewCategoryName("");
      await fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleDeleteCategory = async (id) => {
    const isConfirmed = window.confirm("Bạn có chắc muốn xoá danh mục và xoá hết các sản phẩm thuộc danh mục đó không?");
    // try {
    //   const result = await axiosClient.delete(`/categories/${id}`);
    //   setCategories(categories.filter((category) => category.id !== id));
    //   console.log(result);
    // } catch (error) {
    //   console.error("Error deleting category:", error);
    // }
    if (isConfirmed) {
      try {
        const result = await axiosClient.delete(`/categories/${id}`);
        setCategories(categories.filter((category) => category.id !== id));
        console.log(result);
        setShowSuccessMessage(true); // Hiển thị thông báo thành công
    setTimeout(() => {
      setShowSuccessMessage(false),navigate("/productmanager");
    },3000);
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    } else {
      console.log("Delete action was cancelled.");
    }
  };

  const handleCategoryNameChange = (id, newName) => {
    setCategories(
      categories.map((category) =>
        category.id === id ? { ...category, name: newName } : category
      )
    );
    setEditedCategory({ id, name: newName });
  };

  const handleEditCategory = async (id) => {
    try {
      await axiosClient.put(`/categories/put/${id}`, {
        name: editedCategory.name,
      });
      setEditedCategory({ id: null, name: "" });
      setShowSuccessMessage1(true); // Hiển thị thông báo thành công
    setTimeout(() => {
      setShowSuccessMessage1(false),navigate("/productmanager");
    },3000);
    } catch (error) {
      console.error("Error updating category:", error);
      console.log(token);
    }
  };

  return (
    <div>
      <div className="container-body">
        
          
            <div className="product-details1">
              <h1>Quản lý danh mục</h1>
              <p>Tên danh mục</p>
              <div className="ip-category">
                <input
                  className="input"
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
                <div className="product-actions">
                  <button
                    className="btn-addcategory"
                    onClick={handleAddCategory}
                  >
                    Thêm
                  </button>
                </div>
              </div>
              <p className="ds-danhmuc">Tất cả danh mục sản phẩm</p>

              <div className="category-list">
                {categories.map((category) => (
                  <div key={category?.id} className="category-item">
                    <span>
                      <input
                        type="text"
                        value={category?.name}
                        className="category-input"
                        onChange={(e) =>
                          handleCategoryNameChange(category.id, e.target.value)
                        }
                      />
                    </span>
                    <div className="btn-edit">
                      <button
                        className="btn-update"
                        onClick={() => handleEditCategory(category.id)}
                      >
                        Sửa
                      </button>
                      <button
                        className="btn-danger"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {showSuccessMessage && (
        <div className="success-message">Xoá thành công!</div>
      )}
        {showSuccessMessage1 && (
        <div className="success-message">Cập nhật thành công!</div>
      )}
      </div>
    </div>
  );
};

export default Categories;

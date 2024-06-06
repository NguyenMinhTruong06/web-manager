import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LayoutCommon from "./components/layouts/LayoutCommon";
import LayoutLogin from "./components/layouts/LayoutLogin";
import AddProduct from "./pages/addproduct/AddProduct";
import Categories from "./pages/categories/Categories";
import Product from "./pages/productmanager/Product";
import AccountManager from "./pages/accountmanager/AccountManager";
import SearchProduct from "./pages/searchproduct/SearchProduct";
import OrderManager from "./pages/ordermanager/OrderManager";





const HomePage = lazy(() => import("./pages/home/HomePage"));
const LoginPage = lazy(() => import("./pages/login/LoginPage"));
const UpdateProduct = lazy(() => import("./pages/updateproduct/UpdateProduct"));


function App() {
  return (
    <Suspense fallback={<div>loading</div>}>
      <Routes>
        <Route path="/" element={<LayoutCommon />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/updateproduct/:productId"element ={<UpdateProduct />} />
          <Route path="/addproduct"element ={<AddProduct />} />
          <Route path="/categories"element ={<Categories />} />
          <Route path="/productmanager"element ={<Product />} />
          <Route path="/accountmanager"element ={<AccountManager />} />
          <Route path="/searchproduct"element ={<SearchProduct />} />
          <Route path="/ordermanager" element ={<OrderManager/>}/>
        </Route>
        <Route path="/" element={<LayoutLogin />}>
          <Route path="/sign-in" element={<LoginPage />} />
        </Route>
      </Routes>
      
    </Suspense>
  );
}

export default App;

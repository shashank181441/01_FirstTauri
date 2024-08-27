import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Customers/Home";
import Carts from "./pages/Customers/Carts";
import AdminProducts from "./pages/Products/AdminProducts";
import AdminUser from "./pages/AdminUser";
import AdminVendingMachines from "./pages/Vending/AdminVendingMachines";
import { useAuth } from "./hooks/useAuth"; // Custom hook to check authentication
import Register from "./pages/Register";
import Login from "./pages/Login";
import Checkout from "./pages/Customers/Checkout";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "./store/authSlice";

import { getCurrentUser } from "./api/api";
import AdminVendingEdit from "./pages/Vending/AdminVendingEdit";
import AdminProductEdit from "./pages/Products/AdminProductEdit";
import AdminProductAdd from "./pages/Products/AdminAddProduct";
import Sidebar from "./components/Sidebar";
import GetPaidCarts from "./pages/Carts/getPaidCarts";

function AppRouter() {
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const userDatas = useSelector((state) => state.auth.userData);

  const dispatch = useDispatch();

  useEffect(() => {
    localStorage.setItem("machineId", "66bf0abac21f084004bf1806");
    getCurrentUser()
      .then((userData) => {
        if (userData) {
          // Extract serializable data from headers and config
          setUserData(userData);
          const { data } = userData;
          dispatch(login({ userData: data }));
        } else {
          dispatch(logout());
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <h1>Loading...</h1>;
  return (
    <Router>
      <Routes>
        {/* Non-logged-in user routes */}
        <Route path="/" element={<Home />} />
        <Route path="/carts" element={<Carts />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/register" element={<Register />} />

        {/* Logged-in user routes */}
        {
          userDatas?.success ? (
            <>
              {/* Products */}
              <Route
                path="/admin/products/:machineId"
                element={<AdminProducts />}
              />
              <Route
                path="/admin/products/edit/:productId"
                element={<AdminProductEdit />}
              />
              <Route
                path="/admin/products/add/:machineId"
                element={<AdminProductAdd />}
              />

              <Route
                path="/admin/carts/paid/:machineId"
                element={<GetPaidCarts />}
              />

              {/* Users */}
              <Route
                path="/admin/users"
                element={
                  <Sidebar>
                    <AdminUser />
                  </Sidebar>
                }
              />

              {/* Vending */}
              <Route
                path="/admin/vending-machines"
                element={<AdminVendingMachines />}
              />
              <Route
                path="/admin/vending-machines/edit/:machineId"
                element={<AdminVendingEdit />}
              />
            </>
          ) : (
            <Route
              path="/admin/*"
              element={<Navigate to="/admin/login" replace />}
            />
          ) // Default
        }

        {/* Catch-all route for undefined paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;

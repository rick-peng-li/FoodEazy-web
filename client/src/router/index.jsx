import { Routes, Route, Outlet } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import Auth from "@/pages/Auth";
import Menu from "@/pages/Menu";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Orders from "@/pages/Orders";
import Verify from "@/pages/Verify";
import Forget from "@/pages/Forget";
import ResetPassword from "@/pages/ResetPassword";
import Success from "@/pages/Success";
import Fail from "@/pages/Fail";
import Contact from "@/pages/Contact";
import AddProduct from "@/pages/AddProduct";
import DeleteItems from "@/pages/DeleteItems";
import NotFound from "@/pages/NotFound";

const Layout = () => (
  <MainLayout>
    <Outlet />
  </MainLayout>
);

const AppRouter = () => (
  <Routes>
    <Route path="/auth" element={<Auth />} />
    <Route path="/verify" element={<Verify />} />
    <Route path="/forget" element={<Forget />} />
    <Route path="/forget/:code" element={<ResetPassword />} />
    <Route path="/success" element={<Success />} />
    <Route path="/fail" element={<Fail />} />

    <Route element={<Layout />}>
      <Route path="/" element={<ProtectedRoute><Menu /></ProtectedRoute>} />
      <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
      <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
      <Route path="/order" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
      <Route path="/addproduct" element={<ProtectedRoute><AdminRoute><AddProduct /></AdminRoute></ProtectedRoute>} />
      <Route path="/deleteitems" element={<ProtectedRoute><AdminRoute><DeleteItems /></AdminRoute></ProtectedRoute>} />
      <Route path="/contact" element={<Contact />} />
    </Route>

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRouter;

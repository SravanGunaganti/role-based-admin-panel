import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./routes/ProtectedRoute";
import ManageUsers from "./pages/admin/UserManagement";
import { Sidebar } from "./components/Layout/Sidebar";
import { Header } from "./components/Layout/Header";
import { useState } from "react";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import ManageProducts from "./pages/manage/ManageProducts";
import { ManagerDashboard } from "./pages/manager/ManagerDashboard";
import ManagerTeam from "./pages/manager/ManagerTeam";
import TeamOrders from "./pages/manager/TeamOrders";
import ProductsList from "./pages/productsList";
import { EmployeeDashboard } from "./pages/employee/EmployeeDashboard";
import PlaceOrder from "./pages/PlaceOrder";
import EmployeeOrders from "./pages/employee/EmployeeOrders";
import ProductDetails from "./pages/PrdoductDetails";
import Orders from "./pages/admin/Orders";
import OrderDetails from "./pages/OrderDetails";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="bg-brand flex justify-center h-screen overflow-y-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 md:p-4 flex flex-col w-full">
        <Header onMenuToggle={() => setIsSidebarOpen(true)} />
        <main
          id="main"
          className="p-4 md:pt-4 md:px-0 md:pb-0 h-full overflow-y-auto scrollbar-hide">
          {children}
        </main>
      </div>
    </div>
  );
};
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/admin/manage-team"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AppLayout>
                <ManageUsers />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AppLayout>
                <Orders />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/team/manage-products"
          element={
            <ProtectedRoute roles={["admin", "manager"]}>
              <AppLayout>
                <ManageProducts />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute roles={["admin", "manager", "employee"]}>
              <AppLayout>
                <ProductsList />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/:id"
          element={
            <ProtectedRoute roles={["admin", "manager", "employee"]}>
              <AppLayout>
                <ProductDetails />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute roles={["admin", "manager", "employee"]}>
              <AppLayout>
                <OrderDetails />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AppLayout>
                <AdminDashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee"
          element={
            <ProtectedRoute roles={["employee"]}>
              <AppLayout>
                <EmployeeDashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/place-order"
          element={
            <ProtectedRoute roles={["employee"]}>
              <AppLayout>
                <PlaceOrder />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/orders"
          element={
            <ProtectedRoute roles={["employee"]}>
              <AppLayout>
                <EmployeeOrders />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager"
          element={
            <ProtectedRoute roles={["manager"]}>
              <AppLayout>
                <ManagerDashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/team"
          element={
            <ProtectedRoute roles={["manager"]}>
              <AppLayout>
                <ManagerTeam />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/orders"
          element={
            <ProtectedRoute roles={["manager"]}>
              <AppLayout>
                <TeamOrders />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

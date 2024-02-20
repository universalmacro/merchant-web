import { Routes, Route, Navigate, useRoutes } from "react-router-dom";
import PrivateRoute from "./core/components/PrivateRoute";
// import AuthGuard from "auth/AuthGuard";

import RtlLayout from "layouts/rtl";
import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";
import ItemInfo from "views/info/ItemInfo";
import CommonLayout from "layouts/common";

const App = () => {
  return (
    <Routes>
      <Route path="auth/*" element={<AuthLayout />} />
      {/* <Route  path='/' element={<PrivateRoute />}>
        <Route path="admin/*" element={<AdminLayout />}>
        </Route> */}

      {/* <Route path="admin/*" element={<PrivateRoute />}>
        <Route path="admin/*" element={<AdminLayout />} />
      </Route> */}
      {/* <PrivateRoute path="admin/*" element={<AdminLayout />} /> */}
      <Route
        path="admin/*"
        element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }
      />

      <Route
        path="spaces/:id/order/*"
        element={
          <PrivateRoute>
            <CommonLayout />
          </PrivateRoute>
        }
      />

      <Route path="info/*" element={<ItemInfo />} />
      <Route path="rtl/*" element={<RtlLayout />} />
      <Route path="/" element={<Navigate to="admin/" replace />} />
    </Routes>
  );
};

export default App;

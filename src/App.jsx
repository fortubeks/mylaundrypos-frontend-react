import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Construction from "./Construction";
import NotFound from "./NotFound";
import RegisterIndex from "./onboarding/join";
import Verify from "./onboarding/join/Verify";
import LoginIndex from "./onboarding/signin";
import Login from "./onboarding/signin/Login";
import FPEmail from "./onboarding/signin/FPEmail";
import FPNewPassword from "./onboarding/signin/FPNewPassword";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "./dashboard/Dashboard";
import DashboardHome from "./dashboard/home";
import Customers from "./dashboard/customers";
import ServiceItems from "./dashboard/serviceItems";
import LaundryItems from "./dashboard/laundryItems";
import Orders from "./dashboard/orders";
import CreateOrder from "./dashboard/orders/CreateOrder";
import Settings from "./dashboard/settings";
import Marketing from "./dashboard/marketing";
import ViewOrder from "./dashboard/orders/ViewOrder";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" />,
  },
  {
    path: "/under-construction",
    element: <Construction />,
  },
  {
    path: "*",
    element: <Construction />,
  },
  {
    path: "/login",
    element: (
      <PublicRoute logStatus={false}>
        <LoginIndex />
      </PublicRoute>
    ),
    children: [
      {
        path: "",
        index: true,
        element: <Login />,
      },
      { path: "forgot-password", element: <FPEmail /> },
      { path: "forgot-password-sent", element: <FPNewPassword /> },
    ],
  },
  {
    path: "/register",
    element: (
      <PublicRoute logStatus={false}>
        <RegisterIndex />
      </PublicRoute>
    ),
  },
  {
    path: "verify",
    element: (
      <PublicRoute logStatus={false}>
        <Verify />,
      </PublicRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
    children: [
      {
        path: "unauthorized",
        element: (
          <div className="flex grow h-full w-full justify-center items-center">
            Unauthorized
          </div>
        ),
      },
      {
        path: "*",
        element: <NotFound />,
      },
      {
        path: "dashboard",
        element: <DashboardHome />,
      },
      {
        path: "orders",
        element: <Orders />,
      },
      {
        path: "orders/create-order",
        element: <CreateOrder />,
      },
      {
        path: "orders/update-order/:id",
        element: <ViewOrder />,
      },
      {
        path: "customers",
        element: <Customers />,
      },
      {
        path: "service-items",
        element: <ServiceItems />,
      },
      {
        path: "laundry-items",
        element: <LaundryItems />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "marketing",
        element: <Marketing />,
      },
    ],
  },
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router}></RouterProvider>
      <Outlet />
    </div>
  );
}

export default App;

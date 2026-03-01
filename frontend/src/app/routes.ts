import { createBrowserRouter } from "react-router";
import { LoginScreen } from "./screens/LoginScreen";
import { RegisterScreen } from "./screens/RegisterScreen";
import { Dashboard } from "./screens/Dashboard";
import { TransactionList } from "./screens/TransactionList";
import { TransactionDetail } from "./screens/TransactionDetail";
import { ProfileScreen } from "./screens/ProfileScreen";
import { SettingsScreen } from "./screens/SettingsScreen";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginScreen,
  },
  {
    path: "/register",
    Component: RegisterScreen,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "/transactions",
    Component: TransactionList,
  },
  {
    path: "/transaction/:id",
    Component: TransactionDetail,
  },
  {
    path: "/profile",
    Component: ProfileScreen,
  },
  {
    path: "/settings",
    Component: SettingsScreen,
  },
]);
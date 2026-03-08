import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { DocumentView } from "./pages/DocumentView";
import { Reader } from "./pages/Reader";
import { Profile } from "./pages/Profile";
import { Settings } from "./pages/Settings";
import { Help } from "./pages/Help";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "/documents",
    Component: DocumentView,
  },
  {
    path: "/reader/:documentId",
    Component: Reader,
  },
  {
    path: "/profile",
    Component: Profile,
  },
  {
    path: "/settings",
    Component: Settings,
  },
  {
    path: "/help",
    Component: Help,
  },
]);

import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import LoginPage from "./login/LoginPage";
import DashboardLayout from "./dashboard/DashboardLayout";
import { CMSHome } from "./pages/CMSHome";
import { tokenManager } from "./services/api";
import Categories from "./sections/Categories";
import { Authors } from "./sections/Authors";
import News from "./sections/News";
import Sections from "./sections/Sections";


function ProtectedRoute({ children }) {
  if (!tokenManager.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },

  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
    
      {
        index: true,
        element: <CMSHome />,
      },

      {
        path: "/categories",
        element: <Categories />
      },

      {
        path: "/authors",
        element: <Authors />
      }, 

      {
        path: "/news",
        element: <News />
      }, 

      {
        path: "/sections",
        element: <Sections />
      }

     
      
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
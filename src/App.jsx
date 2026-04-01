import { createBrowserRouter, RouterProvider } from "react-router-dom"

import RootLayout from "./components/RootLayout"
import Home from "./components/Home"
import Register from "./components/Register"
import Login from "./components/Login"

import UserDashboard from "./components/UserDashboard"
import AuthorDashboard from "./components/AuthorDashboard"
import AdminDashboard from "./components/AdminDashboard"
import EditArticle from "./components/EditArticle"
import ProtectedRoute from "./components/ProtectedRoute"
import Errorboundary from "./components/ErrorBoundary"   

import { Toaster } from "react-hot-toast"

function App() {

  const routerObj = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
       errorElement: <Errorboundary />,   

      children: [

        { path: "", element: <Home /> },

        { path: "register", element: <Register /> },

        { path: "login", element: <Login /> },

        // ---------------- DASHBOARDS ----------------

        {
          path: "user-profile",
          element: (
            <ProtectedRoute allowedRoles={["USER"]}>
              <UserDashboard />
            </ProtectedRoute>
          )
        },

        {
          path: "author-profile",
          element: (
            <ProtectedRoute allowedRoles={["AUTHOR"]}>
              <AuthorDashboard />
            </ProtectedRoute>
          )
        },

        {
          path: "admin-profile",
          element: (
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          )
        },

        // ---------- AUTHOR ONLY ----------

        {
          path: "edit-article/:id",
          element: (
            <ProtectedRoute allowedRoles={["AUTHOR"]}>
              <EditArticle />
            </ProtectedRoute>
          )
        }

      ]
    }
  ])

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={routerObj} />
    </>
  )
}

export default App
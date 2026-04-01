import React from "react"
import { NavLink, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../stores/authStore"

function Header() {

  const { currentUser, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    const res = await logout()
    if (res?.success) navigate("/login")
  }

  //  Detect dashboard pages only
  const isDashboardRoute =
    location.pathname.includes("user-profile") ||
    location.pathname.includes("author-profile") ||
    location.pathname.includes("admin-profile")

  return (

    <div className="bg-cyan-300 flex justify-between items-center px-10 py-5">

    

      <img
        width="100px"
        className="p-2 rounded-full cursor-pointer"
        src="data:image/jpeg;base64,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"
        alt="logo"
        onClick={() => navigate("/")}
      />

      {/* ================= HOME NAV ================= */}

      {(!isAuthenticated || !isDashboardRoute) && (
        <nav>
          <ul className="flex gap-10 text-2xl">
            <li><NavLink to="">Home</NavLink></li>
            <li><NavLink to="register">Register</NavLink></li>
            <li><NavLink to="login">Login</NavLink></li>
          </ul>
        </nav>
      )}

      {/* ================= DASHBOARD PROFILE ================= */}

      {isAuthenticated && currentUser && isDashboardRoute && (

        <div className="flex items-center gap-6">

          <span className="text-xl font-semibold">
            {currentUser.firstName}
          </span>

          <img
            src={
              currentUser.profileImageUrl ||
              "https://ui-avatars.com/api/?name=" + currentUser.firstName
            }
            alt="profile"
            className="w-12 h-12 rounded-full object-cover border-2 border-blue-600 shadow-md cursor-pointer"
            onClick={() => {
              if (currentUser.role === "USER") navigate("/user-profile")
              if (currentUser.role === "AUTHOR") navigate("/author-profile")
              if (currentUser.role === "ADMIN") navigate("/admin-profile")
            }}
          />

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>

        </div>

      )}

    </div>
  )
}

export default Header
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../stores/authStore"

import {
  pageBackground,
  pageWrapper,
  formCard,
  formTitle,
  inputClass,
  formGroup,
  submitBtn,
  labelClass,
  linkClass
} from "../styles/common"

function Login() {

  const { register, handleSubmit, formState: { errors } } = useForm()

  const navigate = useNavigate()

  const { login, loading, error } = useAuth()

  const onSubmit = async (userCredWithRole) => {

    const result = await login(userCredWithRole)

    if (result.success) {

      if (userCredWithRole.role === "user") {
        navigate("/user-profile")
      }

      if (userCredWithRole.role === "author") {
        navigate("/author-profile")
      }

      if (userCredWithRole.role === "admin") {
        navigate("/admin-profile")
      }

    }

  }

  return (

    <div className={pageBackground}>
      <div className={pageWrapper}>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className={formCard}
        >

          <h1 className={formTitle}>Login</h1>

          {/* Role */}
          <div className={formGroup}>

            <label className={labelClass}>Select Role</label>

            <div className="flex gap-6 mt-2">

              <label>
                <input
                  type="radio"
                  value="user"
                  {...register("role", { required: "Role is required" })}
                />
                <span className="ml-2">User</span>
              </label>

              <label>
                <input
                  type="radio"
                  value="author"
                  {...register("role", { required: "Role is required" })}
                />
                <span className="ml-2">Author</span>
              </label>

              <label>
                <input
                  type="radio"
                  value="admin"
                  {...register("role", { required: "Role is required" })}
                />
                <span className="ml-2">Admin</span>
              </label>

            </div>

            {errors.role && (
              <p className="text-red-500 text-sm">
                {errors.role.message}
              </p>
            )}

          </div>

          {/* Email */}
          <div className={formGroup}>

            <input
              type="email"
              placeholder="Enter Email"
              className={inputClass}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format"
                }
              })}
            />

            {errors.email && (
              <p className="text-red-500 text-sm">
                {errors.email.message}
              </p>
            )}

          </div>

          {/* Password */}
          <div className={formGroup}>

            <input
              type="password"
              placeholder="Enter Password"
              className={inputClass}
              {...register("password", {
                required: "Password is required"
              })}
            />

            {errors.password && (
              <p className="text-red-500 text-sm">
                {errors.password.message}
              </p>
            )}

          </div>

          {/* Backend Error Message */}
          {error && (
            <p className="text-red-500 text-sm text-center mb-3">
              {error}
            </p>
          )}

          {/* Forgot Password */}
          <div className="text-right mb-3">
            <span className={linkClass}>
              Forgot password?
            </span>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className={submitBtn}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Register Link */}
          <p className="text-center mt-4 text-sm">

            Don't have an account?{" "}

            <span
              className={linkClass}
              onClick={() => navigate("/register")}
            >
              Create one
            </span>

          </p>

        </form>

      </div>
    </div>

  )

}

export default Login
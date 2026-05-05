import React, { ChangeEvent, FormEvent, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import defaultLogo from "../assets/images/misplaceme logo icon main@4x.png";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { BASE_URL } from "../hooks/useFetch";

interface LoginState {
  username: string;
  password: string;
}

interface ApiError {
  message: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Partial<LoginState>>({});
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [state, setState] = useState<LoginState>({ username: "", password: "" });

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginState> = {};
    if (!state.username.trim()) newErrors.username = "Username is required";
    if (!state.password) newErrors.password = "Password is required";
    else if (state.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setError("");
  };

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${BASE_URL}/auth/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
      const data = await response.json();
      if (!response.ok) throw new Error((data as ApiError).message || "Login failed. Please try again.");
      if (rememberMe) localStorage.setItem("rememberedUsername", state.username);
      if (data.access) {
        localStorage.setItem(ACCESS_TOKEN, data.access);
        localStorage.setItem(REFRESH_TOKEN, data.refresh);
      } else {
        throw new Error("No token received");
      }
      navigate("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) await handleLogin();
  };

  return (
    <div
      data-testid="login-page"
      className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 flex items-center justify-center p-4"
    >
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Top band */}
          <div className="bg-blue-600 px-8 py-6 text-center">
            <img src={defaultLogo} alt="MisplaceMe" className="w-14 h-14 object-contain mx-auto mb-3" />
            <h1 className="text-2xl font-extrabold text-white">Admin Login</h1>
            <p className="text-blue-200 text-sm mt-1">Secure access for administrators only</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={state.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                />
                {errors.username && (
                  <p className="text-xs text-red-500 mt-1">{errors.username}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <Link to="/register" className="text-xs text-blue-600 hover:underline font-medium">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={state.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                )}
              </div>

              {/* Remember me */}
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-400"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 512 512" fill="currentColor" className="mt-0.5 flex-shrink-0">
                    <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24l0 112c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-112c0-13.3 10.7-24 24-24zm-24 224a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z"/>
                  </svg>
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {loading ? "Logging in…" : "Login"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Need an account?{" "}
              <Link to="/register" className="text-blue-600 hover:underline font-medium">
                Register as admin
              </Link>
            </p>

            <div className="mt-4 text-center">
              <Link to="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
                ← Back to public board
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

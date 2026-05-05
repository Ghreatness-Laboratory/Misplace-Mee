import React, { ChangeEvent, FormEvent, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import defaultLogo from "../assets/images/misplaceme logo icon main@4x.png";
import { BASE_URL } from "../hooks/useFetch";

interface RegisterState {
  username: string;
  password: string;
  email: string;
  phone_number: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Partial<RegisterState>>({});
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [agreed, setAgreed] = useState(false);
  const [state, setState] = useState<RegisterState>({
    username: "",
    password: "",
    email: "",
    phone_number: "",
  });

  const validate = () => {
    const newErrors: Partial<RegisterState> = {};
    if (!state.username.trim()) newErrors.username = "Username is required";
    if (!state.email.trim()) newErrors.email = "Email is required";
    if (!state.phone_number) newErrors.phone_number = "Phone number is required";
    if (!state.password || state.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "phone_number") {
      setState((prev) => ({ ...prev, phone_number: value.replace(/\D/g, "").slice(0, 10) }));
    } else {
      setState((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    if (!agreed) { setError("You must agree to the terms and conditions."); return; }
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${BASE_URL}/accounts/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Registration failed. Please try again.");
      } else {
        navigate("/login");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      data-testid="login-page"
      className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 flex items-center justify-center p-4"
    >
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Top band */}
          <div className="bg-blue-600 px-8 py-6 text-center">
            <img src={defaultLogo} alt="MisplaceMe" className="w-14 h-14 object-contain mx-auto mb-3" />
            <h1 className="text-2xl font-extrabold text-white">Admin Registration</h1>
            <p className="text-blue-200 text-sm mt-1">Create a new administrator account</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Two-column: username + email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={state.username}
                    onChange={handleChange}
                    placeholder="e.g. admin_john"
                    className={inputCls(!!errors.username)}
                  />
                  {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={state.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={inputCls(!!errors.email)}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone_number" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center border-r border-gray-200 pr-3">
                    <span className="text-sm text-gray-500 font-medium">+234</span>
                  </div>
                  <input
                    id="phone_number"
                    name="phone_number"
                    type="tel"
                    value={state.phone_number}
                    onChange={handleChange}
                    placeholder="0000000000"
                    maxLength={10}
                    className={`${inputCls(!!errors.phone_number)} pl-16`}
                    onPaste={(e) => {
                      const text = e.clipboardData.getData("text");
                      if (!/^\d+$/.test(text)) e.preventDefault();
                    }}
                  />
                </div>
                {errors.phone_number && <p className="text-xs text-red-500 mt-1">{errors.phone_number}</p>}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={state.password}
                    onChange={handleChange}
                    placeholder="Min. 8 characters"
                    className={`${inputCls(!!errors.password)} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>

              {/* Terms */}
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => { setAgreed(e.target.checked); setError(""); }}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-400 flex-shrink-0"
                />
                <span className="text-sm text-gray-600">
                  I agree to the{" "}
                  <Link to="#terms" className="text-blue-600 hover:underline font-medium">Terms & Conditions</Link>
                  {" "}and{" "}
                  <Link to="#privacy" className="text-blue-600 hover:underline font-medium">Privacy Policy</Link>
                </span>
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
                {loading ? "Creating account…" : "Create Admin Account"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline font-medium">Login</Link>
            </p>
            <div className="mt-3 text-center">
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

const inputCls = (hasError: boolean) =>
  `w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition-colors ${
    hasError
      ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
      : "border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
  }`;

export default Register;

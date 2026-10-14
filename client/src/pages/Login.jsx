
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MailIcon,
  LockIcon,
  ArrowRightIcon,
  User2Icon,
} from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://localhost:3000/api";

export default function Login() {
  const [loginState, setLoginState] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const endpoint = loginState
        ? `${API_URL}/login`
        : `${API_URL}/register`;

      const payload = loginState
        ? { email: email.trim(), password }
        : { name: name.trim(), email: email.trim(), password };

      const response = await axios.post(endpoint, payload, {
        withCredentials: true,
      });

      const { token, _id, name: userName, email: userEmail } =
        response.data;

      if (!token) {
        throw new Error("Authentication token was not returned by the server.");
      }

      // Store the JWT token in a browser cookie.
      Cookies.set("token", token, {
        expires: 7,
        path: "/",
        sameSite: "lax",
        secure: window.location.protocol === "https:",
      });

      // Optional: store basic user information separately.
      // Never store passwords in cookies.
      setSuccess(
        loginState
          ? "Login successful!"
          : "Account created successfully!"
      );

      console.log("Authenticated user:", {
        _id,
        name: userName,
        email: userEmail,
      });

      // Navigate after successful authentication.
      navigate("/");
    } catch (err) {
      console.error(
        "Authentication error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.msg ||
          err.response?.data?.message ||
          err.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setLoginState((previous) => !previous);
    setName("");
    setEmail("");
    setPassword("");
    setError("");
    setSuccess("");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex flex-col items-center mb-8">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.svg" alt="Logo" className="size-6" />
              <h1 className="text-2xl">Scheduler</h1>
            </Link>

            <p className="text-slate-500 text-sm mt-1">
              {loginState
                ? "Sign in to your Dashboard"
                : "Create your Scheduler account"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 text-sm">
            {!loginState && (
              <div>
                <label className="block mb-1.5">Name</label>
                <div className="relative">
                  <User2Icon className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Enter your name"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 outline-slate-300 border border-slate-200 rounded-full"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block mb-1.5">Email</label>
              <div className="relative">
                <MailIcon className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@company.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 outline-slate-300 border border-slate-200 rounded-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block mb-1.5">Password</label>
              <div className="relative">
                <LockIcon className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  autoComplete={
                    loginState ? "current-password" : "new-password"
                  }
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 outline-slate-300 border border-slate-200 rounded-full"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-lg bg-red-50 border border-red-200 p-3 text-red-700"
              >
                {error}
              </div>
            )}

            {success && (
              <div
                role="status"
                className="rounded-lg bg-green-50 border border-green-200 p-3 text-green-700"
              >
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-full text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                loginState ? "Signing in..." : "Creating account..."
              ) : (
                <>
                  {loginState ? "Sign In" : "Sign Up"}
                  <ArrowRightIcon className="size-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            {loginState ? (
              <>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={toggleAuthMode}
                  className="text-red-600 hover:text-red-700"
                >
                  Create one free
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={toggleAuthMode}
                  className="text-red-600 hover:text-red-700"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

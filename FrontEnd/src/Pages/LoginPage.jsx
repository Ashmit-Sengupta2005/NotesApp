import { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext.jsx";
import { Link, useNavigate } from "react-router";
import { LogIn, Mail, Lock, Loader2 } from "lucide-react";
const LoginPage=()=>{
    const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  // If the user is already logged in, redirect them to Home immediately
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate("/");
    }}
    return (
    <div className="min-h-screen flex items-center justify-center bg-base-300 p-4">
      <div className="w-full max-w-md bg-base-100/60 backdrop-blur-md border border-base-content/10 p-8 rounded-3xl shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex bg-primary/10 p-3 rounded-2xl border border-primary/20 text-primary">
            <LogIn size={28} />
          </div>
          <h2 className="text-3xl font-black text-amber-400">Welcome Back</h2>
          <p className="text-sm text-base-content/60">Log in to access your dashboard</p>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-semibold text-base-content/75">Email Address</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
              <input 
                type="email" 
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered w-full pl-12 rounded-xl focus:border-amber-400 focus:outline-none bg-base-200/50"
                required
                disabled={loading}
              />
            </div>
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-semibold text-base-content/75">Password</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered w-full pl-12 rounded-xl focus:border-amber-400 focus:outline-none bg-base-200/50"
                required
                disabled={loading}
              />
            </div>
          </div>
          <button 
            type="submit" 
            className="btn btn-primary w-full rounded-xl flex items-center justify-center gap-2 mt-6 font-semibold text-lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                <span>Logging in...</span>
              </>
            ) : (
              <span>Log In</span>
            )}
          </button>
        </form>

        <div className="divider text-base-content/40">OR</div>
        
        <button 
          type="button" 
          onClick={() => window.location.href = `${import.meta.env.VITE_API_URL || "http://localhost:3001/api"}/auth/google`}
          className="btn btn-outline w-full rounded-xl flex items-center justify-center gap-2 font-semibold text-lg bg-base-100 hover:bg-base-200"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        {/* Footer Link */}
        <div className="text-center text-sm text-base-content/60">
          Don't have an account?{" "}
          <Link to="/register" className="text-amber-400 hover:underline font-semibold">
            Sign up here
          </Link>
        </div>
      </div>
    </div>
  );
  };

export default LoginPage;
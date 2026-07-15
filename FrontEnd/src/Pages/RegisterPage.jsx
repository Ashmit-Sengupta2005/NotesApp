import { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext.jsx";
import { Link, useNavigate } from "react-router";
import { UserPlus, User, Mail, Lock, Loader2 } from "lucide-react";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register, user, loading } = useAuth();
  const navigate = useNavigate();

  // If the user is already logged in, redirect them to Home immediately
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(username, email, password);
    if (success) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-300 p-4">
      <div className="w-full max-w-md bg-base-100/60 backdrop-blur-md border border-base-content/10 p-8 rounded-3xl shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex bg-primary/10 p-3 rounded-2xl border border-primary/20 text-primary">
            <UserPlus size={28} />
          </div>
          <h2 className="text-3xl font-black text-amber-400">Create Account</h2>
          <p className="text-sm text-base-content/60">Sign up to start saving notes</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-semibold text-base-content/75">Username</span>
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
              <input 
                type="text" 
                placeholder="Your Name" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input input-bordered w-full pl-12 rounded-xl focus:border-amber-400 focus:outline-none bg-base-200/50"
                required
                disabled={loading}
              />
            </div>
          </div>

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
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Sign Up</span>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center text-sm text-base-content/60">
          Already have an account?{" "}
          <Link to="/login" className="text-amber-400 hover:underline font-semibold">
            Log in here
          </Link>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;

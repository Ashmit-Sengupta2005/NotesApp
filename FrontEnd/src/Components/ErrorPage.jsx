import { Link } from "react-router";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

const ErrorPage = () => {
  return (
    <div className="bg-base-300 min-h-screen flex flex-col justify-center items-center p-4 md:p-6 animate-fade-in-up">
      <div className="max-w-md w-full bg-base-100/60 backdrop-blur-md border border-base-content/10 rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center gap-6">
        
        {/* Animated Icon Container */}
        <div className="bg-error/10 p-5 rounded-full border border-error/20 text-error animate-pulse">
          <AlertTriangle size={48} className="stroke-[1.5]" />
        </div>

        {/* Text details */}
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-error tracking-tight">404</h1>
          <h2 className="text-xl font-bold text-base-content/90">Oops! Page Not Found</h2>
          <p className="text-sm text-base-content/60 leading-relaxed">
            The page you are looking for doesn't exist, has been moved, or an unexpected error occurred.
          </p>
        </div>

        {/* Tip / Instruction */}
        <div className="bg-base-200/50 p-3 rounded-xl border border-base-content/5 text-xs text-base-content/70 w-full flex items-center gap-2 justify-center">
          <RefreshCw size={12} className="animate-spin text-primary" />
          <span>If this was unexpected, please wait a moment and refresh.</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
          <Link
            to="/"
            className="flex-1 btn btn-primary rounded-xl flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all font-semibold"
          >
            <Home size={18} />
            <span>Go Back Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;

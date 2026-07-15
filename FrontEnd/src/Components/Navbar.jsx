import { useState } from 'react';
import { Plus, Notebook, LogOut, User } from 'lucide-react';
import { Link } from 'react-router';
import { useAuth } from '../Context/AuthContext.jsx'; // 1. Import our custom hook

const Navbar = () => {
  // 2. Pull the user data and logout function
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <header className="bg-base-300 border-b border-base-content/10 py-3 px-4 md:px-8">
        <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center gap-3">
                <div className="bg-amber-400/10 p-2.5 rounded-xl border border-amber-400/20 text-amber-400">
                    <Notebook size={24} />
                </div>
                <div className="flex flex-col">
                    <span className="text-xl md:text-2xl font-black tracking-wider text-amber-400 leading-none">AS NOTES</span>
                    <span className="text-[10px] md:text-xs text-base-content/50 font-semibold tracking-widest mt-1 uppercase">by Ashmit Sengupta</span>
                </div>
            </div>

            {/* User Controls (Only show if user is logged in) */}
            <div className="flex items-center gap-3 md:gap-4">
                {user && (
                    <>
                        {/* New Note Link */}
                        <Link to={"/create"} className="btn btn-primary btn-sm md:btn-md flex items-center gap-2 rounded-full shadow-md">
                            <Plus size={16} />
                            <span className="font-semibold text-sm hidden xs:inline">New Note</span>
                        </Link>

                        {/* User Indicator / Avatar Card */}
                        <div className="flex items-center gap-2 bg-base-200/50 py-1 px-2.5 rounded-2xl border border-base-content/10 shadow-inner">
                            <div className="avatar placeholder">
                                <div className="bg-amber-400 text-neutral-content w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm uppercase">
                                    <span>{user.username ? user.username[0] : <User size={16} />}</span>
                                </div>
                            </div>
                            <span className="hidden sm:inline text-sm font-semibold text-base-content/85 max-w-[120px] truncate">
                                {user.username}
                            </span>
                        </div>

                        {/* Log Out Icon Button */}
                        <button 
                            onClick={() => setShowLogoutModal(true)} 
                            className="btn btn-ghost btn-circle text-error hover:bg-error/15 border border-error/15 transition-colors duration-300"
                            title="Log Out"
                        >
                            <LogOut size={18} />
                        </button>
                    </>
                )}
            </div>
        </div>

        {/* Logout Confirmation Modal */}
        {showLogoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop overlay */}
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-default"
              onClick={() => setShowLogoutModal(false)}
            ></div>
            
            {/* Modal box */}
            <div className="relative bg-base-200 border border-base-content/10 p-6 rounded-2xl max-w-sm w-full shadow-2xl mx-4 animate-fade-in-up text-left">
              <h3 className="font-bold text-lg text-error flex items-center gap-2 mb-2">
                <LogOut className="size-5" /> Log Out
              </h3>
              <p className="text-sm text-base-content/80 mb-6 leading-relaxed">
                Are you sure you want to log out of your account?
              </p>
              <div className="flex justify-end gap-3">
                <button 
                  type="button"
                  className="btn btn-ghost btn-sm rounded-lg" 
                  onClick={() => setShowLogoutModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  className="btn btn-error btn-sm rounded-lg" 
                  onClick={() => {
                    logout();
                    setShowLogoutModal(false);
                  }}
                >
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
        )}
    </header>
  )
}

export default Navbar;

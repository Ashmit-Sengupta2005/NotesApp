import { Shield, LockKeyhole, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { api } from "../lib/axios.jsx";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../Context/AuthContext.jsx";

const VaultModal=({onClose,mode,onSuccess})=>{
    const { checkAuth } = useAuth();
    const [pin,setPin]=useState("");
    const [confirmPin, setConfirmPin] = useState("");
    const [showPin, setShowPin] = useState(false);
    const handleSubmit=async(e)=>{
        e.preventDefault();
        if(mode==="setup"){
            try{
            const res=await api.post("/auth/vault/setup",{pin,confirmPin});
            if(res.data.done){
                toast.success("PIN created successfully");
                await checkAuth(); // <-- This fixes the bug! Refreshes user.hasVaultPin
                onClose();
                if(onSuccess) onSuccess(pin);
            }
            else
                toast.error(res.data.message);}
            catch(error){
                console.log("Error in Vault Modal page");
                toast.error(error.response?.data?.message||"Failed to set up PIN");
            }
        }
        else{
            try{
            const res=await api.post("/auth/vault/verify",{pin});
            if(!res.data.verified)
                toast.error(res.data.message);
            else{
                onClose();
                if (onSuccess) onSuccess(pin);
            }}
            catch(error){
                toast.error(error.response?.data?.message || "Invalid PIN");
            }
        }
    };
    return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose} 
    >
      <div 
        className="bg-base-200 w-full max-w-sm rounded-3xl shadow-2xl p-8 border border-base-content/10 animate-fade-in-up relative overflow-hidden"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="absolute -top-16 -right-16 size-32 bg-primary/20 blur-3xl rounded-full"></div>
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="bg-base-100 p-4 rounded-2xl shadow-sm mb-4 border border-base-content/5">
            {mode === "setup" ? (
              <Shield className="size-8 text-primary" />
            ) : (
              <LockKeyhole className="size-8 text-primary" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-base-content">
            {mode === "setup" ? "Secure Your Vault" : "Enter Vault PIN"}
          </h2>
          <p className="text-sm text-base-content/60 mt-2">
            {mode === "setup" 
              ? "Create a 4-digit PIN to protect your private notes." 
              : "This note is protected. Please enter your 4-digit PIN."}
          </p>
          
          {mode === "setup" && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-left">
              <AlertTriangle className="size-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs text-red-500/90 leading-relaxed">
                <strong className="block mb-1">Warning: Irreversible Action</strong>
                Please save this PIN somewhere safe right now. If you forget it, it <strong>cannot be reset</strong> and your protected notes will be lost permanently.
              </p>
            </div>
          )}
        </div>
        {/* Form triggers your handleSubmit */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-base-content/70">
              {mode === "setup" ? "Create PIN" : "Vault PIN"}
            </label>
            <div className="relative">
              <input 
                type={showPin ? "text" : "password"} 
                maxLength={4}
                placeholder="••••"
                value={pin}
                onChange={(e)=>setPin(e.target.value)}
                className="input input-bordered input-primary w-full text-center text-2xl tracking-[1em] font-mono h-14 bg-base-100/50 focus:bg-base-100 transition-colors pr-12"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-primary transition-colors"
                onClick={() => setShowPin(!showPin)}
              >
                {showPin ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
          </div>
          {mode === "setup" && (
            <div className="space-y-2 pt-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-base-content/70">
                Confirm PIN
              </label>
              <div className="relative">
                <input 
                  type={showPin ? "text" : "password"} 
                  maxLength={4}
                  placeholder="••••"
                  value={confirmPin}
                  onChange={(e)=>setConfirmPin(e.target.value)}
                  className="input input-bordered input-primary w-full text-center text-2xl tracking-[1em] font-mono h-14 bg-base-100/50 focus:bg-base-100 transition-colors pr-12"
                />
              </div>
            </div>
          )}
          <div className="flex gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="btn btn-ghost flex-1 rounded-xl"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary flex-1 rounded-xl"
            >
              {mode === "setup" ? "Set PIN" : "Unlock"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default VaultModal;

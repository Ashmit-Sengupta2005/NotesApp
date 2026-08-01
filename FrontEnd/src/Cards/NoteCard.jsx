import { useState } from "react";
import { Calendar, Pin, Trash2, Lock } from "lucide-react";
import { useNavigate } from "react-router";
import { api } from "../lib/axios";
import toast from "react-hot-toast";
import {useAuth } from "../Context/AuthContext.jsx";
import VaultModal from "./VaultModal.jsx";
const stripHtml = (html) => {
  if (!html) return "";
  
  // Replace HTML line breaks with spaces
  let text = html.replace(/<\/p>|<\/li>|<br\s*\/?>/gi, " ");
  
  // Strip out HTML tags
  text = text.replace(/<[^>]*>?/gm, "");
  
  // Decode HTML entities (like &nbsp;)
  const txt = document.createElement("textarea");
  txt.innerHTML = text;
  return txt.value.trim();
};

function NoteCard({note, index, onDelete, onUpdate}) {
  const [showModal, setShowModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [pinLoading, setPinLoading] = useState(false);
  const [showVault,setShowVault]=useState(false);
  const [vaultAction, setVaultAction] = useState("toggle");
  const {user}=useAuth();
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (note.isProtected) {
      setVaultAction("view");
      setShowVault(true);
    } else {
      navigate(`/note/${note._id}`);
    }
  };

  const handleToggleProtect=async(pin)=>{
    try{
      const res = await api.put(`/notes/${note._id}/protect`, { pin });
      if (onUpdate) onUpdate(res.data.note);
    }
    catch(error){
      console.error("Error toggling protection:", error);
      toast.error(error.response?.data?.message || "Failed to update protection");
    }
  };
  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    try {
      await api.delete(`/notes/${note._id}`);
      toast.success("Note deleted successfully!");
      if (onDelete) onDelete(note._id);
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error(error.response?.data?.message || "Failed to delete note");
    } finally {
      setDeleteLoading(false);
      setShowModal(false);
    }
  };

  const handleTogglePin = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (pinLoading) return;
    
    setPinLoading(true);
    try {
      const res = await api.put(`/notes/${note._id}/pin`);
      if (onUpdate) onUpdate(res.data.note);
    } catch (error) {
      console.error("Error pinning note:", error);
      toast.error(error.response?.data?.message || "Failed to pin note");
    } finally {
      setPinLoading(false);
    }
  };

  return (
    <>
      <div 
        onClick={handleCardClick}
        className="group bg-base-100/60 backdrop-blur-md border border-base-content/10 rounded-2xl p-5 shadow-lg flex flex-col justify-between min-h-[160px] hover:shadow-2xl hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 ease-out animate-fade-in-up cursor-pointer"
        style={{ animationDelay: `${index * 80}ms` }}>
        <div>
          <div className="flex justify-between items-start gap-2 mb-2">
            <h2 className="text-primary text-xl font-bold transition-all duration-300 ease-out group-hover:translate-x-1">
              {note.title}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span 
                title={note.isProtected ? "Unlock Note" : "Lock Note"}
                className={`${note.isProtected ? "text-primary" : "text-base-content/30 hover:text-base-content/80"} transition-colors duration-300 cursor-pointer`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  
                  if (!user?.hasVaultPin) {
                    // They don't have a Vault PIN set up yet! Show modal to create one.
                    setVaultAction("toggle");
                    setShowVault(true);
                  } else if (note.isProtected) {
                    // The note is locked. We need the PIN to unlock it.
                    setVaultAction("toggle");
                    setShowVault(true);
                  } else {
                    // The note is unlocked AND they already have a PIN. Lock it immediately!
                    handleToggleProtect(); 
                  }
                }}
              >
                <Lock className="size-5" />
              </span>
              <span 
                title={note.isPinned ? "Unpin Note" : "Pin Note"}
                onClick={handleTogglePin}
                className={`${note.isPinned ? "text-primary" : "text-primary/20 group-hover:text-primary/60"} transition-colors duration-300 cursor-pointer hover:scale-110 active:scale-95`}
              >
                <Pin className={`size-5 ${note.isPinned ? "fill-primary" : ""}`} />
              </span>
            </div>
          </div>
          <p className="text-amber-500 text-sm leading-relaxed mb-4 break-words line-clamp-4 group-hover:text-amber-300 transition-colors duration-300">
            {note.isProtected ? "🔒 This note is protected. Enter your Vault PIN to view." : stripHtml(note.content)}
          </p>
        </div>
        <div className="flex items-center justify-between gap-4 text-xs text-base-content/50 border-t border-base-content/5 pt-3">
          <div className="flex gap-3">
            <Calendar className="size-3.5 display-inline" />
            <span> {new Date(note.updatedAt).toLocaleString()}</span>
          </div>
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowModal(true);
            }}
            className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 hover:text-red-400 active:scale-95 transition-all duration-200"
            title="Delete Note"
          >
            <Trash2 className="size-5 transition-transform duration-200 hover:scale-110" />
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Backdrop overlay */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-default"
            onClick={() => setShowModal(false)}
          ></div>
          
          {/* Modal box */}
          <div className="relative bg-base-200 border border-base-content/10 p-6 rounded-2xl max-w-sm w-full shadow-2xl mx-4 animate-fade-in-up">
            <h3 className="font-bold text-lg text-error flex items-center gap-2 mb-2">
              <Trash2 className="size-5" /> Delete Note
            </h3>
            <p className="text-sm text-base-content/80 mb-6 leading-relaxed">
              Are you sure you want to permanently erase this note? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                type="button"
                className="btn btn-ghost btn-sm rounded-lg" 
                onClick={() => setShowModal(false)}
              >
                Keep Note
              </button>
              <button 
                type="button"
                className="btn btn-error btn-sm rounded-lg flex items-center gap-1.5" 
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  <span>Erase Note</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
            {/* Vault Modal */}
      {showVault && (
        <VaultModal 
          mode={user?.hasVaultPin ? "verify" : "setup"} 
          onClose={() => {
            setShowVault(false)}
          }
          onSuccess={(pin) => {
            if (vaultAction === "toggle") {
              handleToggleProtect(pin);
            } else if (vaultAction === "view") {
              navigate(`/note/${note._id}`, { state: { vaultPin: pin } });
            }
          }}
        />
      )}

    </>
  );
}

export default NoteCard;
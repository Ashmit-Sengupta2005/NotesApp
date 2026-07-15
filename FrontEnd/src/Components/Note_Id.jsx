import { useParams, useNavigate, Link } from "react-router";
import { useEffect, useState } from "react";
import { api } from "../lib/axios";
import toast from "react-hot-toast";
import RateLimitedUI from "./RateLimitedUI";
import Loading from "./Loading";
import ErrorPage from "./ErrorPage";
import { ArrowLeftIcon, Calendar, Trash2, Edit } from "lucide-react";

const Note_Id = () => {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const [errorFound,setErrorFound]=useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const data = (await api.get(`/notes/${id}`)).data;
        console.log(data);
        setNote(data);
        setRateLimited(false);
      } catch (error) {
        console.log("Error while fetching the note id");
        console.log(error.message);
        if (error.response?.status === 429) {
          setRateLimited(true);
        } else {
          setErrorFound(true);
          toast.error("Failed to get the Note");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [id]);

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    try {
      await api.delete(`/notes/${id}`);
      toast.success("Note deleted successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error(error.response?.data?.message || "Failed to delete note");
    } finally {
      setDeleteLoading(false);
      setShowModal(false);
    }
  };

  return (
    <>
      {errorFound&& <ErrorPage/>}
      {!errorFound && rateLimited && <RateLimitedUI />}
      {!errorFound && !rateLimited && loading && <Loading message="Loading note details..." description="Fetching your note content..." />}
      {!errorFound && !rateLimited && !loading && note && (
        <div className="bg-base-300 min-h-screen flex flex-col justify-center items-center p-4 md:p-6 animate-fade-in-up">
          <div className="max-w-3xl w-full flex flex-col gap-4">
            
            {/* Header controls: Back, Edit, Delete */}
            <div className="flex justify-between items-center w-full">
              <Link
                to={"/"}
                className="group btn btn-ghost btn-sm bg-base-100 rounded-xl gap-2 text-base-content/85 shadow-md hover:bg-base-200 transition-all duration-300 border border-base-content/10"
              >
                <ArrowLeftIcon size={16} className="transition-transform duration-200 group-hover:-translate-x-1" />
                <span>Back to Home</span>
              </Link>
              
              <div className="flex gap-2">
                <Link
                  to={`/note/${id}/edit`}
                  className="btn btn-warning btn-sm rounded-xl gap-1.5 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Edit size={14} />
                  <span>Edit</span>
                </Link>
                <button
                  onClick={() => setShowModal(true)}
                  className="btn btn-error btn-sm rounded-xl gap-1.5 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            </div>

            {/* Note Card */}
            <div className="bg-base-100/60 backdrop-blur-md border border-base-content/10 rounded-3xl p-6 md:p-8 shadow-xl space-y-4">
              
              {/* Title */}
              <h1 className="text-3xl font-extrabold text-amber-400 leading-tight">
                {note.title}
              </h1>

              {/* Date Metadata */}
              <div className="flex items-center gap-2 text-xs text-base-content/50 border-b border-base-content/5 pb-4">
                <Calendar className="size-3.5" />
                <span>Last updated: {new Date(note.updatedAt).toLocaleString()}</span>
              </div>

              {/* Styled Rich Text Div */}
              <div
                className="rich-text-content max-w-none text-base-content/90 leading-relaxed min-h-[150px] whitespace-pre-line focus:outline-none"
                dangerouslySetInnerHTML={{ __html: note.content }}
              />
              
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
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
    </>
  );
};

export default Note_Id;
import { useParams, useNavigate, Link } from "react-router";
import { useEffect, useState } from "react";
import { api } from "../lib/axios";
import toast from "react-hot-toast";
import RateLimitedUI from "../Components/RateLimitedUI";
import Loading from "../Components/Loading";
import { ArrowLeftIcon,Loader2} from "lucide-react";
import ReactQuill from "react-quill-new";
function NoteEditPage() {
    const [title,setTitle]=useState("");
    const [content,setContent]=useState("");
    const [loading,setLoading]=useState(true);
    const [saving,setSaving]=useState(false);
    const [rateLimited,setRateLimited]=useState(false);
    const {id}=useParams();
    const navigate=useNavigate();
    useEffect(() => {
      const timer = setTimeout(() => {
        const toolbar = document.querySelector(".ql-toolbar");
        if (!toolbar) return;
        const tooltips = {
          ".ql-bold": "Bold",
          ".ql-italic": "Italic",
          ".ql-underline": "Underline",
          ".ql-blockquote": "Blockquote",
          '.ql-list[value="ordered"]': "Ordered List",
          '.ql-list[value="bullet"]': "Bullet List",
          ".ql-clean": "Clear Formatting",
          ".ql-picker.ql-header": "Header Style"
        };
  
        Object.entries(tooltips).forEach(([selector, text]) => {
          const elements = toolbar.querySelectorAll(selector);
          elements.forEach((el) => {
            el.setAttribute("title", text);
          });
        });
      }, 100);
      return () => clearTimeout(timer);
    }, [loading]);

    useEffect(()=>{
      const fetchNotes=async()=>{
        try{
        const notes= await api.get(`/notes/${id}`);
        setTitle(notes.data.title);
        setContent(notes.data.content);}
        catch(error){
          console.log("Error while fetching data");
          console.log(error.message);
          if(error.response?.status===429){
            setRateLimited(true);}
          else{
            toast.error("Failed to get the Note");
          }
        }
        finally{
          setLoading(false);
        }};
      fetchNotes();
    },[id])
  const handleSubmit=async (e)=>{
    e.preventDefault();
    // Safety check: Don't allow empty notes
    const textOnly = content.replace(/<[^>]*>?/gm, "").trim();
    if (!title.trim() || !textOnly) {
      toast.error("Please fill in all fields");
      return;
    }
    setSaving(true);
    try{
    const newNote={title,content }
    await api.put(`/notes/${id}`,newNote);
    toast.success("Note updated successfully!");
    setSaving(false);
    navigate(`/note/${id}`);}
    catch(error){
      console.error(error);
      toast.error("Failed to update note");
    }
    finally{
      setSaving(false);
    }
  }
  return (
    <div>
      {rateLimited&&<RateLimitedUI/>}
     {loading && !rateLimited&& <Loading/>}
     {!rateLimited&&!loading&&(
        <div className="bg-base-300 min-h-screen flex flex-col justify-center items-center p-4 md:p-6 animate-fade-in-up">
           <div className="max-w-3xl w-full flex flex-col gap-4">
             
             {/* Header controls: Back, Edit, Delete */}
             <div className="flex justify-between items-center w-full">
               <Link
                 to={`/note/${id}`}
                 className="group btn btn-ghost btn-sm bg-base-100 rounded-xl gap-2 text-base-content/85 shadow-md hover:bg-base-200 transition-all duration-300 border border-base-content/10"
               >
                 <ArrowLeftIcon size={16} className="transition-transform duration-200 group-hover:-translate-x-1" />
                 <span>Back</span>
               </Link>

             </div>
              {/* Form */}
           <form onSubmit={handleSubmit} className="space-y-5">
             {/* Note Title Input */}
             <div className="form-control w-full">
               <label className="label">
                 <span className="label-text font-semibold text-base-content/75">Note Title</span>
               </label>
               <input 
                 type="text" 
                 placeholder="e.g., Ideas, Reminders" 
                 value={title}
                 onChange={(e) => setTitle(e.target.value)}
                 className="input input-bordered w-full rounded-xl focus:border-amber-400 focus:outline-none bg-base-200/50"
                 required
                 disabled={saving || loading}
               />
             </div>

             {/* Note Content Rich Text Editor */}
             <div className="form-control w-full relative">
               <label className="label mb-1">
                 <span className="label-text font-semibold text-base-content/75">Note Content</span>
               </label>
               <div className="relative">
                 <ReactQuill 
                   theme="snow"
                   value={content}
                   onChange={setContent}
                   placeholder="Type your notes here..."
                   readOnly={saving || loading}
                   modules={{
                     toolbar: [
                       [{ header: [1, 2, 3, false] }],
                       ["bold", "italic", "underline", "blockquote"],
                       [{ list: "ordered" }, { list: "bullet" }],
                       ["clean"],
                     ],
                   }}
                 />
                 
                  {/* Buttons overlay at the bottom-right of the editor */}
                  <div className="absolute bottom-3 right-3 flex gap-2 z-10 bg-base-100/90 backdrop-blur-sm p-2 rounded-2xl border border-base-content/10 shadow-lg">
                    <Link
                      to={`/note/${id}`}
                      className={`btn bg-error/10 text-error border border-error/20 rounded-xl hover:bg-error/20 hover:border-error/30 ${saving ? "pointer-events-none opacity-50" : ""}`}
                    >
                      Cancel
                    </Link>
                    <button 
                      type="submit" 
                      className="btn bg-success/10 text-success border border-success/20 rounded-xl hover:bg-success/20 hover:border-success/30 flex items-center gap-1.5 px-6"
                      disabled={loading|| saving}
                    >
                      {saving ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <span>Save</span>
                      )}
                    </button>
                  </div>
               </div>
             </div>
           </form>
           </div>
         </div>
      )} 
    </div>
  )
}

export default NoteEditPage;

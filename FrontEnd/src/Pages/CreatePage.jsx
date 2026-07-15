import { useState, useEffect } from "react";
import { ArrowLeftIcon, NotebookPen, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { api } from "../lib/axios";
import toast from "react-hot-toast";
import ReactQuill from "react-quill-new";

const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Add native tooltips to Quill toolbar buttons
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
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Strip HTML tags to verify actual text content is not empty
    const textOnly = content.replace(/<[^>]*>?/gm, "").trim();
    if (!title.trim() || !textOnly) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true); 
    try {
      await api.post("/notes", { title, content });
      toast.success("Note created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error creating note:", error);
      toast.error(error.response?.data?.message || "Failed to create note");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-base-300 min-h-screen flex flex-col justify-center items-center p-4 md:p-6 animate-fade-in-up">
      <div className="max-w-3xl w-full flex flex-col gap-4">
        {/* Back Button */}
        <Link 
          to={"/"} 
          className="group btn btn-ghost btn-sm bg-base-100 rounded-xl gap-2 text-base-content/85 self-start shadow-md hover:bg-base-200 transition-all duration-300 border border-base-content/10"
        > 
          <ArrowLeftIcon size={16} className="transition-transform duration-200 group-hover:-translate-x-1" />
          <span>Back to Home</span>
        </Link>

        {/* Card Container */}
        <div className="bg-base-100/60 backdrop-blur-md border border-base-content/10 rounded-3xl p-6 md:p-8 shadow-xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary/10 p-2.5 rounded-xl border border-primary/20 text-primary">
              <NotebookPen size={22} />
            </div>
            <h2 className="text-2xl font-bold text-amber-400">Create New Note</h2>
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
                disabled={loading}
              />
            </div>

            {/* Note Content Rich Text Editor */}
            <div className="form-control w-full">
              <label className="label mb-1">
                <span className="label-text font-semibold text-base-content/75">Note Content</span>
              </label>
              <ReactQuill 
                theme="snow"
                value={content}
                onChange={setContent}
                placeholder="Type your notes here..."
                readOnly={loading}
                modules={{
                  toolbar: [
                    [{ header: [1, 2, 3, false] }],
                    ["bold", "italic", "underline", "blockquote"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["clean"],
                  ],
                }}
              />
            </div>

            {/* Submit Action Button */}
            <button 
              type="submit" 
              className="btn btn-primary w-full rounded-xl flex items-center justify-center gap-2 mt-4 font-semibold text-lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  <span>Creating Note...</span>
                </>
              ) : (
                <span>Create Note</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;

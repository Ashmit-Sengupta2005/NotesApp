import { Link } from "react-router";
import { StickyNote, Plus, Sparkles } from "lucide-react";

function NotesNotFound() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-20 text-center animate-fade-in-up">
      {/* Glow Effect Background */}
      <div className="relative w-full max-w-md bg-base-100/40 backdrop-blur-lg border border-base-content/10 rounded-3xl p-8 md:p-10 shadow-2xl overflow-hidden">
        {/* Decorative glowing blobs */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Animated Icon Cluster */}
        <div className="relative mx-auto w-24 h-24 mb-6 flex items-center justify-center">
          {/* Pulsing ring */}
          <div className="absolute inset-0 bg-amber-400/10 rounded-full animate-ping opacity-75"></div>
          
          {/* Main Icon container */}
          <div className="relative bg-base-200/80 border border-base-content/5 p-5 rounded-2xl shadow-inner text-amber-400">
            <StickyNote className="size-10 stroke-[1.5]" />
          </div>

          {/* Mini floating decoration icons */}
          <div className="absolute top-1 right-1 text-primary animate-bounce" style={{ animationDuration: "3s" }}>
            <Sparkles className="size-5 fill-primary/20" />
          </div>
          <div className="absolute bottom-2 -left-2 text-base-content/30 animate-pulse">
            <Plus className="size-4" />
          </div>
        </div>

        {/* Typography */}
        <h3 className="text-2xl font-black text-base-content tracking-tight mb-3">
          Your Knowledge Base is Empty
        </h3>
        <p className="text-base-content/70 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
          Capture thoughts, structure plans, and store ideas. Create your first note to kickstart your workspace!
        </p>

        {/* Interactive CTA button */}
        <Link 
          to="/create" 
          className="group relative inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-base-100 font-bold rounded-2xl shadow-lg hover:shadow-amber-500/20 active:scale-[0.98] transition-all duration-300 overflow-hidden"
        >
          {/* Subtle button reflection/shine effect */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
          
          <Plus className="size-5 transition-transform duration-300 group-hover:rotate-90" />
          <span>Create First Note</span>
        </Link>
      </div>
    </div>
  );
}

export default NotesNotFound;
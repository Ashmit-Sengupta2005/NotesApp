import { Notebook } from "lucide-react";

function Loading({ 
  message = "Loading your notes...", 
  description = "This might take a while. Please hold on!" 
}) {
  return (
    <div className="flex flex-col justify-center items-center py-20 px-4 text-center">
      <div className="relative w-20 h-20 flex items-center justify-center mb-6">
        {/* Outer custom spinning border */}
        <div className="absolute inset-0 w-full h-full border-4 border-amber-400/10 border-t-amber-400 rounded-full animate-spin"></div>
        {/* Inner pulsing notebook icon container */}
        <div className="bg-amber-400/10 p-3.5 rounded-full border border-amber-400/20 text-amber-400 animate-pulse">
          <Notebook size={28} />
        </div>
      </div>
      <h3 className="text-xl font-bold text-amber-400 mb-2 tracking-wide">
        {message}
      </h3>
      <p className="text-sm text-base-content/60 max-w-xs leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export default Loading;
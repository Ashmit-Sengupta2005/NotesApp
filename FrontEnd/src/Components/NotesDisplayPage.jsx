import NoteCard from "../Cards/NoteCard.jsx";
import { Pin } from "lucide-react";

function NotesDisplayPage({notes, onDelete, onUpdate}) {
  const pinnedNotes = notes.filter(note => note.isPinned);
  const otherNotes = notes.filter(note => !note.isPinned);

  return (
    <div className="p-4 mx-auto w-full">
      {pinnedNotes.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-base-content/80 mb-4 flex items-center gap-2">
            <Pin className="size-5 text-primary" /> Pinned Notes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-between items-start gap-6">
            {pinnedNotes.map((note, index) => (
              <NoteCard key={note._id} note={note} index={index} onDelete={onDelete} onUpdate={onUpdate} />
            ))}
          </div>
        </div>
      )}

      {otherNotes.length > 0 && (
        <div>
          {pinnedNotes.length > 0 && <h2 className="text-xl font-bold text-base-content/80 mb-4">Other Notes</h2>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-between items-start gap-6">
            {otherNotes.map((note, index) => (
              <NoteCard key={note._id} note={note} index={index} onDelete={onDelete} onUpdate={onUpdate} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotesDisplayPage;
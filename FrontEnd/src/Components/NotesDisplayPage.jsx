import NoteCard from "../Cards/NoteCard.jsx";

function NotesDisplayPage({notes, onDelete}) {
  return (
    <div 
    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-between items-start p-4 gap-6">
        { notes.map((note, index)=>(
            <NoteCard key={note._id} note={note} index={index} onDelete={onDelete}/>)
        )}
    </div>
  )
}

export default NotesDisplayPage
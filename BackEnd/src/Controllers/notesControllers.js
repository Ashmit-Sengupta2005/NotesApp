import { Note } from "../Models/Note.js";
// notes for logged in user
export const getNotes = async (req, res) => {
    try{
        const notes= await Note.find({user:req.user.id}).sort({createdAt:-1});
        res.status(200).json(notes);
    }
    catch(error){
        console.log(error.message);
        res.status(500).json({message:"Failed to get all notes.Internal Server Error"});
    }
}; 
// Get a single note by id
export const getNoteById=async (req,res)=>{
    try{
        const id=req.params.id;
        const note=await Note.findOne({_id:id,user:req.user.id});
        if(!note){
            return res.status(404).json({message:"Note not found"});}
        res.status(200).json(note);}
    catch(error){
        console.log(error.message);
        res.status(500).json({message:"Failed to get note by ID.Internal Server Error"});}
}
//Create a new note linked to the logged in user
export const createNote = async (req, res) => {
    try{
        const {title,content}=req.body;
        console.log(title,content);
        const newNote= new Note({title,content,user:req.user.id});
        await newNote.save();
        res.status(201).json({message:"Note created successfully", newNote});
    }
    catch(error){
        console.log(error.message);
        res.status(500).json({message:"Failed to create a new note.Internal Server Error"}); 
    }
};

export const updateNote =async (req, res) => {
    try{
        const id=req.params.id;
        const {title,content}=req.body;
        const updatedNote=await Note.findOneAndUpdate({_id:id,user:req.user.id},{title,content},{new:true});
        if(!updatedNote){
            return res.status(404).json({message:"Note not found"});
        }
        res.status(200).json({message:"Note updated successfully",updatedNote});
    }
    catch(error){
        console.log(error.message);
        res.status(500).json({message:"Failed to update a note.Internal Server Error"}); 
    }
}; 

export const deleteNote = async (req, res) => {
    try{
        const id=req.params.id;
        const delNote=await Note.findOneAndDelete({_id:id,user:req.user.id});
        if(!delNote){
            return res.status(404).json({message:"Note not found"});}
        res.status(200).json({message:"Note deleted successfully",delNote});
    }
    catch(error){
        console.log(error.message);
        res.status(500).json({message:"Failed to delete the note.Internal Server Error"})
    }
};

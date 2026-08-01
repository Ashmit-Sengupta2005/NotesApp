import { Note } from "../Models/Note.js";
import bcrypt from "bcryptjs";
// notes for logged in user
export const getNotes = async (req, res) => {
    try{
        const notes= await Note.find({user:req.user.id}).sort({createdAt:-1});
        const safeNotes=notes.map(note=>{
            if(!note.isProtected)
                return note;
            else{
                return {...note.toObject(),content:"🔒 This note is protected. Enter your Vault PIN to view."};
            }})
        res.status(200).json(safeNotes);
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
            
        if (note.isProtected) {
            return res.status(200).json({...note.toObject(), content: "🔒 This note is protected. Enter your Vault PIN to view."});
        }
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
export const togglePinNote=async(req,res)=>{
    try{
        const {id}=req.params;
        const note=await Note.findById(id);
        if(!note){
            return res.status(404).json({message:"Note not found"}); 
        }
        if(note.user.toString()!==req.user.id.toString()){
            return res.status(403).json({message:"Not authorized"});}
        note.isPinned=!note.isPinned;
        await note.save();
        res.status(200).json({message:"Note pin status updated",note});
    }
    catch(error){
        console.log("Error in togglePinNote controller: ",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
};

export const toggleProtectNote=async(req,res)=>{
    try{
        const {id}=req.params;
        const {pin}=req.body;
        const note=await Note.findById(id);
        if(!note){
            return res.status(404).json({message:"Note Not found"});
        }
        if(note.user.toString()!==req.user.id.toString()){
            return res.status(403).json({message:"Not authorized"});
        }
        if(note.isProtected){
            if(!pin){
                return res.status(400).json({message:"PIN required to unlock note"});}
            if(!req.user.vaultPin){
                return res.status(400).json({message:"User does not have a vault PIN set"});
            }
            const isMatch=await bcrypt.compare(pin,req.user.vaultPin);
            if(!isMatch){
                return res.status(401).json({message:"Invalid PIN"}); }
        }
        note.isProtected=!note.isProtected;
        await note.save();
        res.status(200).json({message:"Note Protection Updated", note});
    }
    catch(error){
      console.log("Error in toggleProtectNote: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });  
    }
};

export const unlockNote=async(req,res)=>{
    try{
         const { id } = req.params;
         const { pin } = req.body; 
         const note = await Note.findById(id);
         if (!note) 
            return res.status(404).json({ message: "Note not found" });
         if (note.user.toString() !== req.user.id.toString())
             return res.status(403).json({ message: "Not authorized" });
          if (!note.isProtected) {
            return res.status(200).json(note); 
        }
         if (!pin) 
            return res.status(400).json({ message: "PIN required to view note" });
         if (!req.user.vaultPin) 
            return res.status(400).json({ message: "No Vault PIN set up" });
        const isMatch = await bcrypt.compare(pin, req.user.vaultPin);
        if (!isMatch) return res.status(401).json({ message: "Invalid Vault PIN" });
        res.status(200).json(note);}
    catch(error){
        console.log("Error in unlockNote: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

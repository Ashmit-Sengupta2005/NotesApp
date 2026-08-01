import Navbar from "../Components/Navbar.jsx";
import Loading from "../Components/Loading.jsx";
import { useEffect, useState } from "react";
import RateLimitedUI from "../Components/RateLimitedUI.jsx";
import toast from "react-hot-toast";
import NotesNotFound from "../Components/NotesNotFound.jsx";
import NotesDisplayPage from "../Components/NotesDisplayPage.jsx";
import { api } from "../lib/axios.jsx";
const HomePage = () => {
  const [rateLimited,setRateLimited]=useState(false);
  const [notes,setNotes]=useState([]);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{
   const fetchNotes=async()=>{
    try{
      const res=await api.get("/notes");
      console.log(res); 
      setNotes(res.data);
      setRateLimited(false);
    }
    catch(error){
      console.log("Error while fetching notes");
      console.log(error.message);
      if(error.response?.status===429){
        setRateLimited(true);
      }
      else{
        toast.error("Failed to load notes");
      }
    }
    finally{
      setLoading(false);
    }
   }
   fetchNotes()},[]);
  const handleDeleteNote = (id) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
  };

  const handleUpdateNote = (updatedNote) => {
    setNotes((prevNotes) => prevNotes.map((note) => note._id === updatedNote._id ? updatedNote : note));
  };

  return (
    <div className="min-h-screen bg-base-300">
      <Navbar/>
      {rateLimited&& <RateLimitedUI/>}
      {loading && !rateLimited && <Loading/>}
      {!rateLimited && !loading && notes.length===0&& <NotesNotFound/>}
      {!rateLimited && !loading &&notes.length>0&& <NotesDisplayPage notes={notes} onDelete={handleDeleteNote} onUpdate={handleUpdateNote}/> }
      </div>
  )
}

export default HomePage;

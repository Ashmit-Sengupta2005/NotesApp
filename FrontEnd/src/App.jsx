import { Routes, Route } from "react-router";
import HomePage from "./Pages/HomePage";
import CreatePage from "./Pages/CreatePage";
import NoteEditPage from "./Pages/NoteEditPage";
import Note_Id from "./Components/Note_Id";
import ErrorPage from "./Components/ErrorPage";
import ProtectedRoutes from "./Components/ProtectedRoutes.jsx";
import LoginPage from "./Pages/LoginPage.jsx";
import RegisterPage from "./Pages/RegisterPage.jsx";
const App = () => {
  return (
    <div
      data-theme="dracula"
      className="min-h-screen bg-base-300 text-base-content"
    >
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <HomePage />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoutes>
              <CreatePage />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/note/:id"
          element={
            <ProtectedRoutes>
              <Note_Id />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/note/:id/edit"
          element={
            <ProtectedRoutes>
              <NoteEditPage />
            </ProtectedRoutes>
          }
        />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
};

export default App;

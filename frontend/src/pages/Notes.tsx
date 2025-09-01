import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useAuthStore } from "../store/auth";

interface Note {
  _id: string;
  title: string;
  content: string;
}

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const navigate = useNavigate();
  const { clearAuth } = useAuthStore();

  // Fetch notes
  const fetchNotes = async () => {
    try {
      const res = await axios.get("/notes", { withCredentials: true });
      setNotes(res.data);
    } catch (err) {
      console.error("Fetch notes error", err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Add Note
  const handleAddNote = async () => {
    if (!title.trim() || !content.trim()) return;
    try {
      const res = await axios.post(
        "/notes",
        { title, content },
        { withCredentials: true }
      );
      setNotes([res.data, ...notes]);
      setTitle("");
      setContent("");
    } catch (err) {
      console.error("Add note error", err);
    }
  };

  // Update Note
  const handleUpdateNote = async () => {
    if (!editingNote) return;
    try {
      const res = await axios.put(
        `/notes/${editingNote._id}`,
        { title, content },
        { withCredentials: true }
      );
      setNotes(notes.map((n) => (n._id === editingNote._id ? res.data : n)));
      setEditingNote(null);
      setTitle("");
      setContent("");
    } catch (err) {
      console.error("Update note error", err);
    }
  };

  // Delete Note
  const handleDeleteNote = async (id: string) => {
    try {
      await axios.delete(`/notes/${id}`, { withCredentials: true });
      setNotes(notes.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Delete note error", err);
    }
  };

  // Logout
  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex flex-col">
      
      {/* Navbar */}
      <header className="flex justify-between items-center p-6 bg-black/20 backdrop-blur-lg">
        {/* Home Button */}
        <button
          onClick={() => navigate("/home")}
          className="px-4 py-2 bg-white text-purple-600 font-semibold rounded-lg shadow hover:bg-gray-200 transition"
        >
          ⬅ Home
        </button>

        <h1 className="text-2xl font-extrabold text-white drop-shadow-lg">
          ✨ My Notes Dashboard
        </h1>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow hover:bg-red-600 transition"
        >
          Logout
        </button>
      </header>

      {/* Main Section */}
      <main className="flex-1 overflow-auto px-8 py-6 flex gap-6">
        {/* Create / Edit Form */}
        <div className="w-1/3 bg-white/20 backdrop-blur-lg p-6 rounded-2xl shadow-lg text-white">
          <h2 className="text-xl font-bold mb-4">
            {editingNote ? "✏️ Edit Note" : "📝 Add New Note"}
          </h2>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 mb-4 rounded-lg bg-white/30 placeholder-white/80 text-white focus:ring-2 focus:ring-pink-400 outline-none"
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 mb-4 rounded-lg bg-white/30 placeholder-white/80 text-white focus:ring-2 focus:ring-pink-400 outline-none"
            rows={5}
          />
          {editingNote ? (
            <button
              onClick={handleUpdateNote}
              className="w-full py-3 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-500 transition"
            >
              Update Note
            </button>
          ) : (
            <button
              onClick={handleAddNote}
              className="w-full py-3 bg-green-400 text-black rounded-lg font-semibold hover:bg-green-500 transition"
            >
              Add Note
            </button>
          )}
        </div>

        {/* Notes List */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-6">
          {notes.map((note) => (
            <div
              key={note._id}
              className="p-5 bg-white/30 backdrop-blur-lg rounded-2xl shadow-lg hover:scale-105 transition"
            >
              <h3 className="text-lg font-bold text-white mb-2">{note.title}</h3>
              <p className="text-white/90 mb-4 break-words whitespace-pre-wrap">
                {note.content}
              </p>
              <div className="flex justify-between">
                <button
                  onClick={() => {
                    setEditingNote(note);
                    setTitle(note.title);
                    setContent(note.content);
                  }}
                  className="px-3 py-1 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteNote(note._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {notes.length === 0 && (
            <p className="col-span-full text-center text-white/80 text-lg">
              No notes yet. Start by adding one!
            </p>
          )}
        </div>
        
      </main>
      {/* Footer */}
      <footer className="text-center p-4 bg-black/20 backdrop-blur-md text-sm">
        © {new Date().getFullYear()} NotesApp. Designed and Developed By Jaivanth Koppula.
      </footer>
    </div>
  );
};

export default Notes;

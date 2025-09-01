📒 NotesApp – Full Stack MERN + TypeScript

A secure, modern, and responsive Notes Taking App built with React + Tailwind (frontend) and Node.js + Express + MongoDB (backend).
It supports User Authentication with OTP verification, JWT sessions, CRUD Notes (Create, Read, Update, Delete), and persistent storage.

---

🚀 Features

🔐 User Authentication

Register with Name, Email, Password + OTP Verification

Login with JWT authentication

Logout with token clearance

📝 Notes Management

Create, Edit, Delete, View notes

Notes are saved securely per user

Only logged-in users can manage their notes

🎨 Modern UI

Built with Tailwind CSS

Gradient backgrounds & responsive layout

Full-screen views for Welcome, Register, Login, Home, Notes

👤 User Profile

Displays logged-in user name in the navbar

Logout option via profile dropdown

---

⚙️ Tech Stack

Frontend: React, TypeScript, Vite, Tailwind CSS

Backend: Node.js, Express, TypeScript

Database: MongoDB (Mongoose ORM)

Auth: JWT, OTP (Email-based)

Other: Axios, Zod Validation

---

🛠️ Installation & Setup

1️⃣ Clone the Repository

git clone https://github.com/yourusername/NotesApp.git

cd NotesApp

2️⃣ Backend Setup

cd backend

npm install


Create a .env file in backend/:

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

EMAIL_USER=your_email

EMAIL_PASS=your_email_password

Start backend:

npm run dev


3️⃣ Frontend Setup

cd frontend

npm install


Create a .env file in frontend/:

VITE_API_URL=http://localhost:5000


Start frontend:

npm run dev

---

🔑 Usage

Register with Name, Email, Password → Get OTP → Verify

Login with Email & Password

Create / Edit / Delete notes

User stays logged in until logout

Profile dropdown shows username + logout

---

📌 Roadmap / Improvements

✅ Save Notes in DB (MongoDB)

✅ JWT Authentication

✅ OTP-based registration

🚀 Add Tags & Search in Notes

🚀 Dark Mode toggle

🚀 Deploy to Vercel (frontend) + Render (backend)

---

🤝 Contributing

Jaivanth Koppula

Pull requests are welcome!

Please open an issue for major changes first to discuss what you’d like to change.
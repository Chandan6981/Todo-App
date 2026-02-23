MERN TODO APP

This is a full stack Todo application built using the MERN stack. Users can register, log in, and manage their daily tasks. The application allows creating, updating, deleting, and marking tasks as completed.

Technologies Used

Frontend: React
Backend: Node.js and Express.js
Database: MongoDB
Authentication: JSON Web Token (JWT)

Features

User registration and login

Create new todo

Update existing todo

Delete todo

Mark todo as completed

Set priority, category, and due date

Project Structure
todo-app/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── App.js
│
└── README.md
Installation and Setup

Clone the repository:

git clone https://github.com/your-username/todo-app.git

Install backend dependencies:

cd backend
npm install

Create a .env file inside backend folder and add:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

Start backend server:

npm run dev

Install frontend dependencies:

cd frontend
npm install
npm start

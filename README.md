# MERN Todo App

A full stack Todo application built using the MERN stack (MongoDB,
Express.js, React, Node.js). This application allows users to register,
log in, and manage their daily tasks efficiently.


## Features

-   User Authentication (Register / Login)
-   Create new todo
-   Update existing todo
-   Delete todo
-   Mark todo as completed
-   Set priority, category, and due date
-   Protected routes using JWT


## Tech Stack

Frontend: - React - Axios - React Router

Backend: - Node.js - Express.js - MongoDB - Mongoose - JSON Web Token
(JWT) - bcrypt


## Project Structure
```
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
├── ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── App.js
│
└── README.md
```

## Installation & Setup

1.  Clone the repository

- git clone https://github.com/your-username/todo-app.git 
- cd todo-app

2.  Setup Backend

- cd backend 
- npm install

Create a .env file inside the backend folder and add:

- PORT=5000 
- MONGO_URI=your_mongodb_connection_string
- JWT_SECRET=your_secret_key

Start the backend server:

- npm run dev

3.  Setup Frontend

- cd frontend 
- npm install 
- npm start


## Running Application

Frontend runs on: http://localhost:3000

Backend runs on: http://localhost:5000

## API Endpoints

-> Auth Routes

- POST /api/users/register

- POST /api/users/login

- GET /api/users/profile


-> Todo Routes

- GET /api/todos

- POST /api/todos

- PUT /api/todos/:id

- DELETE /api/todos/:id

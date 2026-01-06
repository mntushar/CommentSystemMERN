# MERN Comment System (JWT + Likes/Dislikes + Sorting + Pagination + Socket.io)

## Features
- JWT auth (Register/Login)
- Comment page is protected (must be authenticated)
- Add comments to a specific `pageId`
- Edit/Delete only your own comments
- Like/Dislike a comment only once per user (no toggling)
- Sorting: newest / most liked / most disliked
- Pagination
- Real-time updates using Socket.io
- Optional replies (one-level threading via `parentId`)

---

## Tech Stack
- Backend: Node.js, Express.js, MongoDB (Mongoose), JWT, Socket.io
- Frontend: React (Vite), Redux Toolkit, React Router, Axios, Sass

---

## Setup

### 1) Backend
```bash
cd backend
npm install
npm run dev```

### 2) Frontend
```bash
cd frontend
npm install
npm run dev```


## Conclusion
This MERN Comment System is a production-ready full-stack application designed with scalability, security, and clean architecture in mind.
It demonstrates best practices such as JWT-based authentication, authorization checks, server-side validation, pagination, sorting, and real-time communication using Socket.io.

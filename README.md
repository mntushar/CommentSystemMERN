# 🚀 MERN Comment System

A production-ready **MERN Stack Comment System** featuring secure JWT authentication, real-time communication with Socket.io, scalable background processing using BullMQ and RabbitMQ, and a clean REST API architecture.

Perfect as a learning project for modern full-stack development or as a reusable comment module for larger applications.

---

## ✨ Features

### 🔐 Authentication
- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Password Hashing with bcrypt

### 💬 Comment Management
- Create Comments
- Edit Own Comments
- Delete Own Comments
- One-level Nested Replies
- Page-based Comments (`pageId`)
- Server-side Validation
- Authorization Checks

### 👍 Reactions
- Like Comments
- Dislike Comments
- One Reaction Per User
- Prevent Duplicate Reactions

### 📄 Comment Listing
- Pagination
- Sort by:
  - Newest
  - Most Liked
  - Most Disliked

### ⚡ Real-Time Updates
- Socket.io Integration
- Instant Comment Updates
- Live Like/Dislike Updates
- Event-based Communication

### 🚀 Background Processing
- BullMQ Job Queue
- Redis Integration
- RabbitMQ Pub/Sub Workers
- Scalable Worker Architecture

### 🛡 Security
- JWT Authentication
- Helmet Security Middleware
- CORS Configuration
- Rate Limiting
- Request Validation using Zod

---

# 🏗 Project Architecture

```
CommentSystemMERN
│
├── backend
│   ├── routes
│   ├── services
│   ├── repository
│   ├── middleware
│   ├── validation
│   ├── realtime
│   ├── job_queue
│   ├── pub_sub
│   └── server.js
│
├── frontend
│   ├── React + Vite
│   ├── Redux Toolkit
│   ├── React Router
│   └── Socket.io Client
│
└── Terraform
```

---

# 🛠 Tech Stack

## Frontend

- React 19
- Vite
- Redux Toolkit
- React Router
- Axios
- Socket.io Client
- Sass

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Socket.io
- BullMQ
- Redis
- RabbitMQ
- Zod
- Helmet
- Morgan
- Pino Logger

---

# 📦 Backend Dependencies

- Express
- Mongoose
- JWT
- bcryptjs
- Socket.io
- BullMQ
- Redis
- RabbitMQ (amqplib)
- Helmet
- Morgan
- Rate Limiter
- Zod

---

# 📁 Folder Structure

```
backend/
│
├── library/
│   ├── auth_middleware
│   ├── jwt
│   ├── logger
│   ├── realtime
│   ├── job_queue
│   └── pub_sub
│
├── repository/
├── routes/
├── service/
├── validation/
├── model/
└── server.js
```

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/CommentSystemMERN.git
cd CommentSystemMERN
```

---

## Backend Setup

```bash
cd backend

npm install
```

Create a `.env` file.

Example:

```env
PORT=5000

MONGO_URI=

JWT_SECRET=

REDIS_URL=

RABBITMQ_URL=
```

Run development server

```bash
npm run dev
```

Production

```bash
npm start
```

---

## Frontend Setup

```bash
cd fontend

npm install
npm run dev
```

---

# 🚀 Available Scripts

## Backend

```bash
npm run dev
```

Runs:

- Express Server
- BullMQ Worker
- RabbitMQ Worker

Production

```bash
npm start
```

---

## Frontend

```bash
npm run dev
npm run build
npm run preview
```

---

# 🔄 Real-Time Flow

```
User Posts Comment
        │
        ▼
Express API
        │
        ▼
Database
        │
        ▼
BullMQ Queue
        │
        ▼
RabbitMQ Publisher
        │
        ▼
Socket.io Gateway
        │
        ▼
Connected Clients Receive Updates
```

---

# 🔒 Security Features

- JWT Authentication
- Protected APIs
- Authorization Middleware
- Helmet
- Rate Limiting
- Password Hashing
- Request Validation
- Input Sanitization

---

# 📈 Scalability

This project is designed with scalability in mind.

It separates:

- API Layer
- Business Logic
- Repository Layer
- Background Workers
- Pub/Sub System
- Real-Time Gateway

making it easy to scale horizontally.

---

# 🌟 Future Improvements

- Multi-level Replies
- Email Verification
- Refresh Token Authentication
- User Profile
- Image Attachments
- Admin Dashboard
- Comment Mentions
- Notification System
- Comment Search
- Docker Support
- Kubernetes Deployment

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push your branch
5. Open a Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

Developed with ❤️ using the MERN Stack.

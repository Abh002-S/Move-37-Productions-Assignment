# Move-37-Productions-Assignment

# 🗳️ Real-Time Polling Backend

This is a **real-time polling application backend** built with:

- [Express.js](https://expressjs.com/)
- [Prisma ORM](https://www.prisma.io/) (PostgreSQL)
- [Socket.IO](https://socket.io/) (real-time updates)
- [Node.js](https://nodejs.org/)
- [bcrypt](https://www.npmjs.com/package/bcrypt) for password hashing

It allows:
- User registration
- Poll creation with multiple options
- Voting (one vote per user per poll)
- Real-time results updates via WebSockets

---

## ⚡ Features
- REST API for users, polls, and votes
- Prisma schema with migrations
- Socket.IO for live poll updates
- Database seeding with sample data
- Input validation + unique voting rules

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL (or compatible database)
- npm (comes with Node.js)

---

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/Abh002-S/Move-37-Productions-Assignment
cd real-time-polling-backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up the `.env` file:**
```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
PORT=3000
```

4. **Prisma migrate & seed:**
```bash
# Generate Prisma client
npx prisma generate

# Create migration and push to your local PostgreSQL
npx prisma migrate dev --name init

# Seed the database (if seed file exists)
node prisma/seed.js
# or
npx prisma db seed
```

---

## 🧪 API Testing Procedure

### Health Check
- **Method:** GET  
- **URL:** `http://localhost:3000/health`

### Create a User
- **Method:** POST  
- **URL:** `http://localhost:3000/api/users`  
- **Body (JSON example):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "yourpassword"
}
```

### Get User by ID
- **Method:** GET  
- **URL:** `http://localhost:3000/api/users/{ID}`

### Create a Poll
- **Method:** POST  
- **URL:** `http://localhost:3000/api/polls`  
- **Body (JSON example):**
```json
{
  "title": "Your poll question",
  "options": ["Option 1", "Option 2", "Option 3"],
  "creatorId": 2,
  "isPublished": true
}
```

### Get Poll + Results
- **Method:** GET  
- **URL:** `http://localhost:3000/api/polls/{poll_ID}`

### Cast a Vote
- **Method:** POST  
- **URL:** `http://localhost:3000/api/polls/{poll_ID}/vote`  
- **Body (JSON example):**
```json
{
  "userId": 1,
  "pollOptionId": 1
}
```

- **Swagger UI:** `http://localhost:3000/api-docs`

---

## 💡 Real-Time Features
- Live poll results using Socket.IO
- Automatically updates all connected clients when a new vote is cast
- Ensures one vote per user per poll

---

## 🔒 Security
- Passwords are hashed using bcrypt
- Input validation ensures poll integrity and unique voting
- Real-time updates are limited to connected clients

---

## 📄 API Documentation
Full API documentation available via Swagger UI:  
`http://localhost:3000/api-docs`

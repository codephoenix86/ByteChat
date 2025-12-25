# FastChat - Real-Time Chat Application

A production-ready real-time chat application built with Node.js, Express, MongoDB, and Socket.io following REST best practices.

## Features

### Core Functionality
- **Authentication**: JWT-based auth with access/refresh tokens and token rotation
- **User Management**: CRUD operations, profile management, avatar upload, password change
- **Chat System**: Private and group chats with full CRUD operations
- **Real-Time Messaging**: Socket.io for instant messaging with status tracking
- **Message Management**: Send, edit, delete messages with pagination

### Production Features
- Structured logging with Winston (daily rotation)
- Input sanitization (XSS protection)
- Security headers (Helmet)
- Graceful shutdown handling
- Health check endpoint
- Environment validation
- Comprehensive error handling
- Request ID tracking
- Pagination, filtering, and sorting

## Prerequisites

- Node.js >= 18.0.0
- MongoDB >= 6.0
- npm >= 9.0.0

## Installation

```bash
# Clone repository
git clone https://github.com/codephoenix86/chat.git
cd chat

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Create required directories
mkdir -p logs uploads/public/avatars uploads/private

# Start server
npm run dev  # development
npm start    # production
```

## Environment Variables

```env
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://localhost:27017/fastchat
JWT_SECRET=your_jwt_secret_minimum_32_characters_long
JWT_REFRESH_SECRET=your_refresh_secret_minimum_32_characters_long
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
LOG_LEVEL=info
MAX_FILE_SIZE=5242880
```

## API Endpoints

### Authentication
```
POST   /api/v1/auth/signup         - Register new user
POST   /api/v1/auth/login          - User login
POST   /api/v1/auth/logout         - User logout
POST   /api/v1/auth/refresh-token  - Refresh access token
```

### Users
```
GET    /api/v1/users               - Get all users (paginated)
GET    /api/v1/users/:id           - Get user by ID
GET    /api/v1/users/me            - Get current user
PATCH  /api/v1/users/me            - Update current user
DELETE /api/v1/users/me            - Delete account
PUT    /api/v1/users/me/avatar     - Upload avatar
DELETE /api/v1/users/me/avatar     - Remove avatar
POST   /api/v1/users/me/password   - Change password
```

### Chats
```
GET    /api/v1/chats                      - Get user's chats (paginated)
POST   /api/v1/chats                      - Create new chat
GET    /api/v1/chats/:chatId              - Get single chat
PATCH  /api/v1/chats/:chatId              - Update chat
DELETE /api/v1/chats/:chatId              - Delete chat
GET    /api/v1/chats/:chatId/members      - Get chat members
POST   /api/v1/chats/:chatId/members      - Join chat / Add member
DELETE /api/v1/chats/:chatId/members/:userId - Remove member
DELETE /api/v1/chats/:chatId/members/me  - Leave chat
```

### Messages
```
POST   /api/v1/chats/:chatId/messages            - Send message
GET    /api/v1/chats/:chatId/messages            - Get messages (paginated)
GET    /api/v1/chats/:chatId/messages/:messageId - Get single message
PATCH  /api/v1/chats/:chatId/messages/:messageId - Edit message
DELETE /api/v1/chats/:chatId/messages/:messageId - Delete message
```

### Health
```
GET    /api/v1/health              - Health check
```

## Socket.io Events

### Client → Server
- `chat:join` - Join a chat room
- `chat:leave` - Leave a chat room
- `message:delivered` - Mark message as delivered
- `message:read` - Mark message as read
- `message:start-typing` - User started typing
- `message:stop-typing` - User stopped typing

### Server → Client
- `message:new` - New message received
- `message:updated` - Message was edited
- `message:deleted` - Message was deleted
- `user:online` - User came online
- `user:offline` - User went offline
- `message:start-typing` - Another user started typing
- `message:stop-typing` - Another user stopped typing

## Usage Examples

### Authentication
```bash
# Signup
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@example.com","password":"Test@1234"}'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john","password":"Test@1234"}'
```

### Pagination & Filtering
```bash
# Get users with pagination
GET /api/v1/users?page=2&limit=10

# Search users
GET /api/v1/users?search=john

# Filter by role and sort
GET /api/v1/users?role=admin&sort=-createdAt

# Get group chats only
GET /api/v1/chats?type=group&sort=-createdAt
```

### Chat Management
```bash
# Create group chat
POST /api/v1/chats
{
  "type": "group",
  "groupName": "Team Chat",
  "participants": ["userId1", "userId2"]
}

# Join group
POST /api/v1/chats/:chatId/members

# Leave group
DELETE /api/v1/chats/:chatId/members/me
```

## Project Structure

```
fastchat/
├── src/
│   ├── config/           # Configuration (DB, logger, env validation)
│   ├── constants/        # Application constants
│   ├── controllers/      # Route controllers
│   ├── middlewares/      # Express middlewares
│   │   └── validators/   # Input validation rules
│   ├── models/          # Mongoose models
│   ├── repositories/    # Database access layer
│   ├── routes/          # API routes
│   │   └── v1/          # API v1 routes
│   ├── services/        # Business logic
│   ├── sockets/         # Socket.io handlers
│   │   ├── handlers/    # Event handlers
│   │   ├── middlewares/ # Socket middleware
│   │   └── services/    # Socket services
│   ├── utils/           # Utility functions
│   └── app.js           # Express setup
├── uploads/             # User uploads
├── logs/                # Application logs
└── server.js            # Entry point
```

## Logging

Logs are stored in `logs/` directory:
- `combined-YYYY-MM-DD.log` - All logs
- `error-YYYY-MM-DD.log` - Error logs only

Logs are automatically rotated daily and kept for 14 days.

## Health Check

```bash
curl http://localhost:3000/api/v1/health
```

Response includes database connection status and uptime.

## License

ISC

## Author

Naresh Lohar

## Repository

https://github.com/codephoenix86/chat
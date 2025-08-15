# 🚌 Bus Booking System - Backend API

A well-structured Node.js backend application with MySQL database integration, following MVC architecture patterns.

## 🏗️ **Project Structure**

```
SQL/
├── config/
│   └── database.js          # Centralized database configuration
├── controllers/
│   └── userController.js    # User CRUD operations logic
├── routes/
│   └── userRoutes.js        # User API endpoints
├── index.js                 # Main server file
├── setupDb.js              # Database setup and table creation
├── test-crud.js            # CRUD operations test script
├── package.json            # Project dependencies and scripts
└── README.md               # This documentation
```

## 🚀 **Features Implemented**

### ✅ **CRUD Operations for Users**

- **CREATE** - `POST /users` - Add new users with name and email
- **READ** - `GET /users` and `GET /users/:id` - Retrieve users
- **UPDATE** - `PUT /users/:id` - Modify existing user details
- **DELETE** - `DELETE /users/:id` - Remove users from database

### 🔧 **Technical Features**

- **MVC Architecture** - Routes, Controllers, and Models separation
- **Express.js** web framework with proper middleware
- **MySQL2** with connection pooling for efficiency
- **Callback-based** database operations (no async/await)
- **Comprehensive error handling** with proper HTTP status codes
- **Input validation** for all endpoints
- **Detailed logging** for all database operations
- **Centralized configuration** management
- **Graceful shutdown** handling

## 📋 **Prerequisites**

- Node.js (v14 or higher)
- MySQL Server running locally
- npm or yarn package manager

## 🛠️ **Installation & Setup**

### 1. Install dependencies

```bash
npm install
```

### 2. Database Setup

Make sure MySQL is running and create a database named `testdb`, then run:

```bash
npm run setup
```

### 3. Start the server

```bash
npm start
```

The server will start on port 3000.

## 🔗 **API Endpoints**

### Base URL: `http://localhost:3000`

| Method   | Endpoint     | Description           | Controller Method |
| -------- | ------------ | --------------------- | ----------------- |
| `GET`    | `/`          | Health check endpoint | -                 |
| `GET`    | `/users`     | Get all users         | `getAllUsers`     |
| `GET`    | `/users/:id` | Get user by ID        | `getUserById`     |
| `POST`   | `/users`     | Create new user       | `createUser`      |
| `PUT`    | `/users/:id` | Update existing user  | `updateUser`      |
| `DELETE` | `/users/:id` | Delete user           | `deleteUser`      |

## 🧪 **Testing**

### Run the Complete Test Suite

```bash
npm test
```

This will execute the specific test case:

1. ✅ **Create** user: Virat Kohli (virat.kohli@example.com)
2. ✅ **Update** to: King Kohli (king.kohli@example.com)
3. ✅ **Delete** the updated entry
4. ✅ **Verify** deletion and error handling

### Manual Testing

You can test individual endpoints using:

- **Postman**
- **cURL**
- **Thunder Client** (VS Code extension)

## 📝 **Code Organization**

### **Controllers** (`controllers/userController.js`)

- Contains all business logic for user operations
- Handles database queries and responses
- Implements proper error handling and logging
- Uses callback-based MySQL operations

### **Routes** (`routes/userRoutes.js`)

- Defines API endpoints and HTTP methods
- Maps routes to controller functions
- Keeps routing logic separate from business logic

### **Configuration** (`config/database.js`)

- Centralized database connection settings
- Connection pool and single connection functions
- Reusable across different parts of the application

### **Main Server** (`index.js`)

- Express app setup and middleware
- Route registration
- Global error handling
- Graceful shutdown management

## 📊 **Logging System**

The application provides comprehensive logging for all database operations:

```
[2024-01-15T10:30:00.000Z] Database INSERT: Creating user: Virat Kohli (virat.kohli@example.com)
[2024-01-15T10:30:00.100Z] Database INSERT_SUCCESS: User created with ID: 1
[2024-01-15T10:30:01.000Z] Database UPDATE: Updating user with ID: 1 to King Kohli (king.kohli@example.com)
[2024-01-15T10:30:01.100Z] Database UPDATE_SUCCESS: User with ID 1 updated successfully
```

## 🚨 **Error Handling**

The API provides proper error handling for various scenarios:

- **400 Bad Request** - Missing required fields
- **404 Not Found** - User doesn't exist
- **409 Conflict** - Duplicate email
- **500 Internal Server Error** - Database or server errors

## 🔒 **Security Features**

- **Input validation** for all user inputs
- **SQL injection prevention** using parameterized queries
- **Connection pooling** for efficient database management
- **Graceful error handling** without exposing sensitive information

## 🚀 **Performance Features**

- **Connection pooling** with configurable limits
- **Callback-based operations** for non-blocking performance
- **Efficient query execution** with proper indexing
- **Memory leak prevention** through proper connection management

## 🛠️ **Development**

### Available Scripts

- `npm start` - Start the production server
- `npm run setup` - Set up the database tables
- `npm test` - Run the test suite
- `npm run dev` - Start in development mode (requires nodemon)

## 🔧 **Configuration**

Database configuration can be modified in `config/database.js`:

```javascript
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "your-password",
  database: "testdb",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};
```

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 **License**

This project is licensed under the ISC License.

---

**🎉 Happy Coding! 🚀**

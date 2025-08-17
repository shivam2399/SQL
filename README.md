# �� Bus Booking System API

A comprehensive REST API for managing bus bookings, users, and bus information built with Node.js, Express, and MySQL.

## 🏗️ Project Structure

```
SQL/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   ├── userController.js    # User CRUD operations
│   └── busController.js     # Bus CRUD operations
├── routes/
│   ├── userRoutes.js        # User API endpoints
│   └── busRoutes.js         # Bus API endpoints
├── setupDb.js               # Database setup and table creation
├── insertSampleData.js      # Sample data insertion script
├── index.js                 # Main server file
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MySQL Server
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SQL
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure database**
   - Update `config/database.js` with your MySQL credentials
   - Ensure MySQL server is running

4. **Setup database tables**
   ```bash
   node setupDb.js
   ```

5. **Insert sample data**
   ```bash
   node insertSampleData.js
   ```

6. **Start the server**
   ```bash
   node index.js
   ```

The server will start on port 3000.

## 📊 Database Schema

### Users Table
- `id` - Primary key (auto-increment)
- `name` - User's full name
- `email` - Unique email address
- `created_at` - Timestamp of creation
- `updated_at` - Timestamp of last update

### Buses Table
- `id` - Primary key (auto-increment)
- `busNumber` - Unique bus identifier
- `totalSeats` - Total number of seats
- `availableSeats` - Number of available seats
- `created_at` - Timestamp of creation

## 🔌 API Endpoints

### User Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/users` | Retrieve all users |
| `GET` | `/users/:id` | Get user by ID |
| `POST` | `/users` | Create a new user |
| `PUT` | `/users/:id` | Update existing user |
| `DELETE` | `/users/:id` | Delete user |

### Bus Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/buses` | Retrieve all buses |
| `POST` | `/buses` | Add a new bus |
| `GET` | `/buses/available/:seats` | Get buses with available seats > specified number |

## 🧪 Testing with Postman

### 1. Fetching Users

**Endpoint:** `GET /users`

**SQL Query Equivalent:**
```sql
SELECT * FROM Users;
```

**Postman Setup:**
- Method: `GET`
- URL: `http://localhost:3000/users`
- Headers: `Content-Type: application/json`

**Expected Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

### 2. Adding a New User

**Endpoint:** `POST /users`

**SQL Query Equivalent:**
```sql
INSERT INTO Users (name, email) VALUES ('New User', 'newuser@example.com');
```

**Postman Setup:**
- Method: `POST`
- URL: `http://localhost:3000/users`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "name": "New User",
  "email": "newuser@example.com"
}
```

### 3. Adding a New Bus

**Endpoint:** `POST /buses`

**SQL Query Equivalent:**
```sql
INSERT INTO Buses (busNumber, totalSeats, availableSeats) VALUES ('BUS006', 55, 50);
```

**Postman Setup:**
- Method: `POST`
- URL: `http://localhost:3000/buses`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "busNumber": "BUS006",
  "totalSeats": 55,
  "availableSeats": 50
}
```

### 4. Filtering Buses by Seat Availability

**Endpoint:** `GET /buses/available/:seats`

**SQL Query Equivalent:**
```sql
SELECT * FROM Buses WHERE availableSeats > 10;
```

**Postman Setup:**
- Method: `GET`
- URL: `http://localhost:3000/buses/available/10`
- Headers: `Content-Type: application/json`

**Expected Response:**
```json
{
  "count": 4,
  "minAvailableSeats": 10,
  "buses": [
    {
      "id": 1,
      "busNumber": "BUS001",
      "totalSeats": 50,
      "availableSeats": 45,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## 📝 Sample Data

The `insertSampleData.js` script inserts the following sample data:

### Sample Users
- John Doe (john.doe@example.com)
- Jane Smith (jane.smith@example.com)
- Mike Johnson (mike.johnson@example.com)
- Sarah Wilson (sarah.wilson@example.com)
- David Brown (david.brown@example.com)

### Sample Buses
- BUS001: 50 total seats, 45 available
- BUS002: 40 total seats, 15 available
- BUS003: 60 total seats, 30 available
- BUS004: 35 total seats, 5 available
- BUS005: 45 total seats, 20 available

## 🔍 Additional SQL Queries for Testing

```sql
-- Get all buses
SELECT * FROM Buses;

-- Get users with specific email
SELECT * FROM Users WHERE email = 'john.doe@example.com';

-- Get buses with most available seats
SELECT * FROM Buses ORDER BY availableSeats DESC;

-- Get buses with available seats > 20
SELECT * FROM Buses WHERE availableSeats > 20;

-- Count total users
SELECT COUNT(*) as totalUsers FROM Users;

-- Count total buses
SELECT COUNT(*) as totalBuses FROM Buses;
```

## 🚨 Error Handling

The API includes comprehensive error handling for:
- Invalid input data
- Database connection errors
- Duplicate entries
- Resource not found
- Server errors

## 📋 Testing Checklist

- [ ] Database setup completed
- [ ] Sample data inserted
- [ ] Server running on port 3000
- [ ] Tested GET /users endpoint
- [ ] Tested POST /users endpoint
- [ ] Tested GET /buses endpoint
- [ ] Tested POST /buses endpoint
- [ ] Tested GET /buses/available/:seats endpoint
- [ ] Verified SQL queries in database

## 🎯 Next Steps

After testing the basic endpoints, consider implementing:
- Authentication and authorization
- Booking management endpoints
- Payment processing
- Real-time seat availability updates
- Advanced filtering and search
- API documentation with Swagger

## 📞 Support

For any issues or questions, please check the console logs for detailed error information and database operation logs.

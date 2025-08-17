# 🚀 Quick Setup Guide

## ⚡ Fast Start (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database Tables
```bash
npm run setup
```

### 3. Insert Sample Data
```bash
npm run insert-data
```

### 4. Start Server
```bash
npm start
```

### 5. Test Endpoints
```bash
npm run test-endpoints
```

## 🔍 Manual Testing in Postman

### Health Check
- **GET** `http://localhost:3000/`

### User Endpoints
- **GET** `http://localhost:3000/users` - Get all users
- **POST** `http://localhost:3000/users` - Create user
  ```json
  {
    "name": "Test User",
    "email": "test@example.com"
  }
  ```

### Bus Endpoints
- **GET** `http://localhost:3000/buses` - Get all buses
- **POST** `http://localhost:3000/buses` - Create bus
  ```json
  {
    "busNumber": "BUS006",
    "totalSeats": 50,
    "availableSeats": 45
  }
  ```
- **GET** `http://localhost:3000/buses/available/10` - Get buses with >10 available seats

## 📊 Sample SQL Queries

```sql
-- Get all users
SELECT * FROM Users;

-- Get all buses
SELECT * FROM Buses;

-- Get buses with available seats > 10
SELECT * FROM Buses WHERE availableSeats > 10;
```

## ✅ Verification Checklist

- [ ] Database connection successful
- [ ] Tables created successfully
- [ ] Sample data inserted
- [ ] Server running on port 3000
- [ ] All endpoints responding
- [ ] Postman tests successful

## 🚨 Troubleshooting

**Database Connection Failed:**
- Check MySQL server is running
- Verify credentials in `config/database.js`
- Ensure database `testdb` exists

**Port Already in Use:**
- Change port in `index.js` or kill existing process

**Tables Not Created:**
- Run `npm run setup` again
- Check MySQL permissions

## 📞 Need Help?

Check the console logs for detailed error information. All database operations are logged with timestamps.


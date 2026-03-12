# Backend Documentation - Maxipela Turnos

## 📂 Project Structure

The project follows a **Layered Architecture** (Controller-Service-Model) to separate concerns and ensure scalability.

```
backend/
├── src/
│   ├── config/         # Database configuration
│   ├── controllers/    # Handles HTTP requests and responses
│   ├── middlewares/    # Express middlewares (Authentication, etc.)
│   ├── models/         # Database queries (SQL)
│   ├── routes/         # API route definitions
│   ├── services/       # Business logic
│   ├── app.js          # Express app setup
│   └── server.js       # Server entry point
├── .env                # Environment variables
└── package.json        # Dependencies and scripts
```

---

## 🚀 API Routes & Methods

### Authentication (`/api/auth`)

| Method | Endpoint    | Description | Request Body |
| :--- | :--- | :--- | :--- |
| **POST** | `/register` | Register a new user | `{ login, pswd, name, email }` |
| **POST** | `/login` | Authenticate user & get Token | `{ login, pswd }` |

### Users (`/api/users`)

| Method | Endpoint | Description | Headers |
| :--- | :--- | :--- | :--- |
| **GET** | `/me` | Get logged-in user profile | `Authorization: Bearer <token>` |

---

## 📄 File & Function Descriptions

### 1. **Config** (`src/config/`)
- **`db.js`**:
  - `pool`: Creates a MySQL connection pool using environment variables. It manages database connections efficiently.

### 2. **Controllers** (`src/controllers/`)
Handles incoming HTTP requests, extracts data, calls the Service layer, and sends responses.

- **`auth.controller.js`**:
  - `register(req, res)`: Receives user data, calls `authService.register`, and returns the created user.
  - `login(req, res)`: Receives credentials, calls `authService.login`, and returns the JWT token and user info.

- **`user.controller.js`**:
  - `getProfile(req, res)`: Uses `req.user.login` (from middleware) to fetch and return user details via `userService`.

### 3. **Services** (`src/services/`)
Contains the **Business Logic**. It sits between Controllers and Models.

- **`auth.service.js`**:
  - `register(userData)`:
    1. Checks if user already exists.
    2. Hashes the password using `bcryptjs`.
    3. Calls `userModel.createUser`.
    4. Returns user data (excluding password).
  - `login(login, password)`:
    1. Finds user by login.
    2. Compares passwords using `bcryptjs`.
    3. Generates a **JWT Token**.
    4. Returns user and token.

- **`user.service.js`**:
  - `getUserProfile(login)`: Fetches user data and removes sensitive information (like password) before returning.

### 4. **Models** (`src/models/`)
Directly interacts with the Database (SQL Queries).

- **`user.model.js`**:
  - `createUser(user)`: Executes `INSERT INTO sec_users` to save a new user.
  - `findUserByLogin(login)`: Executes `SELECT * FROM sec_users WHERE login = ?` to find a user.

### 5. **Middlewares** (`src/middlewares/`)
- **`auth.middleware.js`**:
  - `authenticateToken(req, res, next)`:
    1. Extracts the token from the `Authorization` header.
    2. Verifies the token using `jsonwebtoken`.
    3. If valid, attaches `user` to `req.user` and calls `next()`.
    4. If invalid/missing, returns 401/403 error.

### 6. **Routes** (`src/routes/`)
Defines the endpoints and maps them to Controllers.

- **`auth.routes.js`**: Maps `/register` and `/login`.
- **`user.routes.js`**: Maps `/me` and applies `authenticateToken` middleware.

### 7. **Entry Points**
- **`app.js`**: Configures Express, adds middlewares (cors, morgan, json), and mounts routes.
- **`server.js`**: Connects to the database and starts the server on the defined `PORT`.

---

## 🌍 Deployment & Documentation

For details on the deployed version (Vercel) and how to use the API in production, please refer to:

- **[DEPLOY.md](./DEPLOY.md)**: Contains the live URL, endpoint details, and environment configuration for cloud databases.
- **[postman_collection_vercel.json](./postman_collection_vercel.json)**: A ready-to-use Postman collection configured with the Vercel production URL. Import this file into Postman to test the live API immediately.
# erverpelagabyrender

# User Management System (UMS) 🔐

A robust User Management System built with Node.js, Express, and MongoDB featuring role-based access control and secure authentication flows.

## 🚀 Features

- **Role-Based Access Control** (Admin/User)
- **Secure Authentication** with session management
- **Email Verification** workflow
- **Password Hashing** & token generation
- **MVC Architecture** for clean code organization
- **Middleware Integration** for request handling

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: Session-based with security layers
- **Architecture**: MVC Pattern

## 📁 Project Structure

```
ums/
├── models/                 # Database models
├── views/                  # Frontend templates
├── controllers/            # Business logic
├── routes/                 # Application routes
│   ├── userRoute.js       # User routes
│   └── adminRoute.js      # Admin routes
├── middleware/             # Custom middlewares
├── public/                 # Static assets
└── config/                 # Configuration files
```

## 🔧 Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/user-management-system.git
cd user-management-system
```

2. **Install dependencies**
```bash
npm install
```

3. **Start MongoDB**
```bash
mongod
```

4. **Run the application**
```bash
npm start
```

5. **Access the application**
```
User Panel: http://localhost:3000
Admin Panel: http://localhost:3000/admin
```

## 🎯 Key Learning Outcomes

### Architecture & Patterns
- **MVC Pattern**: Clear separation of Models, Views, and Controllers
- **Middleware Power**: Strategic request processing at different layers
- **Folder Structure**: Impact on code maintainability and scalability

### Security Implementation
- **Multi-layer Authentication**: Multiple security checks for robust protection
- **Session Management**: Secure user session handling
- **Password Security**: Hashing and token generation best practices
- **Email Verification**: Complete user verification workflow

### Access Control
- **Role-Based Permissions**: Different access levels for Admin and Users
- **Route Protection**: Secure endpoint access based on user roles

## 🔐 Authentication Flow

1. **User Registration** with email verification
2. **Secure Login** with session creation
3. **Role-based Authorization** for different access levels
4. **Protected Routes** with middleware checks
5. **Secure Logout** with session destruction

## 📝 API Routes

### User Routes (`/`)
- `GET /` - Home page
- `GET /login` - User login
- `GET /register` - User registration
- `POST /verify-email` - Email verification

### Admin Routes (`/admin`)
- `GET /admin` - Admin dashboard
- `GET /admin/users` - User management
- `POST /admin/users` - User operations

## 🎨 Features Demo

- ✅ **User Registration & Email Verification**
- ✅ **Secure Login/Logout System**
- ✅ **Admin & User Role Separation**
- ✅ **Session-based Authentication**
- ✅ **Password Security with Hashing**
- ✅ **Protected Routes with Middleware**

## 🤝 Contributing

Feel free to contribute to this project by submitting issues or pull requests.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
```

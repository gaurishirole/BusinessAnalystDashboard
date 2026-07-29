# 📊 InsightPro - SaaS Business Analytics Dashboard

A modern, responsive, and role-based Business Analytics Dashboard built using **React.js**, **Node.js**, **Express.js**, **PostgreSQL**, and **Sequelize ORM**. The application helps businesses monitor sales, revenue, customers, orders, products, and overall business performance through interactive dashboards and analytics.

---

# 🚀 Overview

InsightPro is a full-stack SaaS application designed to provide business owners and managers with real-time insights into their operations. It features secure authentication, role-based access control, interactive charts, and a clean, modern user interface.

The project follows industry-standard folder structure, reusable component architecture, and scalable backend design.

---

# ✨ Features

- JWT Authentication
- Role-Based Authorization
- Protected Routes
- Responsive Design
- Light & Dark Mode
- Dashboard Analytics
- Revenue Reports
- Customer Management
- Product Management
- Order Management
- User Management
- Interactive Charts
- Notifications
- Search & Filtering
- Pagination
- Skeleton Loading
- Toast Notifications

---

# 👥 User Roles

## Super Admin

- Full system access
- Dashboard
- Analytics
- User Management
- Customer Management
- Product Management
- Order Management
- Reports
- Notifications
- System Settings

---

## Manager

- Dashboard
- Analytics
- Customers
- Products
- Orders
- Reports
- Notifications

---

## Analyst

- Dashboard
- Analytics
- Reports
- Read-only Access

---

# 📊 Dashboard Overview

The dashboard displays important business information including:

- Total Revenue
- Total Orders
- Total Customers
- Total Products
- Active Users
- Monthly Sales
- Revenue Growth
- Pending Orders
- Low Stock Products
- Refund Requests
- Recent Activities
- Top Selling Products

---

# 📈 Analytics

- Revenue Analytics
- Sales Analytics
- Customer Growth
- Product Performance
- Traffic Sources
- Monthly Revenue
- Weekly Sales
- Order Statistics

---

# 📂 Project Structure

```
InsightPro
│
├── client/
│
└── server/
```

---

# 💻 Frontend Technology

- React.js
- JavaScript (ES6+)
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Hook Form
- Recharts
- React Icons
- Framer Motion

---

# ⚙️ Backend Technology

- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT Authentication
- bcryptjs
- dotenv
- CORS

---

# 📁 Frontend Modules

- Authentication
- Dashboard
- Analytics
- Customers
- Products
- Orders
- Users
- Reports
- Notifications
- Settings

---

# 📁 Backend Modules

- Authentication
- Users
- Customers
- Products
- Orders
- Dashboard
- Reports
- Notifications

---

# 🔐 Authentication

The application uses JWT Authentication.

Features:

- Secure Login
- Password Encryption
- Protected Routes
- Role-Based Access
- Remember Me
- Forgot Password
- Reset Password
- Logout

---

# 📊 Dashboard Widgets

- Revenue Card
- Orders Card
- Customers Card
- Products Card
- Profit Card
- Growth Card
- Revenue Chart
- Sales Chart
- Customer Chart
- Traffic Chart
- Activity Timeline
- Recent Orders Table

---

# 📄 API Endpoints

## Authentication

```
POST /api/auth/login
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

## Dashboard

```
GET /api/dashboard
```

## Users

```
GET    /api/users
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id
```

## Customers

```
GET    /api/customers
POST   /api/customers
PUT    /api/customers/:id
DELETE /api/customers/:id
```

## Products

```
GET    /api/products
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

## Orders

```
GET    /api/orders
POST   /api/orders
PUT    /api/orders/:id
DELETE /api/orders/:id
```

## Reports

```
GET /api/reports
```

---

# 🗄️ Database Tables

- Users
- Customers
- Products
- Orders
- Reports
- Notifications

---

# 📦 Installation

## Clone Repository

```bash
git clone https://github.com/your-username/InsightPro.git
```

---

## Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

## Backend Setup

```bash
cd server
npm install
npm run dev
```

---

# 🌐 Environment Variables

## Client

```env
VITE_API_URL=http://localhost:5000/api
```

## Server

```env
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=insightpro
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```

---

# 📱 Responsive Design

- Desktop
- Laptop
- Tablet
- Mobile

---

# 📈 Future Enhancements

- Real-Time Analytics
- AI Business Insights
- Email Notifications
- Excel Export
- PDF Export
- Audit Logs
- Activity History
- Calendar Integration
- Multi-language Support

---

# 🎯 Learning Objectives

This project demonstrates:

- React.js Development
- REST API Integration
- JWT Authentication
- Role-Based Authorization
- CRUD Operations
- Dashboard Design
- Data Visualization
- Responsive UI
- Component Reusability
- Clean Architecture
- Full Stack Development

---

# 👨‍💻 Author

**Gauri Shirole**

Frontend Developer | React.js Developer

---

## ⭐ If you like this project, don't forget to star the repository.

# Dayflow – Human Resource Management System (HRMS)

Dayflow is a lightweight **Human Resource Management System (HRMS)** prototype built using **React + Vite** for a hackathon Round-1 submission.  
The project focuses on demonstrating **core HR workflows**, role-based dashboards, and clean frontend architecture aligned with the provided Figma designs and notes.

---

## 📌 Project Overview

Managing HR activities such as attendance, leave requests, and approvals often involves manual processes or disconnected tools.  
**Dayflow** aims to centralize these operations into a single, role-based system that improves visibility and workflow efficiency.

This is a **frontend-only prototype**, designed to showcase user flows, layout structure, and system design under hackathon constraints.

---

## 🎯 Problem Statement

- Manual HR processes reduce efficiency  
- Employees lack transparency on leave and attendance  
- HR admins require centralized control for approvals  

**Dayflow** solves this by providing a simple, intuitive HRMS interface for both employees and administrators.

---

## 💡 Solution Summary

- Role-based login (Employee / Admin)
- Dedicated dashboards for each role
- Leave request and approval workflow
- Clean sidebar-based layout inspired by HRMS Figma designs
- Scalable frontend architecture ready for backend integration

---

## 👥 User Roles

### 👤 Employee
- Login to the system
- View dashboard summary
- View attendance status
- Apply for leave
- View salary (read-only)

### 👑 Admin (HR)
- Login as admin
- View admin dashboard
- View pending leave requests
- Approve or reject leave applications

---

## 🧭 Application Flow

1. User lands on the **Login Page**
2. Role is determined using email pattern:
   - Email contains `"admin"` → Admin
   - Otherwise → Employee
3. User is redirected to the respective dashboard
4. Sidebar navigation allows access to role-specific pages
5. Leave workflow:
   - Employee applies for leave
   - Admin reviews and approves/rejects

---

## 🖥️ Key Features

### 🔐 Authentication (Prototype)
- Simple login form (email & password)
- Role-based routing (mocked authentication)

### 📊 Employee Dashboard
- Attendance overview (static)
- Leave status summary
- Salary visibility (read-only)

### 📝 Leave Management
- Leave request form
- Leave lifecycle: **Pending → Approved / Rejected**

### ✅ Admin Leave Approval
- View leave requests in a table
- Approve or reject requests (UI-level only)

### 🧭 Navigation
- Persistent left sidebar
- Role-based menu items

---






# SDMA TaskPro - REST API Blueprint Documentation

This document outlines the RESTful API contract for the **SDMA TaskPro (Agency OS)**. These blueprints serve as a reference for backend engineers developing production-ready APIs with **Laravel 12** or **Node.js (NestJS)** and **PostgreSQL**.

---

## Base Path
`https://api.shahdigitalmarketing.com/v1`

---

## 1. Authentication Service (`/auth`)

### 1.1 User Login
* **Method:** `POST`
* **Path:** `/auth/login`
* **Headers:** `Content-Type: application/json`
* **Request Body:**
```json
{
  "email": "admin@shahdigital.com",
  "password": "password"
}
```
* **Success Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "u-1",
      "name": "Salahudheen PP",
      "email": "admin@shahdigital.com",
      "role": "CEO",
      "department": "Management"
    }
  }
}
```
* **Failure Response (401 Unauthorized):**
```json
{
  "status": "error",
  "message": "Invalid email or password credentials."
}
```

---

## 2. Client & Project Folders Service (`/clients`)

### 2.1 Retrieve Client Index
* **Method:** `GET`
* **Path:** `/clients`
* **Headers:** `Authorization: Bearer <token>`
* **Success Response (200 OK):**
```json
{
  "status": "success",
  "data": [
    {
      "id": "c-1",
      "company_name": "Homestead Realtors",
      "contact_person": "John Doe",
      "email": "marketing@homestead.com",
      "monthly_package": 3500.00,
      "status": "Active",
      "projects": [
        {
          "id": "p-1",
          "name": "Meta Lead Gen Ads",
          "status": "Active"
        }
      ]
    }
  ]
}
```

### 2.2 Create New Client Account
* **Method:** `POST`
* **Path:** `/clients`
* **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
* **Request Body:**
```json
{
  "company_name": "Homestead Realtors",
  "contact_person": "John Doe",
  "phone": "+1 (555) 019-2834",
  "email": "marketing@homestead.com",
  "website": "https://homesteadrealtors.com",
  "address": "102 Ocean Drive, Miami, FL",
  "monthly_package": 3500.00,
  "assigned_staff_id": "u-3",
  "start_date": "2026-01-15",
  "status": "Active",
  "notes": "Focus heavily on lead generation campaigns via Meta Ads."
}
```

---

## 3. Task Pipeline Service (`/tasks`)

### 3.1 Retrieve Task Index (Filterable)
* **Method:** `GET`
* **Path:** `/tasks?priority=High&status=In_Progress`
* **Headers:** `Authorization: Bearer <token>`
* **Success Response (200 OK):**
```json
{
  "status": "success",
  "data": [
    {
      "id": "t-1",
      "title": "Launch Meta Ads Retargeting Campaign",
      "client_id": "c-1",
      "project_id": "p-1",
      "category": "Paid Ads",
      "priority": "High",
      "assigned_employee_id": "u-3",
      "deadline": "2026-07-28",
      "estimated_hours": 4.0,
      "status": "In_Progress"
    }
  ]
}
```

### 3.2 Update Task Status (One-Click Kanban Drop)
* **Method:** `PATCH`
* **Path:** `/tasks/{id}/status`
* **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
* **Request Body:**
```json
{
  "status": "Waiting_Review"
}
```
* **Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "Task status updated successfully.",
  "data": {
    "id": "t-1",
    "status": "Waiting_Review"
  }
}
```

---

## 4. Daily Operational Reports (`/reports`)

### 4.1 Submit Morning/Evening Report
* **Method:** `POST`
* **Path:** `/reports`
* **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
* **Request Body (Evening Type):**
```json
{
  "type": "Evening",
  "data": {
    "completed_tasks": "Compiled Google search logs.",
    "pending_tasks": "Meta Ads launched, waiting for validation.",
    "campaign_updates": "Google CPL stable at $22.6.",
    "issues": "None",
    "tomorrow_plan": "Launch Homestead local target campaigns."
  }
}
```

### 4.2 Validate & Approve Report (Team Lead)
* **Method:** `PATCH`
* **Path:** `/reports/{id}/approve`
* **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
* **Request Body:**
```json
{
  "is_approved": true
}
```

---

## 5. Campaign Tracking Metrics (`/campaigns`)

### 5.1 Save Campaign Data Log
* **Method:** `POST`
* **Path:** `/campaigns`
* **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
* **Request Body:**
```json
{
  "client_id": "c-1",
  "platform": "Meta Ads",
  "budget": 1500.00,
  "spend": 1200.00,
  "leads": 84,
  "roas": 3.8,
  "daily_notes": "Leads tracking correctly."
}
```

---

## 6. Attendance & Hours Logging (`/attendance`)

### 6.1 Clock In (Log Time entry)
* **Method:** `POST`
* **Path:** `/attendance/clock-in`
* **Headers:** `Authorization: Bearer <token>`
* **Success Response (201 Created):**
```json
{
  "status": "success",
  "data": {
    "clock_in": "09:12 AM",
    "is_late": false
  }
}
```

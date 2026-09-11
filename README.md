#Mini ERP + CRM Operations Portal

A full-stack web application for managing customers, products, inventory, stock movements, and sales challans for a wholesale/distribution business.

This project was developed as a practical full-stack case study with a focus on clean REST APIs, role-based access, database design, inventory validation, and a simple admin-style interface.

Features

Authentication and Roles

JWT-based login

Role-based access control

Admin, Sales, Warehouse, and Accounts roles

Customer CRM

Add and edit customers

Search customers

Customer details:

Name

Mobile

Email

Business name

GST number

Customer type

Address

Status

Follow-up date

Notes

Products and Inventory

Add and edit products

SKU management

Category and unit price

Current stock tracking

Minimum stock alert level

Warehouse location

Stock IN and OUT movements

Stock movement history with user and timestamp

Sales Challans

Create a challan for a customer

Add multiple products and quantities

Save challans as drafts

Confirm challans

Automatic challan number generation

Stock is reduced only when a challan is confirmed

Negative stock is prevented

Insufficient stock returns an appropriate API error

Product name, SKU, and price are stored as snapshots in challan items

Tech Stack

Backend

Node.js

TypeScript

Express.js

PostgreSQL

JWT

Zod

bcryptjs

Frontend

React

TypeScript

Vite

React Router

Axios

Lucide React

CSS

Database

PostgreSQL is used for the application database. The current setup uses Neon PostgreSQL.

Project Structure

mini-erp-crm/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   ├── api.ts
    │   └── App.tsx
    ├── package.json
    └── ...

Database Design

Main tables:

users

customers

products

stock_movements

challans

challan_items

The main relationships support the business flow between users, customers, products, stock movements, and sales challans.

Business Flow

Login
  ↓
Select Customer
  ↓
Select Products
  ↓
Enter Quantities
  ↓
Create Challan
  ↓
Draft
  ↓
Confirm
  ↓
Check Available Stock
  ↓
Reduce Stock
  ↓
Create Stock OUT Movement
  ↓
Challan becomes CONFIRMED

If the requested quantity is greater than the available stock, confirmation is rejected and the stock remains unchanged.

API Overview

Authentication

POST /auth/login

Customers

GET    /customers
POST   /customers
GET    /customers/:id
PUT    /customers/:id

Products

GET    /products
POST   /products
GET    /products/:id
PUT    /products/:id

Stock

POST /products/:id/stock
GET  /products/:id/stock

Challans

GET  /challans
POST /challans
GET  /challans/:id
POST /challans/:id/confirm

The API uses validation, authentication, authorization, and appropriate HTTP error responses.

Local Setup

Prerequisites

Node.js

npm

PostgreSQL-compatible database

Git

Clone the repository

git clone <YOUR_GITHUB_REPOSITORY_URL>
cd mini-erp-crm

Backend

cd backend
npm install

Create backend/.env:

PORT=5000
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_jwt_secret

Never commit .env to GitHub.

Run in development:

npm run dev

Build the backend:

npm run build

Run the production build:

npm start

Frontend

Open another terminal:

cd frontend
npm install
npm run dev

Use the local frontend URL shown by Vite.

Environment Variables

Backend

PORT
DATABASE_URL
JWT_SECRET

Keep secret values outside the source code.

The frontend API configuration should point to the correct backend URL for the environment.

Deployment

The frontend and backend can be deployed separately.

Backend

The backend can be deployed on Render, Railway, Fly.io, or a similar service.

For a Render Web Service:

Root Directory: backend
Build Command: npm install && npm run build
Start Command: npm start

Production environment variables:

DATABASE_URL
JWT_SECRET
PORT

Frontend

The React frontend can be deployed on Vercel, Netlify, Render Static Site, or a similar service.

The frontend API configuration must point to the deployed backend URL.

Database

The application uses PostgreSQL. Neon PostgreSQL can be used as the hosted database.

Testing

The following important flows were tested during development:

User login

Customer creation and editing

Product creation and editing

Stock IN and OUT

Stock movement history

Challan creation

Saving a challan as draft

Confirming a challan

Insufficient stock validation

Negative stock prevention

Challan details

Product snapshot information in challan items

Example inventory validation:

Available stock: 15
Requested quantity: 100

Result:
Challan confirmation rejected
Stock remains: 15

Security

Passwords are stored as hashes.

JWT is used for authentication.

Protected routes require authentication.

Role-based authorization is applied to restricted operations.

Backend request validation is implemented.

Database credentials and JWT secrets are stored in environment variables.

Git Workflow

Changes should be committed with meaningful messages.

Example:

git add .
git commit -m "Add stock movement management"
git push

Known Limitations

This is a focused ERP/CRM case-study implementation rather than a complete enterprise ERP system.

Possible future improvements:

Advanced reporting and analytics

Invoice PDF generation

Product image uploads

Detailed audit logging

Automated test coverage

Docker deployment

GitHub Actions CI/CD

More advanced CRM follow-up management

Project Goal

The project demonstrates a complete business workflow from frontend to backend and database:

React UI
   ↓
REST API
   ↓
Express + TypeScript
   ↓
PostgreSQL

The main focus is on practical business rules, especially maintaining correct inventory when sales challans are confirmed.

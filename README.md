# 🧾 Full Stack SaaS Invoice Dashboard

![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-Blue) ![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green) ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.0-38b2ac)

A production-ready Invoice Generator application built with **Next.js** and **Supabase**. This application allows freelancers and small businesses to manage clients, track payments, and generate PDF invoices instantly.

![App Screenshot](./screenshot.png)
*(Note: screenshots to be added )*

## 🚀 Key Features

*   **Full CRUD Functionality:** Create, Read, and Delete invoices in real-time.
*   **Dynamic Form Handling:** Add, edit, and remove multiple line items dynamically using React state.
*   **PDF Generation:** Integrated `react-to-print` to render pixel-perfect, printable invoices from the browser.
*   **Secure Authentication:** User management handled via Supabase Auth (Row Level Security enabled).
*   **Complex Data Modeling:** Utilizes PostgreSQL JSONB columns to store nested line-item arrays and company details.
*   **Optimistic UI:** Instant interface updates before server confirmation for a snappy user experience.

## 🛠 Tech Stack

*   **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS
*   **Backend:** Supabase (PostgreSQL Database, Auth, Realtime)
*   **Libraries:** react-to-print (PDF generation)

## 🗄️ Database Schema

The application uses a relational setup with **JSONB** support for flexible data storage.

**Table:** `invoices`

| Column Name    | Data Type | Description                              |
| :------------- | :-------- | :--------------------------------------- |
| `id`           | UUID      | Primary Key                              |
| `created_at`   | Timestamp | Auto-generated                           |
| `client_name`  | Text      | Name of the client                       |
| `amount`       | Numeric   | Total calculated amount                  |
| `status`       | Text      | 'Pending' or 'Paid'                      |
| `user_id`      | UUID      | Foreign Key linked to Supabase Auth User |
| `items`        | JSONB     | Array of objects `{desc, price}`         |
| `company_info` | JSONB     | Object containing sender details         |

## ⚙️ Getting Started

Follow these steps to run the project locally.

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/invoice-dashboard.git
cd invoice-dashboard
```

### 2. Install Dependencies
```bash
npm install
```
### 3. Configure Environment Variables
Create a .env.local file in the root directory and add your Supabase credentials:
```bash
Env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
### 4. Run the Development Server
```bash
npm run dev
```
Open http://localhost:3000 with your browser to see the result.

🔒 Security
This project uses Row Level Security (RLS) policies in PostgreSQL.
Users can only view and edit invoices that they created.
Public access is restricted.
🔮 Future Improvements

Add "Edit Invoice" functionality.

Implement Stripe integration for direct payments.

Email invoices directly to clients using Resend API.
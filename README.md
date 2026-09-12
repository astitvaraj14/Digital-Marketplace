# Digital Marketplace

A full-stack, role-based digital marketplace built on the **MERN** stack (MongoDB, Express, React, Node.js). Buyers can browse and purchase products, sellers can list and manage their own products, and admins oversee sellers, categories, and users.

---

## Tech Stack

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JSON Web Tokens (`jsonwebtoken`) for authentication
- `bcryptjs` for password hashing
- `dotenv` for environment configuration
- `nodemon` for local development

**Frontend**
- React 19 (Vite)
- React Router DOM for client-side routing
- Axios for API requests
- Plain CSS (`App.css`, `index.css`)

---

## Architecture

The project is a **decoupled client–server application**: the React frontend and the Express backend run as two separate processes and communicate over HTTP (JSON REST API). The frontend never talks to MongoDB directly — everything goes through the backend's API.

```
┌────────────────────┐        REST API (JSON)        ┌─────────────────────┐        ┌────────────────┐
│   React Frontend    │  ───────────────────────────▶ │   Express Backend    │ ─────▶ │    MongoDB      │
│  (Vite dev server)  │ ◀─────────────────────────────│   (Node.js server)   │ ◀───── │  (Mongoose ODM) │
└────────────────────┘        JWT in headers          └─────────────────────┘        └────────────────┘
     localhost:5174                                        localhost:5001
```

**Role-based flow**
- **Buyer** — registers/logs in, browses the marketplace, views product details, manages cart, places orders.
- **Seller** — same auth flow, but requires **admin approval** before they can create/update/delete products; manages their own products and orders via a seller dashboard.
- **Admin** — manages sellers (approve/reject), categories, and users through an admin dashboard.

Access control on the backend is handled by two middlewares (`protect`, `authorize`) applied per-route, so each route explicitly declares who can call it (any authenticated user, only sellers, or only admins).

---

## Project Structure

```
Digital-Marketplace/
├── backend/
│   ├── controllers/         # Request handlers (business logic)
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── cartController.js
│   │   ├── categoryController.js
│   │   ├── notificationController.js
│   │   ├── orderController.js
│   │   ├── productController.js
│   │   └── sellerController.js
│   ├── middleware/
│   │   ├── auth.js          # protect (JWT check) + authorize (role check)
│   │   └── errorHandler.js  # centralized error handler
│   ├── models/               # Mongoose schemas
│   │   ├── Cart.js
│   │   ├── Category.js
│   │   ├── Notification.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   └── User.js
│   ├── routes/                # Express routers, mounted in server.js
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── productRoutes.js
│   │   └── sellerRoutes.js
│   ├── server.js             # App entry point (Express app + route mounting)
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── ProductCard.jsx
    │   │   ├── PrivateRoute.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx   # holds logged-in user + JWT, exposes login/logout
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Marketplace.jsx
    │   │   ├── ProductDetail.jsx
    │   │   ├── Cart.jsx
    │   │   ├── Orders.jsx
    │   │   ├── admin/
    │   │   │   ├── AdminDashboard.jsx
    │   │   │   ├── AdminSellers.jsx
    │   │   │   ├── AdminCategories.jsx
    │   │   │   └── AdminUsers.jsx
    │   │   └── seller/
    │   │       ├── SellerDashboard.jsx
    │   │       ├── SellerProducts.jsx
    │   │       └── SellerOrders.jsx
    │   ├── App.jsx
    │   └── main.jsx
    ├── vite.config.js
    └── package.json
```

> **Note:** Several files above (controllers, models, routes, and most page/component files) are scaffolded but still empty or partially implemented — they're the next things to fill in as features are built out.

---

## Prerequisites

- Node.js (v18+ recommended)
- npm
- MongoDB running locally (or an Atlas connection string)

---

## Getting Started

Clone the repo, then set up the backend and frontend **separately**, in two terminal windows.

### 1. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` (copy from `.env.example`) and fill in your own values:

```env
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/digital_marketplace
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5174
```

Start the backend server:

```bash
npm run dev
```

By default the API runs at **http://localhost:5001**.

### 2. Frontend setup

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend (Vite dev server) runs at **http://localhost:5174** and talks to the backend via `axios`, using the base URL configured in the frontend (should match the backend's `PORT`).

### 3. Open the app

Visit `http://localhost:5174` in your browser. Register a buyer or seller account; seller accounts will need to be approved from the admin side before they can list products.

---

## Available Scripts

**Backend** (`backend/package.json`)
| Script | Description |
|---|---|
| `npm run dev` | Starts the server with `nodemon` (auto-restart on changes) |
| `npm start` | Starts the server with plain `node` |

**Frontend** (`frontend/package.json`)
| Script | Description |
|---|---|
| `npm run dev` | Starts the Vite dev server |
| `npm run build` | Builds the production bundle |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs `oxlint` |

---

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Port the Express server listens on |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JWTs |
| `JWT_EXPIRES_IN` | JWT expiry duration (e.g. `7d`) |
| `CLIENT_URL` | Frontend origin, used for CORS configuration |

---


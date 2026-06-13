# Clippi

Clippi is a full-stack AI-powered image processing web application. It provides a suite of tools that allow authenticated users to transform images using state-of-the-art AI models — all from a clean, responsive browser interface. Each operation consumes credits, giving users a metered experience over the available toolset.

---

## Features

| Tool | Description |
|---|---|
| Text to Image | Generate an image from a natural language prompt using Stable Diffusion. |
| Remove Background | Automatically isolate the subject of a photo and strip its background. |
| Replace Background | Remove a background and replace it with a new AI-generated scene from a prompt. |
| Remove Text | Erase embedded text or watermarks from an image using inpainting. |
| Upscale Image | Enhance resolution and detail using super-resolution AI (target: 1920x1080). |
| Uncrop | Expand the canvas of an image outward using AI outpainting. |

---

## Tech Stack

### Frontend (`/client`)
- **Framework**: React 19 (Vite)
- **Routing**: React Router v7
- **Styling**: Tailwind CSS v4
- **HTTP Client**: Axios
- **Icons**: Lucide React

### Backend (`/server`)
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express 5
- **Database**: MongoDB via Mongoose
- **Authentication**: JWT stored in HTTP-only cookies
- **Password Reset**: OTP via Nodemailer (email)
- **File Uploads**: Multer (multipart/form-data)
- **Security**: bcryptjs for password hashing

### External Services
- **ClipDrop API** — AI image processing (remove background, upscale, uncrop, remove text, replace background, text-to-image)
- **ImageKit** — Cloud image storage and delivery (CDN URLs for all processed outputs)
- **MongoDB Atlas** — Hosted database

---

## Project Structure

```
clippi/
├── client/                      # React frontend (Vite)
│   ├── src/
│   │   ├── api/                 # Axios instance configuration
│   │   ├── components/          # Reusable UI components
│   │   │   ├── DashboardLayout.jsx
│   │   │   ├── Features.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── HistoryCard.jsx
│   │   │   └── HistoryModal.jsx
│   │   ├── context/             # React Context (AuthContext)
│   │   ├── pages/               # Route-level page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Text_to_image.jsx
│   │   │   ├── Remove_background.jsx
│   │   │   ├── Change_background.jsx
│   │   │   ├── Remove_text_from_img.jsx
│   │   │   ├── Upscale_img.jsx
│   │   │   ├── uncrop_image.jsx
│   │   │   ├── History.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   └── ResetPassword.jsx
│   │   └── App.jsx
│   └── package.json
│
└── server/                      # Express backend
    ├── config/                  # Database connection
    ├── controllers/             # Business logic per feature
    ├── middleware/              # Auth protection middleware
    ├── models/                  # Mongoose schemas (User, History)
    ├── routes/                  # Express route definitions
    ├── utils/                   # Helper utilities
    └── server.js                # App entry point
```

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- A MongoDB Atlas cluster (or local MongoDB instance)
- A ClipDrop API key
- An ImageKit account (public key, private key, and URL endpoint)
- An SMTP email provider for OTP delivery (e.g., Gmail App Password)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/clippi.git
cd clippi
```

---

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory with the following variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret_key

CLIPDROP_API_KEY=your_clipdrop_api_key

IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SENDER_EMAIL=your_email@gmail.com
```

Start the development server:

```bash
npm run dev
```

The server will run at `http://localhost:5000`.

---

### 3. Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file in the `client/` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the development server:

```bash
npm run dev
```

The client will run at `http://localhost:5173`.

---

## Authentication

Clippi uses JWT-based authentication stored in HTTP-only cookies. The authentication flow is as follows:

1. User registers or logs in via the `/api/auth` endpoints.
2. The server signs a JWT and sets it as an HTTP-only `token` cookie.
3. All protected routes read this cookie via middleware before processing.
4. Tokens can also be passed as `Authorization: Bearer <token>` headers.

Password resets are handled via a 6-digit OTP sent to the user's registered email address.

---

## Credit System

Each registered user receives **3 credits** upon sign-up. Every successful AI image operation deducts **1 credit**. Requests from users with zero remaining credits are rejected with a `400` error before hitting any external API.

---

## API Reference

The full backend API reference is documented in [`server/api_endpoints_documentation.md`](./server/api_endpoints_documentation.md).

A brief summary of available endpoints:

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register a new user |
| POST | `/api/auth/login` | No | Log in and receive session cookie |
| POST | `/api/auth/logout` | No | Clear session cookie |
| GET | `/api/auth/me` | Yes | Retrieve the authenticated user profile |
| POST | `/api/auth/forgot-password` | No | Send a password reset OTP to email |
| POST | `/api/auth/reset-password` | No | Reset password using OTP |
| POST | `/api/image/text-to-image` | Yes | Generate an image from a prompt |
| POST | `/api/image/remove-bg` | Yes | Remove the background from an image |
| POST | `/api/image/replace-background` | Yes | Replace the background of an image |
| POST | `/api/image/remove-text` | Yes | Remove text/watermarks from an image |
| POST | `/api/image/upscale-image` | Yes | Upscale an image to higher resolution |
| POST | `/api/image/uncrop` | Yes | Expand an image canvas outward |
| GET | `/api/history/get_history` | Yes | Retrieve the user's processing history |
| DELETE | `/api/history/delete_history_by_id/:id` | Yes | Delete a specific history record |

---

## Deployment

The application is deployed as two separate services:

- **Frontend**: Vercel (`https://clippitools.vercel.app`)
- **Backend**: Any Node.js-compatible host (Render, Railway, etc.)

The backend CORS origin is configured to allow requests only from the deployed frontend domain. Update `server.js` if deploying to a different URL.

For a production build of the frontend:

```bash
cd client
npm run build
```

The output will be in `client/dist/`.

---

## License

This project is for personal or educational use. No license is currently specified.

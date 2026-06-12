# Clippi Backend API Reference

This documentation outlines all the API endpoints exposed by the backend for **Clippi**. You can use this directly when prompt engineering or writing the React frontend.

---

## Global Details

- **Base URL**: `http://localhost:5000` (configurable via environment variables)
- **Content Types**: 
  - Auth routes use `application/json`.
  - Image routes use `multipart/form-data` (FormData) for file uploads, except `text-to-image` which uses standard FormData with text fields only.
- **Authentication**: Uses JWT token. The token can be sent in either:
  1. An HTTP-Only cookie named `token`.
  2. The `Authorization` header as a Bearer token: `Bearer <token>`.

---

## 1. Authentication Endpoints (`/api/auth`)

### 1.1 Register User
- **Route**: `POST /api/auth/register`
- **Auth Required**: No
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
- **Response (201 Created)**:
  Sets an HTTP-Only cookie named `token`.
  ```json
  {
    "success": true,
    "message": "User registered successfully!",
    "user": {
      "id": "USER_ID_HEX",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "credits": 3
    }
  }
  ```

### 1.2 Login User
- **Route**: `POST /api/auth/login`
- **Auth Required**: No
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
- **Response (200 OK)**:
  Sets an HTTP-Only cookie named `token`.
  ```json
  {
    "success": true,
    "message": "Logged in successfully!",
    "user": {
      "id": "USER_ID_HEX",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "credits": 3
    }
  }
  ```

### 1.3 Logout User
- **Route**: `POST /api/auth/logout`
- **Auth Required**: No
- **Response (200 OK)**:
  Clears the `token` cookie.
  ```json
  {
    "success": true,
    "message": "Logged out successfully!"
  }
  ```

### 1.4 Get Logged-in User Profile (`/me`)
- **Route**: `GET /api/auth/me`
- **Auth Required**: **Yes** (protect middleware)
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "user": {
      "_id": "USER_ID_HEX",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "credits": 3,
      "resetOtp": "",
      "resetOtpExpire": null,
      "createdAt": "2026-06-03T...",
      "updatedAt": "2026-06-03T..."
    }
  }
  ```

### 1.5 Forgot Password (Send OTP)
- **Route**: `POST /api/auth/forgot-password`
- **Auth Required**: No
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "email": "john@example.com"
  }
  ```
- **Response (200 OK)**:
  Sends a 6-digit OTP code to the user's email.
  ```json
  {
    "success": true,
    "message": "A 6-digit password reset OTP has been sent to your email."
  }
  ```

### 1.6 Reset Password
- **Route**: `POST /api/auth/reset-password`
- **Auth Required**: No
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "otp": "123456",
    "newPassword": "newsecurepassword123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Your password has been successfully reset! You can now log in with your new password."
  }
  ```

---

## 2. Image Processing Endpoints (`/api/image`)

> [!NOTE]
> All endpoints below require authentication.
> Each image request deducts **1 credit** from the user's total. If credits are `< 1`, the API returns a `400 Bad Request` with an error message.

### 2.1 Text to Image (Generate Image)
- **Route**: `POST /api/image/text-to-image`
- **Auth Required**: **Yes**
- **Headers**: `Content-Type: multipart/form-data` (or raw Form data)
- **Request Body**:
  - `prompt`: String (e.g. `"a futuristic city with flying cars"`)
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Image generated and uploaded successfully!",
    "imageUrl": "https://ik.imagekit.io/clippi/text-to-image-123456.png",
    "credits": 2
  }
  ```

### 2.2 Remove Background
- **Route**: `POST /api/image/remove-bg`
- **Auth Required**: **Yes**
- **Headers**: `Content-Type: multipart/form-data`
- **Request Body**:
  - `image_file`: File (JPEG, PNG, WebP, BMP, TIFF)
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Background removed and uploaded successfully!",
    "imageUrl": "https://ik.imagekit.io/clippi/no-bg-123456-original.png",
    "credits": 2
  }
  ```

### 2.3 Replace Background
- **Route**: `POST /api/image/replace-background`
- **Auth Required**: **Yes**
- **Headers**: `Content-Type: multipart/form-data`
- **Request Body**:
  - `image_file`: File (JPEG, PNG, WebP, BMP, TIFF)
  - `prompt`: String (e.g. `"in the middle of a dense rainforest"`)
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Background replaced and uploaded successfully!",
    "imageUrl": "https://ik.imagekit.io/clippi/upscaled-123456-original.png",
    "credits": 2
  }
  ```

### 2.4 Remove Text (Magic Clean)
- **Route**: `POST /api/image/remove-text`
- **Auth Required**: **Yes**
- **Headers**: `Content-Type: multipart/form-data`
- **Request Body**:
  - `image_file`: File (JPEG, PNG, WebP, BMP, TIFF)
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Text removed and uploaded successfully!",
    "imageUrl": "https://ik.imagekit.io/clippi/no-text-123456-original.png",
    "credits": 2
  }
  ```

### 2.5 Upscale Image (Super Resolution)
- **Route**: `POST /api/image/upscale-image`
- **Auth Required**: **Yes**
- **Headers**: `Content-Type: multipart/form-data`
- **Request Body**:
  - `image_file`: File (JPEG, PNG, WebP, BMP, TIFF)
- **Response (200 OK)**:
  ```json
  *Note: Automatically scales target output size to 1920x1080.*
  ```json
  {
    "success": true,
    "message": "Image upscaled and uploaded successfully!",
    "imageUrl": "https://ik.imagekit.io/clippi/upscaled-123456-original.png",
    "credits": 2
  }
  ```

### 2.6 Uncrop (Expand Image Bounds)
- **Route**: `POST /api/image/uncrop`
- **Auth Required**: **Yes**
- **Headers**: `Content-Type: multipart/form-data`
- **Request Body**:
  - `image_file`: File (JPEG, PNG, WebP, BMP, TIFF)
  - `width`: Number (pixels to extend left and right, e.g. `200`)
  - `height`: Number (pixels to extend up and down, e.g. `200`)
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Image uncropped and uploaded successfully!",
    "imageUrl": "https://ik.imagekit.io/clippi/uncrop-123456-original.png",
    "credits": 2
  }
  ```

---

## 3. History Endpoints (`/api/history`)

> [!NOTE]
> All history endpoints require authentication.

### 3.1 Get Generation History
- **Route**: `GET /api/history/get_history`
- **Auth Required**: **Yes**
- **Response (200 OK)**:
  *Returns items sorted in reverse chronological order (newest first).*
  ```json
  {
    "success": true,
    "message": "History fetched successfully",
    "data": [
      {
        "_id": "HISTORY_ITEM_ID_HEX",
        "user": "USER_ID_HEX",
        "operation": "remove-background",
        "input_image": "https://ik.imagekit.io/clippi/original-12345.png",
        "output_image": "https://ik.imagekit.io/clippi/no-bg-12345.png",
        "createdAt": "2026-06-03T...",
        "updatedAt": "2026-06-03T..."
      },
      {
        "_id": "HISTORY_ITEM_ID_HEX_2",
        "user": "USER_ID_HEX",
        "operation": "text-to-image",
        "prompt": "a vibrant sunset",
        "output_image": "https://ik.imagekit.io/clippi/text-to-image-12345.png",
        "createdAt": "2026-06-02T...",
        "updatedAt": "2026-06-02T..."
      }
    ]
  }
  ```

### 3.2 Get Specific History Item by ID
- **Route**: `GET /api/history/get_history_by_id/:id`
- **Auth Required**: **Yes**
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "History item fetched successfully",
    "data": {
      "_id": "HISTORY_ITEM_ID_HEX",
      "user": "USER_ID_HEX",
      "operation": "remove-background",
      "input_image": "https://ik.imagekit.io/clippi/original-12345.png",
      "output_image": "https://ik.imagekit.io/clippi/no-bg-12345.png",
      "createdAt": "2026-06-03T..."
    }
  }
  ```

### 3.3 Delete Specific History Item by ID
- **Route**: `DELETE /api/history/delete_history_by_id/:id`
- **Auth Required**: **Yes**
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "History item deleted successfully"
  }
  ```

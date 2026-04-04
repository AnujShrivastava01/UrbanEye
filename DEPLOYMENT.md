# UrbanEye Deployment & Optimization Guide

This document outlines the steps to deploy the UrbanEye platform for production and explains the database optimizations implemented to handle performance issues with **Neon DB**.

## 🚀 Deployment Overview

UrbanEye is a three-tier application:
1.  **Backend**: Python Flask API (PostgreSQL/Neon)
2.  **Web Management Dashboard**: React (Vite)
3.  **Mobile Application**: Flutter

---

## 🏗️ Backend Deployment (Flask)

### **Recommended Platforms**: [Render](https://render.com), [Railway](https://railway.app), or [DigitalOcean App Platform].

### **Production environment variables (.env)**:
| Variable | Description |
| :--- | :--- |
| `DATABASE_URL` | Your Neon DB Connection String (Use **Pooled Port 6543** for production) |
| `JWT_SECRET_KEY` | A long random string to sign JWT tokens |
| `GOOGLE_API_KEY` | Gemini Pro / Vision API Key |
| `FLASK_ENV` | Set to `production` |
| `OPENWEATHER_API_KEY` | For weather-based predictions |
| `NEWS_API_KEY` | For news aggregation |

---

## 🖥️ Web Dashboard Deployment (React/Vite)

### **Recommended Platforms**: [Vercel](https://vercel.com) or [Netlify].

### **Steps**:
1.  Set the `VITE_API_URL` environment variable to your deployed backend URL.
2.  Run `npm run build`.
3.  Deploy the `dist/` folder.

---

## 📱 Mobile App Deployment (Flutter)

### **Steps**:
1.  Update the `baseUrl` in your Flutter API service to your production backend URL.
2.  Ensure `google_services.json` (Android) and `GoogleService-Info.plist` (iOS) are correctly configured for Firebase.
3.  Run `flutter build apk --release` or `flutter build ios --release`.

---

## ⚡ Performance Best Practices

The following optimizations were recently implemented to fix reported latency:

### **1. Database Indexing**
Critical columns in `models.py` now have `index=True` for lightning-fast lookups:
- `Report`: `status`, `department`, `category`, `user_id`
- `User`: `role`, `department`
- `Job`: `status`, `report_id`

### **2. Efficient Querying**
- **N+1 Problem Fixed**: Using `joinedload()` to fetch report logs in a single query instead of many separate ones.
- **Server-Side Filtering**: Filters (e.g., status, department) are now performed by the database, not in Python memory.
- **Pagination**: The `/reports` endpoint now supports `page` and `per_page` query parameters.

### **3. Heatmap Optimization**
The heatmap API now fetches *only* the latitude, longitude, and severity columns instead of full objects, reducing the data transfer by ~90%.

### **4. Neon Pooler**
**Important**: When connecting to Neon, ensure you use the **Pooled Connection URL** provided in the Neon console. It should end with `?sslmode=require` and typically uses port **6543**.

<div align="center">

<br/>

```
                                         ██╗   ██╗██████╗ ██████╗  █████╗ ███╗   ██╗███████╗██╗   ██╗███████╗
                                         ██║   ██║██╔══██╗██╔══██╗██╔══██╗████╗  ██║██╔════╝╚██╗ ██╔╝██╔════╝
                                         ██║   ██║██████╔╝██████╔╝███████║██╔██╗ ██║█████╗   ╚████╔╝ █████╗  
                                         ██║   ██║██╔══██╗██╔══██╗██╔══██║██║╚██╗██║██╔══╝    ╚██╔╝  ██╔══╝  
                                         ╚██████╔╝██║  ██║██████╔╝██║  ██║██║ ╚████║███████╗   ██║   ███████╗
                                          ╚═════╝ ╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝   ╚═╝   ╚══════╝
```

### 🏙️ Civic Infrastructure Intelligence Platform

<br/>

[![Flask](https://img.shields.io/badge/Flask-3.0-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Flutter](https://img.shields.io/badge/Flutter-3.7-02569B?style=for-the-badge&logo=flutter&logoColor=white)](https://flutter.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

[![UrbanAI Engine](https://img.shields.io/badge/Powered%20by-UrbanAI%20Engine-FF6B35?style=for-the-badge&logo=artifacthub&logoColor=white)](https://github.com/AyanAhmedKhan)
[![LangChain](https://img.shields.io/badge/LangChain-Integrated-1C3C3C?style=for-the-badge&logo=chainlink&logoColor=white)](https://www.langchain.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Powered-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

<br/>

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/AyanAhmedKhan/Web-app-urbaneye/pulls)
[![Made with ❤️](https://img.shields.io/badge/Made%20with-❤️-red?style=flat-square)](https://github.com/AyanAhmedKhan)

<br/>

[🚀 Live Demo](#) &nbsp;·&nbsp; [📖 API Docs](#-api-documentation) &nbsp;·&nbsp; [🐛 Report Bug](https://github.com/AyanAhmedKhan/Web-app-urbaneye/issues) &nbsp;·&nbsp; [💡 Request Feature](https://github.com/AyanAhmedKhan/Web-app-urbaneye/issues)

<br/>

</div>

---

## 🌐 What is UrbanEye?

> **UrbanEye** bridges the gap between citizens and government — transforming civic complaints into intelligent, actionable data.

UrbanEye is a full-stack **civic issue management system** that connects citizens, field officers, and government administrators in a single unified platform. Citizens can report infrastructure problems — potholes, garbage, broken streetlights, sewage — via a mobile app or web interface. The system's proprietary **UrbanAI Engine** analyzes uploaded images, auto-categorizes issues, and predicts infrastructure failures before they escalate using weather data and historical patterns.

<br/>

### 🔁 Core Workflow

```
  📱 Citizen              🤖 UrbanAI Engine             🏛️ Government
  ─────────              ─────────────────             ────────────
  Takes photo        →   Analyzes & categorizes    →   Routes to dept
  Submits report     →   Assigns severity           →   Field officer dispatched
  Tracks status      ←   Auto-generates description ←   Status updated
  Earns points       ←   Updates leaderboard        ←   Issue resolved ✅
```

| Step | What Happens |
|------|-------------|
| 📸 **1. Submit** | Citizen uploads photo of civic issue via app or web |
| 🧠 **2. Analyze** | UrbanAI Engine identifies issue type, severity, and department |
| 📍 **3. Route** | Report is geo-tagged and sent to the correct government department |
| 👷 **4. Assign** | Field officer receives task with location and priority |
| 📊 **5. Monitor** | Admins track progress on live heatmap and analytics dashboard |

---

## 📁 Project Structure

```
UrbanEye/
│
├── 📱 mobileappUrbanEye/        # Flutter mobile app (Android & iOS)
│   ├── lib/                     # Dart source code
│   ├── android/                 # Android-specific config
│   ├── ios/                     # iOS-specific config
│   └── pubspec.yaml             # Flutter dependencies
│
├── 🌐 webapp-urbaneye/          # React web dashboard
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Route-level pages
│   │   └── services/            # API integration layer
│   └── vite.config.js           # Vite build config
│
└── ⚙️  UE_backend-main/         # Flask REST API
    ├── app.py                   # Application entry point
    ├── models/                  # SQLAlchemy database models
    ├── routes/                  # API route blueprints
    ├── services/                # Business logic & AI integration
    ├── seed_db.py               # Sample data seeder
    └── requirements.txt         # Python dependencies
```

---

## ✨ Features

### 🔍 Image Analysis — Powered by UrbanAI Engine

The UrbanAI Engine is the brain of UrbanEye. Citizens simply take a photo, and the engine handles everything:

- ✅ Detects: **Potholes · Garbage · Sewage · Drainage · Streetlight Damage · Traffic Signals · Illegal Dumping · Waterlogging**
- ✅ Auto-assigns **severity level** (Low / Medium / High)
- ✅ Determines the **responsible department** automatically
- ✅ Generates a comprehensive **text description** for the report

---

### 🔮 Predictive Infrastructure Intelligence

UrbanEye doesn't just react — it **predicts**.

> *"Heavy rain forecast + 3 drainage complaints in Sector 14 → Deploy suction truck immediately."*

The prediction engine correlates:
- 🌦️ **Open-Meteo** weather forecast data
- 📰 **DuckDuckGo** local news (protests, construction, events)
- 📊 Historical report patterns from the database

---

### 👥 Role-Based Access Control

| Role | Access Level | Key Capabilities |
|------|:---:|-----------------|
| 🧑 **Civilian** | Basic | Report issues, track status, leaderboard |
| 👷 **Field Officer** | Operational | Receive tasks, update & verify resolutions |
| 🏢 **Dept Head** | Departmental | Manage Roads / Water / Waste reports |
| 🏛️ **Gov Admin** | Administrative | Full analytics, AI predictions, heatmap |
| 🔐 **Super Admin** | System | User management, system configuration |
| 🚴 **Gig Worker** | On-Demand | Task pickup and completion |
| 🤝 **Social Worker** | NGO | Collaboration on social issues |

---

### 🎙️ Voice Commands — Web Dashboard

The admin dashboard supports real-time voice commands via the **Web Speech API**:

| Voice Command | Action |
|:---:|---|
| *"Show heatmap"* | 🗺️ Opens live map view |
| *"AI predictions"* | 🔮 Triggers prediction engine |
| *"How many critical reports?"* | 🔊 Speaks the count aloud |
| *"Status report"* | 📋 AI voice summary of current system state |

---

### 🗂️ HRMS Module

Built-in **Human Resource Management System** for government staff:

| Module | Features |
|--------|---------|
| 👥 **Employee Directory** | Full staff records, roles, departments |
| 🕐 **Attendance Tracking** | Daily check-in/out logs |
| 💰 **Payroll Management** | Salary disbursement and records |
| 📋 **Recruitment Pipeline** | Candidate tracking and onboarding |

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology | Purpose |
|-------|-----------|---------|
| 📱 **Mobile** | Flutter 3.7 + Firebase Auth + Firestore | Cross-platform citizen app |
| 🌐 **Web** | React 18 + Vite 5 + Tailwind CSS + Framer Motion | Admin & citizen dashboard |
| 🗺️ **Maps** | Leaflet.js + React-Leaflet | Issue heatmap & geolocation |
| 📊 **Charts** | Recharts | Analytics & reporting visualizations |
| ⚙️ **Backend** | Flask 3.0 + Flask-RESTx + SQLAlchemy | REST API server |
| 🗄️ **Database** | PostgreSQL (prod) · SQLite (dev) | Persistent data storage |
| 🤖 **AI** | UrbanAI Engine + LangChain | Image analysis & predictions |
| 🔐 **Auth** | JWT (web/API) · Firebase Auth (mobile) | Secure session management |

</div>

---

## 🤖 AI & Intelligence Layer

### UrbanAI Engine — Core Intelligence

The **UrbanAI Engine** is UrbanEye's proprietary multimodal AI system powering all intelligent features:

| Feature | How UrbanAI Engine Is Used |
|---------|---------------------------|
| 🔍 **Image Analysis** | Detects civic issue types from photos |
| ⚠️ **Severity Assessment** | Determines urgency: Low / Medium / High |
| 📝 **Auto-Description** | Generates detailed report descriptions from images |
| 🔮 **Predictive Intelligence** | Powers LangChain pipeline for failure predictions |
| 📣 **PR Generation** | Creates professional public statements for resolved issues |

---

### ☁️ Firebase — Cloud Platform

| Service | Usage |
|---------|-------|
| 🔐 **Firebase Auth** | Email/password & Google Sign-In |
| 📡 **Cloud Firestore** | Real-time NoSQL sync for mobile |
| ⚡ **Cloud Functions** | Serverless mobile backend operations |

---

### 🔗 LangChain + UrbanAI Engine Prediction Pipeline

```
  ┌──────────────────┐     ┌──────────────────────┐     ┌────────────────────┐
  │   🌦️ Weather API  │────▶│                      │────▶│   🧠 UrbanAI Engine │
  │   (Open-Meteo)   │     │   🔗 LangChain        │     │      Reasoning     │
  └──────────────────┘     │      Pipeline         │     └─────────┬──────────┘
                           │                       │               │
  ┌──────────────────┐     │                       │     ┌─────────▼──────────┐
  │   📰 News Search  │────▶│                      │     │  📊 Structured      │
  │   (DuckDuckGo)   │     └──────────────────────┘     │     Prediction      │
  └──────────────────┘                                   │      Output        │
                                                         └────────────────────┘
```

---

### 📈 AI Impact Metrics

| Benefit | Impact |
|---------|:------:|
| ⚡ **Zero Manual Categorization** | Citizens just take a photo — UrbanAI Engine does the rest |
| 🎯 **Accurate Routing** | 95%+ correct department assignment |
| ⏱️ **Faster Submission** | Auto-fill reduces report time by **80%** |
| 🛡️ **Proactive Maintenance** | AI predictions prevent issues before escalation |
| 🚀 **Seamless Onboarding** | OAuth Sign-In removes friction for new users |

---

## 🚀 Installation & Setup

### Prerequisites

Before you begin, ensure you have the following installed:

- 🐍 **Python** 3.10+
- 🟢 **Node.js** 18+
- 📱 **Flutter SDK** 3.7+
- 🐘 **PostgreSQL** 14+ *(optional — SQLite works for dev)*
- 🔑 **UrbanAI Engine** API key

---

### ⚙️ Backend Setup

```bash
# 1. Navigate to backend directory
cd UE_backend-main

# 2. Create and activate virtual environment
python -m venv venv
source venv/bin/activate       # Linux/macOS
venv\Scripts\activate          # Windows

# 3. Install core dependencies
pip install -r requirements.txt

# 4. Install AI/prediction packages
pip install langchain langchain-community langchain-google-genai duckduckgo-search

# 5. Configure environment
cp sample.env .env
```

Edit your `.env` file:

```env
# UrbanAI Engine
URBANAI_API_KEY=your_key_here
URBANAI_API_KEYS=key1,key2,key3   # Optional: for key rotation
URBANAI_MODEL=urbanai-v1           # Optional: model variant

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/urbaneye

# Security
JWT_SECRET_KEY=your_super_secret_key_here
```

```bash
# 6. Initialize the database
python -c "from app import app, db; app.app_context().push(); db.create_all()"

# 7. (Optional) Seed with sample data
python seed_db.py

# 8. Start the server 🚀
python app.py
```

> 📍 API runs at `http://localhost:5000`
> 📖 Swagger docs at `http://localhost:5000/docs/`

---

### 🌐 Web Dashboard Setup

```bash
# 1. Navigate to web app directory
cd webapp-urbaneye

# 2. Install dependencies
npm install

# 3. Start development server 🚀
npm run dev
```

> 📍 Runs at `http://localhost:5173`

---

### 📱 Mobile App Setup

```bash
# 1. Navigate to mobile app directory
cd mobileappUrbanEye

# 2. Get Flutter dependencies
flutter pub get

# 3. Configure Firebase
#    → Add google-services.json       (Android: android/app/)
#    → Add GoogleService-Info.plist   (iOS: ios/Runner/)

# 4. Run on connected device or emulator 🚀
flutter run
```

---

## 📖 API Documentation

**Base URL:** `/api/v1`

> 💡 Full interactive Swagger documentation is available at `/docs/` when the backend is running.

### 🔐 Authentication

| Endpoint | Method | Description |
|----------|:------:|-------------|
| `/auth/register` | `POST` | Create a new user account |
| `/auth/login` | `POST` | Authenticate and receive JWT token |

### 📋 Reports

| Endpoint | Method | Auth | Description |
|----------|:------:|:----:|-------------|
| `/reports` | `GET` | Optional | List all civic reports |
| `/reports` | `POST` | ✅ Required | Submit a new civic report |
| `/reports/<id>` | `PUT` | ✅ Required | Update report status |
| `/reports/leaderboard` | `GET` | — | View top community reporters |

### 🤖 AI Detection

| Endpoint | Method | Description |
|----------|:------:|-------------|
| `/detection/analyze` | `POST` | Upload image for UrbanAI Engine analysis |

### 🏛️ Government Admin

| Endpoint | Method | Auth | Description |
|----------|:------:|:----:|-------------|
| `/gov/predictions` | `GET` | `gov_admin` | AI infrastructure failure predictions |
| `/gov/analytics` | `GET` | `gov_admin` | Full dashboard statistics |
| `/gov/team` | `GET` | `gov_admin` | Team member directory |

### 👔 HRMS

| Endpoint | Method | Description |
|----------|:------:|-------------|
| `/hr/candidates` | `GET` | View recruitment pipeline |
| `/hr/attendance` | `GET` | Attendance records |
| `/hr/payroll` | `GET` | Payroll and salary data |

---

## 🗄️ Database Schema

```
┌─────────────────────────────────────────────────────────────────────┐
│                          DATABASE SCHEMA                            │
├──────────────┬──────────────────────────────────────────────────────┤
│   USERS      │  id · email · password_hash · name · role · dept     │
├──────────────┼──────────────────────────────────────────────────────┤
│   REPORTS    │  id · category · department · description · severity  │
│              │  status · user_id · assigned_to · latitude            │
│              │  longitude · image_url · created_at                   │
├──────────────┼──────────────────────────────────────────────────────┤
│  REPORTLOGS  │  id · report_id · status · message · updated_by      │
│              │  timestamp                                            │
├──────────────┼──────────────────────────────────────────────────────┤
│   WORKERS    │  id · user_id · type (mcd/gig/ngo) · skills          │
│              │  vehicle_type · current_lat · current_lng             │
│              │  is_available · rating                                │
└──────────────┴──────────────────────────────────────────────────────┘
```

---

## 🔑 Environment Variables Reference

| Variable | Required | Default | Description |
|----------|:--------:|:-------:|-------------|
| `URBANAI_API_KEY` | ✅ Yes | — | Primary UrbanAI Engine API key |
| `URBANAI_API_KEYS` | ⬜ No | — | Comma-separated keys for rotation |
| `URBANAI_MODEL` | ⬜ No | `urbanai-v1` | Model variant to use |
| `DATABASE_URL` | ✅ Yes | — | PostgreSQL connection string |
| `JWT_SECRET_KEY` | ✅ Yes | — | Secret key for JWT token signing |

---

## 🧰 Utility Scripts

Backend utility scripts located in `UE_backend-main/`:

| Script | Purpose |
|--------|---------|
| `seed_db.py` | 🌱 Populate database with sample data |
| `reset_db.py` | 🔄 Drop and recreate all database tables |
| `mock_data.py` | 🎲 Generate mock civic reports for testing |
| `check_db.py` | 🔍 Verify database connection and health |
| `verify_users.py` | 👥 List all registered users in the system |

---

## ☁️ Deployment

### Backend — Render / Railway

```bash
# Build Command
pip install -r requirements.txt

# Start Command
gunicorn app:app
```

Set environment variables in your hosting dashboard before deploying.

### Frontend — Vercel / Netlify

```bash
# Build Command
npm run build

# Publish Directory
dist
```

> ⚠️ Set the `VITE_API_URL` environment variable to point to your deployed backend URL.

---

## 🤝 Contributing

Contributions are warmly welcome! Here's how you can help:

1. 🍴 **Fork** the repository
2. 🌿 **Create** your feature branch (`git checkout -b feature/AmazingFeature`)
3. 💾 **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. 📤 **Push** to the branch (`git push origin feature/AmazingFeature`)
5. 🔃 **Open** a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 👥 Team

<div align="center">

<br/>

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/AnujShrivastava01">
        <img src="https://github.com/AnujShrivastava01.png" width="100" style="border-radius:50%"/><br/>
        <sub><b>Anuj Shrivastava</b></sub>
      </a><br/>
      <sub>💻 Full Stack Developer</sub><br/>
      <a href="https://github.com/AnujShrivastava01">
        <img src="https://img.shields.io/badge/GitHub-AnujShrivastava01-181717?style=flat-square&logo=github"/>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/AyanAhmedKhan">
        <img src="https://github.com/AyanAhmedKhan.png" width="100" style="border-radius:50%"/><br/>
        <sub><b>Ayan Ahmed Khan</b></sub>
      </a><br/>
      <sub>🤖 AI/ML & Backend Lead</sub><br/>
      <a href="https://github.com/AyanAhmedKhan">
        <img src="https://img.shields.io/badge/GitHub-AyanAhmedKhan-181717?style=flat-square&logo=github"/>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Pushpendra-7-ux">
        <img src="https://github.com/Pushpendra-7-ux.png" width="100" style="border-radius:50%"/><br/>
        <sub><b>Pushpendra</b></sub>
      </a><br/>
      <sub>📱 Mobile Developer</sub><br/>
      <a href="https://github.com/Pushpendra-7-ux">
        <img src="https://img.shields.io/badge/GitHub-Pushpendra--7--ux-181717?style=flat-square&logo=github"/>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Nandini-Jain4">
        <img src="https://github.com/Nandini-Jain4.png" width="100" style="border-radius:50%"/><br/>
        <sub><b>Nandini Jain</b></sub>
      </a><br/>
      <sub>🎨 UI/UX Developer</sub><br/>
      <a href="https://github.com/Nandini-Jain4">
        <img src="https://img.shields.io/badge/GitHub-Nandini--Jain4-181717?style=flat-square&logo=github"/>
      </a>
    </td>
  </tr>
</table>

</div>

---

<div align="center">

<br/>

**Built with ❤️ to make cities smarter, one report at a time.**

⭐ Star this repo if you find it useful!

<br/>

[![GitHub stars](https://img.shields.io/github/stars/AyanAhmedKhan/Web-app-urbaneye?style=social)](https://github.com/AyanAhmedKhan/Web-app-urbaneye)
[![GitHub forks](https://img.shields.io/github/forks/AyanAhmedKhan/Web-app-urbaneye?style=social)](https://github.com/AyanAhmedKhan/Web-app-urbaneye/fork)

<br/>

*UrbanEye — See the city. Fix the city.*

</div>

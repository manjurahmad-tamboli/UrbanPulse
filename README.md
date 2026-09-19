# UrbanPulse — AI-Powered Mobile Urban Intelligence Platform

> **Smart India Hackathon 2026** | Problem Statement **26124** | **Bharat Electronics Limited** | Theme: Smart Automation

UrbanPulse transforms existing public transport buses into intelligent, mobile urban sensing units. Cameras mounted on public buses continuously monitor road conditions, traffic density, and municipal infrastructure while buses navigate regular transit routes.

![UrbanPulse](https://img.shields.io/badge/SIH-2026-cyan) ![Next.js](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-teal)

---

## 🏗️ Architecture

```
PUBLIC BUS (Edge)              CLOUD PLATFORM              CITY DASHBOARD
┌──────────────────┐     ┌─────────────────────┐     ┌──────────────────┐
│ Front/Side Camera│     │ FastAPI Backend      │     │ Command Center  │
│ YOLO Detection   │────▶│ PostgreSQL/PostGIS   │────▶│ Road Health Map│
│ GPS Module       │     │ Issue Deduplication  │     │ Issue Management│
│ Edge AI (Jetson) │     │ Analytics Engine     │     │ Traffic Intel   │
│ Privacy Redaction│     │ Repair Verification  │     │ Fleet Monitoring│
└──────────────────┘     └─────────────────────┘     └──────────────────┘
     ~15 KB/detection          Real-time API              WebSocket
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd urbanpulse

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

---

## 📂 Project Structure

```
urbanpulse/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Command Center Dashboard
│   │   ├── ai-demo/            # AI Detection Demo (centerpiece)
│   │   ├── live-monitor/       # Real-time Bus Fleet Monitor
│   │   ├── road-health/        # Road Health Map
│   │   ├── issues/             # Issue Management + Details
│   │   ├── traffic/            # Traffic Intelligence
│   │   ├── analytics/          # Analytics Dashboard
│   │   ├── fleet/              # Fleet & Edge Device Management
│   │   ├── architecture/       # System Architecture Diagram
│   │   ├── pilot/              # Pilot Deployment Roadmap
│   │   └── settings/           # System Configuration
│   ├── components/
│   │   ├── sidebar.tsx         # Navigation sidebar
│   │   ├── header.tsx          # Top bar with controls
│   │   ├── maps/               # Leaflet map components
│   │   └── video/              # AI demo video components
│   ├── data/
│   │   └── mock-data.ts        # Realistic demo data
│   └── lib/
│       ├── types.ts            # TypeScript interfaces
│       ├── simulation.ts       # Simulation engine
│       ├── geo.ts              # Spatial utilities
│       └── utils.ts            # Helper functions
├── public/
│   ├── videos/                 # Demo video files
│   ├── images/                 # Project images
│   └── detections/             # Detection evidence
└── README.md
```

---

## 🎬 How to Replace the Demo Video

The AI Detection Demo page supports custom pothole detection videos:

1. Place your video file at: `public/videos/pothole-demo.mp4`
2. Supported formats: MP4 (H.264)
3. Recommended resolution: 1920×1080 or 1280×720
4. The video player will automatically use your video instead of the canvas simulation

You can also upload videos directly through the "Upload Video" tab on the `/ai-demo` page.

---

## 🤖 How to Add Real YOLO Inference

The current prototype uses simulated detections. To integrate real inference:

1. **Backend API**: Create a FastAPI endpoint at `/api/detect`
2. **Model**: Use YOLOv8/v11 trained on road damage datasets
3. **Integration Point**: Modify `src/components/video/ai-video-player.tsx`
   - Replace the simulated detection logic with API calls
   - Send video frames to the backend for inference
   - Receive bounding box coordinates and confidence scores

```python
# Example FastAPI endpoint
from ultralytics import YOLO

model = YOLO("urbanpulse-roaddetect.pt")

@app.post("/api/detect")
async def detect(frame: UploadFile):
    results = model(frame)
    return results.to_json()
```

---

## 🗄️ How to Connect PostgreSQL/PostGIS

The prototype uses in-memory mock data. To connect a real database:

1. Install PostgreSQL with PostGIS extension
2. Create database schema using models in `src/lib/types.ts`
3. Update API endpoints in `src/lib/api.ts`
4. Set environment variables:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/urbanpulse
POSTGIS_ENABLED=true
```

---

## 🌐 How to Deploy

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16, React 19, TypeScript |
| **Styling** | Tailwind CSS 4, Framer Motion |
| **Charts** | Recharts |
| **Maps** | Leaflet, React-Leaflet, OpenStreetMap |
| **Icons** | Lucide React |
| **AI Pipeline** | Python, YOLOv8, PyTorch, OpenCV |
| **Edge Device** | NVIDIA Jetson Orin Nano, TensorRT |
| **Backend** | FastAPI (planned), Next.js API Routes |
| **Database** | PostgreSQL/PostGIS (planned), Mock JSON |
| **Communication** | 4G/5G, Offline Queue |

---

## 📊 Key Features

- ✅ Interactive Command Center Dashboard
- ✅ Real-time Bus Fleet Monitoring
- ✅ AI Pothole Detection Demo with YOLO overlay
- ✅ 9-Step Detection Pipeline Animation
- ✅ Road Health Map with segment scoring
- ✅ Issue Management with filters & details
- ✅ Before/After Repair Verification
- ✅ Traffic Intelligence & Vehicle Classification
- ✅ Analytics & Bandwidth Comparison
- ✅ Fleet & Edge Device Management
- ✅ System Architecture Diagram
- ✅ Pilot Deployment Roadmap
- ✅ Presentation Mode for SIH judges
- ✅ 15-Step Automated Scenario Demo
- ✅ Live Simulation Mode
- ✅ Notification Center
- ✅ Privacy-First Edge Processing

---

## 👥 Team UrbanPulse

Smart India Hackathon 2026 | Problem Statement 26124 | Bharat Electronics Limited

---

*Prototype demonstration using simulated/illustrative data.*

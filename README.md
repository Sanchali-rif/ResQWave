# ResQWave Backend

Disaster-resilient MERN backend with Google AI Triage and offline-first mesh sync capability.

## Features
- **Offline-First Sync**: Deduplicates and merges incoming SOS signals via `chirpID`.
- **AI Triage**: Uses Gemini 3 Flash to automatically classify SOS priority, category, and summarize.
- **Geospatial Search**: MongoDB `$near` queries to find SOS signals near rescuers.
- **Real-Time Updates**: Socket.io integration to broadcast updates to the Command Center dashboard.
- **Secure**: Firebase Auth middleware to protect sensitive rescuer endpoints.

## Environment Variables
Create a `.env` file in the root directory:
```env
PORT=8080
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
LOG_LEVEL=info
FIREBASE_PROJECT_ID=your_firebase_project_id
```

## Setup & Run
```bash
npm install
npm start
```

## Docker
```bash
docker build -t echopulse-backend .
docker run -p 8080:8080 --env-file .env echopulse-backend
```

## API Documentation

### POST `/api/sos/report`
Ingests an SOS report. Deduplicates by `chirpID`.
**Body:**
```json
{
  "chirpID": "unique-id-123",
  "rawText": "Need medical help, building collapsed at 5th ave.",
  "location": {
    "coordinates": [-73.935242, 40.730610]
  },
  "metadata": { "battery": "50%" }
}
```

### GET `/api/rescue/nearby?lat=40.730610&lng=-73.935242&radius=5000`
Gets nearby SOS signals within `radius` (meters). Requires Bearer token from Firebase Auth.
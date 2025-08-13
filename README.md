# Image2Location

A full-stack application that identifies locations from uploaded images and provides detailed travel information. The application consists of a FastAPI backend and a React/TypeScript frontend.

## Project Structure

### Backend (Python/FastAPI)

```
backend/
├── main.py              # Entry point, FastAPI app configuration
├── requirements.txt     # Python dependencies
├── database/            # Database connection setup
├── middleware/          # Authentication middleware
├── models/              # Data models
└── routes/              # API endpoints
```

### Frontend (React/TypeScript)

```
frontend/
├── src/
│   ├── App.tsx         # Main application component
│   ├── components/     # Reusable UI components
│   ├── context/        # React context for state management
│   ├── Hooks/          # Custom React hooks
│   └── pages/          # Page components
```

## Features

### Authentication
- User signup with password strength validation
- Login/logout functionality with JWT authentication
- Secure cookie-based session management

### Core Functionality
- Image upload and location detection using AI
- Interactive maps display using Google Maps API
- AI-generated travel information for detected locations
- User-specific location data management

### Technical Features
- Server-sent events (SSE) for streaming responses
- Integration with external AI services (Picarta for location detection, OpenAI for travel info)
- Supabase integration for authentication and data storage

## Setup Instructions

### Prerequisites
- Python 3.9+
- Node.js and npm
- Supabase account
- API keys for: Picarta, OpenAI, Google Maps

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Create a `.env` file with the following variables:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   SUPABASE_SERVICE=your_supabase_service_role_key
   SUPABASE_BUCKET=your_supabase_bucket_name
   SUPABASE_JWT_SECRET=your_supabase_jwt_secret
   PICARTA_API_KEY=your_picarta_api_key
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Run the server:
   ```
   python main.py
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with:
   ```
   VITE_MAPS_API_KEY=your_google_maps_api_key
   ```

4. Start the development server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /signup` - Create new user account
- `POST /login` - Authenticate user and generate token
- `GET /logout` - Clear user session
- `GET /verify` - Verify user authentication

### Location Services
- `POST /addImage` - Upload and analyze image for location data
- `GET /locations` - List user's saved locations
- `GET /locationInfo` - Get detailed travel information about a location
- `GET /location/{id}` - Get specific location details
- `DELETE /location/{id}` - Delete a saved location

## Technologies Used

### Backend
- FastAPI
- Supabase
- Picarta API
- OpenAI API
- Python

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Axios

## Development

The application uses a microservices architecture with the backend and frontend separated. The backend serves as an API gateway that integrates external services and provides authentication, while the frontend focuses on the user interface and experience.

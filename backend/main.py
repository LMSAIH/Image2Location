import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth import router as authRouter
from dotenv import load_dotenv

from routes.api import router as apiRoutes


load_dotenv()

app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"]
)

app.include_router(authRouter)
app.include_router(apiRoutes)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000,reload=True)

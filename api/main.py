from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import todo_routes
from routes import pratos_routes

app = FastAPI()

app.include_router(pratos_routes.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(todo_routes.router)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import classificacao_routes
from routes import produtos_routes
from routes import pedido_routes
from routes import sacola_routes


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(pedido_routes.router)

app.include_router(classificacao_routes.router)

app.include_router(produtos_routes.router)

app.include_router(sacola_routes.router)



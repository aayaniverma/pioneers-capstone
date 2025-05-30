from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import doc_generator, contract_generator, verification

app = FastAPI()

# Allow requests from your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Use specific domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(doc_generator.router, prefix="/api")
app.include_router(contract_generator.router, prefix="/api")
app.include_router(verification.router, prefix="/api")
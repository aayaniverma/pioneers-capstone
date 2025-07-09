from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import doc_generator, contract_generator, verification
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import blockchain_routes
from routes import html_to_docx
from fastapi.staticfiles import StaticFiles
from routes import verification




app = FastAPI()
app.mount("/temp", StaticFiles(directory="temp"), name="temp")
# Allow requests from your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Use specific domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(blockchain_routes.router, prefix="/api/blockchain", tags=["blockchain"])
app.include_router(doc_generator.router, prefix="/api")
app.include_router(contract_generator.router, prefix="/api")
app.include_router(verification.router, prefix="/api")
app.include_router(html_to_docx.router, prefix="/api")

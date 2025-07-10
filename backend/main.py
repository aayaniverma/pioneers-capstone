from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from routes import doc_generator, contract_generator, review, html_to_docx, blockchain_routes, verification

app = FastAPI()

app.mount("/temp", StaticFiles(directory="temp"), name="temp")

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Route registration
app.include_router(blockchain_routes.router, prefix="/api/blockchain", tags=["blockchain"])
app.include_router(verification, prefix="/api", tags=["verification"])
app.include_router(doc_generator.router, prefix="/api")
app.include_router(contract_generator.router, prefix="/api")
app.include_router(html_to_docx.router, prefix="/api")
app.include_router(review.router, prefix="/api/review")

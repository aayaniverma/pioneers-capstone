from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from routes import doc_generator, contract_gen, review, html_to_docx, blockchain_routes, html_to_pdf_only
from routes.verification import router as verification_router

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
app.include_router(verification_router, prefix="/api", tags=["verification"])
app.include_router(doc_generator.router, prefix="/api")
app.include_router(contract_gen.router, prefix="/api")
app.include_router(html_to_docx.router, prefix="/api")
app.include_router(review.router, prefix="/api")
app.include_router(html_to_pdf_only.router)

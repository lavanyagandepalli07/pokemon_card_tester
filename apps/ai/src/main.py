"""
FastAPI service for ML model inference
Pokemon Card Authentication Platform - Phase 1+
"""

from fastapi import FastAPI
from datetime import datetime

app = FastAPI(
    title="Pokemon Card Auth - AI Service",
    version="0.1.0",
    description="ML inference service for OCR, authenticity, and condition analysis",
)


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "ok", "timestamp": datetime.now()}


@app.get("/info")
def get_info():
    """Service information"""
    return {
        "name": "Pokemon Card Auth - AI Service",
        "version": "0.1.0",
        "models": {
            "ocr": {"status": "loading", "version": "1.0"},
        },
    }


@app.post("/ocr")
def ocr_extract(image_data: dict):
    """
    Extract text from card image
    Expected input: { "image": "base64-encoded-image" }
    """
    return {
        "success": False,
        "error": "OCR endpoint not yet implemented",
        "timestamp": datetime.now(),
    }


@app.post("/authenticity")
def check_authenticity(scan_data: dict):
    """
    Check authenticity of card
    Phase 3+ endpoint
    """
    return {
        "success": False,
        "error": "Authenticity endpoint not yet implemented",
        "timestamp": datetime.now(),
    }


@app.post("/condition")
def analyze_condition(scan_data: dict):
    """
    Analyze card condition
    Phase 7+ endpoint
    """
    return {
        "success": False,
        "error": "Condition endpoint not yet implemented",
        "timestamp": datetime.now(),
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)

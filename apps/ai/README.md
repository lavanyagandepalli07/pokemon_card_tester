# Python FastAPI service for ML model inference
# See requirements.txt for dependencies

## Installation

```bash
pip install -r requirements.txt
```

## Running

```bash
python -m uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
```

## Endpoints

- `GET /health` - Health check
- `POST /ocr` - Extract text from image (Phase 1)
- `POST /authenticity` - Check authenticity (Phase 3+)
- `POST /condition` - Analyze condition (Phase 7+)

from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI()
model = joblib.load("model.pkl")

class PredictRequest(BaseModel):
    input_data: list[float] 

@app.post("/predict")
def predict(req: PredictRequest):
    try:
        data = np.array(req.input_data).reshape(1, -1)
        prediction = model.predict(data)
        return {"result": prediction.tolist()}
    except Exception as e:
        return {"error": str(e)}

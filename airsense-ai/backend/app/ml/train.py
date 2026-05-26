from pathlib import Path

import joblib
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split

from app.ml.features import FEATURE_COLUMNS, build_training_frame, readings_to_frame
from app.models.reading import AirQualityReading


ARTIFACT_PATH = Path(__file__).resolve().parents[2] / "artifacts" / "aqi_model.joblib"


def train_model_from_db(db, artifact_path: Path = ARTIFACT_PATH) -> dict:
    readings = db.query(AirQualityReading).order_by(AirQualityReading.city, AirQualityReading.recorded_at).all()
    frame = build_training_frame(readings_to_frame(readings))
    if len(frame) < 20:
        raise ValueError("At least 20 readings are required to train the AQI model.")

    x = frame[FEATURE_COLUMNS]
    y = frame["future_aqi"]
    test_size = 0.2 if len(frame) >= 50 else 0.3
    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=test_size, random_state=42)

    model = RandomForestRegressor(n_estimators=180, max_depth=12, random_state=42, n_jobs=-1)
    model.fit(x_train, y_train)
    predictions = model.predict(x_test)
    mae = float(mean_absolute_error(y_test, predictions))
    rmse = float(np.sqrt(np.mean((y_test - predictions) ** 2)))
    r2 = float(r2_score(y_test, predictions)) if len(y_test) > 1 else 0.0

    artifact_path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(
        {
            "model": model,
            "feature_columns": FEATURE_COLUMNS,
            "metrics": {"mae": mae, "rmse": rmse, "r2": r2},
        },
        artifact_path,
    )
    return {"artifact_path": str(artifact_path), "mae": mae, "rmse": rmse, "r2": r2, "rows": len(frame)}


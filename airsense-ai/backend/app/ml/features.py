import pandas as pd


FEATURE_COLUMNS = [
    "previous_aqi",
    "aqi_lag_1",
    "aqi_lag_2",
    "aqi_lag_3",
    "pm25",
    "pm10",
    "co",
    "no2",
    "so2",
    "o3",
    "temperature",
    "humidity",
    "wind_speed",
    "hour",
    "day",
    "month",
]


def readings_to_frame(readings: list) -> pd.DataFrame:
    rows = []
    for reading in readings:
        rows.append(
            {
                "aqi": reading.aqi,
                "pm25": reading.pm25,
                "pm10": reading.pm10,
                "co": reading.co,
                "no2": reading.no2,
                "so2": reading.so2,
                "o3": reading.o3,
                "temperature": reading.temperature,
                "humidity": reading.humidity,
                "wind_speed": reading.wind_speed,
                "recorded_at": reading.recorded_at,
            }
        )
    frame = pd.DataFrame(rows)
    if frame.empty:
        return frame
    return frame.sort_values("recorded_at").reset_index(drop=True)


def add_time_features(frame: pd.DataFrame) -> pd.DataFrame:
    frame = frame.copy()
    frame["recorded_at"] = pd.to_datetime(frame["recorded_at"])
    frame["hour"] = frame["recorded_at"].dt.hour
    frame["day"] = frame["recorded_at"].dt.day
    frame["month"] = frame["recorded_at"].dt.month
    return frame


def build_training_frame(frame: pd.DataFrame) -> pd.DataFrame:
    if frame.empty:
        return frame
    frame = add_time_features(frame)
    frame["aqi_lag_1"] = frame["aqi"].shift(1)
    frame["aqi_lag_2"] = frame["aqi"].shift(2)
    frame["aqi_lag_3"] = frame["aqi"].shift(3)
    frame["previous_aqi"] = frame["aqi_lag_1"]
    frame["future_aqi"] = frame["aqi"].shift(-1)
    return frame.dropna().reset_index(drop=True)


def latest_feature_row(frame: pd.DataFrame) -> pd.DataFrame:
    frame = add_time_features(frame)
    frame["aqi_lag_1"] = frame["aqi"].shift(1)
    frame["aqi_lag_2"] = frame["aqi"].shift(2)
    frame["aqi_lag_3"] = frame["aqi"].shift(3)
    frame["previous_aqi"] = frame["aqi_lag_1"]
    row = frame.tail(1).copy()
    if row[["aqi_lag_1", "aqi_lag_2", "aqi_lag_3", "previous_aqi"]].isna().any(axis=None):
        latest_aqi = float(row["aqi"].iloc[0])
        row[["aqi_lag_1", "aqi_lag_2", "aqi_lag_3", "previous_aqi"]] = latest_aqi
    return row[FEATURE_COLUMNS]


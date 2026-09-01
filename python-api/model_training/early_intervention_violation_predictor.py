import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
import joblib
import numpy as np

def make_json_safe(data):
    if isinstance(data, dict):
        return {k: make_json_safe(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [make_json_safe(v) for v in data]
    elif isinstance(data, (np.integer, np.int64)):
        return int(data)
    elif isinstance(data, (np.floating, np.float64)):
        return float(data)
    elif pd.isna(data):
        return None
    else:
        return data


class EarlyInterventionViolationPredictor:
    def __init__(self, file):
        self.file = file
        self.df = pd.read_csv(f"./dataset/{self.file}.csv")
        self.model_name = f'./model_training/notebook/early-intervention-violation-predictor-model'
        self.model = None
    
    def train_model(self, save = False):
        df = self.df
        target = 'will_repeat_the_same_violation'
        cat_cols = ["violation_type"]
        num_cols = [
            "past_repeat_same_violation_count",
            "recent_same_violation_count",
            "months_since_last_same_violation",
            "clean_streak_length",
            "ongoing_same_violation_count"
        ]

        X = df[cat_cols + num_cols].copy()
        y = df[target].astype(int).copy()

        preprocess = ColumnTransformer(
            transformers=[
                ("num", StandardScaler(), num_cols),
                ("cat", OneHotEncoder(handle_unknown="ignore"), cat_cols),
            ],
            remainder="drop",
        )

        model = Pipeline(steps=[
            ("preprocess", preprocess),
            ("clf", LogisticRegression())
        ])
        
        model.fit(X, y)
        self.model = model
        print('model trained successfully')
        if save:
            self.save_model()

    def predict(self, data):
        model = joblib.load(self.model_name)
        input = pd.DataFrame([data])
        
        return make_json_safe(model.predict(input)[0])
    
    def get_insights(self, data, pred):
        insights = []
        violation_type = data.get("violation_type", "Unknown")

        prob = None
        try:
            model = joblib.load(self.model_name)
            X_in = pd.DataFrame([data])
            if hasattr(model, "predict_proba"):
                prob = float(model.predict_proba(X_in)[:, 1][0])
        except Exception:
            prob = None

        past_repeat = int(data.get("past_repeat_same_violation_count", 0))
        recent_same = int(data.get("recent_same_violation_count", 0))
        months_since = int(data.get("months_since_last_same_violation", 0))
        clean_streak = int(data.get("clean_streak_length", 0))
        ongoing = int(data.get("ongoing_same_violation_count", 0))

        insights.append(f"Violation type selected: {violation_type}.")

        if past_repeat > 0:
            insights.append(f"Student has repeated this violation before ({past_repeat} time(s)). This increases risk.")
        else:
            insights.append("No past repeats of the same violation were recorded, which generally reduces risk.")

        if recent_same > 0:
            insights.append(f"There were recent occurrences of the same violation ({recent_same}). Recency increases risk.")
        else:
            insights.append("No recent occurrences of the same violation were recorded, which lowers short-term risk.")

        if ongoing > 0:
            insights.append(f"Ongoing pattern detected (ongoing count = {ongoing}). This strongly increases risk.")
        else:
            insights.append("No ongoing pattern for the same violation is recorded.")

        if months_since <= 1:
            insights.append("The last same violation was very recent (≤ 1 month), which increases repeat risk.")
        elif months_since <= 3:
            insights.append("The last same violation was within 2–3 months, which indicates moderate risk.")
        else:
            insights.append("The last same violation was several months ago, which reduces repeat risk.")

        if clean_streak <= 1:
            insights.append("Clean streak is short (≤ 1), meaning improvement has not been sustained yet.")
        elif clean_streak <= 3:
            insights.append("Clean streak is moderate (2–3), indicating some improvement.")
        else:
            insights.append("Clean streak is long (≥ 4), indicating sustained improvement and reduced risk.")

        if prob is not None:
            verdict = "high" if prob >= 0.65 else ("moderate" if prob >= 0.45 else "low")
            insights.append(f"Model probability estimate: {prob:.4f} ({verdict} risk under the current threshold logic).")

        if int(pred) == 1:
            insights.append("Final decision: Student is flagged for early intervention (predicted repeat).")
        else:
            insights.append("Final decision: Student is not flagged (predicted not to repeat).")

        return insights

    def get_recommendation(self, data, pred):
        recommendations = []

        past_repeat = int(data.get("past_repeat_same_violation_count", 0))
        recent_same = int(data.get("recent_same_violation_count", 0))
        months_since = int(data.get("months_since_last_same_violation", 0))
        clean_streak = int(data.get("clean_streak_length", 0))
        ongoing = int(data.get("ongoing_same_violation_count", 0))

        if int(pred) == 1:
            recommendations.append("Schedule a brief check-in with the student within 24–72 hours.")
            recommendations.append("Review the student’s violation history and identify triggers/patterns.")
            recommendations.append("Notify relevant staff (advisor/counselor/discipline lead) for coordinated support.")

            if ongoing > 0 or recent_same > 0:
                recommendations.append("Since violations are recent/ongoing, implement a short-term monitoring plan (weekly follow-ups).")

            if past_repeat > 0:
                recommendations.append("Since the student has repeated before, create a targeted behavior contract with clear goals and check-ins.")

            if clean_streak <= 1 and months_since <= 1:
                recommendations.append("Risk is elevated due to short clean streak and recent history; intervene sooner and document actions.")
        else:
            recommendations.append("Continue routine monitoring—no immediate intervention required.")
            recommendations.append("Provide positive reinforcement and encourage maintaining a clean streak.")
            if clean_streak >= 3:
                recommendations.append("Recognize the sustained improvement (longer clean streak) to support continued positive behavior.")

        return recommendations
    
    def append(self, data):
        csv_path = f"./dataset/{self.file}.csv"
        self.df = pd.read_csv(csv_path)
        
        if not isinstance(data, dict):
            raise TypeError("data must be a dict")

        required = {
            "violation_type",
            "past_repeat_same_violation_count",
            "recent_same_violation_count",
            "months_since_last_same_violation",
            "clean_streak_length",
            "ongoing_same_violation_count",
        }
        missing = required - set(data.keys())
        if missing:
            raise ValueError(f"Missing required fields: {sorted(missing)}")

        cleaned = {}

        vt = data.get("violation_type")
        if vt is None:
            raise ValueError("violation_type cannot be None")
        vt = str(vt).strip()
        if vt == "":
            raise ValueError("violation_type cannot be empty")
        cleaned["violation_type"] = vt

        def to_int(val, field):
            try:
                if val is None or (isinstance(val, float) and np.isnan(val)):
                    return 0
                return int(float(val))
            except Exception:
                raise ValueError(f"{field} must be a number (int-like). Got: {val}")

        cleaned["past_repeat_same_violation_count"] = to_int(
            data.get("past_repeat_same_violation_count"), "past_repeat_same_violation_count"
        )
        cleaned["recent_same_violation_count"] = to_int(
            data.get("recent_same_violation_count"), "recent_same_violation_count"
        )
        cleaned["months_since_last_same_violation"] = to_int(
            data.get("months_since_last_same_violation"), "months_since_last_same_violation"
        )
        cleaned["clean_streak_length"] = to_int(
            data.get("clean_streak_length"), "clean_streak_length"
        )
        cleaned["ongoing_same_violation_count"] = to_int(
            data.get("ongoing_same_violation_count"), "ongoing_same_violation_count"
        )

        y = 0 if cleaned['past_repeat_same_violation_count'] < 2 else self.predict(data)
        
        cleaned["will_repeat_the_same_violation"] = y

        nonneg_fields = [
            "past_repeat_same_violation_count",
            "recent_same_violation_count",
            "months_since_last_same_violation",
            "clean_streak_length",
            "ongoing_same_violation_count",
        ]
        for f in nonneg_fields:
            if cleaned[f] < 0:
                raise ValueError(f"{f} must be >= 0")

        if cleaned["months_since_last_same_violation"] > 120:
            raise ValueError("months_since_last_same_violation seems too large (>120 months).")
        if cleaned["clean_streak_length"] > 120:
            raise ValueError("clean_streak_length seems too large (>120).")

        if cleaned["past_repeat_same_violation_count"] == 0 and cleaned["ongoing_same_violation_count"] > 2:
            raise ValueError("Inconsistent: past_repeat_same_violation_count is 0 but ongoing_same_violation_count is high.")

        new_row = pd.DataFrame([cleaned])
        self.df = pd.concat([self.df, new_row], ignore_index=True)

        self.df.to_csv(csv_path, index=False)
        self.df = pd.read_csv(csv_path)
        
    def save_model(self):
        joblib.dump(self.model, self.model_name)
        print('model has been updated')
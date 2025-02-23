import pickle as pkl
import xgboost as xgb
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app)

with open("XGBModel.pkl", "rb") as file:
    xgmodel = pkl.load(file)

encoded_cols = ["Brand", "Fuel_Type", "Transmission", "Model"]
encoders = {}

for item in encoded_cols:
    with open(f"{item}.pkl", "rb") as file:
        encoders[item] = pkl.load(file)

with open("Mileage_Scalar.pkl", "rb") as file:
    mileage_scaler = pkl.load(file)


def predict_price(
    brand: str,
    model: str,
    year: int,
    engine_size: float,
    fuel_type: str,
    transmission: str,
    mileage: float,
    doors: int,
    owner_count: int,
) -> float:
    brand_no = encoders["Brand"].transform([brand])[0]
    model_no = encoders["Model"].transform([model])[0]
    fuel_type_no = encoders["Fuel_Type"].transform([fuel_type])[0]
    transmission_no = encoders["Transmission"].transform([transmission])[0]
    mileage_scaled = mileage_scaler.transform([[mileage]])[0, 0]

    features = np.array(
        [
            brand_no,
            model_no,
            year,
            engine_size,
            fuel_type_no,
            transmission_no,
            mileage_scaled,
            doors,
            owner_count,
        ],
        dtype=np.float64,
    ).reshape(1, -1)
    print(f"{features=}")

    dmatrix = xgb.DMatrix(features)

    prediction = xgmodel.predict(dmatrix)

    return prediction[0]


print(predict_price("Kia", "Rio", 2020, 4.2, "Diesel", "Manual", 289944, 3, 5))


@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Get JSON data from the POST request
        data = request.get_json()
        print(data)

        # Extract features from the request
        brand = data["brand"]
        model = data["model"]
        year = data["year"]
        engine_size = data["engineSize"]
        fuel_type = data["fuelType"]
        transmission = data["transmission"]
        mileage = data["mileage"]
        doors = data["doors"]
        owner_count = data["ownerCount"]

        # Predict the price
        predicted_price = predict_price(
            brand,
            model,
            year,
            engine_size,
            fuel_type,
            transmission,
            mileage,
            doors,
            owner_count,
        )

        # Return the result as JSON
        return jsonify({"predicted_price": float(round(predicted_price))})

    except Exception as e:
        return jsonify({"error": str(e)}), 400


# Run the app
if __name__ == "__main__":
    app.run(debug=True)

import pickle as pkl

with open("XGBModel.pkl", "rb") as file:
    model = pkl.load(file)

encoded_cols = ["Brand", "Fuel_Type", "Transmission", "Model"]
encoders = {}

for item in encoded_cols:
    with open(f"{item}.pkl", "rb") as file:
        encoders[item] = pkl.load(file)

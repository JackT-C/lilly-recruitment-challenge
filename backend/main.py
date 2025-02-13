from fastapi import FastAPI, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import json
import os

"""
This module defines a FastAPI application for managing a list of medicines.
It provides endpoints to retrieve, create, update, and delete medicines stored in a JSON file.

Endpoints:
- GET /medicines: Retrieve all medicines from the data.json file.
- GET /medicines/{name}: Retrieve a single medicine by name from the data.json file.
- POST /create: Create a new medicine with a specified name and price.
- POST /update: Update the price of a medicine with a specified name.
- DELETE /delete: Delete a medicine with a specified name.
- GET /average: Calculate the average price of all medicines.

Functions:
- get_all_meds: Reads the data.json file and returns all medicines.
- get_single_med: Retrieves a medicine by name.
- create_med: Adds a new medicine and writes the updated data back to the file.
- update_med: Updates the price of a medicine and writes the updated data back to the file.
- delete_med: Removes a medicine and writes the updated data back to the file.
- average_price: Computes the average price of all medicines.
"""

# Initialize the FastAPI application
app = FastAPI()

# Enable Cross-Origin Resource Sharing (CORS) to allow frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (change this in production for security)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Define the data file path
DATA_FILE = "data.json"

# Ensure the JSON file exists with an initial empty structure
if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, "w") as f:
        json.dump({"medicines": []}, f)

@app.get("/medicines")
def get_all_meds():
    """
    Retrieve all medicines from the JSON file.
    Returns:
        dict: A dictionary containing all medicines stored in the data file.
    """
    try:
        with open(DATA_FILE, "r") as meds:
            data = json.load(meds)
        return data
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Error reading data.json")

@app.get("/medicines/{name}")
def get_single_med(name: str):
    """
    Retrieve a specific medicine by name.
    Args:
        name (str): The name of the medicine to retrieve.
    Returns:
        The medicine details if found, otherwise an error message.
    """
    try:
        with open(DATA_FILE, "r") as meds:
            data = json.load(meds)
            for med in data.get("medicines", []):
                if med['name'].lower() == name.lower():
                    return med
        return {"error": "Medicine not found"}
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Error reading data.json")

@app.post("/create")
def create_med(name: str = Form(...), price: float = Form(...)):
    """
    Create a new medicine entry.
    Args:
        name (str): The name of the medicine.
        price (float): The price of the medicine.
    Returns:
        Success message if created, or an error if medicine already exists.
    """
    try:
        with open(DATA_FILE, "r+") as meds:
            current_db = json.load(meds)

            if "medicines" not in current_db:
                current_db["medicines"] = []

            for med in current_db["medicines"]:
                if med['name'].lower() == name.lower():
                    return {"error": "Medicine already exists"}

            new_med = {"name": name, "price": price}
            current_db["medicines"].append(new_med)

            meds.seek(0)
            json.dump(current_db, meds, indent=4)
            meds.truncate()

        return {"message": f"Medicine '{name}' created successfully"}
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Error reading data.json")

@app.post("/update")
def update_med(name: str = Form(...), price: float = Form(...)):
    """
    Update the price of an existing medicine.
    Args:
        name (str): The name of the medicine to update.
        price (float): The new price.
    Returns:
        Success message if updated, or an error if the medicine was not found.
    """
    try:
        with open(DATA_FILE, "r+") as meds:
            current_db = json.load(meds)
            for med in current_db.get("medicines", []):
                if med['name'].lower() == name.lower():
                    med['price'] = price
                    meds.seek(0)
                    json.dump(current_db, meds, indent=4)
                    meds.truncate()
                    return {"message": f"Medicine '{name}' updated successfully"}
        return {"error": "Medicine not found"}
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Error reading data.json")

@app.delete("/delete")
def delete_med(name: str = Form(...)):
    """
    Delete a medicine by name.
    Args:
        name (str): The name of the medicine to delete.
    Returns:
        Success message if deleted, or an error if the medicine was not found.
    """
    try:
        with open(DATA_FILE, "r+") as meds:
            current_db = json.load(meds)
            for med in current_db.get("medicines", []):
                if med['name'].lower() == name.lower():
                    current_db["medicines"].remove(med)
                    meds.seek(0)
                    json.dump(current_db, meds, indent=4)
                    meds.truncate()
                    return {"message": f"Medicine '{name}' deleted successfully"}
        return {"error": "Medicine not found"}
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Error reading data.json")

@app.get("/average")
def average_price():
    """
    Calculate the average price of all medicines.
    Returns:
        The average price, or an error if no valid prices are found.
    """
    try:
        with open(DATA_FILE, "r") as meds:
            current_db = json.load(meds)
            medicines = current_db.get("medicines", [])
            if not medicines:
                return {"error": "No medicines found"}

            valid_prices = [med["price"] for med in medicines if isinstance(med.get("price"), (int, float))]
            if not valid_prices:
                return {"error": "No valid prices found"}

            avg_price = sum(valid_prices) / len(valid_prices)
            return {"average_price": round(avg_price, 2)}
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Error reading data.json")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
import json
from dotenv import load_dotenv
import os

load_dotenv()

CURVE_API = os.getenv("CURVE_API")
AAVE_API = os.getenv("AAVE_API")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],  
)

@app.get("/")
def base():
    return{
        "message" : "Server is up and running"
    } 

@app.get("/highest-apy")
def get_highest_apy():

    curve_url = CURVE_API
    curve_response = requests.get(curve_url)
    curve_data = curve_response.json()

    aave_url = AAVE_API
    aave_response = requests.get(aave_url)
    aave_data = aave_response.json()

    curve_apys = []
    for pool in curve_data['data']['poolList']:
        try:
            pool_name = pool['address']
            apy = pool['latestDailyApy']
            curve_apys.append({'protocol': 'Curve', 'pool': pool_name, 'apy': float(apy)})
        except KeyError:
            continue

    aave_apys = []
    for market in aave_data['reserves']:
        try:
            market_name = market['symbol']
            interest_rate_ray = market['interestPerSecond']
            interest_rate = float(interest_rate_ray) / 365
            aave_apy = (1 + interest_rate) ** 365 - 1
            aave_apys.append({'protocol': 'Aave', 'pool': market_name, 'apy': aave_apy})
        except KeyError:
            continue

    combined_apys = curve_apys + aave_apys
    highest_apy = max(combined_apys, key=lambda x: x['apy'])

    return {
        "protocol": highest_apy['protocol'],
        "pool": highest_apy['pool'],
        "apy": highest_apy['apy']
    }

def main(req, res):
    return app

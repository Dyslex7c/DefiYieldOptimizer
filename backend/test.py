from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import httpx
import os
from dotenv import load_dotenv
import asyncio

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
async def base():
    return {
        "message": "Server is up and running"
    }

async def fetch_curve_data():
    async with httpx.AsyncClient() as client:
        curve_response = await client.get(CURVE_API)
        return curve_response.json()

async def fetch_aave_data():
    async with httpx.AsyncClient() as client:
        aave_response = await client.get(AAVE_API)
        return aave_response.json()

@app.get("/highest-apy")
async def get_highest_apy():
    curve_data, aave_data = await asyncio.gather(
        fetch_curve_data(),
        fetch_aave_data()
    )

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

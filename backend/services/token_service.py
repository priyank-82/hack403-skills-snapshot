import httpx
import os

def get_lightcast_token():
    url = "https://auth.emsicloud.com/connect/token"
    client_id = os.getenv("LIGHTCAST_CLIENT_ID", "phoenix")
    client_secret = os.getenv("LIGHTCAST_CLIENT_SECRET", "enter_client_secret_here")
    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {
        "client_id": client_id,
        "client_secret": client_secret,
        "grant_type": "client_credentials",
        "scope": "postings:us"
    }
    try:
        response = httpx.post(url, data=data, headers=headers)
        response.raise_for_status()
        return response.json()
    except httpx.HTTPStatusError as e:
        return {"error": str(e), "details": e.response.text}
    except Exception as e:
        return {"error": str(e)} 
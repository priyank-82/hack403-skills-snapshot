from typing import List

def fetch_competitor_skills_from_go(competition_list: List[str]) -> dict:
    """
    Helper to call the Go server's /getCompetitorsSkills endpoint.
    """
    url = "http://3.215.73.45:8009/getCompetitorsSkills"
    headers = {
        "accept": "application/json",
        "Content-Type": "application/json"
    }
    import requests
    payload = {"competitors": competition_list}
    response = requests.post(url, headers=headers, json=payload, timeout=30)
    response.raise_for_status()
    return response.json()

    
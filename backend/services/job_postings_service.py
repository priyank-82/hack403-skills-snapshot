import httpx
from .token_service import get_lightcast_token
from typing import Optional
import json
import requests
import os
POSTINGS_URL = "https://emsiservices.com/jpa/postings"

DATA_DIR = "data"

with open(os.path.join(DATA_DIR,'all_courses_skills/degree_course_skills.json'), 'r', encoding='utf-8') as file:
    degree_course_skills = json.load(file)

degree_courses_set = set(degree_course_skills.keys())
skill_names_lower = [skill.lower() for skill in list(degree_course_skills.keys())]
acutal_skill_names = [skill for skill in list(degree_course_skills.keys())]

with open(os.path.join(DATA_DIR,'all_courses_skills/pd_skills_alias.json'), 'r', encoding='utf-8') as file:
    pd_course_skills = json.load(file)

pd_courses_set = set(pd_course_skills.keys())
pd_skill_names_lower = [skill.lower() for skill in list(pd_course_skills.keys())]
pd_acutal_skill_names = [skill for skill in list(pd_course_skills.keys())]

DEFAULT_REQUEST_BODY = {
    "filter": {
        "when": {
            "start": "2025-05",
            "end": "2025-07"
        },
        "employment_type_name": [
            "Full-time (> 32 hours)"
        ],
        "company_name": []  # Will be set dynamically
    },
    "fields": [
        "id",
        "posted",
        "expired",
        "body",
        "city_name",
        "company_name",
        "title_raw",
        "url",
        "active_urls",
        "score"
    ],
    "order": [
        "score"
    ],
    "limit": 100
}

def get_job_postings(company_name: str, token: Optional[str] = None):
    if not company_name:
        return {"error": "company_name is required"}
    if not token:
        token_response = get_lightcast_token()
        token = token_response.get("access_token")
        if not token:
            return {"error": "Could not retrieve Lightcast token", "details": token_response}
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    request_body = DEFAULT_REQUEST_BODY.copy()
    request_body["filter"] = request_body["filter"].copy()
    request_body["filter"]["company_name"] = [company_name]
    try:
        response = httpx.post(POSTINGS_URL, json=request_body, headers=headers)
        response.raise_for_status()
        return response.json()
    except httpx.HTTPStatusError as e:
        return {"error": str(e), "details": e.response.text}
    except Exception as e:
        return {"error": str(e)} 

def process_jobs(job_postings):
    #active_postings = [i for i in job_postings['postings'] if i.get('expired') is None]
    active_postings = [i for i in job_postings['postings']]
    #skill scrape

    skill_scrape_url = "https://staging-ai.skillmore.cloud/skill_scraper"

    analysis_dict = {}
    analysis_dict["skills"] = {}
    unique_job_postings_evaluated = 0
    unique_skills_discovered = 0
    total_skills_encountered = 0
    print(len(active_postings))
    for post in active_postings:
        unique_job_postings_evaluated += 1
        print(post['id'])
        job_desc = post['body']
        payload = {"text":job_desc}
        #print(job_desc)
        response = requests.post(skill_scrape_url, json=payload)
        if response.status_code == 200:
            skills_scraped = json.loads(response.text)
            for skill in skills_scraped:
                skill_name = skill['skill_name']
                total_skills_encountered += 1
                if skill_name in degree_courses_set or skill_name in pd_courses_set:
                    if skill_name in analysis_dict["skills"]:
                        analysis_dict["skills"][skill_name] += 1
                    else:
                        unique_skills_discovered += 1
                        analysis_dict["skills"][skill_name] = 1

    analysis_dict['unique_job_postings_evaluated'] = unique_job_postings_evaluated
    analysis_dict['unique_skills_discovered'] = unique_skills_discovered
    analysis_dict['average_skills_per_job_description'] = int(total_skills_encountered/unique_job_postings_evaluated)
    analysis_dict["skills"] = dict(sorted(analysis_dict["skills"].items(), key=lambda item: item[1],reverse=True))
    return analysis_dict

def skill_course_map(company_skills):
    company_skills = company_skills['skills']
    company_skills = list(company_skills.items())[:10]
    mapped_courses = {}
    for skill,freq in company_skills:
        skill_lower = skill.lower()
        valid_degree_courses = []
        valid_pd_courses = []
        for skill_idx in range(len(skill_names_lower)):
            if skill_lower in skill_names_lower[skill_idx]:
                for course in degree_course_skills[acutal_skill_names[skill_idx]]:
                    valid_degree_courses.append(course)

        for skill_idx in range(len(pd_skill_names_lower)):
            if skill_lower in pd_skill_names_lower[skill_idx]:
                for course in pd_course_skills[pd_acutal_skill_names[skill_idx]]:
                    valid_pd_courses.append(course)
        if valid_pd_courses and not valid_degree_courses:
            mapped_courses[skill] = {'total_degree_courses':0,'pd_courses':valid_pd_courses,'total_pd_courses':len(valid_pd_courses)}
        elif not valid_pd_courses and valid_degree_courses:
            mapped_courses[skill] = {'degree_courses':valid_degree_courses,'total_degree_courses':len(valid_degree_courses),'pd_courses':0}
        else:
            mapped_courses[skill] = {'degree_courses':valid_degree_courses,'total_degree_courses':len(valid_degree_courses),'pd_courses':valid_pd_courses,'total_pd_courses':len(valid_pd_courses)}

    return mapped_courses

import os
from fastapi import FastAPI, HTTPException, Query, Body, Request
from fastapi.responses import JSONResponse, FileResponse
from typing import Optional, List
import json
import requests
import csv
import tempfile
import io
from pydantic import BaseModel
from services.groq_service import chat_with_groq

# Import local functions (update the import paths if needed)
from services.token_service import get_lightcast_token
from services.job_postings_service import get_job_postings, process_jobs, skill_course_map
from services.compeditor_analysis import fetch_competitor_skills_from_go
DATA_DIR = "data"

def get_company_filename(company_name: str) -> str:
    return company_name.lower().replace(" ", "-")

if os.environ.get("DEBUGPY", "0") == "1":
    import debugpy
    debugpy.listen(("0.0.0.0", 5678))
    print("⏳ Waiting for debugger attach on 0.0.0.0:5678 ...")
    debugpy.wait_for_client()

app = FastAPI(title="Skillmore Backend API", description="API for Skillmore services including Lightcast token retrieval.")

# --- CORS middleware for hackathon: allow all origins, methods, and headers ---
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Skillmore Backend API"}

@app.get("/lightcast/token", response_class=JSONResponse)
def fetch_lightcast_token():
    token = get_lightcast_token()
    return token

@app.get("/job-postings", response_class=JSONResponse)
def fetch_job_postings(company_name: str = Query(..., description="Company name to filter job postings"), Authorization: Optional[str] = None):
    posting_file_path = os.path.join(DATA_DIR, get_company_filename(company_name) + '/' + get_company_filename(company_name) + '_postings.json')
    
    if os.path.exists(posting_file_path):
        with open(posting_file_path, "r") as f:
            return JSONResponse(content=json.load(f)) 

    company_folder = os.path.join(DATA_DIR, get_company_filename(company_name))
    if not os.path.exists(company_folder):
            os.makedirs(company_folder)

    token: Optional[str] = None
    if Authorization and Authorization.startswith("Bearer "):
        token = Authorization.split(" ", 1)[1]
    result = get_job_postings(company_name, token)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result)
    else:
        with open(posting_file_path, "w") as json_file:
            json.dump(result, json_file, indent=4)
    return result

@app.get("/scrape-job-skills", response_class=JSONResponse)
def scrape_job_postings(company_name: str = Query(..., description="Company name to scrape job postings for")):
    posting_file_path = os.path.join(DATA_DIR, get_company_filename(company_name) + '/' + get_company_filename(company_name) + '_postings.json')
    
    if os.path.exists(posting_file_path):
        with open(posting_file_path, "r") as f:
            result = json.load(f)  
    else:
        result = fetch_job_postings(company_name)    

    if "error" in result:
        raise HTTPException(status_code=400, detail=result)
    
    skills_analysis_path = os.path.join(DATA_DIR, get_company_filename(company_name) + '/' + get_company_filename(company_name) + '_skills.json')
    if os.path.exists(skills_analysis_path):
        with open(skills_analysis_path, "r") as f:
            return json.load(f)  

    # Process successful job data to extract skills
    if "data" in result and "postings" in result["data"]:
        try:
            # Pass the entire result data to extract_skills_from_job_data
            skills_dict = process_jobs(result["data"])
            final = {
                "company_name": company_name,
                "skills": skills_dict, 
                "total_postings": len(result["data"]["postings"])
            }
            with open(skills_analysis_path, "w") as json_file:
                json.dump(final, json_file, indent=4)
            return final
        except Exception as e:
            raise HTTPException(status_code=400, detail={"error": str(e), "original": result})
    
    return {"error": "No job postings found"} 

@app.get("/course-skill-mapping", response_class=JSONResponse)
def course_skill_mapping(company_name: str = Query(..., description="Company name to filter job postings"), Authorization: Optional[str] = None):
    course_skill_mapping_path = os.path.join(DATA_DIR,get_company_filename(company_name) + '/' + get_company_filename(company_name) + '_mapped.json')
    if os.path.exists(course_skill_mapping_path):
        with open(course_skill_mapping_path, "r") as f:
            return json.load(f) 

    else:
        company_skills = scrape_job_postings(company_name) 
        company_skills = company_skills['skills']
        
        result = skill_course_map(company_skills)
        if "error" in result:
            raise HTTPException(status_code=400, detail=result)
        else:
            with open(course_skill_mapping_path, "w") as json_file:
                json.dump(result, json_file, indent=4)
        return result

@app.get("/download-skills-csv", response_class=FileResponse)
def download_skills_csv(company_name: str = Query(..., description="Company name to scrape job postings for")):
    """
    Download skills data as a CSV file
    """
    result = get_job_postings(company_name)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result)
    
    # Process successful job data to extract skills
    if "data" in result and "postings" in result["data"]:
        try:
            # Get skills data
            skills_data = process_jobs(result["data"])
            
            # Create CSV content
            csv_content = io.StringIO()
            csv_writer = csv.writer(csv_content)
            
            # Write header
            csv_writer.writerow(["Skill Name", "Frequency"])
            
            # Write skills data
            for skill_name, frequency in skills_data["skills"].items():
                csv_writer.writerow([skill_name, frequency])
            
            # Create temporary file
            temp_file = tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.csv')
            temp_file.write(csv_content.getvalue())
            temp_file.close()
            
            # Return file response
            return FileResponse(
                path=temp_file.name,
                filename=f"{company_name}_skills.csv",
                media_type="text/csv"
            )
            
        except Exception as e:
            raise HTTPException(status_code=400, detail={"error": str(e), "original": result})
    
    return {"error": "No job postings found"} 
@app.post("/getCompetitionListSkill", response_class=JSONResponse)
def get_competition_list_skill(
    current_company: str = Body(..., embed=True, description="The current company name "),
    competition_list: List[str] = Body(..., embed=True, description="List of competitor companies")
):
    """
    Get competitor skills analysis by calling the Go server's competitor skills endpoint.
    """
    try:
        print("Fetching competitor skills from Go server")
        result = fetch_competitor_skills_from_go(competition_list)
        
        # Parse the output string into JSON if it exists
        if "output" in result and isinstance(result["output"], str):
            try:
                result["output"] = json.loads(result["output"])
            except json.JSONDecodeError as e:
                print(f"Failed to parse output JSON: {e}")
                # Keep the original string if parsing fails
        
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail={"error": str(e)})

class GroqChatRequest(BaseModel):
    messages: list
    
GROQ_API_KEY = "enter_groq_api_key_here"  # Replace with your actual Groq API key
@app.post("/groq/chat")
  
async def groq_chat(request: Request):
    prompt = await request.body()
    prompt = prompt.decode("utf-8")
    messages = [{"role": "user", "content": prompt}]
    try:
        reply = chat_with_groq(messages)
        return {"reply": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 
    
print(f"GROQ_API_KEY: {GROQ_API_KEY}")

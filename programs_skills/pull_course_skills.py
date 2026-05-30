import json

# Load the JSON data from a file
with open("b.json") as file:
    data = json.load(file)

async def skillmoreToken():
    

# Iterate over each object in the array
programs = []
for obj in data:
    name = obj.get("name")
    program = obj.get("program")
    program_info = obj.get("requirementInfo")

    program_version = obj.get("programVersion")

    programs.append(
        {
            "name": name,
            "program": program,
            "program_info": program_info,
            "program_version": program_version,
        }
    )
  
    # course_skills = obj.get("courseSkills", [])

    # # Extract the skill names
    # skill_names = [skill.get("skillName") for skill in course_skills]

for program in programs:
    print(program.get("program_info"))


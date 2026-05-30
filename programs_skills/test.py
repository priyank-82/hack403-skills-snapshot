import json

with open("altice.json", "r") as f:
    x = json.load(f)

y = {s["skill_name"].lower() for s in x["skills"]}

with open("b.json", "r") as f:
    z = json.load(f)


def func1(a, b):
    c = set(skill.lower() for skill in a) & b
    return list(c)


for p in z:
    n = p.get("name")
    c = p.get("program")
    v = p.get("programVersion")

    s = [skill["skillName"] for skill in p.get("courseSkills", [])]

    m = func1(s, y)

    print(f"Program: {n} ({c} {v})")
    print(f"Total Skills: {len(s)}")
    print(f"Matching Altice Skills: {len(m)}")
    print("Matching Skills:", ", ".join(m))
    print("---")

all_m = set()
for p in z:
    s = [skill["skillName"] for skill in p.get("courseSkills", [])]
    all_m.update(func1(s, y))

print(f"Total unique Altice skills found across all programs: {len(all_m)}")
print("These skills are:", ", ".join(all_m))

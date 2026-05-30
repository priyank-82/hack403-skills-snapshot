from fastapi import FastAPI
from fastapi.responses import JSONResponse
import subprocess

app = FastAPI()

@app.get("/run_test")
def run_test():
    result = subprocess.run([
        "python3", "test.py"
    ], capture_output=True, text=True)
    return JSONResponse({
        "stdout": result.stdout,
        "stderr": result.stderr,
        "returncode": result.returncode
    })

@app.get("/run_gaps")
def run_gaps():
    result = subprocess.run([
        "python3", "gaps.py"
    ], capture_output=True, text=True)
    return JSONResponse({
        "stdout": result.stdout,
        "stderr": result.stderr,
        "returncode": result.returncode
    }) 
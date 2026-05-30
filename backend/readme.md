# Skillmore FastAPI Backend

This backend provides APIs for interacting with Lightcast (EMSI) services, including fetching authentication tokens and retrieving job postings for a given company.

## Features
- **Swagger/OpenAPI documentation** at `/docs`
- **Get Lightcast token** (`/lightcast/token`)
- **Get job postings by company** (`/job-postings?company_name=...`)

---

## Setup

### 1. Local Python (venv) Setup

1. **Clone the repository** and navigate to the project directory.
2. **Create and activate a virtual environment:**
   ```sh
   python3 -m venv venv
   source venv/bin/activate
   ```
3. **Install dependencies:**
   ```sh
   pip install -r requirements.txt
   ```
4. **(Optional) Set environment variables for Lightcast credentials:**
   - `LIGHTCAST_CLIENT_ID` (default: `phoenix`)
   - `LIGHTCAST_CLIENT_SECRET` (default: `Ligcast Secret`)
5. **Run the FastAPI server:**
   ```sh
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

---

### 2. Docker Installation & Usage

#### **Install Docker**

- **Mac (Homebrew):**
  ```sh
  brew install --cask docker
  open /Applications/Docker.app
  ```


#### **Build and Run the Container**
1. **Build the Docker image:**
   ```sh
   docker build -t skillmorebackend .
   ```
2. **Run the container:**
   ```sh
   docker run -p 8000:8000 skillmorebackend
   ```
3. **Access the API:**
   - Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
   - Root endpoint: [http://localhost:8000/](http://localhost:8000/)

---

## API Endpoints

### 1. Root
- **GET /**
- Returns a welcome message.

### 2. Get Lightcast Token
- **GET /lightcast/token**
- Fetches a Lightcast (EMSI) access token using client credentials.
- **Response:**
  ```json
  {
    "access_token": "...",
    "token_type": "Bearer",
    ...
  }
  ```

### 3. Get Job Postings
- **GET /job-postings?company_name=COMPANY**
- Retrieves job postings for the specified company (e.g., Amazon, Apple, PepsiCo).
- **Query Parameters:**
  - `company_name` (required): Name of the company to filter job postings.
- **Headers (optional):**
  - `Authorization: Bearer <token>` (if not provided, the backend fetches a token automatically)
- **Response:**
  - JSON list of job postings with fields: id, posted, expired, body, city_name, company_name, title_raw, url, active_urls, score.

---

## Development
- Hot-reload is enabled with `--reload` flag.
- API docs available at [http://localhost:8000/docs](http://localhost:8000/docs)

---

## License
MIT

---

## Debugging with Docker and VSCode/Cursor

You can debug the FastAPI backend running in Docker using debugpy. This allows you to set breakpoints and inspect code live from your IDE.

### 1. Build and Run in Debug Mode

Use the provided `docker-compose.debug.yml` to start the container with debugpy enabled:

```sh
cd skillmorebackend
docker-compose -f docker-compose.debug.yml up --build
```

The app will start and wait for a debugger to attach on port 5678.

### 2. Add Debug Configuration in VSCode/Cursor

Add the following to your `.vscode/launch.json`:

```json
{
    "name": "Python: Remote Attach",
    "type": "python",
    "request": "attach",
    "connect": {
      "host": "localhost",
      "port": 5678
    }
}
```

### 3. Attach the Debugger

- Open the Run & Debug panel in your IDE.
- Select **Python: Remote Attach**.
- Click the green play (Start Debugging) button.
- The app will continue past the `debugpy.wait_for_client()` line and you can set breakpoints as usual.

### 4. Access the API

- [http://localhost:8000/](http://localhost:8000/)
- [http://localhost:8000/docs](http://localhost:8000/docs)

---

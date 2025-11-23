## Running the Project with Docker

This project provides Dockerfiles for both the backend (Python) and frontend (TypeScript/Next.js) applications, along with a `docker-compose.yml` for easy orchestration.

### Requirements

- **Backend:** Python 3.13 (slim image)
- **Frontend:** Node.js 22.13.1 (slim image)

### Build and Run Instructions

1. Ensure Docker and Docker Compose are installed on your system.
2. From the project root directory (where `docker-compose.yml` is located), run:
   ```bash
   docker compose up --build
   ```
   This will build and start both services.

### Services and Ports

- **typescript-frontend**
  - Runs the Next.js frontend
  - Exposes port **3000** (accessible at `http://localhost:3000`)
- **python-back-end**
  - Runs the Python backend
  - No ports are exposed by default. If you need to access an API, uncomment and set the `ports:` section in `docker-compose.yml` (e.g., `8000:8000`).

### Environment Variables

- No environment variables are required by default. If you need to set any, create a `.env` file in the respective service directory and uncomment the `env_file` line in `docker-compose.yml`.

### Special Configuration

- The backend uses a SQLite database file (`OurTeamDB.db`). If you want to persist changes outside the container, uncomment the `volumes:` line for the backend in `docker-compose.yml`.
- The frontend depends on the backend service. Ensure the backend is running if the frontend requires API access.

### Notes

- All dependencies are installed and managed within the containers; no need to install Python or Node.js locally.
- For development, you may want to mount source code as volumes and expose additional ports as needed.

Refer to the provided Dockerfiles and `docker-compose.yml` for further customization.

## Development start

Run from `./Back-end` (windows):

```powershell
venv\Scripts\activate
pip install -r requirements.txt
python ./app1/app.py
```

run from `./frontend`:

```powershell
npm install
npm run dev
```

## Зеркало репозитория:

На github наша работа будет продолжаться и после контеста:
https://github.com/AlbionVisual/T-Bank-Hakaton/tree/solution

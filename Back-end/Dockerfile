# syntax=docker/dockerfile:1

FROM python:3.13-slim AS base
WORKDIR /app

# Builder stage: install dependencies in a venv
FROM base AS builder
# Copy only requirements.txt first for better caching
COPY --link requirements.txt ./
# Create virtual environment and install dependencies using pip cache
RUN --mount=type=cache,target=/root/.cache/pip \
    python -m venv .venv \
    && .venv/bin/pip install --upgrade pip \
    && .venv/bin/pip install -r requirements.txt

# Copy application code (excluding venv, .git, etc.)
COPY --link app1 ./app1
COPY --link OurTeamDB.db ./OurTeamDB.db
COPY --link run.py ./run.py

# Final stage: minimal image with venv and app code
FROM base AS final
WORKDIR /app
# Create non-root user
RUN useradd -m appuser
USER appuser

# Copy venv from builder
COPY --from=builder /app/.venv /app/.venv
# Copy app code from builder
COPY --from=builder /app/app1 ./app1
COPY --from=builder /app/OurTeamDB.db ./OurTeamDB.db
COPY --from=builder /app/run.py ./run.py

ENV PATH="/app/.venv/bin:$PATH"

# Default command (adjust as needed)
CMD ["python", "run.py"]

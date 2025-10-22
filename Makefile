.PHONY: dev backend frontend install clean test

install:
	python3 -m venv .venv || true
	. .venv/bin/activate && pip install -r backend/requirements.txt
	cd frontend && npm install

backend:
	. .venv/bin/activate && uvicorn backend.app.main:app --reload --host $${API_HOST:-127.0.0.1} --port $${API_PORT:-8000}

frontend:
	cd frontend && npm run dev

# Run both backend and frontend (simple bash runner)
dev:
	bash scripts/dev.sh

test:
	. .venv/bin/activate && pytest -q backend/tests

clean:
	rm -rf .venv backend/app.db backend/__pycache__ backend/.pytest_cache frontend/node_modules frontend/dist

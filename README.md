# UniBoard Student Housing Platform

This repository contains the current `api/` and `web/` implementations for UniBoard.

## 🚀 Local Development

### Prerequisites
- Node.js 18+ installed
- MySQL or compatible database for `api/` (default MySQL)

### Install packages
```bash
cd api
npm install
cd ../web
npm install
```

### Start the backend API
```bash
cd api
npm run dev
```
The API will run on `http://localhost:5000`.

### Start the frontend web app
```bash
cd web
npm run dev
```
The UI will run on `http://localhost:5173` and proxy API calls to the backend.

### Smoke test
- API health: `http://localhost:5000/api/health`
- Web app: `http://localhost:5173`

## 🧪 Tests

### API integration tests
```bash
cd api
npm test
```

### Frontend tests
```bash
cd web
npm test
```

## 📦 Build

### Build backend
```bash
cd api
npm run build
```

### Build frontend
```bash
cd web
npm run build
```

## 📁 Project Structure

```
uniboard-student-housing-platform/
├── api/           # Express + Sequelize API
├── web/           # Vite + React frontend
├── package.json   # root scripts / workspace helper
└── README.md      # this file
```

## Useful root commands

From the repository root:
```bash
npm run dev:api      # Start API dev server
npm run dev:web      # Start web dev server
npm run dev:new      # Start both API and web together
```

## Notes
- The frontend proxy in `web/vite.config.ts` forwards `/api` requests to `http://localhost:5000`.
- `api/src/server.ts` is the runtime entrypoint for development.
- `api/src/tests/` contains a lightweight backend integration test.
- `web/src/tests/` contains a simple React render test.

## License
MIT

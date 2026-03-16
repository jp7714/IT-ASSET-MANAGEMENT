# API Services (Week 1 Day 1 Notes)

Welcome to the `services` folder! As we set up the Project Foundation today, here are some key lessons.

## 1. Why is the `services` folder important for separating API logic?
In Vue, components should focus purely on the UI (presentation logic and user interaction). By moving data-fetching logic to a dedicated `services` directory, we separate our concerns. This makes the codebase cleaner, easier to test without a UI, and simpler to debug. If our API changes, we only need to update the logic here instead of inside multiple Vue files.

## 2. Setting up the Mock Backend (JSON Server)
To mock an API before our real backend is ready, we use JSON Server.

**How to install:**
```bash
npm install -g json-server
```

**How to run it:**
```bash
json-server --watch db.json --port 3000
```

**What it does:**
This automatically reads the `db.json` file on the root of our project and creates full REST endpoints based on its keys:
- `GET /assets`
- `GET /categories`
- `GET /assignments`
(It also supports POST, PUT, DELETE for those endpoints automatically!)

## 3. Using Axios
We installed Axios today (`npm install axios`).

**Why Axios instead of native Fetch?**
While `fetch()` is built into the browser, Axios gives us powerful features out of the box:
- It automatically parses JSON responses (no more `res.json()`).
- It automatically stringifies data we send.
- Better error handling (rejects the promise for 4xx/5xx HTTP errors).
- Easy setup for global defaults like headers and base URLs.

## 4. Why Service Functions Improve Code Maintainability
By exporting atomic API functions (e.g., `getAssets()`, `addAsset()`), we encapsulate the Axios call. Any component can just import this function and call it. If we later switch to a different API client, or our backend URLs change to `/api/v1/assets`, we literally only update one line of code in the service file—and every single component using it will automatically work!

# IT Asset Management System

A modern, responsive IT Asset Management System built with Vue 3 to manage office equipment, track assignments, and maintain hardware inventory seamlessly.

## Features

- **Dashboard Analytics**: Real-time insights, statistics tags, and visual recent activity tracking.
- **Asset Management**: Complete CRUD operations for adding, editing, and deleting company assets.
- **Category Management**: Organize assets into custom functional groups with unique categories.
- **Employee Assignment**: Effectively track which employee holds which asset, including assignment history.
- **Advanced Filtering & Pagination**: Easily search assets by name, filter by category and status, and paginate efficiently.
- **Validation & Error Handling**: Comprehensive form validations, unique checks, and robust API error catch implementations.
- **Clean UI & UX**: Features an elegant interface with intuitive states, animations, loading indicators, toast notifications, and empty-state placeholders.

## Technologies Used

- **Frontend Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **Routing**: Vue Router
- **HTTP Client**: Axios
- **Iconography**: Lucide Vue Next
- **Styling**: Vanilla CSS with modern custom variables, Flexbox/Grid, responsive queries.
- *(Mock Backend)*: Uses JSON Server locally for realistic API simulations.

## How to Run the Project

1. **Install Dependencies**
   Open a terminal in the project directory and run:
   ```sh
   npm install
   ```

2. **Start the Mock API server & Vue Application**
   While in this project, if you're using `json-server` (assuming the `db.json` API port runs locally or through concurrently), run:
   ```sh
   # (Optionally run the JSON server if not part of package script)
   # npx json-server --watch db.json --port 3000
   ```
   
   Start the frontend server:
   ```sh
   npm run dev
   ```

3. **Explore the System**
   Navigate to the local dev URL (usually `http://localhost:5173`) in your browser to interact with the system!

## How to Build for Production

```sh
npm run build
```
This prepares static, minified assets located inside the `dist` directory.

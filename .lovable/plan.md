
# Virtual Library Manager — Implementation Plan

## Design Direction
Modern & bold visual style with strong typography, vibrant accent colors, and a contemporary feel. Clean card-based layouts with confident color choices.

## Pages & Features

### 1. Authentication Flow
- On app load, silently call `GET <BACKEND_URL>/check-session` to verify the session
- If unauthenticated, redirect the user to the backend's login route
- If authenticated, store the returned token in memory for API calls
- Backend URL will be a configurable constant (placeholder for now)

### 2. Dashboard (Home Page)
- Grid layout displaying saved books as cards (cover image, title, author, status badge)
- Filter tabs at the top: **All**, **Want to Read**, **Bought**, **Read**, **Lent**
- Each card is clickable to open a status management modal
- Empty state with a prompt to search and add books
- Delete option on each book card

### 3. Search & Add Books
- Prominent search bar (accessible from the dashboard header)
- Queries the Google Books API (keyless public access)
- Results displayed as a list/grid with cover thumbnail, title, and author(s)
- "Add to Library" button on each result that saves the book with a default status of "Want to Read"
- Toast notification on successful add

### 4. Book Detail / Status Modal
- Opens when clicking a book card on the dashboard
- Displays book cover, title, and authors
- Dropdown to change status: Want to Read → Bought → Read → Lent
- When "Lent" is selected, a text input appears to record the borrower's name
- Save and Delete actions with confirmation

### 5. API Integration Layer
- Centralized API service module with the configurable backend URL
- All requests include `Authorization: Bearer <token>` header
- Endpoints wired up:
  - `GET /api/app-library/books` — fetch library
  - `POST /api/app-library/books` — save book
  - `PUT /api/app-library/books/:bookId` — update status/lentTo
  - `DELETE /api/app-library/books/:bookId` — remove book
- Google Books search: `GET googleapis.com/books/v1/volumes?q=<query>`
- React Query used for data fetching, caching, and mutations

### 6. Layout & Navigation
- Top navigation bar with app title and search input
- Responsive design — works on desktop and mobile
- No sidebar needed; single-page feel with modal interactions
